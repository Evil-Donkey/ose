import fetchAPI from "./api";

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

export default async function getFooterData() {
  const data = await fetchAPI(FOOTER_DATA_QUERY);
  return data?.acfOptionsThemeSettings?.globalSettings || null;
} 