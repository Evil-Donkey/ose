import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import Container from "@/components/Container";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";

export async function generateMetadata() {
  return await generateMetadataFromLib("1590");
}

export default async function TermsAndConditionsPage() {
    const { title, content } = await getPageTitleAndContent("1590");

  return (
    <>
    <HeaderWithMeganavLinks fixed={true} />
    <Container className="pt-50 pb-20">
        <div className="flex flex-col gap-4 lg:px-40">
            <div className="space-y-4">
                {title && <h1 className="text-4xl lg:text-6xl/18 text-blue-02 mb-10">{title}</h1>}
                {content && <div className="mt-4 flex flex-col gap-4 text-base lg:text-lg" dangerouslySetInnerHTML={{ __html: content }} />}
            </div>
        </div>
    </Container>
    </>
  );
}