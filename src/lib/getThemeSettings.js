import { cache } from 'react';
import fetchAPI from './api';
import { isPreviewCmsAuthRequest } from './previewCmsAuthHeader';

const THEME_SETTINGS_QUERY = `
  query getThemeSettings {
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
        popoutLabel
        popoutContent {
          copy
          ctaLabel
          ctaUrl
          heading
        }
      }
    }
  }
`;

async function fetchThemeSettings(preview) {
  return fetchAPI(THEME_SETTINGS_QUERY, {
    preview,
    tags: ['theme-settings'],
  });
}

// Last successful settings payload, kept for the lifetime of the serverless
// instance. Theme settings change rarely, so serving a slightly stale copy
// during a CMS blip is far better than rendering a blank footer/popout (or,
// worse, failing the whole page render).
let lastGoodSettings = null;

const getThemeSettings = cache(async () => {
  const preview = await isPreviewCmsAuthRequest();
  let data = await fetchThemeSettings(preview);

  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (isBuildPhase && !data?.acfOptionsThemeSettings?.globalSettings) {
    await new Promise((r) => setTimeout(r, 1500));
    data = await fetchThemeSettings(preview);
  }

  const settings = data?.acfOptionsThemeSettings?.globalSettings ?? null;

  if (settings) {
    lastGoodSettings = settings;
    return settings;
  }

  if (lastGoodSettings) {
    console.error(
      '[getThemeSettings] CMS fetch failed — serving last-known-good settings from memory.'
    );
    return lastGoodSettings;
  }

  return null;
});

export default getThemeSettings;
