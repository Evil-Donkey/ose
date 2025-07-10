"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import Container from "@/components/Container";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import Link from "next/link";
import ReactDOM from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function groupCategories(categories) {
  const parents = categories.filter(cat => !cat.parentId);
  const children = categories.filter(cat => cat.parentId);
  return parents.map(parent => ({
    ...parent,
    children: children.filter(child => child.parentId === parent.id)
  }));
}

export default function PortfolioClient({ title, content, portfolioItems, categories, stages }) {
  const groupedCategories = useMemo(() => groupCategories(categories), [categories]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null); // 'sector-0', 'sector-1', 'sector-2', 'stage', or null
  const dropdownRefs = useRef({});
  const portalDropdownRefs = useRef({});
  const [fundraisingOnly, setFundraisingOnly] = useState(false);

  // Dropdown portal logic
  const [dropdownPosition, setDropdownPosition] = useState({});
  const dropdownButtonRefs = useRef({});
  const [isMobileDropdown, setIsMobileDropdown] = useState(false);

  // When opening a dropdown, measure its button position
  useEffect(() => {
    if (openDropdown && dropdownButtonRefs.current[openDropdown]) {
      const rect = dropdownButtonRefs.current[openDropdown].getBoundingClientRect();
      setDropdownPosition({
        left: rect.left,
        top: rect.bottom,
        width: rect.width,
      });
    }
  }, [openDropdown]);
  // Update isMobileDropdown on resize
  useEffect(() => {
    function handleResize() {
      setIsMobileDropdown(window.innerWidth < 1021);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Filtered items based on fundraising toggle
  const fundraisingFilteredItems = useMemo(() => {
    if (!fundraisingOnly) return portfolioItems;
    return portfolioItems.filter(item => item.portfolioFields?.currentlyFundraising);
  }, [portfolioItems, fundraisingOnly]);

  // Now apply sector/stage filters to the fundraisingFilteredItems
  const filteredItems = useMemo(() => {
    return fundraisingFilteredItems.filter(item => {
      const categoryMatch = !selectedCategory || item.portfolioCategories.nodes.some(cat => cat.id === selectedCategory);
      const stageMatch = !selectedStage || item.portfolioStages.nodes.some(stage => stage.id === selectedStage);
      return categoryMatch && stageMatch;
    });
  }, [fundraisingFilteredItems, selectedCategory, selectedStage]);

  // Sort stages by customOrder ascending
  const sortedStages = useMemo(() => {
    return [...stages].sort((a, b) => (a.customOrder ?? 0) - (b.customOrder ?? 0));
  }, [stages]);

  // GSAP animation (must be after filteredItems definition)
  useEffect(() => {
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    portfolioItems.forEach(item => {
      gsap.to(item, { opacity: 1, y: 0, duration: 1, stagger: 0.1, scrollTrigger: { trigger: item, start: "top bottom", scrub: false } });
    });
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [filteredItems, fundraisingOnly, selectedCategory, selectedStage]);

  return (
    <>
      <HeaderWithMeganavLinks fixed={true} />
      <Container>
        <div className="flex flex-col gap-10 items-center justify-center text-center lg:pb-20 pt-50">
          <div className="w-full lg:w-120">
            <h1 className="text-7xl/18 md:text-8xl/23 2xl:text-8xl/27 text-darkblue mb-5">{title}</h1>
            <div className="text-base lg:text-xl mb-10" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>

        {/* Filter UI */}
        <div className="w-full mx-auto relative z-50">

          {/* Clear Filters Button */}
          <div className="w-full flex justify-between mb-5">
              
              {/* CURRENTLY FUNDRAISING TOGGLE */}
              <div className="flex items-center gap-2 lg:gap-4">
                <button
                  type="button"
                  aria-pressed={fundraisingOnly}
                  onClick={() => setFundraisingOnly(v => !v)}
                  className={`relative w-16 h-8 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${fundraisingOnly ? 'bg-[#00A0CC]' : 'bg-gray-300'}`}
                >
                  {/* ON/OFF text */}
                  {fundraisingOnly ? (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white select-none">ON</span>
                  ) : (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white select-none">OFF</span>
                  )}
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 right-2 w-6 h-6 rounded-full bg-white shadow transition-all duration-200 ${fundraisingOnly ? 'translate-x-1' : '-translate-x-7'}`}
                  />
                </button>
                <span className="text-sm font-bold uppercase text-blue-02">Actively Raising</span>
              </div>
          </div>

          <div className="w-full flex justify-between mb-3">
              <h3 className="text-sm font-bold uppercase text-blue-02">Filter by sector:</h3>
              <h3 className="text-sm font-bold uppercase text-blue-02 hidden lg:block">Filter by stage:</h3>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-4 mb-3 justify-between text-left">
            {/* Sector filters */}
            {groupedCategories.slice(0, 3).map((parent, idx) => {
              const dropdownKey = `sector-${idx}`;
              const isOpen = openDropdown === dropdownKey;
              const hasChildren = parent.children.length > 0;
              // Compose all options (parent + children, no duplicates)
              const allOptions = [parent, ...parent.children];
              // Find selected option
              const selectedOption = allOptions.find(opt => opt.id === selectedCategory) || allOptions[0];
              // For Deep Tech, set opacity-100 if parent or any child is selected
              const isDeepTechActive = selectedCategory === parent.id || parent.children.some(child => child.id === selectedCategory);
              // For the first filter (with children), use dropdown like stage filter
              if (idx === 0 && hasChildren) {
                return (
                  <div
                    key={parent.id}
                    className="relative flex-1"
                  >
                    <div
                      ref={el => (dropdownButtonRefs.current[dropdownKey] = el)}
                      className={`bg-[#00A0CC] p-4 text-white font-bold text-xl cursor-pointer select-none flex items-center justify-between whitespace-nowrap hover:opacity-100 ${isOpen ? "z-10 rounded-t-xl" : "rounded-xl"} ${isDeepTechActive ? "opacity-100" : "opacity-80"}`}
                      onClick={() => setOpenDropdown(isOpen ? null : dropdownKey)}
                    >
                      <span>{selectedOption.name === 'Deep Tech' ? 'All Deep Tech' : selectedOption.name}</span>
                      <span>
                        <span className={`ml-2 -mr-2 w-9 h-5 flex items-center justify-center`}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                            <path fillRule="evenodd" d="M12 15.5a.75.75 0 01-.53-.22l-5-5a.75.75 0 111.06-1.06L12 13.69l4.47-4.47a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-.53.22z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </span>
                    </div>
                    {isOpen && (
                      isMobileDropdown ? (
                        <DropdownPortal dropdownKey={dropdownKey}>
                          <div className="bg-[#00A0CC] text-white rounded-b-xl shadow-lg overflow-hidden">
                            {allOptions.map(opt => (
                              <div
                                key={opt.id}
                                className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${(selectedCategory === opt.id) ? "bg-white text-[#00A0CC] font-bold opacity-100" : "opacity-80"}`}
                                onMouseDown={e => {
                                  e.stopPropagation();
                                  setSelectedCategory(opt.id);
                                }}
                              >
                                <span>{opt.name === 'Deep Tech' ? 'All' : opt.name}</span>
                                <span>
                                    <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedCategory === opt.id ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </DropdownPortal>
                      ) : (
                        <div className="absolute left-0 right-0 bg-[#00A0CC] text-white rounded-b-xl shadow-lg overflow-hidden">
                          {allOptions.map(opt => (
                            <div
                              key={opt.id}
                              className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${(selectedCategory === opt.id) ? "bg-white text-[#00A0CC] font-bold opacity-100" : "opacity-80"}`}
                              onMouseDown={e => {
                                e.stopPropagation();
                                setSelectedCategory(opt.id);
                              }}
                            >
                              <span>{opt.name === 'Deep Tech' ? 'All Deep Tech' : opt.name}</span>
                              <span>
                                  <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedCategory === opt.id ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                );
              }
              // For second and third filters (no children): just show parent, no dropdown
              return (
                <div
                  key={parent.id}
                  className="flex-1"
                >
                  <div
                    className={`bg-[#00A0CC] rounded-xl p-4 text-white font-bold text-xl cursor-pointer select-none flex items-center justify-between whitespace-nowrap hover:opacity-100 ${selectedCategory !== parent.id ? "opacity-80" : "opacity-100"}`}
                    onClick={() => {
                      setSelectedCategory(parent.id);
                      setOpenDropdown(null);
                    }}
                  >
                    <span>{parent.name}</span>
                    <span>
                        <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedCategory === parent.id ? "bg-white" : ""}`}></span>
                    </span>
                  </div>
                </div>
              );
            })}
            {/* Stage filter */}
            <div className="w-full flex justify-between mt-3 lg:hidden">
              <h3 className="text-sm font-bold uppercase text-blue-02">Filter by stage:</h3>
          </div>
            <div className="relative flex-1" >
              <div
                ref={el => (dropdownButtonRefs.current["stage"] = el)}
                className={`bg-[#00A0CC] p-4 text-white font-bold text-xl cursor-pointer select-none flex items-center justify-between whitespace-nowrap ${openDropdown === "stage" ? "z-10 rounded-t-xl" : "rounded-xl"}`}
                onClick={() => setOpenDropdown(openDropdown === "stage" ? null : "stage")}
              >
                <span>{sortedStages.find(stage => stage.id === selectedStage)?.name || 'All Stages'}</span>
                {/* <span>Stage</span> */}
                <span>
                <span className={`ml-2 -mr-2 w-9 h-5 flex items-center justify-center`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                        <path fillRule="evenodd" d="M12 15.5a.75.75 0 01-.53-.22l-5-5a.75.75 0 111.06-1.06L12 13.69l4.47-4.47a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-.53.22z" clipRule="evenodd" />
                      </svg>
                    </span>
                </span>
              </div>
              {openDropdown === "stage" && (
                isMobileDropdown ? (
                  <DropdownPortal dropdownKey={"stage"}>
                    <div className="bg-[#00A0CC] text-white rounded-b-xl shadow-lg overflow-hidden">
                      <div
                        key="all"
                        className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${selectedStage === null ? "bg-white text-[#00A0CC] font-bold" : ""}`}
                        onMouseDown={e => {
                          e.stopPropagation();
                          setSelectedStage(null);
                        }}
                      >
                        <span>All Stages</span>
                        <span>
                          <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedStage === null ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
                        </span>
                      </div>
                      {sortedStages.map(stage => (
                        <div
                          key={stage.id}
                          className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${selectedStage === stage.id ? "bg-white text-[#00A0CC] font-bold" : ""}`}
                          onMouseDown={e => {
                            e.stopPropagation();
                            setSelectedStage(stage.id);
                          }}
                        >
                          <span>{stage.name}</span>
                          <span>
                            <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedStage === stage.id ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </DropdownPortal>
                ) : (
                  <div className="absolute left-0 right-0 bg-[#00A0CC] text-white rounded-b-xl shadow-lg overflow-hidden">
                    {/* Add All and when clicked reset the stage filter */}
                    <div
                      key="all"
                      className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${selectedStage === null ? "bg-white text-[#00A0CC] font-bold" : ""}`}
                      onMouseDown={e => {
                        e.stopPropagation();
                        setSelectedStage(null);
                      }}
                    >
                      <span>All Stages</span>
                      <span>
                        <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedStage === null ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
                      </span>
                    </div>
                    {sortedStages.map(stage => (
                      <div
                        key={stage.id}
                        className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${selectedStage === stage.id ? "bg-white text-[#00A0CC] font-bold" : ""}`}
                        onMouseDown={e => {
                          e.stopPropagation();
                          setSelectedStage(stage.id);
                        }}
                      >
                        <span>{stage.name}</span>
                        <span>
                          <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedStage === stage.id ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
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
                setSelectedCategory(null);
                setSelectedStage(null);
                setOpenDropdown(null);
                }}
            >
                Clear Filters
            </button>
          </div>
        </div>
        {/* Portfolio grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-20">
          {filteredItems.slice().sort((a, b) => a.title.localeCompare(b.title)).map((item, idx) => {
            const gridThumb = item.portfolioFields?.gridThumbnail?.mediaItemUrl;
            const featuredImg = item.featuredImage?.node?.mediaItemUrl;
            const bgImage = gridThumb || featuredImg || '';
            return (
              <Link
                key={idx}
                href={`/portfolio/${item.slug}`}
                className="block group portfolio-item opacity-0 translate-y-10"
                prefetch={false}
              >
                <div
                  className="relative bg-white rounded-2xl shadow flex flex-col gap-2 overflow-hidden min-h-[330px] h-full transition-transform duration-200 group-hover:-translate-y-1"
                  style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                  {/* Overlay */}
                  {bgImage && <div className="absolute inset-0 bg-black/40 z-0" />}
                  {/* Card content */}
                  <div className="relative z-10 p-6 flex flex-col h-full justify-end text-white">
                    {item.portfolioFields?.logo?.mediaItemUrl ? (
                      <img
                        src={item.portfolioFields.logoThumbnail?.mediaItemUrl || item.portfolioFields.logo.mediaItemUrl}
                        alt={item.portfolioFields.logo.altText || item.title?.replace(/<[^>]+>/g, '') || 'Logo'}
                        className="mb-4 absolute top-4 left-3 w-2/3 object-contain"
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-white drop-shadow mb-2" dangerouslySetInnerHTML={{ __html: item.title }} />
                    )}
                    {item.portfolioFields?.portfolioTitle && (
                      <div className="text-base xl:text-2xl font-medium" dangerouslySetInnerHTML={{ __html: item.portfolioFields.portfolioTitle }} />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </>
  );
} 