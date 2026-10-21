import getFlexiblePage from "@/lib/getFlexiblePage";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import getPopOutData from "@/lib/getPopOutData";
import getFooterData from "@/lib/getFooterData";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";
import FounderServicesClient from "./FounderServicesClient";
import CTA from "@/components/CTA";

const PAGE_ID = "4577";

function getHeroVideoBlock(flexibleContent) {
  if (!Array.isArray(flexibleContent)) return null;
  return (
    flexibleContent.find(
      (item) =>
        item?.fieldGroupName ===
        "Page_Flexiblecontent_FlexibleContent_HeroVideo"
    ) ?? null
  );
}

export default async function FounderServicesPageView({ preview = false }) {
  const [
    { title, content },
    flexibleContent,
    popOutData,
    footerData,
    meganavLinks,
    meganavData,
  ] = await Promise.all([
    getPageTitleAndContent(PAGE_ID, preview),
    getFlexiblePage(PAGE_ID, preview),
    getPopOutData(),
    getFooterData(),
    getMeganavLinksLite(),
    getMeganavDataLite(),
  ]);

  const videoData = getHeroVideoBlock(flexibleContent);

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta,
  };

  return (
    <FounderServicesClient
      title={title}
      content={content}
      videoData={videoData}
      popOutData={popOutData}
      meganavLinks={meganavLinks}
      meganavData={meganavData}
    >
      <CTA data={ctaData} />
    </FounderServicesClient>
  );
}
