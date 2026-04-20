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
  query PostById($id: ID!, $asPreview: Boolean!) {
    post(id: $id, idType: DATABASE_ID, asPreview: $asPreview) { ${POST_FIELDS} }
  }
`;

export default async function getNewsBySlug(slugOrId, { preview = true } = {}) {
  const idMatch = typeof slugOrId === "string" && slugOrId.match(/^(?:id|draft)-(\d+)$/);

  if (idMatch) {
    const data = await fetchAPI(POST_BY_ID_QUERY, {
      variables: { id: idMatch[1], asPreview: preview },
      preview,
    });
    return data?.post ?? null;
  }

  const data = await fetchAPI(POST_BY_SLUG_QUERY, {
    variables: { slug: slugOrId },
    preview,
  });
  return data?.post ?? null;
}
