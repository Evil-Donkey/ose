import fetchAPI from "./api";

const FLEXIBLE_CONTENT_QUERY = `
  query getFlexiblePage($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      content(format: RENDERED)
      title(format: RENDERED)
      flexibleContent {
        fieldGroupName
        flexibleContent {
          ... on Page_Flexiblecontent_FlexibleContent_HeroVideo {
            fieldGroupName
            introMovie {
              mediaItemUrl
            }
            fullMovie {
              mediaItemUrl
            }
            headings {
              heading
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_TitleAndCopy {
            copy
            fieldGroupName
            headings {
              heading
              position
            }
          }
        }
      }
    }
  }
`;

export default async function getFlexiblePage(pageId) {
  const data = await fetchAPI(FLEXIBLE_CONTENT_QUERY, {
    variables: { id: String(pageId) }
  });

  return data?.page?.flexibleContent?.flexibleContent;
}
