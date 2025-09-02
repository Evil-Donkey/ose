"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import { formatDate } from "@/lib/formatDate";

const News = ({ newsItems, newsCategories }) => {
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
    ? newsItems.filter(item => 
        item.categories?.nodes?.some(cat => cat.slug === selectedCategory)
      )
    : newsItems;

  // Get the first item for hero section
  const heroItem = filteredNewsItems[0];
  const gridItems = filteredNewsItems.slice(1);

  // Get category name for display
  const getCategoryName = (item) => {
    return item.categories?.nodes?.[0]?.name || 'News';
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
            <label className="text-white mr-4 font-medium">Filter by Type:</label>
            <div className="relative">
                <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 flex items-center justify-between min-w-[200px] hover:bg-gray-50 transition-colors"
                >
                <span className="text-sm">
                    {selectedCategory === null 
                    ? 'Show All' 
                    : newsCategories.find(cat => cat.slug === selectedCategory)?.name || 'Show All'
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
                    {newsCategories
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

        {/* Hero Section - First News Item */}
        {heroItem && (
          <div className="mb-16">
            <Link href={heroItem.news?.externalUrl || `/news/${heroItem.slug}`} className="block group" target={heroItem.news?.externalUrl ? "_blank" : "_self"}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                {/* Image Section */}
                <div className="relative h-80 lg:h-full min-h-[470px] rounded-xl overflow-hidden">
                  {heroItem.news?.thumbnailImage?.mediaItemUrl || heroItem.featuredImage?.node?.mediaItemUrl ? (
                    <Image
                      src={heroItem.news?.thumbnailImage?.mediaItemUrl || heroItem.featuredImage.node.mediaItemUrl}
                      alt={heroItem.news?.thumbnailImage?.altText || heroItem.featuredImage.node.altText || heroItem.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="lg:px-12 flex flex-col">
                  <div className="space-y-4">
                    {/* Category Tag */}
                    <span className="inline-block bg-lightblue-02 text-blue-02 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                      {getCategoryName(heroItem)}
                    </span>

                    {/* Date */}
                    <p className="text-white text-sm font-medium">
                      {formatDate(heroItem.date)}
                    </p>

                    {/* Title */}
                    <h1 className="text-2xl lg:text-3xl xl:text-4xl leading-tight">
                      {heroItem.title}
                    </h1>

                    {/* Short Description */}
                    {heroItem.news?.shortDescription && (
                      <p className="text-white text-base leading-relaxed">
                        {heroItem.news.shortDescription}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Grid Section - Remaining News Items */}
        {gridItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {gridItems.map((item, index) => (
              <Link 
                key={item.databaseId || index} 
                href={item.news?.externalUrl || `/news/${item.slug}`} 
                className="block group"
                target={item.news?.externalUrl ? "_blank" : "_self"}
              >
                <div className="transition-all duration-300 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative aspect-4/5 rounded-xl overflow-hidden">
                    {item.news?.thumbnailImage?.mediaItemUrl || item.featuredImage?.node?.mediaItemUrl ? (
                      <Image
                        src={item.news?.thumbnailImage?.mediaItemUrl || item.featuredImage.node.mediaItemUrl}
                        alt={item.news?.thumbnailImage?.altText || item.featuredImage.node.altText || item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="py-4">
                    <div className="space-y-2">
                      {/* Category Tag */}
                      <span className="inline-block bg-lightblue text-blue-02 px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                        {getCategoryName(item)}
                      </span>

                      {/* Date */}
                      <p className="text-white text-xs font-medium">
                        {formatDate(item.date)}
                      </p>

                      {/* Title */}
                      <h3 className="text-white text-sm leading-tight overflow-hidden">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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

export default News;