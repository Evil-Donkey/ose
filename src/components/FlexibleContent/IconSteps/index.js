"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Container from "@/components/Container";
import formatSectionLabel from "@/lib/formatSectionLabel";
import { proxyImageUrl } from "@/lib/proxyImage";

gsap.registerPlugin(ScrollTrigger);

const StepArrow = () => (
  <div
    className="hidden md:flex shrink-0 self-start items-center justify-center w-10 lg:w-14 xl:w-16 h-36 lg:h-44 xl:h-50"
    aria-hidden="true"
  >
    <svg
      className="text-darkblue w-6 h-6 lg:w-10 lg:h-10"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12h12m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const IconSteps = ({ data }) => {
  const { title, steps, sectionLabel } = data || {};
  const titleRef = useRef(null);
  const stepsRef = useRef([]);

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

    if (stepsRef.current.length) {
      gsap.to(stepsRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: stepsRef.current[0],
          start: "top 90%",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  if (!title && (!steps || steps.length === 0)) {
    return null;
  }

  return (
    <div
      id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}
      className="bg-linear-to-t from-black/10 to-black/0"
    >
      <Container className="py-20 lg:py-30 2xl:py-40">
        {title && (
          <h2
            ref={titleRef}
            className="uppercase tracking-widest text-lg md:text-xl mb-12 lg:mb-16 text-center font-medium text-darkblue opacity-0 translate-x-full"
          >
            {title}
          </h2>
        )}

        {steps?.length > 0 && (
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-0">
            {steps.map((step, index) => {
              const { icon, heading, copy } = step;
              const iconUrl = icon?.mediaItemUrl
                ? proxyImageUrl(icon.mediaItemUrl)
                : null;

              return (
                <div key={index} className="contents">
                  {index > 0 && <StepArrow />}
                  <div
                    ref={(el) => (stepsRef.current[index] = el)}
                    className="flex flex-col items-center text-center max-w-70 md:max-w-55 lg:max-w-65 xl:max-w-70 opacity-0 translate-y-10"
                  >
                    {iconUrl && (
                      <div className="relative flex items-center justify-center w-36 h-36 lg:w-44 lg:h-44 xl:w-50 xl:h-50 mb-6 lg:mb-8 rounded-full bg-[radial-gradient(circle_at_40%_35%,_#0A42A5_0%,_#00004D_72%)] p-8 lg:p-10 xl:p-12">
                        <div className="relative w-full h-full">
                          <Image
                            src={iconUrl}
                            alt={icon?.altText || heading || ""}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 80px, 120px"
                          />
                        </div>
                      </div>
                    )}
                    {heading && (
                      <h3
                        className="text-xl lg:text-2xl text-darkblue mb-3 lg:mb-4 text-balance"
                        dangerouslySetInnerHTML={{ __html: heading }}
                      />
                    )}
                    {copy && (
                      <div
                        className="text-sm lg:text-base text-darkblue/80 leading-relaxed text-balance"
                        dangerouslySetInnerHTML={{ __html: copy }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
};

export default IconSteps;
