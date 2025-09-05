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
  placeholder = "blur",
  blurDataURL,
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

  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL = blurDataURL || `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="system-ui" font-size="14">Loading...</text>
    </svg>`
  ).toString('base64')}`;

  const imageProps = {
    src,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-all duration-300`,
    priority: shouldPriority,
    quality,
    placeholder,
    blurDataURL: defaultBlurDataURL,
    onLoad: handleLoad,
    onError: handleError,
    sizes,
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
