'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollToHashOnRouteChange() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setTimeout(() => {
      if (window.location.hash) {
        const el = document.getElementById(window.location.hash.substring(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  }, [pathname, searchParams]);

  return null;
}