import fetchAPI from "./api";

const TEAM_MEMBERS_QUERY = `
  {
    allTeam(first: 1000, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
        nodes {
            teamMember {
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
            title(format: RENDERED)
            content(format: RENDERED)
            uri
            slug
            date
            featuredImage {
                node {
                    altText
                    mediaItemUrl
                    mediaDetails {
                        width
                        height
                    }
                }
            }
            teamCategories {
                nodes {
                    name
                    slug
                    customOrder
                }
            }
        }
    }
  }
`;

export default async function getTeamMembers() {
  const data = await fetchAPI(TEAM_MEMBERS_QUERY);
  return data?.allTeam?.nodes || [];
}