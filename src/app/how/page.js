import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";

export async function generateMetadata() {
  return await generateMetadataFromLib("241");
}

export default async function HowPage() {
  const flexibleContent = await getFlexiblePage("241");
  const popOutData = await getPopOutData();
  return (
    <FlexiblePageClient 
      flexibleContent={flexibleContent} 
      popOutData={popOutData}
    />
  );
} 