import { NextResponse } from "next/server";

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
  try {
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

    // Fetch the image from WordPress
    const response = await fetch(imageUrl, {
      headers: {
        // Forward some headers to help with caching
        'User-Agent': req.headers.get('user-agent') || 'Next.js Image Proxy',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Content-Length': imageBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error("Image Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to proxy image" },
      { status: 500 }
    );
  }
}

