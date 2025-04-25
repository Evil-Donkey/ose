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
    }
};

export default nextConfig;
