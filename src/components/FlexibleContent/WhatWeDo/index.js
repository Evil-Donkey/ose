import Container from '../../Container';
import Stats from "../../Stats";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import formatSectionLabel from '@/lib/formatSectionLabel';

const WhatWeDo = ({ data }) => {
    const { stats, investorsHeading, investorsDesktopImage, investorsMobileImage, sectionLabel } = data;

    const titleRef = useRef(null);
    const imageRef = useRef([]);

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
        gsap.to(imageRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: imageRef.current,
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
        <div id={formatSectionLabel(sectionLabel)} className="text-white bg-cover bg-center bg-[url('/mobile-gradient.jpg')] lg:bg-[url('/desktop-gradient.jpg')]">
            <Container className="py-20 lg:py-40">
                <div className="flex flex-col">
                    {stats && <Stats data={stats} theme="dark" />}
                </div>
                {investorsHeading && (
                    <div className="flex flex-col items-center text-center mt-30">
                        <h3 ref={titleRef} className="w-full lg:w-2/5 uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium opacity-0 translate-x-full">{investorsHeading}</h3>
                    </div>
                )}
                {investorsDesktopImage && (
                    <Image ref={el => imageRef.current[0] = el} src={investorsDesktopImage.mediaItemUrl} alt={investorsDesktopImage.altText} width={investorsDesktopImage.mediaDetails.width} height={investorsDesktopImage.mediaDetails.height} className={`w-full h-full opacity-0 translate-y-20 ${investorsMobileImage ? "hidden lg:block" : ""}`} />
                )}
                {investorsMobileImage && (
                    <Image ref={el => imageRef.current[1] = el} src={investorsMobileImage.mediaItemUrl} alt={investorsMobileImage.altText} width={investorsMobileImage.mediaDetails.width} height={investorsMobileImage.mediaDetails.height} className="w-full h-full opacity-0 translate-y-20 lg:hidden" />
                )}
            </Container>
        </div>
    )
}

export default WhatWeDo;