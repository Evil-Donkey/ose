import { draftMode } from "next/headers";

/**
 * True when Next.js Draft Mode is on (after a valid `/api/draft` redirect).
 * Used so layout/footer/meganav GraphQL calls attach Headless Login auth in
 * the same way as the page-level loaders.
 *
 * Do not import this module from client components.
 */
export async function isPreviewCmsAuthRequest() {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    return false;
  }
}
