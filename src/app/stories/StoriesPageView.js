import getFlexiblePage from "@/lib/getFlexiblePage";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import StoriesWrapper from "./StoriesWrapper";
import getStoriesTypes from "@/lib/getStoriesTypes";
import getStoriesItems from "@/lib/getStoriesItems";
import getStoriesSectors from "@/lib/getStoriesSectors";
import getFooterData from "@/lib/getFooterData";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";

const PAGE_ID = "1254";

export default async function StoriesPageView({ preview = false }) {
  const [
    flexibleContent,
    { title },
    popOutData,
    types,
    stories,
    sectors,
    footerData,
    meganavLinks,
    meganavData,
  ] = await Promise.all([
    getFlexiblePage(PAGE_ID, preview),
    getPageTitleAndContent(PAGE_ID, preview),
    getPopOutData(),
    getStoriesTypes(),
    getStoriesItems(),
    getStoriesSectors(),
    getFooterData(),
    getMeganavLinksLite(),
    getMeganavDataLite(),
  ]);

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta,
  };

  return (
    <>
      <FlexiblePageClient
        flexibleContent={flexibleContent}
        popOutData={popOutData}
        title={title}
        isStoriesPage={true}
        fixedHeader={true}
        meganavLinks={meganavLinks}
        meganavData={meganavData}
      />

      <StoriesWrapper types={types} stories={stories} sectors={sectors} ctaData={ctaData} />
    </>
  );
}
