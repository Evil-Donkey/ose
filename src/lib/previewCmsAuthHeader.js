import { headers } from "next/headers";

const HEADER = "x-ose-preview-cms-auth";

/**
 * True when middleware marked this request as the /preview/* tree, so CMS
 * fetches should attach Headless Login auth (see root `src/middleware.js`).
 * Do not import this module from client components.
 */
export async function isPreviewCmsAuthRequest() {
  try {
    const h = await headers();
    return h.get(HEADER) === "1";
  } catch {
    return false;
  }
}
