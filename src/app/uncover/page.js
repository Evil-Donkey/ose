import UncoverPageView from "./UncoverPageView";
import generateMetadataFromLib from "@/lib/generateMetadata";

export async function generateMetadata() {
  return await generateMetadataFromLib("1704");
}

export default async function UncoverPage() {
  return <UncoverPageView preview={false} />;
}
