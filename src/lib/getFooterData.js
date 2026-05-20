import fetchAPI from "./api";
import { isPreviewCmsAuthRequest } from "./previewCmsAuthHeader";

const FOOTER_DATA_QUERY = `
  query getFooterThemeSettings {
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

const EMPTY_FOOTER_DATA = {
  copyright: null,
  address: null,
  oxfordAcademicsEmail: null,
  investorsEmail: null,
  mediaEmail: null,
  telephone: null,
  ctaTitle: null,
  ctaCopy: null,
  cta: null,
};

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

  // During `next build` the CMS can be cold or briefly unreachable.
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  if (isBuildPhase && isFooterSettingsEmpty(settings)) {
    await new Promise((r) => setTimeout(r, 1500));
    settings = await fetchFooterSettings(preview);
  }

  if (isFooterSettingsEmpty(settings)) {
    // Never crash the whole site for footer/CTA — log and render without contact
    // fields rather than a 500. (Previously getFooterData and getPopOutData both
    // used `query NewQuery {}` and shared one unstable_cache slot, so whichever
    // ran second in Promise.all could receive the other's partial globalSettings.)
    console.error(
      "[getFooterData] global theme settings missing or empty after fetch — " +
        "footer contact info and page CTA blocks will be blank for this render."
    );
    return EMPTY_FOOTER_DATA;
  }

  return settings;
}
