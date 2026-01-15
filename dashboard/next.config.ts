import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Disable strict mode to reduce hydration errors
  images: {
    unoptimized: true, // Allow external images without optimization
    domains: ['localhost'], // Allow localhost images
  },
  experimental: {
    // This helps with hydration issues from browser extensions
    optimisticClientCache: false,
  },
  // Suppress hydration warnings during development
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Disable hydration warnings in development
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },
  // Webpack configuration to suppress hydration warnings
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Suppress hydration warnings in development
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            default: false,
            vendors: false,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
