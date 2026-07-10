# Public Assets Directory

Static files served directly by Next.js. Content images (hero images, service photos, logo, Viezu marketing assets) are **not** kept here — they live in the shared platform R2 bucket under the `dch-automotive/` key prefix, resolved at render time via `getImageUrl()` from `@/lib/image`. See `docs/standards/images.md` and `tools/upload-dch-automotive-to-r2.ts` (repo root).

Only genuinely static, framework-required files belong in this directory (favicon, `robots.txt`-adjacent assets, etc.).
