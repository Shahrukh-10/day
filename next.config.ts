import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/day',
  assetPrefix: '/day',
  images: { unoptimized: true },
  allowedDevOrigins: ["192.168.29.203"],
  devIndicators: false,
};

export default nextConfig;
