import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request) {
  const draft = await draftMode()
  draft.disable()

  let redirectTo = '/'
  try {
    const referer = request.headers.get('referer')
    if (referer) {
      const refererUrl = new URL(referer)
      const currentUrl = new URL(request.url)
      if (refererUrl.origin === currentUrl.origin) {
        redirectTo = refererUrl.pathname
      }
    }
  } catch {
    // malformed referer — fall back to /
  }

  redirect(redirectTo)
}
