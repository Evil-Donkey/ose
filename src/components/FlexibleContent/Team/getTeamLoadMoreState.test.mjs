import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  TEAM_PAGE_SIZE,
  getTeamLoadMoreState,
} from "./getTeamLoadMoreState.js";

function members(count) {
  return Array.from({ length: count }, (_, i) => ({ id: `m-${i + 1}` }));
}

describe("getTeamLoadMoreState", () => {
  it("uses a page size of 9", () => {
    assert.equal(TEAM_PAGE_SIZE, 9);
  });

  it("shows the first 9 members and a load-more control on All", () => {
    const result = getTeamLoadMoreState({
      filteredMembers: members(20),
      selectedCategory: "",
      visibleCount: TEAM_PAGE_SIZE,
    });

    assert.deepEqual(
      result.visibleMembers.map((m) => m.id),
      members(9).map((m) => m.id)
    );
    assert.equal(result.showLoadMore, true);
  });

  it("loads 9 more members when visibleCount increases on All", () => {
    const result = getTeamLoadMoreState({
      filteredMembers: members(20),
      selectedCategory: "",
      visibleCount: TEAM_PAGE_SIZE * 2,
    });

    assert.equal(result.visibleMembers.length, 18);
    assert.equal(result.showLoadMore, true);
  });

  it("hides load more once every All member is visible", () => {
    const result = getTeamLoadMoreState({
      filteredMembers: members(20),
      selectedCategory: "",
      visibleCount: TEAM_PAGE_SIZE * 3,
    });

    assert.equal(result.visibleMembers.length, 20);
    assert.equal(result.showLoadMore, false);
  });

  it("hides load more when All has 9 or fewer members", () => {
    const result = getTeamLoadMoreState({
      filteredMembers: members(9),
      selectedCategory: "",
      visibleCount: TEAM_PAGE_SIZE,
    });

    assert.equal(result.visibleMembers.length, 9);
    assert.equal(result.showLoadMore, false);
  });

  it("shows every member and no load-more control on other filters", () => {
    const result = getTeamLoadMoreState({
      filteredMembers: members(12),
      selectedCategory: "executive",
      visibleCount: TEAM_PAGE_SIZE,
    });

    assert.equal(result.visibleMembers.length, 12);
    assert.equal(result.showLoadMore, false);
  });
});
