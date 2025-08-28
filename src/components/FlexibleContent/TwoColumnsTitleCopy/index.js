"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/Container";
import formatSectionLabel from '@/lib/formatSectionLabel';

gsap.registerPlugin(ScrollTrigger);

const TwoColumnsTitleCopy = ({ data }) => {
    const { title, blocks, sectionLabel } = data;
    const blocksRef = useRef([]);
    const titleRef = useRef(null);

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
        })
        gsap.to(blocksRef.current, {
            x: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: blocksRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        })
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="text-white bg-cover bg-center bg-[url('/mobile-gradient.jpg')] lg:bg-[url('/desktop-gradient.jpg')]">
            <Container className="py-20 2xl:py-40">
                <div className="flex flex-col text-center">
                    {title && <h3 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full text-white">{title}</h3>}
                    {blocks && 
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 xl:gap-20 xl:px-30 mt-10">
                            {blocks.map((block, index) => {
                                const { heading, copy } = block;
                                
                                return (
                                    <div key={index} ref={el => blocksRef.current[index] = el} className="flex flex-col text-center items-center justify-center opacity-0 -translate-x-full">
                                        {heading && <h4 className="text-[2.5rem]/12 xl:text-[3.75rem]/18 text-lightblue">{heading}</h4>}
                                        {copy && <div className={`text-base 2xl:text-lg text-white mt-3 md:mt-10`} dangerouslySetInnerHTML={{ __html: copy }} />}
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </Container>
        </div>
    )
}

export default TwoColumnsTitleCopy;