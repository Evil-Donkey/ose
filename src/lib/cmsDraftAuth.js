import { draftMode } from "next/headers";

/**
 * True when this request is in Next.js Draft Mode (after /api/draft).
 * Used so layout/footer/meganav GraphQL calls attach Headless Login auth —
 * otherwise WordPress may 403 unauthenticated requests while a preview page loads.
 *
 * Only import this module from server-only loaders (never from client components).
 */
export async function isCmsDraftRequest() {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    return false;
  }
}
