"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import Container from "../../Container";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

const Cards = ({ data }) => {

    const cardsRef = useRef([]);
    const copyRef = useRef([]);
    const titleRef = useRef([]);

    const { title, cards, copy, carousel } = data;

    useEffect(() => {
        gsap.to(titleRef.current, {
            x: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: titleRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        });
        gsap.to(copyRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: copyRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        });
        gsap.to(cardsRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 90%',
                end: 'top center',
                scrub: 1.5
            },
        });
        return () => {
            // Clean up ScrollTriggers on unmount
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (
        <div className="bg-linear-to-t from-black/10 to-black/0">
            <Container className="py-20 2xl:py-40">
                {title && 
                    <div className="flex flex-col">
                        <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h2>
                    </div>
                }
                {copy && 
                    <div className="flex flex-col items-center md:gap-10 text-center">
                        <div ref={copyRef} className="w-full md:w-1/3 lg:-mb-10 opacity-0 translate-y-5" dangerouslySetInnerHTML={{ __html: copy }} />
                    </div>
                }
                <div className="relative w-full mt-25">
                    {carousel ? (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 2500, disableOnInteraction: false }}
                            breakpoints={{
                                1024: { slidesPerView: 4, spaceBetween: 40 },
                                768: { slidesPerView: 2, spaceBetween: 24 },
                                0: { slidesPerView: 1, spaceBetween: 16 },
                            }}
                            className="cards-swiper my-10"
                        >
                            {cards.map((card, index) => {
                                const { heading, description, image } = card;
                                return (
                                    <SwiperSlide key={index}>
                                        <div ref={el => cardsRef.current[index] = el} className="opacity-0 translate-y-20 flex flex-col">
                                            <div className="relative overflow-hidden rounded-lg min-h-[400px]">
                                                <Image src={image.mediaItemUrl} alt={image.altText} fill className="object-cover absolute inset-0 transition-transform" />
                                            </div>
                                            {heading && <h4 className="text-lg font-medium mt-4" dangerouslySetInnerHTML={{ __html: heading }} />}
                                            {description && <div className="text-sm" dangerouslySetInnerHTML={{ __html: description }} />}
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                            <style jsx global>{`
                            .swiper {
                                overflow: visible!important;
                            }
                              .cards-swiper .swiper-pagination {
                                position: absolute;
                                bottom: -40px;
                                left: 0;
                                width: 100%;
                                display: flex;
                                justify-content: center;
                                z-index: 50;
                              }
                              .cards-swiper .swiper-pagination-bullet {
                                background: #00A0CC;
                                opacity: 1;
                                width: 16px;
                                height: 16px;
                                margin: 0 5px !important;
                                border-radius: 50%;
                                transition: background 0.2s;
                              }
                              .cards-swiper .swiper-pagination-bullet-active {
                                background: #00004D;
                              }
                            `}</style>
                        </Swiper>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
                            {cards.map((card, index) => {
                                const { heading, description, image } = card;
                                return (
                                    <div key={index} ref={el => cardsRef.current[index] = el} className="opacity-0 translate-y-20 h-full flex flex-col min-h-[450px]">
                                        <div className="relative overflow-hidden rounded-lg flex flex-col text-center items-center p-10 h-full justify-end">
                                            <Image src={image.mediaItemUrl} alt={image.altText} fill className="object-cover absolute inset-0 transition-transform" />
                                            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                                            {heading && <h4 className="text-white text-3xl font-medium drop-shadow-lg z-10" dangerouslySetInnerHTML={{ __html: heading }} />}
                                            {description && <div className="text-white text-base z-10 mt-3" dangerouslySetInnerHTML={{ __html: description }} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Cards;