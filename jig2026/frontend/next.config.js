/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Désactivé pour réduire les erreurs d'hydratation
  images: {
    unoptimized: true, // Permettre les images externes sans optimisation
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  // Optimisations pour réduire les erreurs d'hydratation
  experimental: {
    optimizePackageImports: ['react-hot-toast', 'lucide-react'],
  },
}

module.exports = nextConfig