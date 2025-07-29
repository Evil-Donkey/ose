import fetchAPI from "./api";

const PORTFOLIO_NEWS_CATEGORIES_QUERY = `
  query PortfolioNewsCategories {
    portfolioNewsCategories {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

export default async function getPortfolioNewsCategories() {
  const data = await fetchAPI(PORTFOLIO_NEWS_CATEGORIES_QUERY);
  return data?.portfolioNewsCategories?.nodes || [];
} 