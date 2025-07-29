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
