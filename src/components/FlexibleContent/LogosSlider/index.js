"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import formatSectionLabel from "@/lib/formatSectionLabel";
import { proxyImageUrl } from "@/lib/proxyImage";
import Container from "../../Container";

import "swiper/css";
import "swiper/css/navigation";
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
    const swiperRef = useRef(null);

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
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation, Pagination]}
                        navigation={true}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 40 },
                            0: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 24 },
                        }}
                        className="logos-slider-swiper pb-24! px-12 md:px-16"
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
                    <style jsx global>{`
                        .logos-slider-swiper .swiper-button-next,
                        .logos-slider-swiper .swiper-button-prev {
                            background: #00a0cc;
                            color: #fff;
                            width: 44px;
                            height: 44px;
                            border-radius: 9999px;
                            display: flex !important;
                            align-items: center;
                            justify-content: center;
                            box-shadow: none !important;
                            transition: background 0.2s;
                            top: auto;
                            bottom: 0;
                            margin-top: -22px;
                        }
                        .logos-slider-swiper .swiper-button-next:hover,
                        .logos-slider-swiper .swiper-button-prev:hover {
                            background: #00004d;
                        }
                        .logos-slider-swiper .swiper-button-next::after,
                        .logos-slider-swiper .swiper-button-prev::after {
                            font-size: 1.25rem;
                            font-weight: 700;
                            color: #fff;
                        }
                        .logos-slider-swiper .swiper-button-prev {
                            left: 0 !important;
                        }
                        .logos-slider-swiper .swiper-button-next {
                            right: 0 !important;
                        }
                        .logos-slider-swiper .swiper-button-disabled {
                            opacity: 0.35;
                            pointer-events: none;
                        }
                        .logos-slider-swiper .swiper-pagination {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            display: flex;
                            justify-content: center;
                            z-index: 50;
                        }
                        .logos-slider-swiper .swiper-pagination-bullet {
                            background: #00a0cc;
                            opacity: 1;
                            width: 16px;
                            height: 16px;
                            margin: 0 5px !important;
                            border-radius: 50%;
                            transition: background 0.2s;
                        }
                        .logos-slider-swiper .swiper-pagination-bullet-active {
                            background: #00004d;
                        }
                    `}</style>
                </div>
            </Container>
        </div>
    );
};

export default LogosSlider;
