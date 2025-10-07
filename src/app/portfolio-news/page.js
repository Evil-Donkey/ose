import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";
import getPortfolioNewsItems from "@/lib/getPortfolioNewsItems";
import getPortfolioNewsCategories from "@/lib/getPortfolioNewsCategories";
import PortfolioNews from "@/components/PortfolioNews";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";

export async function generateMetadata() {
  return await generateMetadataFromLib("1573");
}

export default async function ContactPage() {
  // const flexibleContent = await getFlexiblePage("1573");
  const [popOutData, footerData, portfolioNewsItems, portfolioNewsCategories, meganavLinks, meganavData] = await Promise.all([
    getPopOutData(),
    getFooterData(),
    getPortfolioNewsItems(),
    getPortfolioNewsCategories(),
    getMeganavLinksLite(),
    getMeganavDataLite()
  ]);
  
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
        meganavLinks={meganavLinks}
        meganavData={meganavData}
      />
      <CTA data={ctaData} />
    </>
  );
} 