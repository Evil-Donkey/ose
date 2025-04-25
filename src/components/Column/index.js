"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Column = ({ copy, theme }) => {

    const copyRef = useRef(null);

    const textColor = theme === 'dark' ? 'text-white' : 'text-blue-02';

    useEffect(() => {
        gsap.to(copyRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: copyRef.current,
                start: 'top 90%',
                scrub: 1.5
            },
        });
        return () => {
            // Clean up ScrollTriggers on unmount
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (
        <div ref={copyRef} className={`w-full md:1/2 lg:w-1/3 mt-4 ${textColor} opacity-0 translate-y-20`}>
            <div className="text-base md:text-lg" dangerouslySetInnerHTML={{ __html: copy }} />
        </div>
    )
}

export default Column;