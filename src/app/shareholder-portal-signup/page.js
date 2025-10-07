import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import getFooterData from "@/lib/getFooterData";
import HeaderServer from "@/components/Header/HeaderServer";
import CTA from "@/components/CTA";
import InvestorPortalSignupClient from "./InvestorPortalSignupClient";
import RegulatoryInformation from "@/components/RegulatoryInformation";
import getInvestorPortal from "@/lib/getInvestorPortal";
import generateMetadataFromLib from "@/lib/generateMetadata";
import { Suspense } from "react";
import Container from "@/components/Container";

export async function generateMetadata() {
  return await generateMetadataFromLib("1597");
}

export default async function InvestorPortal() {
    const { title, content } = await getPageTitleAndContent("1597");
    const footerData = await getFooterData();
    const investorPortal = await getInvestorPortal();

    const ctaData = {
        copy: footerData.ctaCopy,
        title: footerData.ctaTitle,
        cta: footerData.cta
    };

    return (
        <Suspense fallback={<Container className="py-50 relative z-10 flex flex-col gap-10"><div className="w-full flex justify-center items-center h-full"><p className="text-2xl">Loading...</p></div></Container>}>
        <>
            <HeaderServer fixed={false} />
            <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white pt-16 pb-10 relative">
                <InvestorPortalSignupClient ctaData={ctaData} title={title} content={content} investorPortal={investorPortal} />
                <Container className="py-10 relative z-10">
                    <RegulatoryInformation 
                        documents={investorPortal.regulatoryInformation.map(doc => ({
                            title: doc.title,
                            description: doc.description,
                            fileUrl: doc.file?.mediaItemUrl || doc.file?.link,
                            fileName: doc.title?.toLowerCase().replace(/\s+/g, '-') + '.pdf'
                        }))}
                    />
                </Container>
            </div>
            <CTA data={ctaData} />
        </>
        </Suspense>
    );
}
