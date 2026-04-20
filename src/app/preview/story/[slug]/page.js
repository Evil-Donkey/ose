import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import getStoryBySlug from "@/lib/getStoryBySlug";
import getPopOutData from "@/lib/getPopOutData";
import getFooterData from "@/lib/getFooterData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import Container from "@/components/Container";
import CTA from "@/components/CTA";

export const metadata = { title: "Preview" };

export default async function StoryPreviewPage({ params }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) notFound();

  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) notFound();

  const [popOutData, footerData] = await Promise.all([
    getPopOutData(),
    getFooterData(),
  ]);

  const flexibleContent = story.story?.flexibleContent || [];
  const backgroundImage = story.featuredImage?.node?.mediaItemUrl;
  const backgroundImageMobile = story.mobileFeaturedImage?.mobileFeaturedImage?.mediaItemUrl;
  const { title, content } = story;

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta,
  };

  return (
    <>
      <div className="relative w-full min-h-dvh h-full">
        {(backgroundImage || backgroundImageMobile) && (
          <>
            <div
              className={`absolute top-0 left-0 w-full h-full bg-cover bg-center ${backgroundImageMobile ? "hidden lg:block" : ""}`}
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            {backgroundImageMobile && (
              <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center lg:hidden"
                style={{ backgroundImage: `url(${backgroundImageMobile})` }}
              />
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/40 to-black/0" />
            {story.featuredImage?.node?.caption && (
              <div
                className="hidden lg:block absolute bottom-8 right-8 text-xs 2xl:text-sm lg:text-end mt-10 lg:mt-0 text-white"
                dangerouslySetInnerHTML={{ __html: story.featuredImage.node.caption }}
              />
            )}
          </>
        )}
        {title && (
          <div className="min-h-dvh h-full">
            <Container className="py-15 2xl:py-25 relative z-10 text-white flex flex-col h-full min-h-dvh justify-end gap-10 lg:gap-0">
              <div className="flex flex-col justify-end w-full">
                <h2
                  className="text-[2.5rem]/12 md:text-[3.3rem]/16 xl:text-[4rem]/20 2xl:text-[5rem]/22 3xl:text-[7rem]/30 tracking-tight w-4/5 lg:w-1/2"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              </div>
            </Container>
          </div>
        )}
      </div>

      <div className="bg-linear-to-t from-black/10 to-black/0 pb-20 2xl:pb-45">
        {content && (
          <Container className="pt-10 md:pt-20 2xl:pt-45 single-story-content">
            <div
              className="text-base 2xl:text-lg flex flex-col gap-4 xl:px-20 *:first:text-2xl *:first:mb-1 prose max-w-none text-blue-02 prose-p:mb-1 prose-p:mt-0 prose-h2:text-darkblue prose-h2:mb-0 prose-h2:mt-3 prose-h2:text-xl prose-a:text-blue-02 prose-a:underline marker:text-lightblue"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Container>
        )}

        <div className="mt-11">
          <FlexiblePageClient
            flexibleContent={flexibleContent}
            popOutData={popOutData}
            fixedHeader={true}
          />
        </div>
      </div>

      <CTA data={ctaData} />
    </>
  );
}
