// Conditional loading utilities for heavy libraries
import { useEffect, useState } from 'react';

// Hook to detect if component is in viewport
export const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
};

// Hook to load libraries only when needed
export const useConditionalLibrary = (libraryName, condition = true) => {
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!condition) return;

    const loadLibrary = async () => {
      setLoading(true);
      try {
        let lib;
        switch (libraryName) {
          case 'gsap':
            const gsapModule = await import('gsap');
            const scrollTriggerModule = await import('gsap/ScrollTrigger');
            lib = {
              ...gsapModule,
              ScrollTrigger: scrollTriggerModule.ScrollTrigger
            };
            break;
          case 'framer-motion':
            lib = await import('framer-motion');
            break;
          case 'swiper':
            lib = await import('swiper');
            break;
          case 'lottie-react':
            lib = await import('lottie-react');
            break;
          default:
            throw new Error(`Unknown library: ${libraryName}`);
        }
        setLibrary(lib);
      } catch (err) {
        setError(err);
        console.warn(`Failed to load ${libraryName}:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, [libraryName, condition]);

  return { library, loading, error };
};

// Preload critical libraries
export const preloadLibraries = () => {
  if (typeof window !== 'undefined') {
    // Preload GSAP for animations
    import('gsap').catch(() => {});
    
    // Preload Framer Motion for interactions
    import('framer-motion').catch(() => {});
  }
};

// Lazy load components with intersection observer
export const withLazyLoading = (Component, options = {}) => {
  return function LazyLoadedComponent(props) {
    const [isVisible, setIsVisible] = useState(false);
    const [ref, setRef] = useState(null);

    useEffect(() => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1, ...options }
      );

      observer.observe(ref);

      return () => observer.disconnect();
    }, [ref]);

    return (
      <div ref={setRef}>
        {isVisible ? <Component {...props} /> : <div style={{ minHeight: '200px' }} />}
      </div>
    );
  };
};

// Conditional component loading based on user interaction
export const useInteractionBasedLoading = () => {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      // Remove listeners after first interaction
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    // Listen for user interactions
    document.addEventListener('mousemove', handleInteraction, { passive: true });
    document.addEventListener('touchstart', handleInteraction, { passive: true });
    document.addEventListener('keydown', handleInteraction, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return hasInteracted;
};
