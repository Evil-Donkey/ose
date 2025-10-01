"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import getFounders from '@/lib/getFounders';
import Link from "next/link";
import formatSectionLabel from '@/lib/formatSectionLabel';
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const Cards = ({ data }) => {

    const cardsRef = useRef([]);
    const copyRef = useRef([]);
    const titleRef = useRef([]);
    const tabsRef = useRef([]);
    const cardsWrapperRef = useRef();

    const { title, copy, sectionLabel } = data;
    const [founders, setFounders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);

    // Extract unique foundersCategories from founders
    const foundersCategories = Array.from(
        new Set(
            founders.flatMap(founder => 
                founder.foundersCategories?.nodes?.map(cat => cat.slug)
            )
        )
    )
    .filter(Boolean)
    .map(slug => {
        const cat = founders
            .flatMap(founder => founder.foundersCategories?.nodes)
            .find(cat => cat.slug === slug);
        return cat;
    })
    .sort((a, b) => {
        // Sort by customOrder from lowest to highest
        const orderA = a.customOrder || 0;
        const orderB = b.customOrder || 0;
        return orderA - orderB;
    });

    // Fetch founders data
    useEffect(() => {
        async function fetchFounders() {
            try {
                const data = await getFounders();
                setFounders(data);
                
                // Set initial active tab to first category
                if (data.length > 0) {
                    const categories = Array.from(
                        new Set(
                            data.flatMap(founder => 
                                founder.foundersCategories?.nodes?.map(cat => cat.slug)
                            )
                        )
                    )
                    .filter(Boolean)
                    .map(slug => {
                        const cat = data
                            .flatMap(founder => founder.foundersCategories?.nodes)
                            .find(cat => cat.slug === slug);
                        return cat;
                    })
                    .sort((a, b) => {
                        const orderA = a.customOrder || 0;
                        const orderB = b.customOrder || 0;
                        return orderA - orderB;
                    });
                    
                    if (categories.length > 0) {
                        setActiveTab(categories[0].slug);
                    }
                }
                setLoading(false);
            } catch (err) {
                setError('Error loading founders.');
                setLoading(false);
            }
        }
        fetchFounders();
    }, []);

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
        gsap.to(copyRef.current, {
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
        });
        gsap.to(cardsWrapperRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: cardsWrapperRef.current,
                start: 'top 90%',
                end: 'top center',
                scrub: 1.5
            },
        });
        gsap.to(tabsRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: tabsRef.current,
                start: 'top 90%',
                end: 'top center',
                scrub: 1.5
            },
        });
        // return () => {
        //     ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        // };

    }, [loading]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (openDropdown && !event.target.closest('.dropdown-container')) {
                setOpenDropdown(null);
            }
        }
        if (openDropdown !== null) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [openDropdown]);

    // Re-trigger animations when activeTab changes
    // useEffect(() => {
    //     if (!loading && founders.length > 0) {
    //         // Clear refs array
    //         cardsRef.current = [];
            
    //         // Re-trigger card animations
    //         setTimeout(() => {
    //             gsap.to(cardsRef.current, {
    //                 opacity: 1,
    //                 y: 0,
    //                 duration: 1,
    //                 ease: 'power4.out',
    //                 stagger: 0.1,
    //                 scrollTrigger: {
    //                     trigger: cardsRef.current,
    //                     start: 'top 90%',
    //                     end: 'top center',
    //                     scrub: 1.5
    //                 },
    //             });
    //         }, 100);
    //     }
    // }, [activeTab, loading, founders]);

    if (loading) return <Container id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}><div className="min-h-[500px] flex items-center justify-center">Loading…</div></Container>;
    if (error) return <Container id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}><div>{error}</div></Container>;

    return (
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="bg-linear-to-t from-black/10 to-black/0 overflow-hidden">
            <Container className="py-20 2xl:py-40">
                {title && 
                    <div className="flex flex-col">
                        <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h2>
                    </div>
                }
                {copy && 
                    <div className="flex flex-col items-center md:gap-10 text-center text-base md:text-xl">
                        <div ref={copyRef} className={`w-full md:w-2/3 lg:-mb-10 opacity-0 translate-y-5`} dangerouslySetInnerHTML={{ __html: copy }} />
                    </div>
                }
                
                {/* Mobile Dropdown */}
                <div className="md:hidden relative dropdown-container mt-10">
                    <div 
                        className={`bg-[#00A0CC] p-4 text-white font-bold text-xl cursor-pointer select-none flex items-center justify-between whitespace-nowrap rounded-xl ${openDropdown === 'founders' ? 'rounded-t-xl' : 'rounded-xl'}`}
                        onClick={() => setOpenDropdown(openDropdown === 'founders' ? null : 'founders')}
                    >
                        <span>{foundersCategories.find(cat => cat.slug === activeTab)?.name || 'Select Category'}</span>
                        <span>
                            <span className="ml-2 -mr-2 w-9 h-5 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                                    <path fillRule="evenodd" d="M12 15.5a.75.75 0 01-.53-.22l-5-5a.75.75 0 111.06-1.06L12 13.69l4.47-4.47a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-.53.22z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </span>
                    </div>
                    {openDropdown === 'founders' && (
                        <div className="absolute left-0 right-0 bg-[#00A0CC] text-white rounded-b-xl shadow-lg overflow-hidden z-10">
                            {foundersCategories.map((category, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${activeTab === category.slug ? "bg-white text-[#00A0CC] font-bold" : ""}`}
                                    onClick={() => {
                                        setActiveTab(category.slug);
                                        setOpenDropdown(null);
                                    }}
                                >
                                    <span>{category.name}</span>
                                    <span>
                                        <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${activeTab === category.slug ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Button List */}
                <div className="hidden md:flex items-center text-center justify-center gap-10 mt-20">
                    {foundersCategories.map((category, index) => (
                        <button
                            key={index}
                            ref={el => tabsRef.current[index] = el}
                            className={`opacity-0 translate-y-20 focus:outline-none transition-colors cursor-pointer ${activeTab === category.slug ? 'text-lightblue font-medium underline' : 'text-blue-02 hover:text-darkblue'}`}
                            onClick={() => setActiveTab(category.slug)}
                            type="button"
                        >
                            <h3 className="text-lg">
                                {category.name}
                            </h3>
                        </button>
                    ))}
                </div>
                <div className="relative w-full 2xl:mt-25">
                    <div ref={cardsWrapperRef} className="opacity-0 translate-y-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
                        {(() => {
                            const filteredFounders = founders?.filter(founder => {
                                const founderCategories = founder.foundersCategories?.nodes?.map(cat => cat.slug) || [];
                                return founderCategories.includes(activeTab);
                            }) || [];
                            
                            return filteredFounders.length > 0 ? filteredFounders.map((founder, index) => {
                                const { title: founderTitle, featuredImage, slug } = founder;
                                const { role } = founder.founder;
                                
                                return (
                                    <div key={`${founder.slug}-${index}`}>
                                        <div 
                                            ref={el => cardsRef.current[index] = el} 
                                            className={`flex flex-col gap-4 h-full`}
                                        >
                                            <div className="flex flex-col">
                                                {featuredImage?.node && (
                                                    <Link href={`/founders/${slug}`} className="group overflow-hidden rounded-2xl mb-4 ">
                                                        <div 
                                                            className="w-full aspect-4/3 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                                                            style={{ backgroundImage: `url(${featuredImage?.node?.mediaItemUrl})` }}
                                                        />
                                                    </Link>
                                                )}
                                                <Link href={`/founders/${slug}`} className="flex flex-col">
                                                    {founderTitle && <h4 className="text-lg font-medium mt-4" dangerouslySetInnerHTML={{ __html: founderTitle }} />}
                                                    {role && <div className="text-sm" dangerouslySetInnerHTML={{ __html: role }} />}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : null;
                        })()}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Cards;