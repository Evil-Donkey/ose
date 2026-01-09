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

    // Parse the file URL - it could be a proxy URL (with ?protected_file=) or direct URL
    let protectedFilePath = null;
    let proxyUrl = fileUrl;
    
    // Check if it's a proxy URL format
    const urlObj = new URL(fileUrl);
    if (urlObj.searchParams.has('protected_file')) {
      // Extract the file path from the proxy URL
      protectedFilePath = urlObj.searchParams.get('protected_file');
      // Build the proxy URL with authentication
      proxyUrl = `${allowedDomain}/?protected_file=${encodeURIComponent(protectedFilePath)}`;
    } else if (fileUrl.includes('/wp-content/uploads/protected/')) {
      // Extract relative path from direct URL
      const match = fileUrl.match(/\/wp-content\/uploads\/protected\/(.+)$/);
      if (match) {
        protectedFilePath = match[1];
        proxyUrl = `${allowedDomain}/?protected_file=${encodeURIComponent(protectedFilePath)}`;
      }
    } else {
      return NextResponse.json({ error: 'Only protected files are allowed' }, { status: 403 });
    }

    if (!protectedFilePath) {
      return NextResponse.json({ error: 'Could not extract file path from URL' }, { status: 400 });
    }

    // Fetch the file through WordPress proxy endpoint with authentication
    // Note: The WordPress proxy endpoint needs to accept the auth token
    // We'll pass it as a header, but WordPress may need to be configured to accept it
    const fileResponse = await fetch(proxyUrl, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'User-Agent': 'OxfordScienceEnterprises-InvestorPortal/1.0',
      },
      // Don't follow redirects automatically
      redirect: 'manual',
    });

    // Handle redirects (WordPress might redirect)
    if (fileResponse.status >= 300 && fileResponse.status < 400) {
      const redirectUrl = fileResponse.headers.get('location');
      if (redirectUrl) {
        const redirectResponse = await fetch(redirectUrl, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'User-Agent': 'OxfordScienceEnterprises-InvestorPortal/1.0',
          },
        });
        
        if (redirectResponse.ok) {
          return streamFileResponse(redirectResponse, protectedFilePath);
        }
      }
    }

    // Check if the response is successful
    if (!fileResponse.ok) {
      // Try to get error message
      const errorText = await fileResponse.text();
      let errorMessage = 'File access denied';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        // Not JSON, use the text or default message
        if (errorText && errorText.length < 200) {
          errorMessage = errorText;
        }
      }
      
      return NextResponse.json({ 
        error: errorMessage || 'File wasn\'t available on site',
        status: fileResponse.status
      }, { status: fileResponse.status });
    }

    // Check if response is actually a file (not JSON error)
    const contentType = fileResponse.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      // Likely an error response
      const errorData = await fileResponse.json();
      return NextResponse.json({ 
        error: errorData.error || errorData.message || 'File wasn\'t available on site',
        status: fileResponse.status
      }, { status: fileResponse.status || 403 });
    }

    return streamFileResponse(fileResponse, protectedFilePath);

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// Helper function to stream file response
function streamFileResponse(fileResponse, filePath) {
  const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
  const contentLength = fileResponse.headers.get('content-length');
  
  // Extract filename from path
  const filename = filePath.split('/').pop() || 'download';
  
  // Create response with appropriate headers
  return new NextResponse(fileResponse.body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      ...(contentLength && { 'Content-Length': contentLength }),
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
