import fetchAPI from "./api";
import getPageLinks from './getPageLinks';

// Lightweight query that only fetches section labels - much faster than full flexible content
const MEGANAV_LINKS_QUERY = `
  query getMeganavLinks($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      flexibleContent {
        flexibleContent {
          ... on Page_Flexiblecontent_FlexibleContent_TitleAndCopy {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_FullScreenPanel {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_WhatWeDo {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Stats {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_InfographicEcosystem {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Expertise {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Sectors {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Portfolio {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Cta {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Story {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_OneColumnCopyAlternate {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Stories {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_News {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_InspirationalQuotes {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Cards {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Founders {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_FullPanelCarousel {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_FullScreenList {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Faqs {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Team {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_ExampleProjects {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_LogosGrid {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Exits {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_TwoColumnsTitleCopy {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_FullWidthLargeHeading {
            sectionLabel
            fieldGroupName
          }
          ... on Page_Flexiblecontent_FlexibleContent_Advantages {
            sectionLabel
            fieldGroupName
          }
        }
      }
    }
  }
`;

const PAGE_IDS = {
  Why: '226',
  What: '26',
  How: '241',
  Who: '243',
};

export default async function getMeganavDataLite() {
  const entries = await Promise.all(
    Object.entries(PAGE_IDS).map(async ([key, id]) => {
      const [flexData, pageLinks] = await Promise.all([
        fetchAPI(MEGANAV_LINKS_QUERY, {
          variables: { id: String(id) }
        }),
        getPageLinks(id)
      ]);
      
      const content = flexData?.page?.flexibleContent?.flexibleContent;
      const links = Array.isArray(content)
        ? content.filter(block => block && block.sectionLabel).map(block => ({ 
            sectionLabel: block.sectionLabel,
            fieldGroupName: block.fieldGroupName 
          }))
        : [];
      
      return [key, { links, pageLinks }];
    })
  );
  
  return Object.fromEntries(entries);
}

