"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogoDark } from "@/components/Icons/Logo";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const InfographicMap = ({ data }) => {
    const titleRef = useRef([]);
    const copyRef = useRef(null);
    const infographicRef = useRef(null);
    const circlesRef = useRef([]);
    const lineRef = useRef([]);
    const bottomTextRef = useRef([]);
    const ecosystemRef = useRef(null);

    const { title, copy } = data;

    const timelineData = [
        // { period: "1959 - 1999", count: 22, size: 85 },
        { period: "2000-2004", count: 32, size: 120 },
        // { period: "2005-2009", count: 23, size: 90 },
        { period: "2005-2014", count: 51, size: 160 },
        { period: "2015-2019", count: 82 },
        { period: "2020-2024", count: "100+" },
    ];

    useEffect(() => {

        const titleTl = gsap.timeline();
        titleTl.to(titleRef.current, {
            x: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: titleRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        })
        .to(copyRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: copyRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: infographicRef.current,
                start: "top 70%",
                end: "bottom 70%",
                toggleActions: "play none none reverse"
            }
        });

        // Animate circles one by one
        circlesRef.current.forEach((circle, index) => {
            tl.fromTo(circle, 
                { scale: 0, opacity: 0 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    duration: 0.5,
                    ease: "back.out(1.7)"
                },
                index * 0.2
            );
        });

        // Animate the line
        tl.fromTo(lineRef.current,
            { scaleY: 0, transformOrigin: "top" },
            { 
                scaleY: 1, 
                duration: 1,
                ease: "power2.out"
            }
        );

        // Animate bottom text
        tl.fromTo(bottomTextRef.current,
            { y: 50, opacity: 0 },
            { 
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.1
            }
        );

        // let mm = gsap.matchMedia();

        // mm.add("(max-width: 1023px)", () => {
        //     const infographicWidth = infographicRef.current.offsetWidth;
        //     const containerWidth = ecosystemRef.current.offsetWidth;
        //     const translationDistance = infographicWidth - containerWidth - 100;
            
        //     const ecosystemTl = gsap.timeline({
        //         scrollTrigger: {
        //             trigger: ecosystemRef.current,
        //             start: "bottom bottom",
        //             end: `+=${translationDistance}px`,
        //             pin: true,
        //             pinSpacing: true,
        //             scrub: 1.5,
        //             invalidateOnRefresh: true,
        //         }
        //     });
        //     ecosystemTl.to(infographicRef.current, {
        //         x: translationDistance,
        //         ease: "power2.out",
        //         duration: 1,
        //     });
        // });
        
        

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div ref={ecosystemRef} className="bg-linear-to-t from-black/10 to-black/0">
            <Container className="py-20 2xl:pb-40">
                <div className="flex flex-col items-center text-center">
                    {title && <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h2>}
                    {copy && <div ref={copyRef} className="w-full md:w-2/3 text-center text-blue-02 opacity-0 translate-y-20">
                        <div className="text-base md:text-xl flex flex-col gap-4" dangerouslySetInnerHTML={{ __html: copy }} />
                    </div>}
                </div>
                <div className="flex flex-col my-10 lg:my-30">
                    {/* <div className="w-full md:w-1/4" ref={bottomTextRef}>
                        <p className="text-blue-02 text-sm"><span className="font-bold">Spinout companies formed</span><br/>
                        The graphic below highlights the rapid expansion of Oxford&apos;s spinout ecosystem, underscoring OSE&apos;s impact in bridging research and real-world application. Click on the diagram to see the companies formed.</p>
                    </div> */}
                    <div ref={infographicRef} className="relative w-full flex flex-col lg:flex-row gap-55 lg:gap-0 lg:flex-nowrap items-center justify-center -space-x-2 xl:scale-110 2xl:scale-130 mt-15 lg:mt-0">
                        {/* Early years circles */}
                        <div className="relative flex items-center -space-x-2">
                            {timelineData.slice(0, 2).map((item, index) => (
                                <div key={item.period} className="relative" ref={el => circlesRef.current[index] = el}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-full text-center text-xs text-blue-02">{item.period}</div>
                                    <div
                                        className="relative flex items-center justify-center rounded-full bg-lightblue/50"
                                        style={{ width: `${item.size}px`, height: `${item.size}px` }}
                                    >
                                        <div className="text-4xl text-darkblue">{item.count}</div>
                                    </div>
                                </div>
                            ))}

                            {/* Vertical line */}
                            <div 
                                ref={el => lineRef.current[0] = el}
                                className="absolute left-0 top-[100px] w-[2px] h-[200px] bg-[#B8DDE0]"
                            >
                                <div className="absolute left-0 bottom-0 w-[500px] ps-2" ref={el => bottomTextRef.current[0] = el}>
                                    <h3 className="font-bold text-xs text-blue-02">Before OSE was established</h3>
                                    {/* <p className="text-blue-02 text-xs">105 Oxford companies founded over 55 years</p> */}
                                </div>
                            </div>

                            <div 
                                ref={el => lineRef.current[1] = el}
                                className="hidden lg:block absolute right-1 top-[100px] w-[2px] h-[200px] bg-[#B8DDE0]"
                            >
                                <div className="absolute left-0 bottom-0 w-[500px] ps-2" ref={el => bottomTextRef.current[1] = el}>
                                    <div className="w-30 h-auto mb-2">
                                        <LogoDark />
                                    </div>
                                    <h3 className="font-bold text-xs text-blue-02">After OSE was established</h3>
                                    {/* <p className="text-blue-02 text-xs">180+ Oxford companies founded over 15 years</p> */}
                                </div>
                            </div>
                        </div>

                        {/* Later years circles */}
                        <div className="flex flex-col lg:flex-row gap-55 lg:gap-0 justify-start items-center -space-x-2 relative">
                            {timelineData.slice(2).map((item, index) => (
                                <div key={item.period} className="relative" ref={el => circlesRef.current[index + 2] = el}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-full text-center text-xs text-blue-900">{item.period}</div>
                                    <div
                                        className={`relative flex flex-col items-center justify-center ${index === 1 ? 'w-[280px] h-[280px]' : 'w-[240px] h-[240px]'} rounded-full bg-linear-to-r from-[#003EA6]/90 to-[#000050] text-lightblue`}
                                    >
                                        <div className={`${index === 1 ? 'text-8xl' : 'text-8xl'}`}>{item.count}</div>
                                        {item.count === "100+" && (
                                            <div className="text-3xl -mt-1">Companies</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div 
                                ref={el => lineRef.current[2] = el}
                                className="lg:hidden absolute left-5 top-[150px] w-[2px] h-[200px] bg-[#B8DDE0]"
                            >
                                <div className="absolute left-0 bottom-0 w-[500px] ps-2" ref={el => bottomTextRef.current[2] = el}>
                                    <div className="w-30 h-auto mb-2">
                                        <LogoDark />
                                    </div>
                                    <h3 className="font-bold text-xs text-blue-02">After OSE was established</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default InfographicMap;