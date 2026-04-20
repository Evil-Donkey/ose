import fetchAPI from "./api";

const STORIES_ITEMS_QUERY = `
  query Stories($stati: [PostStatusEnum]) {
    stories(first: 1000, where: {orderby: {field: MENU_ORDER, order: ASC}, stati: $stati}) {
      nodes {
        title
        slug
        databaseId
        menuOrder
        content(format: RENDERED)
        featuredImage {
          node {
            caption
            altText
            mediaItemUrl
          }
        }
        mobileFeaturedImage {
          mobileFeaturedImage {
            mediaItemUrl
            altText
            caption
          }
        }
        story {
          cardExcerpt
        }
        storiesTypes {
          nodes {
            id
            name
            slug
          }
        }
        storiesSectors {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export default async function getStoriesItems(preview = false) {
  const data = await fetchAPI(STORIES_ITEMS_QUERY, {
    variables: { stati: preview ? ['PUBLISH', 'DRAFT'] : ['PUBLISH'] },
    preview,
  });
  return data?.stories?.nodes || [];
} 