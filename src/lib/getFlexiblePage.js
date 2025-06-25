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
            mobileMovie {
              mediaItemUrl
            }
            fullMovie {
              mediaItemUrl
            }
            desktopImage {
              mediaItemUrl
            }
            mobileImage {
              mediaItemUrl
            }
            headings {
              heading
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_TitleAndCopy {
            copy
            id
            fieldGroupName
            headings {
              heading
              position
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_FullScreenPanel {
            fieldGroupName
            id
            heading
            copy
            darkOverlay
            backgroundImage {
              mediaItemUrl
              altText
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
            id
            stats {
              title
              copy
              credits
              stats {
                description
                postStat
                preStat
                statValue
              }
            }
            investorsHeading
            investorsDesktopImage {
              altText
              mediaItemUrl
              mediaDetails {
                height
                width
              }
            }
            investorsMobileImage {
              altText
              mediaItemUrl
              mediaDetails {
                height
                width
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_Stats {
            fieldGroupName
            id
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
            id
            title
            spinoutDesktopImage {
              mediaItemUrl
              altText
              mediaDetails {
                height
                width
              }
            }
            spinoutMobileImage {
              mediaItemUrl
              altText
              mediaDetails {
                height
                width
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_Expertise {
            fieldGroupName
            title
            id
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
            id
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
                  uri
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
            id
            portfolio {
              ... on Portfolio {
                id
                title(format: RENDERED)
                link
                uri
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
                  portfolioTitle
                }
              }
            }
            title
          }
          ... on Page_Flexiblecontent_FlexibleContent_Cta {
            copy
            fieldGroupName
            id
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
          ... on Page_Flexiblecontent_FlexibleContent_Story {
            fieldGroupName
            id
            story {
              ... on Story {
                id
                content(format: RENDERED)
                title(format: RENDERED)
                uri
                featuredImage {
                  node {
                    mediaItemUrl
                  }
                }
                story {
                  secondCopyBlock
                  author
                  quote
                  quoteImage {
                    mediaItemUrl
                    mediaDetails {
                      height
                      width
                    }
                    altText
                  }
                }
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_OneColumnCopyAlternate {
            fieldGroupName
            id
            backgroundMedia
            copy
            ctaLabel
            ctaLink {
              ... on Page {
                id
                link
                uri
              }
              ... on Portfolio {
                id
                link
                uri
              }
              ... on Story {
                id
                link
                uri
              }
            }
            heading
            headingSize
            copyLast
            subheading
            darkOverlay
            credits
            image {
              mediaItemUrl
            }
            imageMobile {
              mediaItemUrl
            }
            videoMp4 {
              mediaItemUrl
            }
            videoMp4Mobile {
              mediaItemUrl
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_Stories {
            fieldGroupName
            id
            stories {
              ... on Story {
                id
                content(format: RENDERED)
                title(format: RENDERED)
                link
                uri
                featuredImage {
                  node {
                    altText
                    mediaItemUrl
                  }
                }
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_News {
            fieldGroupName
            id
            news {
              ... on Post {
                id
                date
                link
                uri
                title(format: RENDERED)
                featuredImage {
                  node {
                    altText
                    mediaItemUrl
                  }
                }
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_InspirationalQuotes {
            id
            carousel
            fieldGroupName
            title
            quotes {
              author
              darkOverlay
              quoteOnTheRight
              quote
              image {
                altText
                mediaItemUrl
              }
              mobile {
                altText
                mediaItemUrl
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_Cards {
            fieldGroupName
            id
            title
            copy
            carousel
            cards {
              description
              heading
              image {
                altText
                mediaItemUrl
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_FullPanelCarousel {
            fieldGroupName
            id
            heading
            slides {
              copy
              accordionCopy
              accordionList {
                listItem
              }
              title
              imageOverlay
              backgroundImage {
                altText
                mediaItemUrl
              }
              backgroundImageMobile {
                altText
                mediaItemUrl
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_FullScreenList {
            id
            copy
            fieldGroupName
            heading
            listCopy
            listPosition
            backgroundImage {
              altText
              mediaItemUrl
            }
            backgroundImageMobile {
              altText
              mediaItemUrl
            }
            list {
              description
              title
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_Faqs {
            id
            copy
            fieldGroupName
            title
            faqs {
              answer
              question
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_Team {
            fieldGroupName
            id
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
