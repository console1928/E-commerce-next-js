import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
    // appDir: true,
  },
  images: {
    domains: ['**'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
