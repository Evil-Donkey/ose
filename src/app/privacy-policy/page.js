import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import Container from "@/components/Container";
import HeaderServer from "@/components/Header/HeaderServer";

export async function generateMetadata() {
  return await generateMetadataFromLib("1582");
}

export default async function PrivacyPolicyPage() {
    const { title, content } = await getPageTitleAndContent("1582");

  return (
    <>
    <HeaderServer fixed={true} />
    <Container className="pt-50 pb-20">
        <div className="flex flex-col gap-4 lg:px-40">
            <div className="space-y-4">
                {title && <h1 className="text-4xl lg:text-6xl/18 text-blue-02 mb-10">{title}</h1>}
                {content && <div className="mt-4 flex flex-col gap-4 text-base lg:text-lg prose max-w-none text-blue-02 prose-p:mb-1 prose-p:mt-0 prose-strong:text-blue-02 prose-h2:text-darkblue prose-h2:mb-0 prose-h2:mt-3 prose-h2:text-xl prose-a:text-blue-02 prose-a:underline prose-ul:m-0 marker:text-lightblue" dangerouslySetInnerHTML={{ __html: content }} />}
            </div>
        </div>
    </Container>
    </>
  );
} 