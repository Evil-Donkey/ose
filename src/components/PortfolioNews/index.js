"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/Container";
import { formatDate } from "@/lib/formatDate";

const PortfolioNews = ({ portfolioNewsItems, portfolioNewsCategories }) => {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter news items based on selected category
  const filteredNewsItems = selectedCategory 
    ? portfolioNewsItems.filter(item => 
        item.portfolioNewsCategories?.nodes?.some(cat => cat.slug === selectedCategory)
      )
    : portfolioNewsItems;

  // Get category name for display
  const getCategoryName = (item) => {
    return item.portfolioNewsCategories?.nodes?.[0]?.name || 'Portfolio News';
  };

  return (
    <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white pt-16 relative min-h-screen">
      <Container className="py-40 2xl:pt-50 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-center mb-12">
            <div className="flex items-center gap-8">
              <Link href="/news" className={`text-2xl lg:text-3xl ${pathname === '/news' ? 'text-lightblue' : 'text-white'}`}>OSE News</Link>
              <Link href="/portfolio-news" className={`text-2xl lg:text-3xl ${pathname === '/portfolio-news' ? 'text-lightblue' : 'text-white'}`}>Portfolio News</Link>
            </div>
            {/* Category Filter Dropdown */}
            <div className="flex items-center" ref={dropdownRef}>
            <label className="text-white mr-4 font-medium">Filter by Sector:</label>
            <div className="relative">
                <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 flex items-center justify-between min-w-[200px] hover:bg-gray-50 transition-colors"
                >
                <span className="text-sm">
                    {selectedCategory === null 
                    ? 'Show All' 
                    : portfolioNewsCategories.find(cat => cat.slug === selectedCategory)?.name || 'Show All'
                    }
                </span>
                <svg 
                    className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                </button>
                
                {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-gray-100 border border-gray-300 rounded-md shadow-lg z-50 min-w-[200px]">
                    <button
                    onClick={() => handleCategoryClick(null)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition-colors"
                    >
                    Show All
                    </button>
                    {portfolioNewsCategories
                    .filter(category => category.slug !== 'uncategorized')
                    .map((category) => (
                        <button
                        key={category.slug}
                        onClick={() => handleCategoryClick(category.slug)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition-colors"
                        >
                        {category.name}
                        </button>
                    ))}
                </div>
                )}
            </div>
            </div>
        </div>

        {/* Grid Section - Remaining News Items */}
        {filteredNewsItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredNewsItems.map((item, index) => {
              // Calculate row and position within row
              const row = Math.floor(index / 3);
              const positionInRow = index % 3;
              const isEvenRow = row % 2 === 0;
              
              // Determine column span and background color
              let colSpan = "lg:col-span-1";
              let bgColor = "";
              
              if (isEvenRow) {
                // Even rows: first item spans 2 cols, others span 1
                if (positionInRow === 0) {
                  colSpan = "lg:col-span-2";
                  bgColor = "bg-white"; // White background
                } else if (positionInRow === 1) {
                  bgColor = "bg-blue-02"; // Dark blue background
                } else {
                  bgColor = "bg-lightblue"; // Light blue background
                }
              } else {
                // Odd rows: first two items span 1 col each, last item spans 2 cols
                if (positionInRow === 0) {
                  bgColor = "bg-blue-02"; // Dark blue background
                } else if (positionInRow === 1) {
                  bgColor = "bg-lightblue"; // Light blue background
                } else {
                  colSpan = "lg:col-span-2";
                  bgColor = "bg-white"; // White background
                }
              }
              
              return (
                <Link 
                  key={item.databaseId || index} 
                  href={item.portfolioNews.url} 
                  target="_blank" 
                  className={`block group p-5 lg:p-8 rounded-2xl ${bgColor} ${colSpan} transition-all duration-300 hover:-translate-y-1`}
                >
                  <div>
                    <div className="space-y-2">
                      {/* Category Tag */}
                      <span className="inline-block bg-lightblue text-blue-02 px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                        {getCategoryName(item)}
                      </span>

                      {/* Date */}
                      <p className={`text-xs font-medium mt-3 ${bgColor === 'bg-white' ? 'text-blue-02' : 'text-white'}`}>
                        {formatDate(item.date)}
                      </p>

                      {/* Title */}
                      <h1 className={`${bgColor === 'bg-white' ? 'text-2xl lg:text-3xl' : 'text-sm'} leading-tight overflow-hidden ${bgColor === 'bg-white' ? 'text-blue-02' : 'text-white'}`}>
                        {item.title}
                      </h1>

                      {item.portfolioNews.hashtag && (
                        <span className={`${bgColor === 'bg-white' ? 'text-blue-02' : 'text-white'} text-xs font-medium tracking-wide mt-5 block`}>
                          {item.portfolioNews.hashtag}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* No Results Message */}
        {filteredNewsItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white text-lg">
              No news items found for the selected category.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default PortfolioNews;