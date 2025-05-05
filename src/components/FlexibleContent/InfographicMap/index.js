"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorldMap from "./WorldMap";
import UkMap from "./UkMap";
import Headings from "@/components/Headings";

gsap.registerPlugin(ScrollTrigger);

const InfographicMap = ({ data }) => {
    const titleRef = useRef(null);
    const copyRef = useRef([]);
    const infographicMapRef = useRef(null);
    const mapWrapperRef = useRef(null);
    const worldMapTimeline = useRef(gsap.timeline());
    const ukMapTimeline = useRef(gsap.timeline());
    const resetTriggerRef = useRef(null);
    const { heading, copy, headings } = data;
    let masterTimeline = null;
    let scrollPosition = 0;

    useEffect(() => {
        const tl = gsap.timeline();

        tl.to(titleRef.current, {
            x: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: titleRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true,
            },
        })
        .to(copyRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: copyRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        })

        // const masterTimelineInit = () => {
            masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: infographicMapRef.current,
                    start: "top top",
                    end: "+=1000%",
                    pin: true,
                    pinSpacing: true,
                    scrub: 1.5,
                    invalidateOnRefresh: true,
                    id: "infographic-map-timeline",
                    onEnter: () => {
                        // When we enter the timeline (scroll down), reset position and play
                        scrollPosition = window.scrollY;
                    },
                },
            });

            masterTimeline.add(worldMapTimeline.current, 0);
            masterTimeline.to(mapWrapperRef.current, {
                xPercent: -50,
                ease: "power2.inOut",
                duration: 2,
            }, "-=2")
            .to(copyRef.current[1], {
                scale: .75,
                duration: 2,
                opacity: .5,
                ease: "power2.inOut",
            }, "<");
            masterTimeline.add(ukMapTimeline.current, "-=.3");
        // }

        // masterTimelineInit();


        // ScrollTrigger.create({
        //     trigger: infographicMapRef.current,
        //     start: "bottom top",
        //     onLeaveBack: () => {
        //         masterTimeline.seek(0).pause();
        //         window.scrollTo(0, scrollPosition);
        //     },
        // });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            <div ref={infographicMapRef} className="container mx-auto px-4 md:px-10 pt-20">
                <div className="flex flex-col items-center text-center">
                    <h2
                        ref={titleRef}
                        className="uppercase tracking-widest text-lg md:text-xl font-medium opacity-0 translate-x-full"
                    >
                        {heading}
                    </h2>
                    <div
                        ref={(el) => (copyRef.current[0] = el)}
                        className="w-full md:w-1/2 mt-4 text-blue-02 opacity-0 translate-y-10"
                    >
                        <div
                            className="text-base md:text-lg"
                            dangerouslySetInnerHTML={{ __html: copy }}
                        />
                    </div>
                </div>

                <div ref={mapWrapperRef} className="flex flex-nowrap w-[200%]">
                    <div
                        ref={(el) => (copyRef.current[1] = el)}
                        className="flex-shrink-0 flex flex-col items-center justify-center w-full lg:w-1/2 opacity-0 translate-y-10"
                    >
                        <WorldMap timeline={worldMapTimeline.current} />
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-full lg:w-1/2">
                        <UkMap timeline={ukMapTimeline.current} />
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 md:px-10 pb-20">
                <div className="flex flex-col">
                    <Headings headings={headings} />
                </div>
            </div>
        </>
    );
};

export default InfographicMap;
