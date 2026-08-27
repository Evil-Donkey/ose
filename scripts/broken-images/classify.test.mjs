import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { classifyImageResponse } from "./classify.mjs";

describe("classifyImageResponse", () => {
  it("accepts image and svg content", () => {
    assert.equal(
      classifyImageResponse({ status: 200, contentType: "image/jpeg", bodyStart: "\xff\xd8" }).ok,
      true
    );
    assert.equal(
      classifyImageResponse({
        status: 200,
        contentType: "image/svg+xml",
        bodyStart: "<svg xmlns='http://www.w3.org/2000/svg'></svg>",
      }).ok,
      true
    );
  });

  it("flags HTML, captcha, and JSON errors as broken", () => {
    const html = classifyImageResponse({
      status: 200,
      contentType: "text/html",
      bodyStart: "<!doctype html><html>",
    });
    assert.equal(html.ok, false);
    assert.match(html.reason, /html|waf|captcha/i);

    const captcha = classifyImageResponse({
      status: 202,
      contentType: "text/html",
      bodyStart: "<html>sgcaptcha</html>",
    });
    assert.equal(captcha.ok, false);

    const json = classifyImageResponse({
      status: 502,
      contentType: "application/json",
      bodyStart: '{"error":"CMS WAF blocked image fetch (SiteGround captcha)"}',
    });
    assert.equal(json.ok, false);
    assert.match(json.reason, /waf|captcha|502/i);
  });

  it("flags missing status, empty bodies, and 404s", () => {
    assert.equal(classifyImageResponse({ status: 404, contentType: "text/plain", bodyStart: "no" }).ok, false);
    assert.equal(classifyImageResponse({ status: 200, contentType: "image/png", bodyStart: "" }).ok, false);
  });
});
