# Changelog — @platform/core-components

## 2026-08-24

- Every `<Image>` across the shared UI/composable components and `mdx-components.tsx` now sets an explicit `quality` prop by role — `45` for thumbnail-scale grids (`certificate-gallery.tsx`), `58` for content images (cards, galleries, MDX inline images), `72` for hero/priority images — replacing a mix of unset defaults and five components that had already drifted to ad-hoc values (65/70/75) independently of each other. Brand-logo images (`site-header.tsx`, `mobile-menu.tsx`) and the full-screen certificate lightbox were left at Next's implicit default so sharp edges/text and zoomed detail aren't lost. Removed `src/lib/image-config.ts` — a centralized quality-config module that was never imported by any site and whose own values (58/72/45) had already drifted from what `docs/standards/images.md` documented (65/80/50); the inline-per-component convention above is now the actual, live source of truth, and every site's `next.config.ts` `images.qualities` allow-list was updated to include the new values (Next.js throws at runtime if an `<Image>` requests a `quality` not in that list). See `docs/standards/images.md` for the full convention.

## 2026-07-09

- Fixed `Schema` component: `FAQPage`/`BreadcrumbList` JSON-LD `@id` fields double-prefixed the site URL when built from `webpage.url` (conventionally passed already-absolute by callers), producing malformed `@id`s like `https://site.com/https://site.com/page#faq`. Added a guard (`toAbsoluteId`) so an already-absolute URL isn't re-run through `absUrl()`. Affects every consuming site's pages that combine `webpage` with `faqs` and/or `breadcrumbs` props — found while adding FAQ schema to `dch-automotive`'s `/car-remaps` page; verified no regression on existing location-page FAQ schemas.

## 2026-02-19

- LocationFrontmatterSchema: `county` field relaxed from East Sussex/West Sussex/Kent/Surrey enum to free-form string; new optional `countySlug` field added for URL-safe grouping
- LocationFrontmatterSchema: services link constraint relaxed from `/services/` prefix to any relative path
- LocationFrontmatterSchema: generic hero fields added (`primaryActionLabel`, `primaryActionHref`, `highlightItems`); legacy `phone`/`trustBadges` fields retained for backward compatibility
