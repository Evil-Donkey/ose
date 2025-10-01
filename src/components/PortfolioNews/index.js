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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 12 items per page
  const dropdownRef = useRef(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
    setCurrentPage(1); // Reset to first page when filtering
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

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [portfolioNewsItems]);

  // Filter news items based on selected category
  const filteredNewsItems = selectedCategory 
    ? portfolioNewsItems.filter(item => 
        item.portfolioNewsCategories?.nodes?.some(cat => cat.slug === selectedCategory)
      )
    : portfolioNewsItems;

  // Calculate pagination
  const totalItems = filteredNewsItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredNewsItems.slice(startIndex, endIndex);

  // Ensure current page is valid
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Get category name for display
  const getCategoryName = (item) => {
    return item.portfolioNewsCategories?.nodes?.[0]?.name || 'Portfolio News';
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of the grid
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    const newTotalPages = Math.ceil(totalItems / newItemsPerPage);
    const newCurrentPage = Math.min(currentPage, newTotalPages);
    setCurrentPage(newCurrentPage);
  };

  // Error handling for missing data
  if (!portfolioNewsItems || !Array.isArray(portfolioNewsItems)) {
    return (
      <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white pt-16 relative min-h-screen">
        <Container className="py-40 2xl:pt-50 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl mb-4">Portfolio News</h1>
            <p className="text-lg">Unable to load portfolio news at this time. Please try again later.</p>
          </div>
        </Container>
      </div>
    );
  }

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
                    >Show All</button>
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
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
        </div>

        {/* Results Count */}
        {/* <div className="mb-8 text-white">
          <p className="text-lg">
            Showing {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, totalItems)} of {totalItems} news items
            {selectedCategory && ` in ${portfolioNewsCategories.find(cat => cat.slug === selectedCategory)?.name}`}
          </p>
        </div> */}

        {/* Grid Section - Current Page Items */}
        {currentItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentItems.map((item, index) => {
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
                      <span className="inline-block bg-lightblue-02 text-blue-02 px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                        {getCategoryName(item)}
                      </span>

                      {/* Date */}
                      <p className={`text-sm font-medium mt-3 ${bgColor === 'bg-white' ? 'text-blue-02' : 'text-white'}`}>
                        {formatDate(item.date)}
                      </p>

                      {/* Title */}
                      <h1 className={`${bgColor === 'bg-white' ? 'text-2xl 2xl:text-3xl' : 'text-xl'} leading-tight overflow-hidden ${bgColor === 'bg-white' ? 'text-blue-02' : 'text-white'}`}>
                        {item.title}
                      </h1>

                      {item.portfolioNews.hashtag && (
                        <span className={`${bgColor === 'bg-white' ? 'text-blue-02' : 'text-white'} text-sm font-medium tracking-wide mt-5 block`}>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 1
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current page
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 w-10 h-10 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        page === currentPage
                          ? 'bg-lightblue text-white'
                          : 'bg-white text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2 py-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentPage === totalPages
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
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