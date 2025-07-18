"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Container from "../../Container";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import formatSectionLabel from '@/lib/formatSectionLabel';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

const FullPanelCarousel = ({ data }) => {
    const { heading, slides, sectionLabel } = data;
    const componentRef = useRef(null);
    const swiperRef = useRef(null);
    const headingRef = useRef([]);
    const titleRef = useRef([]);
    const copyRef = useRef([]);
    const paginationRef = useRef([]);
    const backgroundImageRef = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    // Function to parse HTML and extract first paragraph
    // const parseCopyContent = (copy) => {
    //     if (!copy) return { firstParagraph: '', remainingContent: '' };
        
    //     // Create a temporary div to parse HTML
    //     const tempDiv = document.createElement('div');
    //     tempDiv.innerHTML = copy;
        
    //     const paragraphs = tempDiv.querySelectorAll('p');
        
    //     if (paragraphs.length === 0) {
    //         return { firstParagraph: copy, remainingContent: '' };
    //     }
        
    //     const firstParagraph = paragraphs[0].outerHTML;
    //     const remainingParagraphs = Array.from(paragraphs).slice(1);
    //     const remainingContent = remainingParagraphs.map(p => p.outerHTML).join('');
        
    //     return { firstParagraph, remainingContent };
    // };

    // Function to open modal with content
    const openModal = (slide) => {
        setModalContent(slide);
        setModalOpen(true);
    };

    // Function to close modal
    const closeModal = () => {
        setModalOpen(false);
        setModalContent(null);
    };

    // Update Swiper when modal state changes
    useEffect(() => {
        if (swiperRef.current?.swiper) {
            // Small delay to ensure DOM has updated
            const timer = setTimeout(() => {
                swiperRef.current.swiper.update();
                // Force a resize event to ensure proper recalculation
                swiperRef.current.swiper.updateSize();
                swiperRef.current.swiper.updateSlides();
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [modalOpen]);

    // Parse content on client side only
    // useEffect(() => {
    //     setIsClient(true);
    //     const content = {};
    //     slides.forEach((slide, index) => {
    //         if (slide.copy) {
    //             content[index] = parseCopyContent(slide.copy);
    //         }
    //     });
    //     setParsedContent(content);
    // }, [slides]);

    useEffect(() => {
        const titleTl = gsap.timeline();

        titleTl.to(headingRef.current, {
            y: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: headingRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        })
        .to(paginationRef.current, {
            opacity: 1,
            y: 0,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.2,
            scrollTrigger: {
                trigger: paginationRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        }, "<");
        
        // Create animations for each slide
        slides.forEach((_, index) => {
            const slide = swiperRef.current?.swiper?.slides[index];
            if (!slide) return;

            titleTl.to(backgroundImageRef.current[index], {
                scale: 1,
                duration: 2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: backgroundImageRef.current[index] || slide,
                    start: 'top 80%',
                    end: 'top top',
                    scrub: 1,
                    invalidateOnRefresh: true
                },
            })
            .to(titleRef.current[index], {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: titleRef.current[index],
                    start: 'top 90%',
                    scrub: 1.5,
                    invalidateOnRefresh: true
                },
            }, "<")
            .to(copyRef.current[index], {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: copyRef.current[index],
                    start: 'top 90%',
                    end: 'top 75%',
                    scrub: 1.5,
                    invalidateOnRefresh: true
                },
            }, "<");
        });

        // return () => {
        //     ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        // };
    }, [slides]);

    return (
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} ref={componentRef} className="relative min-h-[100vh] h-full w-full">
            {heading && <h2 ref={el => headingRef.current[0] = el} className="text-white uppercase tracking-widest text-lg md:text-xl px-15 mb-8 text-center font-medium w-full lg:w-110 absolute top-20 left-1/2 -translate-x-1/2 translate-y-full opacity-0 z-50">{heading}</h2>}
            <div className={`absolute top-15 2xl:top-25 left-1/2 w-full transform -translate-x-1/2 z-50`}>
                <div className="flex justify-center space-x-2 md:space-x-4">
                    {slides.map((slide, index) => (
                        <button
                            key={index}
                            ref={el => paginationRef.current[index] = el}
                            onClick={() => {
                                swiperRef.current?.swiper?.slideTo(index);
                                setActiveIndex(index);
                            }}
                            className={`text-4xl sm:text-3xl md:text-5xl hover:text-lightblue focus:outline-none cursor-pointer transition-colors opacity-0 translate-y-full ${activeIndex === index ? 'text-lightblue' : 'text-white'}`}
                        >
                            {slide.title}
                        </button>
                    ))}
                </div>
            </div>
            <Swiper
                ref={swiperRef}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                className="h-full full-panel-carousel-swiper"
                onSlideChange={swiper => {
                    setActiveIndex(swiper.activeIndex);
                }}
            >
                {slides.map((slide, index) => {
                    const { title, copy, backgroundImage, backgroundImageMobile, imageOverlay, accordionCopy, accordionList } = slide;
                    
                    return (
                        <SwiperSlide key={index}>
                            <div className="relative min-h-[100vh] h-full w-full overflow-hidden">
                                <div 
                                    ref={el => backgroundImageRef.current[index] = el}
                                    className={`background-image absolute top-0 left-0 w-full h-full bg-[100%_auto] bg-fixed bg-top-right scale-180 origin-top ${backgroundImageMobile ? 'hidden lg:block' : ''}`} 
                                    style={{ backgroundImage: `url(${backgroundImage.mediaItemUrl})` }} 
                                />
                                {backgroundImageMobile && (
                                    <div className="background-image absolute top-0 left-0 w-full h-full bg-cover bg-top-right lg:hidden" style={{ backgroundImage: `url(${backgroundImageMobile.mediaItemUrl})` }} />
                                )}
                                {imageOverlay && <div className="absolute top-0 left-0 w-full h-full bg-black/50 lg:bg-black/40" />}
                                <div className="min-h-[100vh] h-full flex flex-col justify-start pt-20 2xl:pt-40 pb-10 lg:pb-0">
                                    <Container className="py-5 2xl:py-45 relative z-10 text-white flex flex-col justify-center h-full">
                                        <div className="flex flex-col w-full gap-5">
                                            {title && (
                                                <h3 ref={el => titleRef.current[index] = el} className="slide-title text-9xl md:text-[6rem]/20 lg:text-[7rem]/25 tracking-tight w-full opacity-0 -translate-x-3 -translate-y-full">
                                                    {title}
                                                </h3>
                                            )}
                                            {copy && (
                                                <div ref={el => copyRef.current[index] = el} className="slide-copy w-full lg:w-3/7 text-xl md:text-[1.2rem]/7 opacity-0 translate-y-5">
                                                    <div className="flex flex-col gap-8" dangerouslySetInnerHTML={{ __html: copy }} />
                                                    {/* <div className="flex flex-col gap-8">
                                                        <div dangerouslySetInnerHTML={{ __html: slideContent.firstParagraph }} />
                                                        {isClient && slideContent.remainingContent && (
                                                            <div 
                                                                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                                                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                                }`}
                                                            >
                                                                <div dangerouslySetInnerHTML={{ __html: slideContent.remainingContent }} />
                                                            </div>
                                                        )}
                                                    </div> */}
                                                </div>
                                            )}

                                            {(accordionCopy || accordionList) && 
                                                <div className="flex flex-col gap-5 z-50 mt-8">
                                                    <Button 
                                                        onClick={() => openModal(slide)}
                                                        className="bg-lightblue text-white font-normal px-6 py-2 rounded-full shadow hover:bg-darkblue transition-colors cursor-pointer w-max uppercase"
                                                    >
                                                        Read more
                                                    </Button>
                                                </div>
                                            }
                                        </div>
                                    </Container>
                                </div>
                                {/* {isExpanded && <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-02/80 to-blue-02/0" />} */}
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            {/* Custom Swiper pagination styles */}
            <style jsx global>{`
                .full-panel-carousel-swiper .swiper-pagination {
                position: absolute;
                bottom: 40px !important;
                left: 0;
                width: 100%;
                display: flex;
                justify-content: center;
                z-index: 50;
                }
                .full-panel-carousel-swiper .swiper-pagination-bullet {
                background: #fff;
                opacity: 1;
                width: 16px;
                height: 16px;
                margin: 0 5px !important;
                border-radius: 50%;
                transition: background 0.2s;
                }
                .full-panel-carousel-swiper .swiper-pagination-bullet-active {
                background: #06acd4;
                }
            `}</style>

            {/* Modal */}
            <Modal 
                isOpen={modalOpen} 
                onClose={closeModal}
                title={modalContent?.title}
                darkMode={true}
            >
                {modalContent && (
                    <div className="flex flex-col gap-8 text-lg">
                        {modalContent.accordionCopy && (
                            <div dangerouslySetInnerHTML={{ __html: modalContent.accordionCopy }} />
                        )}
                        {modalContent.accordionList && (
                            <div className="lg:grid lg:grid-cols-2 lg:gap-10">
                                {/* First column - gets more items */}
                                <ul className="list-disc marker:text-lightblue pl-4 space-y-2">
                                    {modalContent.accordionList.slice(0, Math.ceil(modalContent.accordionList.length * 0.6)).map((item, index) => (
                                        <li className="mb-3 text-pretty" key={index}>
                                            {item.listItem}
                                        </li>
                                    ))}
                                </ul>
                                {/* Second column - gets remaining items */}
                                <ul className="list-disc marker:text-lightblue pl-4 space-y-2">
                                    {modalContent.accordionList.slice(Math.ceil(modalContent.accordionList.length * 0.6)).map((item, index) => (
                                        <li className="mb-3 text-pretty" key={Math.ceil(modalContent.accordionList.length * 0.6) + index}>
                                            {item.listItem}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default FullPanelCarousel;