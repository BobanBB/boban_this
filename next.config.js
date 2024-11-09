/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "coin-images.coingecko.com",
                pathname: "/coins/images/**",
            },
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                pathname: "/v0/b/local-metals-recyclers.appspot.com/**",
            },
            {
                protocol: "https",
                hostname: "**", // Allows all hostnames
            },
        ],
    },
};

module.exports = nextConfig;
