import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import Container from "@/components/Container";
import HeaderServer from "@/components/Header/HeaderServer";

export async function generateMetadata() {
  return await generateMetadataFromLib("1623");
}

export default async function SustainabilityPage() {
    const { title, content } = await getPageTitleAndContent("1623");

  return (
    <>
    <HeaderServer fixed={true} />
    <Container className="pb-20 pt-50">
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