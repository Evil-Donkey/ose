"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "../../Button";
import WorldMap from "./WorldMap";
import UkMap from "./UkMap";
import Headings from "@/components/Headings";

gsap.registerPlugin(ScrollTrigger);

const InfographicMap = ({ data }) => {
    const titleRef = useRef([]);
    const copyRef = useRef([]);

    const { heading, copy, headings } = data;

    useEffect(() => {
        const tl = gsap.timeline();
        tl.to(titleRef.current, {
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
            stagger: 0.1,
            scrollTrigger: {
                trigger: copyRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        });

        return () => {
            // Clean up ScrollTriggers on unmount
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="container mx-auto px-4 md:px-10 py-20">
            <div className="flex flex-col items-center text-center">
                <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{heading}</h2>
                <div ref={el => copyRef.current[0] = el} className="w-full md:w-1/2 text-center mt-4 text-blue-02 opacity-0 translate-y-10">
                    <div className="text-base md:text-lg" dangerouslySetInnerHTML={{ __html: copy }} />
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center text-center mt-8">
                <Button ref={el => copyRef.current[1] = el} className="opacity-0 translate-y-10">View Oxford led innnovations</Button>
                <Button ref={el => copyRef.current[2] = el} className="opacity-0 translate-y-10">View Oxford key statistics</Button>
            </div>

            <WorldMap />
            <UkMap />
            <div className="flex flex-col mt-20">
                <Headings headings={headings} />
            </div>
        </div>
    )
}

export default InfographicMap;