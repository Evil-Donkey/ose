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
            end: `+=${(panels.length - 1) * 100}%`,
            pin: true,
            pinSpacing: true
        });

        // Set initial opacity for all panels except first
        panels.forEach((_, index) => {
            if (index > 0) {
                gsap.set(bgRef.current[index], { autoAlpha: 0, scale: 1.2 });
                gsap.set(panelHeadingRef.current[index], { autoAlpha: 0, x: -100 });
                gsap.set(panelCopyRef.current[index], { autoAlpha: 0, x: 100 });
            }
        });

        // Create scroll-triggered animations for each panel
        panels.forEach((_, index) => {
            if (index < panels.length - 1) {
                const nextIndex = index + 1;
                const start = `${(index + 0.5) * 100}%`;
                const end = `${(index + 1.5) * 100}%`;

                // Current panel exit animations
                const tl = gsap.timeline({
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
                    x: -100,
                    autoAlpha: 0,
                    duration: 1,
                    ease: "power2.out"
                })
                .to(panelCopyRef.current[index], {
                    x: 100,
                    autoAlpha: 0,
                    duration: 1,
                    ease: "power2.out"
                }, "<")
                // Animate next panel in
                .to(panelHeadingRef.current[nextIndex], {
                    x: 0,
                    autoAlpha: 1,
                    duration: 1,
                    ease: "power2.out"
                }, "<")
                .to(panelCopyRef.current[nextIndex], {
                    x: 0,
                    autoAlpha: 1,
                    duration: 1,
                    ease: "power2.out"
                }, "<")
                .to(bgRef.current[nextIndex], {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 2,
                    ease: "power4.out"
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
                                        <h3 ref={el => panelHeadingRef.current[index] = el} className="text-4xl md:text-8xl/27 w-full md:w-2/5">{panel.heading}</h3>
                                        <div ref={el => panelCopyRef.current[index] = el} className="w-full md:w-2/5 text-2xl md:text-4xl">
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