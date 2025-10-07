/**
 * Image Proxy Utility
 * 
 * Wraps WordPress image URLs to use the Next.js image proxy,
 * avoiding CORS issues with VPNs and different network environments.
 * 
 * @param {string} imageUrl - The WordPress image URL
 * @param {boolean} forceProxy - Force proxying even on server-side (for HTML generation)
 * @returns {string} - Proxied URL or original URL
 */
export function proxyImageUrl(imageUrl, forceProxy = false) {
  // Return early if no URL provided
  if (!imageUrl) return '';

  // Check if we're on the server
  const isServer = typeof window === 'undefined';

  // Check if it's a WordPress image that needs proxying
  const wordpressDomains = [
    'oxfordscienceenterprises-cms.com',
    process.env.NEXT_PUBLIC_WORDPRESS_URL,
  ].filter(Boolean);

  const needsProxy = wordpressDomains.some(domain => imageUrl.includes(domain));

  // If it's a WordPress image, proxy it
  // For server-side: only proxy if forceProxy is true (for HTML that will be sent to browser)
  // For client-side: always proxy WordPress images
  if (needsProxy && (!isServer || forceProxy)) {
    return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
  }

  // Otherwise return the original URL
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

