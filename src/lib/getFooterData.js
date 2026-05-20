import fetchAPI from "./api";
import { isPreviewCmsAuthRequest } from "./previewCmsAuthHeader";

const FOOTER_DATA_QUERY = `
  query NewQuery {
    acfOptionsThemeSettings {
      globalSettings {
        copyright
        address
        oxfordAcademicsEmail
        investorsEmail
        mediaEmail
        telephone
        ctaTitle
        ctaCopy
        cta {
          copy
          ctaLabel
          ctaUrl
          largeTitle
          smallTitle
          backgroundImage {
            altText
            caption
            mediaDetails {
              height
              width
            }
            mediaItemUrl
          }
        }
      }
    }
  }
`;

function extractFooterSettings(data) {
  return data?.acfOptionsThemeSettings?.globalSettings ?? null;
}

/** True when the CMS responded but none of the fields we rely on resolved. */
function isFooterSettingsEmpty(settings) {
  if (!settings) return true;
  const hasContact =
    settings.telephone ||
    settings.oxfordAcademicsEmail ||
    settings.investorsEmail ||
    settings.mediaEmail ||
    settings.address;
  const hasCta =
    settings.ctaTitle ||
    settings.ctaCopy ||
    (Array.isArray(settings.cta) && settings.cta.length > 0);
  return !hasContact && !hasCta;
}

async function fetchFooterSettings(preview) {
  const data = await fetchAPI(FOOTER_DATA_QUERY, {
    preview,
    tags: ["footer"],
  });
  return extractFooterSettings(data);
}

export default async function getFooterData() {
  const preview = await isPreviewCmsAuthRequest();
  let settings = await fetchFooterSettings(preview);

  // During `next build` the CMS can be cold or briefly unreachable. One extra
  // uncached attempt avoids baking mailto:undefined / empty CTA shells into
  // static HTML for the lifetime of the deploy.
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  if (isBuildPhase && isFooterSettingsEmpty(settings)) {
    await new Promise((r) => setTimeout(r, 1500));
    settings = await fetchFooterSettings(preview);
  }

  if (isFooterSettingsEmpty(settings)) {
    throw new Error("CMS_FETCH_FAILED: footer / global theme settings missing or empty");
  }

  return settings;
}
