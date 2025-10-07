import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import CTA from "@/components/CTA";
import getFooterData from "@/lib/getFooterData";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";
import getTeamMembers from "@/lib/getTeamMembers";
import getFounders from "@/lib/getFounders";
import { hasTeamComponent, hasFoundersComponent } from "@/lib/checkFlexibleComponents";

export async function generateMetadata() {
  return await generateMetadataFromLib("26");
}

export default async function WhatPage() {
  const [flexibleContent, popOutData, footerData, meganavLinks, meganavData] = await Promise.all([
    getFlexiblePage("26"),
    getPopOutData(),
    getFooterData(),
    getMeganavLinksLite(),
    getMeganavDataLite()
  ]);

  // Conditionally fetch team/founders data if components are present
  const teamData = hasTeamComponent(flexibleContent) ? await getTeamMembers() : null;
  const foundersData = hasFoundersComponent(flexibleContent) ? await getFounders() : null;

  const ctaData = {
    copy: footerData.ctaCopy,
    title: footerData.ctaTitle,
    cta: footerData.cta
  };

  return (
    <FlexiblePageClient 
      flexibleContent={flexibleContent} 
      popOutData={popOutData}
      meganavLinks={meganavLinks}
      meganavData={meganavData}
      teamData={teamData}
      foundersData={foundersData}
    >
      <CTA data={ctaData} />
    </FlexiblePageClient>
  );
} 