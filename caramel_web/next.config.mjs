/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,

  images: {
    unoptimized: true,
  },
  exportPathMap: function () {
    return {
      "/": { page: "/" },
      "/signin": { page: "/signin" },
      "/home": { page: "/" },
      "/login-success": { page: "/login-success" },
      "/api": { page: "/api" },
    };
  },
};

export default nextConfig;
