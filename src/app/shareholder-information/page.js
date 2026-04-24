import ShareholderPortalView from "./ShareholderPortalView";
import generateMetadataFromLib from "@/lib/generateMetadata";

export async function generateMetadata() {
  return await generateMetadataFromLib("1597");
}

export default async function InvestorPortal() {
  return <ShareholderPortalView preview={false} />;
}
