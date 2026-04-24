import ShareholderPortalSignupView from "./ShareholderPortalSignupView";
import generateMetadataFromLib from "@/lib/generateMetadata";

export async function generateMetadata() {
  return await generateMetadataFromLib("1597");
}

export default async function ShareholderPortalSignupPage() {
  return <ShareholderPortalSignupView preview={false} />;
}
