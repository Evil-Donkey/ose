import fetchAPI from "./api";

const POST_FIELDS = `
  databaseId
  title(format: RENDERED)
  slug
  date
  content(format: RENDERED)
  featuredImage {
    node {
      altText
      caption
      mediaItemUrl
    }
  }
  categories {
    nodes {
      id
      name
      slug
    }
  }
`;

const POST_BY_SLUG_QUERY = `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) { ${POST_FIELDS} }
  }
`;

const POST_BY_ID_QUERY = `
  query PostById($id: ID!) {
    post(id: $id, idType: DATABASE_ID) { ${POST_FIELDS} }
  }
`;

export default async function getNewsBySlug(slug) {
  const draftIdMatch = slug.match(/^draft-(\d+)$/);

  const data = draftIdMatch
    ? await fetchAPI(POST_BY_ID_QUERY, { variables: { id: draftIdMatch[1] }, preview: true })
    : await fetchAPI(POST_BY_SLUG_QUERY, { variables: { slug }, preview: true });

  return data?.post ?? null;
}
