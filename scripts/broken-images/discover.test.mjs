import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { STATIC_PATHS, pathsFromGraphqlData } from "./discover.mjs";

describe("STATIC_PATHS", () => {
  it("includes the public marketing routes", () => {
    for (const path of ["/", "/portfolio", "/who", "/news", "/stories", "/what"]) {
      assert.ok(STATIC_PATHS.includes(path), `missing ${path}`);
    }
    assert.ok(!STATIC_PATHS.some((path) => path.startsWith("/preview")));
  });
});

describe("pathsFromGraphqlData", () => {
  it("maps CMS collections onto public URL paths", () => {
    const paths = pathsFromGraphqlData({
      posts: { nodes: [{ slug: "ionq-deal" }] },
      allPortfolio: { nodes: [{ slug: "oxford-ionics" }] },
      stories: { nodes: [{ slug: "a-story" }] },
      allTeam: { nodes: [{ slug: "ed-bussey" }] },
      allFounders: { nodes: [{ slug: "a-founder" }] },
    });

    assert.deepEqual(
      [...paths].sort(),
      [
        "/founders/a-founder",
        "/news/ionq-deal",
        "/portfolio/oxford-ionics",
        "/stories/a-story",
        "/who/ed-bussey",
      ]
    );
  });

  it("ignores empty slugs", () => {
    const paths = pathsFromGraphqlData({
      posts: { nodes: [{ slug: "" }, { slug: null }] },
    });
    assert.equal(paths.length, 0);
  });
});
