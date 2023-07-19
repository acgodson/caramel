/** @type {import('next').NextConfig} */

import PWA from "next-pwa";

const withPWA = PWA({
  dest: "public",
  register: false,
  skipWaiting: true,
});

const nextConfig = withPWA({
  reactStrictMode: false,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    return config;
  },
  images: {
    unoptimized: true,
  },
  exportPathMap: function () {
    return {
      "/": { page: "/" },
      "/signin": { page: "/signin" },
      "/home": { page: "/home" },
      "/login-success": { page: "/login-success" },
      "/api/uploadToBrowser": { page: "/api/uploadToBrowser" },
      "/api/check-user": { page: "/api/check-user" },
      "/api/fetch-key": { page: "/api/fetch-key" },
      "/api/uploadToIPFS": { page: "/api/uploadToIPFS" },
      "/api/query-user": { page: "/api/query-user" },
    };
  },
});

export default nextConfig;
