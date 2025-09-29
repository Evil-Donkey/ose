"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";
import formatSectionLabel from '@/lib/formatSectionLabel';
import Button from "../../Button";

gsap.registerPlugin(ScrollTrigger);

const FullScreenPanel = ({ data }) => {

    const { heading, copy, backgroundImage, darkOverlay, sectionLabel, mainTitle, autoHeight, ctaLabel, ctaUrl } = data;
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
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className={`relative ${autoHeight ? "h-auto" : "min-h-[100vh]"} w-full overflow-hidden`}>
            <div ref={backgroundImageRef} className="absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top" style={{ backgroundImage: `url(${backgroundImage.mediaItemUrl})` }} />
            {darkOverlay && <div className="absolute top-0 left-0 w-full h-full bg-black/50 lg:bg-black/40" />}
            <div className={`${autoHeight ? "h-full" : "min-h-[100vh]"} flex flex-col justify-center`}>
                <Container className={`py-30 ${autoHeight ? "md:py-40 2xl:py-60" : "md:py-25 2xl:py-45"} relative z-10 text-white flex flex-col h-full`}>
                    {mainTitle && <h2 className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium">{mainTitle}</h2>}
                    <div className="flex flex-col items-center text-center w-full gap-5">
                        {heading && <h3 ref={titleRef} className="full-screen-panel__heading text-5xl md:text-[4rem]/20 lg:text-[6rem]/25 2xl:text-[7rem]/30 font-light tracking-tight w-full text-pretty opacity-0 -translate-y-full">{heading}</h3>}
                        {copy && <div ref={copyRef} className={`w-full xl:px-17 ${!autoHeight && "lg:w-3/5"} text-xl md:text-2xl 2xl:text-[2.5rem]/12 opacity-0 translate-y-5`}>
                            <div className="full-screen-panel__copy text-center flex flex-col gap-8 items-center" dangerouslySetInnerHTML={{ __html: copy }} />
                        </div>}
                    </div>
                    {(ctaLabel && ctaUrl) && (
                        <div className="mt-8 md:mt-12 hover:-translate-y-1! transition-all duration-500 relative z-10 flex justify-center">
                            <Button href={ctaUrl}>{ctaLabel || "Find out more"}</Button>
                        </div>
                    )}
                </Container>
            </div>
        </div>
    )
}

export default FullScreenPanel;