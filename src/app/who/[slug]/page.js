import getTeamMembers from "@/lib/getTeamMembers";
import Container from "@/components/Container";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import { LinkedIn as LinkedInIcon } from "@/components/Icons/Social";
import MailIcon from "@/components/Icons/MailIcon";
import getFooterData from "@/lib/getFooterData";
import CTA from "@/components/CTA";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const items = await getTeamMembers();
    const item = items.find(s => s.slug === resolvedParams.slug);
    
    if (!item) {
      return {
        title: 'Team Member Not Found',
      };
    }
  
    return {
      title: item.title,
      description: item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 160) : '',
    };
  }

export default async function TeamMemberSinglePage({ params }) {
  const { slug } = await params;
  const items = await getTeamMembers(slug);
  const item = items.find(s => s.slug === slug);

  const { title, teamMember, content } = item;
  const { heroDesktopImage, heroMobileImage, email, linkedinUrl, role, heroCopyToTheRight } = teamMember;

  const footerData = await getFooterData();

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta
  };

  if (!item) {
    return <Container className="pt-50 pb-20"><h1>Team member not found</h1></Container>;
  }

  return (
    <>
        <HeaderWithMeganavLinks fixed={true} />
        <div className={`mt-20 py-20 aspect-[16/9] items-center justify-center px-4 bg-cover bg-center relative hidden lg:flex`} style={{
            backgroundImage: heroDesktopImage ? `url(${heroDesktopImage.mediaItemUrl})` : undefined
        }}>
            <div className="absolute inset-0 bg-black/20" />
            <Container className={`py-20 relative flex ${heroCopyToTheRight ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex flex-col gap-2 text-white">
                    {title && <h1 className="text-4xl lg:text-6xl/18">{title}</h1>}
                    {role && <p className="text-lg lg:text-2xl">{role}</p>}
                </div>
            </Container>
        </div>
        {heroMobileImage && (
            <div className={`mt-30 py-20 aspect-[16/9] items-center justify-center px-4 bg-cover bg-center relative flex lg:hidden`} style={{
                backgroundImage: heroMobileImage ? `url(${heroMobileImage.mediaItemUrl})` : undefined
            }}>
            </div>
        )}
        <div className="bg-linear-to-t from-black/10 via-black/0 to-black/0">
            <Container className="py-10 md:py-20">
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="w-full lg:w-2/3">
                        {content && <div className="mt-4 flex flex-col gap-4 text-base lg:text-lg" dangerouslySetInnerHTML={{ __html: content }} />}
                    </div>
                    <div className="w-full lg:w-1/3">
                        {(email || linkedinUrl) && (
                            <div className="bg-[#E9E9E9] rounded-xl p-6 mt-2 flex flex-row gap-4">
                                <div>
                                    <div className="text-lightblue text-2xl lg:text-3xl font-medium mb-2">Contact</div>
                                    {title && <h2 className="text-xl lg:text-2xl font-bold mb-4">{title}</h2>}
                                </div>
                                <div className="flex flex-col items-end flex-1 gap-3 text-lg">
                                    
                                    {email && (
                                        <div className="flex items-center gap-3 text-blue-02">
                                            <MailIcon email={email} />
                                        </div>
                                    )}
                                    {linkedinUrl && (
                                        <div className="flex items-center gap-3 text-blue-02">
                                            <a href={linkedinUrl.startsWith('http') ? linkedinUrl : `https://linkedin.com/in/${linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center"><LinkedInIcon /></a>
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