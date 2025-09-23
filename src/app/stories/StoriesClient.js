"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Container from "@/components/Container";
import Link from "next/link";
import ReactDOM from "react-dom";
import ResponsiveImage from "../../components/ResponsiveImage";
import Button from "@/components/Button";
import { getOptimizedImageProps } from "../../lib/imageUtils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StoriesClient({ types, stories, sectors }) {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const portalDropdownRefs = useRef({});
  const dropdownButtonRefs = useRef({});
  const storyRefs = useRef([]);
  
  // Dropdown portal logic
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [isMobileDropdown, setIsMobileDropdown] = useState(false);

  const sortedTypes = useMemo(() => {
    return [...types].sort((a, b) => (a.customOrder ?? 0) - (b.customOrder ?? 0));
  }, [types]);

  const sortedSectors = useMemo(() => {
    return [...sectors].sort((a, b) => (a.customOrder ?? 0) - (b.customOrder ?? 0));
  }, [sectors]);

  // const [randomizedStories, setRandomizedStories] = useState([]);

  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      const typeMatch = !selectedType || story.storiesTypes?.nodes?.some(type => type.id === selectedType);
      const sectorMatch = !selectedSector || story.storiesSectors?.nodes?.some(sector => sector.id === selectedSector);
      return typeMatch && sectorMatch;
    }).sort((a, b) => (a.menuOrder || 0) - (b.menuOrder || 0));
  }, [stories, selectedType, selectedSector]);

  // Randomize stories on client side only
//   useEffect(() => {
//     const shuffled = [...filteredStories].sort(() => Math.random() - 0.5);
//     setRandomizedStories(shuffled);
//   }, [filteredStories]);

  // Notify parent component when stories update
//   useEffect(() => {
//     if (onStoriesUpdate) {
//       onStoriesUpdate(randomizedStories);
//     }
//   }, [randomizedStories, onStoriesUpdate]);

    useEffect(() => {
        const tl = gsap.timeline();
        tl
        .to(storyRefs.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: storyRefs.current,
                start: 'top 90%',
                end: 'top 75%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    useEffect(() => {
        const storiesItems = document.querySelectorAll(".stories-item");
        storiesItems.forEach(item => {
            gsap.to(item, { opacity: 1, y: 0, duration: .5, stagger: 0.1, scrollTrigger: { trigger: item, start: "top bottom", scrub: false } });
        });
        ScrollTrigger.refresh();
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [filteredStories, selectedType, selectedSector]);

  // When opening a dropdown, measure its button position
  useEffect(() => {
    if (openDropdown && dropdownButtonRefs.current[openDropdown]) {
      requestAnimationFrame(() => {
        const rect = dropdownButtonRefs.current[openDropdown].getBoundingClientRect();
        setDropdownPosition({
          left: rect.left,
          top: rect.bottom,
          width: rect.width,
        });
      });
    }
  }, [openDropdown]);

  // Update isMobileDropdown on resize
  useEffect(() => {
    let timeoutId;
    
    function handleResize() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobileDropdown(window.innerWidth < 1021);
      }, 100);
    }
    
    setIsMobileDropdown(window.innerWidth < 1021);
    
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      const refs = Object.values(dropdownRefs.current).filter(Boolean);
      const portalRefs = Object.values(portalDropdownRefs.current).filter(Boolean);
      if (
        refs.every(ref => !ref.contains(event.target)) &&
        portalRefs.every(ref => !ref.contains(event.target))
      ) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openDropdown]);

  // Helper to render dropdown in portal
  function DropdownPortal({ children, dropdownKey }) {
    if (typeof window === "undefined") return null;
    const setPortalRef = el => {
      if (dropdownKey && el) portalDropdownRefs.current[dropdownKey] = el;
    };
    return ReactDOM.createPortal(
      <div
        ref={setPortalRef}
        style={{ position: "absolute", left: dropdownPosition.left, top: dropdownPosition.top, minWidth: dropdownPosition.width, zIndex: 1000 }}
      >
        {children}
      </div>,
      document.body
    );
  }

  return (
    <div className="bg-linear-to-t from-black/10 to-black/0 pb-20">
        <Container>
            <div className="w-full flex justify-between mb-3">
                <h3 className="text-sm font-bold uppercase text-blue-02">Filter by type:</h3>
                <h3 className="text-sm font-bold uppercase text-blue-02 hidden lg:block">Filter by sector:</h3>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-4 mb-3 justify-between text-left relative z-10">
                {sortedTypes.map((type, index) => (
                    <div
                    key={type.id}
                    className="flex-1 relative group"
                    >
                        <div
                        className={`bg-lightblue rounded-xl p-4 text-white font-bold text-xl cursor-pointer select-none flex items-center justify-between whitespace-nowrap hover:opacity-100 ${type.description && "hover:rounded-b-none"} ${selectedType !== type.id ? "opacity-80" : "opacity-100"}`}
                        onClick={() => {
                            setSelectedType(type.id);
                        }}
                        >
                            <span>{type.name}</span>
                            <span>
                                <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedType === type.id ? "bg-white" : ""}`}></span>
                            </span>
                        </div>
                        {type.description && (
                            <div className="absolute left-0 right-0 bg-lightblue text-white rounded-b-xl shadow-lg overflow-hidden hidden group-hover:block">
                                <div className="flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg">
                                    <span>{type.description}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                
                {/* Sectors dropdown */}
                <div className="relative flex-1">
                    <div
                        ref={el => (dropdownButtonRefs.current["sector"] = el)}
                        className={`bg-[#00A0CC] p-4 text-white font-bold text-xl cursor-pointer select-none flex items-center justify-between whitespace-nowrap ${openDropdown === "sector" ? "z-10 rounded-t-xl" : "rounded-xl"}`}
                        onClick={() => setOpenDropdown(openDropdown === "sector" ? null : "sector")}
                    >
                        <span>{sortedSectors.find(sector => sector.id === selectedSector)?.name || 'All Sectors'}</span>
                        <span>
                            <span className={`ml-2 -mr-2 w-9 h-5 flex items-center justify-center`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                                    <path fillRule="evenodd" d="M12 15.5a.75.75 0 01-.53-.22l-5-5a.75.75 0 111.06-1.06L12 13.69l4.47-4.47a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-.53.22z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </span>
                    </div>
                    {openDropdown === "sector" && (
                        isMobileDropdown ? (
                            <DropdownPortal dropdownKey={"sector"}>
                                <div className="bg-[#00A0CC] text-white rounded-b-xl shadow-lg overflow-hidden">
                                    <div
                                        key="all"
                                        className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${selectedSector === null ? "bg-white text-[#00A0CC] font-bold" : ""}`}
                                        onMouseDown={e => {
                                            e.stopPropagation();
                                            setSelectedSector(null);
                                        }}
                                    >
                                        <span>All Sectors</span>
                                        <span>
                                            <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedSector === null ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
                                        </span>
                                    </div>
                                    {sortedSectors.map(sector => (
                                        <div
                                            key={sector.id}
                                            className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${selectedSector === sector.id ? "bg-white text-[#00A0CC] font-bold" : ""}`}
                                            onMouseDown={e => {
                                                e.stopPropagation();
                                                setSelectedSector(sector.id);
                                            }}
                                        >
                                            <span>{sector.name}</span>
                                            <span>
                                                <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedSector === sector.id ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </DropdownPortal>
                        ) : (
                            <div className="absolute left-0 right-0 bg-[#00A0CC] text-white rounded-b-xl shadow-lg overflow-hidden">
                                <div
                                    key="all"
                                    className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${selectedSector === null ? "bg-white text-[#00A0CC] font-bold" : ""}`}
                                    onMouseDown={e => {
                                        e.stopPropagation();
                                        setSelectedSector(null);
                                    }}
                                >
                                    <span>All Sectors</span>
                                    <span>
                                        <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedSector === null ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
                                    </span>
                                </div>
                                {sortedSectors.map(sector => (
                                    <div
                                        key={sector.id}
                                        className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${selectedSector === sector.id ? "bg-white text-[#00A0CC] font-bold" : ""}`}
                                        onMouseDown={e => {
                                            e.stopPropagation();
                                            setSelectedSector(sector.id);
                                        }}
                                    >
                                        <span>{sector.name}</span>
                                        <span>
                                            <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedSector === sector.id ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>

            <div className="w-full flex justify-end mb-10">
                <button
                    className="text-sm font-bold uppercase text-blue-02/50 cursor-pointer transition-all duration-300 hover:text-darkblue"
                    onClick={() => {
                        setSelectedType(null);
                        setSelectedSector(null);
                        setOpenDropdown(null);
                    }}
                >
                    Show all
                </button>
            </div>

            {/* Stories Grid */}
            <div className="space-y-8 mb-20">
                {/* First item - full width */}
                {/* <div className="group opacity-0 translate-y-20 stories-item" ref={el => storyRefs.current[0] = el}>
                    <div className="relative overflow-hidden rounded-3xl min-h-[500px] lg:min-h-[700px] p-8 flex items-end">
                        {randomizedStories[0].featuredImage?.node?.mediaItemUrl ? (
                            <>
                                <ResponsiveImage 
                                    {...getOptimizedImageProps(randomizedStories[0].featuredImage.node, {
                                        context: 'hero',
                                        isAboveFold: true,
                                        isHero: true,
                                        index: 0,
                                        className: "absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all! duration-300!"
                                    })}
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-black/50" />
                                {randomizedStories[0].featuredImage.node.altText && <div className="hidden lg:block absolute bottom-8 right-8 text-xs 2xl:text-sm lg:text-end mt-10 lg:mt-0 text-white" dangerouslySetInnerHTML={{ __html: randomizedStories[0].featuredImage.node.altText }} />}
                            </>
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No image</span>
                            </div>
                        )}
                        <div className="relative z-10 flex flex-col justify-end h-full w-full lg:w-1/2">
                            <div>
                                {randomizedStories[0].title && <h3 className="text-3xl md:text-5xl/13 2xl:text-6xl text-white mb-4">{randomizedStories[0].title}</h3>}
                                <div className="hidden lg:block">
                                    <p className="text-white text-lg 2xl:text-xl leading-relaxed mb-6 font-medium lg:pe-10" dangerouslySetInnerHTML={{ __html: randomizedStories[0].story?.cardExcerpt || randomizedStories[0].content.replace(/<[^>]*>/g, '').split(' ').slice(0, 20).join(' ') + '...' }} />
                                    <Link href={`/stories/${randomizedStories[0].slug}`} className="block">
                                        <Button className="w-full">
                                            READ MORE
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 lg:hidden">
                        <p className="text-blue-02 text-lg 2xl:text-xl leading-relaxed mb-6 font-medium">
                            {randomizedStories[0].content ? randomizedStories[0].content.replace(/<[^>]*>/g, '').split(' ').slice(0, 20).join(' ') + '...' : ''}
                        </p>
                        <Link href={`/stories/${randomizedStories[0].slug}`} className="block">
                            <Button className="w-full">
                                READ MORE
                            </Button>
                        </Link>
                    </div>
                </div> */}

                {/* Remaining items - 2-column grid */}
                {filteredStories && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStories.map((story, index) => {
                            const { title, content, featuredImage, slug } = story;
                            const { cardExcerpt } = story.story;
                            const excerpt = content ? content.replace(/<[^>]*>/g, '').split(' ').slice(0, 20).join(' ') + '...' : '';
                            
                            return (
                                <div key={index + 1} className="opacity-0 translate-y-20 stories-item" ref={el => storyRefs.current[index + 1] = el}>
                                    <Link href={`/stories/${slug}`} className="block group transition-all duration-300">
                                        <div className="relative overflow-hidden rounded-2xl min-h-[200px] p-6 flex items-end">
                                            {featuredImage?.node?.mediaItemUrl ? (
                                                <>
                                                    <ResponsiveImage 
                                                        {...getOptimizedImageProps(featuredImage.node, {
                                                            context: 'card',
                                                            index,
                                                            className: "absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all! duration-300!"
                                                        })}
                                                    />
                                                    <div className="absolute top-0 left-0 w-full h-full bg-black/50" />
                                                </>
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400">No image</span>
                                                </div>
                                            )}
                                            <div className="relative z-10 flex flex-col justify-end h-full">
                                                <div>
                                                    {title && <h3 className="text-xl 2xl:text-2xl text-white">{title}</h3>}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    
                                    {/* Content section */}
                                    <div className="p-6">
                                        <p className="text-blue-02 text-base 2g:text-lg leading-relaxed mb-6 font-medium" dangerouslySetInnerHTML={{ __html: cardExcerpt || excerpt }} />
                                        <Link href={`/stories/${slug}`} className="block">
                                            <Button className="w-full">
                                                READ MORE
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Container>
    </div>
  );
}