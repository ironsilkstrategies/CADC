import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // VITA is no longer offered (per Leslea, Oct 2026) — send old links home
  async redirects() {
    return [
      { source: "/free-tax-help", destination: "/", permanent: true },
      { source: "/programs/tax-help", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
