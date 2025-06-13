"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Container from "../../Container";
import Button from "@/components/Button";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

gsap.registerPlugin(ScrollTrigger);

const FullPanelCarousel = ({ data }) => {
    const { heading, slides } = data;
    const swiperRef = useRef(null);
    const headingRef = useRef(null);
    const titleRef = useRef([]);
    const copyRef = useRef([]);
    const backgroundImageRef = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const titleTl = gsap.timeline();

        titleTl.to(headingRef.current, {
            y: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: headingRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        })
        
        // Create animations for each slide
        slides.forEach((_, index) => {
            const slide = swiperRef.current?.swiper?.slides[index];
            if (!slide) return;

            titleTl.to(backgroundImageRef.current[index], {
                scale: 1,
                duration: 2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: backgroundImageRef.current[index] || slide,
                    start: 'top 80%',
                    end: 'top top',
                    scrub: 1,
                    invalidateOnRefresh: true
                },
            })
            .to(titleRef.current[index], {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: titleRef.current[index],
                    start: 'top 90%',
                    scrub: 1.5,
                    invalidateOnRefresh: true
                },
            }, "<")
            .to(copyRef.current[index], {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: copyRef.current[index],
                    start: 'top 90%',
                    end: 'top 75%',
                    scrub: 1.5,
                    invalidateOnRefresh: true
                },
            }, "<");
        });

        // return () => {
        //     ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        // };
    }, [slides]);

    return (
        <div className="relative min-h-[100vh] h-full w-full overflow-hidden">
            {heading && <h2 ref={headingRef} className="text-white uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium w-full lg:w-110 absolute top-20 left-1/2 -translate-x-1/2 translate-y-full opacity-0 z-50">{heading}</h2>}
            <div className="absolute top-45 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex space-x-4">
                    {slides.map((slide, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                swiperRef.current?.swiper?.slideTo(index);
                                setActiveIndex(index);
                            }}
                            className={`text-2xl md:text-5xl hover:text-lightblue focus:outline-none cursor-pointer transition-colors ${activeIndex === index ? 'text-lightblue' : 'text-white'}`}
                        >
                            {slide.title}
                        </button>
                    ))}
                </div>
            </div>
            <Swiper
                ref={swiperRef}
                modules={[Navigation]}
                navigation
                className="h-full"
                onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
            >
                {slides.map((slide, index) => {
                    const { title, copy, ctaLabel, ctaLink, backgroundImage, backgroundImageMobile } = slide;
                    return (
                        <SwiperSlide key={index}>
                            <div className="relative min-h-[100vh] h-full w-full overflow-hidden">
                                <div 
                                    ref={el => backgroundImageRef.current[index] = el}
                                    className={`background-image absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top ${backgroundImageMobile ? 'hidden lg:block' : ''}`} 
                                    style={{ backgroundImage: `url(${backgroundImage.mediaItemUrl})` }} 
                                />
                                {backgroundImageMobile && (
                                    <div className="background-image absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top lg:hidden" style={{ backgroundImage: `url(${backgroundImageMobile.mediaItemUrl})` }} />
                                )}
                                <div className="absolute top-0 left-0 w-full h-full bg-black/50 lg:bg-black/40" />
                                <div className="min-h-[100vh] h-full flex flex-col justify-end">
                                    <Container className="py-15 md:py-25 2xl:py-45 relative z-10 text-white flex flex-col h-full">
                                        <div className="flex flex-col w-full gap-5">
                                            {title && (
                                                <h3 ref={el => titleRef.current[index] = el} className="slide-title text-5xl md:text-[6rem]/20 lg:text-[8rem]/25 2xl:text-[10rem]/30 tracking-tight w-full opacity-0 -translate-y-full">
                                                    {title}
                                                </h3>
                                            )}
                                            {copy && (
                                                <div ref={el => copyRef.current[index] = el} className="slide-copy w-full lg:w-2/5 text-xl md:text-3xl 2xl:text-[2.5rem]/12 opacity-0 translate-y-5">
                                                    <div 
                                                        className="flex flex-col gap-8" 
                                                        dangerouslySetInnerHTML={{ __html: copy }} 
                                                    />
                                                </div>
                                            )}
                                            {ctaLabel && 
                                            <div className="flex flex-col gap-5 mt-4">
                                                <Button href={ctaLink ? ctaLink.uri : "#"} className="bg-lightblue text-white font-normal px-6 py-2 rounded-full shadow hover:bg-darkblue transition-colors cursor-pointer w-max uppercase">
                                                    {ctaLabel}
                                                </Button>
                                            </div>
                                            }
                                        </div>
                                    </Container>
                                </div>
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    );
};

export default FullPanelCarousel;