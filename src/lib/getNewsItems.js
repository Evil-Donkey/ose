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
        }
        featuredImage {
          node {
            altText
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

export default async function getNewsItems() {
  const data = await fetchAPI(NEWS_ITEMS_QUERY);
  return data?.posts?.nodes || [];
} 