import getFlexiblePage from "@/lib/getFlexiblePage";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import getPopOutData from "@/lib/getPopOutData";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";
import FounderServicesClient from "./FounderServicesClient";

const PAGE_ID = "4577";

const HERO_VIDEO_FIELD =
  "Page_Flexiblecontent_FlexibleContent_HeroVideo";

const CENTERED_CTA_FIELD =
  "Page_Flexiblecontent_FlexibleContent_CenteredCta";

const FOUNDER_SERVICES_CTA_LABEL = "Start the conversation";

function getHeroVideoBlock(flexibleContent) {
  if (!Array.isArray(flexibleContent)) return null;
  return (
    flexibleContent.find((item) => item?.fieldGroupName === HERO_VIDEO_FIELD) ??
    null
  );
}

function getBodyFlexibleContent(flexibleContent) {
  if (!Array.isArray(flexibleContent)) return [];
  return flexibleContent
    .filter((item) => item?.fieldGroupName !== HERO_VIDEO_FIELD)
    .map((item) => {
      // Force the single CTA label; the modal provider opens the /form enquiry form.
      if (item?.fieldGroupName !== CENTERED_CTA_FIELD) return item;
      return {
        ...item,
        ctaLabel: FOUNDER_SERVICES_CTA_LABEL,
        ctaUrl: item.ctaUrl || "/form",
      };
    });
}

export default async function FounderServicesPageView({ preview = false }) {
  const [
    { title, content },
    flexibleContent,
    popOutData,
    meganavLinks,
    meganavData,
  ] = await Promise.all([
    getPageTitleAndContent(PAGE_ID, preview),
    getFlexiblePage(PAGE_ID, preview),
    getPopOutData(),
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
      popOutData={popOutData}
      meganavLinks={meganavLinks}
      meganavData={meganavData}
    />
  );
}
