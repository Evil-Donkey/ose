'use client'

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { SplitText } from "gsap/SplitText";
import Button from "@/components/Button";
import Container from "../../Container";
import { getOptimizedVideoProps, getVideoSources } from "@/lib/videoUtils";
import VimeoEmbed from "./VimeoEmbed";

gsap.registerPlugin(ScrollTrigger);

const HeroVideo = ({ data, onVideoPopupOpen, title }) => {
    const { fullMovie, introMovie, mobileMovie, fullMovieVimeo, introMovieMobileVimeo, introMovieVimeo, headings, desktopImage, mobileImage, copyOnTheLeft, ctaLabel } = data;

    const videoRef = useRef([]);
    const heroRef = useRef(null);
    const textRef = useRef([]);
    const textWrapperRef = useRef([]);
    const buttonRef = useRef(null);

    useEffect(() => {
        // const splitText = new SplitText(textRef.current, { type: 'lines', linesClass: 'overflow-hidden' });
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top bottom',
                end: 'center center',
                scrub: false,
            },
        });

        tl.to(videoRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'power4.out',
        });

        tl.to(textRef.current, {
            y: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
        }, "-=1")
        .to(buttonRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
        }, "-=1.5");

        // slightly smoothly translate y of textWrapperRef on scroll with scrollTrigger
        gsap.to(textWrapperRef.current, {
            y: -10,
            duration: 1,
            stagger: {
                amount: 0.5,
                from: 'start',
                ease: 'elastic.out(1,0.3)'
            },
            scrollTrigger: {
                trigger: textWrapperRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4,
            },
        });
    }, []);

    return (
        <div ref={heroRef} className={`pb-20 md:pb-10 h-[100vh] ${!title ? "bg-cover bg-center bg-[url('/gradient.png')] pt-40 2xl:pt-50" : "pt-45 2xl:pt-60"} flex`}>
            <Container className="flex-grow-1 h-full">
                <div className={`mx-auto relative h-full`}>
                    
                    {introMovieVimeo ? (
                        <div 
                            ref={el => videoRef.current[0] = el}
                            className={`w-full h-full rounded-2xl shadow-xl opacity-0 scale-125 relative overflow-hidden ${mobileMovie || introMovieMobileVimeo ? "hidden lg:block" : ""}`}
                        >
                            {desktopImage && <div className={`w-full h-full bg-cover bg-center absolute inset-0 ${mobileImage ? "hidden lg:block" : ""}`} style={{ backgroundImage: `url(${desktopImage.mediaItemUrl})` }} />}
                            {mobileImage && <div className="w-full h-full bg-cover bg-center absolute inset-0 lg:hidden" style={{ backgroundImage: `url(${mobileImage.mediaItemUrl})` }} />}

                            <VimeoEmbed
                                vimeoUrl={introMovieVimeo}
                            />
                        </div>
                    ) : introMovie && (  
                        <div className={`w-full h-full rounded-2xl shadow-xl opacity-0 scale-125 relative ${mobileMovie ? "hidden lg:block" : ""}`} ref={el => videoRef.current[0] = el}>
                            {desktopImage && <div className={`w-full h-full bg-cover bg-center absolute inset-0 ${mobileImage ? "hidden lg:block" : ""}`} style={{ backgroundImage: `url(${desktopImage.mediaItemUrl})` }} />}
                            {mobileImage && <div className="w-full h-full bg-cover bg-center absolute inset-0 lg:hidden" style={{ backgroundImage: `url(${mobileImage.mediaItemUrl})` }} />}
                            <video 
                                {...getOptimizedVideoProps(introMovie, {
                                    context: 'hero',
                                    isHero: true,
                                    isAboveFold: true,
                                    isAutoplay: true,
                                    className: `w-full h-full object-cover`,
                                    controls: false,
                                    muted: true,
                                    loop: true,
                                    playsInline: true
                                })}
                            >
                                {getVideoSources(introMovie).map((source, index) => (
                                    <source key={index} src={source.src} type={source.type} />
                                ))}
                            </video>
                        </div>
                    )}
                    {introMovieMobileVimeo ? (
                        <div 
                            ref={el => videoRef.current[1] = el}
                            className={`w-full h-full rounded-2xl shadow-xl opacity-0 scale-125 overflow-hidden lg:hidden relative ${mobileMovie ? "hidden lg:block" : ""}`}
                        >
                            {desktopImage && <div className={`w-full h-full bg-cover bg-center absolute inset-0 ${mobileImage ? "hidden lg:block" : ""}`} style={{ backgroundImage: `url(${desktopImage.mediaItemUrl})` }} />}
                            {mobileImage && <div className="w-full h-full bg-cover bg-center absolute inset-0 lg:hidden" style={{ backgroundImage: `url(${mobileImage.mediaItemUrl})` }} />}
                            <VimeoEmbed
                                vimeoUrl={introMovieMobileVimeo}
                            />
                        </div>
                    ) : mobileMovie && (
                        <div className={`w-full h-full rounded-2xl shadow-xl opacity-0 scale-125 overflow-hidden lg:hidden relative ${mobileMovie ? "hidden lg:block" : ""}`} ref={el => videoRef.current[1] = el}>
                            {desktopImage && <div className={`w-full h-full bg-cover bg-center absolute inset-0 ${mobileImage ? "hidden lg:block" : ""}`} style={{ backgroundImage: `url(${desktopImage.mediaItemUrl})` }} />}
                            {mobileImage && <div className="w-full h-full bg-cover bg-center absolute inset-0 lg:hidden" style={{ backgroundImage: `url(${mobileImage.mediaItemUrl})` }} />}
                            <video 
                                {...getOptimizedVideoProps(mobileMovie, {
                                    context: 'hero',
                                    isHero: true,
                                    isAboveFold: true,
                                    isAutoplay: true,
                                    className: "w-full h-full object-cover",
                                    controls: false,
                                    muted: true,
                                    loop: true,
                                    playsInline: true
                                })}
                            >
                                {getVideoSources(mobileMovie).map((source, index) => (
                                    <source key={index} src={source.src} type={source.type} />
                                ))}
                            </video>
                        </div>
                    )}

                    {desktopImage && !introMovieVimeo && !introMovie && (
                        <div ref={el => videoRef.current[2] = el} className={`w-full h-full rounded-2xl shadow-xl bg-cover bg-center opacity-0 scale-125 ${mobileImage ? "hidden lg:block" : ""}`} style={{ backgroundImage: `url(${desktopImage.mediaItemUrl})` }} />
                    )}
                    {mobileImage && !introMovieMobileVimeo && !mobileMovie && (
                        <div ref={el => videoRef.current[3] = el} className="w-full h-full rounded-2xl shadow-xl bg-cover bg-center opacity-0 scale-125 lg:hidden" style={{ backgroundImage: `url(${mobileImage.mediaItemUrl})` }} />
                    )}

                    <div className={`absolute top-0 left-0 ${!copyOnTheLeft ? "lg:left-auto lg:right-[13%]" : ""} p-6 flex flex-col justify-center h-full text-white z-50`}>
                        {headings && (
                            <h1 className="text-7xl/18 md:text-8xl/23 2xl:text-8xl/27">
                                {headings.map((heading, index) => (
                                    <span key={index} className="block overflow-hidden" ref={el => textWrapperRef.current[index] = el}>
                                        <span className="block opacity-0 translate-y-full" ref={el => textRef.current[index] = el}>{heading.heading}</span>
                                    </span>
                                ))}
                            </h1>
                        )}
                        {(fullMovieVimeo || fullMovie) && (
                            <div ref={buttonRef} className="mt-8 opacity-0 translate-y-5">
                                <Button onClick={() => onVideoPopupOpen(fullMovieVimeo || fullMovie)}>{ctaLabel ? ctaLabel : "Watch Full Video"}</Button>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default HeroVideo;