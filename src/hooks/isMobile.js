import { useEffect, useState } from "react";

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        let timeoutId;
        
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsMobile(window.innerWidth < 768);
            }, 100); // Debounce by 100ms
        };

        // Initial check
        setIsMobile(window.innerWidth < 768);

        // Add event listener
        window.addEventListener('resize', handleResize, { passive: true });

        // Cleanup
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isMobile;
};