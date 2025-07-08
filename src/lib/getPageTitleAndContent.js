import fetchAPI from "./api";

const PAGE_TITLE_CONTENT_QUERY = `
  query getPageTitleAndContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      title(format: RENDERED)
      content(format: RENDERED)
    }
  }
`;

export default async function getPageTitleAndContent(pageId) {
  const data = await fetchAPI(PAGE_TITLE_CONTENT_QUERY, {
    variables: { id: String(pageId) }
  });
  return {
    title: data?.page?.title || null,
    content: data?.page?.content || null
  };
} 