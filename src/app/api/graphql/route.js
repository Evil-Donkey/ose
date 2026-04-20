import { NextResponse } from "next/server";

const UPSTREAM_USER_AGENT = "OSE-NextJS/1.0 (+graphql-proxy)";
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504, 403]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function forwardToCms(headers, body, { maxAttempts = 2 } = {}) {
  const url = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;
  let lastResponse = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    lastResponse = await fetch(url, { method: "POST", headers, body });
    if (lastResponse.ok || !RETRYABLE_STATUS.has(lastResponse.status) || attempt === maxAttempts) {
      return lastResponse;
    }
    await sleep(300 * attempt);
  }
  return lastResponse;
}

/**
 * GraphQL Proxy API Route
 *
 * This proxies all GraphQL requests through Next.js server,
 * eliminating CORS issues when accessing WordPress from VPNs
 * or different network environments.
 *
 * Browser → Next.js /api/graphql → WordPress GraphQL
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { query, variables } = body;

    // Get authorization header if present (for authenticated requests from the client)
    const authHeader = req.headers.get("authorization");

    const headers = {
      "Content-Type": "application/json",
      "User-Agent": UPSTREAM_USER_AGENT,
    };

    // Only forward an Authorization header when the caller explicitly provided
    // one. Attaching the server-side WORDPRESS_AUTH_REFRESH_TOKEN to every
    // public request causes WPGraphQL + JWT to reject the whole request with
    // 403 Forbidden whenever the token is expired (its TTL is only a few
    // minutes), which breaks all public content fetched through this proxy.
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await forwardToCms(headers, JSON.stringify({ query, variables }));

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.ok ? 200 : response.status,
    });

  } catch (error) {
    console.error("GraphQL Proxy Error:", error);
    return NextResponse.json(
      { 
        errors: [{ 
          message: "GraphQL proxy error", 
          extensions: { originalError: error.message } 
        }] 
      }, 
      { status: 500 }
    );
  }
}

// Support GET requests for simple queries (optional)
export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");
  const variables = searchParams.get("variables");

  if (!query) {
    return NextResponse.json(
      { errors: [{ message: "Query parameter required" }] },
      { status: 400 }
    );
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": UPSTREAM_USER_AGENT,
    };

    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await forwardToCms(
      headers,
      JSON.stringify({
        query,
        variables: variables ? JSON.parse(variables) : undefined,
      })
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.ok ? 200 : response.status,
    });

  } catch (error) {
    console.error("GraphQL Proxy Error (GET):", error);
    return NextResponse.json(
      { 
        errors: [{ 
          message: "GraphQL proxy error", 
          extensions: { originalError: error.message } 
        }] 
      }, 
      { status: 500 }
    );
  }
}

