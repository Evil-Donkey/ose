import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatSlackPayload } from "./slack.mjs";

describe("formatSlackPayload", () => {
  it("summarizes broken images grouped by page", () => {
    const payload = formatSlackPayload({
      origin: "https://www.oxfordscienceenterprises.com",
      pagesChecked: 12,
      imagesChecked: 40,
      broken: [
        {
          page: "https://www.oxfordscienceenterprises.com/portfolio/acme",
          image: "https://www.oxfordscienceenterprises.com/api/image-proxy?url=hero.jpg",
          reason: "502 CMS WAF blocked image fetch",
        },
        {
          page: "https://www.oxfordscienceenterprises.com/portfolio/acme",
          image: "https://www.oxfordscienceenterprises.com/api/image-proxy?url=logo.png",
          reason: "404",
        },
      ],
      unproxied: [],
    });

    assert.match(payload.text, /2 broken image/);
    assert.match(payload.text, /portfolio\/acme/);
    assert.match(payload.text, /hero\.jpg/);
    assert.match(payload.text, /logo\.png/);
  });

  it("reports an all-clear when nothing is broken", () => {
    const payload = formatSlackPayload({
      origin: "https://www.oxfordscienceenterprises.com",
      pagesChecked: 10,
      imagesChecked: 20,
      broken: [],
      unproxied: [],
    });
    assert.match(payload.text, /no broken images/i);
    assert.match(payload.text, /10 pages/);
  });
});
