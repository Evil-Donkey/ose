import fetchAPI from "./api";

const NEWS_ITEMS_QUERY = `
  query News {
    posts(first: 1000) {
      nodes {
        title
        slug
        databaseId
        date
        content(format: RENDERED)
        news {
          shortDescription
          externalUrl
          thumbnailImage {
            altText
            caption
            mediaItemUrl
          }
        }
        featuredImage {
          node {
            altText
            caption
            mediaItemUrl
          }
        }
        categories {
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

export default async function getNewsItems(preview = false) {
  const data = await fetchAPI(NEWS_ITEMS_QUERY, { preview });
  return data?.posts?.nodes || [];
} 