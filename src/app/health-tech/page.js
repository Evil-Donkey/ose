import getFlexiblePage from "@/lib/getFlexiblePage";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";

export async function generateMetadata() {
  return await generateMetadataFromLib("1249");
}

export default async function HowPage() {
  const [flexibleContent, { title }, popOutData, footerData, meganavLinks, meganavData] = await Promise.all([
    getFlexiblePage("1249"),
    getPageTitleAndContent("1249"),
    getPopOutData(),
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
    <FlexiblePageClient 
      flexibleContent={flexibleContent} 
      popOutData={popOutData}
      title={title}
      titleInHero={true}
      fixedHeader={true}
      meganavLinks={meganavLinks}
      meganavData={meganavData}
    >
      <CTA data={ctaData} />
    </FlexiblePageClient>
  );
} 