"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import Container from "../../Container";
import formatSectionLabel from '@/lib/formatSectionLabel';

gsap.registerPlugin(ScrollTrigger);

const Portfolio = ({ data }) => {
    const titleRef = useRef([]);
    const copyRef = useRef(null);
    const portfolioRef = useRef([]);
    const squareRef = useRef(null);
    const wideRefs = useRef([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const { title, copy, portfolio, sectionLabel } = data;
    const totalPages = Math.ceil(portfolio.length / itemsPerPage);
    const visibleItems = portfolio.slice(0, currentPage * itemsPerPage);

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
        .to(copyRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: copyRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        })
        .to(portfolioRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: portfolioRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    // Animation for new items when loading more
    useEffect(() => {
        if (currentPage > 1) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const newItems = portfolioRef.current.slice(startIndex, startIndex + itemsPerPage);
            
            gsap.to(newItems, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power4.out',
                stagger: 0.1,
                onComplete: updateWideHeights
            });
        }
    }, [currentPage]);

    // Height sync effect
    const updateWideHeights = () => {
        if (!squareRef.current) return;
        const squareHeight = squareRef.current.offsetHeight;
        wideRefs.current.forEach(ref => {
            if (ref) ref.style.height = `${squareHeight}px`;
        });
    };

    useEffect(() => {
        let timeoutId;
        
        const debouncedUpdateHeights = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(updateWideHeights, 100);
        };

        updateWideHeights();
        window.addEventListener('resize', debouncedUpdateHeights, { passive: true });
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', debouncedUpdateHeights);
        };
    }, []);

    const handleLoadMore = () => {
        setCurrentPage(prev => prev + 1);
    };

    // Update heights when new items are rendered
    useEffect(() => {
        if (currentPage > 1) {
            // Use setTimeout to ensure DOM has updated
            setTimeout(updateWideHeights, 100);
        }
    }, [currentPage]);

    return (
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="bg-linear-to-t from-black/10 to-black/0">
            <Container className="py-20">
                <div className="flex flex-col items-center text-center">
                    {title && <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl 2xl:mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h2>}
                    {copy && <div ref={copyRef} className="w-full md:w-2/5 text-center text-blue-02 opacity-0 translate-y-20">
                        <div className="text-base md:text-xl" dangerouslySetInnerHTML={{ __html: copy }} />
                    </div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 2xl:mt-16">
                    {portfolio.map((item, index) => {
                        const isEvenRow = Math.floor(index / 2) % 2 === 0;
                        const isFirstInRow = index % 2 === 0;

                        const isWide = isEvenRow 
                            ? isFirstInRow && 'lg:col-span-2'
                            : !isFirstInRow && 'lg:col-span-2';

                        const isSquare = !isWide;

                        const { id, title, featuredImage, portfolioCategories, portfolioFields, uri } = item;

                        return (
                            <div 
                                key={id} 
                                ref={el => {
                                    portfolioRef.current[index] = el;
                                    if (isSquare && !squareRef.current) squareRef.current = el;
                                    if (isWide) wideRefs.current.push(el);
                                }}
                                className={`relative md:col-span-1 opacity-0 translate-y-20 ${
                                    isWide 
                                        ? 'lg:col-span-2' 
                                        : 'aspect-square'
                                }`}
                            >
                                <Link href={uri || '#'} className="block group h-full w-full">
                                    <div className="relative h-full w-full overflow-hidden rounded-lg">
                                        {featuredImage?.node && (
                                            <Image
                                                src={featuredImage.node.mediaItemUrl}
                                                alt={featuredImage.node.altText || ''}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-50" />
                                        <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                                            {portfolioCategories?.nodes?.[0] && (
                                                <div className="text-xs md:text-sm font-medium drop-shadow-lg mb-2">
                                                    {portfolioCategories.nodes[0].name}
                                                </div>
                                            )}
                                            <div>
                                                {(title || portfolioFields) &&
                                                    <div className="text-xs md:text-base font-medium drop-shadow-lg mb-2">
                                                        {portfolioFields.authorName}
                                                        {title}
                                                    </div>
                                                }
                                                <h3 className={`text-3xl md:text-4xl 2xl:text-5xl ${isWide ? 'lg:max-w-[50%]' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: portfolioFields.portfolioTitle }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {currentPage < totalPages && (
                    <div className="flex justify-center mt-16">
                        <Button href="/portfolio">See our portfolio</Button>
                    </div>
                )}
            </Container>
        </div>
    )
};

export default Portfolio;
