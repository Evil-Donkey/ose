import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import getNewsBySlug from "@/lib/getNewsBySlug";
import Container from "@/components/Container";
import HeaderServer from "@/components/Header/HeaderServer";
import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

export const metadata = { title: "Preview" };

export default async function NewsPreviewPage({ params }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) notFound();

  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) notFound();

  const { title, content, featuredImage, categories, date } = item;

  return (
    <>
      <HeaderServer fixed={false} />
      <div className="text-white pt-16 relative pb-4 lg:pb-0 lg:min-h-screen">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('/gradient.png')] top-0 left-0 w-full lg:h-[calc(100%-80px)]" />
        <Container className="pt-30 relative z-10">
          <div className="flex flex-col gap-4 lg:px-40">
            <Link href="/news" className="text-white text-base font-medium mb-5 flex">
              &lt; Back to News
            </Link>

            <div className="space-y-4">
              {categories?.nodes?.map((category) => (
                <span
                  key={category.id}
                  className="inline-block bg-lightblue-02 text-blue-02 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide"
                >
                  {category.name}
                </span>
              ))}

              {date && <p className="text-sm font-medium text-white">{formatDate(date)}</p>}
              {title && (
                <h1
                  className="text-4xl 2xl:lg:text-6xl/18 text-white mb-10"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
            </div>

            {featuredImage && (
              <div
                style={{ backgroundImage: `url(${featuredImage.node.mediaItemUrl})` }}
                className="aspect-6/3 h-auto w-full rounded-2xl bg-cover bg-center bg-no-repeat"
              />
            )}
          </div>
        </Container>
      </div>

      <div className="bg-linear-to-t from-black/10 via-black/0 to-black/0">
        <Container className="pt-10 pb-20 lg:pb-20">
          <div className="flex flex-col gap-4 lg:px-40">
            {content && (
              <div
                className="mt-4 flex flex-col gap-4 text-base lg:text-lg prose max-w-none text-blue-02 prose-p:mb-1 prose-p:mt-0 prose-strong:text-blue-02 prose-h2:text-darkblue prose-h2:mb-0 prose-h2:mt-3 prose-h2:text-xl prose-a:text-blue-02 prose-a:underline prose-ul:m-0 marker:text-lightblue"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </Container>
      </div>
    </>
  );
}
