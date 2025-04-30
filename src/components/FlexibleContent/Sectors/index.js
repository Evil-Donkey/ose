"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Headings from "@/components/Headings";
import Column from "@/components/Column";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const Sectors = ({ data }) => {

    const sectorsRef = useRef([]);
    const titleRef = useRef([]);

    const { title, headings, copy, sectors } = data;

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
            <div className="container mx-auto px-4 md:px-10 py-20 lg:py-40">
                <div className="flex flex-col">
                    {title && <h3 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h3>}
                </div>
                <div className="flex flex-col md:flex-row items-end gap-10">
                    <div className="w-full md:w-2/3">
                        <Headings headings={headings} />
                    </div>
                    <div className="w-full md:w-1/3">
                        <Column copy={copy} fullWidth={true} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20">
                    {sectors.map((sector, index) => {
                        const { title, url, image, video, copy } = sector;
                        const link = url?.link ? url.link : "#";
                        return (
                            <div key={index} ref={el => sectorsRef.current[index] = el} className="opacity-0 translate-y-20">
                                <Link href={link} className="relative aspect-square overflow-hidden rounded-lg flex text-center items-end justify-center p-10 group">
                                    <Image src={image.mediaItemUrl} alt={image.altText} fill className="object-cover absolute inset-0 transition-transform duration-300 group-hover:scale-110" />
                                    {video && <video src={video.mediaItemUrl} autoPlay muted loop className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                                    <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                                    <h4 className="text-white text-4xl md:text-5xl font-medium drop-shadow-lg z-10">{title}</h4>
                                </Link>

                                <div className="flex flex-col text-center items-center gap-5 mt-8">
                                    <div className="text-base" dangerouslySetInnerHTML={{ __html: copy }} />
                                    <Link href={link} className="bg-lightblue text-white font-normal px-6 py-2 rounded-full shadow hover:bg-darkblue transition-colors cursor-pointer w-max uppercase">
                                        Discover {title}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Sectors;