import fetchAPI from "./api";

const STORIES_SECTORS_QUERY = `
  query StoriesSectors {
    storiesSectors {
      nodes {
        id
        name
        slug
        parentId
      }
    }
  }
`;

export default async function getStoriesSectors() {
  const data = await fetchAPI(STORIES_SECTORS_QUERY);
  return data?.storiesSectors?.nodes || [];
} 