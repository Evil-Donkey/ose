import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import getPortfolioBySlug from "@/lib/getPortfolioBySlug";
import Container from "@/components/Container";
import HeaderServer from "@/components/Header/HeaderServer";
import ResponsiveImage from "@/components/ResponsiveImage";
import { X as XIcon, LinkedIn as LinkedInIcon } from "@/components/Icons/Social";
import { getOptimizedImageProps } from "@/lib/imageUtils";
import { proxyImageUrl } from "@/lib/proxyImage";

export const metadata = { title: "Preview" };

export default async function PortfolioPreviewPage({ params }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) notFound();

  const { slug } = await params;
  const item = await getPortfolioBySlug(slug, true);

  if (!item) notFound();

  const { title, content, featuredImage, portfolioFields, portfolioCategories, portfolioStages } = item;
  const { logo, portfolioTitle, websiteUrl, linkedinUrl, xUrl } = portfolioFields || {};

  return (
    <>
      <HeaderServer fixed={true} />
      <div
        className="mt-30 pb-20 min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 bg-cover bg-center relative"
        style={{
          backgroundImage: featuredImage
            ? `url(${proxyImageUrl(featuredImage.node.mediaItemUrl, true)})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        {featuredImage?.node?.caption && (
          <div className="absolute bottom-8 right-10 text-white text-sm">
            {featuredImage.node.caption}
          </div>
        )}
        <div className="w-full md:w-200 mx-auto text-center text-white relative">
          {logo ? (
            <ResponsiveImage
              {...getOptimizedImageProps(logo, {
                context: "content",
                isAboveFold: true,
                className: "object-contain h-auto w-full",
              })}
            />
          ) : (
            <h1 className="text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: title }} />
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
              <div className="bg-[#E9E9E9] rounded-xl p-6 mb-2">
                <div className="text-lightblue text-2xl lg:text-3xl font-medium mb-2">Sector</div>
                <div className="text-lg mb-4">
                  {portfolioCategories?.nodes && portfolioCategories.nodes.length > 0 && (() => {
                    const parents = portfolioCategories.nodes.filter((cat) => !cat.parentId);
                    const children = portfolioCategories.nodes.filter((cat) => cat.parentId);
                    return parents.length > 0 ? (
                      parents.map((parent) => {
                        const childCats = children.filter((child) => child.parentId === parent.id);
                        return (
                          <div key={parent.id}>
                            <span className="font-bold text-blue-02">{parent.name}</span>
                            {childCats.length > 0 && (
                              <>
                                <span className="text-blue-02"> – </span>
                                {childCats.map((child, idx) => (
                                  <span key={child.id} className="text-blue-02">
                                    {child.name}
                                    {idx < childCats.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div>
                        {portfolioCategories.nodes.map((cat, idx) => (
                          <span key={cat.id} className="text-darkblue">
                            {cat.name}
                            {idx < portfolioCategories.nodes.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>
                {portfolioStages?.nodes && portfolioStages.nodes.length > 0 && (
                  <>
                    <div className="text-lightblue text-2xl lg:text-3xl font-medium mb-2 mt-4">Stage</div>
                    <div className="text-lg text-blue-02">
                      <ul>
                        {portfolioStages.nodes.map((stage) => (
                          <li key={stage.id}>{stage.name}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
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
                          href={
                            linkedinUrl.startsWith("http")
                              ? linkedinUrl
                              : `https://linkedin.com/in/${linkedinUrl}`
                          }
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
        </Container>
      </div>
    </>
  );
}
