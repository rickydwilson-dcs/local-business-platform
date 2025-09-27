import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import type { NextConfig } from "next";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  // Enable experimental features for better performance
  experimental: {
    mdxRs: true, // Use Rust-based MDX compiler for better performance
  },
  // Webpack configuration for Leaflet and other client-side libraries
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Image optimization configuration for better performance
  images: {
    // External domains (add domains if loading external images)
    domains: [],
    // Allow SVG images (safe for logos and icons)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Responsive breakpoints for different screen sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache images for better performance
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache for 1 year
    // Default quality (can be overridden per image component)
    // Note: Individual Image components can specify quality={65} for 10% more compression
  },
  // Ensure static exports work correctly
  trailingSlash: false,
  // Security headers for production
  async headers() {
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
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
