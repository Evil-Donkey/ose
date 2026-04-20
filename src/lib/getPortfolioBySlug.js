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
  query PortfolioById($id: ID!, $asPreview: Boolean!) {
    portfolio(id: $id, idType: DATABASE_ID, asPreview: $asPreview) { ${PORTFOLIO_FIELDS} }
  }
`;

export default async function getPortfolioBySlug(slugOrId, preview = false) {
  const idMatch = typeof slugOrId === "string" && slugOrId.match(/^(?:id|draft)-(\d+)$/);

  if (idMatch) {
    const data = await fetchAPI(PORTFOLIO_BY_ID_QUERY, {
      variables: { id: idMatch[1], asPreview: preview },
      preview,
    });
    return data?.portfolio ?? null;
  }

  const data = await fetchAPI(PORTFOLIO_BY_SLUG_QUERY, {
    variables: { slug: slugOrId },
    preview,
  });
  return data?.allPortfolio?.nodes?.[0] ?? null;
}
