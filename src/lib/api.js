const isServer = typeof window === 'undefined';

const API_URL = isServer
  ? process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT
  : '/api/graphql';

// Abort any individual CMS call that takes too long so a slow WordPress
// can't hang server rendering and trigger the generic "Application error"
// on the client. Server calls get more headroom than client calls.
const SERVER_TIMEOUT_MS = 15000;
const CLIENT_TIMEOUT_MS = 20000;

// Many managed WordPress hosts / WAFs (Cloudflare, Sucuri, WP Engine,
// Pantheon, Kinsta) block default Node fetch requests because they arrive
// without a recognisable User-Agent. Giving the CMS a stable, descriptive
// UA dramatically reduces spurious 403 Forbidden responses.
const SERVER_USER_AGENT = 'OSE-NextJS/1.0 (+server-render)';

// Status codes that are worth retrying once — transient WAF blocks, upstream
// timeouts and rate-limiting. We do NOT retry on 4xx that look permanent
// (400/401/404/422) because they'll fail the same way every time.
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504, 403]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    // Only attach the WordPress auth token when we actually need authenticated
    // access (preview / draft mode). Sending an expired or invalid JWT on
    // public queries causes WPGraphQL to reject the whole request with 403.
    if (preview && process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
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
