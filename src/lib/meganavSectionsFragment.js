// Shared inline fragments for meganav section labels (used in one batched CMS query).
export const MEGANAV_SECTIONS_FRAGMENT = `
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
  ... on Page_Flexiblecontent_FlexibleContent_LogosSlider {
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
`;

export const MEGANAV_PAGE_ALIASES = {
  Why: 'why',
  What: 'what',
  How: 'how',
  Who: 'who',
};

export const MEGANAV_PAGE_IDS = {
  Why: '226',
  What: '26',
  How: '241',
  Who: '243',
};
