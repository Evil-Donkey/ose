import fetchAPI from "./api";

const PAGE_TITLE_CONTENT_QUERY = `
  query getPageTitleAndContent($id: ID!, $preview: Boolean = false) {
    page(id: $id, idType: DATABASE_ID) {
      title(format: RENDERED)
      content(format: RENDERED)
      preview @include(if: $preview) {
        node {
          title(format: RENDERED)
          content(format: RENDERED)
        }
      }
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
    variables: { id: String(pageId), preview },
    preview,
  });

  const page = data?.page;
  const previewNode = preview ? page?.preview?.node : null;

  return {
    title: previewNode?.title ?? page?.title ?? null,
    content: previewNode?.content ?? page?.content ?? null,
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
