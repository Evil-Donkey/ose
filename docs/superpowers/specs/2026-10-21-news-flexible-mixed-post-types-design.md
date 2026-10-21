# News flexible content — mixed post types

**Date:** 2026-10-21  
**Status:** Approved

## Goal

Allow the flexible content **News** layout to pull OSE News (`post`), **Stories**, and **Portfolio News** from the existing ACF relationship field (already updated in WP), and render each type appropriately in the 4-item grid.

## Architecture

Extend `Page_Flexiblecontent_FlexibleContent_News` GraphQL fragment with `Story` and `PortfolioNewsItem` inline fragments. Branch rendering in `FlexibleContent/News` by type. Preserve ACF order. Keep “See all news” → `/news`.

## Rendering

| Type | Card |
|------|------|
| Post | Unchanged: image → date → title |
| Story | Same image treatment; title uses News date styles; no date or short text; link via `uri` |
| Portfolio News | Category pill, date, title, optional hashtag; equal width; bg cycles white → navy → light blue by Portfolio-only index |

## Edge cases

- Skip null relationship entries
- Missing image: omit image block
- Empty story excerpt/content: title only
- No portfolio category: omit pill
- No portfolio URL: non-link card

## Out of scope

- Extracting shared card components
- Changing ACF field structure
- Changing the footer CTA
