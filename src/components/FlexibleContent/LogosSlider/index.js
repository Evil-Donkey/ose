"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import formatSectionLabel from "@/lib/formatSectionLabel";
import { proxyImageUrl } from "@/lib/proxyImage";
import Container from "../../Container";

import "swiper/css";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

const LogoImage = ({ image }) => (
    <Image
        src={proxyImageUrl(image.mediaItemUrl)}
        alt={image.altText || ""}
        width={210}
        height={105}
        className="object-contain max-h-[105px] md:max-h-[105px] w-auto h-auto"
        unoptimized
    />
);

const LogosSlider = ({ data }) => {
    const titleRef = useRef(null);
    const paginationRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const { title, logos, sectionLabel } = data;

    useEffect(() => {
        if (!titleRef.current) return;

        gsap.to(titleRef.current, {
            x: 0,
            opacity: 1,
            duration: 2,
            ease: "power4.out",
            scrollTrigger: {
                trigger: titleRef.current,
                start: "top 90%",
                scrub: 1.5,
                invalidateOnRefresh: true,
            },
        });
    }, []);

    useEffect(() => {
        if (!swiperInstance || !paginationRef.current) return;

        swiperInstance.params.pagination.el = paginationRef.current;
        swiperInstance.pagination.destroy();
        swiperInstance.pagination.init();
        swiperInstance.pagination.render();
        swiperInstance.pagination.update();
    }, [swiperInstance]);

    const updateNavState = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    const slides = logos?.filter((item) => item?.image?.mediaItemUrl) ?? [];

    if (!slides.length) return null;

    return (
        <div
            id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}
            className="bg-linear-to-b from-[#fcfcfc] to-[#e6e6e6]"
        >
            <Container className="py-20 md:py-30 2xl:py-40">
                {title && (
                    <h2
                        ref={titleRef}
                        className="uppercase tracking-widest text-lg md:text-xl mb-10 md:mb-16 text-center font-medium opacity-0 translate-x-full text-black"
                    >
                        {title}
                    </h2>
                )}
                <div className="relative w-full">
                    <div className="relative min-h-[105px]">
                        <Swiper
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            onSwiper={(swiper) => {
                                setSwiperInstance(swiper);
                                updateNavState(swiper);
                            }}
                            onSlideChange={updateNavState}
                            breakpoints={{
                                1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 40 },
                                0: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 24 },
                            }}
                            className="logos-slider-swiper"
                        >
                            {slides.map(({ url, image }, index) => (
                                <SwiperSlide key={index}>
                                    <div className="flex items-center justify-center h-[105px] md:h-[105px] px-2">
                                        {url ? (
                                            <Link
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center"
                                            >
                                                <LogoImage image={image} />
                                            </Link>
                                        ) : (
                                            <LogoImage image={image} />
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <button
                            type="button"
                            aria-label="Previous logos"
                            disabled={isBeginning}
                            onClick={() => swiperInstance?.slidePrev()}
                            className="absolute inset-y-0 -left-11 z-10 w-[15%] min-w-[3rem] max-w-[7rem] cursor-pointer border-0 bg-transparent p-0 disabled:pointer-events-none disabled:cursor-default"
                        />
                        <button
                            type="button"
                            aria-label="Next logos"
                            disabled={isEnd}
                            onClick={() => swiperInstance?.slideNext()}
                            className="absolute inset-y-0 -right-11 z-10 w-[15%] min-w-[3rem] max-w-[7rem] cursor-pointer border-0 bg-transparent p-0 disabled:pointer-events-none disabled:cursor-default"
                        />
                    </div>

                    <div ref={paginationRef} className="logos-slider-pagination mt-8 flex items-center justify-center" />

                    <style jsx global>{`
                        .logos-slider-pagination {
                            position: relative;
                            width: auto;
                            display: flex;
                            justify-content: center;
                            gap: 0;
                        }
                        .logos-slider-pagination .swiper-pagination-bullet {
                            background: #00a0cc;
                            opacity: 1;
                            width: 16px;
                            height: 16px;
                            margin: 0 5px !important;
                            border-radius: 50%;
                            transition: background 0.2s;
                        }
                        .logos-slider-pagination .swiper-pagination-bullet-active {
                            background: #00004d;
                        }
                    `}</style>
                </div>
            </Container>
        </div>
    );
};

export default LogosSlider;
