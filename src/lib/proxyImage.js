/**
 * Image Proxy Utility
 * 
 * Wraps WordPress image URLs to use the Next.js image proxy,
 * avoiding CORS issues with VPNs and different network environments.
 * 
 * @param {string} imageUrl - The WordPress image URL
 * @param {boolean} forceProxy - Rare override; SVGs are proxied automatically
 * @returns {string} - Proxied URL or original URL
 */
export function proxyImageUrl(imageUrl, forceProxy = false) {
  if (!imageUrl) return '';

  const isServer = typeof window === 'undefined';
  const isSvg = /\.svg(\?|#|$)/i.test(imageUrl);

  // Cross-origin SVGs in <img> are blocked by Chrome ORB. Proxy those only.
  // JPG/PNG load directly from the CMS — proxying every hero/background image
  // doubles server traffic and triggers SiteGround sgcaptcha during local dev.
  // When sgcaptcha is active the CMS returns HTML for image URLs; the browser
  // then reports that as net::ERR_BLOCKED_BY_ORB (not a separate CORS bug).
  const wordpressHosts = [
    'oxfordscienceenterprises-cms.com',
    process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT,
    process.env.NEXT_PUBLIC_WORDPRESS_URL,
  ]
    .filter(Boolean)
    .map((domain) => String(domain).replace(/^https?:\/\//, '').replace(/\/+$/, ''));

  const needsProxy = wordpressHosts.some((host) => imageUrl.includes(host));

  if (!needsProxy) return imageUrl;
  if (forceProxy || isSvg) {
    return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
  }
  // Server-rendered raster images do not need the proxy.
  if (isServer) return imageUrl;

  return imageUrl;
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

