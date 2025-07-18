import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";

export async function generateMetadata() {
  return await generateMetadataFromLib("9");
}

export default async function WhatPage() {
  const flexibleContent = await getFlexiblePage("9");
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
      />
      <CTA data={ctaData} />
    </>
  );
} 