"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";
import Link from "next/link";
import Image from "next/image";
import Button from "../../Button";

gsap.registerPlugin(ScrollTrigger);

const Story = ({ data }) => {

    const { content, title, story, featuredImage, uri } = data.story;
    const backgroundImage = featuredImage.node.mediaItemUrl || null;
    const { author, quote, quoteImage } = story;

    const titleRef = useRef(null);
    const copyRef = useRef(null);

    useEffect(() => {
        const titleTl = gsap.timeline();
        titleTl.to(titleRef.current, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
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
                end: 'top 75%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        }, "<");

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            <div className="relative w-full lg:min-h-[100vh] h-full">
                {backgroundImage && 
                    <>
                        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
                        <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
                    </>
                }
                {title &&
                    <div className="lg:min-h-[100vh] h-full">
                        <Container className="py-10 md:py-25 2xl:py-45 relative z-10 text-white flex flex-col h-full lg:min-h-[100vh] justify-between">
                            <div className="flex self-center">
                                <h3 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">STORIES</h3>
                            </div>
                            <div className="flex flex-col justify-end w-full">
                                <h2 ref={copyRef} className="text-5xl md:text-[4rem]/20 lg:text-[6rem]/25 2xl:text-[7rem]/30 tracking-tight w-full lg:w-1/2 opacity-0 -translate-y-full">{title}</h2>
                            </div>
                        </Container>
                    </div>
                }
            </div>

            <div className="bg-linear-to-t from-black/10 to-black/0">
                <Container className="py-10 md:py-25 2xl:py-45">
                    <div className="flex flex-col lg:flex-row gap-10">
                        {content &&
                            <div className="w-full lg:w-1/2 xl:pe-20 flex flex-col gap-10">
                                <div className="text-base md:text-lg flex flex-col gap-5" dangerouslySetInnerHTML={{ __html: content }} />
                                <Link href={uri} className="font-medium text-lightblue uppercase hover:underline">Read More.</Link>
                            </div>
                        }
                        {quote &&
                            <div className="w-full lg:w-1/2 xl:ps-20 lg:-mt-70 z-10">
                                <div className="flex flex-col rounded-4xl bg-darkblue/98 pb-10 lg:pb-20">
                                    <div className="flex flex-col text-white p-5 lg:p-10 font-medium">
                                        <div className="text-9xl/1 mt-12 lg:mt-14">&quot;</div>
                                        {quote && <div className="text-2xl md:text-[2rem]/10" dangerouslySetInnerHTML={{ __html: quote }} />}
                                        {author && <div className="text-xs md:text-sm font-medium drop-shadow-lg mt-3" dangerouslySetInnerHTML={{ __html: author }} />}
                                    </div>
                                    {quoteImage &&
                                        <Image src={quoteImage.mediaItemUrl} alt={quoteImage.altText} width={quoteImage.mediaDetails.width} height={quoteImage.mediaDetails.height} className="object-cover aspect-3/2" />
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    <div className="flex justify-center mt-16">
                        <Button href="/stories">See all stories</Button>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default Story;