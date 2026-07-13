import { NextResponse } from "next/server";

const UPSTREAM_TIMEOUT_MS = 15000;
const UPSTREAM_USER_AGENT = 'OSE-NextJS/1.0 (+server-render)';
const RETRYABLE_STATUS = new Set([202, 408, 425, 429, 500, 502, 503, 504, 403]);

function isUpstreamWafBlock(status, contentType, bytes) {
  if (status === 202) return true;

  const ct = String(contentType).toLowerCase();
  if (ct.includes('text/html')) return true;
  if (ct.includes('image/') || ct.includes('svg')) return false;

  if (bytes?.byteLength >= 1) {
    const start = new TextDecoder().decode(bytes.slice(0, 256)).toLowerCase();
    if (start.includes('sgcaptcha') || start.includes('<html') || start.includes('<!doctype html')) {
      return true;
    }
    // SVG/XML also start with '<' — do not treat as captcha HTML
    if (start.includes('<svg') || start.startsWith('<?xml')) return false;
  }

  return false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Image Proxy API Route
 *
 * Proxies WordPress images through Next.js server to avoid CORS issues
 * when accessing from VPNs or different network environments.
 *
 * Usage: /api/image-proxy?url=https://oxfordscienceenterprises-cms.com/wp-content/...
 *
 * This allows CSS background-image to work through VPN by routing
 * requests through the same-origin Next.js server.
 */
export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }

  // Validate that the URL is from the allowed WordPress domain
  const allowedDomain =
    process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    'https://oxfordscienceenterprises-cms.com';
  if (!imageUrl.startsWith(allowedDomain)) {
    return NextResponse.json(
      { error: "Invalid image URL domain" },
      { status: 403 }
    );
  }

  // Fetch with a timeout and a single retry on transient upstream errors / aborts.
  // Without this, a slow or flaky WP host would hang or fail the first-paint
  // background image, leaving pages visibly broken.
  const init = {
    headers: {
      'User-Agent': UPSTREAM_USER_AGENT,
    },
  };

  const maxAttempts = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetchWithTimeout(imageUrl, init, UPSTREAM_TIMEOUT_MS);

      const upstreamContentType = response.headers.get('content-type') || '';
      const imageBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(imageBuffer);

      if (
        !response.ok ||
        isUpstreamWafBlock(response.status, upstreamContentType, bytes)
      ) {
        if (RETRYABLE_STATUS.has(response.status) && attempt < maxAttempts) {
          await sleep(500 * attempt);
          continue;
        }
        const wafBlock = isUpstreamWafBlock(response.status, upstreamContentType, bytes);
        return NextResponse.json(
          {
            error: wafBlock
              ? 'CMS WAF blocked image fetch (SiteGround captcha)'
              : `Failed to fetch image: ${response.statusText}`,
          },
          { status: wafBlock ? 502 : response.status }
        );
      }

      const pathname = new URL(imageUrl).pathname.toLowerCase();
      const contentType =
        upstreamContentType ||
        (pathname.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg');

      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Length': imageBuffer.byteLength.toString(),
        },
      });
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await sleep(300 * attempt);
        continue;
      }
    }
  }

  console.error("Image Proxy Error:", lastError);
  const isAbort = lastError?.name === 'AbortError';
  return NextResponse.json(
    { error: isAbort ? 'Image proxy timed out' : 'Failed to proxy image' },
    { status: 502 }
  );
}

