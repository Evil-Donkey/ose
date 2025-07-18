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

  // Filter members by selected category and sort by date (least recent to most recent)
  const filteredMembers = members
    .filter(member =>
      member.teamCategories.nodes.some(cat => cat.slug === selectedCategory)
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) return <Container id={componentId}><div>Loading…</div></Container>;
  if (error) return <Container id={componentId}><div>{error}</div></Container>;

  return (
    <div id={componentId} className="bg-linear-to-t from-black/10 to-black/0">
        <Container className="py-20 2xl:py-40">
            <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="md:w-1/4">
                <div className="mb-4 font-medium text-blue-02 uppercase tracking-widest text-sm">
                Filter by team:
                </div>
                <ul className="space-y-1 text-lg">
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

            {/* Grid */}
            <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMembers.map((member, idx) => (
                <div
                    key={member.id || idx}
                    className="flex flex-col"
                >
                    <Link href={member.uri} className="group overflow-hidden rounded-2xl mb-4 ">
                        <div 
                            className="w-full aspect-4/5 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                            style={{ backgroundImage: `url(${member.featuredImage?.node?.mediaItemUrl})` }}
                        />
                    </Link>
                    <Link href={member.uri} className="flex flex-col">
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
        </Container>
    </div>
  );
};

export default Team;
