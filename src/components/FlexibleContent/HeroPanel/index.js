"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Container from "@/components/Container";
import formatSectionLabel from "@/lib/formatSectionLabel";
import { proxyImageUrl } from "@/lib/proxyImage";
import { useCompactSections } from "@/components/PageTheme";

const FALLBACK_BACKGROUND = "/hero-panel-graphic.jpg";

// The background layer is scaled up so it can drift without exposing the
// image edges. Each side overhangs by (SCALE - 1) / 2 = 4% of the panel, so the
// max travel (3%) always stays inside that overhang.
const BG_SCALE = 1.08;
const BG_MAX_TRAVEL = 0.03;

/**
 * Hero panel: homepage-style blue gradient with a centred, rounded panel that
 * carries a background graphic, a pink title and blue copy.
 */
const HeroPanel = ({ data }) => {
  const compact = useCompactSections();
  const {
    sectionLabel,
    heading,
    copy,
    backgroundImage,
    backgroundImageMobile,
  } = data || {};

  const panelRef = useRef(null);
  const bgLayerRef = useRef(null);
  const headingRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(panelRef.current, { opacity: 0, scale: 0.96, duration: 1.2 });

      if (headingRef.current) {
        tl.from(
          headingRef.current,
          { opacity: 0, y: 30, duration: 1.2 },
          "-=0.8"
        );
      }

      if (copyRef.current) {
        tl.from(copyRef.current, { opacity: 0, y: 20, duration: 1 }, "-=0.9");
      }
    }, panelRef);

    return () => ctx.revert();
  }, []);

  // Mouse parallax: the background drifts opposite to the pointer position.
  useEffect(() => {
    const panel = panelRef.current;
    const layer = bgLayerRef.current;
    if (!panel || !layer) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduceMotion) return;

    gsap.set(layer, { scale: BG_SCALE });
    const xTo = gsap.quickTo(layer, "x", { duration: 1.2, ease: "power3.out" });
    const yTo = gsap.quickTo(layer, "y", { duration: 1.2, ease: "power3.out" });

    const onMouseMove = (e) => {
      // -1..1 across the viewport, 0 at the centre
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      xTo(-nx * panel.offsetWidth * BG_MAX_TRAVEL);
      yTo(-ny * panel.offsetHeight * BG_MAX_TRAVEL);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.killTweensOf(layer);
      gsap.set(layer, { clearProps: "x,y" });
    };
  }, []);

  if (!heading && !copy) {
    return null;
  }

  const desktopSrc = backgroundImage?.mediaItemUrl
    ? proxyImageUrl(backgroundImage.mediaItemUrl)
    : FALLBACK_BACKGROUND;
  const mobileSrc = backgroundImageMobile?.mediaItemUrl
    ? proxyImageUrl(backgroundImageMobile.mediaItemUrl)
    : null;

  return (
    <div
      id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}
      className={`hero-panel flex flex-col min-h-screen min-h-dvh bg-cover bg-center bg-[url('/gradient.png')] pt-32 md:pt-40 2xl:pt-44 ${compact ? "pb-8.5 md:pb-13.5 2xl:pb-17" : "pb-10 md:pb-16 2xl:pb-20"}`}
    >
      <Container className="flex flex-1 flex-col">
        <div
          ref={panelRef}
          className="relative overflow-hidden rounded-2xl bg-[#f1f0f5] shadow-xl flex-1 min-h-[420px] flex items-center justify-center"
        >
          <div
            ref={bgLayerRef}
            aria-hidden="true"
            className="absolute inset-0 scale-[1.08] will-change-transform"
          >
            <div
              className={`absolute inset-0 bg-cover bg-center ${mobileSrc ? "hidden md:block" : ""}`}
              style={{ backgroundImage: `url(${desktopSrc})` }}
            />
            {mobileSrc && (
              <div
                className="absolute inset-0 bg-cover bg-center md:hidden"
                style={{ backgroundImage: `url(${mobileSrc})` }}
              />
            )}
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-6 lg:gap-8 px-6 py-16 md:px-16 lg:px-24 w-full max-w-5xl">
            {heading && (
              <h1
                ref={headingRef}
                className="text-balance font-light text-5xl/13 md:text-6xl/17 lg:text-7xl/20 [@media(max-height:700px)_and_(min-width:992px)]:text-6xl/17 text-pink"
              >
                {heading}
              </h1>
            )}
            {copy && (
              <div
                ref={copyRef}
                className="text-balance font-light text-xl/7 md:text-2xl/9 2xl:text-3xl/10 [@media(max-height:700px)_and_(min-width:992px)]:text-xl/7 text-darkblue max-w-2xl"
                dangerouslySetInnerHTML={{ __html: copy }}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeroPanel;
