import fetchAPI from "./api";

const PAGE_BY_SLUG_QUERY = `
  query PageBySlug($slug: ID!) {
    page(id: $slug, idType: SLUG) {
      databaseId
      title(format: RENDERED)
      content(format: RENDERED)
      status
    }
  }
`;

const PAGE_BY_ID_QUERY = `
  query PageById($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      databaseId
      title(format: RENDERED)
      content(format: RENDERED)
      status
    }
  }
`;

export default async function getPageBySlug(slug) {
  // 'draft-{id}' is used for auto-draft pages that have no slug yet
  const draftIdMatch = slug.match(/^draft-(\d+)$/);

  const data = draftIdMatch
    ? await fetchAPI(PAGE_BY_ID_QUERY, { variables: { id: draftIdMatch[1] }, preview: true })
    : await fetchAPI(PAGE_BY_SLUG_QUERY, { variables: { slug }, preview: true });

  return data?.page ?? null;
}
