// Determine if we're on server or client
const isServer = typeof window === 'undefined';

// Use proxy for client-side requests, direct endpoint for server-side
const API_URL = isServer 
  ? process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT
  : '/api/graphql';

// Fetch API
export default async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  // Only add auth token on server-side requests
  if (isServer && process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  try {
    const res = await fetch(API_URL, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        query,
        variables,
      }),
      // Only use Next.js cache on server-side
      ...(isServer && { next: { revalidate: 10 } })
    });

    const json = await res.json();

    if (json.errors) {
      // Filter out errors related to missing fields that are optional
      const nonFieldErrors = json.errors.filter(error => 
        !error.message.includes('Cannot query field') || 
        !error.message.includes('Did you mean')
      );
      
      if (nonFieldErrors.length > 0) {
        console.error("GraphQL Errors:", nonFieldErrors);
      }
      
      return null; // Don't throw an error, just return null
    }

    return json.data;
  } catch (error) {
    console.error("Fetch API Error:", error);
    return null;
  }
}
