import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";

export async function generateMetadata() {
  return await generateMetadataFromLib("26");
}

export default async function WhatPage() {
  const flexibleContent = await getFlexiblePage("26");
  const popOutData = await getPopOutData();
  return (
    <FlexiblePageClient 
      flexibleContent={flexibleContent} 
      popOutData={popOutData}
    />
  );
} 