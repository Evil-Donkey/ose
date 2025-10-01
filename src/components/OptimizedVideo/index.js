/**
 * OptimizedVideo component with built-in performance optimizations
 * Handles lazy loading, preloading, and caching for video content
 */

import { useRef, useEffect, useState } from 'react';
import { getOptimizedVideoProps, getVideoSources } from '@/lib/videoUtils';

const OptimizedVideo = ({ 
  videoData, 
  options = {},
  onLoadStart,
  onCanPlay,
  onError,
  ...props 
}) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedProps = getOptimizedVideoProps(videoData, options);
  const sources = getVideoSources(videoData);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsLoaded(false);
      setHasError(false);
      onLoadStart?.();
    };

    const handleCanPlay = () => {
      setIsLoaded(true);
      onCanPlay?.();
    };

    const handleError = (e) => {
      setHasError(true);
      onError?.(e);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [onLoadStart, onCanPlay, onError]);

  if (!videoData?.mediaItemUrl) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      {...optimizedProps}
      {...props}
      data-loaded={isLoaded}
      data-error={hasError}
    >
      {sources.map((source, index) => (
        <source key={index} src={source.src} type={source.type} />
      ))}
      {/* Fallback message for browsers that don't support video */}
      <p>Your browser doesn&apos;t support HTML5 video.</p>
    </video>
  );
};

export default OptimizedVideo;
