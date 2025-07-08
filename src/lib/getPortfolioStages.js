import fetchAPI from "./api";

const PORTFOLIO_STAGES_QUERY = `
  query PortfolioStages {
    portfolioStages {
      nodes {
        id
        name
        slug
        parentId
        customOrder
      }
    }
  }
`;

export default async function getPortfolioStages() {
  const data = await fetchAPI(PORTFOLIO_STAGES_QUERY);
  return data?.portfolioStages?.nodes || [];
} 