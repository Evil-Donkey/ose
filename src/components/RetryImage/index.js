"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const RETRY_DELAYS_MS = [500, 1500, 3000];

/**
 * next/image wrapper that retries failed loads before giving up.
 *
 * The CMS sits behind SiteGround's anti-bot WAF, which intermittently answers
 * image requests with an HTML challenge page instead of image bytes (the
 * browser reports net::ERR_BLOCKED_BY_ORB). A plain <Image> gives up forever
 * after one failure. This wrapper waits with backoff, then refetches with a
 * cache-busting query param so the browser issues a fresh request instead of
 * replaying the failed one, and only renders `fallback` once all attempts
 * are exhausted.
 *
 * @param {string} src - Image URL (raw or already proxied)
 * @param {React.ReactNode} fallback - Rendered when src is empty or all retries fail
 * @param {Function} onError - Called only after the final attempt fails
 */
export default function RetryImage({ src, alt = "", fallback = null, onError, ...props }) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const timeoutRef = useRef(null);

  // A new src (e.g. client-side navigation) starts a fresh retry cycle.
  useEffect(() => {
    setAttempt(0);
    setFailed(false);
  }, [src]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  if (!src || failed) return fallback;

  const handleError = (e) => {
    if (attempt < RETRY_DELAYS_MS.length) {
      timeoutRef.current = setTimeout(
        () => setAttempt((current) => current + 1),
        RETRY_DELAYS_MS[attempt]
      );
    } else {
      setFailed(true);
      onError?.(e);
    }
  };

  const retrySrc =
    attempt === 0
      ? src
      : `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;

  // key forces a remount per attempt so the browser actually refetches.
  return <Image key={retrySrc} {...props} alt={alt} src={retrySrc} onError={handleError} />;
}
