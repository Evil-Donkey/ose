import { unstable_cache } from 'next/cache';

const isServer = typeof window === 'undefined';

const API_URL = isServer
  ? process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT
  : '/api/graphql';

// Server gets more headroom because the FlexibleContent query is huge
// (30+ ACF component types deeply nested). When WP is cold or under load,
// 15s wasn't enough — responses arrived in 18-25s and we aborted them,
// returning null and rendering an empty #smooth-content.
//
// Local stacks (e.g. MAMP) often answer much slower than production, so
// development uses a higher default. Override with WORDPRESS_FETCH_SERVER_TIMEOUT_MS
// (milliseconds, 5000–180000) if you still see AbortError timeouts locally.
function readServerTimeoutMs() {
  const override = process.env.WORDPRESS_FETCH_SERVER_TIMEOUT_MS;
  if (override !== undefined && override !== '') {
    const n = Number.parseInt(String(override), 10);
    if (Number.isFinite(n) && n >= 5000 && n <= 180_000) return n;
  }
  return process.env.NODE_ENV === 'development' ? 60_000 : 30_000;
}

const SERVER_TIMEOUT_MS = readServerTimeoutMs();
const CLIENT_TIMEOUT_MS = 20000;

// Default cache lifetime for successful CMS responses. Longer means a single
// good fetch carries us further before the next revalidation roll of the dice.
const DEFAULT_REVALIDATE_SECONDS = 600;

// Many managed WordPress hosts / WAFs (Cloudflare, Sucuri, WP Engine,
// Pantheon, Kinsta) block default Node fetch requests because they arrive
// without a recognisable User-Agent. Giving the CMS a stable, descriptive
// UA dramatically reduces spurious 403 Forbidden responses.
const SERVER_USER_AGENT = 'OSE-NextJS/1.0 (+server-render)';

// The Next.js origin that WordPress's Headless Login Access Control list
// must allow-list. We send Origin on server GraphQL so the CMS accepts
// server-to-server preview calls.
//
// On Vercel Preview/Production, NODE_ENV is "production". If NEXT_PUBLIC_SITE_URL
// is missing from the deployment env, Headless Login often 403s without Origin.
// VERCEL_URL is always set by Vercel (hostname only, no scheme).
function resolveServerOrigin() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit && String(explicit).trim()) {
    return String(explicit).trim().replace(/\/+$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  const vercelHost = process.env.VERCEL_URL;
  if (vercelHost && String(vercelHost).trim()) {
    const host = String(vercelHost).trim().replace(/\/+$/, "");
    return host.startsWith("http://") || host.startsWith("https://")
      ? host
      : `https://${host}`;
  }
  return null;
}

const SERVER_ORIGIN = resolveServerOrigin();

// Status codes that are worth retrying once — transient WAF blocks, upstream
// timeouts and rate-limiting. We do NOT retry on 4xx that look permanent
// (400/401/404/422) because they'll fail the same way every time.
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504, 403]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// wp-graphql-headless-login: auth-token refresh flow
// ---------------------------------------------------------------------------
// The long-lived refreshToken in WORDPRESS_AUTH_REFRESH_TOKEN (~1 year by
// default) cannot be sent directly as a Bearer — WPGraphQL only accepts the
// short-lived authToken (~5 minutes) for request authentication. We exchange
// the refresh token for a fresh authToken via the `refreshToken` mutation,
// cache it in memory until just before it expires, and dedupe concurrent
// refreshes so parallel preview requests don't stampede the CMS.
const REFRESH_MUTATION = `
  mutation RefreshAuthToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) { authToken authTokenExpiration success }
  }
`;

let cachedAuthToken = null;
let cachedAuthTokenExpiresAt = 0; // unix ms
let inflightRefresh = null;

function decodeJwtExpiry(jwt) {
  try {
    const payload = jwt.split('.')[1];
    if (!payload) return 0;
    const json = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    return typeof json?.exp === 'number' ? json.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function refreshAuthToken() {
  const refreshToken = process.env.WORDPRESS_AUTH_REFRESH_TOKEN;
  if (!refreshToken) {
    console.error(
      '[preview auth] WORDPRESS_AUTH_REFRESH_TOKEN is unset — preview GraphQL will fail. ' +
      'On Vercel, enable this variable for Preview (not only Production).'
    );
    return null;
  }

  const reqHeaders = {
    'Content-Type': 'application/json',
    'User-Agent': SERVER_USER_AGENT,
  };
  if (SERVER_ORIGIN) {
    reqHeaders['Origin'] = SERVER_ORIGIN;
    reqHeaders['Referer'] = SERVER_ORIGIN;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify({
        query: REFRESH_MUTATION,
        variables: { input: { refreshToken } },
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`[preview auth] refresh request ${res.status} ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    if (json?.errors?.length) {
      console.error(
        '[preview auth] refresh GraphQL errors: ' +
        json.errors.map(e => e.message).join(' | ')
      );
      return null;
    }

    const authToken = json?.data?.refreshToken?.authToken;
    if (!authToken) {
      console.error('[preview auth] refresh returned no authToken — check WORDPRESS_AUTH_REFRESH_TOKEN');
      return null;
    }

    const expFromJwt = decodeJwtExpiry(authToken);
    // Expire 30s before the real expiry so we never send a just-expired token.
    cachedAuthTokenExpiresAt = expFromJwt
      ? expFromJwt - 30_000
      : Date.now() + 4 * 60 * 1000; // safe 4 min fallback
    cachedAuthToken = authToken;
    return authToken;
  } catch (err) {
    console.error('[preview auth] refresh threw:', err);
    return null;
  }
}

async function getAuthToken() {
  if (cachedAuthToken && Date.now() < cachedAuthTokenExpiresAt) {
    return cachedAuthToken;
  }
  if (!inflightRefresh) {
    inflightRefresh = refreshAuthToken().finally(() => { inflightRefresh = null; });
  }
  return inflightRefresh;
}

async function doFetch(url, init, timeoutMs) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    return await fetch(url, {
      ...init,
      signal: controller ? controller.signal : undefined,
    });
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

// One full attempt-with-internal-retry cycle against the GraphQL endpoint.
// Returns the parsed `data` field on success, or null on any kind of failure.
// `cacheOptions` controls Next.js fetch caching for this attempt.
async function attemptFetch({ query, variables, headers, timeoutMs, cacheOptions, preview }) {
  const body = JSON.stringify({ query, variables });
  const fetchInit = {
    headers,
    method: 'POST',
    body,
    ...cacheOptions,
  };

  let lastError = null;
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await doFetch(API_URL, fetchInit, timeoutMs);

      if (!res.ok) {
        // A 401/403 on a preview call usually means our cached authToken
        // went stale (clock skew, CMS restart). Drop it and retry once with
        // a freshly-minted token.
        if (preview && (res.status === 401 || res.status === 403) && attempt < maxAttempts) {
          cachedAuthToken = null;
          cachedAuthTokenExpiresAt = 0;
          const refreshed = await getAuthToken();
          if (refreshed) {
            fetchInit.headers = { ...fetchInit.headers, Authorization: `Bearer ${refreshed}` };
          }
          await sleep(200);
          continue;
        }
        if (RETRYABLE_STATUS.has(res.status) && attempt < maxAttempts) {
          await sleep(300 * attempt);
          continue;
        }
        console.error(`Fetch API non-OK status: ${res.status} ${res.statusText}`);
        return null;
      }

      const json = await res.json();

      if (json.errors) {
        const nonFieldErrors = json.errors.filter(error =>
          !(error?.message?.includes('Cannot query field') &&
            error?.message?.includes('Did you mean'))
        );

        if (nonFieldErrors.length > 0) {
          const readable = nonFieldErrors.map(e => ({
            message: e?.message,
            path: e?.path,
            locations: e?.locations,
            extensions: e?.extensions,
          }));
          console.error("GraphQL Errors:\n" + JSON.stringify(readable, null, 2));
        }

        // If ALL returned errors are tolerable "Cannot query field … Did you mean"
        // schema-drift warnings AND we still got partial data back, prefer the
        // partial data over discarding the whole response.
        if (nonFieldErrors.length === 0 && json.data) {
          return json.data;
        }

        // WPGraphQL often returns usable `page` / `post` data together with
        // non-fatal extension or field-level errors; discarding the whole payload
        // breaks preview with "Page not found" even when the node resolved.
        if (preview && json.data && (json.data.page != null || json.data.post != null)) {
          console.error(
            '[preview] GraphQL returned errors but keeping partial node data. ' +
            'Fix upstream warnings when possible.'
          );
          return json.data;
        }

        return null;
      }

      return json.data;
    } catch (error) {
      lastError = error;
      const isAbort = error?.name === 'AbortError';
      if (attempt < maxAttempts) {
        await sleep(300 * attempt);
        continue;
      }
      if (isAbort) {
        console.error(`Fetch API timed out after ${timeoutMs}ms`);
      } else {
        console.error("Fetch API Error:", error);
      }
      return null;
    }
  }

  if (lastError) {
    console.error("Fetch API Error (after retries):", lastError);
  }
  return null;
}

// Build the per-request headers (UA on server, Origin + auth token on preview).
async function buildHeaders(preview) {
  const headers = { 'Content-Type': 'application/json' };
  if (isServer) {
    headers['User-Agent'] = SERVER_USER_AGENT;

    if (preview) {
      // Headless Login's Access Control checks Origin. Only send it on preview
      // calls — sending it on public requests can trigger WAF/CORS rejections.
      if (SERVER_ORIGIN) {
        headers['Origin'] = SERVER_ORIGIN;
        headers['Referer'] = SERVER_ORIGIN;
      }
      // Exchange the long-lived refresh token for a short-lived authToken,
      // cached in-memory between requests. Only attach it on preview calls —
      // an expired token on a public query would 403 the whole request.
      const authToken = await getAuthToken();
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      } else {
        console.error(
          '[preview] No authToken available for GraphQL — asPreview queries usually return null. ' +
          `Origin=${SERVER_ORIGIN || '(none — set NEXT_PUBLIC_SITE_URL or rely on VERCEL_URL)'}.`
        );
      }
    }
  }
  return headers;
}

// A short, stable cache key derived from the GraphQL operation name + variables.
// Using the full query body would explode the key set; the operation name plus
// its variables uniquely identifies the result for our purposes.
function cacheKeyFor(query, variables) {
  const opMatch = query.match(/(?:query|mutation)\s+(\w+)/);
  const opName = opMatch ? opMatch[1] : 'anonymous';
  return ['cms', opName, JSON.stringify(variables || {})];
}

export default async function fetchAPI(query, { variables, tags = [], revalidate, preview = false } = {}) {
  const headers = await buildHeaders(preview);
  const timeoutMs = isServer ? SERVER_TIMEOUT_MS : CLIENT_TIMEOUT_MS;

  // Preview mode and client-side calls always bypass the data cache.
  if (!isServer || preview) {
    return attemptFetch({
      query,
      variables,
      headers,
      timeoutMs,
      cacheOptions: preview ? { cache: 'no-store' } : {},
      preview,
    });
  }

  const ttl = typeof revalidate === 'number' ? revalidate : DEFAULT_REVALIDATE_SECONDS;
  const cacheKey = cacheKeyFor(query, variables);

  // Wrap in unstable_cache so only SUCCESSFUL responses get cached. When the
  // inner function throws, unstable_cache propagates the throw without storing
  // anything — the next call will re-execute the fetch instead of replaying a
  // poisoned response. This is the core of the fix: previously we used
  // `next: { revalidate }` directly on fetch(), which cached the underlying
  // HTTP response even when WPGraphQL returned 200 + errors body, leaving us
  // serving empty pages for the entire revalidate window.
  const cached = unstable_cache(
    async () => {
      const data = await attemptFetch({
        query,
        variables,
        headers,
        timeoutMs,
        cacheOptions: { cache: 'no-store' },
        preview: false,
      });
      if (!data) {
        throw new Error('CMS_FETCH_EMPTY');
      }
      return data;
    },
    cacheKey,
    { revalidate: ttl, tags: ['cms', ...tags] }
  );

  try {
    return await cached();
  } catch (e) {
    if (e?.message !== 'CMS_FETCH_EMPTY') {
      console.error('[CMS] cached fetch errored:', e);
    }
    // Fall back to a direct fetch so the current render still has a chance.
    // The bad cache slot stays unset, so the next request will try fresh too.
    return attemptFetch({
      query,
      variables,
      headers,
      timeoutMs,
      cacheOptions: { cache: 'no-store' },
      preview: false,
    });
  }
}
