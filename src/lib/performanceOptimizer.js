// Performance optimization utilities for modern browsers

// Modern browser feature detection
export const isModernBrowser = () => {
  return (
    'IntersectionObserver' in window &&
    'ResizeObserver' in window &&
    'requestIdleCallback' in window &&
    'fetch' in window &&
    'Promise' in window &&
    'Map' in window &&
    'Set' in window &&
    'Symbol' in window
  );
};

// Enhanced image optimization with modern browser features
export const optimizeImages = () => {
  // Use modern IntersectionObserver with better performance options
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      },
      {
        // Modern browsers support these performance optimizations
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

export const preloadCriticalResources = () => {
  // Preload critical resources with modern browser optimizations
  const criticalResources = [
    // Add critical resources here if needed
  ];

  // Use modern browser features for better performance
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
      });
    });
  } else {
    // Fallback for older browsers
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'style';
      document.head.appendChild(link);
    });
  }
};

export const optimizeFonts = () => {
  // Optimize font loading with modern browser features
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });
  }
};

// Modern browser performance monitoring
export const initPerformanceMonitoring = () => {
  if ('PerformanceObserver' in window && isModernBrowser()) {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', entry.value);
        }
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }
};

export const initPerformanceOptimizations = () => {
  // Only run optimizations for modern browsers
  if (isModernBrowser()) {
    optimizeImages();
    preloadCriticalResources();
    optimizeFonts();
    initPerformanceMonitoring();
  } else {
    // Fallback for older browsers
    optimizeImages();
    preloadCriticalResources();
    optimizeFonts();
  }
};
