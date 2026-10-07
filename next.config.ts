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
      // Old standalone program pages carried outdated content — route to the live orbit site
      { source: "/programs/:slug(head-start|transit|weatherization|senior-meals|community-market|board|advantage)", destination: "/?program=:slug", permanent: false },
      { source: "/programs/employment", destination: "/join-our-team", permanent: false },
    ];
  },
};

export default nextConfig;
