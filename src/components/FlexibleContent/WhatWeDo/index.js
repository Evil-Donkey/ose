"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import Headings from "@/components/Headings";
import Column from "@/components/Column";
import Stats from "../../Stats";

const WhatWeDo = ({ data }) => {
    const { title, columns, headings, stats } = data;
    const titleRef = useRef([]);

    const colNumber = columns.length;

    useEffect(() => {

        gsap.to(titleRef.current, {
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
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="text-white bg-cover bg-center bg-[url('/gradient.png')]">
            <div className="container mx-auto px-4 md:px-10 py-20 lg:py-40">
                <div className="flex flex-col">
                    {title && <h3 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium text-white opacity-0 translate-x-full">{title}</h3>}
                    {headings && <Headings headings={headings} theme="dark" />}
                    {columns && 
                        <div className="flex w-full space-x-14 mt-10">
                            {columns.map((column, index) => {
                                return (
                                    <Column key={index} copy={column.copy} colNumber={colNumber} theme="dark" />
                                )
                            })}
                        </div>
                    }
                    {stats && 
                        <div className="mt-20">
                            <Stats data={stats} theme="dark" />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default WhatWeDo;