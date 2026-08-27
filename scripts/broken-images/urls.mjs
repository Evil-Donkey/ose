const CMS_HOST_RE = /(^|\.)oxfordscienceenterprises-cms\.com$/i;
const IMAGE_EXT = /\.(avif|bmp|gif|ico|jpe?g|png|svg|webp)(?:$|\?)/i;
const NON_IMAGE_EXT = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|mp4|webm|mov|mp3)(?:$|\?)/i;

export function isCmsHost(url) {
  try {
    return CMS_HOST_RE.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

export function unwrapMediaUrl(url, origin) {
  try {
    const parsed = new URL(url, origin);
    if (parsed.pathname === "/api/image-proxy" || parsed.pathname === "/_next/image") {
      return parsed.searchParams.get("url") || url;
    }
  } catch {
    // ignore
  }
  return url;
}

export function isImageLike(url, origin) {
  const candidate = unwrapMediaUrl(url, origin);
  const value = String(candidate).toLowerCase();
  if (NON_IMAGE_EXT.test(value)) return false;
  if (IMAGE_EXT.test(value)) return true;

  try {
    const path = new URL(candidate, origin || "https://www.oxfordscienceenterprises.com").pathname;
    if (NON_IMAGE_EXT.test(path)) return false;
    if (IMAGE_EXT.test(path)) return true;
  } catch {
    // ignore
  }

  return false;
}

export function proxyCheckUrl(origin, url) {
  if (!isCmsHost(url)) return url;
  const originBase = String(origin).replace(/\/+$/, "");
  return `${originBase}/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export function canonicalOrigin(origin) {
  return new URL(origin).origin;
}

export function pageUrl(origin, path) {
  const base = canonicalOrigin(origin);
  if (!path || path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized.replace(/\/+$/, "")}`;
}
