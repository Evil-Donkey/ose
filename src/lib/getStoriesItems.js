import fetchAPI from "./api";

const STORIES_ITEMS_QUERY = `
  query Stories {
    stories(first: 1000) {
      nodes {
        title
        slug
        databaseId
        content(format: RENDERED)
        featuredImage {
          node {
            altText
            mediaItemUrl
          }
        }
        storiesTypes {
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

export default async function getStoriesItems() {
  const data = await fetchAPI(STORIES_ITEMS_QUERY);
  return data?.stories?.nodes || [];
} 