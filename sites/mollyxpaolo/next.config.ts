import type { NextConfig } from 'next';

/**
 * Security and privacy headers. Kept as an exported function so test/csp.test.ts asserts the
 * real emitted header rather than a copy of it.
 *
 * Media comes straight from the R2 bucket's public URL (*.r2.dev until the Phase 4 custom media
 * domain): images (img-src), the film (media-src), and fetch() for zip / share downloads
 * (connect-src). Fonts are self-hosted by next/font, so no Google Fonts origins.
 */
export function securityHeaders(env: string | undefined = process.env.NODE_ENV) {
  const media = '*.r2.dev';
  // next dev's HMR/React Refresh runtime evaluates strings; production omits unsafe-eval.
  const unsafeEval = env === 'development' ? " 'unsafe-eval'" : '';
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${unsafeEval}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    `img-src 'self' data: blob: ${media}`,
    `media-src 'self' ${media}`,
    `connect-src 'self' ${media}`,
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  return [
    { key: 'Content-Security-Policy', value: `${csp};` },
    // Private family gallery: never indexed, never shown in image search.
    { key: 'X-Robots-Tag', value: 'noindex, nofollow, noimageindex, noarchive' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    // Keeps the gallery URL (and any share-link path) out of Referer headers sent to R2.
    { key: 'Referrer-Policy', value: 'same-origin' },
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ];
}

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  trailingSlash: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders() }];
  },
};

export default nextConfig;
