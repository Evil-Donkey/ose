import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractImagesFromHtml, extractInternalLinks, extractUnproxiedCmsUrls } from "./html.mjs";

const ORIGIN = "https://www.oxfordscienceenterprises.com";

describe("extractImagesFromHtml", () => {
  it("collects img src, srcset, and CSS background-image urls", () => {
    const html = `
      <img src="/api/image-proxy?url=https%3A%2F%2Foxfordscienceenterprises-cms.com%2Fwp-content%2Fuploads%2Fhero.jpg" alt="hero" />
      <img srcset="/a.jpg 1x, https://www.oxfordscienceenterprises.com/b.jpg 2x" />
      <div style="background-image: url('/api/image-proxy?url=https%3A%2F%2Fcms.example%2Fbg.png')"></div>
    `;

    const images = extractImagesFromHtml(html, ORIGIN);

    assert.ok(
      images.some((url) => url.includes("/api/image-proxy") && url.includes("hero.jpg"))
    );
    assert.ok(images.includes(`${ORIGIN}/a.jpg`));
    assert.ok(images.includes(`${ORIGIN}/b.jpg`));
    assert.ok(images.some((url) => url.includes("bg.png")));
  });

  it("finds proxy and CMS urls buried in Next.js payload scripts", () => {
    const html = `<script>self.__next_f.push([1,"\\/api\\/image-proxy?url=https%3A%2F%2Foxfordscienceenterprises-cms.com%2Fwp-content%2Fuploads%2Flogo.png"])</script>
      <script>{"mediaItemUrl":"https://oxfordscienceenterprises-cms.com/wp-content/uploads/team.webp"}</script>`;

    const images = extractImagesFromHtml(html, ORIGIN);

    assert.ok(images.some((url) => url.includes("logo.png")));
    assert.ok(
      images.some((url) => url.includes("oxfordscienceenterprises-cms.com") && url.includes("team.webp"))
    );
  });

  it("skips data URIs, empty src, and non-image assets", () => {
    const html = `
      <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" />
      <img src="" />
      <img src="/fonts/foo.woff2" />
      <link href="/styles.css" />
    `;

    const images = extractImagesFromHtml(html, ORIGIN);
    assert.deepEqual(images, []);
  });

  it("ignores CMS PDFs and other documents, even when wrapped in the image proxy", () => {
    const html = `
      <a href="https://oxfordscienceenterprises-cms.com/wp-content/uploads/2026/04/OSE-SDR-CFDv265.pdf">Report</a>
      <script>{"file":"/api/image-proxy?url=https%3A%2F%2Foxfordscienceenterprises-cms.com%2Fwp-content%2Fuploads%2Fprotected%2Fresults.pdf"}</script>
      <img src="/api/image-proxy?url=https%3A%2F%2Foxfordscienceenterprises-cms.com%2Fwp-content%2Fuploads%2Flogo.png" />
    `;
    const images = extractImagesFromHtml(html, ORIGIN);
    assert.ok(images.some((url) => url.includes("logo.png")));
    assert.ok(!images.some((url) => url.toLowerCase().includes(".pdf")));
  });

  it("treats next/image optimizer urls as the browser request, not the inner CMS url", () => {
    const html = `<img src="/_next/image?url=https%3A%2F%2Foxfordscienceenterprises-cms.com%2Fwp-content%2Fuploads%2Fhero.jpg&amp;w=3840&amp;q=85" />`;
    const images = extractImagesFromHtml(html, ORIGIN);
    assert.ok(images.some((url) => url.includes("/_next/image?") && url.includes("hero.jpg")));
    assert.ok(!images.some((url) => url.startsWith("https://oxfordscienceenterprises-cms.com")));
  });
});

describe("extractUnproxiedCmsUrls", () => {
  it("only flags CMS urls the browser would fetch directly", () => {
    const html = `
      <img src="https://oxfordscienceenterprises-cms.com/wp-content/uploads/raw.jpg" />
      <img src="/_next/image?url=https%3A%2F%2Foxfordscienceenterprises-cms.com%2Fwp-content%2Fuploads%2Fhero.jpg&amp;w=3840&amp;q=85" />
      <script>{"mediaItemUrl":"https://oxfordscienceenterprises-cms.com/wp-content/uploads/payload.jpg"}</script>
    `;
    const unproxied = extractUnproxiedCmsUrls(html, ORIGIN);
    assert.deepEqual(unproxied, [
      "https://oxfordscienceenterprises-cms.com/wp-content/uploads/raw.jpg",
    ]);
  });
});

describe("extractInternalLinks", () => {
  it("resolves same-origin page links and drops previews, APIs, and mailto", () => {
    const html = `
      <a href="/portfolio/acme">Acme</a>
      <a href="https://www.oxfordscienceenterprises.com/who#team-members">Team</a>
      <a href="/preview/portfolio/acme">Preview</a>
      <a href="/api/image-proxy?url=x">Proxy</a>
      <a href="mailto:hi@example.com">Email</a>
      <a href="https://example.com/external">External</a>
    `;

    const links = extractInternalLinks(html, ORIGIN);
    assert.ok(links.includes(`${ORIGIN}/portfolio/acme`));
    assert.ok(links.includes(`${ORIGIN}/who`));
    assert.ok(!links.some((url) => url.includes("/preview/")));
    assert.ok(!links.some((url) => url.includes("/api/")));
    assert.ok(!links.some((url) => url.includes("example.com")));
  });
});
