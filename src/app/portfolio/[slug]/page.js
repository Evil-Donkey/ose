import getPortfolioItems from "@/lib/getPortfolioItems";
import Container from "@/components/Container";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import Image from "next/image";
import { X as XIcon, LinkedIn as LinkedInIcon } from "@/components/Icons/Social";
import Button from "@/components/Button";

export default async function PortfolioSinglePage({ params }) {
  const { slug } = await params;
  const items = await getPortfolioItems();
  // Sort items alphabetically by title for navigation
  const sortedItems = items.slice().sort((a, b) => a.title.localeCompare(b.title));
  const item = sortedItems.find(i => i.slug === slug);

  const { title, content, featuredImage, portfolioFields, portfolioCategories, portfolioStages } = item;
  const { logo, portfolioTitle, websiteUrl, linkedinUrl, xUrl } = portfolioFields;

  if (!item) {
    return <Container className="pt-50 pb-20"><h1>Portfolio item not found</h1></Container>;
  }

  return (
    <>
        <HeaderWithMeganavLinks fixed={true} />
        <div className="py-20 min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative" style={{
            backgroundImage: featuredImage ? `url(${featuredImage.node.mediaItemUrl})` : undefined
        }}>
            <div className="absolute inset-0 bg-black/30" />
            {featuredImage.node.altText && <div className="absolute bottom-8 right-10 text-white text-sm">{featuredImage.node.altText}</div>}
            <div className="w-full md:w-200 mx-auto text-center text-white relative">
                {logo 
                    ? <Image src={logo.mediaItemUrl} alt={logo.altText} width={1000} height={1000} className="object-contain h-auto w-full" />
                    : <h1 className="text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: title }} />
                }
            </div>
        </div>

        <div className="bg-linear-to-t from-black/10 via-black/0 to-black/0">
            <Container className="py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        {title && <h1 className="text-2xl lg:text-3xl font-medium text-lightblue">{title}</h1>}
                        {portfolioTitle && <h2 className="text-2xl lg:text-3xl font-medium">{portfolioTitle}</h2>}
                        {content && <div className="mt-4 flex flex-col gap-4 text-base lg:text-lg" dangerouslySetInnerHTML={{ __html: content }} />}
                    </div>
                    <div>
                        {/* Sector and Stage Box */}
                        <div className="bg-[#E9E9E9] rounded-xl p-6 mb-2">
                            <div className="text-lightblue text-2xl lg:text-3xl font-medium mb-2">Sector</div>
                            <div className="text-lg mb-4">
                                {portfolioCategories?.nodes && portfolioCategories.nodes.length > 0 && (
                                    (() => {
                                        // Only use categories associated with this item
                                        const parents = portfolioCategories.nodes.filter(cat => !cat.parentId);
                                        const children = portfolioCategories.nodes.filter(cat => cat.parentId);
                                        return parents.length > 0 ? parents.map(parent => {
                                            const childCats = children.filter(child => child.parentId === parent.id);
                                            return (
                                                <div key={parent.id}>
                                                    <span className="font-bold text-blue-02">{parent.name}</span>
                                                    {childCats.length > 0 && (
                                                        <>
                                                            <span className="text-blue-02"> – </span>
                                                            {childCats.map((child, idx) => (
                                                                <span key={child.id} className="text-blue-02">
                                                                    {child.name}{idx < childCats.length - 1 ? ", " : ""}
                                                                </span>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        }) : (
                                            // If no parents, just show all as flat list
                                            <div>
                                                {portfolioCategories.nodes.map((cat, idx) => (
                                                    <span key={cat.id} className="text-darkblue">
                                                        {cat.name}{idx < portfolioCategories.nodes.length - 1 ? ", " : ""}
                                                    </span>
                                                ))}
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                            {portfolioStages?.nodes && portfolioStages.nodes.length > 0 && (
                                <>
                                    <div className="text-lightblue text-2xl lg:text-3xl font-medium mb-2 mt-4">Stage</div>
                                    <div className="text-lg text-blue-02">
                                            <ul>
                                                {portfolioStages.nodes.map(stage => (
                                                    <li key={stage.id}>{stage.name}</li>
                                                ))}
                                            </ul>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* Contact Box */}
                        {(websiteUrl || xUrl || linkedinUrl) && (
                            <div className="bg-[#E9E9E9] rounded-xl p-6 mt-2">
                                <div className="text-lightblue text-2xl lg:text-3xl font-medium mb-4">Contact</div>
                                <div className="flex flex-col gap-3 text-lg">
                                    {websiteUrl && (
                                        <div className="flex items-center gap-3 text-blue-02">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" width="26" height="26"><circle cx="13" cy="13" r="13" fill="#00a0cc"/><path d="M13 7a6 6 0 100 12 6 6 0 000-12zm0 10.5A4.5 4.5 0 1117.5 13 4.5 4.5 0 0113 17.5zm0-8A3.5 3.5 0 1016.5 13 3.5 3.5 0 0013 9.5z" fill="#fff"/></svg>
                                            <a href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{websiteUrl.replace(/^https?:\/\//, "")}</a>
                                        </div>
                                    )}
                                    {xUrl && (
                                        <div className="flex items-center gap-3 text-blue-02">
                                            <XIcon />
                                            <a href={`https://x.com/${xUrl.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline">@{xUrl.replace(/^@/, "")}</a>
                                        </div>
                                    )}
                                    {linkedinUrl && (
                                        <div className="flex items-center gap-3 text-blue-02">
                                            <LinkedInIcon />
                                            <a href={linkedinUrl.startsWith('http') ? linkedinUrl : `https://linkedin.com/in/${linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{linkedinUrl.replace(/^https?:\/\//, "")}</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* TO DO: Add navigation here */}
                {(() => {
                    const currentIndex = sortedItems.findIndex(i => i.slug === slug);
                    const prev = currentIndex > 0 ? sortedItems[currentIndex - 1] : null;
                    const next = currentIndex < sortedItems.length - 1 ? sortedItems[currentIndex + 1] : null;
                    return (
                        <div className="grid grid-cols-2 gap-8 mt-16">
                            <div className="justify-self-end">
                                {prev && (
                                    <Button href={`/portfolio/${prev.slug}`}>Previous</Button>
                                )}
                            </div>
                            <div>
                                {next && (
                                    <Button href={`/portfolio/${next.slug}`}>Next</Button>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </Container>
        </div>
    </>
  );
} 