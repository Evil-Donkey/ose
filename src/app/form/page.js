import FormPageView from "./FormPageView";
import generateMetadataFromLib from "@/lib/generateMetadata";

export async function generateMetadata() {
  return await generateMetadataFromLib("1566");
}

export default async function FormPage() {
  return <FormPageView preview={false} />;
}
