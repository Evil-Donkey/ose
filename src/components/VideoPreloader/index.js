/**
 * VideoPreloader component for preloading critical videos
 * This component adds preload hints for videos that are likely to be viewed
 */

import Head from 'next/head';

const VideoPreloader = ({ videos = [] }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <Head>
      {videos.map((video, index) => {
        if (!video?.mediaItemUrl) return null;
        
        return (
          <link
            key={`video-preload-${index}`}
            rel="preload"
            as="video"
            href={video.mediaItemUrl}
            type="video/mp4"
            // Only preload metadata for non-critical videos
            {...(video.priority ? {} : { media: '(prefers-reduced-data: no)' })}
          />
        );
      })}
    </Head>
  );
};

export default VideoPreloader;
