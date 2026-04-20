const isServer = typeof window === 'undefined';

const API_URL = isServer
  ? process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT
  : '/api/graphql';

export default async function fetchAPI(query, { variables, tags = [], preview = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (isServer && process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  let isPreview = preview;
  if (isServer && !isPreview) {
    try {
      const { draftMode } = await import('next/headers');
      const { isEnabled } = await draftMode();
      isPreview = isEnabled;
    } catch {
      // Not in a request context (e.g. build time static generation)
    }
  }

  try {
    const res = await fetch(API_URL, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        query,
        variables,
        _v: 2,
      }),
      ...(isServer && (
        isPreview
          ? { cache: 'no-store' }
          : { next: { revalidate: 120, tags: ['cms', ...tags] } }
      ))
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
