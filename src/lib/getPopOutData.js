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
  return data?.acfOptionsThemeSettings?.globalSettings || EMPTY_POPOUT_DATA;
}