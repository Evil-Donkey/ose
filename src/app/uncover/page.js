import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import Container from "@/components/Container";
import Image from "next/image";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import Link from "next/link";
import getFooterData from "@/lib/getFooterData";
import CTA from "@/components/CTA";

export async function generateMetadata() {
  return await generateMetadataFromLib("1704");
}

export default async function UncoverPage() {
    const { title, content, featuredImage, secondaryTitle } = await getPageTitleAndContent("1704");
    const footerData = await getFooterData();

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta
  };

  return (
    <>
      <HeaderWithMeganavLinks fixed={true} />
      {featuredImage && 
        <div className="relative mt-30 h-[500px]">
          <Image src={featuredImage} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {title && <h1 className="text-5xl md:text-[7rem]/30 2xl:text-[9rem]/50 tracking-tight text-white">{title}</h1>}
            {secondaryTitle && <h2 className="w-full md:w-200 text-2xl md:text-4xl 2xl:text-5xl text-white mt-3">{secondaryTitle}</h2>}
          </div>
        </div>
      }
      <div className="bg-linear-to-t from-black/10 via-black/0 to-black/0">
        <Container className="pt-20 pb-30">
            <div className="flex flex-col gap-4 xl:px-40">
                <div className="space-y-4">
                  {content && (
                    <div
                      className="mt-4 flex flex-col gap-4 text-base lg:text-lg"
                      dangerouslySetInnerHTML={{
                        __html: content.replace(
                          /<ul>/g,
                          '<ul class="list-disc list-inside marker:text-lightblue">'
                        ),
                      }}
                    />
                  )}
                </div>
            </div>
        </Container>
      </div>

      <CTA data={ctaData} />
    </>
  );
} 