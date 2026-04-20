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

async function fetchPreviewContent(pageId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/wp-json/wp/v2/pages/${pageId}/autosaves?per_page=1&orderby=date&order=desc`,
      {
        headers: { 'Authorization': `Basic ${process.env.WORDPRESS_APP_PASSWORD}` },
        cache: 'no-store',
      }
    );
    if (!res.ok) return null;
    const autosaves = await res.json();
    if (!Array.isArray(autosaves) || autosaves.length === 0) return null;
    return {
      title: autosaves[0].title?.rendered ?? null,
      content: autosaves[0].content?.rendered ?? null,
    };
  } catch {
    return null;
  }
}

export default async function getPageTitleAndContent(pageId) {
  let preview = false;
  try {
    const { draftMode } = await import('next/headers');
    const { isEnabled } = await draftMode();
    preview = isEnabled;
  } catch {
    // build time — no request context
  }

  const [data, previewContent] = await Promise.all([
    fetchAPI(PAGE_TITLE_CONTENT_QUERY, { variables: { id: String(pageId) }, preview }),
    preview ? fetchPreviewContent(pageId) : Promise.resolve(null),
  ]);

  const page = data?.page;

  return {
    title: previewContent?.title ?? page?.title ?? null,
    content: previewContent?.content ?? page?.content ?? null,
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
