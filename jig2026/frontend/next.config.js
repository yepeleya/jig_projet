/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {},
  // Pas d'output export pour éviter les problèmes
  // trailingSlash: true,
  // distDir: 'out'
};

module.exports = nextConfig;