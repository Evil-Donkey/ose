import fetchAPI from "./api";
import { isCmsDraftRequest } from "./cmsDraftAuth";

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

export default async function getFooterData() {
  const data = await fetchAPI(FOOTER_DATA_QUERY, {
    preview: await isCmsDraftRequest(),
  });
  return data?.acfOptionsThemeSettings?.globalSettings || EMPTY_FOOTER_DATA;
}
