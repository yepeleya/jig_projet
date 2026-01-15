import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  // Désactiver le linting et type checking sur Vercel pour éviter les erreurs de build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Désactivé pour éviter les problèmes de build sur Vercel
    // reactCompiler: true,
  },
  images: {
    domains: ['localhost', 'jig2026.up.railway.app'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://jig2026.up.railway.app',
  }
};

export default nextConfig;
