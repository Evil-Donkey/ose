'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const GSAPLayout = ({ children }) => {
    const pathname = usePathname();

    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        return () => clearTimeout(timer);
    }, [pathname]);

    return children;
};

export default GSAPLayout; 