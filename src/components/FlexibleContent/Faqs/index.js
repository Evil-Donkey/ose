"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";

gsap.registerPlugin(ScrollTrigger);

const Faqs = ({ data }) => {
    const titleRef = useRef([]);
    const copyRef = useRef([]);

    const { title, copy, faqs } = data;

    // Accordion state
    const [openIndex, setOpenIndex] = useState(null);

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
            stagger: 0.1,
            scrollTrigger: {
                trigger: copyRef.current,
                start: 'top 90%',
                end: 'top 75%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        });

        // return () => {
        //     ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        // };
    }, []);

    return (
        <div className="relative min-h-[100vh] h-full w-full overflow-hidden">
            <Container className="py-20 2xl:pb-40">
                <div className="flex flex-col items-center text-center">
                    {title && <h2 ref={titleRef} className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{title}</h2>}
                    {copy && <div ref={el => copyRef.current[0] = el} className="w-full md:w-2/3 text-center text-blue-02 opacity-0 translate-y-20">
                        <div className="text-base md:text-xl flex flex-col gap-4" dangerouslySetInnerHTML={{ __html: copy }} />
                    </div>}
                </div>
                <div className="flex flex-col gap-7 mt-12">
                    {faqs && faqs.length > 0 && faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={`rounded-2xl opacity-0 translate-y-20 ${isOpen ? 'bg-blue-02 text-white' : 'bg-darkblue text-white'} shadow`}
                                ref={el => copyRef.current[idx + 1] = el}
                            >
                                <button
                                    className="w-full flex items-center justify-between px-7 py-6 cursor-pointer focus:outline-none text-left text-xl md:text-2xl font-medium"
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{faq.question}</span>
                                    <span
                                        className={`transform transition-transform duration-300 ml-4 ${isOpen ? 'rotate-180' : ''}`}
                                        aria-hidden="true"
                                    >
                                        {/* Chevron Down SVG */}
                                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 16L20 24L28 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 px-7 ${isOpen ? 'max-h-250 pt-4 pb-8' : 'max-h-0 py-0'}`}
                                    style={{}}
                                >
                                    {isOpen && (
                                        <div className="text-base md:text-lg font-normal leading-relaxed">
                                            <div className="flex flex-col gap-4" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </div>
    );
};

export default Faqs;