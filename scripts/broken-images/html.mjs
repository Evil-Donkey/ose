import { isCmsHost, isImageLike } from "./urls.mjs";

const SKIP_ASSET = /\.(woff2?|ttf|otf|eot|css|js|mjs|json|map)(?:$|\?)/i;

function decodePayload(html) {
  return String(html)
    .replace(/\\u002[fF]/g, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&");
}

function toAbsolute(raw, origin) {
  const cleaned = String(raw || "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "");
  if (!cleaned || cleaned.startsWith("data:") || cleaned.startsWith("blob:")) return null;
  if (/^(javascript:|mailto:|tel:)/i.test(cleaned)) return null;
  if (SKIP_ASSET.test(cleaned)) return null;

  try {
    const absolute = new URL(cleaned, origin).href;
    return isImageLike(absolute, origin) ? absolute : null;
  } catch {
    return null;
  }
}

function addSrcset(value, origin, found) {
  for (const part of String(value).split(",")) {
    const url = toAbsolute(part.trim().split(/\s+/)[0], origin);
    if (url) found.add(url);
  }
}

function collectRenderedImageUrls(html, origin) {
  const normalized = decodePayload(html);
  const found = new Set();

  for (const match of normalized.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    const tag = match[0];
    for (const attr of tag.matchAll(/\b(?:src|srcset|srcSet)=["']([^"']+)["']/g)) {
      addSrcset(attr[1], origin, found);
    }
  }

  for (const match of normalized.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) {
    const url = toAbsolute(match[1], origin);
    if (url) found.add(url);
  }

  return found;
}

function wrappedCmsUrl(wrapper, origin) {
  try {
    const parsed = new URL(wrapper, origin);
    if (parsed.pathname === "/api/image-proxy" || parsed.pathname === "/_next/image") {
      return parsed.searchParams.get("url");
    }
  } catch {
    // ignore
  }
  return null;
}

function dropInnerCmsDuplicates(urls, origin) {
  const wrapped = new Set();
  for (const url of urls) {
    const inner = wrappedCmsUrl(url, origin);
    if (inner) wrapped.add(inner);
  }
  return [...urls].filter((url) => !wrapped.has(url));
}

export function extractImagesFromHtml(html, origin) {
  const found = collectRenderedImageUrls(html, origin);
  const normalized = decodePayload(html);

  const buried =
    /(?:\/api\/image-proxy\?url=[^"'\\\s<>]+|\/_next\/image\?[^"'\\\s<>]+|https?:\/\/[^"'\\\s<>]*oxfordscienceenterprises-cms\.com[^"'\\\s<>]*)/gi;
  for (const match of normalized.matchAll(buried)) {
    const url = toAbsolute(match[0].replace(/[),.;]+$/, ""), origin);
    if (url) found.add(url);
  }

  return dropInnerCmsDuplicates(found, origin);
}

export function extractUnproxiedCmsUrls(html, origin) {
  return [...collectRenderedImageUrls(html, origin)].filter((url) => isCmsHost(url));
}

const SKIP_PATH = /^\/(preview|api|_next)\b/;

export function extractInternalLinks(html, origin) {
  const originUrl = new URL(origin);
  const found = new Set();
  const normalized = decodePayload(html);

  for (const match of normalized.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    const href = match[1].trim();
    if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) continue;

    let url;
    try {
      url = new URL(href, origin);
    } catch {
      continue;
    }

    if (url.origin !== originUrl.origin) continue;
    if (SKIP_PATH.test(url.pathname)) continue;
    if (/\.[a-z0-9]{2,5}$/i.test(url.pathname) && !url.pathname.endsWith(".html")) continue;

    const path = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
    found.add(`${url.origin}${path}`);
  }

  return [...found];
}
