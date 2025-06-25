import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import getFooterData from "@/lib/getFooterData";
import FlexiblePage from "@/components/Templates/FlexiblePage";

export async function generateMetadata() {
  return await generateMetadataFromLib("9");
}

export default async function WhatPage() {
  const flexibleContent = await getFlexiblePage("9");
  const popOutData = await getPopOutData();
  const footerData = await getFooterData();
  return <FlexiblePage 
    flexibleContent={flexibleContent} 
    hideNavigation={false} 
    hideHeroVideo={false} 
    popOutData={popOutData}
    footerData={footerData}
  />;
} 