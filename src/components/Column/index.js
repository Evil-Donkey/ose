"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Column = ({ colNumber, copy, theme, fullWidth }) => {

    const copyRef = useRef(null);

    const textColor = theme === 'dark' ? 'text-white' : 'text-blue-02';

    const colClassLg = colNumber && !fullWidth && colNumber % 2 !== 0 ? 'lg:w-1/3' : '';

    useEffect(() => {
        gsap.to(copyRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
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
        <div ref={copyRef} className={`w-full ${!fullWidth && 'md:w-2/5'} ${colClassLg} mt-4 ${textColor} opacity-0 translate-y-20`}>
            <div className="text-base md:text-[1.1rem]/7 2xl:text-xl/8 flex flex-col gap-5" dangerouslySetInnerHTML={{ __html: copy }} />
        </div>
    )
}

export default Column;