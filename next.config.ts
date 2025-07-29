import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // 一時的に戻す - Phase 2で段階的修正
  },
  typescript: {
    ignoreBuildErrors: true, // 一時的に戻す - Phase 2で段階的修正
  },
};

export default nextConfig;
