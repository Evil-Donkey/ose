import SustainabilityPageView from "./SustainabilityPageView";
import generateMetadataFromLib from "@/lib/generateMetadata";

export async function generateMetadata() {
  return await generateMetadataFromLib("1586");
}

export default async function SustainabilityPage() {
  return <SustainabilityPageView preview={false} />;
}
