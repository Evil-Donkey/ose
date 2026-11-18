"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CtaButton, { useHasCtaModal } from "@/components/CtaFormModal/CtaButton";
import { usePageTheme, useCompactSections } from "@/components/PageTheme";
import Container from "@/components/Container";
import formatSectionLabel from "@/lib/formatSectionLabel";

gsap.registerPlugin(ScrollTrigger);

const CenteredCta = ({ data }) => {
  const compact = useCompactSections();
  const { title, copy, ctaLabel, ctaUrl, modalForm, sectionLabel } = data || {};
  const pageTheme = usePageTheme();
  const hasModal = useHasCtaModal();
  const titleRef = useRef(null);
  const copyRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Landing page (pink theme): reveal once as soon as the block nears the bottom of the
    // viewport, instead of the slow scroll-scrubbed fade, so it isn't faded out on page load
    // when it sits just below a short hero.
    const isLanding = pageTheme === "pink";
    const triggerFor = (el, start) =>
      isLanding
        ? { trigger: el, start: "top 98%", once: true, toggleActions: "play none none none" }
        : { trigger: el, start, scrub: 1.5, invalidateOnRefresh: true };
    const landingTiming = (delay) => (isLanding ? { duration: 1.2, delay } : {});

    if (titleRef.current) {
      gsap.to(titleRef.current, {
        x: 0,
        opacity: 1,
        duration: 2,
        ease: "power4.out",
        ...landingTiming(0),
        scrollTrigger: triggerFor(titleRef.current, "top 90%"),
      });
    }

    if (copyRef.current) {
      gsap.to(copyRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
        ...landingTiming(0.15),
        scrollTrigger: triggerFor(copyRef.current, "top 90%"),
      });
    }

    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
        ...landingTiming(0.3),
        scrollTrigger: triggerFor(buttonRef.current, "top 95%"),
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [pageTheme]);

  if (!title && !copy && !ctaLabel) {
    return null;
  }

  return (
    <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}>
      <Container className={compact ? "py-17 lg:py-25.5 2xl:py-34" : "py-20 lg:py-30 2xl:py-40"}>
        <div className="flex flex-col items-center text-center">
          {title && (
            <h2
              ref={titleRef}
              className={`uppercase tracking-widest text-lg md:text-xl mb-6 lg:mb-8 text-center font-medium ${pageTheme === "pink" ? "text-blue-02" : "text-darkblue"} opacity-0 translate-x-full`}
            >
              {title}
            </h2>
          )}

          {copy && (
            <div
              ref={copyRef}
              className={`w-full md:w-2/3 ${pageTheme === "pink" ? "" : "lg:w-1/2"} text-pretty text-base md:text-xl ${pageTheme === "pink" ? "text-darkblue" : "text-darkblue/80"} mb-8 lg:mb-10 opacity-0 translate-y-5 [&_p+p]:mt-5 md:[&_p+p]:mt-6`}
              dangerouslySetInnerHTML={{ __html: copy }}
            />
          )}

          {ctaLabel && (ctaUrl || hasModal) && (
            <div ref={buttonRef} className="opacity-0 translate-y-5">
              <CtaButton label={ctaLabel} href={ctaUrl} form={modalForm} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default CenteredCta;
