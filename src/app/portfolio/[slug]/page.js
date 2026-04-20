import Image from "next/image";
import getPortfolioBySlug from "@/lib/getPortfolioBySlug";
import getPortfolioItems from "@/lib/getPortfolioItems";
import Container from "@/components/Container";
import HeaderServer from "@/components/Header/HeaderServer";
import { X as XIcon, LinkedIn as LinkedInIcon } from "@/components/Icons/Social";
import Button from "@/components/Button";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);

  if (!item) return { title: "Portfolio Item Not Found" };

  return {
    title: item.title,
    description: item.content ? item.content.replace(/<[^>]*>/g, "").substring(0, 160) : "",
  };
}

export default async function PortfolioSinglePage({ params }) {
  const { slug } = await params;

  const [item, items] = await Promise.all([
    getPortfolioBySlug(slug),
    getPortfolioItems(),
  ]);

  if (!item) {
    return (
      <>
        <HeaderServer fixed={true} />
        <Container className="pt-50 pb-20"><h1>Portfolio item not found</h1></Container>
      </>
    );
  }

  const { title, content, featuredImage, portfolioFields, portfolioCategories, portfolioStages } = item;
  const { logo, portfolioTitle, websiteUrl, linkedinUrl, xUrl } = portfolioFields || {};

  const sortedItems = items.slice().sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  const currentIndex = sortedItems.findIndex(i => i.slug === slug);
  const hasNav = sortedItems.length > 1 && currentIndex !== -1;
  const prev = hasNav ? (currentIndex > 0 ? sortedItems[currentIndex - 1] : sortedItems[sortedItems.length - 1]) : null;
  const next = hasNav ? (currentIndex < sortedItems.length - 1 ? sortedItems[currentIndex + 1] : sortedItems[0]) : null;

  const heroImageUrl = featuredImage?.node?.mediaItemUrl;
  const heroCaption = featuredImage?.node?.caption;
  const heroAlt = featuredImage?.node?.altText || title || "";

  const parentCategories = portfolioCategories?.nodes?.filter(cat => !cat.parentId) || [];
  const childCategories = portfolioCategories?.nodes?.filter(cat => cat.parentId) || [];
  const stages = portfolioStages?.nodes || [];

  return (
    <>
      <HeaderServer fixed={true} />
      <div className="mt-30 pb-20 min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 relative overflow-hidden">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
        {heroCaption && (
          <div className="absolute bottom-8 right-10 text-white text-sm z-10">{heroCaption}</div>
        )}
        <div className="w-full md:w-200 mx-auto text-center text-white relative z-10">
          {logo?.mediaItemUrl ? (
            <Image
              src={logo.mediaItemUrl}
              alt={logo.altText || title || ""}
              width={logo.mediaDetails?.width || 600}
              height={logo.mediaDetails?.height || 300}
              priority
              unoptimized={logo.mediaItemUrl.endsWith(".svg")}
              className="object-contain h-auto w-full"
            />
          ) : (
            title && <h1 className="text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: title }} />
          )}
        </div>
      </div>

      <div className="bg-linear-to-t from-black/10 via-black/0 to-black/0">
        <Container className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              {title && (
                <h1
                  className="text-2xl lg:text-3xl font-medium text-lightblue mb-4"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
              {portfolioTitle && (
                <h2 className="text-2xl lg:text-3xl font-medium">{portfolioTitle}</h2>
              )}
              {content && (
                <div
                  className="mt-4 flex flex-col gap-4 text-base lg:text-lg"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>
            <div>
              {(parentCategories.length > 0 || stages.length > 0) && (
                <div className="bg-[#E9E9E9] rounded-xl p-6 mb-2">
                  {parentCategories.length > 0 && (
                    <>
                      <div className="text-lightblue text-2xl lg:text-3xl font-medium mb-2">Sector</div>
                      <div className="text-lg mb-4">
                        {parentCategories.map(parent => {
                          const children = childCategories.filter(child => child.parentId === parent.id);
                          return (
                            <div key={parent.id}>
                              <span className="font-bold text-blue-02">{parent.name}</span>
                              {children.length > 0 && (
                                <>
                                  <span className="text-blue-02"> – </span>
                                  {children.map((child, idx) => (
                                    <span key={child.id} className="text-blue-02">
                                      {child.name}
                                      {idx < children.length - 1 ? ", " : ""}
                                    </span>
                                  ))}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                  {stages.length > 0 && (
                    <>
                      <div className="text-lightblue text-2xl lg:text-3xl font-medium mb-2 mt-4">Stage</div>
                      <div className="text-lg text-blue-02">
                        <ul>
                          {stages.map(stage => (
                            <li key={stage.id}>{stage.name}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
              {(websiteUrl || xUrl || linkedinUrl) && (
                <div className="bg-[#E9E9E9] rounded-xl p-6 mt-2">
                  <div className="text-lightblue text-2xl lg:text-3xl font-medium mb-4">Contact</div>
                  <div className="flex flex-col gap-3 text-lg">
                    {websiteUrl && (
                      <div className="flex items-center gap-3 text-blue-02">
                        <a
                          href={websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {websiteUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                    {xUrl && (
                      <div className="flex items-center gap-3 text-blue-02">
                        <XIcon />
                        <a
                          href={`https://x.com/${xUrl.replace(/^@/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          @{xUrl.replace(/^@/, "")}
                        </a>
                      </div>
                    )}
                    {linkedinUrl && (
                      <div className="flex items-center gap-3 text-blue-02">
                        <LinkedInIcon />
                        <a
                          href={linkedinUrl.startsWith("http") ? linkedinUrl : `https://linkedin.com/in/${linkedinUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {linkedinUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {prev && next && (
            <div className="flex justify-center gap-8 mt-16">
              <Button className="w-40!" href={`/portfolio/${prev.slug}`}>Previous</Button>
              <Button className="w-40!" href={`/portfolio/${next.slug}`}>Next</Button>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
