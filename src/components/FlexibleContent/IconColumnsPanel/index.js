"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/Container";
import RetryImage from "@/components/RetryImage";
import formatSectionLabel from "@/lib/formatSectionLabel";
import { proxyImageUrl } from "@/lib/proxyImage";

gsap.registerPlugin(ScrollTrigger);

const COLUMN_GRID = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

const IconColumnsPanel = ({ data }) => {
  const { title, columns, sectionLabel } = data || {};
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const columnRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Played once when the panel scrolls into view (not scrubbed, so a stale
      // trigger position can never leave the content stuck invisible).
      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 1, ease: "power4.out" },
      });

      if (titleRef.current) {
        tl.to(titleRef.current, { x: 0, opacity: 1, duration: 1.4 }, 0);
      }
      const items = columnRefs.current.filter(Boolean);
      if (items.length) {
        tl.to(items, { y: 0, opacity: 1, stagger: 0.15 }, 0.2);
      }

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => tl.play(),
      });
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 80%",
        onLeave: () => tl.progress(1),
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  if (!title && (!columns || columns.length === 0)) {
    return null;
  }

  const gridCols = COLUMN_GRID[Math.min(columns?.length || 3, 3)];

  return (
    <div
      ref={rootRef}
      id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}
    >
      <Container className="py-10 lg:py-16 2xl:py-20">
        <div className="rounded-2xl bg-[#E0E0E0] px-6 py-12 md:px-10 lg:px-16 lg:py-16 2xl:py-20">
          {title && (
            <h2
              ref={titleRef}
              className="uppercase tracking-widest text-lg md:text-xl mb-10 lg:mb-14 text-center font-medium text-darkblue opacity-0 translate-x-full"
            >
              {title}
            </h2>
          )}

          {columns?.length > 0 && (
            <div className={`grid grid-cols-1 ${gridCols} gap-12 md:gap-8 lg:gap-16`}>
              {columns.map((column, index) => {
                const { icon, copy } = column;
                const iconUrl = icon?.mediaItemUrl
                  ? proxyImageUrl(icon.mediaItemUrl)
                  : null;

                return (
                  <div
                    key={index}
                    ref={(el) => (columnRefs.current[index] = el)}
                    className="flex flex-col items-center text-center opacity-0 translate-y-10"
                  >
                    {iconUrl && (
                      <div className="relative w-full h-32 lg:h-40 mb-8 lg:mb-10">
                        <RetryImage
                          src={iconUrl}
                          alt={icon?.altText || ""}
                          fill
                          unoptimized
                          className="object-contain"
                          sizes="(max-width: 768px) 80vw, 33vw"
                        />
                      </div>
                    )}
                    {copy && (
                      <div
                        className="w-full max-w-72 text-pretty text-sm md:text-base font-medium text-darkblue [&_p+p]:mt-3"
                        dangerouslySetInnerHTML={{ __html: copy }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default IconColumnsPanel;
