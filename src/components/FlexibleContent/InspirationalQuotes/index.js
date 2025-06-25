"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

const InspirationalQuotes = ({ data }) => {

    const { title, quotes, carousel } = data;
    
    const contentRef = useRef([]);
    const imageRef = useRef([]);

    useEffect(() => {
        const titleTl = gsap.timeline();
        
        // Create individual animations for each quote section
        quotes.forEach((_, index) => {
            // Image animation
            gsap.to(imageRef.current[index], {
                scale: 1,
                // duration: 2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: imageRef.current[index],
                    start: 'top 80%',
                    end: 'top top',
                    scrub: 1,
                    invalidateOnRefresh: true
                },
            });

            // Content animation
            gsap.to(contentRef.current[index], {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: contentRef.current[index],
                    start: 'top 90%',
                    end: 'top 75%',
                    scrub: 1.5,
                    invalidateOnRefresh: true
                },
            });
        });

        // return () => {
        //     ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        // };
    }, [quotes]);

    return quotes ? (
        <div className="relative">
            {carousel ? (
                <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    className="h-full inspirational-quotes-swiper"
                >
                    {quotes.map((q, index) => {
                        const { author, quoteOnTheRight, quote, image, darkOverlay, mobile } = q;
                        return (
                            <SwiperSlide key={index.toString()} className="h-auto!">
                                <div className="relative min-h-[100vh] h-full w-full overflow-hidden bg-white">
                                    {(image || mobile) && (
                                        <>
                                            {image && <div ref={el => imageRef.current[index] = el} className={`absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top ${mobile ? "hidden lg:block" : ""}`} style={{ backgroundImage: `url(${image.mediaItemUrl})` }} />}
                                            {mobile && <div ref={el => imageRef.current[index + 1] = el} className={`absolute top-0 left-0 w-full h-full bg-cover bg-center ${image ? "lg:hidden" : ""}`} style={{ backgroundImage: `url(${mobile.mediaItemUrl})` }} />}
                                            {darkOverlay && <div className={`absolute bottom-0 lg:top-0 left-0 ${quoteOnTheRight ? "lg:left-auto lg:right-0" : ""} w-full lg:w-3/5 h-3/5 lg:h-full bg-gradient-to-t ${quoteOnTheRight ? "lg:bg-gradient-to-l" : "lg:bg-gradient-to-r"} from-black/80 to-black/0`} />}
                                        </>
                                    )}
                                    <div className="min-h-[100vh] h-full flex flex-col justify-end lg:justify-center">
                                        <Container className={`h-full py-30 md:py-25 2xl:py-45 relative z-10 text-white flex gap-10 lg:gap-25 ${quoteOnTheRight ? "items-end md:items-start justify-end" : "items-end md:items-start justify-start"}`}>
                                            <div className="flex flex-col w-full lg:w-1/2 gap-3 md:gap-5 lg:py-15 opacity-0 translate-y-5" ref={el => contentRef.current[index] = el}>
                                                {quote && 
                                                <div className="relative">
                                                    <div className="absolute -top-10 md:-top-15 left-0 bg-[url('/quote.svg')] bg-contain bg-center bg-no-repeat w-10 h-10 md:w-15 md:h-15" />
                                                    <div className="pt-5 text-2xl md:text-[2.5rem] 2xl:text-[3rem] font-medium" dangerouslySetInnerHTML={{ __html: quote }} />
                                                </div>
                                                }
                                                {author && 
                                                    <div className="w-full md:mt-5">
                                                        <div className="text-base font-medium" dangerouslySetInnerHTML={{ __html: author }} />
                                                    </div>
                                                }
                                            </div>
                                        </Container>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                    {/* Custom Swiper pagination styles */}
                    <style jsx global>{`
                      .inspirational-quotes-swiper .swiper-pagination {
                        position: absolute;
                        bottom: 40px;
                        left: 0;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        z-index: 50;
                      }
                      .inspirational-quotes-swiper .swiper-pagination-bullet {
                        background: #fff;
                        opacity: 1;
                        width: 16px;
                        height: 16px;
                        margin: 0 5px !important;
                        border-radius: 50%;
                        transition: background 0.2s;
                      }
                      .inspirational-quotes-swiper .swiper-pagination-bullet-active {
                        background: #06acd4;
                      }
                    `}</style>
                </Swiper>
            ) : (
                quotes.map((q, index) => {
                    const { author, quoteOnTheRight, quote, image, darkOverlay, mobile } = q;
                    return (
                        <div key={index.toString()} className="relative min-h-[100vh] h-full w-full overflow-hidden bg-white">
                            {(image || mobile) && (
                                <>
                                    {image && <div ref={el => imageRef.current[index] = el} className={`absolute top-0 left-0 w-full h-full bg-cover bg-center scale-180 origin-top ${mobile ? "hidden lg:block" : ""}`} style={{ backgroundImage: `url(${image.mediaItemUrl})` }} />}
                                    {mobile && <div ref={el => imageRef.current[index + 1] = el} className={`absolute top-0 left-0 w-full h-full bg-cover bg-center ${image ? "lg:hidden" : ""}`} style={{ backgroundImage: `url(${mobile.mediaItemUrl})` }} />}
                                    {darkOverlay && <div className={`absolute bottom-0 lg:top-0 left-0 ${quoteOnTheRight ? "lg:left-auto lg:right-0" : ""} w-full lg:w-3/5 h-3/5 lg:h-full bg-gradient-to-t ${quoteOnTheRight ? "lg:bg-gradient-to-l" : "lg:bg-gradient-to-r"} from-black/80 to-black/0`} />}
                                </>
                            )}
                            <div className="min-h-[100vh] h-full flex flex-col justify-end lg:justify-center">
                                <Container className={`h-full py-30 md:py-25 2xl:py-45 relative z-10 text-white flex gap-10 lg:gap-25 ${quoteOnTheRight ? "items-end md:items-start justify-end" : "items-end md:items-start justify-start"}`}>
                                    <div className="flex flex-col w-full lg:w-1/2 gap-3 md:gap-5 lg:py-15 opacity-0 translate-y-5" ref={el => contentRef.current[index] = el}>
                                        {quote && 
                                        <div className="relative">
                                            <div className="absolute -top-10 md:-top-15 left-0 bg-[url('/quote.svg')] bg-contain bg-center bg-no-repeat w-10 h-10 md:w-15 md:h-15" />
                                            <div className="pt-5 text-2xl md:text-[2.5rem] 2xl:text-[3rem] font-medium" dangerouslySetInnerHTML={{ __html: quote }} />
                                        </div>
                                        }
                                        {author && 
                                            <div className="w-full md:mt-5">
                                                <div className="text-base font-medium" dangerouslySetInnerHTML={{ __html: author }} />
                                            </div>
                                        }
                                    </div>
                                </Container>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    ) : null;
}

export default InspirationalQuotes;