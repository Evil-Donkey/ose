"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const FullScreenList = ({ data }) => {

    const { heading, copy, backgroundImage, list, listPosition, listCopy } = data;
    const titleRef = useRef(null);
    const copyRef = useRef([]);
    const backgroundImageRef = useRef(null);

    useEffect(() => {
        const titleTl = gsap.timeline();
        titleTl.to(backgroundImageRef.current, {
            scale: 1,
            duration: 2,
            ease: 'power4.out', 
            scrollTrigger: {
                trigger: backgroundImageRef.current,
                start: 'top bottom',
                end: 'top top',
                scrub: 1,
                invalidateOnRefresh: true
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
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        }, "<")
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
        <div className="relative min-h-[100vh] h-full w-full overflow-hidden">
            <div ref={backgroundImageRef} className="absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top" style={{ backgroundImage: `url(${backgroundImage.mediaItemUrl})` }} />
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 lg:bg-black/40" />
            <Container className="py-30 md:py-25 2xl:py-45 relative z-10 flex flex-col h-full">
                <div className="flex flex-col items-center">
                    {heading && <h2 ref={titleRef} className="w-full text-center uppercase tracking-widest text-white text:lg md:text-xl mb-8 font-medium opacity-0 translate-x-full">{heading}</h2>}
                    {copy && <div ref={el => copyRef.current[0] = el} className="w-full md:w-3/5 text-center text-white opacity-0 translate-y-20">
                        <div className="text-base md:text-xl flex flex-col gap-4" dangerouslySetInnerHTML={{ __html: copy }} />
                    </div>}
                </div>
                {list &&
                    <div ref={el => copyRef.current[1] = el}  className={`flex mt-15 opacity-0 translate-y-20 ${listPosition}`}>
                        <div className="rounded-lg overflow-hidden bg-white p-8 w-full lg:w-2/5">
                            {listCopy && <div className="text-base md:text-xl flex flex-col gap-4 mb-5" dangerouslySetInnerHTML={{ __html: listCopy }} />}
                            {list.length > 0 &&
                                <ul className="list-disc list-inside">
                                    {list.map((item, index) => (
                                        <li 
                                        key={index} 
                                        className="flex flex-col mb-5 ps-4 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-lightblue">
                                            <h3 className="text-2xl font-medium">{item.title}</h3>
                                            <div className="text-base md:text-xl" dangerouslySetInnerHTML={{ __html: item.description }} />
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                    </div>
                }
            </Container>
        </div>
    )
}

export default FullScreenList;