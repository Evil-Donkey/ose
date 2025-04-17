"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TitleAndCopy = ({ data }) => {

    const titleRef = useRef([]);
    const copyRef = useRef(null);

    const { headings, copy } = data;

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
                scrub: 1.5
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
                scrub: 1.5
            },
        });
    }, []);
    return (
        <div className="container mx-auto px-4 lg:px-6 py-20 lg:py-40">
            <div className="flex flex-col">
                {headings.map((item, index) => {
                    const { heading, position } = item;
                    const isEnd = position === 'self-end';
                    return (
                        <h2 key={index} ref={el => titleRef.current[index] = el} className={`text-4xl md:text-8xl/27 text-darkblue opacity-0 ${position} ${isEnd ? 'translate-x-full' : '-translate-x-full'}`}>
                            {heading}   
                        </h2>
                    )
                })}
                <div ref={copyRef} className="w-full md:1/2 lg:w-1/3 self-end mt-4 text-blue-02 opacity-0 translate-y-full">
                    <div dangerouslySetInnerHTML={{ __html: copy }} />
                </div>
            </div>
            
        </div>
    )
}

export default TitleAndCopy;