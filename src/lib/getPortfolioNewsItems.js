import fetchAPI from "./api";

const PORTFOLIO_NEWS_ITEMS_QUERY = `
  query PortfolioNews {
    portfolioNews(first: 1000) {
      nodes {
        title
        slug
        databaseId
        date
        portfolioNews {
          hashtag
          url
        }
        portfolioNewsCategories {
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

export default async function getPortfolioNewsItems() {
  const data = await fetchAPI(PORTFOLIO_NEWS_ITEMS_QUERY);
  return data?.portfolioNews?.nodes || [];
} 