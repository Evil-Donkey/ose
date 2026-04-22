import StoriesPageView from "./StoriesPageView";
import generateMetadataFromLib from "@/lib/generateMetadata";

export async function generateMetadata() {
  return await generateMetadataFromLib("1254");
}

export default async function StoriesPage() {
  return <StoriesPageView preview={false} />;
}
