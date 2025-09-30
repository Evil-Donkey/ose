"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const StoryCopy = ({ data }) => {
    const copyRef = useRef(null);

    const { copy } = data;

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
        <Container className="pt-10 single-story-content">
            <div ref={copyRef} className="text-base 2xl:text-lg flex flex-col gap-5 xl:px-20 opacity-0 translate-y-20 prose max-w-none text-blue-02 prose-p:mb-1 prose-p:mt-0 prose-h2:text-darkblue prose-h2:mb-0 prose-h2:mt-3 prose-h2:text-xl prose-a:text-blue-02 prose-a:underline prose-ul:m-0 marker:text-lightblue" dangerouslySetInnerHTML={{ __html: copy }} />
        </Container>
    )
};

export default StoryCopy;
