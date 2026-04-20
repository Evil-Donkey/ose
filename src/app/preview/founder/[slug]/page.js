import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import getFounderBySlug from "@/lib/getFounderBySlug";
import Container from "@/components/Container";
import HeaderServer from "@/components/Header/HeaderServer";
import { LinkedIn as LinkedInIcon } from "@/components/Icons/Social";
import MailIcon from "@/components/Icons/MailIcon";
import getFooterData from "@/lib/getFooterData";
import CTA from "@/components/CTA";

export const metadata = { title: "Preview" };

export default async function FounderPreviewPage({ params }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) notFound();

  const { slug } = await params;
  const item = await getFounderBySlug(slug);

  if (!item) notFound();

  const { title, founder, content } = item;
  const { heroDesktopImage, heroMobileImage, email, linkedinUrl, role, heroCopyToTheRight } = founder || {};

  const footerData = await getFooterData();
  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta,
  };

  return (
    <>
      <HeaderServer fixed={true} />
      <div
        className="mt-20 py-20 aspect-[16/8] items-center justify-center px-4 bg-cover bg-center relative hidden lg:flex"
        style={{ backgroundImage: heroDesktopImage ? `url(${heroDesktopImage.mediaItemUrl})` : undefined }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <Container
          className={`py-20 relative flex ${heroCopyToTheRight ? "flex-row-reverse" : "flex-row"}`}
        >
          <div className="flex flex-col gap-2 text-white">
            {title && (
              <h1
                className="text-6xl/18"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {role && <p className="text-2xl max-w-2xl">{role}</p>}
          </div>
        </Container>
      </div>
      {heroMobileImage && (
        <div
          className="mt-30 py-20 aspect-[16/8] items-center justify-center px-4 bg-cover bg-center relative flex lg:hidden"
          style={{ backgroundImage: `url(${heroMobileImage.mediaItemUrl})` }}
        />
      )}
      <div className="bg-linear-to-t from-black/10 via-black/0 to-black/0">
        <Container className="pt-10 relative flex flex-row lg:hidden">
          <div className="flex flex-col gap-2">
            {title && <h1 className="text-4xl" dangerouslySetInnerHTML={{ __html: title }} />}
            {role && <p className="text-lg max-w-md">{role}</p>}
          </div>
        </Container>

        <Container className="pb-10 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-2/3">
              {content && (
                <div
                  className="mt-4 flex flex-col gap-4 text-base lg:text-lg"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>
            <div className="w-full lg:w-1/3">
              {(email || linkedinUrl) && (
                <div className="bg-[#E9E9E9] rounded-xl p-6 mt-2 flex flex-row gap-4">
                  <div>
                    <div className="text-lightblue text-2xl lg:text-3xl font-medium mb-2">Contact</div>
                    {title && (
                      <h2
                        className="text-xl lg:text-2xl font-bold mb-4"
                        dangerouslySetInnerHTML={{ __html: title }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-end flex-1 gap-3 text-lg">
                    {email && (
                      <div className="flex items-center gap-3 text-blue-02">
                        <MailIcon email={email} />
                      </div>
                    )}
                    {linkedinUrl && (
                      <div className="flex items-center gap-3 text-blue-02">
                        <a
                          href={
                            linkedinUrl.startsWith("http")
                              ? linkedinUrl
                              : `https://linkedin.com/in/${linkedinUrl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center"
                        >
                          <LinkedInIcon />
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

      <CTA data={ctaData} />
    </>
  );
}
