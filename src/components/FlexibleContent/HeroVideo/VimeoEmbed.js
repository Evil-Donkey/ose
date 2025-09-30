'use client'

import { useEffect, useRef } from 'react';
import Player from '@vimeo/player';

const VimeoEmbed = ({ vimeoUrl, className = "", background = true, controls = false, muted = true, loop = true, ...props }) => {
    const playerRef = useRef(null);
    const playerInstanceRef = useRef(null);

    useEffect(() => {
        if (!vimeoUrl || !playerRef.current) return;

        // Extract video ID from Vimeo URL
        const getVimeoId = (url) => {
            const match = url.match(/(?:vimeo\.com\/)(\d+)/);
            return match ? match[1] : null;
        };

        const videoId = getVimeoId(vimeoUrl);
        
        if (!videoId) {
            console.warn('Invalid Vimeo URL:', vimeoUrl);
            return;
        }

        // Clean up existing player instance
        if (playerInstanceRef.current) {
            playerInstanceRef.current.destroy();
        }

        // Create new player instance
        playerInstanceRef.current = new Player(playerRef.current, {
            id: parseInt(videoId),
            autoplay: true,
            muted: muted,
            loop: loop,
            background: background && !controls, // Only use background mode if controls are disabled
            controls: controls,
            title: false,
            byline: false,
            portrait: false,
            dnt: true,
            responsive: true
        });

        // Handle player events if needed
        playerInstanceRef.current.on('ready', () => {
            // Player is ready
            // Ensure the iframe inside the player has proper pointer events
            const iframe = playerRef.current.querySelector('iframe');
            if (iframe) {
                iframe.style.pointerEvents = 'auto';
                iframe.style.zIndex = '2';
            }
        });

        playerInstanceRef.current.on('error', (error) => {
            console.error('Vimeo player error:', error);
        });

        // Cleanup function
        return () => {
            if (playerInstanceRef.current) {
                playerInstanceRef.current.destroy();
                playerInstanceRef.current = null;
            }
        };
    }, [vimeoUrl, background, controls, muted, loop]);

    if (!vimeoUrl) return null;

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`} {...props}>
            <div
                ref={playerRef}
                className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{ zIndex: 1 }}
            />
        </div>
    );
};

export default VimeoEmbed;
