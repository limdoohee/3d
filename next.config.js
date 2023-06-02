/**
 * @type {import('next').NextConfig}
 */
const path = require("path");
const withImages = require("next-images");
const withTM = require("next-transpile-modules")(["antd-mobile"]);
const { generateBuildId } = require("next/dist/build/generate-build-id");
const moment = require("moment");

const nextConfig = {
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
    generateBuildId: async () => {
        const getTime = moment().format("YYYYMMDDHHmmss");
        return `dk_${getTime}`;
    },
};

module.exports = withTM(withImages(nextConfig));
