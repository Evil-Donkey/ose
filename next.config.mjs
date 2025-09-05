/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "oxfordscienceenterprises-cms.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "**.oxfordscienceenterprises-cms.com",
                port: "",
            },
        ],
        // Enable responsive image optimization
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828, 1080],
        minimumCacheTTL: 31536000, // 1 year cache for images
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        // Enable unoptimized for better performance in some cases
        unoptimized: false,
        // Add loader for better performance
        loader: 'default',
    },
    // Add headers for video caching
    async headers() {
        return [
            {
                source: '/api/video/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                    {
                        key: 'Content-Type',
                        value: 'video/mp4',
                    },
                ],
            },
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, s-maxage=3600',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
