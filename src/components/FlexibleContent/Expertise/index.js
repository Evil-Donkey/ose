"use client";

import Headings from "@/components/Headings";
import Column from "@/components/Column";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import formatSectionLabel from '@/lib/formatSectionLabel';
import Container from "../../Container";
import { useIsMobile } from "@/hooks/isMobile";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

const Expertise = ({ data }) => {
    const { title, columns, headings, expertise, sectionLabel } = data;
    const colNumber = columns.length;
    const [activeIndex, setActiveIndex] = useState(0);

    const expertiseRef = useRef([]);
    const titleRef = useRef([]);
    const containerRef = useRef(null);
    
    const isMobile = useIsMobile();

    const activeItem = expertise[activeIndex];

    const handleClick = (index) => {
        setActiveIndex(index);
        if (containerRef.current) {
            const yOffset = -100;
            const y = containerRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    }
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
                end: 'top 75%',
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
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="text-white bg-cover bg-center bg-[url('/gradient.png')]">
            <Container className="py-20 2xl:py-40">
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

                    {expertise && !isMobile && (
                        <AnimatePresence mode="wait">
                            <div ref={containerRef} className="flex flex-col items-stretch rounded-3xl overflow-hidden mt-16 relative bg-cover bg-center bg-blue-02">
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
                                        className="relative flex flex-col md:flex-row items-center md:items-start p-8 md:p-10 2xl:p-16 min-h-[600px] lg:min-h-[480px] 2xl:min-h-[600px]">
                                        <div className="w-full md:w-2/3 lg:w-1/2 z-10 flex flex-col justify-center items-start">
                                            <h2 className="text-4xl md:text-[2.5rem] 2xl:text-5xl mb-4">{activeItem.title}</h2>
                                            <div className="text-base 2xl:text-xl mb-6" dangerouslySetInnerHTML={{ __html: activeItem.copy }} />
                                            {activeItem.who && (
                                                <div className="text-xs md:text-sm font-medium drop-shadow-lg">{activeItem.who}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-black/75 md:bg-transparent md:bg-linear-to-r from-black/80 to-black/40 pointer-events-none" />
                                </motion.div>


                                {/* Navigation row */}
                                <div className="flex flex-row flex-nowrap overflow-x-auto lg:overflow-visible px-8 lg:justify-center gap-5 md:gap-10 md:w-full mt-6 mb-4 md:my-6 2xl:my-12">
                                    {expertise.map((item, idx) => (
                                        <button
                                            key={idx}
                                            ref={el => expertiseRef.current[idx] = el}
                                            onClick={() => handleClick(idx)}
                                            className={`max-sm:w-20 flex flex-col items-center focus:outline-none cursor-pointer z-10 opacity-0 translate-y-20 group ${activeIndex === idx ? '' : ''}`}
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
                                <div className="mb-6 lg:hidden text-xs text-center text-white relative">Drag left to view more</div>
                            </div>
                        </AnimatePresence>
                    )}

                    {expertise && isMobile && (
                        <div className="mt-8">
                            <Swiper
                                modules={[Pagination]}
                                pagination={{
                                    clickable: true,
                                    renderBullet: function (index, className) {
                                        return '<span class="' + className + '"></span>';
                                    },
                                }}
                                spaceBetween={20}
                                slidesPerView={1}
                                className="expertise-swiper overflow-visible!"
                            >
                                {expertise.map((item, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="bg-blue-02 rounded-3xl overflow-hidden">
                                            {item.backgroundImage?.mediaItemUrl && (
                                                <div className="relative w-full h-60">
                                                    <Image
                                                        src={item.backgroundImage.mediaItemUrl}
                                                        alt={item.backgroundImage.altText || ''}
                                                        fill
                                                        className="object-cover object-top"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <h2 className="text-2xl font-medium mb-4">{item.title}</h2>
                                                <div 
                                                    className="text-base mb-4"
                                                    dangerouslySetInnerHTML={{ __html: item.copy }}
                                                />
                                                {item.who && (
                                                    <div className="text-sm font-medium">{item.who}</div>
                                                )}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <style jsx global>{`
                                .expertise-swiper .swiper-pagination {
                                    bottom: -30px;
                                }
                                .expertise-swiper .swiper-pagination-bullet {
                                    width: 8px;
                                    height: 8px;
                                    background: rgba(255, 255, 255, 0.5);
                                    opacity: 1;
                                }
                                .expertise-swiper .swiper-pagination-bullet-active {
                                    background: white;
                                }
                            `}</style>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Expertise;