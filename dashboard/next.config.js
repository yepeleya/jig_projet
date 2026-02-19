/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // LOCAL (dev)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/**',
      },

      // PRODUCTION (Render)
      {
        protocol: 'https',
        hostname: 'jig-projet-1.onrender.com',
        pathname: '/uploads/**',
      }
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
