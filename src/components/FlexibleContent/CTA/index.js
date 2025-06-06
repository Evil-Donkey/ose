"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const CTA = ({ data }) => {
    const titleRef = useRef([]);
    const copyRef = useRef(null);
    const ctaRef = useRef([]);

    const { title, copy, cta } = data;

    // GSAP animations
    useEffect(() => {
        const tl = gsap.timeline();
        tl.to(titleRef.current, {
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
        })
        .to(copyRef.current, {
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
        })
        .to(ctaRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: ctaRef.current,
                start: 'top 90%',
                end: 'top 75%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <Container className="py-20">
            <div className="flex flex-col items-center text-center">
                {title && <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h2>}
                {copy && <div ref={copyRef} className="w-full md:w-2/5 text-center text-blue-02 opacity-0 translate-y-20">
                    <div className="text-base md:text-xl" dangerouslySetInnerHTML={{ __html: copy }} />
                </div>}
            </div>

            {/* CTA Grid */}
            {cta &&
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {cta.map((cta, index) => {
                        const { smallTitle, largeTitle, copy, ctaLabel, ctaUrl, backgroundImage } = cta;
                        return (
                            <div key={index} ref={el => ctaRef.current[index] = el} className="relative overflow-hidden rounded-3xl group p-8 2xl:p-12 opacity-0 translate-y-20">
                                {backgroundImage && <Image src={backgroundImage.mediaItemUrl} alt={backgroundImage.altText} fill className="absolute inset-0 object-cover group-hover:scale-110 transition-all duration-300" />}
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div>
                                        {smallTitle && <p className="text-xs md:text-sm text-white mb-4">{smallTitle}</p>}
                                        {largeTitle && <h3 className="text-3xl md:text-5xl/13 2xl:text-6xl text-white mb-6">{largeTitle}</h3>}
                                        {copy && <div className="text-white mb-8 text-base md:text-xl" dangerouslySetInnerHTML={{ __html: copy }} />}
                                    </div>
                                    {ctaLabel && <Button href={ctaUrl} variant="light">
                                        {ctaLabel}
                                    </Button>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </Container>
    )
};

export default CTA;
