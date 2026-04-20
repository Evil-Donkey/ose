import fetchAPI from "./api";

const PAGE_TITLE_CONTENT_QUERY = `
  query getPageTitleAndContent($id: ID!, $asPreview: Boolean = false) {
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

export default async function getPageTitleAndContent(pageId) {
  let preview = false;
  try {
    const { draftMode } = await import('next/headers');
    const { isEnabled } = await draftMode();
    preview = isEnabled;
  } catch {
    // build time — no request context
  }

  const data = await fetchAPI(PAGE_TITLE_CONTENT_QUERY, {
    variables: { id: String(pageId), asPreview: preview },
    preview,
  });
  return {
    title: data?.page?.title || null,
    content: data?.page?.content || null,
    featuredImage: data?.page?.featuredImage?.node?.mediaItemUrl || null,
    featuredImageAltText: data?.page?.featuredImage?.node?.altText || null,
    featuredImageCaption: data?.page?.featuredImage?.node?.caption || null,
    mobileFeaturedImage: data?.page?.mobileFeaturedImage?.mobileFeaturedImage?.mediaItemUrl || null,
    mobileFeaturedImageAltText: data?.page?.mobileFeaturedImage?.mobileFeaturedImage?.altText || null,
    mobileFeaturedImageCaption: data?.page?.mobileFeaturedImage?.mobileFeaturedImage?.caption || null,
    sustainability: data?.page?.sustainability?.sustainabilityReport?.mediaItemUrl || null,
    secondaryTitle: data?.page?.extraPageOptions?.secondaryTitle || null
  };
} 