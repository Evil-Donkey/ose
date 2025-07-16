import fetchAPI from "./api";

const STORIES_TYPES_QUERY = `
  query StoriesTypes {
    storiesTypes {
      nodes {
        id
        description
        name
        slug
        customOrder
      }
    }
  }
`;

export default async function getStoriesTypes() {
  const data = await fetchAPI(STORIES_TYPES_QUERY);
  return data?.storiesTypes?.nodes || [];
} 