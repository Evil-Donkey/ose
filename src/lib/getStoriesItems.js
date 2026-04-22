import fetchAPI from "./api";

const STORIES_ITEMS_QUERY = `
  query Stories {
    stories(first: 1000, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
      nodes {
        title
        slug
        databaseId
        menuOrder
        content(format: RENDERED)
        featuredImage {
          node {
            caption
            altText
            mediaItemUrl
          }
        }
        mobileFeaturedImage {
          mobileFeaturedImage {
            mediaItemUrl
            altText
            caption
          }
        }
        story {
          cardExcerpt
        }
        storiesTypes {
          nodes {
            id
            name
            slug
          }
        }
        storiesSectors {
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

export default async function getStoriesItems(preview = false) {
  const data = await fetchAPI(STORIES_ITEMS_QUERY, { preview });

  // Throw on fetch failure so /stories/[slug] pages using stories.find(slug)
  // don't ISR-cache a bogus notFound() when WP is temporarily down.
  // Skipped at build phase so a transient blip doesn't fail the deploy.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (!preview && !isBuildPhase && data === null) {
    throw new Error('CMS_FETCH_FAILED: stories list');
  }

  return data?.stories?.nodes || [];
} 