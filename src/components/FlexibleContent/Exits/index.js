"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import Container from "../../Container";
import formatSectionLabel from '@/lib/formatSectionLabel';

gsap.registerPlugin(ScrollTrigger);

const Exits = ({ data }) => {
    const titleRef = useRef([]);
    const copyRef = useRef(null);
    const portfolioRef = useRef([]);

    const { title, copy, exits, sectionLabel } = data;

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
        .to(portfolioRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: portfolioRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="bg-linear-to-t from-black/10 to-black/0">
            <Container className="py-20">
                <div className="flex flex-col items-center text-center">
                    {title && <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h2>}
                    {copy && <div ref={copyRef} className="w-full md:w-3/5 text-center text-blue-02 opacity-0 translate-y-20">
                        <div className="text-base md:text-xl" dangerouslySetInnerHTML={{ __html: copy }} />
                    </div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10 2xl:mt-16">
                    {exits.map((item, index) => {
                        const { title, description, url, logo } = item;

                        return index === 0 ? (
                            <div 
                                key={index.toString()} 
                                ref={el => {portfolioRef.current[index] = el}}
                                className="relative col-span-full opacity-0 translate-y-20"
                            >
                                <div className="h-full w-full flex flex-col md:flex-row gap-4 md:gap-8 justify-between overflow-hidden rounded-xl bg-cover bg-center bg-[url('/mobile-gradient.jpg')] lg:bg-[url('/desktop-gradient.jpg')]">
                                    <div className="p-4 md:p-8 w-full md:w-2/5 flex flex-col md:flex-row justify-between text-white">
                                        <div className="flex flex-col justify-between h-full gap-8">
                                            {logo && <Image src={logo.mediaItemUrl} alt={logo.altText} width={logo.mediaDetails.width} height={logo.mediaDetails.height} className="object-cover transition-transform" />}
                                            {title &&
                                                <h3 className="text-3xl md:text-4xl 2xl:text-5xl">
                                                    {title}
                                                </h3>
                                            }
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-8 w-full md:w-2/5 flex flex-col text-white">
                                        {description && <div className="text-base md:text-lg" dangerouslySetInnerHTML={{ __html: description }} />}
                                        {url && <Link href={url} className="text-lightblue hover:text-white uppercase text-sm mt-2 font-bold transition-colors duration-300">Read more</Link>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div 
                                key={index.toString()} 
                                ref={el => {portfolioRef.current[index] = el}}
                                className={`relative col-span-1 opacity-0 translate-y-20`}
                            >
                                <div className="h-full w-full flex flex-col gap-8 overflow-hidden rounded-xl bg-cover bg-center bg-[url('/mobile-gradient.jpg')] lg:bg-[url('/desktop-gradient.jpg')]">
                                    <div className="flex flex-col justify-between h-full gap-8 text-white p-4 md:p-8">
                                        {logo && <Image src={logo.mediaItemUrl} alt={logo.altText} width={logo.mediaDetails.width} height={logo.mediaDetails.height} className="object-cover transition-transform" />}
                                        {title &&
                                            <h3 className="text-3xl md:text-4xl 2xl:text-5xl">
                                                {title}
                                            </h3>
                                        }
                                        {story && <Link href={story.slug} className="text-lightblue hover:text-white uppercase text-sm mt-2 font-bold transition-colors duration-300">Read more</Link>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </div>
    )
};

export default Exits;
