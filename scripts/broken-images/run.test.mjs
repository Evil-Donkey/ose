import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { runBrokenImageCheck } from "./run.mjs";

function textResponse(body, { status = 200, contentType = "text/html" } = {}) {
  return new Response(body, {
    status,
    headers: { "content-type": contentType },
  });
}

describe("runBrokenImageCheck", () => {
  it("crawls pages, proxies CMS urls, and reports broken plus unproxied images", async () => {
    const origin = "https://www.oxfordscienceenterprises.com";
    const home = `<html><a href="/portfolio/acme">Acme</a><img src="/ok.jpg" alt="" /></html>`;
    const acme = `<html><img src="https://oxfordscienceenterprises-cms.com/wp-content/uploads/broken.jpg" alt="" /></html>`;

    const fetchImpl = async (url) => {
      const parsed = new URL(url, origin);
      if (parsed.pathname === "/api/graphql") {
        return textResponse(
          JSON.stringify({ data: { allPortfolio: { nodes: [{ slug: "acme" }] } } }),
          { contentType: "application/json" }
        );
      }
      if (parsed.pathname === "/") return textResponse(home);
      if (parsed.pathname === "/portfolio/acme") return textResponse(acme);
      if (parsed.pathname === "/ok.jpg") {
        return textResponse("jpeg-bytes-not-empty", { contentType: "image/jpeg" });
      }
      if (parsed.pathname === "/api/image-proxy") {
        return textResponse(
          JSON.stringify({ error: "CMS WAF blocked image fetch (SiteGround captcha)" }),
          { status: 502, contentType: "application/json" }
        );
      }
      return textResponse("<html></html>");
    };

    const result = await runBrokenImageCheck({
      origin,
      fetchImpl,
      seedPaths: ["/"],
      maxPages: 20,
    });

    assert.ok(result.pagesChecked >= 2);
    assert.equal(result.broken.length, 1);
    assert.match(result.broken[0].reason, /waf|captcha|502/i);
    assert.equal(result.broken[0].page, `${origin}/portfolio/acme`);
    assert.equal(result.unproxied.length, 1);
  });
});
