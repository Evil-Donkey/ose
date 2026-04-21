import { draftMode } from "next/headers";

/**
 * True when Next.js Draft Mode is on (after a valid `/api/draft` redirect).
 * Used so layout/footer/meganav GraphQL calls attach Headless Login auth.
 *
 * We use `draftMode()` instead of a middleware-injected request header because
 * custom headers are not always visible to `headers()` across runtimes/regions,
 * which led to mixed 403/200 GraphQL on Vercel preview.
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
