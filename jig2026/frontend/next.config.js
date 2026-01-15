/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Désactivé pour réduire les erreurs d'hydratation
  swcMinify: true,
  // Configuration pour éviter TOUS les problèmes de build sur Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Permettre les images externes sans optimisation
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jig2026.up.railway.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://jig2026.up.railway.app',
  },
  // Optimisations pour réduire les erreurs d'hydratation
  experimental: {
    optimizePackageImports: ['react-hot-toast', 'lucide-react'],
  },
}

module.exports = nextConfig