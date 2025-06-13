"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const News = ({ data }) => {

    const newsRef = useRef([]);
    const titleRef = useRef([]);

    const { news } = data;

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
        gsap.to(newsRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: newsRef.current,
                start: 'top 90%',
                end: 'top center',
                scrub: 1.5
            },
        });
    }, []);
    return (
        <div className="bg-cover bg-center bg-[url('/gradient.png')]">
            <Container className="py-20 2xl:py-40">
                <div className="flex flex-col">
                    <h2 ref={titleRef} className="text-white uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">News</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
                    {news.map((news, index) => {
                        const { title, featuredImage, date, uri } = news;
                        return (
                            <div key={index} ref={el => newsRef.current[index] = el} className="opacity-0 translate-y-20 h-full flex flex-col">
                                <Link href={uri} className="relative aspect-4/5 overflow-hidden rounded-4xl flex text-center items-end justify-center py-10 xl:px-18 group">
                                    <Image src={featuredImage.node.mediaItemUrl} alt={featuredImage.node.altText} fill className="object-cover absolute inset-0 transition-transform duration-300 group-hover:scale-110" />
                                </Link>
                                <Link href={uri}>
                                    {date && (
                                        <p className="text-white text-xs md:text-base font-bold drop-shadow-lg z-10 mt-5">
                                            {new Date(date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit'
                                            }).toUpperCase()}
                                        </p>
                                    )}
                                    {title && <h4 className="text-white text-base font-medium drop-shadow-lg z-10" dangerouslySetInnerHTML={{ __html: title }} />}
                                </Link>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center mt-16">
                    <Button href="/news">See all news</Button>
                </div>
            </Container>
        </div>
    )
}

export default News;