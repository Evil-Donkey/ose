"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const Popup = ({ isOpen, onClose, spinoutDesktopImage, spinoutMobileImage }) => {
    const popupRef = useRef(null);
    const popupBgRef = useRef(null);
    const popupContentRef = useRef(null);

    useEffect(() => {
        if (popupRef.current) {
            const popupTl = gsap.timeline({ paused: true });
            
            popupTl.fromTo(popupRef.current,
                {
                    scale: 0,
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                }
            )
            .fromTo(popupBgRef.current, {
                scale: 0,
            }, {
                scale: 100,
                duration: 2,
                ease: "power2.inOut",
            }, "<")
            .fromTo(popupContentRef.current, {
                opacity: 0,
            }, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.out",
            }, "<+=.5");

            if (isOpen) {
                popupTl.play();
            } else {
                popupTl.reverse();
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div ref={popupRef} className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen">
            <div ref={popupBgRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 bg-darkblue origin-center rounded-full"></div>
            <div ref={popupContentRef} className="opacity-0 w-full h-full z-50 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white text-4xl font-bold z-50 cursor-pointer"
                >
                    <svg width="35px" height="35px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 5L4.99998 19M5.00001 5L19 19" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <div className="h-full w-full flex flex-col items-center justify-center text-white gap-10">
                    <div className="w-full p-10 md:p-20 max-h-full">
                        {spinoutDesktopImage && <Image src={spinoutDesktopImage.mediaItemUrl} alt={spinoutDesktopImage.altText} width={spinoutDesktopImage.mediaDetails.width} height={spinoutDesktopImage.mediaDetails.height} className={spinoutMobileImage ? "hidden lg:block" : ""} />}
                        {spinoutMobileImage && <Image src={spinoutMobileImage.mediaItemUrl} alt={spinoutMobileImage.altText} width={spinoutMobileImage.mediaDetails.width} height={spinoutMobileImage.mediaDetails.height} className={spinoutDesktopImage ? "lg:hidden" : ""} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Popup; 