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
  query StoryById($id: ID!) {
    story(id: $id, idType: DATABASE_ID) { ${STORY_FIELDS} }
  }
`;

export default async function getStoryBySlug(slug) {
  const draftIdMatch = slug.match(/^draft-(\d+)$/);

  const data = draftIdMatch
    ? await fetchAPI(STORY_BY_ID_QUERY, { variables: { id: draftIdMatch[1] }, preview: true })
    : await fetchAPI(STORY_BY_SLUG_QUERY, { variables: { slug }, preview: true });

  return data?.story ?? null;
}
