import fetchAPI from "./api";
import { isCmsDraftRequest } from "./cmsDraftAuth";

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
              slug
              uri
            }
            ... on Portfolio {
              id
              link
              slug
              uri
            }
            ... on Story {
              id
              link
              slug
              uri
            }
          }
        }
      }
    }
  }
`;

const EMPTY_PAGE_LINKS = {
  heading: null,
  links: [],
};

export default async function getPageLinks(pageId) {
  const data = await fetchAPI(PAGE_LINKS_QUERY, {
    variables: { id: String(pageId) },
    preview: await isCmsDraftRequest(),
  });
  return data?.page?.pageLinks || EMPTY_PAGE_LINKS;
}