"use client";

import { useEffect, useRef } from "react";
import CountUp from 'react-countup';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Stats = ({ data, theme }) => {
    const { title, stats } = data;
    const statRef = useRef([]);
    const titleRef = useRef(null);
    const textColor = theme === 'dark' ? 'text-white' : 'text-blue-02';

    useEffect(() => {
        gsap.to(titleRef.current, {
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
        gsap.to(statRef.current, {
            x: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: statRef.current,
                start: 'top 90%',
                scrub: 1.5,
                invalidateOnRefresh: true
            },
        })
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="flex flex-col">
            {title && <h3 ref={titleRef} className={`uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full ${textColor}`}>{title}</h3>}
            {stats && 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                    {stats.map((stat, index) => {
                        const { description, postStat, preStat, statValue } = stat;
                        let decimals = 0;

                        // check if the statValue is a decimal
                        if (statValue.toString().includes('.')) {
                            decimals = 1;
                        }
                        
                        return (
                            <div key={index} ref={el => statRef.current[index] = el} className="flex flex-col text-center items-center opacity-0 -translate-x-full">
                                <div className="flex flex-nowrap">
                                    {preStat && <h4 className="text-8xl lg:text-[7rem] 2xl:text-9xl text-lightblue">{preStat}</h4>}
                                    {statValue && <h4 className="text-8xl lg:text-[7rem] 2xl:text-9xl text-lightblue"><CountUp end={statValue} enableScrollSpy scrollSpyOnce={true} scrollSpyDelay={500} decimals={decimals} /></h4>}
                                    {postStat && <h4 className="text-8xl lg:text-[7rem] 2xl:text-9xl text-lightblue">{postStat}</h4>}
                                </div>
                                <div className={`text-base 2xl:text-lg ${textColor}`} dangerouslySetInnerHTML={{ __html: description }} />
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

export default Stats;