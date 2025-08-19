import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get the file URL from query parameters
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');
    
    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
    }

    // Validate that the URL is from your WordPress domain
    const allowedDomain = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://oxfordscienceenterprises-cms.com';
    if (!fileUrl.startsWith(allowedDomain)) {
      return NextResponse.json({ error: 'Invalid file URL' }, { status: 403 });
    }

    // Additional security: Only allow files from protected directories
    if (!fileUrl.includes('/protected/') && !fileUrl.includes('/wp-content/uploads/protected/')) {
      return NextResponse.json({ error: 'Only protected files are allowed' }, { status: 403 });
    }

    // Check authentication using your existing auth system
    const cookieStore = await cookies();
    const authToken = cookieStore.get("authToken")?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify the user is authenticated by making a request to your WordPress GraphQL endpoint
    const authResponse = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: `
          query GetCurrentUser {
            viewer {
              id
              username
              email
            }
          }
        `,
      }),
    });

    const authData = await authResponse.json();
    
    if (!authData?.data?.viewer) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Now fetch the protected file from WordPress
    const fileResponse = await fetch(fileUrl, {
      headers: {
        // Pass the auth token to WordPress to access protected files
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!fileResponse.ok) {
      return NextResponse.json({ 
        error: 'File not found or access denied',
        status: fileResponse.status 
      }, { status: fileResponse.status });
    }

    // Get file information
    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
    const contentLength = fileResponse.headers.get('content-length');
    
    // Extract filename from URL
    const urlParts = fileUrl.split('/');
    const filename = urlParts[urlParts.length - 1] || 'download';

    // Create response with appropriate headers
    const response = new NextResponse(fileResponse.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': contentLength,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    return response;

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
