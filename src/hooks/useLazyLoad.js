"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useLazyLoad = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent duplicate triggers
    if (ScrollTrigger.getById("lazy-load")) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          // Find all lazy items within the target section
          const sectionLazyItems = targetElement.querySelectorAll('.lazy__item');
          if (sectionLazyItems.length > 0) {
            gsap.fromTo(
              sectionLazyItems,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: { each: 0.2 },
                overwrite: true,
              }
            );
          }
        }
      }
    };

    // Handle initial hash if present
    handleHashChange();

    // Set up scroll trigger for lazy loading
    ScrollTrigger.batch(".lazy__item", {
      id: "lazy-load",
      start: "top 80%",
      onEnter: batch => {
        // Skip elements that are already visible
        const unloadedElements = Array.from(batch).filter(
          el => getComputedStyle(el).opacity === "0"
        );
        
        if (unloadedElements.length > 0) {
          gsap.fromTo(
            unloadedElements,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: { each: 0.2 },
              overwrite: true,
            }
          );
        }
      },
      once: true,
    });

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.id === "lazy-load") trigger.kill();
      });
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
};

export default useLazyLoad;
