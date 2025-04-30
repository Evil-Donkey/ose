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
          ... on Page_Flexiblecontent_FlexibleContent_InfographicEcosystem {
            copy
            fieldGroupName
            title
          }
          ... on Page_Flexiblecontent_FlexibleContent_Expertise {
            fieldGroupName
            title
            headings {
              heading
              position
            }
            columns {
              copy
            }
            expertise {
              copy
              title
              who
              backgroundImage {
                mediaItemUrl
              }
              photo {
                altText
                mediaItemUrl
                mediaDetails {
                  height
                  width
                }
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_Sectors {
            copy
            fieldGroupName
            title
            headings {
              heading
            }
            sectors {
              copy
              title
              url {
                ... on Page {
                  id
                  slug
                  link
                }
              }
              image {
                mediaItemUrl
                mediaDetails {
                  height
                  width
                }
                altText
              }
              video {
                mediaItemUrl
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_Portfolio {
            copy
            fieldGroupName
            portfolio {
              ... on Portfolio {
                id
                title(format: RENDERED)
                link
                featuredImage {
                  node {
                    altText
                    mediaItemUrl
                    mediaDetails {
                      height
                      width
                    }
                  }
                }
                portfolioCategories {
                  nodes {
                    name
                    taxonomyName
                  }
                }
                portfolioFields {
                  authorName
                  roleOrCompany
                }
              }
            }
            title
          }
          ... on Page_Flexiblecontent_FlexibleContent_Cta {
            copy
            fieldGroupName
            title
            cta {
              smallTitle
              largeTitle
              copy
              ctaLabel
              ctaUrl
              backgroundImage {
                altText
                mediaDetails {
                  height
                  width
                }
                mediaItemUrl
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
