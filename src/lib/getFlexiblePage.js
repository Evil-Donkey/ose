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
              copyOnTheLeft
              ctaLabel
          }
          ... on Page_Flexiblecontent_FlexibleContent_TitleAndCopy {
            copy
            sectionLabel
            fieldGroupName
            headings {
              heading
              position
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_FullScreenPanel {
            fieldGroupName
            sectionLabel
            mainTitle
            autoHeight
            heading
            copy
            ctaLabel
            ctaUrl
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
            sectionLabel
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
            sectionLabel
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
            sectionLabel
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
            sectionLabel
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
            copyFullWidth
            fieldGroupName
            sectionLabel
            title
            headings {
              heading
            }
            sectors {
              copy
              title
              url
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
            bottomHeading
            ctaLabel
            ctaUrl
          }
          ... on Page_Flexiblecontent_FlexibleContent_Portfolio {
            copy
            fieldGroupName
            sectionLabel
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
            sectionLabel
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
            sectionLabel
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
            sectionLabel
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
            sectionLabel
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
                story {
                  cardExcerpt
                }
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_News {
            fieldGroupName
            sectionLabel
            news {
              ... on Post {
                id
                date
                link
                uri
                title(format: RENDERED)
                news {
                  externalUrl
                }
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
            carousel
            fieldGroupName
            sectionLabel
            title
            ctaLabel
            ctaUrl
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
            sectionLabel
            title
            copy
            carousel
            tabs
            cards {
              description
              heading
              field
              bio
              image {
                altText
                mediaItemUrl
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_FullPanelCarousel {
            fieldGroupName
            sectionLabel
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
            fieldGroupName
            sectionLabel
            copy
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
            sectionLabel
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
            sectionLabel
          }
          ... on Page_Flexiblecontent_FlexibleContent_ExampleProjects {
            fieldGroupName
            bottomHeading
            ctaLabel
            ctaUrl
            title
            sectionLabel
            projects {
              copy
              title
              video {
                mediaItemUrl
              }
              image {
                altText
                mediaItemUrl
                mediaDetails {
                  height
                  width
                }
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_LogosGrid {
            fieldGroupName
            sectionLabel
            title
            gallery {
              mediaItemUrl
              altText
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_Exits {
            copy
            fieldGroupName
            sectionLabel
            title
            exits {
              description
              title
              url
              logo {
                mediaItemUrl
                mediaDetails {
                  height
                  width
                }
                altText
              }
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_TwoColumnsTitleCopy {
            fieldGroupName
            sectionLabel
            title
            blocks {
              copy
              heading
            }
          }
          ... on Page_Flexiblecontent_FlexibleContent_FullWidthLargeHeading {
            copy
            fieldGroupName
            sectionLabel
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
