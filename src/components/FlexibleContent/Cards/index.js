"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Headings from "@/components/Headings";
import Column from "@/components/Column";
import Image from "next/image";
import Link from "next/link";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const Cards = ({ data }) => {

    const cardsRef = useRef([]);
    const copyRef = useRef([]);
    const titleRef = useRef([]);

    const { title, cards, copy } = data;

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

                                {/* <div className="flex flex-col text-center items-center gap-5 mt-6 2xl:mt-8 px-3 md:px-8 xl:px-12 flex-grow-1 justify-between">
                                    <div className="text-base md:text-xl" dangerouslySetInnerHTML={{ __html: copy }} />
                                </div> */}
                            </div>
                        );
                    })}
                </div>
            </Container>
        </div>
    )
}

export default Cards;