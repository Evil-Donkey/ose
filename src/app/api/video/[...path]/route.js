import { NextResponse } from 'next/server';

function buildVideoUrl(pathParam) {
  const videoPath = Array.isArray(pathParam) ? pathParam.join('/') : pathParam;
  return `https://oxfordscienceenterprises-cms.com/${videoPath}`;
}

function getVideoHeaders(upstreamHeaders) {
  const headers = new Headers();

  const contentType = upstreamHeaders.get('content-type') || 'video/mp4';
  headers.set('Content-Type', contentType);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  const contentLength = upstreamHeaders.get('content-length');
  if (contentLength) {
    headers.set('Content-Length', contentLength);
  }

  const acceptRanges = upstreamHeaders.get('accept-ranges');
  if (acceptRanges) {
    headers.set('Accept-Ranges', acceptRanges);
  }

  const contentRange = upstreamHeaders.get('content-range');
  if (contentRange) {
    headers.set('Content-Range', contentRange);
  }

  return headers;
}

export async function GET(request, { params }) {
  try {
    const { path } = await params;
    const videoUrl = buildVideoUrl(path);

    const requestHeaders = {
      'User-Agent': 'Oxford Science Enterprises Video Proxy',
    };

    // Forward byte-range requests so browsers can seek in videos.
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      requestHeaders.Range = rangeHeader;
    }

    const response = await fetch(videoUrl, {
      headers: requestHeaders,
    });

    if (!response.ok) {
      return new NextResponse('Video not found', { status: 404 });
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: getVideoHeaders(response.headers),
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
    const videoUrl = buildVideoUrl(path);
    
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
      status: response.status,
      headers: getVideoHeaders(response.headers),
    });
  } catch (error) {
    console.error('Video HEAD error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
