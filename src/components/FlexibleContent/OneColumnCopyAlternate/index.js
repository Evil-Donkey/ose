"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";
import Button from "../../Button";
import formatSectionLabel from '@/lib/formatSectionLabel';

gsap.registerPlugin(ScrollTrigger);

const OneColumnCopyAlternate = ({ data }) => {

    const { heading, headingSize, subheading, copy, ctaLabel, ctaLink, videoMp4, videoMp4Mobile, image, imageMobile, copyLast, backgroundMedia, darkOverlay, credits, sectionLabel } = data;
    
    const contentRef = useRef([]);
    const imageRef = useRef([]);
    const videoRef = useRef([]);

    const size = headingSize === "small" ? "text-5xl md:text-[3.5rem]/17 lg:text-[4rem]/20 2xl:text-[4.5rem]/22" : "text-8xl md:text-[8rem]/30 lg:text-[10rem]/50";
    
    useEffect(() => {
        const titleTl = gsap.timeline();
        titleTl.to(imageRef.current, {
            scale: 1,
            // duration: 2,
            ease: 'power4.out', 
            scrollTrigger: {
                trigger: imageRef.current,
                start: 'top 80%',
                end: 'top top',
                scrub: 1,
                invalidateOnRefresh: true
            },
        })
        .to(videoRef.current, {
            scale: 1,
            // duration: 2,
            ease: 'power4.out', 
            scrollTrigger: {
                trigger: videoRef.current,
                start: 'top 80%',
                end: 'top top',
                scrub: 1,
                invalidateOnRefresh: true
            },
        }, "<")
        contentRef.current.forEach((el, index) => {
            gsap.to(el, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power4.out',
                stagger: 0.5,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    end: 'top 75%',
                    scrub: 1.5,
                    invalidateOnRefresh: true
                },
            });
        });
    }, []);

    return (
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="relative min-h-[100vh] h-full w-full overflow-hidden bg-white">
            {backgroundMedia && (image || imageMobile) && (
                <>
                    {image && <div ref={el => imageRef.current[0] = el} className={`absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top ${imageMobile ? "hidden lg:block" : ""}`} style={{ backgroundImage: `url(${image.mediaItemUrl})` }} />}
                    {imageMobile && <div ref={el => imageRef.current[1] = el} className="absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top lg:hidden" style={{ backgroundImage: `url(${imageMobile.mediaItemUrl})` }} />}
                    {darkOverlay && <div className={`absolute bottom-0 lg:top-0 left-0 ${copyLast ? "lg:left-auto lg:right-0" : ""} w-full h-3/5 lg:h-full bg-gradient-to-t ${copyLast ? "lg:bg-gradient-to-l" : "lg:bg-gradient-to-r"} from-black/80 to-black/0`} />}
                </>
            )}
            {backgroundMedia && (videoMp4 || videoMp4Mobile) && 
                <>
                    {videoMp4 && <video ref={el => videoRef.current[0] = el} src={videoMp4.mediaItemUrl} autoPlay muted loop className={`absolute inset-0 h-full w-full object-cover scale-180 origin-top ${videoMp4Mobile ? "hidden lg:block" : ""}`} />}
                    {videoMp4Mobile && <video ref={el => videoRef.current[1] = el} src={videoMp4Mobile.mediaItemUrl} autoPlay muted loop className="absolute inset-0 h-full w-full object-cover scale-180 origin-top lg:hidden" />}
                    <div className="absolute top-0 left-0 w-full h-full bg-black/50 lg:bg-black/40" />
                </>
            }
            
            <div className="min-h-[100vh] h-full flex flex-col justify-end lg:justify-center">
                <Container className={`h-full py-15 md:py-25 2xl:py-45 relative z-10 ${backgroundMedia ? "text-white" : "text-blue-00"} flex justify-between gap-10 lg:gap-25 ${copyLast ? "flex-col-reverse lg:flex-row-reverse" : "flex-col lg:flex-row"}`}>
                    <div className={`flex flex-col w-full lg:w-1/2 gap-5 lg:py-15`}>
                        {heading && <h1 ref={el => contentRef.current[0] = el} className={`${size} ${!backgroundMedia ? "text-darkblue" : ""} tracking-tight font-light w-full opacity-0 translate-y-5`} dangerouslySetInnerHTML={{ __html: heading }} />}
                        <div className="w-full lg:w-3/4 flex flex-col gap-5">
                            {subheading && <div ref={el => contentRef.current[1] = el} className="text-xl md:text-3xl lg:text-[1.8rem]/10 2xl:text-[2.5rem]/12 opacity-0 translate-y-5">
                                <div dangerouslySetInnerHTML={{ __html: subheading }} />
                            </div>}
                            {copy && <div ref={el => contentRef.current[2] = el} className="text-base md:text-xl flex flex-col gap-4 opacity-0 translate-y-5">
                                <div dangerouslySetInnerHTML={{ __html: copy }} />
                            </div>}
                            {ctaLabel && 
                                <div ref={el => contentRef.current[3] = el} className="mt-5 flex opacity-0 translate-y-5">
                                    <Button 
                                        href={ctaLink.uri} 
                                        variant="light"
                                        >
                                        {ctaLabel}
                                    </Button>
                                </div>
                            }
                        </div>
                        {credits && <div className={`lg:hidden text-xs 2xl:text-sm lg:text-end mt-10 text-white`} dangerouslySetInnerHTML={{ __html: credits }} />}
                    </div>
                    {!backgroundMedia && image && (
                        <div className="w-full lg:w-1/2 h-60 lg:h-auto overflow-hidden rounded-2xl">
                            <div ref={imageRef} className="w-full h-full bg-cover bg-center scale-180 origin-top" style={{ backgroundImage: `url(${image.mediaItemUrl})` }} />
                        </div>
                    )}
                    {!backgroundMedia && videoMp4 &&
                        <div className="w-full lg:w-1/2 overflow-hidden rounded-2xl">
                            <video ref={videoRef} src={videoMp4.mediaItemUrl} autoPlay muted loop className="h-full w-full object-cover scale-180 origin-top" />
                        </div>
                    }
                </Container>
                {credits && <div className={`hidden lg:block absolute bottom-15 right-15 text-xs 2xl:text-sm lg:text-end mt-10 lg:mt-0 text-white`} dangerouslySetInnerHTML={{ __html: credits }} />}
            </div>
        </div>
    )
}

export default OneColumnCopyAlternate;