"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import ResponsiveImage from "../../ResponsiveImage";
import Container from "../../Container";
import Button from "../../Button";
import formatSectionLabel from '@/lib/formatSectionLabel';

gsap.registerPlugin(ScrollTrigger);

const OneColumnCopyAlternate = ({ data }) => {

    const { heading, headingSize, subheading, copy, ctaLabel, ctaLink, videoMp4, videoMp4Mobile, image, imageMobile, copyLast, backgroundMedia, darkOverlay, credits, sectionLabel } = data;
    
    const contentRef = useRef([]);
    const imageRef = useRef([]);
    const videoRef = useRef([]);
    const titleRef = useRef([]);
    const titleMobileRef = useRef([]);

    const size = headingSize === "small" ? "text-4xl md:text-[3rem]/15 2xl:text-[4rem]/20" : "text-8xl md:text-[8rem]/30 2xl:text-[10rem]/50";
    
    useEffect(() => {
        const titleTl = gsap.timeline();
        titleTl.to([titleRef.current, titleMobileRef.current], {
            x: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: [titleRef.current, titleMobileRef.current],
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        })
        .to(imageRef.current, {
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
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="relative min-h-[70vh] md:min-h-[100vh] h-full w-full overflow-hidden bg-white">
            
            {heading && (
                <div className="hidden lg:flex flex-col items-center text-center pt-20 z-50 absolute top-0 left-0 w-full h-full">
                    <h2 ref={titleRef} className={`uppercase tracking-widest text:lg md:text-xl 2xl:mb-8 text-center font-medium opacity-0 translate-x-full ${!backgroundMedia ? "text-darkblue" : "text-white"}`}>{heading}</h2>
                </div>
            )}

            {backgroundMedia && (image || imageMobile) && (
                <>
                    {image && (
                        <ResponsiveImage 
                            ref={el => imageRef.current[0] = el} 
                            src={image.mediaItemUrl} 
                            alt={heading} 
                            width={image.mediaDetails?.width || 1920} 
                            height={image.mediaDetails?.height || 1080} 
                            className={`absolute inset-0 w-full h-full object-cover scale-180 origin-top ${imageMobile ? "hidden lg:block" : ""}`} 
                            priority={true}
                            sizes="100vw"
                            quality={85}
                        />
                    )}
                    {imageMobile && (
                        <ResponsiveImage 
                            ref={el => imageRef.current[1] = el} 
                            src={imageMobile.mediaItemUrl} 
                            alt={heading} 
                            width={imageMobile.mediaDetails?.width || 768} 
                            height={imageMobile.mediaDetails?.height || 1024} 
                            className="absolute inset-0 w-full h-full object-cover scale-180 origin-top lg:hidden" 
                            priority={true}
                            sizes="100vw"
                            quality={85}
                        />
                    )}
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
            
            <div className="min-h-[70vh] md:min-h-[100vh] h-full flex flex-col justify-end lg:justify-center lg:mt-20 relative z-60">
                <Container className={`h-full py-15 md:py-15 2xl:py-25 relative z-10 ${backgroundMedia ? "text-white" : "text-blue-00"} flex justify-between lg:items-center gap-10 lg:gap-25 ${copyLast ? "flex-col-reverse lg:flex-row-reverse" : "flex-col lg:flex-row"}`}>
                    <div className={`flex flex-col w-full ${headingSize === "small" ? "lg:w-3/5 xl:w-1/2" : "lg:w-1/2"} gap-5 lg:py-15`}>
                        {/* {heading && <h1 ref={el => contentRef.current[0] = el} className={`${size} ${!backgroundMedia ? "text-darkblue" : ""} tracking-tight font-light w-full opacity-0 translate-y-5`} dangerouslySetInnerHTML={{ __html: heading }} />} */}
                        <h2 ref={titleMobileRef} className={`lg:hidden uppercase tracking-widest text:lg md:text-xl 2xl:mb-8 font-medium opacity-0 translate-x-full ${!backgroundMedia ? "text-darkblue" : "text-white"}`}>{heading}</h2>
                        {subheading && <h1 ref={el => contentRef.current[1] = el} className={`${size} ${!backgroundMedia ? "text-darkblue" : ""} tracking-tight w-full opacity-0 translate-y-5`} dangerouslySetInnerHTML={{ __html: subheading }} />}
                        <div className="w-full flex flex-col gap-5">
                            {/* {subheading && <div ref={el => contentRef.current[1] = el} className="text-xl md:text-3xl lg:text-[1.8rem]/10 2xl:text-[2.5rem]/12 opacity-0 translate-y-5">
                                <div dangerouslySetInnerHTML={{ __html: subheading }} />
                            </div>} */}
                            {copy && <div ref={el => contentRef.current[2] = el} className={`text-base md:text-xl ${!backgroundMedia ? "lg:text-[1.36rem]" : "lg:text-[1.45rem]"} flex flex-col gap-4 opacity-0 translate-y-5`}>
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
                        {credits && <div className={`lg:hidden text-xs 2xl:text-sm text-end mt-4 lg:mt-10 text-white`} dangerouslySetInnerHTML={{ __html: credits }} />}
                    </div>
                    {!backgroundMedia && image && (
                        <div className="w-full lg:w-1/2 h-110 lg:h-auto overflow-hidden rounded-2xl relative one-column-copy-alternate__image">
                            <ResponsiveImage 
                                ref={imageRef} 
                                src={image.mediaItemUrl} 
                                alt={image.caption || image.altText || heading} 
                                width={image.mediaDetails?.width || 800} 
                                height={image.mediaDetails?.height || 600} 
                                className="object-cover scale-180 origin-top w-full h-full" 
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                quality={80}
                            />
                            {image.caption && <div className="absolute bottom-4 right-4 text-xs 2xl:text-sm lg:text-end mt-10 lg:mt-0 text-white" dangerouslySetInnerHTML={{ __html: image.caption }} />}
                        </div>
                    )}
                    {!backgroundMedia && videoMp4 &&
                        <div className="w-full lg:w-1/2 overflow-hidden rounded-2xl">
                            <video ref={videoRef} src={videoMp4.mediaItemUrl} autoPlay muted loop className="h-full w-full object-cover scale-180 origin-top" />
                        </div>
                    }
                </Container>
                {credits && <div className={`hidden lg:block absolute bottom-10 right-10 2xl:bottom-15 2xl:right-15 text-xs 2xl:text-sm lg:text-end mt-10 lg:mt-0 text-white`} dangerouslySetInnerHTML={{ __html: credits }} />}
            </div>
        </div>
    )
}

export default OneColumnCopyAlternate;