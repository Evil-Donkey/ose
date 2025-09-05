"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Container from "@/components/Container";
import Link from "next/link";
import Image from "next/image";
import ResponsiveImage from "../../components/ResponsiveImage";
import Button from "@/components/Button";
import { getOptimizedImageProps } from "../../lib/imageUtils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StoriesClient({ types, stories, onStoriesUpdate }) {
  const [selectedType, setSelectedType] = useState(null);
  const storyRefs = useRef([]);

  const sortedTypes = useMemo(() => {
    return [...types].sort((a, b) => (a.customOrder ?? 0) - (b.customOrder ?? 0));
  }, [types]);

  const [randomizedStories, setRandomizedStories] = useState([]);

  const filteredStories = useMemo(() => {
    const filtered = !selectedType ? stories : stories.filter(story => 
      story.storiesTypes?.nodes?.some(type => type.id === selectedType)
    );
    return filtered;
  }, [stories, selectedType]);

  // Randomize stories on client side only
  useEffect(() => {
    const shuffled = [...filteredStories].sort(() => Math.random() - 0.5);
    setRandomizedStories(shuffled);
  }, [filteredStories]);

  // Notify parent component when stories update
  useEffect(() => {
    if (onStoriesUpdate) {
      onStoriesUpdate(randomizedStories);
    }
  }, [randomizedStories, onStoriesUpdate]);

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
    }, [randomizedStories]);

    useEffect(() => {
        const storiesItems = document.querySelectorAll(".stories-item");
        storiesItems.forEach(item => {
            gsap.to(item, { opacity: 1, y: 0, duration: .5, stagger: 0.1, scrollTrigger: { trigger: item, start: "top bottom", scrub: false } });
        });
        ScrollTrigger.refresh();
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [filteredStories, selectedType]);

  return (
    <div className="bg-linear-to-t from-black/10 to-black/0 pb-20">
        <Container>
            <div className="w-full flex justify-between mb-3">
                <h3 className="text-sm font-bold uppercase text-blue-02">Filter by type:</h3>
                <button
                    className="text-sm font-bold uppercase text-blue-02/50 cursor-pointer transition-all duration-300 hover:text-darkblue"
                    onClick={() => {
                        setSelectedType(null);
                    }}
                >
                    Show all
                </button>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-4 mb-15 justify-between text-left relative z-10">
                {sortedTypes.map((type, index) => (
                    <div
                    key={type.id}
                    className="flex-1 relative group"
                    >
                        <div
                        className={`bg-lightblue rounded-xl p-4 text-white font-bold text-xl cursor-pointer select-none flex items-center justify-between whitespace-nowrap hover:opacity-100 hover:rounded-b-none ${selectedType !== type.id ? "opacity-80" : "opacity-100"}`}
                        onClick={() => {
                            setSelectedType(type.id);
                        }}
                        >
                            <span>{type.name}</span>
                            <span>
                                <span className={`ml-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${selectedType === type.id ? "bg-white" : ""}`}></span>
                            </span>
                        </div>
                        <div className="absolute left-0 right-0 bg-lightblue text-white rounded-b-xl shadow-lg overflow-hidden hidden group-hover:block">
                            <div className="flex items-center justify-between py-2 px-4 cursor-pointer font-normal text-lg">
                                <span>{type.description}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stories Grid */}
            <div className="space-y-8 mb-20">
                {randomizedStories.length > 0 && (
                    <>
                        {/* First item - full width */}
                        <div className="group opacity-0 translate-y-20 stories-item" ref={el => storyRefs.current[0] = el}>
                            {/* <Link href={`/stories/${randomizedStories[0].slug}`} className="block"> */}
                                <div className="relative overflow-hidden rounded-3xl min-h-[500px] lg:min-h-[700px] p-8 flex items-end">
                                    {randomizedStories[0].featuredImage?.node?.mediaItemUrl ? (
                                        <>
                                            <ResponsiveImage 
                                                {...getOptimizedImageProps(randomizedStories[0].featuredImage.node, {
                                                    context: 'hero',
                                                    isAboveFold: true,
                                                    isHero: true,
                                                    index: 0,
                                                    className: "absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
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
                                                <p className="text-white text-lg 2xl:text-xl leading-relaxed mb-6 font-medium lg:pe-10">
                                                    {randomizedStories[0].content ? randomizedStories[0].content.replace(/<[^>]*>/g, '').split(' ').slice(0, 20).join(' ') + '...' : ''}
                                                </p>
                                                <Link href={`/stories/${randomizedStories[0].slug}`} className="block">
                                                    <Button className="w-full">
                                                        READ MORE
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/* </Link> */}

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
                        </div>

                        {/* Remaining items - 2-column grid */}
                        {randomizedStories.length > 1 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {randomizedStories.slice(1).map((story, index) => {
                                    const { title, content, featuredImage, slug } = story;
                                    const excerpt = content ? content.replace(/<[^>]*>/g, '').split(' ').slice(0, 20).join(' ') + '...' : '';
                                    
                                    return (
                                        <div key={index + 1} className="group opacity-0 translate-y-20 stories-item" ref={el => storyRefs.current[index + 1] = el}>
                                            <Link href={`/stories/${slug}`} className="block">
                                                <div className="relative overflow-hidden rounded-3xl min-h-[500px] p-8 flex items-end">
                                                    {featuredImage?.node?.mediaItemUrl ? (
                                                        <>
                                                            <Image src={featuredImage.node.mediaItemUrl} alt={featuredImage.node.altText} width={1000} height={1000} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-300" loading="lazy" />
                                                            <div className="absolute top-0 left-0 w-full h-full bg-black/50" />
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-400">No image</span>
                                                        </div>
                                                    )}
                                                    <div className="relative z-10 flex flex-col justify-end h-full">
                                                        <div>
                                                            {title && <h3 className="text-3xl md:text-5xl/13 2xl:text-6xl text-white">{title}</h3>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            
                                            {/* Content section */}
                                            <div className="p-6">
                                                <p className="text-blue-02 text-lg 2xl:text-xl leading-relaxed mb-6 font-medium">
                                                    {excerpt}
                                                </p>
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
                    </>
                )}
            </div>
        </Container>
    </div>
  );
}