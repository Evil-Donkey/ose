import getPortfolioItems from "@/lib/getPortfolioItems";
import Container from "@/components/Container";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import ResponsiveImage from "../../../components/ResponsiveImage";
import { X as XIcon, LinkedIn as LinkedInIcon } from "@/components/Icons/Social";
import { getOptimizedImageProps } from "../../../lib/imageUtils";
import Button from "@/components/Button";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const items = await getPortfolioItems();
    const item = items.find(s => s.slug === resolvedParams.slug);
    
    if (!item) {
      return {
        title: 'Portfolio Item Not Found',
      };
    }
  
    return {
      title: item.title,
      description: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 160) : '',
    };
  }

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
        <div className="mt-30 pb-20 min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 bg-cover bg-center relative" style={{
            backgroundImage: featuredImage ? `url(${featuredImage.node.mediaItemUrl})` : undefined
        }}>
            <div className="absolute inset-0 bg-black/30" />
            {featuredImage.node.caption && <div className="absolute bottom-8 right-10 text-white text-sm">{featuredImage.node.caption}</div>}
            <div className="w-full md:w-200 mx-auto text-center text-white relative">
                {logo 
                    ? <ResponsiveImage 
                        {...getOptimizedImageProps(logo, {
                            context: 'content',
                            isAboveFold: true,
                            className: "object-contain h-auto w-full"
                        })}
                    />
                    : <h1 className="text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: title }} />
                }
            </div>
        </div>

        <div className="bg-linear-to-t from-black/10 via-black/0 to-black/0">
            <Container className="py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        {title && <h1 className="text-2xl lg:text-3xl font-medium text-lightblue mb-4">{title}</h1>}
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26.2 26.15">
                                              <g id="Layer_1-2" data-name="Layer 1">
                                                <path fill="#03a1cc" d="M12.42,13.78v5.45c-1.23.04-2.46.2-3.67.48-.42.1-.93.3-1.32.38-.05.01-.13.03-.17.01-.33-1.03-.6-2.09-.78-3.16-.17-1.04-.24-2.09-.3-3.14h6.23Z"/>
                                                <path fill="#03a1cc" d="M12.42,6.93v5.45h-6.23c.08-2.14.41-4.27,1.08-6.31.06-.02.11-.01.17.01.43.09.9.28,1.35.38,1.19.27,2.41.43,3.63.47"/>
                                                <path fill="#03a1cc" d="M13.78,12.38l.05-5.44c1.73-.06,3.43-.39,5.09-.87.73,2.01,1.02,4.18,1.1,6.32h-6.23Z"/>
                                                <path fill="#03a1cc" d="M20.01,13.78c-.07,2.14-.37,4.3-1.1,6.32-1.24-.36-2.5-.65-3.79-.79-.18-.02-1.28-.06-1.32-.12l.05-5.41h6.17Z"/>
                                                <path fill="#03a1cc" d="M26.2,12.38h-4.79c-.06-1.25-.17-2.49-.39-3.72-.19-1.05-.47-2.08-.77-3.1l2.54-1.34c2.02,2.21,3.31,5.15,3.41,8.17"/>
                                                <path fill="#03a1cc" d="M0,12.38c.13-3.01,1.38-5.99,3.45-8.17.81.49,1.63,1,2.53,1.32-.72,2.17-1.12,4.45-1.16,6.75l-.06.1H0Z"/>
                                                <path fill="#03a1cc" d="M4.77,13.78c.11.03.05.62.06.76.13,2.07.49,4.12,1.16,6.09-.9.32-1.72.82-2.53,1.32C1.39,19.78.13,16.78,0,13.78h4.77Z"/>
                                                <path fill="#03a1cc" d="M26.2,13.78c-.1,3.02-1.39,5.92-3.38,8.15l-.06.02c-.79-.53-1.64-.95-2.5-1.35.7-2.21,1.08-4.5,1.16-6.82h4.79Z"/>
                                                <path fill="#03a1cc" d="M12.42.04v5.49c-1.57-.05-3.14-.29-4.62-.81C8.7,2.74,10.13.48,12.42.04"/>
                                                <path fill="#03a1cc" d="M12.42,20.63v5.47l-.08.04c-2.26-.59-3.63-2.7-4.54-4.71,1.48-.52,3.06-.75,4.62-.81"/>
                                                <path fill="#03a1cc" d="M13.83,5.52l.01-5.52c2.26.6,3.68,2.69,4.56,4.72-.02.11-1.85.5-2.1.55-.81.14-1.65.25-2.48.25"/>
                                                <path fill="#03a1cc" d="M13.78,20.63c.92.02,1.87.13,2.77.3.21.04,1.83.41,1.85.5-.89,2.02-2.3,4.14-4.56,4.71l-.06-5.52Z"/>
                                                <path fill="#03a1cc" d="M17.54,25.46l.8-1.03c.56-.79.98-1.65,1.41-2.51l2,1.05c-1.22,1.1-2.68,1.91-4.21,2.5"/>
                                                <path fill="#03a1cc" d="M8.67.74c-.91,1.04-1.62,2.23-2.19,3.49-.72-.24-1.36-.66-2.02-1.01,1.21-1.09,2.66-1.97,4.21-2.48"/>
                                                <path fill="#03a1cc" d="M8.67,25.41c-1.54-.51-3-1.39-4.21-2.47.67-.35,1.3-.78,2.02-1.01.57,1.26,1.27,2.45,2.19,3.49"/>
                                                <path fill="#03a1cc" d="M17.54.74c1.55.5,2.98,1.39,4.21,2.46l-2,1.05c-.6-1.25-1.26-2.48-2.21-3.51"/>
                                              </g>
                                            </svg>
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

                
                {(() => {
                    const currentIndex = sortedItems.findIndex(i => i.slug === slug);
                    const prev = currentIndex > 0 ? sortedItems[currentIndex - 1] : sortedItems[sortedItems.length - 1];
                    const next = currentIndex < sortedItems.length - 1 ? sortedItems[currentIndex + 1] : sortedItems[0];
                    return (
                        <div className="flex justify-center gap-8 mt-16">
                            <Button className="w-40!" href={`/portfolio/${prev.slug}`}>Previous</Button>
                            <Button className="w-40!" href={`/portfolio/${next.slug}`}>Next</Button>
                        </div>
                    );
                })()}
            </Container>
        </div>
    </>
  );
} 