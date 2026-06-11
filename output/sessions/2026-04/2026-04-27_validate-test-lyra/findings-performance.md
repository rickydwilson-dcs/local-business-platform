# Performance Audit Findings

**Reviewer:** cs-frontend-engineer (performance mode)
**Scope:** /Users/rickywilson/Sites/local-business-platform/sites/test-lyra
**Date:** 2026-04-27

## Findings

### [HIGH] PERF-001: `images.formats` not configured — AVIF not enabled for remote images

- **File:** `sites/test-lyra/next.config.ts` (lines 55–79, `images` block)
- **Issue:** The `images` config omits the `formats` array. Default is `['image/webp']` only. Remote images served via Next.js Image Optimization API (from `*.r2.dev`) will not be transcoded to AVIF.
- **Impact:** Remote hero and content images served as WebP (30–40% larger than AVIF) to AVIF-capable browsers.
- **Fix:** Add `formats: ['image/avif', 'image/webp']` to the `images` block.
- **Effort:** trivial

### [HIGH] PERF-002: `compress` not explicitly set

- **File:** `sites/test-lyra/next.config.ts` (top-level config object)
- **Issue:** The `compress` option is absent. Next.js defaults to `true` for `next start`, but without explicit declaration a future misconfiguration could silently disable gzip/brotli.
- **Impact:** Uncompressed JS/CSS payloads 60–75% larger on the wire if compression falls through.
- **Fix:** Add `compress: true` to `nextConfig`.
- **Effort:** trivial

### [MEDIUM] PERF-003: Global `sideEffects: false` in webpack config is unsafe

- **File:** `sites/test-lyra/next.config.ts` (lines 44–50)
- **Issue:** `config.optimization.sideEffects = false` applied globally in production client builds. Can silently strip side-effectful CSS imports (`globals.css`, theme CSS) in production builds while dev appears fine. Next.js 15+ already handles this internally.
- **Impact:** Potential silent CSS elimination in production builds.
- **Fix:** Remove the manual `config.optimization` block entirely.
- **Effort:** small

### [MEDIUM] PERF-004: Material Symbols loaded via render-blocking `<link rel="stylesheet">` in `<head>`

- **File:** `sites/test-lyra/app/layout.tsx` (lines 33–36)
- **Issue:** Plain stylesheet link inside `<head>` is render-blocking. Browser must complete DNS + TLS + CSS fetch before painting.
- **Impact:** Typically adds 100–300ms to FCP/LCP on 4G. Icon font WOFF2 subset is ~150KB.
- **Fix:** Use `rel="preload"` with JS-driven swap, or self-host via `next/font/local`.
- **Effort:** small

### [MEDIUM] PERF-005: Entire `not-found.tsx` is a Client Component due to a single `window.history.back()` call

- **File:** `sites/test-lyra/app/not-found.tsx` (line 1)
- **Issue:** `'use client'` forces the entire 404 page (headings, contact info, popular-pages grid, lucide-react imports) into the client JS bundle. All content is static except one back button.
- **Impact:** Unnecessary client bundle size increase.
- **Fix:** Extract the back button into a minimal `BackButton` client leaf component; make `not-found.tsx` a Server Component.
- **Effort:** small

### [LOW] PERF-006: `package.json` missing a `build` script

- **File:** `sites/test-lyra/package.json` (`scripts` section)
- **Issue:** No `build` script. Turborepo invokes `build` on each site. Without it, CI may use a framework default that doesn't include `--webpack`, causing PostCSS panics in CI.
- **Impact:** CI builds may silently run Turbopack.
- **Fix:** Add `"build": "next build --webpack"` to scripts.
- **Effort:** trivial

### [LOW] PERF-007: `swcMinify` absence — informational note

- **File:** `sites/test-lyra/next.config.ts`
- **Issue:** Informational only. `swcMinify` was removed in Next.js 15 (SWC minification is always-on). No code change needed.
- **Impact:** None.
- **Fix:** Optional comment only.
- **Effort:** trivial

## Checks with no findings

| Check                                        | Result                                                                             |
| -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `<Image fill>` without `sizes`               | All `fill` usages pair with a `sizes` prop. Pass.                                  |
| Large PNG bitmaps in `public/images/`        | No PNG files exist — all 20 assets are AVIF or SVG. Pass.                          |
| Unused font-family in `globals.css`          | `Work Sans` and `Inter` both loaded by `layout.tsx`. No orphan declarations. Pass. |
| Third-party `<Script>` without lazy strategy | No `next/script` components found in `app/` or `components/`. Pass.                |
| Unnecessary `'use client'` directives        | Only `not-found.tsx` — flagged as PERF-005. Pass otherwise.                        |

## Statistics

- Critical: 0
- High: 2
- Medium: 3
- Low: 2
- Total: 7
