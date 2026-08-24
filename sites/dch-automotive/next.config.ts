import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import { validateAnalyticsEnv } from '@platform/core-components/lib/analytics/validate-env';

// Fails the build (production) or warns (dev) when a server/NEXT_PUBLIC_ feature-flag
// pair is mismatched, or a flag is on without its required companion var — see
// packages/core-components/src/lib/analytics/validate-env.ts.
validateAnalyticsEnv();

// Next.js 16 with Turbopack requires plugins as strings (not imported functions)
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm', 'remark-frontmatter'],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Enable experimental features for better performance
  experimental: {
    // Note: mdxRs and forceSwcTransforms removed for Next.js 16 compatibility
    swcTraceProfiling: false, // Disable profiling in production
  },
  // Compiler optimizations for modern browsers
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Webpack configuration for modern browsers and optimizations
  webpack: (config, { isServer, dev }) => {
    // Target modern browsers to eliminate polyfills
    if (!isServer) {
      config.target = ['web', 'es2022'];
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
    // Remote patterns for image hosting
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      // Allow placehold.co for fallback/placeholder images
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    // Allow SVG images (safe for logos and icons)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Responsive breakpoints for different screen sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache images for 90 days (allows in-place image updates to propagate)
    minimumCacheTTL: 60 * 60 * 24 * 90, // 90 days
    // Allowed quality values for Image component quality prop.
    // Live defaults set by shared components in packages/core-components: 45 = thumbnails,
    // 58 = content images, 72 = hero images. 75 is Next's own implicit default for any
    // Image with no explicit quality prop. 50/65/80 are kept for sites with older inline
    // overrides (e.g. npracing-v1) predating this scheme -- see docs/standards/images.md.
    qualities: [45, 50, 58, 65, 72, 75, 80],
  },
  // Ensure static exports work correctly
  trailingSlash: false,
  // Security headers for production
  async headers() {
    // CSP script-src: unsafe-inline required for Next.js hydration
    // Next.js dev mode requires unsafe-eval for webpack HMR; production omits it
    const unsafeEval = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '';
    const scriptSrc = `'self' 'unsafe-inline'${unsafeEval} *.googletagmanager.com *.google-analytics.com *.facebook.com vercel.live *.vercel.live`;

    // CORS: restrict API routes to same-origin requests only
    const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return [
      // CORS headers for API routes (SEC-010)
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigin,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, X-CSRF-Token',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            // frame-src includes viezu.com for the embedded vehicle-tuning-finder widget on /car-remaps (Lyra/DCH-specific — remove if the widget is dropped)
            value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: *.r2.dev placehold.co; connect-src 'self' *.google-analytics.com *.facebook.com vercel.live *.vercel.live; frame-src vercel.live *.vercel.live https://viezu.com; frame-ancestors 'none';`,
          },
          // HSTS - enforce HTTPS for 1 year, include subdomains, allow preload
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Prevent resources from being loaded by other origins
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          // Restrict browser features that aren't needed
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
