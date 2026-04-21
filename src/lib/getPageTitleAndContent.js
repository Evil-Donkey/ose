import fetchAPI from "./api";

const PAGE_TITLE_CONTENT_QUERY = `
  query getPageTitleAndContent($id: ID!, $asPreview: Boolean!) {
    page(id: $id, idType: DATABASE_ID, asPreview: $asPreview) {
      title(format: RENDERED)
      content(format: RENDERED)
      featuredImage {
        node {
          mediaItemUrl
          altText
          caption
        }
      }
      mobileFeaturedImage {
        mobileFeaturedImage {
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

export default async function getPageTitleAndContent(pageId, preview = false) {
  const data = await fetchAPI(PAGE_TITLE_CONTENT_QUERY, {
    variables: { id: String(pageId), asPreview: preview },
    preview,
  });

  const page = data?.page;

  return {
    title: page?.title ?? null,
    content: page?.content ?? null,
    featuredImage: page?.featuredImage?.node?.mediaItemUrl || null,
    featuredImageAltText: page?.featuredImage?.node?.altText || null,
    featuredImageCaption: page?.featuredImage?.node?.caption || null,
    mobileFeaturedImage: page?.mobileFeaturedImage?.mobileFeaturedImage?.mediaItemUrl || null,
    mobileFeaturedImageAltText: page?.mobileFeaturedImage?.mobileFeaturedImage?.altText || null,
    mobileFeaturedImageCaption: page?.mobileFeaturedImage?.mobileFeaturedImage?.caption || null,
    sustainability: page?.sustainability?.sustainabilityReport?.mediaItemUrl || null,
    secondaryTitle: page?.extraPageOptions?.secondaryTitle || null
  };
}
