import fetchAPI from "./api";

const PAGE_TITLE_CONTENT_QUERY = `
  query getPageTitleAndContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      title(format: RENDERED)
      content(format: RENDERED)
      featuredImage {
        node {
          mediaItemUrl
          altText
          caption
        }
      }
      sustainability {
        sustainabilityReport {
          mediaItemUrl
        }
      }
      extraPageOptions {
        secondaryTitle
      }
    }
  }
`;

export default async function getPageTitleAndContent(pageId) {
  const data = await fetchAPI(PAGE_TITLE_CONTENT_QUERY, {
    variables: { id: String(pageId) }
  });
  return {
    title: data?.page?.title || null,
    content: data?.page?.content || null,
    featuredImage: data?.page?.featuredImage?.node?.mediaItemUrl || null,
    featuredImageAltText: data?.page?.featuredImage?.node?.altText || null,
    featuredImageCaption: data?.page?.featuredImage?.node?.caption || null,
    sustainability: data?.page?.sustainability?.sustainabilityReport?.mediaItemUrl || null,
    secondaryTitle: data?.page?.extraPageOptions?.secondaryTitle || null
  };
} 