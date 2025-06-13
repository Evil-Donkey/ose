const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;

// Fetch API
export default async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
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
      next: { revalidate: 10 }
    });

    const json = await res.json();

    if (json.errors) {
      console.error("GraphQL Errors:", json.errors);
      return null; // Don't throw an error, just return null
    }

    return json.data;
  } catch (error) {
    console.error("Fetch API Error:", error);
    return null;
  }
}
