/**
 * Image Proxy Utility
 *
 * Wraps WordPress image URLs to use the Next.js image proxy,
 * avoiding CORS/WAF issues with VPNs and different network environments.
 *
 * @param {string} imageUrl - The WordPress image URL
 * @param {boolean} forceProxy - Kept for backward compatibility (all CMS images are proxied)
 * @returns {string} - Proxied URL or original URL
 */
export function proxyImageUrl(imageUrl, forceProxy = false) {
  if (!imageUrl) return '';

  const wordpressHosts = [
    'oxfordscienceenterprises-cms.com',
    process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT,
    process.env.NEXT_PUBLIC_WORDPRESS_URL,
  ]
    .filter(Boolean)
    .map((domain) => String(domain).replace(/^https?:\/\//, '').replace(/\/+$/, ''));

  const needsProxy = wordpressHosts.some((host) => imageUrl.includes(host));
  if (!needsProxy) return imageUrl;

  // ALL CMS images go through /api/image-proxy, regardless of where the markup
  // was rendered: the browser is what ultimately fetches an <img> src, and the
  // CMS sits behind SiteGround's anti-bot WAF (sgcaptcha), which intermittently
  // answers direct browser requests with an HTML challenge page instead of
  // image bytes (surfacing as net::ERR_BLOCKED_BY_ORB — logos, heroes and team
  // photos randomly "not loading"). The proxy fetches server-side with retry +
  // WAF detection, and its responses are immutable and CDN-cacheable, so the
  // CMS only sees our server once per image rather than every visitor.
  return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
}

function proxySrcset(value) {
  return String(value)
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return trimmed;
      const bits = trimmed.split(/\s+/);
      const src = bits.shift();
      const proxied = proxyHtmlImageSrc(src);
      return [proxied, ...bits].join(" ");
    })
    .join(", ");
}

function proxyHtmlImageSrc(src) {
  if (!src) return src;
  if (src.startsWith("data:") || src.startsWith("blob:")) return src;
  if (src.startsWith("/api/image-proxy") || src.includes("/_next/image")) return src;
  return proxyImageUrl(src);
}

/**
 * Rewrite CMS <img> URLs inside WordPress WYSIWYG HTML so the browser
 * fetches them via /api/image-proxy instead of hitting SiteGround.
 */
export function proxyCmsHtmlImages(html) {
  if (!html) return html;

  return String(html)
    .replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'])/gi, (_, pre, src, post) => {
      return `${pre}${proxyHtmlImageSrc(src)}${post}`;
    })
    .replace(/(<img\b[^>]*\bsrcset=["'])([^"']+)(["'])/gi, (_, pre, srcset, post) => {
      return `${pre}${proxySrcset(srcset)}${post}`;
    });
}

/**
 * Get proxied background image style
 *
 * @param {string} imageUrl - The WordPress image URL
 * @returns {object} - Style object with backgroundImage property
 */
export function getProxiedBackgroundImage(imageUrl) {
  if (!imageUrl) return {};

  const proxiedUrl = proxyImageUrl(imageUrl);
  return {
    backgroundImage: `url(${proxiedUrl})`
  };
}
