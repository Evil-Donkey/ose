import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname, searchParams } = request.nextUrl;
    
    // Example redirects with complex logic
    // Add your redirect logic here
    
    // Example: Redirect old portfolio URLs to new structure
    // if (pathname.startsWith('/portfolio/old-')) {
    //     const newPath = pathname.replace('/portfolio/old-', '/portfolio/');
    //     return NextResponse.redirect(new URL(newPath, request.url));
    // }
    
    // Example: Redirect based on query parameters
    // if (pathname === '/search' && searchParams.get('q')) {
    //     const query = searchParams.get('q');
    //     return NextResponse.redirect(new URL(`/portfolio?search=${query}`, request.url));
    // }
    
    // Example: Conditional redirects based on user agent or other headers
    // const userAgent = request.headers.get('user-agent') || '';
    // if (pathname === '/mobile-only' && !userAgent.includes('Mobile')) {
    //     return NextResponse.redirect(new URL('/desktop-version', request.url));
    // }
    
    return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        // Match all paths except:
        // - API routes
        // - _next/static (static files)
        // - _next/image (image optimization files)
        // - favicon.ico (favicon file)
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
