import fetchAPI from "./api";

const PAGE_FIELDS = `
  databaseId
  title(format: RENDERED)
  content(format: RENDERED)
  status
`;

const PAGE_BY_SLUG_QUERY = `
  query PageBySlug($slug: ID!) {
    page(id: $slug, idType: SLUG) { ${PAGE_FIELDS} }
  }
`;

const PAGE_BY_ID_QUERY = `
  query PageById($id: ID!, $asPreview: Boolean!) {
    page(id: $id, idType: DATABASE_ID, asPreview: $asPreview) { ${PAGE_FIELDS} }
  }
`;

export default async function getPageBySlug(slugOrId, { preview = true } = {}) {
  // Accept "id-{n}" (new contract), "draft-{n}" (legacy) or a plain slug
  const idMatch = typeof slugOrId === "string" && slugOrId.match(/^(?:id|draft)-(\d+)$/);

  if (idMatch) {
    const data = await fetchAPI(PAGE_BY_ID_QUERY, {
      variables: { id: idMatch[1], asPreview: preview },
      preview,
    });
    return data?.page ?? null;
  }

  const data = await fetchAPI(PAGE_BY_SLUG_QUERY, {
    variables: { slug: slugOrId },
    preview,
  });
  return data?.page ?? null;
}
