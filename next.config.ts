import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // High-concurrency compression (reduces payload size by ~70% for 1,000+ users)
  compress: true,
  poweredByHeader: false,
  // Disable intrusive Next.js development overlay badge (removes "1 Issue" floating card)
  devIndicators: false,
};

export default nextConfig;
