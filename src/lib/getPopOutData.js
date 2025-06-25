import fetchAPI from "./api";

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

export default async function getPopOutData() {
  const data = await fetchAPI(POPOUT_DATA_QUERY);
  return data?.acfOptionsThemeSettings?.globalSettings || null;
} 