import getFlexiblePage from "@/lib/getFlexiblePage";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import getPopOutData from "@/lib/getPopOutData";
import getFooterData from "@/lib/getFooterData";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";
import FounderServicesClient from "./FounderServicesClient";

const PAGE_ID = "4577";

const HERO_VIDEO_FIELD =
  "Page_Flexiblecontent_FlexibleContent_HeroVideo";

function getHeroVideoBlock(flexibleContent) {
  if (!Array.isArray(flexibleContent)) return null;
  return (
    flexibleContent.find((item) => item?.fieldGroupName === HERO_VIDEO_FIELD) ??
    null
  );
}

function getBodyFlexibleContent(flexibleContent) {
  if (!Array.isArray(flexibleContent)) return [];
  return flexibleContent.filter(
    (item) => item?.fieldGroupName !== HERO_VIDEO_FIELD
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
  const bodyFlexibleContent = getBodyFlexibleContent(flexibleContent);

  return (
    <FounderServicesClient
      title={title}
      content={content}
      videoData={videoData}
      flexibleContent={bodyFlexibleContent}
      themeCta={footerData.cta}
      popOutData={popOutData}
      meganavLinks={meganavLinks}
      meganavData={meganavData}
    />
  );
}
