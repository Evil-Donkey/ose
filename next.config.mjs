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
    },
    // Enable CSS optimization
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    // Modern browser optimizations
    experimental: {
        // Enable modern JavaScript features
        esmExternals: true,
        // Optimize for modern browsers
        optimizePackageImports: ['framer-motion', 'gsap', 'lottie-react', 'swiper'],
    },
    // Optimize bundle for modern browsers
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            // Optimize CSS for production
            config.optimization.splitChunks.cacheGroups.styles = {
                name: 'styles',
                test: /\.(css|scss)$/,
                chunks: 'all',
                enforce: true,
            };

            // Modern browser optimizations
            config.optimization.splitChunks.cacheGroups.modern = {
                name: 'modern',
                test: /[\\/]node_modules[\\/]/,
                chunks: 'all',
                priority: 10,
                reuseExistingChunk: true,
            };
        }

        // Reduce polyfills for modern browsers
        config.resolve.fallback = {
            ...config.resolve.fallback,
            // Only include essential polyfills
            fs: false,
            net: false,
            tls: false,
        };

        return config;
    },
    // Handle API routes properly
    async rewrites() {
        return [];
    },
};

export default nextConfig;
