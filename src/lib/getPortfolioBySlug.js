import fetchAPI from "./api";

const PORTFOLIO_FIELDS = `
  databaseId
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
`;

const PORTFOLIO_BY_SLUG_QUERY = `
  query PortfolioBySlug($slug: ID!) {
    portfolio(id: $slug, idType: SLUG) { ${PORTFOLIO_FIELDS} }
  }
`;

const PORTFOLIO_BY_ID_QUERY = `
  query PortfolioById($id: ID!) {
    portfolio(id: $id, idType: DATABASE_ID) { ${PORTFOLIO_FIELDS} }
  }
`;

export default async function getPortfolioBySlug(slug, preview = false) {
  const draftIdMatch = slug.match(/^draft-(\d+)$/);

  const data = draftIdMatch
    ? await fetchAPI(PORTFOLIO_BY_ID_QUERY, { variables: { id: draftIdMatch[1] }, preview })
    : await fetchAPI(PORTFOLIO_BY_SLUG_QUERY, { variables: { slug }, preview });

  return data?.portfolio ?? null;
}
