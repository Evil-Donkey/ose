import fetchAPI from "./api";

const PORTFOLIO_NAV_QUERY = `
  query PortfolioNav {
    allPortfolio(first: 1000) {
      nodes {
        title(format: RENDERED)
        slug
      }
    }
  }
`;

export default async function getPortfolioNav(preview = false) {
  const data = await fetchAPI(PORTFOLIO_NAV_QUERY, {
    preview,
    tags: ["portfolio-nav"],
  });
  return data?.allPortfolio?.nodes || [];
}
