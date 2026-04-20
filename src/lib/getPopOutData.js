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

const EMPTY_POPOUT_DATA = {
  popoutLabel: null,
  popoutContent: null,
};

export default async function getPopOutData() {
  const data = await fetchAPI(POPOUT_DATA_QUERY);
  return data?.acfOptionsThemeSettings?.globalSettings || EMPTY_POPOUT_DATA;
}