import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import generateMetadataFromLib from "@/lib/generateMetadata";
import Container from "@/components/Container";
import Image from "next/image";
import ResponsiveImage from "../../components/ResponsiveImage";
import HeaderServer from "@/components/Header/HeaderServer";
import { getOptimizedImageProps } from "../../lib/imageUtils";
import Link from "next/link";
import getFooterData from "@/lib/getFooterData";
import CTA from "@/components/CTA";

export async function generateMetadata() {
  return await generateMetadataFromLib("1586");
}

export default async function SustainabilityPage() {
    const { title, content, featuredImage, sustainability } = await getPageTitleAndContent("1586");
    const footerData = await getFooterData();

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta
  };

  return (
    <>
      <HeaderServer fixed={true} />
      {featuredImage && 
      <div className="relative mt-30 h-[500px]">
        {/* <ResponsiveImage 
          {...getOptimizedImageProps({ mediaItemUrl: featuredImage, altText: title }, {
            context: 'hero',
            isAboveFold: true,
            isHero: true,
            className: "object-cover w-full h-full"
          })}
        /> */}
        <Image src={featuredImage} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          {title && <h1 className="text-5xl md:text-[7rem]/30 2xl:text-[9rem]/50 tracking-tight text-white">{title}</h1>}
        </div>
      </div>
      }
      <div className="bg-linear-to-t from-black/10 via-black/0 to-black/0">
        <Container className="pt-20 pb-50">
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

                {/* CTA Buttons */}
                <div className="flex flex-col md:flex-row gap-6 mt-12">
                  {/* Sustainability Policy CTA */}
                  <Link 
                    href="/sustainability-policy"
                    className="flex-1 bg-[#EAEAEA] hover:bg-gray-200 transition-colors duration-200 rounded-lg p-6 flex items-center justify-between group"
                  >
                    <div className="flex flex-col">
                      <span className="text-blue-02 text-lg">View our</span>
                      <span className="font-bold text-blue-02 text-lg">Sustainability Policy</span>
                    </div>
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="text-blue-02 group-hover:translate-x-1 transition-transform duration-200"
                    >
                      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  
                  {/* Sustainability Disclosure CTA */}
                  <Link 
                    href="/sustainability-disclosure"
                    className="flex-1 bg-[#EAEAEA] hover:bg-gray-200 transition-colors duration-200 rounded-lg p-6 flex items-center justify-between group"
                  >
                    <div className="flex flex-col">
                      <span className="text-blue-02 text-lg">View our</span>
                      <span className="font-bold text-blue-02 text-lg">Sustainability Disclosure</span>
                    </div>
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="text-blue-02 group-hover:translate-x-1 transition-transform duration-200"
                    >
                      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
                
                <div className="flex flex-col md:flex-row justify-center gap-6 mt-2">
                  {/* Sustainability Report Download CTA */}
                  {sustainability && (
                    <a 
                      href={sustainability}
                      download
                      target="_blank"
                      className="flex-1 bg-[#EAEAEA] hover:bg-gray-200 transition-colors duration-200 rounded-lg p-6 flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <span className="text-blue-02 text-lg">Download our</span>
                        <span className="font-bold text-blue-02 text-lg">2024 Sustainability Report</span>
                      </div>
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="text-blue-02"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  )}
                </div>
            </div>
        </Container>
      </div>

      <CTA data={ctaData} />
    </>
  );
} 