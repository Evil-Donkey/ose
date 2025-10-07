import { NextResponse } from "next/server";

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

    // Get authorization header if present (for authenticated requests)
    const authHeader = req.headers.get("authorization");

    const headers = {
      "Content-Type": "application/json",
    };

    // Add WordPress auth token if present in environment
    if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
    }

    // Override with request auth header if provided (for user-specific requests)
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Make request to WordPress GraphQL endpoint
    const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();

    // Return the GraphQL response with appropriate status code
    return NextResponse.json(data, { 
      status: response.ok ? 200 : response.status 
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
    };

    if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
    }

    const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables: variables ? JSON.parse(variables) : undefined,
      }),
    });

    const data = await response.json();

    return NextResponse.json(data, { 
      status: response.ok ? 200 : response.status 
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

