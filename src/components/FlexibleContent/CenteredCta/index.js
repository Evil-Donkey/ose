"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/Button";
import Container from "@/components/Container";
import formatSectionLabel from "@/lib/formatSectionLabel";

gsap.registerPlugin(ScrollTrigger);

const isEmail = (url) => {
  if (!url) return false;
  return url.includes("@") && !url.startsWith("http") && !url.startsWith("/");
};

const formatEmailUrl = (email) => {
  if (!email) return "#";
  if (email.startsWith("mailto:")) return email;
  return `mailto:${email}`;
};

const CenteredCta = ({ data }) => {
  const { title, copy, ctaLabel, ctaUrl, sectionLabel } = data || {};
  const titleRef = useRef(null);
  const copyRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        x: 0,
        opacity: 1,
        duration: 2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 90%",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });
    }

    if (copyRef.current) {
      gsap.to(copyRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: copyRef.current,
          start: "top 90%",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });
    }

    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: buttonRef.current,
          start: "top 95%",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  if (!title && !copy && !ctaLabel) {
    return null;
  }

  return (
    <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}>
      <Container className="py-20 lg:py-30 2xl:py-40">
        <div className="flex flex-col items-center text-center">
          {title && (
            <h2
              ref={titleRef}
              className="uppercase tracking-widest text-lg md:text-xl mb-6 lg:mb-8 text-center font-medium text-darkblue opacity-0 translate-x-full"
            >
              {title}
            </h2>
          )}

          {copy && (
            <div
              ref={copyRef}
              className="w-full md:w-2/3 lg:w-1/2 text-base md:text-xl text-darkblue/80 mb-8 lg:mb-10 opacity-0 translate-y-5"
              dangerouslySetInnerHTML={{ __html: copy }}
            />
          )}

          {ctaLabel && ctaUrl && (
            <div ref={buttonRef} className="opacity-0 translate-y-5">
              {isEmail(ctaUrl) ? (
                <a
                  href={formatEmailUrl(ctaUrl)}
                  className="bg-lightblue text-white text-sm lg:text-xs xl:text-base font-normal px-6 py-3 rounded-full shadow hover:bg-darkblue text-center transition-colors cursor-pointer w-max uppercase inline-block"
                >
                  {ctaLabel}
                </a>
              ) : (
                <Button href={ctaUrl}>{ctaLabel}</Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default CenteredCta;
