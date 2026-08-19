import { draftMode } from 'next/headers'

// Server component: the draft cookie (__prerender_bypass) is httpOnly, so it
// can't be detected from document.cookie on the client. draftMode() reads it
// server-side; during static prerenders it reports disabled, and draft-mode
// requests always render dynamically, so the banner shows exactly when needed.
export default async function DraftModeBanner() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-amber-400 text-black py-2 px-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
      <span className="font-semibold">Draft Preview Mode is ON in this browser</span>
      <span className="text-black/60">
        — pages load slower and may error while it&apos;s on. Click Exit Preview when you&apos;re done reviewing drafts.
      </span>
      <a
        href="/api/disable-draft"
        className="ml-2 bg-black text-white text-xs font-medium px-3 py-1 rounded hover:bg-gray-800 transition-colors"
      >
        Exit Preview
      </a>
    </div>
  )
}
