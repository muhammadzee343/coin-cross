import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['unsplash.com', 'images.unsplash.com']
  },
  eslint: {
    ignoreDuringBuilds: true // Temporarily disable ESLint during build
  },
  // Add headers for Telegram Mini App to prevent caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      bigint: false,
      fs: false,
      tls: false,
      net: false,
      child_process: false
    };
    return config;
  },
  // Enable SWC compiler
  experimental: {
    forceSwcTransforms: true
  },
  // Generate unique build ID to prevent caching issues in Telegram Mini App
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
