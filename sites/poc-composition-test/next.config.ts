import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    swcTraceProfiling: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    }
    return config;
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.r2.dev" }],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
