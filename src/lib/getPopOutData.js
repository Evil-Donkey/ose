import fetchAPI from "./api";
import { isPreviewCmsAuthRequest } from "./previewCmsAuthHeader";

const POPOUT_DATA_QUERY = `
  query NewQuery {
    acfOptionsThemeSettings {
      globalSettings {
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

const EMPTY_POPOUT_DATA = {
  popoutLabel: null,
  popoutContent: null,
};

export default async function getPopOutData() {
  const data = await fetchAPI(POPOUT_DATA_QUERY, {
    preview: await isPreviewCmsAuthRequest(),
  });

  // Throw on fetch failure so we don't silently render with the global popout
  // missing. See getFooterData for the same reasoning.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (!isBuildPhase && data === null) {
    throw new Error('CMS_FETCH_FAILED: popout data');
  }

  return data?.acfOptionsThemeSettings?.globalSettings || EMPTY_POPOUT_DATA;
}