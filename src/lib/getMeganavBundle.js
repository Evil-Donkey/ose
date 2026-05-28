import { cache } from 'react';
import fetchAPI from './api';
import { isPreviewCmsAuthRequest } from './previewCmsAuthHeader';
import {
  MEGANAV_PAGE_ALIASES,
  MEGANAV_PAGE_IDS,
  MEGANAV_PAGE_LINKS_FRAGMENT,
  MEGANAV_SECTIONS_FRAGMENT,
} from './meganavSectionsFragment';

const EMPTY_PAGE_LINKS = {
  heading: null,
  links: [],
};

// One GraphQL round-trip for all four meganav pages (section labels + page links).
// Previously this was 12 parallel requests (4× section query + 4× pageLinks + duplicated
// again when HeaderServer and page both loaded meganav data).
const MEGANAV_BUNDLE_QUERY = `
  query getMeganavBundle {
    why: page(id: "226", idType: DATABASE_ID) {
      flexibleContent {
        flexibleContent {
          ${MEGANAV_SECTIONS_FRAGMENT}
        }
      }
      ${MEGANAV_PAGE_LINKS_FRAGMENT}
    }
    what: page(id: "26", idType: DATABASE_ID) {
      flexibleContent {
        flexibleContent {
          ${MEGANAV_SECTIONS_FRAGMENT}
        }
      }
      ${MEGANAV_PAGE_LINKS_FRAGMENT}
    }
    how: page(id: "241", idType: DATABASE_ID) {
      flexibleContent {
        flexibleContent {
          ${MEGANAV_SECTIONS_FRAGMENT}
        }
      }
      ${MEGANAV_PAGE_LINKS_FRAGMENT}
    }
    who: page(id: "243", idType: DATABASE_ID) {
      flexibleContent {
        flexibleContent {
          ${MEGANAV_SECTIONS_FRAGMENT}
        }
      }
      ${MEGANAV_PAGE_LINKS_FRAGMENT}
    }
  }
`;

function parseSectionLinks(flexibleContent) {
  if (!Array.isArray(flexibleContent)) return [];
  return flexibleContent
    .filter((block) => block && block.sectionLabel)
    .map((block) => ({
      sectionLabel: block.sectionLabel,
      fieldGroupName: block.fieldGroupName,
    }));
}

function parseMeganavBundle(data) {
  const bundle = {};
  for (const [key, alias] of Object.entries(MEGANAV_PAGE_ALIASES)) {
    const page = data?.[alias];
    bundle[key] = {
      links: parseSectionLinks(page?.flexibleContent?.flexibleContent),
      pageLinks: page?.pageLinks || EMPTY_PAGE_LINKS,
    };
  }
  return bundle;
}

async function fetchMeganavBundle(preview) {
  const data = await fetchAPI(MEGANAV_BUNDLE_QUERY, {
    preview,
    tags: ['meganav'],
  });
  return parseMeganavBundle(data);
}

/**
 * Single cached meganav payload for the whole request tree.
 * Returns { Why: { links, pageLinks }, What: ..., How: ..., Who: ... }.
 */
const getMeganavBundle = cache(async () => {
  const preview = await isPreviewCmsAuthRequest();
  return fetchMeganavBundle(preview);
});

export default getMeganavBundle;

export { MEGANAV_PAGE_IDS };
