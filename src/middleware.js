import { NextResponse } from "next/server";

const PREVIEW_CMS_AUTH_HEADER = "x-ose-preview-cms-auth";

/**
 * Mark `/preview/*` requests so server loaders can attach Headless Login auth
 * without importing `next/headers` from `api.js` (which is bundled for the client).
 */
export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PREVIEW_CMS_AUTH_HEADER, "1");
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/preview/:path*"],
};
