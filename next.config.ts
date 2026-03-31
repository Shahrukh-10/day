import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/day',
  assetPrefix: '/day',
  images: { unoptimized: true },
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.29.203", "192.168.29.204"],
  devIndicators: false,
};

export default nextConfig;
