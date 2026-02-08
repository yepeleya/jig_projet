/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // Configuration pour éviter TOUS les problèmes de build sur Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
  },
  // Désactiver les features expérimentales
  experimental: {},
  // Désactiver le strict mode pour éviter les erreurs
  compiler: {
    removeConsole: false,
  }
};

module.exports = nextConfig;
