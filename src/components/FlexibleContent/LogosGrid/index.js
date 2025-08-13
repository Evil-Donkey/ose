"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import formatSectionLabel from '@/lib/formatSectionLabel';
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const LogosGrid = ({ data }) => {

    const titleRef = useRef([]);
    const galleryRef = useRef([]);

    const { title, gallery, sectionLabel } = data;

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
        gsap.to(galleryRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: galleryRef.current,
                start: 'top 90%',
                end: 'top center',
                scrub: 1.5
            },
        });
    }, []);


    return (
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="bg-linear-to-t from-black/10 to-black/0">
            <Container className="py-30 2xl:py-40">
                {title && 
                    <div className="flex flex-col">
                        <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h2>
                    </div>
                }
                <div className="relative w-full 2xl:mt-25">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
                        {gallery.map((image, index) => {
                            return (
                                <div key={index} ref={el => galleryRef.current[index] = el} className="opacity-0 translate-y-20 h-full flex flex-col">
                                    <div className="relative overflow-hidden rounded-lg flex flex-col text-center items-center p-6 2xl:p-10 h-full justify-end">
                                        {image && (
                                            <Image src={image.mediaItemUrl} alt={image.altText} width={1000} height={1000} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default LogosGrid;