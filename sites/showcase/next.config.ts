import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@platform/core-components", "@platform/theme-system", "@platform/themes"],
  images: {
    remotePatterns: [{ hostname: "placehold.co" }],
  },
  async headers() {
    // Next.js dev mode requires unsafe-eval for webpack HMR; production omits it
    const unsafeEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
    const scriptSrc = `'self' 'unsafe-inline'${unsafeEval}`;

    const allowedOrigin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: allowedOrigin },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, X-CSRF-Token" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: placehold.co; connect-src 'self'; frame-ancestors 'none';`,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default config;
