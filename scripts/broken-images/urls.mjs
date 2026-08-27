const CMS_HOST_RE = /(^|\.)oxfordscienceenterprises-cms\.com$/i;

export function isCmsHost(url) {
  try {
    return CMS_HOST_RE.test(new URL(url).hostname);
  } catch {
    return false;
  }
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
