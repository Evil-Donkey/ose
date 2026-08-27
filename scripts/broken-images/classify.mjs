export function classifyImageResponse({ status, contentType, bodyStart }) {
  const ct = String(contentType || "").toLowerCase();
  const body = String(bodyStart || "");
  const start = body.trimStart();
  const startLower = start.toLowerCase();

  if (!status || status >= 400) {
    const jsonError = extractJsonError(start);
    const reason = jsonError
      ? `${status} ${jsonError}`
      : String(status || "no status");
    return { ok: false, reason };
  }

  if (status === 202 || startLower.includes("sgcaptcha")) {
    return { ok: false, reason: "SiteGround WAF/captcha" };
  }

  const looksLikeSvg = startLower.includes("<svg") || startLower.startsWith("<?xml");
  if (
    (ct.includes("text/html") || startLower.startsWith("<!doctype html") || startLower.startsWith("<html")) &&
    !looksLikeSvg
  ) {
    return { ok: false, reason: "HTML/WAF/captcha instead of image" };
  }

  if (!body) {
    return { ok: false, reason: "empty body" };
  }

  if (ct.includes("application/json") || start.startsWith("{")) {
    const jsonError = extractJsonError(start) || "JSON error instead of image";
    return { ok: false, reason: `${status} ${jsonError}` };
  }

  if (ct.includes("image/") || ct.includes("svg") || looksLikeSvg) {
    return { ok: true, reason: "ok" };
  }

  return { ok: false, reason: `unexpected content-type ${ct || "unknown"}` };
}

function extractJsonError(body) {
  try {
    const parsed = JSON.parse(body);
    return parsed?.error || parsed?.message || "";
  } catch {
    return "";
  }
}
