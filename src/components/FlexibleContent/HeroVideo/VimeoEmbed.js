'use client'

import { useEffect, useRef } from 'react';

const VimeoEmbed = ({ vimeoUrl, className = "", controls = false, muted = true, ...props }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (iframeRef.current) {
            // Ensure the iframe loads properly
            iframeRef.current.src = iframeRef.current.src;
        }
    }, [vimeoUrl]);

    if (!vimeoUrl) return null;

    // Extract video ID from Vimeo URL
    const getVimeoId = (url) => {
        const match = url.match(/(?:vimeo\.com\/)(\d+)/);
        return match ? match[1] : null;
    };

    const videoId = getVimeoId(vimeoUrl);
    
    if (!videoId) {
        console.warn('Invalid Vimeo URL:', vimeoUrl);
        return null;
    }

    const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=${muted ? 1 : 0}&loop=1&background=1&controls=${controls ? 1 : 0}&title=0&byline=0&portrait=0`;

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`} {...props}>
            <iframe
                ref={iframeRef}
                src={embedUrl}
                className="absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};

export default VimeoEmbed;
