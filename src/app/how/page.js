import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";

export async function generateMetadata() {
  return await generateMetadataFromLib("241");
}

export default async function HowPage() {
  const [flexibleContent, popOutData, footerData, meganavLinks, meganavData] = await Promise.all([
    getFlexiblePage("241"),
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
      meganavLinks={meganavLinks}
      meganavData={meganavData}
    >
      <CTA data={ctaData} />
    </FlexiblePageClient>
  );
} 