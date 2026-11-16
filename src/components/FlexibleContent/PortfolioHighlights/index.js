"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Container from "@/components/Container";
import RetryImage from "@/components/RetryImage";
import formatSectionLabel from "@/lib/formatSectionLabel";
import { proxyImageUrl } from "@/lib/proxyImage";
import { useCompactSections } from "@/components/PageTheme";

gsap.registerPlugin(ScrollTrigger);

const MAX_ITEMS = 4;

const stripTags = (html) => (html ? html.replace(/<[^>]+>/g, "") : "");

const PortfolioHighlights = ({ data }) => {
  const compact = useCompactSections();
  const { sectionLabel, title, portfolio } = data || {};
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  const items = Array.isArray(portfolio)
    ? portfolio.filter((item) => item?.id).slice(0, MAX_ITEMS)
    : [];

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          opacity: 0,
          y: 30,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: titleRef.current, start: "top 90%" },
        });
      }

      const cards = cardsRef.current.filter(Boolean);
      if (cards.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: { trigger: cards[0], start: "top 90%" },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [items.length]);

  if (!title && items.length === 0) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}
      className="bg-lightblue"
    >
      <Container className={compact ? "py-13.5 lg:py-20.5 2xl:py-25.5" : "py-16 lg:py-24 2xl:py-30"}>
        {title && (
          <h2
            ref={titleRef}
            className="uppercase tracking-widest text-lg md:text-xl text-center font-medium text-white mb-10 lg:mb-14"
          >
            {title}
          </h2>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 2xl:gap-8">
            {items.map((item, index) => {
              const fields = item.portfolioFields || {};
              const backgroundUrl =
                fields.gridThumbnail?.mediaItemUrl ||
                item.featuredImage?.node?.mediaItemUrl;
              const logo = fields.logoThumbnail || fields.logo;
              const itemTitle = stripTags(item.title);

              return (
                <Link
                  key={item.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={item.slug ? `/portfolio/${item.slug}` : "/portfolio"}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg bg-blue-02 min-h-[320px] sm:aspect-square sm:min-h-0 h-full transition-transform duration-300 group-hover:-translate-y-1">
                    {backgroundUrl && (
                      <RetryImage
                        src={proxyImageUrl(backgroundUrl)}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 xl:p-6 text-white">
                      <div>
                        {logo?.mediaItemUrl ? (
                          <RetryImage
                            src={proxyImageUrl(logo.mediaItemUrl)}
                            alt={logo.altText || itemTitle}
                            width={logo.mediaDetails?.width || 200}
                            height={logo.mediaDetails?.height || 80}
                            className="h-auto w-5/6 object-contain object-left"
                            unoptimized
                            fallback={
                              <span className="text-lg 2xl:text-xl font-bold drop-shadow">
                                {itemTitle}
                              </span>
                            }
                          />
                        ) : (
                          <span className="text-lg 2xl:text-xl font-bold drop-shadow">
                            {itemTitle}
                          </span>
                        )}
                      </div>

                      {fields.portfolioTitle && (
                        <div
                          className="text-base lg:text-lg 2xl:text-xl/7 font-medium"
                          dangerouslySetInnerHTML={{ __html: fields.portfolioTitle }}
                        />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
};

export default PortfolioHighlights;
