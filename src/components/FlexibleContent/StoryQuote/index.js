"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const StoryCopy = ({ data }) => {
    const copyRef = useRef(null);

    const { quote, author } = data;

    useEffect(() => {
        gsap.to(copyRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: copyRef.current,
                start: 'top 90%',
                scrub: false,
                invalidateOnRefresh: true,
                toggleActions: 'play none none none'
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <Container className="py-10 md:py-25">
            <div ref={copyRef} className="xl:px-20 opacity-0 translate-y-20">
                <div className="flex flex-col">
                    {quote && <div className="bg-[url('/quote-blue.svg')] bg-contain bg-center bg-no-repeat w-10 h-10 md:w-12 md:h-12 2xl:w-15 2xl:h-15 mb-3" />}
                    {quote && <div className="font-medium text-2xl md:text-[2rem]/10 xl:text-5xl leading-tight text-darkblue" dangerouslySetInnerHTML={{ __html: quote }} />}
                    {author && <div className="text-sm md:text-base font-medium drop-shadow-lg mt-3" dangerouslySetInnerHTML={{ __html: author }} />}
                </div>
            </div>
        </Container>
    )
};

export default StoryCopy;
