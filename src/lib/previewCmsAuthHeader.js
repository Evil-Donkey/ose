import { draftMode } from "next/headers";
import { headers } from "next/headers";

const PATHNAME_HEADER = "x-ose-pathname";

/**
 * True when CMS GraphQL should send Headless Login auth (Bearer).
 *
 * 1) `draftMode().isEnabled` after `/api/draft` — correct on most routes.
 * 2) Fallback: middleware sets `x-ose-pathname` only for `/preview/*`. During
 *    Partial Prerender, `draftMode()` can return a disabled stub in the root
 *    layout while the page still runs with a real draft cookie — that produced
 *    mixed 403/200 on Vercel (layout/footer without Bearer, page with Bearer).
 *
 * Do not import this module from client components.
 */
export async function isPreviewCmsAuthRequest() {
  try {
    const { isEnabled } = await draftMode();
    if (isEnabled) return true;
  } catch {
    // ignore
  }

  try {
    const h = await headers();
    const p = h.get(PATHNAME_HEADER);
    if (typeof p === "string" && p.startsWith("/preview")) {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}
