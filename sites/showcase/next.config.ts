import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@platform/core-components', '@platform/theme-system', '@platform/themes'],
  images: {
    remotePatterns: [
      { hostname: 'placehold.co' },
    ],
  },
};

export default config;
