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
          ... on Page_Flexiblecontent_FlexibleContent_ScrollingPanels {
            fieldGroupName
            mainHeading
            panels {
              title
              heading
              copy
              backgroundImage {
                mediaItemUrl
                altText
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_InfographicMap {
            copy
            fieldGroupName
            heading
            headings {
              heading
              position
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_WhatWeDo {
            fieldGroupName
            title
            columns {
              copy
            }
            headings {
              heading
              position
            }
            stats {
              title
              stats {
                description
                postStat
                preStat
                statValue
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_Stats {
            fieldGroupName
            stats {
              fieldGroupName
              title
              stats {
                description
                postStat
                preStat
                statValue
              }
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
