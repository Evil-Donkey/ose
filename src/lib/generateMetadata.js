import fetchAPI from './api';

const PAGE_SEO_QUERY = `
  query getPageSeo($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      seo {
        title
        metaDesc
        opengraphUrl
        opengraphTitle
        opengraphDescription
        opengraphType
        opengraphSiteName
        opengraphImage {
          mediaItemUrl
          mediaDetails {
            height
            width
          }
        }
        twitterDescription
        twitterTitle
        twitterImage {
          mediaItemUrl
          mediaDetails {
            height
            width
          }
        }
      }
    }
  }
`;

export default async function generateMetadata(id) {
  const data = await fetchAPI(PAGE_SEO_QUERY, {
    variables: { id: String(id) },
  });

  const seo = data?.page?.seo;

  const opengraphType = seo?.opengraphType || 'website';

  return {
    title: seo?.title,
    description: seo?.metaDesc,
    openGraph: {
      title: seo?.openGraphTitle,
      description: seo?.openGraphTitle,
      url: seo?.openGraphTitle,
      siteName: seo?.openGraphTitle,
      images: seo?.opengraphImage ? [{
        url: seo?.opengraphImage?.mediaItemUrl,
        width: seo?.opengraphImage?.mediaDetails.width,
        height: seo?.opengraphImage?.mediaDetails.height,
      }] : [],
      type: opengraphType,
    },
    twitter: {
      title: seo?.twitterTitle,
      description: seo?.twitterDescription,
      images: seo?.twitterImage ? [{
        url: seo?.twitterImage?.mediaItemUrl,
        width: seo?.twitterImage?.mediaDetails.width,
        height: seo?.twitterImage?.mediaDetails.height,
      }] : [],
    }
  }
}
