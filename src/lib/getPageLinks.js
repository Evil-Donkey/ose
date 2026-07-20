import fetchAPI from "./api";
import { isPreviewCmsAuthRequest } from "./previewCmsAuthHeader";

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
  // Soft-fail: `pageLinks` is not currently exposed on Page in WPGraphQL.
  // Callers must not depend on this for critical UI (meganav section labels
  // come from getMeganavBundle instead).
  const data = await fetchAPI(PAGE_LINKS_QUERY, {
    variables: { id: String(pageId) },
    preview: await isPreviewCmsAuthRequest(),
  });
  return data?.page?.pageLinks || EMPTY_PAGE_LINKS;
}