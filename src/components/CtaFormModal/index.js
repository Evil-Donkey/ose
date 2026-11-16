"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Form from "@/components/Form";

const CtaFormModalContext = createContext(null);

/**
 * Returns `{ open(label) }` when the page is wrapped in <CtaFormModalProvider>,
 * otherwise null (so CTA buttons fall back to their normal links).
 */
export function useCtaFormModal() {
  return useContext(CtaFormModalContext);
}

const SLIDE_MS = 400;

// Contact Form 7 clone used by the biology decoders landing page (no sector field,
// own recipient). The container post is the landing page itself.
const LANDING_FORM_ID = process.env.NEXT_PUBLIC_CF7_LANDING_FORM_ID || "4694";
const LANDING_PAGE_ID = process.env.NODE_ENV === "development" ? "3973" : "4640";

/**
 * Wraps a landing page so every CTA button on it opens the research enquiry form
 * in a bottom-up slide-over panel. The button label becomes the panel heading.
 */
export function CtaFormModalProvider({ children, showSectors = false }) {
  const [label, setLabel] = useState("");
  const [mounted, setMounted] = useState(false); // in the DOM
  const [visible, setVisible] = useState(false); // slid in
  const [portalReady, setPortalReady] = useState(false);
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => setPortalReady(true), []);

  const open = useCallback((nextLabel) => {
    clearTimeout(closeTimerRef.current);
    lastFocusedRef.current = document.activeElement;
    setLabel(nextLabel || "");
    setMounted(true);
    // Wait a frame so the panel mounts off-screen first, then transitions in.
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
      lastFocusedRef.current?.focus?.();
    }, SLIDE_MS);
  }, []);

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  // Lock page scroll, close on Escape, and move focus into the panel while open.
  useEffect(() => {
    if (!mounted) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, close]);

  useEffect(() => {
    if (visible) closeButtonRef.current?.focus();
  }, [visible]);

  const panel =
    mounted && portalReady
      ? createPortal(
          <div className="fixed inset-0 z-[9999]" role="presentation">
            {/* Dark overlay */}
            <div
              className={`absolute inset-0 bg-black/70 transition-opacity ease-out ${visible ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDuration: `${SLIDE_MS}ms` }}
              onClick={close}
              aria-hidden="true"
            />

            {/* Slide-up panel: full height minus 50px so the site shows above the overlay */}
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cta-form-modal-title"
              className={`absolute bottom-0 left-0 w-full h-[calc(100vh-50px)] h-[calc(100dvh-50px)] rounded-t-3xl bg-cover bg-center bg-[url('/gradient.png')] text-white shadow-2xl overflow-hidden transition-transform ease-out ${visible ? "translate-y-0" : "translate-y-full"}`}
              style={{ transitionDuration: `${SLIDE_MS}ms` }}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label="Close form"
                className="absolute top-4 right-4 md:top-6 md:right-8 z-10 p-2 text-white hover:text-lightblue-02 transition-colors cursor-pointer"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="h-full overflow-y-auto overscroll-contain" data-lenis-prevent>
                <div className="mx-auto w-full max-w-3xl px-8 md:px-10 pt-16 md:pt-20 pb-16">
                  <h2
                    id="cta-form-modal-title"
                    className="text-3xl md:text-5xl font-light mb-8 md:mb-10 pr-10"
                  >
                    {label}
                  </h2>
                  {/* The panel unmounts on close, so the form state resets each time it opens */}
                  <Form
                        showSectors={showSectors}
                        submitLabel={label || undefined}
                        source={label}
                        formId={LANDING_FORM_ID}
                        containerPostId={LANDING_PAGE_ID}
                      />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <CtaFormModalContext.Provider value={{ open }}>
      {children}
      {panel}
    </CtaFormModalContext.Provider>
  );
}
