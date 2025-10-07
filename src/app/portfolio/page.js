import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import getPortfolioItems from "@/lib/getPortfolioItems";
import getPortfolioCategories from "@/lib/getPortfolioCategories";
import getPortfolioStages from "@/lib/getPortfolioStages";
import generateMetadataFromLib from "@/lib/generateMetadata";
import PortfolioClient from "./PortfolioClient";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";

export async function generateMetadata() {
  return await generateMetadataFromLib("250");
}

export default async function PortfolioPage() {
  const [{ title, content }, portfolioItems, categories, stages, meganavLinks, meganavData] = await Promise.all([
    getPageTitleAndContent("250"),
    getPortfolioItems(),
    getPortfolioCategories(),
    getPortfolioStages(),
    getMeganavLinksLite(),
    getMeganavDataLite()
  ]);

  return (
    <PortfolioClient
      title={title}
      content={content}
      portfolioItems={portfolioItems}
      categories={categories}
      stages={stages}
      meganavLinks={meganavLinks}
      meganavData={meganavData}
    />
  );
} 