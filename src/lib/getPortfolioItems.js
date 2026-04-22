import fetchAPI from "./api";

const PORTFOLIO_ITEMS_QUERY = `
  query Portfolio {
    allPortfolio(first: 1000) {
      nodes {
        title(format: RENDERED)
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
    preview,
    tags: ["portfolio-items"],
  });

  // Throw on fetch failure so /portfolio pages don't render an empty grid
  // and so ISR doesn't cache that empty state for the revalidate window.
  // Skipped at build phase so a transient blip doesn't fail the deploy.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (!preview && !isBuildPhase && data === null) {
    throw new Error('CMS_FETCH_FAILED: portfolio items list');
  }

  return data?.allPortfolio?.nodes || [];
}
