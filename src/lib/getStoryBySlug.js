import fetchAPI from "./api";

const STORY_FIELDS = `
  databaseId
  title(format: RENDERED)
  slug
  content(format: RENDERED)
  featuredImage {
    node {
      caption
      altText
      mediaItemUrl
    }
  }
  mobileFeaturedImage {
    mobileFeaturedImage {
      mediaItemUrl
      altText
      caption
    }
  }
  story {
    flexibleContent {
      ... on Story_Story_FlexibleContent_CopyBlock {
        copy
        fieldGroupName
      }
      ... on Story_Story_FlexibleContent_ImageBlock {
        fieldGroupName
        fullWidth
        image {
          caption
          altText
          mediaItemUrl
          mediaDetails {
            height
            width
          }
        }
      }
      ... on Story_Story_FlexibleContent_QuoteBlock {
        author
        fieldGroupName
        quote
      }
    }
  }
`;

const STORY_BY_SLUG_QUERY = `
  query StoryBySlug($slug: ID!) {
    story(id: $slug, idType: URI) { ${STORY_FIELDS} }
  }
`;

const STORY_BY_ID_QUERY = `
  query StoryById($id: ID!, $asPreview: Boolean!) {
    story(id: $id, idType: DATABASE_ID, asPreview: $asPreview) { ${STORY_FIELDS} }
  }
`;

export default async function getStoryBySlug(slugOrId, { preview = true } = {}) {
  const idMatch = typeof slugOrId === "string" && slugOrId.match(/^(?:id|draft)-(\d+)$/);

  if (idMatch) {
    const data = await fetchAPI(STORY_BY_ID_QUERY, {
      variables: { id: idMatch[1], asPreview: preview },
      preview,
    });
    // Throw on fetch failure so the page's error boundary catches it. If we
    // returned null, the caller's notFound() would fire and Next.js would
    // ISR-cache a 404 for a genuine WP outage. Skipped during `next build`
    // so a transient blip doesn't fail the deploy.
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
    if (!preview && !isBuildPhase && data === null) {
      throw new Error(`CMS_FETCH_FAILED: story id ${idMatch[1]}`);
    }
    return data?.story ?? null;
  }

  const data = await fetchAPI(STORY_BY_SLUG_QUERY, {
    variables: { slug: slugOrId },
    preview,
  });
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (!preview && !isBuildPhase && data === null) {
    throw new Error(`CMS_FETCH_FAILED: story slug ${slugOrId}`);
  }
  return data?.story ?? null;
}
