import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import Container from "@/components/Container";
import Image from "next/image";
import HeaderServer from "@/components/Header/HeaderServer";
import getFooterData from "@/lib/getFooterData";
import CTA from "@/components/CTA";
import getFlexiblePage from "@/lib/getFlexiblePage";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";

const PAGE_ID = "1704";

export default async function UncoverPageView({ preview = false }) {
  const {
    title,
    content,
    featuredImage,
    featuredImageAltText,
    featuredImageCaption,
    secondaryTitle,
    mobileFeaturedImage,
    mobileFeaturedImageAltText,
  } = await getPageTitleAndContent(PAGE_ID, preview);
  const flexibleContent = await getFlexiblePage(PAGE_ID, preview);
  const popOutData = await getPopOutData();
  const footerData = await getFooterData();

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta,
  };

  return (
    <>
      <HeaderServer fixed={true} />
      {featuredImage && (
        <div className="uncover__hero-image relative mt-30 min-h-[500px] lg:min-h-[700px]">
          <Image
            src={featuredImage}
            alt={featuredImageAltText}
            fill
            className={`object-cover ${mobileFeaturedImage ? "hidden lg:block" : ""}`}
          />
          {mobileFeaturedImage && (
            <Image
              src={mobileFeaturedImage}
              alt={mobileFeaturedImageAltText}
              fill
              className="object-cover lg:hidden"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {title && (
              <h1 className="text-5xl md:text-[7rem]/30 2xl:text-[9rem]/50 tracking-tight text-white">
                {title}
              </h1>
            )}
            {secondaryTitle && (
              <h2 className="w-full md:w-200 text-2xl md:text-4xl 2xl:text-5xl text-white mt-3">
                {secondaryTitle}
              </h2>
            )}
          </div>
          {featuredImageCaption && (
            <div
              className="block absolute bottom-4 right-4 md:bottom-8 md:right-8 text-xs 2xl:text-sm lg:text-end mt-10 lg:mt-0 text-white"
              dangerouslySetInnerHTML={{ __html: featuredImageCaption }}
            />
          )}
        </div>
      )}
      <div className="bg-linear-to-t from-black/10 via-black/0 to-black/0">
        <Container className="pt-20 pb-30">
          <div className="flex flex-col gap-4 xl:px-40">
            <div className="space-y-4">
              {content && (
                <div
                  className="mt-4 flex flex-col gap-2 2xl:gap-4 text-base lg:text-lg"
                  dangerouslySetInnerHTML={{
                    __html: content.replace(
                      /<ul>/g,
                      '<ul class="list-disc list-outside ps-4 marker:text-lightblue">'
                    ),
                  }}
                />
              )}
            </div>
          </div>
        </Container>
      </div>
      <FlexiblePageClient flexibleContent={flexibleContent} popOutData={popOutData} hideHeader={true}>
        <CTA data={ctaData} />
      </FlexiblePageClient>
    </>
  );
}
