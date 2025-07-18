"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import formatSectionLabel from '@/lib/formatSectionLabel';
import Button from "@/components/Button";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const CTA = ({ data, storiesData }) => {
    const titleRef = useRef([]);
    const copyRef = useRef(null);
    const ctaRef = useRef([]);

    const { title, copy, cta, sectionLabel } = data;

    // GSAP animations
    useEffect(() => {
        // If storiesData is provided, only run animations when it's available
        // If storiesData is not provided (used outside stories page), run immediately
        // if (storiesData !== undefined && !storiesData) return;

        // Kill existing ScrollTriggers for this component
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.vars.trigger && (
                trigger.vars.trigger === titleRef.current ||
                trigger.vars.trigger === copyRef.current ||
                (Array.isArray(ctaRef.current) && ctaRef.current.includes(trigger.vars.trigger))
            )) {
                trigger.kill();
            }
        });

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

        // Refresh ScrollTrigger to recalculate positions
        ScrollTrigger.refresh();
    }, [storiesData]); // Re-run when stories data changes

    return (
        <Container id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="py-20">
            <div className="flex flex-col items-center text-center">
                {title && <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h2>}
                {copy && <div ref={copyRef} className="w-full md:w-2/5 text-center text-blue-02 opacity-0 translate-y-20 mb-8">
                    <div className="text-base md:text-xl" dangerouslySetInnerHTML={{ __html: copy }} />
                </div>}
            </div>

            {/* CTA Grid */}
            {cta &&
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5 2xl:mt-12">
                    {cta.map((cta, index) => {
                        const { smallTitle, largeTitle, copy, ctaLabel, ctaUrl, backgroundImage } = cta;
                        return (
                            <div key={index} ref={el => ctaRef.current[index] = el} className={`relative overflow-hidden rounded-3xl group p-8 2xl:p-12 opacity-0 translate-y-20 ${!ctaLabel ? 'min-h-[600px] md:min-h-auto' : ''}`}>
                                {backgroundImage && <Image src={backgroundImage.mediaItemUrl} alt={backgroundImage.altText} fill className={`absolute inset-0 object-cover ${ctaLabel ? 'group-hover:scale-110' : ''} transition-all duration-300`} />}
                                {!ctaLabel && <div className="absolute inset-0 w-full h-2/3 bottom-0 top-auto bg-gradient-to-t from-black/90 to-black/0" />}
                                <div className={`relative z-10 flex flex-col ${!ctaLabel ? 'justify-end' : 'justify-between'} h-full`}>
                                    <div className={`flex flex-col ${!ctaLabel ? 'md:aspect-7/6 justify-end' : ''}`}>
                                        <div>
                                            {smallTitle && <p className="text-xs md:text-sm text-white mb-4">{smallTitle}</p>}
                                            {largeTitle && <h3 className="text-3xl md:text-4xl/11 2xl:text-6xl text-white mb-6">{largeTitle}</h3>}
                                        </div>
                                        {copy && <div className="text-white mb-8 text-base md:text-xl flex flex-col gap-4" dangerouslySetInnerHTML={{ __html: copy }} />}
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
