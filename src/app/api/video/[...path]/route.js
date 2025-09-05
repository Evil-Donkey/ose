import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { path } = await params;
    const videoPath = Array.isArray(path) ? path.join('/') : path;
    
    // Construct the full URL to your CMS
    const videoUrl = `https://oxfordscienceenterprises-cms.com/${videoPath}`;
    
    // Fetch the video from your CMS
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Oxford Science Enterprises Video Proxy',
      },
    });

    if (!response.ok) {
      return new NextResponse('Video not found', { status: 404 });
    }

    // Get the video data
    const videoBuffer = await response.arrayBuffer();
    
    // Create response with proper caching headers
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': videoBuffer.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes 0-${videoBuffer.byteLength - 1}/${videoBuffer.byteLength}`,
      },
    });
  } catch (error) {
    console.error('Video proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Handle HEAD requests for video metadata
export async function HEAD(request, { params }) {
  try {
    const { path } = await params;
    const videoPath = Array.isArray(path) ? path.join('/') : path;
    const videoUrl = `https://oxfordscienceenterprises-cms.com/${videoPath}`;
    
    const response = await fetch(videoUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Oxford Science Enterprises Video Proxy',
      },
    });

    if (!response.ok) {
      return new NextResponse('Video not found', { status: 404 });
    }

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': response.headers.get('content-length') || '0',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Video HEAD error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
