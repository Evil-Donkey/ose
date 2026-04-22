import CoinvestorsContactFormPageView from "./CoinvestorsContactFormPageView";
import generateMetadataFromLib from "@/lib/generateMetadata";

export async function generateMetadata() {
  return await generateMetadataFromLib("3487");
}

export default async function ContactPage() {
  return <CoinvestorsContactFormPageView preview={false} />;
}
