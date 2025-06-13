'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

const useScrollTrigger = (animationFunction) => {
    const pathname = usePathname();

    useEffect(() => {
        // Kill all existing ScrollTrigger instances
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        
        // Run the animation function
        animationFunction();

        // Refresh ScrollTrigger after a small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        return () => {
            clearTimeout(timer);
            // Clean up ScrollTrigger instances on unmount
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [pathname, animationFunction]);
};

export default useScrollTrigger; 