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
              caption
              mediaItemUrl
              mediaDetails {
                height
                width
              }
            }
        }
        portfolioFields {
          portfolioTitle
          currentlyFundraising
          logo {
            altText
            caption
            mediaItemUrl
            mediaDetails {
              height
              width
            }
          }
          logoThumbnail {
            altText
            caption
            mediaItemUrl
            mediaDetails {
              height
              width
            }
          }
          gridThumbnail {
            altText
            caption
            mediaItemUrl
            mediaDetails {
              height
              width
            }
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