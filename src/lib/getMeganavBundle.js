import { cache } from 'react';
import fetchAPI from './api';
import { isPreviewCmsAuthRequest } from './previewCmsAuthHeader';
import {
  MEGANAV_PAGE_ALIASES,
  MEGANAV_PAGE_IDS,
  MEGANAV_SECTIONS_FRAGMENT,
} from './meganavSectionsFragment';

const EMPTY_PAGE_LINKS = {
  heading: null,
  links: [],
};

// One GraphQL round-trip for all four meganav pages (section labels only).
// Do NOT include pageLinks here — that ACF field is not exposed on Page in
// WPGraphQL, and a single invalid field nulls the entire query (empty meganav).
const MEGANAV_BUNDLE_QUERY = `
  query getMeganavBundle {
    why: page(id: "226", idType: DATABASE_ID) {
      flexibleContent {
        flexibleContent {
          ${MEGANAV_SECTIONS_FRAGMENT}
        }
      }
    }
    what: page(id: "26", idType: DATABASE_ID) {
      flexibleContent {
        flexibleContent {
          ${MEGANAV_SECTIONS_FRAGMENT}
        }
      }
    }
    how: page(id: "241", idType: DATABASE_ID) {
      flexibleContent {
        flexibleContent {
          ${MEGANAV_SECTIONS_FRAGMENT}
        }
      }
    }
    who: page(id: "243", idType: DATABASE_ID) {
      flexibleContent {
        flexibleContent {
          ${MEGANAV_SECTIONS_FRAGMENT}
        }
      }
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
      pageLinks: EMPTY_PAGE_LINKS,
    };
  }
  return bundle;
}

function isMeganavBundleEmpty(bundle) {
  return Object.values(bundle).every(
    (entry) => !entry?.links || entry.links.length === 0
  );
}

async function fetchMeganavBundle(preview) {
  const data = await fetchAPI(MEGANAV_BUNDLE_QUERY, {
    preview,
    tags: ['meganav'],
  });

  const bundle = parseMeganavBundle(data);

  // Refuse to treat a total miss as a successful payload. fetchAPI already
  // avoids caching null, but an empty object of links would still render a
  // blank meganav for the full revalidate window if we ever cached it higher up.
  if (!data || isMeganavBundleEmpty(bundle)) {
    console.error(
      '[meganav] Bundle fetch returned no section labels — check CMS /graphql and page IDs 226/26/241/243.'
    );
  }

  return bundle;
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
