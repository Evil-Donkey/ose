import generateMetadataFromLib from "@/lib/generateMetadata";
import FounderServicesPageView from "./FounderServicesPageView";

export async function generateMetadata() {
  return await generateMetadataFromLib("4577");
}

export default async function FounderServicesPage() {
  return <FounderServicesPageView />;
}
