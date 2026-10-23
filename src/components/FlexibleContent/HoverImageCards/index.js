"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Container from "@/components/Container";
import formatSectionLabel from "@/lib/formatSectionLabel";
import { proxyImageUrl } from "@/lib/proxyImage";

gsap.registerPlugin(ScrollTrigger);

const HoverImageCards = ({ data }) => {
  const { title, copy, cards, sectionLabel } = data || {};
  const titleRef = useRef(null);
  const copyRef = useRef(null);
  const cardsRef = useRef([]);

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

    if (cardsRef.current.length) {
      gsap.to(cardsRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: cardsRef.current[0],
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

  if (!title && !copy && (!cards || cards.length === 0)) {
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
            className="uppercase tracking-widest text-lg md:text-xl mb-4 lg:mb-6 text-center font-medium text-darkblue opacity-0 translate-x-full"
          >
            {title}
          </h2>
        )}

        {copy && (
          <div
            ref={copyRef}
            className="w-full md:w-2/3 lg:w-1/2 mx-auto text-center text-base md:text-lg lg:text-xl text-darkblue/80 mb-10 lg:mb-14 opacity-0 translate-y-5"
            dangerouslySetInnerHTML={{ __html: copy }}
          />
        )}

        {cards?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
            {cards.map((card, index) => {
              const { title: cardTitle, image, hoverCopy } = card;
              const imageUrl = image?.mediaItemUrl
                ? proxyImageUrl(image.mediaItemUrl)
                : null;

              return (
                <div
                  key={index}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="group relative aspect-16/10 md:aspect-2/1 overflow-hidden rounded-2xl opacity-0 translate-y-10"
                >
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={image?.altText || cardTitle || ""}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent transition-colors duration-300 group-hover:from-black/85 group-hover:via-black/45 pointer-events-none" />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6 lg:p-8 flex flex-col items-start justify-end text-left">
                    {cardTitle && (
                      <h3
                        className="text-white text-2xl md:text-3xl lg:text-4xl font-medium drop-shadow-md"
                        dangerouslySetInnerHTML={{ __html: cardTitle }}
                      />
                    )}
                    {hoverCopy && (
                      <div
                        className="text-white text-sm md:text-base leading-relaxed mt-2 md:mt-3 max-w-prose overflow-hidden transition-all duration-300 ease-out opacity-100 max-h-40 lg:opacity-0 lg:max-h-0 lg:group-hover:opacity-100 lg:group-hover:max-h-40 lg:group-focus-within:opacity-100 lg:group-focus-within:max-h-40"
                        dangerouslySetInnerHTML={{ __html: hoverCopy }}
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

export default HoverImageCards;
