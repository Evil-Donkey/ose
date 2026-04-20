import fetchAPI from "./api";

const STORY_DATA_QUERY = `
  query Story($id: ID!) {
    story(id: $id, idType: DATABASE_ID) {
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
    }
  }
`;

const EMPTY_STORY_DATA = {
  flexibleContent: [],
};

export default async function getStoryData(id, preview = false) {
  const data = await fetchAPI(STORY_DATA_QUERY, {
    variables: { id: String(id) },
    preview,
  });
  return data?.story?.story || EMPTY_STORY_DATA;
}