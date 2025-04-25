"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Headings = ({ headings, theme }) => {
    const headingRef = useRef([]);
    
    const textColor = theme === 'dark' ? 'text-white' : 'text-darkblue';

    useEffect(() => {
        gsap.to(headingRef.current, {
            x: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: headingRef.current,
                start: 'top 90%',
                scrub: 1.5
            },
        })
        return () => {
            // Clean up ScrollTriggers on unmount
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            {headings.map((item, index) => {
                const { heading, position } = item;
                const isEnd = position === 'self-end';
                return (
                    <h2 key={index} ref={el => headingRef.current[index] = el} className={`text-4xl md:text-8xl/27 ${textColor} opacity-0 ${position} ${isEnd ? 'translate-x-full' : '-translate-x-full'}`}>
                        {heading}   
                    </h2>
                )
            })}
        </>
    )
}

export default Headings;