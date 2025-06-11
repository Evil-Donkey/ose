import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import FlexiblePage from "@/components/Templates/FlexiblePage";

export async function generateMetadata() {
  return await generateMetadataFromLib("241");
}

export default async function WhatPage() {
  const flexibleContent = await getFlexiblePage("241");
  return <FlexiblePage 
    flexibleContent={flexibleContent} 
    hideNavigation={false} 
    hideHeroVideo={false} 
  />;
} 