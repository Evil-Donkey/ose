"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "../../Container";
import Image from "next/image";
import ResponsiveImage from "../../ResponsiveImage";

gsap.registerPlugin(ScrollTrigger);

const StoryImage = ({ data }) => {
    const imageRef = useRef(null);

    const { image, fullWidth } = data;

    useEffect(() => {
        gsap.to(imageRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: imageRef.current,
                start: 'top 90%',
                scrub: false,
                invalidateOnRefresh: true,
                toggleActions: 'play none none none'
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            {(fullWidth && image) ?
                <div className="w-full relative opacity-0 translate-y-20" ref={imageRef}>
                    <ResponsiveImage 
                        src={image.mediaItemUrl} 
                        alt={image.altText} 
                        width={image.mediaDetails?.width || 1920} 
                        height={image.mediaDetails?.height || 1080} 
                        className="object-cover" 
                        sizes="100vw"
                        quality={85}
                    />
                    {image.altText && <div className="hidden lg:block absolute bottom-8 right-8 text-xs 2xl:text-sm lg:text-end mt-10 lg:mt-0 text-white" dangerouslySetInnerHTML={{ __html: image.altText }} />}
                </div>
            :
                <Container>
                    <div className="xl:px-20 opacity-0 translate-y-20" ref={imageRef}>
                        <ResponsiveImage 
                            src={image.mediaItemUrl} 
                            alt={image.altText} 
                            width={image.mediaDetails?.width || 1200} 
                            height={image.mediaDetails?.height || 800} 
                            className="object-cover rounded-3xl overflow-hidden" 
                            sizes="(max-width: 1280px) 100vw, 1200px"
                            quality={80}
                        />
                    </div>
                </Container>
            }
        </>
    )
};

export default StoryImage;
