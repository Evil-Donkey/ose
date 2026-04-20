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
  query TeamById($id: ID!, $asPreview: Boolean!) {
    team(id: $id, idType: DATABASE_ID, asPreview: $asPreview) { ${TEAM_FIELDS} }
  }
`;

export default async function getTeamBySlug(slugOrId, { preview = true } = {}) {
  const idMatch = typeof slugOrId === "string" && slugOrId.match(/^(?:id|draft)-(\d+)$/);

  if (idMatch) {
    const data = await fetchAPI(TEAM_BY_ID_QUERY, {
      variables: { id: idMatch[1], asPreview: preview },
      preview,
    });
    return data?.team ?? null;
  }

  const data = await fetchAPI(TEAM_BY_SLUG_QUERY, {
    variables: { slug: slugOrId },
    preview,
  });
  return data?.team ?? null;
}
