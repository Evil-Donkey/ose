import { NextResponse } from "next/server";

const UPSTREAM_TIMEOUT_MS = 15000;
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504, 403]);

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
  const allowedDomain = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://oxfordscienceenterprises-cms.com';
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
      'User-Agent': req.headers.get('user-agent') || 'Next.js Image Proxy',
    },
  };

  const maxAttempts = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetchWithTimeout(imageUrl, init, UPSTREAM_TIMEOUT_MS);

      if (!response.ok) {
        if (RETRYABLE_STATUS.has(response.status) && attempt < maxAttempts) {
          await sleep(300 * attempt);
          continue;
        }
        return NextResponse.json(
          { error: `Failed to fetch image: ${response.statusText}` },
          { status: response.status }
        );
      }

      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';

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

