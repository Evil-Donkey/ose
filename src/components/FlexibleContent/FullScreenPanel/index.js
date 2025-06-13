"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const FullScreenPanel = ({ data }) => {

    const { heading, copy, backgroundImage } = data;
    const titleRef = useRef(null);
    const copyRef = useRef(null);
    const backgroundImageRef = useRef(null);

    useEffect(() => {
        const titleTl = gsap.timeline();
        titleTl.to(backgroundImageRef.current, {
            scale: 1,
            duration: 2,
            ease: 'power4.out', 
            scrollTrigger: {
                trigger: backgroundImageRef.current,
                start: 'top 80%',
                end: 'top top',
                scrub: 1,
                invalidateOnRefresh: true
            },
        })
        .to(titleRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: titleRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        }, "<")
        .to(copyRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: copyRef.current,
                start: 'top 90%',
                end: 'top 75%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        }, "<");
    }, []);

    return (
        <div className="relative min-h-[100vh] h-full w-full overflow-hidden">
            <div ref={backgroundImageRef} className="absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top" style={{ backgroundImage: `url(${backgroundImage.mediaItemUrl})` }} />
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 lg:bg-black/40" />
            <div className="min-h-[100vh] h-full flex flex-col justify-center">
                <Container className="py-30 md:py-25 2xl:py-45 relative z-10 text-white flex flex-col h-full">
                    <div className="flex flex-col items-center text-center w-full gap-5">
                        {heading && <h3 ref={titleRef} className="text-5xl md:text-[4rem]/20 lg:text-[6rem]/25 2xl:text-[7rem]/30 font-light tracking-tight w-full opacity-0 -translate-y-full">{heading}</h3>}
                        {copy && <div ref={copyRef} className="w-full lg:w-3/5 xl:px-17 text-xl md:text-3xl 2xl:text-[2.5rem]/12 opacity-0 translate-y-5">
                            <div className="text-center flex flex-col gap-8 items-center" dangerouslySetInnerHTML={{ __html: copy }} />
                        </div>}
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default FullScreenPanel;