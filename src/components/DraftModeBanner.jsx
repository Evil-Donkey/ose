"use client"

import { useEffect, useState } from 'react'

export default function DraftModeBanner() {
  const [isDraft, setIsDraft] = useState(false)

  useEffect(() => {
    setIsDraft(
      document.cookie.split(';').some(c => c.trim().startsWith('__prerender_bypass='))
    )
  }, [])

  if (!isDraft) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-amber-400 text-black py-2 px-4 flex items-center justify-center gap-4 text-sm">
      <span className="font-semibold">Draft Preview Mode</span>
      <span className="text-black/60">— changes are live for editors only</span>
      <a
        href="/api/disable-draft"
        className="ml-2 bg-black text-white text-xs font-medium px-3 py-1 rounded hover:bg-gray-800 transition-colors"
      >
        Exit Preview
      </a>
    </div>
  )
}
