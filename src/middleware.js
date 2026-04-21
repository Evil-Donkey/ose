import { NextResponse } from "next/server";

/**
 * Expose the pathname to Server Components so `isPreviewCmsAuthRequest()` can
 * treat `/preview/*` as authenticated CMS traffic when `draftMode()` is still
 * a prerender stub in the root layout (Next PPR + draft-mode.js).
 */
export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-ose-pathname", request.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/preview/:path*"],
};
