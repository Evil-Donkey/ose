import ContactPageView from "./ContactPageView";
import generateMetadataFromLib from "@/lib/generateMetadata";

export async function generateMetadata() {
  return await generateMetadataFromLib("1274");
}

export default async function ContactPage() {
  return <ContactPageView preview={false} />;
}
