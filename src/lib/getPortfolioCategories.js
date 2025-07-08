import fetchAPI from "./api";

const PORTFOLIO_CATEGORIES_QUERY = `
  query PortfolioCategories {
    portfolioCategories {
      nodes {
        id
        name
        slug
        parentId
      }
    }
  }
`;

export default async function getPortfolioCategories() {
  const data = await fetchAPI(PORTFOLIO_CATEGORIES_QUERY);
  return data?.portfolioCategories?.nodes || [];
} 