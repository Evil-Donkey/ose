import fetchAPI from "./api";

const TEAM_MEMBER_FIELDS = `
  id
  teamMember {
    email
    linkedinUrl
    role
    heroCopyToTheRight
    heroDesktopImage {
      mediaItemUrl
      mediaDetails {
        width
        height
      }
    }
    heroMobileImage {
      mediaItemUrl
      mediaDetails {
        width
        height
      }
    }
  }
  title(format: RENDERED)
  content(format: RENDERED)
  uri
  slug
  date
  featuredImage {
    node {
      caption
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
      customOrder
      description
    }
  }
`;

// featuredImageUrl is registered by wordpress-extra.php (PHP thumbnail URL).
// Required on production where featuredImage { node } is null for unattached media.
const TEAM_MEMBERS_QUERY = `
  {
    allTeam(first: 1000, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
      nodes {
        ${TEAM_MEMBER_FIELDS}
        featuredImageUrl
      }
    }
  }
`;

const TEAM_MEMBERS_QUERY_FALLBACK = `
  {
    allTeam(first: 1000, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
      nodes {
        ${TEAM_MEMBER_FIELDS}
      }
    }
  }
`;

export default async function getTeamMembers(preview = false) {
  let data = await fetchAPI(TEAM_MEMBERS_QUERY, { preview });

  // Local / older CMS without featuredImageUrl fails the whole query — retry.
  if (data === null) {
    data = await fetchAPI(TEAM_MEMBERS_QUERY_FALLBACK, { preview });
  }

  // Throw on fetch failure so /who/[slug] pages using items.find(slug)
  // don't ISR-cache a bogus notFound() when WP is temporarily down.
  // Skipped at build phase so a transient blip doesn't fail the deploy.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (!preview && !isBuildPhase && data === null) {
    throw new Error('CMS_FETCH_FAILED: team members list');
  }

  return data?.allTeam?.nodes || [];
}
