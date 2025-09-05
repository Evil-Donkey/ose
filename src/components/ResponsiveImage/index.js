"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * ResponsiveImage Component
 * 
 * A wrapper around Next.js Image component that provides:
 * - Responsive sizing based on container and viewport
 * - Proper aspect ratio handling
 * - Loading states and error handling
 * - Priority loading for above-the-fold images
 * - Automatic WebP/AVIF format optimization
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {number} props.width - Original image width
 * @param {number} props.height - Original image height
 * @param {string} props.className - CSS classes
 * @param {boolean} props.priority - Whether to prioritize loading (for above-the-fold)
 * @param {string} props.sizes - Responsive sizes string (e.g., "(max-width: 768px) 100vw, 50vw")
 * @param {string} props.quality - Image quality (1-100, default: 75)
 * @param {string} props.fill - Whether to fill container (boolean)
 * @param {string} props.objectFit - How to fit image in container
 * @param {Function} props.onLoad - Callback when image loads
 * @param {Function} props.onError - Callback when image fails to load
 */
const ResponsiveImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 75,
  fill = false,
  objectFit = "cover",
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (e) => {
    setIsLoading(false);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
  };

  // Calculate responsive sizes based on common breakpoints
  const getResponsiveSizes = (containerWidth) => {
    if (containerWidth) {
      return `(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, ${containerWidth}px`;
    }
    return sizes;
  };

  // Determine if this should be priority loaded (above the fold)
  const shouldPriority = priority || (typeof window !== 'undefined' && window.scrollY === 0);

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    priority: shouldPriority,
    quality,
    onLoad: handleLoad,
    onError: handleError,
    sizes: getResponsiveSizes(width),
    ...props
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        style={{ objectFit }}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
      style={{ objectFit }}
    />
  );
};

export default ResponsiveImage;
