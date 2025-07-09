import fetchAPI from "./api";

const PORTFOLIO_ITEMS_QUERY = `
  query Portfolio {
    allPortfolio(first: 1000) {
      nodes {
        title(format: RENDERED)
        content(format: RENDERED)
        slug
        featuredImage {
            node {
            altText
            mediaItemUrl
            }
        }
        portfolioFields {
          portfolioTitle
          currentlyFundraising
          logo {
            altText
            mediaItemUrl
          }
          logoThumbnail {
            altText
            mediaItemUrl
          }
          gridThumbnail {
            altText
            mediaItemUrl
          }
          websiteUrl
          linkedinUrl
          xUrl
        }
        portfolioCategories {
            nodes {
                slug
                name
                id
                parentId
            }
        }
        portfolioStages {
            nodes {
                name
                slug
                id
                parentId
            }
        }
      }
    }
  }
`;

export default async function getPortfolioItems() {
  const data = await fetchAPI(PORTFOLIO_ITEMS_QUERY);
  return data?.allPortfolio?.nodes || [];
} 