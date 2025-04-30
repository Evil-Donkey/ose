"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const UkMap = () => {

    const infographicMapRef = useRef(null);
    const mapWrapperRef = useRef(null);
    const mapImageRef = useRef(null);
    const ringRef = useRef([]);
    const roundelsRef = useRef([]);

    useEffect(() => {
        const ringTl = gsap.timeline({ paused: true });
        ringTl.to(ringRef.current, {
            scale: 10,
            opacity: 0,
            duration: 3,
            stagger: {
              each: 1,
              repeat: -1
            }
        });

        ScrollTrigger.create({
            trigger: infographicMapRef.current,
            start: "center center",
            end: `+=400%`,
            pin: true,
            pinSpacing: true,
            onToggle: (self) => {
                if (self.isActive) {
                    ringTl.play();
                }
            },
        });

        const roundelTl = gsap.timeline({
            scrollTrigger: {
                trigger: mapImageRef.current,
                start: "top top",
                end: `+=400%`,
                scrub: 1.5,
                invalidateOnRefresh: true
            }
        });

        roundelTl.to(mapWrapperRef.current, {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            duration: 5
        });

        roundelsRef.current.forEach((roundel, index) => {
            const isEven = index % 2 === 0;
            const xDistance = isEven ? -250 : 250;
            const yDistance = -100;

            roundelTl.to(roundel, {
                scale: 1,
                x: xDistance,
                y: yDistance,
                ease: "power2.out",
                duration: 4,
                delay: .25,
            }, `ukMap+=${index * 2}`)
            .to(roundel, {
                opacity: 0,
                ease: "linear",
                duration: .25,
                delay: 2
            }, "<");
        });
        
        return () => {
            // Clean up ScrollTriggers on unmount
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (
        <div ref={infographicMapRef} className="flex flex-col items-center justify-center -mt-[170%] min-h-screen">
            <div ref={mapWrapperRef} className="relative w-full lg:w-120 origin-[47%_34%] scale-50 opacity-0">
                <Image ref={mapImageRef} className="object-contain w-full!" src="/infographic/uk-map.svg" alt="Infographic Map" width={1000} height={500} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-55 2xl:mt-55 ms-20 2xl:ms-20 rounded-full size-5 opacity-80">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div ref={el => ringRef.current[index] = el} key={index} className="absolute h-full w-full rounded-full opacity-80 scale-0 bg-lightblue" />
                    ))}
                </div>
            </div>
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} ref={el => roundelsRef.current[index] = el} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-55 2xl:mt-55 ms-20 2xl:ms-20 scale-0">
                    <Image src={`/infographic/roundel-${index + 1}.png`} alt={`Roundel ${index + 1}`} width={500} height={500} />
                </div>
            ))}
        </div>
    )
}

export default UkMap;