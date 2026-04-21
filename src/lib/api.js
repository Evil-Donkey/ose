const isServer = typeof window === 'undefined';

const API_URL = isServer
  ? process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT
  : '/api/graphql';

// Abort any individual CMS call that takes too long so a slow WordPress
// can't hang server rendering and trigger the generic "Application error"
// on the client. Server calls get more headroom than client calls.
//
// Local stacks (e.g. MAMP) often answer much slower than production, and
// pages may fire several GraphQL requests in parallel — each can exceed 15s.
// Development uses a higher default; override with WORDPRESS_FETCH_SERVER_TIMEOUT_MS
// (milliseconds, 5000–180000) if you still see AbortError timeouts locally.
function readServerTimeoutMs() {
  const override = process.env.WORDPRESS_FETCH_SERVER_TIMEOUT_MS;
  if (override !== undefined && override !== '') {
    const n = Number.parseInt(String(override), 10);
    if (Number.isFinite(n) && n >= 5000 && n <= 180_000) return n;
  }
  return process.env.NODE_ENV === 'development' ? 60_000 : 15_000;
}

const SERVER_TIMEOUT_MS = readServerTimeoutMs();
const CLIENT_TIMEOUT_MS = 20000;

// Many managed WordPress hosts / WAFs (Cloudflare, Sucuri, WP Engine,
// Pantheon, Kinsta) block default Node fetch requests because they arrive
// without a recognisable User-Agent. Giving the CMS a stable, descriptive
// UA dramatically reduces spurious 403 Forbidden responses.
const SERVER_USER_AGENT = 'OSE-NextJS/1.0 (+server-render)';

// The Next.js origin that WordPress's Headless Login Access Control list
// must allow-list. We always send Origin so the CMS treats these requests
// as coming from our first-party app, even though they're server-to-server.
const SERVER_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : null);

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
  if (!refreshToken) return null;

  const reqHeaders = {
    'Content-Type': 'application/json',
    'User-Agent': SERVER_USER_AGENT,
  };
  if (SERVER_ORIGIN) reqHeaders['Origin'] = SERVER_ORIGIN;

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

export default async function fetchAPI(query, { variables, tags = [], preview = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (isServer) {
    headers['User-Agent'] = SERVER_USER_AGENT;
    // Headless Login's Access Control checks the Origin header even for
    // non-login queries on some versions, so always send it from the server.
    if (SERVER_ORIGIN) headers['Origin'] = SERVER_ORIGIN;

    if (preview) {
      // Exchange the long-lived refresh token for a short-lived authToken,
      // cached in-memory between requests. Only attach it on preview calls —
      // an expired token on a public query would 403 the whole request.
      const authToken = await getAuthToken();
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    }
  }

  const timeoutMs = isServer ? SERVER_TIMEOUT_MS : CLIENT_TIMEOUT_MS;
  const body = JSON.stringify({ query, variables });
  const fetchInit = {
    headers,
    method: 'POST',
    body,
    ...(isServer && (
      preview
        ? { cache: 'no-store' }
        : { next: { revalidate: 120, tags: ['cms', ...tags] } }
    )),
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
