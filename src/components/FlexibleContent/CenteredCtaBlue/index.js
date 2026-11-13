"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CtaButton, { useHasCtaModal } from "@/components/CtaFormModal/CtaButton";
import Container from "@/components/Container";
import formatSectionLabel from "@/lib/formatSectionLabel";

gsap.registerPlugin(ScrollTrigger);

const CenteredCtaBlue = ({ data }) => {
  const { title, copy, ctaLabel, ctaUrl, sectionLabel } = data || {};
  const hasModal = useHasCtaModal();
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const copyRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // One reveal timeline for the whole band, played once when it scrolls into
      // view. Deliberately not scrubbed: a scrubbed fade ties the button's
      // opacity to scroll position, so a stale trigger position (late layout
      // shifts above) can leave it stuck at opacity 0.
      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 1, ease: "power4.out" },
      });

      if (titleRef.current) {
        tl.to(titleRef.current, { x: 0, opacity: 1, duration: 1.4 }, 0);
      }
      if (copyRef.current) {
        tl.to(copyRef.current, { y: 0, opacity: 1 }, 0.15);
      }
      if (buttonRef.current) {
        tl.to(buttonRef.current, { y: 0, opacity: 1 }, 0.3);
      }

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => tl.play(),
      });

      // If the page loads (or is jumped) past the band, still show everything.
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 85%",
        onLeave: () => tl.progress(1),
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  if (!title && !copy && !ctaLabel) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}
      className="bg-lightblue text-white overflow-hidden"
    >
      <Container className="py-15 lg:py-20 2xl:py-25">
        <div className="flex flex-col items-center text-center">
          {title && (
            <h2
              ref={titleRef}
              className="uppercase tracking-widest text-lg md:text-xl mb-6 lg:mb-8 text-center font-medium text-white opacity-0 translate-x-full"
            >
              {title}
            </h2>
          )}

          {copy && (
            <div
              ref={copyRef}
              className={`w-full md:w-2/3 text-pretty text-base md:text-xl text-white ${ctaLabel && (ctaUrl || hasModal) ? "mb-8 lg:mb-10" : ""} opacity-0 translate-y-5 [&_p+p]:mt-5 md:[&_p+p]:mt-6`}
              dangerouslySetInnerHTML={{ __html: copy }}
            />
          )}

          {ctaLabel && (ctaUrl || hasModal) && (
            <div ref={buttonRef} className="opacity-0 translate-y-5">
              <CtaButton label={ctaLabel} href={ctaUrl} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default CenteredCtaBlue;
