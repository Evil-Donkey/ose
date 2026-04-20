import fetchAPI from "./api";

const PORTFOLIO_ITEMS_QUERY = `
  query Portfolio($stati: [PostStatusEnum]) {
    allPortfolio(first: 1000, where: { stati: $stati }) {
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

export default async function getPortfolioItems(preview = false) {
  const data = await fetchAPI(PORTFOLIO_ITEMS_QUERY, {
    variables: { stati: preview ? ['PUBLISH', 'DRAFT'] : ['PUBLISH'] },
    preview,
  });
  return data?.allPortfolio?.nodes || [];
} 