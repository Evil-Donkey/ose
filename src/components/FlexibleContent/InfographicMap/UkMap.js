"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useIsMobile } from "@/hooks/isMobile";

gsap.registerPlugin(ScrollTrigger);

const UkMap = ({ timeline }) => {
    const ringRefs = useRef([]);
    const roundelRefs = useRef([]);
    const isMobile = useIsMobile();

    useEffect(() => {
        timeline.to(ringRefs.current, {
          scale: 10,
          opacity: 0,
          duration: 6,
          stagger: {
            each: 1,
            // repeat: 10,
          },
        }, 0);
    
        roundelRefs.current.forEach((roundel, index) => {
          const isEven = index % 2 === 0;
          const xDistance = isMobile ? (isEven ? -180 : 100) : (isEven ? -250 : 250);
          const yDistance = -200;
          const startTime = 1 + index;
          const scale = isMobile ? 4 : 1;
    
          timeline
            .to(roundel, {
              scale: scale,
              x: xDistance,
              y: yDistance,
              ease: "power2.out",
              duration: 4,
            }, startTime)
            .to(roundel, {
              opacity: 0,
              ease: "power2.out",
              duration: 1,
            }, "<+=2");
        });
      }, [isMobile]);

  return (
    <div className="flex flex-col items-center justify-center md:min-h-screen w-full relative scale-60 sm:scale-90 md:scale-60 2xl:scale-100 origin-top">
      <div className="relative w-full lg:w-120 md:origin-[47%_34%]">
        <Image
          className="object-contain w-full"
          src="/infographic/uk-map.svg"
          alt="UK Map"
          width={1000}
          height={500}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-44 md:mt-55 2xl:mt-55 ms-16 md:ms-20 2xl:ms-20 rounded-full size-5 opacity-80">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              ref={(el) => (ringRefs.current[index] = el)}
              className="absolute h-full w-full rounded-full opacity-80 scale-0 bg-lightblue"
            />
          ))}
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          ref={(el) => (roundelRefs.current[index] = el)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-44 md:mt-55 2xl:mt-55 ms-16 md:ms-20 2xl:ms-20 scale-0"
        >
          <Image
            src={`/infographic/${index + 1}.png`}
            alt={`Roundel ${index + 1}`}
            width={500}
            height={500}
          />
        </div>
      ))}
    </div>
  );
};

export default UkMap;
