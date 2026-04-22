import fetchAPI from "./api";

const FOUNDERS_QUERY = `
  {
    allFounders(first: 1000, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
        nodes {
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
            content(format: RENDERED)
            title(format: RENDERED)
            slug
            featuredImage {
                node {
                altText
                caption
                mediaItemUrl
                mediaDetails {
                    height
                    width
                }
                }
            }
            foundersCategories {
                nodes {
                customOrder
                slug
                name
                }
            }
        }
    }
  }
`;

export default async function getFounders(preview = false) {
  const data = await fetchAPI(FOUNDERS_QUERY, { preview });

  // Throw on fetch failure so /founders/[slug] pages using items.find(slug)
  // don't ISR-cache a bogus "Founder not found" when WP is temporarily down.
  // Skipped at build phase so a transient blip doesn't fail the deploy.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (!preview && !isBuildPhase && data === null) {
    throw new Error('CMS_FETCH_FAILED: founders list');
  }

  return data?.allFounders?.nodes || [];
}