"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";
import Button from "../../Button";

gsap.registerPlugin(ScrollTrigger);

const OneColumnCopyAlternate = ({ data }) => {

    const { heading, headingSize, subheading, copy, ctaLabel, ctaLink, videoMp4, image, copyLast, backgroundMedia } = data;
    const contentRef = useRef([]);
    const imageRef = useRef(null);
    const videoRef = useRef(null);

    const size = headingSize === "small" ? "text-5xl md:text-[4rem]/20 lg:text-[6rem]/25 2xl:text-[7rem]/30" : "text-6xl md:text-[8rem]/30 lg:text-[10rem]/50";

    useEffect(() => {
        const titleTl = gsap.timeline();
        titleTl.to(imageRef.current, {
            scale: 1,
            duration: 2,
            ease: 'power4.out', 
            scrollTrigger: {
                trigger: imageRef.current,
                start: 'top bottom',
                end: 'top top',
                scrub: 1,
                invalidateOnRefresh: true
            },
        })
        .to(videoRef.current, {
            scale: 1,
            duration: 2,
            ease: 'power4.out', 
            scrollTrigger: {
                trigger: videoRef.current,
                start: 'top bottom',
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

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="relative min-h-[100vh] h-full w-full overflow-hidden bg-white">
            {backgroundMedia && image && (
                <>
                    <div ref={imageRef} className="absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top" style={{ backgroundImage: `url(${image.mediaItemUrl})` }} />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/50 lg:bg-black/40" />
                </>
            )}
            {backgroundMedia && videoMp4 && 
                <>
                    <video ref={videoRef} src={videoMp4.mediaItemUrl} autoPlay muted loop className="absolute inset-0 h-full w-full object-cover scale-180 origin-top" />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/50 lg:bg-black/40" />
                </>
            }
            
            <div className="min-h-[100vh] h-full flex flex-col justify-center">
                <Container className={`h-full py-30 md:py-25 2xl:py-45 relative z-10 ${backgroundMedia ? "text-white" : "text-blue-00"} flex justify-between gap-10 lg:gap-25 ${copyLast ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`flex flex-col w-full lg:w-3/5 gap-5`}>
                        {heading && <h1 ref={el => contentRef.current[0] = el} className={`${size} ${!backgroundMedia ? "text-darkblue" : ""} tracking-tight w-full opacity-0 translate-y-5`}>{heading}</h1>}
                        <div className="w-3/5 flex flex-col gap-5">
                            {subheading && <div ref={el => contentRef.current[1] = el} className="text-xl md:text-3xl 2xl:text-[2.5rem]/12 opacity-0 translate-y-5">
                                <div dangerouslySetInnerHTML={{ __html: subheading }} />
                            </div>}
                            {copy && <div ref={el => contentRef.current[2] = el} className="text-base md:text-xl flex flex-col gap-4 opacity-0 translate-y-5">
                                <div dangerouslySetInnerHTML={{ __html: copy }} />
                            </div>}
                            {ctaLabel && 
                                <div ref={el => contentRef.current[3] = el} className="mt-5 flex opacity-0 translate-y-5">
                                    <Button 
                                        href={ctaLink} 
                                        variant="light"
                                        >
                                        {ctaLabel}
                                    </Button>
                                </div>
                            }
                        </div>
                    </div>
                    {!backgroundMedia && image && (
                        <div className="w-full lg:w-2/5 overflow-hidden rounded-2xl">
                            <div ref={imageRef} className="w-full h-full bg-cover bg-center scale-180 origin-top" style={{ backgroundImage: `url(${image.mediaItemUrl})` }} />
                        </div>
                    )}
                    {!backgroundMedia && videoMp4 &&
                        <div className="w-full lg:w-2/5 overflow-hidden rounded-2xl">
                            <video ref={videoRef} src={videoMp4.mediaItemUrl} autoPlay muted loop className="h-full w-full object-cover scale-180 origin-top" />
                        </div>
                    }
                </Container>
            </div>
        </div>
    )
}

export default OneColumnCopyAlternate;