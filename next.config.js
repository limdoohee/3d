/**
 * @type {import('next').NextConfig}
 */
const path = require("path");

const nextConfig = {
    transpilePackages: ["antd-mobile"],
    reactStrictMode: false,
    assetPrefix: "",
    trailingSlash: true,
    webpack5: true,
    env: {
        STAGE: process.env.STAGE,
        URL: process.env.URL,
        API_URL: process.env.API_URL,
        SENDBIRD_APP_ID: process.env.SENDBIRD_APP_ID,
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false, child_process: false, net: false, tls: false };
        return config;
    },
};

module.exports = nextConfig;
