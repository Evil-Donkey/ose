import getFlexiblePage from "@/lib/getFlexiblePage";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";

export async function generateMetadata() {
  return await generateMetadataFromLib("1251");
}

export default async function HowPage() {
  const flexibleContent = await getFlexiblePage("1251");
  const { title } = await getPageTitleAndContent("1251");
  const popOutData = await getPopOutData();

  return (
    <FlexiblePageClient 
      flexibleContent={flexibleContent} 
      popOutData={popOutData}
      title={title}
      titleInHero={true}
      fixedHeader={true}
    />
  );
} 