import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isCmsHost, proxyCheckUrl } from "./urls.mjs";

const ORIGIN = "https://www.oxfordscienceenterprises.com";

describe("isCmsHost", () => {
  it("detects the WordPress CMS host", () => {
    assert.equal(
      isCmsHost("https://oxfordscienceenterprises-cms.com/wp-content/uploads/a.jpg"),
      true
    );
    assert.equal(
      isCmsHost("https://cdn.oxfordscienceenterprises-cms.com/wp-content/uploads/a.jpg"),
      true
    );
    assert.equal(isCmsHost(`${ORIGIN}/api/image-proxy?url=x`), false);
  });
});

describe("proxyCheckUrl", () => {
  it("rewrites CMS urls through the production image proxy", () => {
    const cms = "https://oxfordscienceenterprises-cms.com/wp-content/uploads/a.jpg";
    const proxied = proxyCheckUrl(ORIGIN, cms);
    assert.equal(
      proxied,
      `${ORIGIN}/api/image-proxy?url=${encodeURIComponent(cms)}`
    );
  });

  it("leaves already-proxied and same-origin urls unchanged", () => {
    const proxied = `${ORIGIN}/api/image-proxy?url=${encodeURIComponent(
      "https://oxfordscienceenterprises-cms.com/wp-content/uploads/a.jpg"
    )}`;
    assert.equal(proxyCheckUrl(ORIGIN, proxied), proxied);
    assert.equal(proxyCheckUrl(ORIGIN, `${ORIGIN}/images/logo.svg`), `${ORIGIN}/images/logo.svg`);
  });
});
