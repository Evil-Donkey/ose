"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/Container";
import formatSectionLabel from '@/lib/formatSectionLabel';

gsap.registerPlugin(ScrollTrigger);

const Advantages = ({ data }) => {
    const { title, copy, advantages, backgroundImage, backgroundImageMobile, sectionLabel } = data;
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
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="min-h-section-height text-white bg-cover bg-center bg-[url('/mobile-gradient.jpg')] lg:bg-[url('/desktop-gradient.jpg')] relative pt-10 pb-30">
            {backgroundImage?.mediaItemUrl && (
                <div className={`absolute inset-0 bg-cover bg-center ${backgroundImageMobile?.mediaItemUrl ? 'hidden lg:block' : ''}`} style={{ backgroundImage: `url(${backgroundImage?.mediaItemUrl})` }} />
            )}
            {backgroundImageMobile?.mediaItemUrl && (
                <div className="absolute inset-0 bg-cover bg-center lg:hidden" style={{ backgroundImage: `url(${backgroundImageMobile?.mediaItemUrl})` }} />
            )}
            <Container className="py-20 2xl:py-40 relative z-10">
                <div className="flex flex-col text-center">
                    {title && <h3 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full text-white">{title}</h3>}
                    {advantages && 
                        <div className="flex flex-col md:flex-row md:flex-wrap xl:flex-nowrap justify-center items-center mt-10 gap-4 md:gap-6 xl:gap-0">
                            {advantages.map((block, index) => {
                                const { heading, copy } = block;
                                
                                return (
                                    <div 
                                        key={index} 
                                        ref={el => blocksRef.current[index] = el} 
                                        className={`
                                            advantage-block
                                            relative 
                                            w-80 h-70
                                            flex flex-col items-center justify-center md:justify-start
                                            text-center 
                                            px-10 py-10
                                            opacity-0 -translate-x-full
                                            ${index > 0 && index % 2 === 1 ? 'md:-ml-8' : ''}
                                            ${index > 0 ? 'xl:-ml-4' : ''}
                                            before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:aspect-square before:rounded-full before:bg-white/95 before:-z-1 before:w-[320px] before:h-[320px] md:before:w-[270px] md:before:h-[270px] xl:before:w-[330px] xl:before:h-[330px]
                                        `}
                                    >
                                        {heading && (
                                            <h4 
                                                className="text-2xl text-darkblue mb-3 relative z-10" 
                                                dangerouslySetInnerHTML={{ __html: heading }} 
                                            />
                                        )}
                                        {copy && (
                                            <div 
                                                className="text-sm text-blue-02 relative z-10" 
                                                dangerouslySetInnerHTML={{ __html: copy }} 
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </Container>
            {copy && (
                <div 
                    className="advantages__copy w-full md:w-2/3 lg:w-3/5 text-center text-sm md:text-base text-white z-10 absolute lg:bottom-15 2xl:bottom-30 left-1/2 -translate-x-1/2 px-10 text-balance" 
                    dangerouslySetInnerHTML={{ __html: copy }} 
                />
            )}
        </div>
    )
}

export default Advantages;