import fetchAPI from "./api";

const NEWS_ITEMS_QUERY = `
  query News {
    posts(first: 1000) {
      nodes {
        title
        slug
        databaseId
        date
        content(format: RENDERED)
        news {
          shortDescription
          externalUrl
          thumbnailImage {
            altText
            caption
            mediaItemUrl
          }
        }
        featuredImage {
          node {
            altText
            caption
            mediaItemUrl
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export default async function getNewsItems(preview = false) {
  const data = await fetchAPI(NEWS_ITEMS_QUERY, { preview });

  // Throw on fetch failure so /news/[slug] pages using items.find(slug)
  // don't render "News item not found" when WP is temporarily down.
  // Skipped at build phase so a transient blip doesn't fail the deploy.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (!preview && !isBuildPhase && data === null) {
    throw new Error('CMS_FETCH_FAILED: news items list');
  }

  return data?.posts?.nodes || [];
}
