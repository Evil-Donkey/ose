import getFlexiblePage from "@/lib/getFlexiblePage";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";

export async function generateMetadata() {
  return await generateMetadataFromLib("1251");
}

export default async function HowPage() {
  const flexibleContent = await getFlexiblePage("1251");
  const { title } = await getPageTitleAndContent("1251");
  const popOutData = await getPopOutData();
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
        titleInHero={true}
        fixedHeader={true}
      />
      <CTA data={ctaData} />
    </>
  );
} 