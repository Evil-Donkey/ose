import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { proxyCmsHtmlImages, proxyImageUrl } from "./proxyImage.js";

describe("proxyCmsHtmlImages", () => {
  it("rewrites CMS img src in WordPress HTML through the image proxy", () => {
    const html =
      '<p><img loading="lazy" class="aligncenter size-medium wp-image-301" src="https://oxfordscienceenterprises-cms.com/wp-content/uploads/2025/06/OSE-LOGO-FOR-BLUE-BACKGROUNDS.svg" alt="" width="300" height="300" /></p>';

    const proxied = proxyCmsHtmlImages(html);

    assert.match(proxied, /src="\/api\/image-proxy\?url=/);
    assert.doesNotMatch(
      proxied,
      /src="https:\/\/oxfordscienceenterprises-cms\.com/
    );
    assert.equal(
      proxied.includes("OSE-LOGO-FOR-BLUE-BACKGROUNDS.svg"),
      true
    );
  });

  it("does not rewrite download links or already-proxied images", () => {
    const html = `
      <a href="https://oxfordscienceenterprises-cms.com/wp-content/uploads/report.pdf">PDF</a>
      <img src="/api/image-proxy?url=${encodeURIComponent("https://oxfordscienceenterprises-cms.com/wp-content/uploads/logo.png")}" />
    `;
    const proxied = proxyCmsHtmlImages(html);
    assert.match(proxied, /href="https:\/\/oxfordscienceenterprises-cms\.com\/wp-content\/uploads\/report\.pdf"/);
    assert.equal((proxied.match(/\/api\/image-proxy/g) || []).length, 1);
  });
});

describe("proxyImageUrl", () => {
  it("leaves non-CMS urls unchanged", () => {
    assert.equal(proxyImageUrl("/gradient.png"), "/gradient.png");
  });
});
