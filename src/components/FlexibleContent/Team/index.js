'use client';

import { useState, useEffect } from 'react';
import getTeamMembers from '@/lib/getTeamMembers';
import Container from '../../Container';
import Link from 'next/link';
import formatSectionLabel from '@/lib/formatSectionLabel';

const Team = ({ data }) => {

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const { sectionLabel } = data;
  const componentId = sectionLabel ? formatSectionLabel(sectionLabel) : undefined;
  
  // Function to parse query parameters from hash
  const parseHashParams = () => {
    if (typeof window === 'undefined') return null;
    
    const hash = window.location.hash;
    const componentId = sectionLabel ? formatSectionLabel(sectionLabel) : '';
    
    // Check if hash matches our component and contains query params
    const hashPattern = new RegExp(`#${componentId}\\?(.+)`);
    const match = hash.match(hashPattern);
    
    if (match) {
      const queryString = match[1];
      const params = new URLSearchParams(queryString);
      return {
        filter: params.get('filter')
      };
    }
    
    return null;
  };
  
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTeamMembers();
        setMembers(data);
        
        // Extract categories
        const categories = Array.from(
          new Set(
            data.flatMap(member =>
              member.teamCategories?.nodes?.map(cat => cat.slug)
            )
          )
        )
          .filter(Boolean)
          .map(slug => {
            const cat = data
              .flatMap(member => member.teamCategories?.nodes)
              .find(cat => cat.slug === slug);
            return cat;
          })
          .sort((a, b) => {
            // Sort by customOrder from lowest to highest
            const orderA = a.customOrder || 0;
            const orderB = b.customOrder || 0;
            return orderA - orderB;
          });
        
        // Check for filter parameter in hash first
        const hashParams = parseHashParams();
        let initialCategory = '';
        
        if (hashParams?.filter && categories.some(cat => cat.slug === hashParams.filter)) {
          initialCategory = hashParams.filter;
        } else if (categories.length > 0) {
          initialCategory = categories[0].slug;
        }
        
        setSelectedCategory(initialCategory);
        setLoading(false);
      } catch (err) {
        setError('Error loading team members.');
        setLoading(false);
      }
    }
    fetchData();
  }, [sectionLabel]);

  // Check for hash and scroll to component when loaded
  useEffect(() => {
    if (!loading && componentId && typeof window !== 'undefined') {
      const hash = window.location.hash;
      const baseHash = `#${componentId}`;
      
      // Check if hash starts with our component ID (with or without query params)
      if (hash.startsWith(baseHash)) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(componentId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [loading, componentId, sectionLabel]);

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

  // Extract unique categories from members
  const categories = Array.from(
    new Set(
      members.flatMap(member =>
        member.teamCategories?.nodes?.map(cat => cat.slug)
      )
    )
  )
    .filter(Boolean)
    .map(slug => {
      const cat = members
        .flatMap(member => member.teamCategories?.nodes)
        .find(cat => cat.slug === slug);
      return cat;
    })
    .sort((a, b) => {
      // Sort by customOrder from lowest to highest
      const orderA = a.customOrder || 0;
      const orderB = b.customOrder || 0;
      return orderA - orderB;
    });

  // Filter members by selected category and reverse the order (already sorted by MENU_ORDER)
  const filteredMembers = members
    .filter(member =>
      member.teamCategories.nodes.some(cat => cat.slug === selectedCategory)
    )
    .reverse();

  // Get the current selected category object to access its description
  const selectedCategoryData = categories.find(cat => cat.slug === selectedCategory);

  if (loading) return <Container id={componentId}><div className="min-h-[500px] flex items-center justify-center">Loading…</div></Container>;
  if (error) return <Container id={componentId}><div>{error}</div></Container>;

  return (
    <div id={componentId} className="bg-linear-to-t from-black/10 to-black/0">
        <Container className="pt-10 pb-20 md:py-20 2xl:py-40">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="md:w-1/4">
                <div className="mb-4 font-medium text-blue-02 uppercase tracking-widest text-sm">
                Filter by team:
                </div>
                
                {/* Mobile Dropdown */}
                <div className="md:hidden relative dropdown-container">
                    <div 
                        className={`bg-[#00A0CC] p-4 text-white font-bold text-xl cursor-pointer select-none flex items-center justify-between whitespace-nowrap ${openDropdown === 'team' ? 'rounded-t-xl' : 'rounded-xl'}`}
                        onClick={() => setOpenDropdown(openDropdown === 'team' ? null : 'team')}
                    >
                        <span>{categories.find(cat => cat.slug === selectedCategory)?.name || 'Select Team'}</span>
                        <span>
                            <span className="ml-2 -mr-2 w-9 h-5 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                                    <path fillRule="evenodd" d="M12 15.5a.75.75 0 01-.53-.22l-5-5a.75.75 0 111.06-1.06L12 13.69l4.47-4.47a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-.53.22z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </span>
                    </div>
                    {openDropdown === 'team' && (
                        <div className="absolute left-0 right-0 bg-[#00A0CC] text-white rounded-b-xl shadow-lg overflow-hidden z-10">
                            {categories.map(cat => (
                                <div
                                    key={cat.slug}
                                    className={`flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg hover:bg-blue-200 ${selectedCategory === cat.slug ? "bg-white text-[#00A0CC] font-bold" : ""}`}
                                    onClick={() => {
                                        setSelectedCategory(cat.slug);
                                        setOpenDropdown(null);
                                    }}
                                >
                                    <span>{cat.name}</span>
                                    <span>
                                        <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedCategory === cat.slug ? "bg-[#00A0CC] border-[#00A0CC]" : ""}`}></span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop List */}
                <ul className="hidden md:block space-y-1 text-lg">
                    {categories.map(cat => (
                        <li key={cat.slug}>
                        <button
                            className={`block text-left cursor-pointer ${
                            selectedCategory === cat.slug
                                ? 'text-lightblue font-semibold'
                                : 'text-blue-02 hover:text-darkblue'
                            }`}
                            onClick={() => setSelectedCategory(cat.slug)}
                        >
                            {cat.name}
                        </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main content area */}
            <div className="flex-1">
              {/* Category description */}
              {selectedCategoryData?.description && (
                <div className="mb-8">
                  <div 
                    className="text-blue-02 text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedCategoryData.description }}
                  />
                </div>
              )}

              {/* Grid */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMembers.map((member, idx) => (
                <div
                    key={member.id || idx}
                    className="flex flex-col"
                >
                    <Link href={`/who/${member.slug}`} className="group overflow-hidden rounded-2xl mb-4 ">
                        <div 
                            className="w-full aspect-4/5 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                            style={{ backgroundImage: `url(${member.featuredImage?.node?.mediaItemUrl})` }}
                        />
                    </Link>
                    <Link href={`/who/${member.slug}`} className="flex flex-col">
                        <div className="text-lg font-medium text-blue-02">
                            {member.title}
                        </div>
                        <div className="text-blue-02 text-sm">
                            {member.teamMember?.role || 'Position here'}
                        </div>
                    </Link>
                </div>
                ))}
              </section>
            </div>
          </div>
        </Container>
    </div>
  );
};

export default Team;
