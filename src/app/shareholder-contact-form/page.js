import ShareholderContactFormPageView from "./ShareholderContactFormPageView";
import generateMetadataFromLib from "@/lib/generateMetadata";

export async function generateMetadata() {
  return await generateMetadataFromLib("3366");
}

export default async function ContactPage() {
  return <ShareholderContactFormPageView preview={false} />;
}
