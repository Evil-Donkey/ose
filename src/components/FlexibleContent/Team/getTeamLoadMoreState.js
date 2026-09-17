export const TEAM_PAGE_SIZE = 9;

/**
 * Pagination applies only to the All filter. Other team filters show every
 * matching member and never expose the load-more control.
 */
export function getTeamLoadMoreState({
  filteredMembers,
  selectedCategory,
  visibleCount,
}) {
  const isAllFilter = !selectedCategory;

  if (!isAllFilter) {
    return {
      visibleMembers: filteredMembers,
      showLoadMore: false,
    };
  }

  return {
    visibleMembers: filteredMembers.slice(0, visibleCount),
    showLoadMore: filteredMembers.length > visibleCount,
  };
}
