'use client'

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { SplitText } from "gsap/SplitText";
import Button from "@/components/Button";

gsap.registerPlugin(ScrollTrigger);

const HeroVideo = ({ data }) => {
    
    const { fullMovie, introMovie, headings } = data;

    const videoRef = useRef(null);
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
        <div ref={heroRef} className="pt-60 pb-30 bg-cover bg-no-repeat bg-[url('/footer-bg.jpg')]">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="mx-auto relative">
                    <video ref={videoRef} className="w-full rounded-2xl shadow-xl aspect-video opacity-0 scale-125" autoPlay playsInline muted loop>
                        <source src={introMovie.mediaItemUrl} type="video/mp4" />
                    </video>

                    <div className="absolute top-0 md:right-[13%] p-6 flex flex-col justify-center h-full text-white">
                        <h1 className="text-4xl md:text-8xl/27">
                            {headings.map((heading, index) => (
                                <span key={index} className="block overflow-hidden" ref={el => textWrapperRef.current[index] = el}>
                                    <span className="block opacity-0 translate-y-full" ref={el => textRef.current[index] = el}>{heading.heading}</span>
                                </span>
                            ))}
                        </h1>
                        <div className="mt-6 hover:-translate-y-1! transition-all duration-500 self-start">
                            <Button ref={buttonRef}>Watch</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroVideo;