import getFlexiblePage from "@/lib/getFlexiblePage";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";
import Container from "@/components/Container";
import Form from "@/components/Form";

export async function generateMetadata() {
  return await generateMetadataFromLib("1566");
}

export default async function ContactPage() {
  const flexibleContent = await getFlexiblePage("1566");
  const { title, content } = await getPageTitleAndContent("1566");
  const popOutData = await getPopOutData();
  const footerData = await getFooterData();

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta
  };

  return (
    <>
      <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white pt-16 relative">
          <Container className="py-40 2xl:pt-50 relative z-10 flex flex-col lg:flex-row justify-between gap-10">
            <div className="w-full lg:w-1/2">
              <div className="text-xl mb-3">Oxford researchers &amp; innovators</div>
              {title && <h1 className="text-4xl md:text-6xl/18 mb-10" dangerouslySetInnerHTML={{ __html: title }} />}
              {content && <div className="text-base md:text-lg mb-10" dangerouslySetInnerHTML={{ __html: content }} />}
            </div>
            <div className="w-full lg:w-2/5">
              <div className="text-base md:text-lg mb-10">
                Use this short form to get in touch and tell us about your research.
              </div>
              <Form />
            </div>
          </Container>
      </div>
      <FlexiblePageClient 
        flexibleContent={flexibleContent} 
        popOutData={popOutData}
      />
      <CTA data={ctaData} />
    </>
  );
} 