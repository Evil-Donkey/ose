/**
 * Image utility functions for responsive image optimization
 */

/**
 * Determines if an image should be priority loaded based on its position and context
 * @param {Object} options - Configuration options
 * @param {boolean} options.isAboveFold - Whether the image is above the fold
 * @param {boolean} options.isHero - Whether the image is a hero image
 * @param {boolean} options.isFirstInList - Whether it's the first image in a list
 * @param {number} options.index - Index of the image in a list (0-based)
 * @returns {boolean} Whether the image should be priority loaded
 */
export const shouldPriorityLoad = ({ 
  isAboveFold = false, 
  isHero = false, 
  isFirstInList = false, 
  index = 0 
}) => {
  // Hero images and above-the-fold images should always be priority
  if (isHero || isAboveFold) return true;
  
  // First few images in lists should be priority
  if (isFirstInList && index < 3) return true;
  
  return false;
};

/**
 * Generates responsive sizes string based on container context
 * @param {Object} options - Configuration options
 * @param {string} options.context - Context: 'hero', 'card', 'gallery', 'content'
 * @param {number} options.maxWidth - Maximum width of the container
 * @returns {string} Responsive sizes string
 */
export const getResponsiveSizes = ({ context = 'content', maxWidth = 1200 }) => {
  const sizeMap = {
    hero: '100vw',
    card: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    gallery: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    content: `(max-width: 768px) 100vw, (max-width: 1200px) 80vw, ${maxWidth}px`,
    fullwidth: '100vw',
    sidebar: '(max-width: 768px) 100vw, 300px'
  };
  
  return sizeMap[context] || sizeMap.content;
};

/**
 * Determines optimal image quality based on context and size
 * @param {Object} options - Configuration options
 * @param {string} options.context - Context: 'hero', 'card', 'gallery', 'content'
 * @param {number} options.width - Image width
 * @param {number} options.height - Image height
 * @returns {number} Quality value (1-100)
 */
export const getOptimalQuality = ({ context = 'content', width = 800, height = 600 }) => {
  const baseQuality = {
    hero: 90,
    card: 80,
    gallery: 75,
    content: 80,
    thumbnail: 70
  };
  
  const quality = baseQuality[context] || 80;
  
  // Reduce quality for very large images
  if (width > 2000 || height > 2000) {
    return Math.max(quality - 10, 60);
  }
  
  return quality;
};

/**
 * Generates optimized image props for Next.js Image component
 * @param {Object} imageData - Image data from CMS
 * @param {Object} options - Configuration options
 * @returns {Object} Optimized image props
 */
export const getOptimizedImageProps = (imageData, options = {}) => {
  const {
    context = 'content',
    priority = false,
    isAboveFold = false,
    isHero = false,
    index = 0,
    maxWidth = 1200,
    className = '',
    alt = ''
  } = options;
  
  const width = imageData?.mediaDetails?.width || 800;
  const height = imageData?.mediaDetails?.height || 600;
  
  return {
    src: imageData.mediaItemUrl,
    alt: imageData.altText || alt,
    width,
    height,
    priority: priority || shouldPriorityLoad({ isAboveFold, isHero, isFirstInList: index === 0, index }),
    sizes: getResponsiveSizes({ context, maxWidth }),
    quality: getOptimalQuality({ context, width, height }),
    className
  };
};
