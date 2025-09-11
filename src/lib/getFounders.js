import fetchAPI from "./api";

const FOUNDERS_QUERY = `
  {
    allFounders(first: 1000, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
        nodes {
            founder {
                email
                linkedinUrl
                role
                heroCopyToTheRight
                heroDesktopImage {
                    mediaItemUrl
                }
                heroMobileImage {
                    mediaItemUrl
                }
            }
            content(format: RENDERED)
            title(format: RENDERED)
            slug
            featuredImage {
                node {
                altText
                mediaItemUrl
                mediaDetails {
                    height
                    width
                }
                }
            }
            foundersCategories {
                nodes {
                customOrder
                slug
                name
                }
            }
        }
    }
  }
`;

export default async function getFounders() {
  const data = await fetchAPI(FOUNDERS_QUERY);
  return data?.allFounders?.nodes || [];
}