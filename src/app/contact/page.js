import getFlexiblePage from "@/lib/getFlexiblePage";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";
import Contact from "@/components/Contact";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";

export async function generateMetadata() {
  return await generateMetadataFromLib("1274");
}

export default async function ContactPage() {
  const [flexibleContent, { title, featuredImage }, popOutData, footerData, meganavLinks, meganavData] = await Promise.all([
    getFlexiblePage("1274"),
    getPageTitleAndContent("1274"),
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
    <>
      <Contact title={title} featuredImage={featuredImage} footerData={footerData} />
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