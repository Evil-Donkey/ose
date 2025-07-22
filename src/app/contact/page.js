import getFlexiblePage from "@/lib/getFlexiblePage";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";
import Contact from "@/components/Contact";

export async function generateMetadata() {
  return await generateMetadataFromLib("1274");
}

export default async function ContactPage() {
  const flexibleContent = await getFlexiblePage("1274");
  const { title, featuredImage } = await getPageTitleAndContent("1274");
  const popOutData = await getPopOutData();
  const footerData = await getFooterData();

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
      />
      <CTA data={ctaData} />
    </>
  );
} 