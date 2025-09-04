"use client";

import { useEffect } from 'react';

const AsyncCSSLoader = () => {
  useEffect(() => {
    // Load non-critical CSS asynchronously
    const loadCSS = (href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = function() {
        this.media = 'all';
      };
      document.head.appendChild(link);
    };

    // Load additional CSS files after initial render
    const timer = setTimeout(() => {
      // Load any additional CSS files here if needed
      // loadCSS('/path/to/non-critical.css');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default AsyncCSSLoader;
