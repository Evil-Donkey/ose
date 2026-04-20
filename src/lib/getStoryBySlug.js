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
    story(id: $slug, idType: SLUG) { ${STORY_FIELDS} }
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
    return data?.story ?? null;
  }

  const data = await fetchAPI(STORY_BY_SLUG_QUERY, {
    variables: { slug: slugOrId },
    preview,
  });
  return data?.story ?? null;
}
