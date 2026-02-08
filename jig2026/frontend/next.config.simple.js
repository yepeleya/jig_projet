/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    appDir: true,
    ssr: false, // Désactiver SSR globalement
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jig-projet-1.onrender.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://jig-projet-1.onrender.com/api',
  }
};

module.exports = nextConfig;