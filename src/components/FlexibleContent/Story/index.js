"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";
import Link from "next/link";
import Image from "next/image";
import Button from "../../Button";
import formatSectionLabel from '@/lib/formatSectionLabel';

gsap.registerPlugin(ScrollTrigger);

const Story = ({ data }) => {

    const { content, title, story, featuredImage, uri, sectionLabel } = data.story;
    const backgroundImage = featuredImage.node.mediaItemUrl || null;
    const { author, quote, quoteImage, secondCopyBlock } = story;

    const titleRef = useRef(null);
    const mainTitleRef = useRef(null);
    const copyRef = useRef([]);
    const imageRef = useRef(null);

    useEffect(() => {
        const titleTl = gsap.timeline();
        titleTl.to(imageRef.current, {
            scale: 1,
            // duration: 2,
            ease: 'power4.out', 
            scrollTrigger: {
                trigger: imageRef.current,
                start: 'top 80%',
                end: 'top top',
                scrub: 1,
                invalidateOnRefresh: true,
                toggleActions: "play none none none",
            },
        })
        .to(titleRef.current, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: titleRef.current,
                start: 'top 90%',
                scrub: false,
                invalidateOnRefresh: true,
                toggleActions: "play none none none",
            },
        })
        .to(mainTitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: mainTitleRef.current,
                start: 'top 90%',
                // end: 'top 50%',
                scrub: false,
                invalidateOnRefresh: true,
                toggleActions: "play none none none",
            },
        }, "<")
        .to(copyRef.current, {
            opacity: 1,
            y: 0,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: copyRef.current,
                start: 'top 90%',
                // end: 'top 50%',
                scrub: false,
                invalidateOnRefresh: true,
                toggleActions: "play none none none",
            },
        }, "<");

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}>
            <div className="relative w-full lg:min-h-[100vh] h-full">
                {backgroundImage && 
                    <>
                        <div ref={imageRef} className="absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top" style={{ backgroundImage: `url(${backgroundImage})` }} />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/40 to-black/0" />
                    </>
                }
                {title &&
                    <div className="lg:min-h-[100vh] h-full">
                        <Container className="py-10 md:py-15 2xl:py-25 relative z-10 text-white flex flex-col h-full lg:min-h-[100vh] justify-between gap-10 lg:gap-0">
                            <div className="flex self-center">
                                <h3 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full transition-all duration-1000">STORIES</h3>
                            </div>
                            <div className="flex flex-col justify-end w-full">
                                <h2 ref={mainTitleRef} className="text-[2.5rem]/12 md:text-[3.3rem]/16 2xl:text-[5rem]/22 3xl:text-[7rem]/30 tracking-tight w-4/5 lg:w-1/2 opacity-0 translate-y-20 transition-all duration-1000">{title}</h2>
                            </div>
                        </Container>
                    </div>
                }
            </div>

            <div className="bg-linear-to-t from-black/10 to-black/0">
                <Container className="py-10 md:py-25 2xl:py-45">
                    <div className="flex flex-col lg:flex-row gap-10">
                        {content &&
                            <div ref={el => copyRef.current[1] = el} className="w-full lg:w-1/2 xl:pe-20 flex flex-col gap-10 opacity-0 translate-y-20 transition-all duration-1000">
                                <div className="text-base 2xl:text-lg flex flex-col gap-5" dangerouslySetInnerHTML={{ __html: content }} />
                                {secondCopyBlock &&
                                    <div className="text-base 2xl:text-lg hidden lg:flex flex-col gap-5" dangerouslySetInnerHTML={{ __html: secondCopyBlock }} />
                                }
                                <Link href={uri} className="hidden lg:flex font-medium text-base 2xl:text-lg text-lightblue uppercase hover:underline">Read More</Link>
                            </div>
                        }
                        {quote &&
                            <div ref={el => copyRef.current[0] = el} className="w-[115%] lg:w-1/2 lg:-mt-70 z-10 relative opacity-0 translate-y-20 transition-all duration-1000">
                                <div className="flex flex-col rounded-4xl bg-darkblue/98 pb-10 lg:pb-20">
                                    <div className="flex flex-col text-white p-5 pe-16 lg:p-10 font-medium">
                                        {quote && <div className="bg-[url('/quote.svg')] bg-contain bg-center bg-no-repeat w-10 h-10 2xl:w-15 2xl:h-15 mb-3" />}
                                        {quote && <div className="text-2xl md:text-[2rem]/10" dangerouslySetInnerHTML={{ __html: quote }} />}
                                        {author && <div className="text-xs md:text-sm font-medium drop-shadow-lg mt-3" dangerouslySetInnerHTML={{ __html: author }} />}
                                    </div>
                                    {quoteImage &&
                                        <Image src={quoteImage.mediaItemUrl} alt={quoteImage.altText} width={quoteImage.mediaDetails.width} height={quoteImage.mediaDetails.height} className="object-cover aspect-3/2" />
                                    }
                                </div>
                            </div>
                        }
                        {secondCopyBlock && (
                            <>
                                <div className="text-base 2xl:text-lg lg:hidden flex-col gap-5" dangerouslySetInnerHTML={{ __html: secondCopyBlock }} />
                                <Link href={uri} className="lg:hidden font-medium text-base 2xl:text-lg text-lightblue uppercase hover:underline">Read More</Link>
                            </>
                        )}
                    </div>

                    <div ref={el => copyRef.current[2] = el} className="flex justify-center mt-16 opacity-0 translate-y-20 transition-all duration-1000">
                        <Button href="/stories">Read more stories</Button>
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default Story;