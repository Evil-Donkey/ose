import { draftMode } from "next/headers";
import generateMetadataFromLib from "@/lib/generateMetadata";
import FounderServicesPageView from "./FounderServicesPageView";

export async function generateMetadata() {
  return await generateMetadataFromLib("4577");
}

export default async function FounderServicesPage() {
  const { isEnabled } = await draftMode();
  return <FounderServicesPageView preview={isEnabled} />;
}
