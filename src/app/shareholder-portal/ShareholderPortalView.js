import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import getFooterData from "@/lib/getFooterData";
import HeaderServer from "@/components/Header/HeaderServer";
import CTA from "@/components/CTA";
import InvestorPortalClient from "./InvestorPortalClient";
import AnnualReporting from "@/components/AnnualReporting";
import RegulatoryInformation from "@/components/RegulatoryInformation";
import getInvestorPortal from "@/lib/getInvestorPortal";
import { Suspense } from "react";
import Container from "@/components/Container";

const PAGE_ID = "1597";

export default async function ShareholderPortalView({ preview = false }) {
  const [{ title, content }, footerData, investorPortal] = await Promise.all([
    getPageTitleAndContent(PAGE_ID, preview),
    getFooterData(),
    getInvestorPortal(preview),
  ]);

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta,
  };

  return (
    <Suspense
      fallback={
        <Container className="py-50 relative z-10 flex flex-col gap-10">
          <div className="w-full flex justify-center items-center h-full">
            <p className="text-2xl">Loading...</p>
          </div>
        </Container>
      }
    >
      <>
        <HeaderServer fixed={false} />
        <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white pt-16 pb-10 relative">
          <InvestorPortalClient
            ctaData={ctaData}
            title={title}
            content={content}
            investorPortal={investorPortal}
          />
          <Container className="py-10 relative z-10 flex flex-col gap-6">
            {investorPortal.annualReporting.length > 0 ||
            String(investorPortal.annualReportingDescription ?? "").trim() ? (
              <AnnualReporting
                description={investorPortal.annualReportingDescription}
                documents={investorPortal.annualReporting.map((doc) => ({
                  title: doc.title,
                  description: doc.description,
                  fileUrl: doc.file?.mediaItemUrl || doc.file?.link,
                  fileName:
                    doc.title?.toLowerCase().replace(/\s+/g, "-") + ".pdf",
                }))}
              />
            ) : null}
            <RegulatoryInformation
              statement={investorPortal.shareholderPortalStatement}
              documents={investorPortal.regulatoryInformation.map((doc) => ({
                title: doc.title,
                description: doc.description,
                fileUrl: doc.file?.mediaItemUrl || doc.file?.link,
                fileName:
                  doc.title?.toLowerCase().replace(/\s+/g, "-") + ".pdf",
              }))}
            />
          </Container>
        </div>
        <CTA data={ctaData} />
      </>
    </Suspense>
  );
}
