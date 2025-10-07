import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";
import getNewsItems from "@/lib/getNewsItems";
import getNewsCategories from "@/lib/getNewsCategories";
import News from "@/components/News";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";

export async function generateMetadata() {
  return await generateMetadataFromLib("1573");
}

export default async function ContactPage() {
  const [flexibleContent, popOutData, footerData, newsItems, newsCategories, meganavLinks, meganavData] = await Promise.all([
    getFlexiblePage("1573"),
    getPopOutData(),
    getFooterData(),
    getNewsItems(),
    getNewsCategories(),
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
      <News newsItems={newsItems} newsCategories={newsCategories} />
      <FlexiblePageClient 
        flexibleContent={flexibleContent} 
        popOutData={popOutData}
        meganavLinks={meganavLinks}
        meganavData={meganavData}
      />
      <CTA data={ctaData} />
    </>
  );
} 