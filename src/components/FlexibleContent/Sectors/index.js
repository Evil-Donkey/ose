"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Headings from "@/components/Headings";
import Column from "@/components/Column";
import Image from "next/image";
import Link from "next/link";
import Container from "../../Container";
import formatSectionLabel from '@/lib/formatSectionLabel';
import Button from "../../Button";

gsap.registerPlugin(ScrollTrigger);

const Sectors = ({ data }) => {

    const sectorsRef = useRef([]);
    const titleRef = useRef([]);

    const { title, headings, copy, sectors, sectionLabel, bottomHeading, ctaLabel, ctaUrl } = data;

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
        gsap.to(sectorsRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: sectorsRef.current,
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
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="bg-linear-to-t from-black/10 to-black/0">
            <Container className="py-20 2xl:py-40">
                <div className="flex flex-col">
                    {title && <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl 2xl:mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h2>}
                </div>
                <div className="flex flex-col items-center md:gap-10 text-center">
                    {headings &&
                        <div className="w-full md:w-2/3">
                            <Headings headings={headings} />
                        </div>
                    }
                    {copy &&
                        <div className="w-full md:w-1/3 lg:-mb-10">
                            <Column copy={copy} fullWidth={true} />
                        </div>
                    }
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
                    {sectors.map((sector, index) => {
                        const { title, url, image, video, copy } = sector;
                        const link = url?.uri ? url.uri : "#";
                        return (
                            <div key={index} ref={el => sectorsRef.current[index] = el} className="opacity-0 translate-y-20 h-full flex flex-col">
                                {url ? (    
                                    <Link href={link} className="relative aspect-square overflow-hidden rounded-lg flex text-center items-end justify-center py-10 xl:px-18 group">
                                        <Image src={image.mediaItemUrl} alt={image.altText} fill className="object-cover absolute inset-0 transition-transform duration-300 group-hover:scale-110" />
                                        {video && <video src={video.mediaItemUrl} autoPlay muted loop className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                                        <div className="absolute inset-0 bg-gradient-to-t w-full h-3/5 bottom-0 top-auto from-black/60 to-black/0 pointer-events-none" />
                                        <h4 className="text-white text-4xl md:text-5xl/13 font-medium drop-shadow-lg z-10" dangerouslySetInnerHTML={{ __html: title }} />
                                    </Link>
                                ) : (
                                    <div className="relative aspect-square overflow-hidden rounded-lg flex items-end py-10 px-10 xl:ps-10 xl:pe-18">
                                        <Image src={image.mediaItemUrl} alt={image.altText} fill className="object-cover absolute inset-0" />
                                        {video && <video src={video.mediaItemUrl} autoPlay muted loop className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                                        <div className="absolute inset-0 bg-gradient-to-t w-full h-3/5 bottom-0 top-auto from-black/60 to-black/0 pointer-events-none" />
                                        <h4 className="text-white text-4xl md:text-5xl/13 font-medium drop-shadow-lg z-10" dangerouslySetInnerHTML={{ __html: title }} />
                                    </div>
                                )}

                                <div className={`flex flex-col ${url ? "text-center px-3 md:px-8 xl:px-12" : "px-10"} items-center gap-5 mt-6 2xl:mt-8 flex-grow-1 justify-between`}>
                                    <div className="text-base 2xl:text-xl" dangerouslySetInnerHTML={{ __html: copy }} />
                                    {url && (
                                        <Link href={link} className="bg-lightblue text-white font-normal px-6 py-2 rounded-full shadow hover:bg-darkblue transition-colors cursor-pointer w-max uppercase">
                                            Discover {title}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {bottomHeading && (
                    <div className="mt-20 mb-10 2xl:mb-15 flex justify-center">
                        <h2 className="text-center text-2xl md:text-5xl 2xl:text-6xl leading-tight font-medium text-darkblue" dangerouslySetInnerHTML={{ __html: bottomHeading }} />
                    </div>
                )}

                {(ctaLabel && ctaUrl) && (
                    <div className="mt-2 md:mt-6 mb-10 hover:-translate-y-1! transition-all duration-500 relative z-10 flex justify-center">
                        <Button href={ctaUrl}>{ctaLabel || "Find out more"}</Button>
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Sectors;