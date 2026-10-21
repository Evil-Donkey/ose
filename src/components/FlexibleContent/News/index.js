"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ResponsiveImage from "../../ResponsiveImage";
import Link from "next/link";
import Button from "@/components/Button";
import { getOptimizedImageProps } from "../../../lib/imageUtils";
import Container from "../../Container";
import formatSectionLabel from '@/lib/formatSectionLabel';
import { formatDate } from "@/lib/formatDate";

gsap.registerPlugin(ScrollTrigger);

const PORTFOLIO_BG_COLORS = ["bg-white", "bg-blue-02", "bg-lightblue"];

const getItemType = (item) => {
    if (!item) return null;
    if (item.__typename === "PortfolioNewsItem" || item.portfolioNews) return "portfolio";
    if (item.__typename === "Story" || item.story) return "story";
    if (item.__typename === "Post" || item.news) return "post";
    return null;
};

const News = ({ data }) => {

    const newsRef = useRef([]);
    const titleRef = useRef([]);

    const { news, sectionLabel } = data;
    const items = (news || []).filter(Boolean);

    // Colour cycle among Portfolio News items only (white → navy → light blue)
    let portfolioCounter = 0;
    const portfolioColorByIndex = items.map((item) => {
        if (getItemType(item) !== "portfolio") return null;
        const color = PORTFOLIO_BG_COLORS[portfolioCounter % PORTFOLIO_BG_COLORS.length];
        portfolioCounter += 1;
        return color;
    });

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
        gsap.to(newsRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: newsRef.current,
                start: 'top 90%',
                end: 'top center',
                scrub: 1.5
            },
        });
    }, []);

    const renderImageCard = (item, index, { link, target, ariaLabel }) => {
        const imageProps = getOptimizedImageProps(item.featuredImage?.node, {
            context: 'card',
            index,
            className: "object-cover w-full h-full absolute inset-0 transition-transform duration-300 group-hover:scale-110"
        });
        if (!imageProps) return null;
        return (
            <Link href={link} target={target} className="news__card-image relative aspect-4/5 overflow-hidden rounded-4xl flex text-center items-end justify-center py-10 xl:px-18 group" aria-label={ariaLabel}>
                <ResponsiveImage {...imageProps} />
            </Link>
        );
    };

    const renderPostCard = (item, index) => {
        const { title, date, uri } = item;
        const externalUrl = item.news?.externalUrl;
        const link = externalUrl ? externalUrl : `/news${uri}`;
        const target = externalUrl ? "_blank" : "_self";

        return (
            <div key={item.id || index} ref={el => newsRef.current[index] = el} className="opacity-0 translate-y-20 h-full flex flex-col">
                {renderImageCard(item, index, { link, target, ariaLabel: `Read news article: ${title}` })}
                <Link href={link} target={target}>
                    {date && (
                        <p className="text-white text-xs md:text-base font-bold drop-shadow-lg z-10 mt-5">
                            {new Date(date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit'
                            }).toUpperCase()}
                        </p>
                    )}
                    {title && <h4 className="text-white text-base font-medium drop-shadow-lg z-10" dangerouslySetInnerHTML={{ __html: title }} />}
                </Link>
            </div>
        );
    };

    const renderStoryCard = (item, index) => {
        const { title, uri, slug } = item;
        const link = uri || (slug ? `/stories/${slug}` : "#");

        return (
            <div key={item.id || index} ref={el => newsRef.current[index] = el} className="opacity-0 translate-y-20 h-full flex flex-col">
                {renderImageCard(item, index, { link, target: "_self", ariaLabel: `Read story: ${title}` })}
                <Link href={link}>
                    {title && (
                        <p className="text-white text-xs md:text-base font-bold drop-shadow-lg z-10 mt-5" dangerouslySetInnerHTML={{ __html: title }} />
                    )}
                </Link>
            </div>
        );
    };

    const renderPortfolioCard = (item, index) => {
        const bgColor = portfolioColorByIndex[index] || "bg-white";
        const isWhite = bgColor === "bg-white";
        const url = item.portfolioNews?.url;
        const categoryName = item.portfolioNewsCategories?.nodes?.[0]?.name;
        const cardClassName = `h-full block group p-5 lg:p-8 rounded-2xl ${bgColor} transition-all duration-300 ${url ? 'hover:-translate-y-1' : ''}`;

        const cardContent = (
            <div className="space-y-2">
                {categoryName && (
                    <span className="inline-block bg-lightblue-02 text-blue-02 px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                        {categoryName}
                    </span>
                )}
                {item.date && (
                    <p className={`text-sm font-medium mt-3 ${isWhite ? 'text-blue-02' : 'text-white'}`}>
                        {formatDate(item.date)}
                    </p>
                )}
                {item.title && (
                    <h4 className={`${isWhite ? 'text-2xl 2xl:text-3xl text-blue-02' : 'text-xl text-white'} leading-tight overflow-hidden`}>
                        {item.title}
                    </h4>
                )}
                {item.portfolioNews?.hashtag && (
                    <span className={`${isWhite ? 'text-blue-02' : 'text-white'} text-sm font-medium tracking-wide mt-5 block`}>
                        {item.portfolioNews.hashtag}
                    </span>
                )}
            </div>
        );

        return (
            <div key={item.databaseId || item.id || index} ref={el => newsRef.current[index] = el} className="opacity-0 translate-y-20 h-full">
                {url ? (
                    <Link href={url} target="_blank" rel="noopener noreferrer" className={cardClassName}>
                        {cardContent}
                    </Link>
                ) : (
                    <div className={cardClassName}>
                        {cardContent}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="bg-cover bg-center bg-[url('/gradient.png')]">
            <Container className="py-20 2xl:py-40">
                <div className="flex flex-col">
                    <h2 ref={titleRef} className="text-white uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">News</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
                    {items.map((item, index) => {
                        const type = getItemType(item);
                        if (type === "story") return renderStoryCard(item, index);
                        if (type === "portfolio") return renderPortfolioCard(item, index);
                        if (type === "post") return renderPostCard(item, index);
                        return null;
                    })}
                </div>
                <div className="flex justify-center mt-16">
                    <Button href="/news">See all news</Button>
                </div>
            </Container>
        </div>
    )
}

export default News;
