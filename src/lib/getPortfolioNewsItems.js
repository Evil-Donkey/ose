import fetchAPI from "./api";

const PORTFOLIO_NEWS_ITEMS_QUERY = `
  query PortfolioNews($first: Int!, $after: String) {
    portfolioNews(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        title
        slug
        databaseId
        date
        portfolioNews {
          hashtag
          url
        }
        portfolioNewsCategories {
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

export default async function getPortfolioNewsItems() {
  const allItems = [];
  let hasNextPage = true;
  let after = null;
  const batchSize = 100; // WordPress GraphQL default limit

  try {
    while (hasNextPage) {
      const data = await fetchAPI(PORTFOLIO_NEWS_ITEMS_QUERY, {
        variables: {
          first: batchSize,
          after: after
        }
      });

      if (!data?.portfolioNews) {
        console.error('No portfolio news data received');
        break;
      }

      const { nodes, pageInfo } = data.portfolioNews;
      
      if (nodes && nodes.length > 0) {
        allItems.push(...nodes);
      }

      hasNextPage = pageInfo?.hasNextPage || false;
      after = pageInfo?.endCursor || null;

      // Safety check to prevent infinite loops
      if (allItems.length > 10000) {
        console.warn('Reached maximum item limit, stopping pagination');
        break;
      }
    }

    console.log(`Fetched ${allItems.length} portfolio news items`);
    return allItems;
  } catch (error) {
    console.error('Error fetching portfolio news items:', error);
    return [];
  }
} 