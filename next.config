import type { NextConfig } from "next";
import { redirects as legacyRedirects } from "./lib/org";

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(legacyRedirects).map(([source, destination]) => ({
      source,
      destination,
      permanent: true, // 301
    }));
  },
};

export default nextConfig;
