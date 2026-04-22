import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import getPageBySlug from "@/lib/getPageBySlug";
import getPageTitleAndContent from "@/lib/getPageTitleAndContent";
import getFlexiblePage from "@/lib/getFlexiblePage";
import getPopOutData from "@/lib/getPopOutData";
import getFooterData from "@/lib/getFooterData";
import getMeganavLinksLite from "@/lib/getMeganavLinksLite";
import getMeganavDataLite from "@/lib/getMeganavDataLite";
import getTeamMembers from "@/lib/getTeamMembers";
import getFounders from "@/lib/getFounders";
import { hasTeamComponent, hasFoundersComponent } from "@/lib/checkFlexibleComponents";
import FlexiblePageClient from "@/components/Templates/FlexiblePageClient";
import HeaderServer from "@/components/Header/HeaderServer";
import Container from "@/components/Container";
import CTA from "@/components/CTA";
import ShareholderPortalView from "@/app/shareholder-portal/ShareholderPortalView";
import FormPageView from "@/app/form/FormPageView";
import ContactPageView from "@/app/contact/ContactPageView";
import ShareholderContactFormPageView from "@/app/shareholder-contact-form/ShareholderContactFormPageView";
import CoinvestorsContactFormPageView from "@/app/coinvestors-contact-form/CoinvestorsContactFormPageView";
import SustainabilityPageView from "@/app/sustainability/SustainabilityPageView";
import StoriesPageView from "@/app/stories/StoriesPageView";
import UncoverPageView from "@/app/uncover/UncoverPageView";
import ShareholderPortalSignupView from "@/app/shareholder-portal-signup/ShareholderPortalSignupView";

export const metadata = { title: "Preview" };

export const dynamic = "force-dynamic";

/**
 * Stable WordPress post ID for custom preview shells.
 *
 * Prefer the id embedded in the preview URL (`id-1597` from /api/draft) over
 * `page.databaseId`: WPGraphQL preview payloads often return a *revision* row id
 * as databaseId, which would not match our map (e.g. 1597) and incorrectly falls
 * through to the generic title/content + CTA layout.
 */
function parsePostIdFromPreviewSlug(slugString) {
  if (typeof slugString !== "string") return NaN;
  const head = slugString.match(/^(?:id|draft)-(\d+)$/);
  if (head) return Number(head[1]);
  const tail = slugString.match(/(?:^|\/)(?:id|draft)-(\d+)$/);
  if (tail) return Number(tail[1]);
  return NaN;
}

function resolvePreviewDatabaseId(page, slugString) {
  const fromUrl = parsePostIdFromPreviewSlug(slugString);
  if (Number.isFinite(fromUrl) && fromUrl > 0) {
    return fromUrl;
  }
  const fromPage = Number(page?.databaseId);
  if (Number.isFinite(fromPage) && fromPage > 0) {
    return fromPage;
  }
  return NaN;
}

function pageSlugMatches(page, candidate) {
  const s = (page?.slug ?? "").replace(/\/+$/, "").toLowerCase();
  return s === candidate.toLowerCase();
}

/**
 * Live sector routes pass `title` + `titleInHero` + `fixedHeader` into FlexiblePageClient
 * so the H1 lives inside the hero flexible block — not the standalone title strip in FlexiblePage.js.
 */
const FLEX_TITLE_IN_HERO_PAGE_IDS = new Set([1215, 1249, 1251]);

const CUSTOM_PREVIEW_BY_DATABASE_ID = {
  1597: ShareholderPortalView,
  1566: FormPageView,
  1274: ContactPageView,
  3366: ShareholderContactFormPageView,
  3487: CoinvestorsContactFormPageView,
  1586: SustainabilityPageView,
  1254: StoriesPageView,
  1704: UncoverPageView,
};

export default async function PagePreviewPage({ params }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) notFound();

  const resolvedParams = await params;
  const slugString = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug.join("/")
    : resolvedParams.slug;

  const page = await getPageBySlug(slugString);

  if (!page) {
    return (
      <>
        <HeaderServer fixed={false} />
        <Container className="pt-40 pb-20 max-w-3xl">
          <h1 className="text-3xl mb-4">Page not found in WordPress</h1>
          <p className="text-gray-600 mb-4">
            The preview route could not load this page from the CMS (path token:{" "}
            <code>{slugString}</code>). That token is resolved as a numeric post ID in GraphQL,
            not as a WordPress slug.
          </p>
          <p className="text-gray-600 mb-2 font-medium">Most often on Vercel Preview:</p>
          <ul className="list-disc ps-5 text-gray-600 space-y-2 mb-6">
            <li>
              <code className="text-sm">WORDPRESS_AUTH_REFRESH_TOKEN</code> is missing for the{" "}
              <strong>Preview</strong> environment (Production-only vars are not available on
              branch deployments).
            </li>
            <li>
              Headless Login allow-list includes this deployment origin (e.g. your{" "}
              <code className="text-sm">*.vercel.app</code> URL) and{" "}
              <code className="text-sm">NEXT_PUBLIC_SITE_URL</code> or the automatic{" "}
              <code className="text-sm">VERCEL_URL</code> origin matches it.
            </li>
            <li>
              Check this deployment&apos;s runtime logs for{" "}
              <code className="text-sm">[preview auth]</code> or{" "}
              <code className="text-sm">GraphQL Errors</code>.
            </li>
          </ul>
        </Container>
      </>
    );
  }

  if (pageSlugMatches(page, "shareholder-portal-signup")) {
    return <ShareholderPortalSignupView preview />;
  }

  if (pageSlugMatches(page, "shareholder-portal")) {
    return <ShareholderPortalView preview />;
  }

  const dbId = resolvePreviewDatabaseId(page, slugString);
  const CustomView = CUSTOM_PREVIEW_BY_DATABASE_ID[dbId];
  if (CustomView) {
    return <CustomView preview />;
  }

  const needsFlexHeroTitle = FLEX_TITLE_IN_HERO_PAGE_IDS.has(dbId);

  const [flexibleContent, popOutData, footerData, meganavLinks, meganavData, flexHeroTitle] =
    await Promise.all([
      getFlexiblePage(dbId, true),
      getPopOutData(),
      getFooterData(),
      getMeganavLinksLite(),
      getMeganavDataLite(),
      needsFlexHeroTitle
        ? getPageTitleAndContent(String(dbId), true)
        : Promise.resolve(null),
    ]);

  const teamData = hasTeamComponent(flexibleContent) ? await getTeamMembers(true) : null;
  const foundersData = hasFoundersComponent(flexibleContent) ? await getFounders(true) : null;

  const ctaData = {
    copy: footerData?.ctaCopy,
    title: footerData?.ctaTitle,
    cta: footerData?.cta,
  };

  if (flexibleContent?.length) {
    return (
      <FlexiblePageClient
        flexibleContent={flexibleContent}
        popOutData={popOutData}
        {...(needsFlexHeroTitle
          ? {
              title: flexHeroTitle?.title ?? null,
              titleInHero: true,
              fixedHeader: true,
            }
          : {})}
        meganavLinks={meganavLinks}
        meganavData={meganavData}
        teamData={teamData}
        foundersData={foundersData}
      >
        <CTA data={ctaData} />
      </FlexiblePageClient>
    );
  }

  return (
    <>
      <HeaderServer fixed={false} />
      <Container className="pt-30 pb-20">
        {page.title && (
          <h1
            className="text-4xl lg:text-6xl mb-8"
            dangerouslySetInnerHTML={{ __html: page.title }}
          />
        )}
        {page.content && (
          <div
            className="prose max-w-none text-blue-02"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </Container>
      <CTA data={ctaData} />
    </>
  );
}
