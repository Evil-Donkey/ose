import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import getPortfolioItems from "@/lib/getPortfolioItems";
import getPortfolioCategories from "@/lib/getPortfolioCategories";
import getPortfolioStages from "@/lib/getPortfolioStages";
import generateMetadataFromLib from "@/lib/generateMetadata";
import PortfolioClient from "./PortfolioClient";

export async function generateMetadata() {
  return await generateMetadataFromLib("250");
}

export default async function PortfolioPage() {
  const { title, content } = await getPageTitleAndContent("250");
  const portfolioItems = await getPortfolioItems();
  const categories = await getPortfolioCategories();
  const stages = await getPortfolioStages();

  return (
    <PortfolioClient
      title={title}
      content={content}
      portfolioItems={portfolioItems}
      categories={categories}
      stages={stages}
    />
  );
} 