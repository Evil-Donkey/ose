import getStoryData from "@/lib/getStoryData";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import getStoriesItems from "@/lib/getStoriesItems";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Button from "@/components/Button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import getFooterData from "@/lib/getFooterData";
import CTA from "@/components/CTA";

gsap.registerPlugin(ScrollTrigger);

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const stories = await getStoriesItems();
  const story = stories.find(s => s.slug === resolvedParams.slug);
  
  if (!story) {
    return {
      title: 'Story Not Found',
    };
  }

  return {
    title: story.title,
    description: story.content ? story.content.replace(/<[^>]*>/g, '').substring(0, 160) : '',
  };
}

export default async function StoryPage({ params }) {
  const resolvedParams = await params;
  const stories = await getStoriesItems();
  const story = stories.find(s => s.slug === resolvedParams.slug);
  
  if (!story) {
    notFound();
  }

  // Find current story index and get previous/next stories
  const currentIndex = stories.findIndex(s => s.slug === resolvedParams.slug);
  const previousStory = currentIndex > 0 ? stories[currentIndex - 1] : null;
  const nextStory = currentIndex < stories.length - 1 ? stories[currentIndex + 1] : null;

  const storyData = await getStoryData(story.databaseId);
  const flexibleContent = storyData.flexibleContent;
  const popOutData = await getPopOutData();
  const footerData = await getFooterData();
  const backgroundImage = story.featuredImage?.node?.mediaItemUrl;
  const title = story.title;
  const content = story.content;

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta
  };

  return (
    <>
        <div className="relative w-full min-h-dvh h-full">
            {backgroundImage && 
                <>
                    <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/40 to-black/0" />
                    {story.featuredImage.node.caption && <div className="hidden lg:block absolute bottom-8 right-8 text-xs 2xl:text-sm lg:text-end mt-10 lg:mt-0 text-white" dangerouslySetInnerHTML={{ __html: story.featuredImage.node.caption }} />}
                </>
            }
            {title &&
                <div className="min-h-dvh h-full">
                    <Container className="py-15 2xl:py-25 relative z-10 text-white flex flex-col h-full min-h-dvh justify-end gap-10 lg:gap-0">
                        <div className="flex flex-col justify-end w-full">
                            <h2 className="text-[2.5rem]/12 md:text-[3.3rem]/16 xl:text-[4rem]/20 2xl:text-[5rem]/22 3xl:text-[7rem]/30 tracking-tight w-4/5 lg:w-1/2">{title}</h2>
                        </div>
                    </Container>
                </div>
            }
        </div>

        <div className="bg-linear-to-t from-black/10 to-black/0 pb-20 2xl:pb-45">
            {content &&
                <Container className="pt-10 md:pt-20 2xl:pt-45 single-story-content">
                    <div className="text-base 2xl:text-lg flex flex-col gap-4 xl:px-20 *:first:text-2xl *:first:mb-5 prose max-w-none text-blue-02 prose-p:mb-1 prose-p:mt-0 prose-h2:text-darkblue prose-h2:mb-0 prose-h2:mt-3 prose-h2:text-xl prose-a:text-blue-02 prose-a:underline" dangerouslySetInnerHTML={{ __html: content }} />
                </Container>
            }

            <div className="mt-16">
                <FlexiblePageClient 
                    flexibleContent={flexibleContent} 
                    popOutData={popOutData}
                    fixedHeader={true}
                />
            </div>

            {/* Story Pagination */}
            <Container className="pt-10 md:pt-25 2xl:pt-45">
                <div className="grid grid-cols-2 gap-8">
                    <div className="justify-self-end">
                        {previousStory ? (
                            <Button href={`/stories/${previousStory.slug}`}>Previous</Button>
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div>
                        {nextStory ? (
                            <Button href={`/stories/${nextStory.slug}`}>Next</Button>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            </Container>
        </div>

        <CTA data={ctaData} />
    </>
  );
} 