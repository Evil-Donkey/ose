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
    // Optimize bundle
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            // Optimize CSS for production
            config.optimization.splitChunks.cacheGroups.styles = {
                name: 'styles',
                test: /\.(css|scss)$/,
                chunks: 'all',
                enforce: true,
            };
        }
        return config;
    },
    // Handle API routes properly
    async rewrites() {
        return [];
    },
};

export default nextConfig;
