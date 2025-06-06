"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Button from "@/components/Button";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const Stories = ({ data }) => {
    const titleRef = useRef([]);
    const ctaRef = useRef([]);

    const { stories } = data;

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
                <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">Stories</h2>
            </div>

            {/* CTA Grid */}
            {stories &&
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {stories.map((story, index) => {
                        const { title, content, featuredImage, link } = story;
                        return (
                            <div key={index} ref={el => ctaRef.current[index] = el} className="relative overflow-hidden rounded-3xl group p-8 2xl:p-12 opacity-0 translate-y-20 min-h-[500px]">
                                {featuredImage && 
                                    <>
                                        <Image src={featuredImage.node.mediaItemUrl} alt={featuredImage.node.altText} fill className="absolute inset-0 object-cover group-hover:scale-110 transition-all duration-300" />
                                        <div className="absolute top-0 left-0 w-full h-full bg-black/50" />
                                    </>
                                }
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div>
                                        {title && <h3 className="text-3xl md:text-5xl/13 2xl:text-6xl text-white mb-6">{title}</h3>}
                                        {content && <div className="text-white mb-8 text-base md:text-xl" dangerouslySetInnerHTML={{ __html: content.split(' ').slice(0, 20).join(' ') + ' ...' }} />}
                                    </div>
                                    <Button href={link} variant="light">
                                        Read more
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </Container>
    )
};

export default Stories;
