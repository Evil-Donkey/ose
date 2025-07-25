import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";
import getNewsItems from "@/lib/getNewsItems";
import getNewsCategories from "@/lib/getNewsCategories";
import News from "@/components/News";

export async function generateMetadata() {
  return await generateMetadataFromLib("1573");
}

export default async function ContactPage() {
  const flexibleContent = await getFlexiblePage("1573");
  const popOutData = await getPopOutData();
  const footerData = await getFooterData();
  const newsItems = await getNewsItems();
  const newsCategories = await getNewsCategories();
  
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
      />
      <CTA data={ctaData} />
    </>
  );
} 