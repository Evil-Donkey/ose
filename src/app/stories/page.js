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

export async function generateMetadata() {
  return await generateMetadataFromLib("1254");
}

export default async function StoriesPage() {
  const flexibleContent = await getFlexiblePage("1254");
  const { title, content } = await getPageTitleAndContent("1254");
  const popOutData = await getPopOutData();
  const types = await getStoriesTypes();
  const stories = await getStoriesItems();
  const sectors = await getStoriesSectors();
  const footerData = await getFooterData();

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
      />

      <StoriesWrapper types={types} stories={stories} sectors={sectors} ctaData={ctaData} />
    </>
  );
} 