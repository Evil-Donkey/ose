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

// The Portfolio CPT's PortfolioIdType enum on this WPGraphQL install doesn't
// expose SLUG, so we look up the single portfolio item via the list query
// using the generic WordPress "name" filter (which is the post's slug).
const PORTFOLIO_BY_SLUG_QUERY = `
  query PortfolioBySlug($slug: String!) {
    allPortfolio(first: 1, where: { name: $slug }) {
      nodes { ${PORTFOLIO_FIELDS} }
    }
  }
`;

const PORTFOLIO_BY_ID_QUERY = `
  query PortfolioById($id: ID!) {
    portfolio(id: $id, idType: DATABASE_ID) { ${PORTFOLIO_FIELDS} }
  }
`;

export default async function getPortfolioBySlug(slug, preview = false) {
  const draftIdMatch = slug.match(/^draft-(\d+)$/);

  if (draftIdMatch) {
    const data = await fetchAPI(PORTFOLIO_BY_ID_QUERY, {
      variables: { id: draftIdMatch[1] },
      preview,
    });
    return data?.portfolio ?? null;
  }

  const data = await fetchAPI(PORTFOLIO_BY_SLUG_QUERY, {
    variables: { slug },
    preview,
  });
  return data?.allPortfolio?.nodes?.[0] ?? null;
}
