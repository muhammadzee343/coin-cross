import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['unsplash.com', 'images.unsplash.com']
  },
  eslint: {
    ignoreDuringBuilds: true // Temporarily disable ESLint during build
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
  }
};

export default nextConfig;
