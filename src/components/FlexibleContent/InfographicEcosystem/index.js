"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogoDark } from "@/components/Icons/Logo";
import Container from "../../Container";
import formatSectionLabel from '@/lib/formatSectionLabel';

gsap.registerPlugin(ScrollTrigger);

const InfographicMap = ({ data, onPopupOpen }) => {
    const titleRef = useRef([]);
    const copyRef = useRef(null);
    const infographicRef = useRef(null);
    const circlesRef = useRef([]);
    const lineRef = useRef([]);
    const bottomTextRef = useRef([]);
    const ecosystemRef = useRef(null);

    const { title, copy, sectionLabel } = data;

    const timelineData = [
        // { period: "1959 - 1999", count: 22, size: 85 },
        { period: "2000-2004", count: 32, size: 120 },
        // { period: "2005-2009", count: 23, size: 90 },
        { period: "2005-2014", count: 51, size: 160 },
        { period: "2015-2019", count: 82 },
        { period: "2020-2024", count: "100+" },
    ];

    useEffect(() => {
        const titleTl = gsap.timeline();
        titleTl.to(titleRef.current, {
            x: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: titleRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
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

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: infographicRef.current,
                start: "top 70%",
                end: "bottom 70%",
                toggleActions: "play none none reverse"
            }
        });

        // Animate circles one by one
        circlesRef.current.forEach((circle, index) => {
            tl.fromTo(circle, 
                { scale: 0, opacity: 0 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    duration: 0.5,
                    ease: "back.out(1.7)"
                },
                index * 0.2
            );
        });

        // Animate the line
        tl.fromTo(lineRef.current,
            { scaleY: 0, transformOrigin: "top" },
            { 
                scaleY: 1, 
                duration: 1,
                ease: "power2.out"
            }
        );

        // Animate bottom text
        tl.fromTo(bottomTextRef.current,
            { y: 50, opacity: 0 },
            { 
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.1
            }
        );

        // return () => {
        //     ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        // };
    }, []);

    const handleCircleClick = () => {
        onPopupOpen();
    };

    return (
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} ref={ecosystemRef} className="bg-linear-to-t from-black/10 to-black/0 relative overflow-hidden flex w-full h-full">
            <Container className="py-20 2xl:pb-40">
                <div className="flex flex-col items-center text-center">
                    {title && <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h2>}
                    {copy && <div ref={copyRef} className="w-full md:w-2/3 text-center text-blue-02 opacity-0 translate-y-20">
                        <div className="text-base md:text-xl flex flex-col gap-4" dangerouslySetInnerHTML={{ __html: copy }} />
                    </div>}
                </div>
                <div className="flex flex-col my-10 lg:my-20 2xl:my-30">
                    <div ref={infographicRef} className="relative w-full flex flex-row lg:flex-nowrap items-center justify-center -space-x-2 xl:scale-110 2xl:scale-130 mt-8 lg:mt-0">
                        <div className="relative flex items-center -space-x-2">
                            <div className="relative" ref={el => circlesRef.current[0] = el}>
                                <div className="absolute -top-15.5 lg:-top-8 left-1/2 -translate-x-1/2 w-full text-center text-xs text-blue-02">2000-2004</div>
                                <div className="relative flex items-center justify-center rounded-full bg-lightblue/50 size-15 lg:size-30">
                                    <div className="text-xl lg:text-4xl text-darkblue">34</div>
                                </div>
                            </div>
                            <div className="relative" ref={el => circlesRef.current[1] = el}>
                                <div className="absolute -top-13 lg:-top-8 left-1/2 -translate-x-1/2 w-10 lg:w-full text-center text-xs text-blue-02">2005-2014</div>
                                <div className="relative flex items-center justify-center rounded-full bg-lightblue/50 size-20 lg:size-40">
                                    <div className="text-3xl lg:text-6xl text-darkblue">52</div>
                                </div>
                            </div>

                            <div 
                                ref={el => lineRef.current[1] = el}
                                className="absolute right-1 top-[80px] lg:top-[120px] 2xl:top-[140px] w-[2px] h-[120px] lg:h-[160px] 2xl:h-[200px] bg-[#B8DDE0]"
                            >
                                <div className="absolute left-0 bottom-0 w-[500px] ps-2" ref={el => bottomTextRef.current[1] = el}>
                                    <div className="w-30 h-auto mb-2">
                                        <LogoDark />
                                    </div>
                                    <h3 className="font-bold text-xs text-blue-02">OSE established 2015</h3>
                                </div>
                            </div>
                        </div>

                        <div onClick={handleCircleClick} className="flex flex-row justify-start items-center -space-x-2 relative group">
                            <div className="relative" ref={el => circlesRef.current[2] = el}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-full text-center text-xs text-blue-900">2015-2019</div>
                                <div 
                                    className="relative flex flex-col items-center justify-center size-27 lg:size-60 transition-all duration-300 group-hover:scale-105 rounded-full bg-linear-to-r from-[#003EA6]/90 to-[#000050] text-lightblue cursor-pointer"
                                >
                                    <div className="text-4xl lg:text-7xl">82</div>
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs lg:text-sm text-white text-center hidden lg:block">Click to see OSE&apos;s spinouts</div>
                                </div>
                            </div>
                            <div className="relative" ref={el => circlesRef.current[3] = el}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-full text-center text-xs text-blue-900">2020-2024</div>
                                <div className="relative flex flex-col items-center justify-center size-38 lg:size-80 transition-all duration-300 group-hover:scale-105 rounded-full bg-linear-to-r from-[#003EA6]/90 to-[#000050] text-lightblue cursor-pointer">
                                    <div className="text-5xl lg:text-8xl">100+</div>
                                    <div className="text-lg lg:text-3xl -mt-1">Companies</div>
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs lg:text-sm text-white text-center hidden lg:block">Click to see OSE&apos;s spinouts</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default InfographicMap;