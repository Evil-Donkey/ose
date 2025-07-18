import fetchAPI from "./api";

const TEAM_MEMBERS_QUERY = `
  {
    allTeam(first: 1000) {
        nodes {
            teamMember {
                role
            }
            title(format: RENDERED)
            uri
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