# VPN/CORS Issue Fix

## Problem
When accessing the site through a VPN, images and GraphQL requests were failing due to CORS restrictions and IP-based blocking from WordPress. This affected:
- GraphQL API calls showing CORS errors in console
- Background images not loading (CSS `background-image: url()`)
- Next.js Image components not loading (including logos, featured images, etc.)

## Root Cause
1. **GraphQL**: Browser was making direct requests to `oxfordscienceenterprises-cms.com/graphql`, which WordPress blocked via CORS when accessed through VPN
2. **Images**: 
   - CSS background images: Direct browser requests to WordPress URLs were blocked
   - Next.js Images: Image optimization tried to fetch from WordPress and was blocked

## Solution Implemented

### 1. GraphQL Proxy (`/src/app/api/graphql/route.js`)
- Created a Next.js API route that proxies all GraphQL requests
- Routes: Browser → Next.js Server → WordPress
- Updated `/src/lib/api.js` to auto-detect client vs server:
  - **Client-side**: Uses `/api/graphql` proxy
  - **Server-side**: Directly calls WordPress (faster)

### 2. Image Proxy (`/src/app/api/image-proxy/route.js`)
- Created a Next.js API route that proxies WordPress images
- Validates URLs are from allowed WordPress domain
- Serves images with proper caching headers (1 year immutable cache)

### 3. Image Proxy Utility (`/src/lib/proxyImage.js`)
- Helper function `proxyImageUrl(url, forceProxy)` to wrap image URLs
- Auto-detects WordPress images and routes through proxy
- `forceProxy` parameter for server components generating HTML for browser

### 4. Updated Image Loading

#### Updated Files:
- ✅ `/src/lib/imageUtils.js` - `getOptimizedImageProps()` now uses proxy for all WordPress images
- ✅ `/src/app/portfolio/[slug]/page.js` - Background images use proxy

#### How It Works:
```javascript
// Before (blocked by VPN)
<div style={{ backgroundImage: `url(${wordpressImageUrl})` }} />

// After (works with VPN)
<div style={{ backgroundImage: `url(${proxyImageUrl(wordpressImageUrl, true)})` }} />
```

## Testing
Your colleague should now be able to:
1. ✅ Access the site through VPN without CORS errors
2. ✅ See all background images loading correctly
3. ✅ See all Next.js Image components (logos, featured images, etc.)
4. ✅ Use GraphQL features without console errors

## Files Modified
1. `/src/app/api/graphql/route.js` - NEW
2. `/src/app/api/image-proxy/route.js` - NEW  
3. `/src/lib/proxyImage.js` - NEW
4. `/src/lib/api.js` - Updated to use proxy on client-side
5. `/src/lib/imageUtils.js` - Updated to proxy all WordPress images
6. `/src/app/portfolio/[slug]/page.js` - Updated background image to use proxy

## Performance Notes
- **No performance impact**: Proxied URLs are cached for 1 year
- **Server-side rendering**: Still uses direct WordPress URLs (no extra hop)
- **Client-side**: Routes through Next.js server (required for VPN compatibility)

## Next Steps (Optional)
If you want to apply the image proxy to all background images across the site, you can update these components:
- Team component (`/src/components/FlexibleContent/Team/index.js`)
- Founders component (`/src/components/FlexibleContent/Founders/index.js`)
- Hero components with background images
- Any other components using CSS `background-image: url()`

Just import `proxyImageUrl` and wrap the URLs:
```javascript
import { proxyImageUrl } from '@/lib/proxyImage';

// In your JSX
style={{ backgroundImage: `url(${proxyImageUrl(imageUrl, true)})` }}
```

## WordPress CORS Headers
The WordPress CORS configuration can now be removed if desired, as all browser requests go through the Next.js server. However, keeping it doesn't hurt and provides backward compatibility.

