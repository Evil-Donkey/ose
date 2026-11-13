import getFlexiblePage from "@/lib/getFlexiblePage";
import generateMetadataFromLib from "@/lib/generateMetadata";
import getPopOutData from "@/lib/getPopOutData";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import { PageThemeProvider } from "@/components/PageTheme";
import { CtaFormModalProvider } from "@/components/CtaFormModal";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";
import getTeamMembers from "@/lib/getTeamMembers";
import getFounders from "@/lib/getFounders";
import { hasTeamComponent, hasFoundersComponent } from "@/lib/checkFlexibleComponents";

// Local CMS (oxfordscienceenterprises-cms.test) uses a different page ID than production.
const PAGE_ID = process.env.NODE_ENV === "development" ? "3973" : "4640";

export async function generateMetadata() {
  return await generateMetadataFromLib(PAGE_ID);
}

// The site-wide "Work with us" footer cards are intentionally not rendered on this
// landing page; it has its own "Get involved" CTA cards in the flexible content.
export default async function BiologyDecodersPage() {
  const [flexibleContent, popOutData, meganavLinks, meganavData] = await Promise.all([
    getFlexiblePage(PAGE_ID),
    getPopOutData(),
    getMeganavLinksLite(),
    getMeganavDataLite(),
  ]);

  const teamData = hasTeamComponent(flexibleContent) ? await getTeamMembers() : null;
  const foundersData = hasFoundersComponent(flexibleContent) ? await getFounders() : null;

  return (
    <PageThemeProvider variant="pink">
      {/* Every CTA button on this page opens the enquiry form (minus the sector field) */}
      <CtaFormModalProvider showSectors={false}>
        <FlexiblePageClient
          flexibleContent={flexibleContent}
          popOutData={popOutData}
          meganavLinks={meganavLinks}
          meganavData={meganavData}
          teamData={teamData}
          foundersData={foundersData}
        />
      </CtaFormModalProvider>
    </PageThemeProvider>
  );
}
