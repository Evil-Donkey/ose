import fetchAPI from "./api";

const FOUNDER_FIELDS = `
  databaseId
  title(format: RENDERED)
  content(format: RENDERED)
  slug
  founder {
    email
    linkedinUrl
    role
    heroCopyToTheRight
    heroDesktopImage {
      mediaItemUrl
    }
    heroMobileImage {
      mediaItemUrl
    }
  }
  featuredImage {
    node {
      altText
      caption
      mediaItemUrl
    }
  }
`;

const FOUNDER_BY_SLUG_QUERY = `
  query FounderBySlug($slug: ID!) {
    founder(id: $slug, idType: SLUG) { ${FOUNDER_FIELDS} }
  }
`;

const FOUNDER_BY_ID_QUERY = `
  query FounderById($id: ID!) {
    founder(id: $id, idType: DATABASE_ID) { ${FOUNDER_FIELDS} }
  }
`;

export default async function getFounderBySlug(slug) {
  const draftIdMatch = slug.match(/^draft-(\d+)$/);

  const data = draftIdMatch
    ? await fetchAPI(FOUNDER_BY_ID_QUERY, { variables: { id: draftIdMatch[1] }, preview: true })
    : await fetchAPI(FOUNDER_BY_SLUG_QUERY, { variables: { slug }, preview: true });

  return data?.founder ?? null;
}
