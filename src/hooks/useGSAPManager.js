'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsapManager from '@/lib/gsapManager';

const useGSAPManager = (animationFunction) => {
    const pathname = usePathname();

    useEffect(() => {
        // Kill all existing triggers when the path changes
        gsapManager.killAll();
        
        // Run the animation function
        animationFunction();

        // Refresh after a small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            gsapManager.refresh();
        }, 100);

        return () => {
            clearTimeout(timer);
            gsapManager.killAll();
        };
    }, [pathname, animationFunction]);
};

export default useGSAPManager; 