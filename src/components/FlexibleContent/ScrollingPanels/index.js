"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollingPanels = ({ data }) => {
    const [activePanelIndex, setActivePanelIndex] = useState(0);
    const panelsWrapperRef = useRef();
    const triggerRef = useRef();
    const bgRef = useRef([]);
    const panelTitleRef = useRef([]);
    const panelHeadingRef = useRef([]);
    const panelCopyRef = useRef([]);

    const { mainHeading, panels } = data;


    useEffect(() => {
        ScrollTrigger.create({
            trigger: panelsWrapperRef.current,
            start: "top top",
            end: `+=${(panels.length) * 100}%`,
            pin: true,
            pinSpacing: true
        });

        // Set initial opacity for all panels except first
        panels.forEach((_, index) => {
            if (index > 0) {
                gsap.set(bgRef.current[index], { xPercent: 100 });
                gsap.set(panelHeadingRef.current[index], { autoAlpha: 0, xPercent: 200 });
                gsap.set(panelCopyRef.current[index], { autoAlpha: 0, xPercent: 200 });
            }
        });

        // Create scroll-triggered animations for each panel
        panels.forEach((_, index) => {
            if (index < panels.length - 1) {
                const nextIndex = index + 1;
                const start = `${(index + 1) * 100}%`;
                const end = `${(index + 2) * 100}%`;

                // Current panel exit animations
                const tl = gsap.timeline({
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: start,
                        end: end,
                        toggleActions: "play none none reverse",
                        invalidateOnRefresh: true,
                        onEnter: () => {
                            setActivePanelIndex(index + 1);
                        },
                        onEnterBack: () => {
                            setActivePanelIndex(index);
                        },
                        onLeave: () => {
                            setActivePanelIndex(index + 1);
                        },
                        onLeaveBack: () => {
                            setActivePanelIndex(index);
                        }
                    }
                });

                // Animate current panel out
                tl.to(panelHeadingRef.current[index], {
                    xPercent: -200,
                    autoAlpha: 0,
                    duration: 1,
                    ease: "power2.out"
                })
                .to(bgRef.current[index], {
                    xPercent: -100,
                    duration: 1,
                    ease: "power2.out"
                }, "<")
                .to(panelCopyRef.current[index], {
                    xPercent: -200,
                    autoAlpha: 0,
                    duration: 1,
                    ease: "power2.out"
                }, "<")
                // Animate next panel in
                .to(panelHeadingRef.current[nextIndex], {
                    xPercent: 0,
                    autoAlpha: 1,
                    duration: 1,
                    ease: "power2.out"
                }, "<")
                .to(bgRef.current[nextIndex], {
                    // autoAlpha: 1,
                    xPercent: 0,
                    // scale: 1,
                    duration: 1,
                    ease: "power2.out"
                }, "<")
                .to(panelCopyRef.current[nextIndex], {
                    xPercent: 0,
                    autoAlpha: 1,
                    duration: 1,
                    ease: "power2.out"
                }, "<");
            }
        });
        return () => {
            // Clean up ScrollTriggers on unmount
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [panels.length]);

    return (
        <>
            {panels && 
                <div className="relative min-h-[100vh]" ref={panelsWrapperRef}>
                    <div ref={triggerRef} className="h-full">
                        {panels.map((panel, index) => (
                            <div key={index} ref={el => bgRef.current[index] = el} className="absolute w-full h-full">
                                {panel.backgroundImage &&
                                    <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${panel.backgroundImage.mediaItemUrl})` }} />
                                }
                                <div className="absolute top-0 left-0 w-full h-full bg-black/40" />
                            </div>
                        ))}
                        <div className="container mx-auto px-4 md:px-10 py-25 md:py-45 relative z-10 text-white flex flex-col h-full">
                            <div className="flex flex-col">
                                <h2 className="uppercase tracking-widest text:lg md:text-xl mb-4 text-center font-medium">{mainHeading}</h2>
                                <ul className="flex flex-nowrap justify-center gap-4">
                                    {panels.map((panel, index) => (
                                        <li key={index}>
                                            <h3 
                                                ref={el => panelTitleRef.current[index] = el} 
                                                className={`text-2xl md:text-4xl transition-all duration-500 ${index === activePanelIndex ? 'text-lightblue' : ''}`}
                                            >
                                                {panel.title}
                                            </h3>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col relative mt-20">
                                {panels.map((panel, index) => (
                                    <div key={index} className="flex justify-between absolute top-0 left-0 w-full gap-5">
                                        <h3 ref={el => panelHeadingRef.current[index] = el} className="text-4xl md:text-[7rem]/30 tracking-tight w-full md:w-2/5">{panel.heading}</h3>
                                        <div ref={el => panelCopyRef.current[index] = el} className="w-full md:w-2/5 text-2xl md:text-3xl lg:text-4xl 2xl:text-[2.5rem]/12 lg:me-12">
                                            <div dangerouslySetInnerHTML={{ __html: panel.copy }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ScrollingPanels;