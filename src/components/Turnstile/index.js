"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// Public site key (safe to expose). Must match the key saved in
// Contact Form 7 -> Integration -> Turnstile.
const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAGDcDOgJ0pJkyQuw";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TOKEN_WAIT_MS = 8000;

let scriptPromise = null;

const loadTurnstileScript = () => {
  if (typeof window === "undefined") return Promise.reject();
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Turnstile"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
};

/**
 * Cloudflare Turnstile widget for the Contact Form 7 forms.
 *
 * Contact Form 7's Turnstile integration verifies a token posted as
 * `_wpcf7_turnstile_response`. The widget runs invisibly unless Cloudflare needs
 * an interaction, and the parent reads the token via ref.getToken() on submit
 * and calls ref.reset() afterwards (tokens are single-use).
 */
const Turnstile = forwardRef(function Turnstile(_props, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const tokenRef = useRef("");
  const waitersRef = useRef([]);

  useEffect(() => {
    let cancelled = false;

    loadTurnstileScript()
      .then((turnstile) => {
        if (cancelled || !containerRef.current || widgetIdRef.current !== null) return;

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          callback: (token) => {
            tokenRef.current = token;
            waitersRef.current.splice(0).forEach((resolve) => resolve(token));
          },
          "expired-callback": () => {
            tokenRef.current = "";
          },
          "error-callback": () => {
            tokenRef.current = "";
          },
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
      tokenRef.current = "";
    };
  }, []);

  useImperativeHandle(ref, () => ({
    // Resolves with the current token, waiting briefly if it is still being generated.
    getToken: () => {
      if (tokenRef.current) return Promise.resolve(tokenRef.current);
      return new Promise((resolve) => {
        waitersRef.current.push(resolve);
        setTimeout(() => {
          const index = waitersRef.current.indexOf(resolve);
          if (index !== -1) {
            waitersRef.current.splice(index, 1);
            resolve("");
          }
        }, TOKEN_WAIT_MS);
      });
    },
    reset: () => {
      tokenRef.current = "";
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  return <div ref={containerRef} className="w-full" />;
});

export default Turnstile;
