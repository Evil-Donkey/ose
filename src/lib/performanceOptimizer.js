// Performance optimization utilities

export const optimizeImages = () => {
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

export const preloadCriticalResources = () => {
  // Preload critical resources
  const criticalResources = [
    // Add critical resources here if needed
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = 'style';
    document.head.appendChild(link);
  });
};

export const optimizeFonts = () => {
  // Optimize font loading
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });
  }
};

export const initPerformanceOptimizations = () => {
  // Initialize all performance optimizations
  optimizeImages();
  preloadCriticalResources();
  optimizeFonts();
};
