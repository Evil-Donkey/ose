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

    // Since .htaccess blocks direct access, we need to use WordPress's authentication
    // to access the protected files. We'll try a few approaches:
    
    // Approach 1: Try to access the file with WordPress authentication
    let fileResponse;
    
    try {
      // First, try with Bearer token
      fileResponse = await fetch(fileUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'User-Agent': 'OxfordScienceEnterprises-InvestorPortal/1.0',
        },
      });
    } catch (error) {
      console.log('Bearer token approach failed, trying alternative methods...');
    }

    // Approach 2: If Bearer token fails, try with WordPress session cookies
    if (!fileResponse || !fileResponse.ok) {
      try {
        // Get WordPress session cookies by making an authenticated request first
        const sessionResponse = await fetch(`${allowedDomain}/wp-json/wp/v2/users/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        if (sessionResponse.ok) {
          // Now try to access the file with the session established
          fileResponse = await fetch(fileUrl, {
            credentials: 'include',
            headers: {
              'User-Agent': 'OxfordScienceEnterprises-InvestorPortal/1.0',
            },
          });
        }
      } catch (error) {
        console.log('Session-based approach failed:', error);
      }
    }

    // If all approaches fail, return an error
    if (!fileResponse || !fileResponse.ok) {
      return NextResponse.json({ 
        error: 'File access blocked by server configuration. Please contact support.',
        status: fileResponse?.status || 403,
        suggestion: 'The .htaccess file may be blocking all access to protected files.'
      }, { status: fileResponse?.status || 403 });
    }

    // File access successful, now stream it to the user
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
