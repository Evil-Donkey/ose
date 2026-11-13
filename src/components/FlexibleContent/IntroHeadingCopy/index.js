"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/Container";
import { useCompactSections } from "@/components/PageTheme";
import formatSectionLabel from "@/lib/formatSectionLabel";

gsap.registerPlugin(ScrollTrigger);

// Same rich-text treatment as the One column copy alternate copy field,
// inheriting colour and size from the wrapper.
const COPY_PROSE_CLASSES = [
  "prose max-w-none",
  "[--tw-prose-body:currentColor] [--tw-prose-headings:currentColor] [--tw-prose-bold:currentColor] [--tw-prose-links:currentColor] [--tw-prose-bullets:var(--color-lightblue)] [--tw-prose-counters:var(--color-lightblue)] [--tw-prose-quotes:currentColor]",
  "prose-p:mt-0 prose-p:mb-4 [&>div>*:last-child]:mb-0",
  "prose-a:underline",
  "prose-ul:mt-0 prose-ul:mb-4 prose-ol:mt-0 prose-ol:mb-4 prose-li:my-1",
  "prose-headings:mt-0 prose-headings:mb-3 prose-headings:font-medium",
].join(" ");

/**
 * Large centred heading (same type scale as the One column copy alternate
 * heading) with centred copy underneath.
 */
const IntroHeadingCopy = ({ data }) => {
  const compact = useCompactSections();
  const { sectionLabel, heading, copy } = data || {};
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = [headingRef.current, copyRef.current].filter(Boolean);
      if (!items.length) return;

      gsap.set(items, { opacity: 0, y: 20 });
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
      tl.to(items, { opacity: 1, y: 0, duration: 1.2, stagger: 0.2 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 90%",
        once: true,
        onEnter: () => tl.play(),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!heading && !copy) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}
    >
      <Container className={compact ? "pt-12.75 lg:pt-17 2xl:pt-21.25 pb-10 lg:pb-12" : "pt-15 lg:pt-20 2xl:pt-25 pb-12 lg:pb-16"}>
        <div className="flex flex-col items-center text-center">
          {heading && (
            <h2
              ref={headingRef}
              className="text-darkblue text-4xl md:text-[2.9rem]/15 2xl:text-[4rem]/20 tracking-tight w-full text-balance"
            >
              {heading}
            </h2>
          )}
          {copy && (
            <div
              ref={copyRef}
              className={`w-full md:w-2/3 text-pretty text-base md:text-xl lg:text-[1.45rem] ${heading ? "mt-6 lg:mt-8" : ""} ${COPY_PROSE_CLASSES}`}
              dangerouslySetInnerHTML={{ __html: copy }}
            />
          )}
        </div>
      </Container>
    </div>
  );
};

export default IntroHeadingCopy;
