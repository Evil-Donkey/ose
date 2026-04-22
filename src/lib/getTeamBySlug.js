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
    team(id: $slug, idType: URI) { ${TEAM_FIELDS} }
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
    // Throw on fetch failure so notFound() isn't ISR-cached for a WP outage.
    // Skipped during `next build` so a blip doesn't fail the whole deploy.
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
    if (!preview && !isBuildPhase && data === null) {
      throw new Error(`CMS_FETCH_FAILED: team id ${idMatch[1]}`);
    }
    return data?.team ?? null;
  }

  const data = await fetchAPI(TEAM_BY_SLUG_QUERY, {
    variables: { slug: slugOrId },
    preview,
  });
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (!preview && !isBuildPhase && data === null) {
    throw new Error(`CMS_FETCH_FAILED: team slug ${slugOrId}`);
  }
  return data?.team ?? null;
}
