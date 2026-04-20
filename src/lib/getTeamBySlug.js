import fetchAPI from "./api";

const TEAM_FIELDS = `
  databaseId
  title(format: RENDERED)
  content(format: RENDERED)
  slug
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
  featuredImage {
    node {
      caption
      altText
      mediaItemUrl
    }
  }
`;

const TEAM_BY_SLUG_QUERY = `
  query TeamBySlug($slug: ID!) {
    team(id: $slug, idType: SLUG) { ${TEAM_FIELDS} }
  }
`;

const TEAM_BY_ID_QUERY = `
  query TeamById($id: ID!) {
    team(id: $id, idType: DATABASE_ID) { ${TEAM_FIELDS} }
  }
`;

export default async function getTeamBySlug(slug) {
  const draftIdMatch = slug.match(/^draft-(\d+)$/);

  const data = draftIdMatch
    ? await fetchAPI(TEAM_BY_ID_QUERY, { variables: { id: draftIdMatch[1] }, preview: true })
    : await fetchAPI(TEAM_BY_SLUG_QUERY, { variables: { slug }, preview: true });

  return data?.team ?? null;
}
