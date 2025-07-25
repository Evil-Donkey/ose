import fetchAPI from "./api";

const NEWS_CATEGORIES_QUERY = `
  query NewsCategories {
    categories {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

export default async function getNewsCategories() {
  const data = await fetchAPI(NEWS_CATEGORIES_QUERY);
  return data?.categories?.nodes || [];
} 