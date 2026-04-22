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
  const data = await fetchAPI(FOOTER_DATA_QUERY);

  // Throw on fetch failure so the page's error boundary catches it. Returning
  // an all-null EMPTY_FOOTER_DATA used to render a footer with blank Call /
  // Address fields and a completely empty CTA component above it (because
  // ctaData is built from `footerData.ctaCopy/ctaTitle/cta`, all of which
  // were null). Skipped during `next build` so a transient WP blip doesn't
  // fail the whole deploy — the empty footer self-heals on revalidate.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (!isBuildPhase && data === null) {
    throw new Error('CMS_FETCH_FAILED: footer data');
  }

  return data?.acfOptionsThemeSettings?.globalSettings || EMPTY_FOOTER_DATA;
}
