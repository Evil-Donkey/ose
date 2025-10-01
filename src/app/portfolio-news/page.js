import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";
import getPortfolioNewsItems from "@/lib/getPortfolioNewsItems";
import getPortfolioNewsCategories from "@/lib/getPortfolioNewsCategories";
import PortfolioNews from "@/components/PortfolioNews";

export async function generateMetadata() {
  return await generateMetadataFromLib("1573");
}

export default async function ContactPage() {
  // const flexibleContent = await getFlexiblePage("1573");
  const popOutData = await getPopOutData();
  const footerData = await getFooterData();
  const portfolioNewsItems = await getPortfolioNewsItems();
  const portfolioNewsCategories = await getPortfolioNewsCategories();
  
  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta
  };

  return (
    <>
      <PortfolioNews portfolioNewsItems={portfolioNewsItems} portfolioNewsCategories={portfolioNewsCategories} />
      <FlexiblePageClient 
        popOutData={popOutData}
      />
      <CTA data={ctaData} />
    </>
  );
} 