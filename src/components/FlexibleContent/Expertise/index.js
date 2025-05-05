"use client";

import Headings from "@/components/Headings";
import Column from "@/components/Column";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Expertise = ({ data }) => {
    const { title, columns, headings, expertise } = data;
    const colNumber = columns.length;
    const [activeIndex, setActiveIndex] = useState(0);

    const expertiseRef = useRef([]);
    const titleRef = useRef([]);
    const containerRef = useRef(null);
    const expertiseItemsRef = useRef([]);

    const activeItem = expertise[activeIndex];

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
        gsap.to(expertiseRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.01,
            scrollTrigger: {
                trigger: expertiseRef.current,
                start: 'top 90%',
                end: 'top center',
                scrub: 1.5,
                invalidateOnRefresh: true,
                toggleActions: "play none none reverse",
            },
        });
        return () => {
            // Clean up ScrollTriggers on unmount
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="text-white bg-cover bg-center bg-[url('/gradient.png')]">
            <div className="container mx-auto px-4 md:px-10 py-20 lg:py-40">
                <div className="flex flex-col">
                    {title && <h3 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium text-white opacity-0 translate-x-full">{title}</h3>}
                    {headings && <Headings headings={headings} theme="dark" />}
                    {columns && 
                        <div className="flex w-full space-x-14 mt-10 justify-end lg:pe-20">
                            {columns.map((column, index) => {
                                return (
                                    <Column key={index} copy={column.copy} colNumber={colNumber} theme="dark" />
                                )
                            })}
                        </div>
                    }

                    {expertise && (
                        <AnimatePresence mode="wait">
                            <div className="flex flex-col items-stretch rounded-3xl overflow-hidden mt-16 relative bg-cover bg-center bg-blue-02">
                                <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}>
                                    <div className="absolute inset-0 bg-cover bg-center bg-blue-02" style={{
                                        backgroundImage: activeItem.backgroundImage.mediaItemUrl ? `url(${activeItem.backgroundImage.mediaItemUrl})` : undefined,
                                    }} />
                                    {/* Main expertise block */}
                                    <div
                                        className="relative flex flex-col md:flex-row items-center md:items-start p-8 md:p-16 md:min-h-[600px]">
                                        <div className="w-full md:w-1/2 z-10 flex flex-col justify-center items-start">
                                            <h2 className="text-4xl md:text-5xl mb-4">{activeItem.title}</h2>
                                            <div className="text-lg md:text-xl mb-6" dangerouslySetInnerHTML={{ __html: activeItem.copy }} />
                                            {activeItem.who && (
                                                <div className="text-xs md:text-sm font-medium drop-shadow-lg">{activeItem.who}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-linear-to-r from-black/80 to-black/40 pointer-events-none" />
                                </motion.div>


                                {/* Navigation row */}
                                <div className="flex flex-row justify-center gap-10 w-full my-12">
                                    {expertise.map((item, idx) => (
                                        <button
                                            key={idx}
                                            ref={el => expertiseRef.current[idx] = el}
                                            onClick={() => setActiveIndex(idx)}
                                            className={`flex flex-col items-center focus:outline-none cursor-pointer z-10 opacity-0 translate-y-20 group ${activeIndex === idx ? '' : ''}`}
                                            aria-current={activeIndex === idx ? 'true' : 'false'}
                                        >
                                            <div className={`rounded-full overflow-hidden border-3 ${activeIndex === idx ? 'border-white' : 'border-transparent'} w-20 h-20 md:w-24 md:h-24 mb-2 group-hover:scale-110 transition-transform duration-300`}>
                                                {item.photo && (
                                                    <Image
                                                        src={item.photo.mediaItemUrl}
                                                        alt={item.photo.altText}
                                                        width={item.photo.mediaDetails.width}
                                                        height={item.photo.mediaDetails.height}
                                                        className="object-cover w-full h-full"
                                                    />
                                                )}
                                            </div>
                                            <span className="text-center text-sm md:text-base/5 max-w-[120px]">{item.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Expertise;