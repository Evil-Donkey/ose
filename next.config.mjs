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
        optimizePackageImports: ['framer-motion', 'gsap', 'lottie-react', 'swiper', 'react-hook-form'],
    },
    // Optimize bundle for modern browsers
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            // Enhanced code splitting for better performance
            config.optimization.splitChunks = {
                chunks: 'all',
                minSize: 20000,
                maxSize: 244000,
                cacheGroups: {
                    // Vendor libraries
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        priority: 10,
                        reuseExistingChunk: true,
                    },
                    // Heavy animation libraries
                    animations: {
                        test: /[\\/]node_modules[\\/](gsap|framer-motion|lottie-react)[\\/]/,
                        name: 'animations',
                        priority: 20,
                        reuseExistingChunk: true,
                    },
                    // UI libraries
                    ui: {
                        test: /[\\/]node_modules[\\/](swiper|react-hook-form)[\\/]/,
                        name: 'ui',
                        priority: 15,
                        reuseExistingChunk: true,
                    },
                    // Common components
                    common: {
                        name: 'common',
                        minChunks: 2,
                        priority: 5,
                        reuseExistingChunk: true,
                    },
                    // CSS optimization
                    styles: {
                        name: 'styles',
                        test: /\.(css|scss)$/,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            };

            // Tree shaking optimization
            config.optimization.usedExports = true;
            config.optimization.sideEffects = false;
        }

        // Reduce polyfills for modern browsers
        config.resolve.fallback = {
            ...config.resolve.fallback,
            // Only include essential polyfills
            fs: false,
            net: false,
            tls: false,
        };

        // Optimize module resolution
        config.resolve.alias = {
            ...config.resolve.alias,
            // Reduce bundle size by using lighter alternatives where possible
        };

        return config;
    },
    // Handle API routes properly
    async rewrites() {
        return [];
    },
};

export default nextConfig;
