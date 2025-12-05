import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Next.js 16 with Turbopack requires plugins as strings (not imported functions)
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-frontmatter"],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  // Enable experimental features for better performance
  experimental: {
    // Note: mdxRs and forceSwcTransforms removed for Next.js 16 compatibility
    swcTraceProfiling: false, // Disable profiling in production
  },
  // Compiler optimizations for modern browsers
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Webpack configuration for modern browsers and optimizations
  webpack: (config, { isServer, dev }) => {
    // Target modern browsers to eliminate polyfills
    if (!isServer) {
      config.target = ["web", "es2022"];
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Optimization for production builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },
  // Image optimization configuration for better performance
  images: {
    // Remote patterns for Cloudflare R2
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      // Allow placehold.co for fallback images when R2 URL not configured
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    // Allow SVG images (safe for logos and icons)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Responsive breakpoints for different screen sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache images for better performance
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache for 1 year
    // Note: Default quality is 75. Individual Image components should specify quality={65}
    // for ~10-15% better compression (Lighthouse recommendation: saves ~23 KiB)
  },
  // Ensure static exports work correctly
  trailingSlash: false,
  // Security headers for production
  async headers() {
    // In development, allow unsafe-eval for React dev mode
    const scriptSrc =
      process.env.NODE_ENV === "development"
        ? "'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com *.facebook.com vercel.live *.vercel.live"
        : "'self' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.facebook.com vercel.live *.vercel.live";

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.r2.dev; connect-src 'self' *.google-analytics.com *.facebook.com vercel.live *.vercel.live; frame-src vercel.live *.vercel.live; frame-ancestors 'none';`,
          },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
