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

const getThemeSettings = cache(async () => {
  const preview = await isPreviewCmsAuthRequest();
  let data = await fetchThemeSettings(preview);

  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (isBuildPhase && !data?.acfOptionsThemeSettings?.globalSettings) {
    await new Promise((r) => setTimeout(r, 1500));
    data = await fetchThemeSettings(preview);
  }

  return data?.acfOptionsThemeSettings?.globalSettings ?? null;
});

export default getThemeSettings;
