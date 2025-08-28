import Container from '../../Container';
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import formatSectionLabel from '@/lib/formatSectionLabel';

const FullWidthLargeHeading = ({ data }) => {
    const { copy, sectionLabel } = data;

    const copyRef = useRef(null);

    useEffect(() => {
        gsap.to(copyRef.current, {
            x: 0,
            opacity: 1,
            duration: 2,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
                trigger: copyRef.current,
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
        <div id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined}>
            <Container className="py-20 2xl:py-40">
                {copy && (
                    <div className="flex flex-col items-center text-center">
                        <h3 ref={copyRef} className="w-full lg:w-3/5 text-darkblue text-3xl/10 xl:text-4xl/13 font-medium opacity-0 translate-x-full">{copy}</h3>
                    </div>
                )}
            </Container>
        </div>
    )
}

export default FullWidthLargeHeading;