import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useGSAPAnimation = (animationFunction, dependencies = []) => {
    const context = useRef(null);

    useEffect(() => {
        // Create a new context for this component
        context.current = gsap.context(() => {
            // Run the animation function
            animationFunction();
        });

        // Cleanup function
        return () => {
            if (context.current) {
                // Kill all ScrollTriggers in this context
                ScrollTrigger.getAll().forEach(trigger => {
                    if (trigger.vars.id && trigger.vars.id.startsWith('gsap-context')) {
                        trigger.kill();
                    }
                });
                // Revert all animations in this context
                context.current.revert();
            }
        };
    }, dependencies);

    // Function to refresh ScrollTrigger
    const refreshScrollTrigger = () => {
        ScrollTrigger.refresh();
    };

    return { refreshScrollTrigger };
};

export default useGSAPAnimation; 