'use client';

import { useState, useEffect } from 'react';
import getTeamMembers from '@/lib/getTeamMembers';
import Container from '../../Container';
import Link from 'next/link';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTeamMembers();
        setMembers(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading team members.');
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
    });

  // Filter members by selected category
  const filteredMembers =
    selectedCategory === 'all'
      ? members
      : members.filter(member =>
          member.teamCategories.nodes.some(cat => cat.slug === selectedCategory)
        );

  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-linear-to-t from-black/10 to-black/0">
        <Container className="py-20 2xl:py-40">
            <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="md:w-1/4">
                <div className="mb-4 font-medium text-blue-02 uppercase tracking-widest text-sm">
                Filter by team:
                </div>
                <ul className="space-y-1 text-lg">
                    <li>
                        <button
                        className={`block text-left cursor-pointer ${
                            selectedCategory === 'all'
                            ? 'text-lightblue font-semibold'
                            : 'text-blue-02 hover:text-darkblue'
                        }`}
                        onClick={() => setSelectedCategory('all')}
                        >
                        All
                        </button>
                    </li>
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
