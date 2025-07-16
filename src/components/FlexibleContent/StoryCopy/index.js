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
        <Container className="py-10 md:py-25 single-story-content">
            <div ref={copyRef} className="text-base 2xl:text-lg flex flex-col gap-5 xl:px-20 opacity-0 translate-y-20" dangerouslySetInnerHTML={{ __html: copy }} />
        </Container>
    )
};

export default StoryCopy;
