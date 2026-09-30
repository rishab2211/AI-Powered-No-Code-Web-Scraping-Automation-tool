import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
