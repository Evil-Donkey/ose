"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const InspirationalQuotes = ({ data }) => {

    const { title, quotes, carousel } = data;
    
    const contentRef = useRef([]);
    const imageRef = useRef([]);

    useEffect(() => {
        const titleTl = gsap.timeline();
        
        // Create individual animations for each quote section
        quotes.forEach((_, index) => {
            // Image animation
            gsap.to(imageRef.current[index], {
                scale: 1,
                duration: 2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: imageRef.current[index],
                    start: 'top bottom',
                    end: 'top top',
                    scrub: 1,
                    invalidateOnRefresh: true
                },
            });

            // Content animation
            gsap.to(contentRef.current[index], {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: contentRef.current[index],
                    start: 'top 90%',
                    end: 'top 75%',
                    scrub: 1.5,
                    invalidateOnRefresh: true
                },
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [quotes]);

    return quotes ? (
        <div className="relative">
            {quotes.map((q, index) => {
                const { author, quoteOnTheRight, quote, image } = q;
                return (
                <div key={index.toString()} className="relative min-h-[100vh] h-full w-full overflow-hidden bg-white">
                    {image && (
                        <>
                            <div ref={el => imageRef.current[index] = el} className="absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top" style={{ backgroundImage: `url(${image.mediaItemUrl})` }} />
                            <div className="absolute top-0 left-0 w-full h-full bg-black/50 lg:bg-black/40" />
                        </>
                    )}
                    
                    <div className="min-h-[100vh] h-full flex flex-col justify-center">
                        <Container className={`h-full py-30 md:py-25 2xl:py-45 relative z-10 text-white flex gap-10 lg:gap-25 ${quoteOnTheRight ? "justify-end" : "justify-start"}`}>
                            <div className="flex flex-col w-full lg:w-1/2 gap-5 lg:py-15 opacity-0 translate-y-5" ref={el => contentRef.current[index] = el}>
                                {quote && 
                                <div className="relative">
                                    <div className="absolute -top-15 left-0 text-3xl md:text-[120px] font-medium">&quot;</div>
                                    <div className="pt-5 text-3xl md:text-5xl/13 2xl:text-6xl font-medium" dangerouslySetInnerHTML={{ __html: quote }} />
                                </div>
                                }
                                {author && 
                                    <div className="w-full mt-5">
                                        <div className="text-base font-medium" dangerouslySetInnerHTML={{ __html: author }} />
                                    </div>
                                }
                            </div>
                        </Container>
                    </div>
                </div>
            )})}
        </div>
    ) : null;
}

export default InspirationalQuotes;