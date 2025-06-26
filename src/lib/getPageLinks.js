import fetchAPI from './api';

const PAGE_LINKS_QUERY = `
  query GetPageLinks($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      pageLinks {
        heading
        links {
          label
          link {
            ... on Page {
              id
              link
            }
            ... on Portfolio {
              id
              link
            }
            ... on Story {
              id
              link
            }
          }
        }
      }
    }
  }
`;

export default async function getPageLinks(pageId) {
  const data = await fetchAPI(PAGE_LINKS_QUERY, {
    variables: { id: String(pageId) }
  });
  return data?.page?.pageLinks || null;
} 