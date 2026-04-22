import fetchAPI from "./api";

const FOUNDER_FIELDS = `
  databaseId
  title(format: RENDERED)
  content(format: RENDERED)
  slug
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
  featuredImage {
    node {
      altText
      caption
      mediaItemUrl
    }
  }
`;

const FOUNDER_BY_SLUG_QUERY = `
  query FounderBySlug($slug: ID!) {
    founder(id: $slug, idType: SLUG) { ${FOUNDER_FIELDS} }
  }
`;

const FOUNDER_BY_ID_QUERY = `
  query FounderById($id: ID!, $asPreview: Boolean!) {
    founder(id: $id, idType: DATABASE_ID, asPreview: $asPreview) { ${FOUNDER_FIELDS} }
  }
`;

export default async function getFounderBySlug(slugOrId, { preview = true } = {}) {
  const idMatch = typeof slugOrId === "string" && slugOrId.match(/^(?:id|draft)-(\d+)$/);

  if (idMatch) {
    const data = await fetchAPI(FOUNDER_BY_ID_QUERY, {
      variables: { id: idMatch[1], asPreview: preview },
      preview,
    });
    // Throw on fetch failure so notFound() isn't ISR-cached for a WP outage.
    // Skipped during `next build` so a blip doesn't fail the whole deploy.
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
    if (!preview && !isBuildPhase && data === null) {
      throw new Error(`CMS_FETCH_FAILED: founder id ${idMatch[1]}`);
    }
    return data?.founder ?? null;
  }

  const data = await fetchAPI(FOUNDER_BY_SLUG_QUERY, {
    variables: { slug: slugOrId },
    preview,
  });
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (!preview && !isBuildPhase && data === null) {
    throw new Error(`CMS_FETCH_FAILED: founder slug ${slugOrId}`);
  }
  return data?.founder ?? null;
}
