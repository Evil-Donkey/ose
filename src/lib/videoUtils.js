/**
 * Video utility functions for optimized video handling and caching
 */

/**
 * Determines if a video should be preloaded based on its context and priority
 * @param {Object} options - Configuration options
 * @param {boolean} options.isAboveFold - Whether the video is above the fold
 * @param {boolean} options.isHero - Whether the video is a hero video
 * @param {boolean} options.isAutoplay - Whether the video autoplays
 * @param {number} options.index - Index of the video in a list (0-based)
 * @returns {boolean} Whether the video should be preloaded
 */
export const shouldPreloadVideo = ({ 
  isAboveFold = false, 
  isHero = false, 
  isAutoplay = false,
  index = 0 
}) => {
  // Hero videos and above-the-fold videos should be preloaded
  if (isHero || isAboveFold) return true;
  
  // Autoplay videos should be preloaded
  if (isAutoplay) return true;
  
  // First few videos in lists should be preloaded
  if (index < 2) return true;
  
  return false;
};

/**
 * Generates optimized video attributes for performance
 * @param {Object} videoData - Video data from CMS
 * @param {Object} options - Configuration options
 * @returns {Object} Optimized video attributes
 */
export const getOptimizedVideoProps = (videoData, options = {}) => {
  const {
    context = 'content',
    priority = false,
    isAboveFold = false,
    isHero = false,
    isAutoplay = false,
    index = 0,
    className = '',
    controls = true,
    muted = false,
    loop = false,
    playsInline = true
  } = options;
  
  const shouldPreload = priority || shouldPreloadVideo({ 
    isAboveFold, 
    isHero, 
    isAutoplay, 
    index 
  });
  
  return {
    src: videoData.mediaItemUrl,
    preload: shouldPreload ? 'metadata' : 'none',
    className,
    controls,
    muted: isAutoplay ? true : muted, // Autoplay videos must be muted
    loop,
    playsInline,
    // Add loading optimization attributes
    loading: shouldPreload ? 'eager' : 'lazy',
    // Add fetchpriority for critical videos
    ...(shouldPreload && { fetchPriority: 'high' })
  };
};

/**
 * Generates video source elements with proper MIME types
 * @param {Object} videoData - Video data from CMS
 * @param {string} type - Video MIME type (default: 'video/mp4')
 * @returns {Array} Array of source elements
 */
export const getVideoSources = (videoData, type = 'video/mp4') => {
  if (!videoData?.mediaItemUrl) return [];
  
  return [
    {
      src: videoData.mediaItemUrl,
      type: type
    }
  ];
};

/**
 * Determines optimal video quality settings based on context
 * @param {Object} options - Configuration options
 * @param {string} options.context - Context: 'hero', 'card', 'gallery', 'content'
 * @param {boolean} options.isMobile - Whether the video is for mobile
 * @returns {Object} Video quality settings
 */
export const getVideoQualitySettings = ({ context = 'content', isMobile = false }) => {
  const settings = {
    hero: {
      quality: 'high',
      bitrate: isMobile ? 'medium' : 'high',
      resolution: isMobile ? '720p' : '1080p'
    },
    card: {
      quality: 'medium',
      bitrate: 'medium',
      resolution: '720p'
    },
    gallery: {
      quality: 'medium',
      bitrate: 'medium',
      resolution: '720p'
    },
    content: {
      quality: 'high',
      bitrate: isMobile ? 'medium' : 'high',
      resolution: isMobile ? '720p' : '1080p'
    }
  };
  
  return settings[context] || settings.content;
};

/**
 * Generates cache-friendly video URL with query parameters
 * @param {string} videoUrl - Original video URL
 * @param {Object} options - Cache options
 * @returns {string} Cache-optimized video URL
 */
export const getCacheOptimizedVideoUrl = (videoUrl, options = {}) => {
  if (!videoUrl) return '';
  
  const {
    version = '1.0',
    quality = 'auto',
    format = 'mp4'
  } = options;
  
  const url = new URL(videoUrl);
  
  // Add cache-busting parameters that are stable for the same content
  url.searchParams.set('v', version);
  url.searchParams.set('q', quality);
  url.searchParams.set('f', format);
  
  return url.toString();
};

/**
 * Creates a video element with optimized attributes
 * @param {Object} videoData - Video data from CMS
 * @param {Object} options - Configuration options
 * @returns {Object} Video element configuration
 */
export const createOptimizedVideoElement = (videoData, options = {}) => {
  const videoProps = getOptimizedVideoProps(videoData, options);
  const sources = getVideoSources(videoData);
  
  return {
    ...videoProps,
    sources,
    // Add performance hints
    onLoadStart: () => {
      // Track video loading start
      if (typeof window !== 'undefined' && window.performance) {
        window.performance.mark(`video-load-start-${videoData.id || 'unknown'}`);
      }
    },
    onCanPlay: () => {
      // Track when video can start playing
      if (typeof window !== 'undefined' && window.performance) {
        window.performance.mark(`video-can-play-${videoData.id || 'unknown'}`);
      }
    }
  };
};
