import fetchAPI from "./api";

const FOOTER_DATA_QUERY = `
  query NewQuery {
    acfOptionsThemeSettings {
      globalSettings {
        copyright
        address
        deepTechEmail
        healthTechEmail
        investorsEmail
        lifeSciencesEmail
        mediaEmail
        telephone
      }
    }
  }
`;

export default async function getFooterData() {
  const data = await fetchAPI(FOOTER_DATA_QUERY);
  return data?.acfOptionsThemeSettings?.globalSettings || null;
} 