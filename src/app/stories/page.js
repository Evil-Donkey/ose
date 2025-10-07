import getFlexiblePage from "@/lib/getFlexiblePage";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import StoriesWrapper from "./StoriesWrapper";
import getStoriesTypes from "@/lib/getStoriesTypes";
import getStoriesItems from "@/lib/getStoriesItems";
import getStoriesSectors from "@/lib/getStoriesSectors";
import getFooterData from "@/lib/getFooterData";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";

export async function generateMetadata() {
  return await generateMetadataFromLib("1254");
}

export default async function StoriesPage() {
  const [flexibleContent, { title, content }, popOutData, types, stories, sectors, footerData, meganavLinks, meganavData] = await Promise.all([
    getFlexiblePage("1254"),
    getPageTitleAndContent("1254"),
    getPopOutData(),
    getStoriesTypes(),
    getStoriesItems(),
    getStoriesSectors(),
    getFooterData(),
    getMeganavLinksLite(),
    getMeganavDataLite()
  ]);

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta
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