import getNewsItems from "@/lib/getNewsItems";
import Container from "@/components/Container";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import Link from "next/link";
import Button from "@/components/Button";
import { formatDate } from "@/lib/formatDate";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const items = await getNewsItems();
    const item = items.find(s => s.slug === resolvedParams.slug);
    
    if (!item) {
      return {
        title: 'News Item Not Found',
      };
    }
  
    return {
      title: item.title,
      description: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 160) : '',
    };
  }

export default async function NewsSinglePage({ params }) {
  const { slug } = await params;
  const items = await getNewsItems();
  // Sort items alphabetically by title for navigation
  const sortedItems = items.slice().sort((a, b) => a.title.localeCompare(b.title));
  const item = sortedItems.find(i => i.slug === slug);

  const { title, content, featuredImage, categories, date } = item;

  if (!item) {
    return <Container className="pt-50 pb-20"><h1>News item not found</h1></Container>;
  }

  return (
    <>
        <HeaderWithMeganavLinks fixed={false} />
        <div className="text-white pt-16 relative pb-4 lg:pb-0 lg:min-h-screen">
            <div className="absolute inset-0 bg-cover bg-center bg-[url('/gradient.png')] top-0 left-0 w-full lg:h-[calc(100%-80px)]" />
            <Container className="pt-30 relative z-10">
                <div className="flex flex-col gap-4 lg:px-40">
                    <Link href="/news" className="text-white text-base font-medium mb-5 flex">&lt; Back to News</Link>

                    <div className="space-y-4">
                        {categories.nodes.map(category => (
                            <span key={category.id} className="inline-block bg-lightblue-02 text-blue-02 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                                {category.name}
                            </span>
                        ))}

                        {/* Date */}
                        <p className="text-sm font-medium text-white">
                        {formatDate(date)}
                        </p>
                        {title && <h1 className="text-4xl 2xl:lg:text-6xl/18 text-white mb-10">{title}</h1>}
                    </div>

                    {featuredImage && <div style={{ backgroundImage: `url(${featuredImage.node.mediaItemUrl})` }} className="aspect-6/3 h-auto w-full rounded-2xl bg-cover bg-center bg-no-repeat" />}
                </div>
            </Container>
        </div>

        <div className="bg-linear-to-t from-black/10 via-black/0 to-black/0">
            <Container className="pt-10 pb-20 lg:pb-20">
                <div className="flex flex-col gap-4 lg:px-40">
                    {content && <div className="mt-4 flex flex-col gap-4 text-base lg:text-lg prose max-w-none text-blue-02 prose-p:mb-1 prose-p:mt-0 prose-h2:text-darkblue prose-h2:mb-0 prose-h2:mt-3 prose-h2:text-xl prose-a:text-blue-02 prose-a:underline" dangerouslySetInnerHTML={{ __html: content }} />}
                </div>

                
                {/* {(() => {
                    const currentIndex = sortedItems.findIndex(i => i.slug === slug);
                    const prev = currentIndex > 0 ? sortedItems[currentIndex - 1] : null;
                    const next = currentIndex < sortedItems.length - 1 ? sortedItems[currentIndex + 1] : null;
                    return (
                        <div className="grid grid-cols-2 gap-8 mt-16">
                            <div className="justify-self-end">
                                {prev && (
                                    <Button href={`/news/${prev.slug}`}>Previous</Button>
                                )}
                            </div>
                            <div>
                                {next && (
                                    <Button href={`/news/${next.slug}`}>Next</Button>
                                )}
                            </div>
                        </div>
                    );
                })()} */}
            </Container>
        </div>
    </>
  );
} 