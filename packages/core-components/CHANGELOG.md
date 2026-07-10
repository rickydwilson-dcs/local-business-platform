# Changelog — @platform/core-components

## 2026-07-09

- Fixed `Schema` component: `FAQPage`/`BreadcrumbList` JSON-LD `@id` fields double-prefixed the site URL when built from `webpage.url` (conventionally passed already-absolute by callers), producing malformed `@id`s like `https://site.com/https://site.com/page#faq`. Added a guard (`toAbsoluteId`) so an already-absolute URL isn't re-run through `absUrl()`. Affects every consuming site's pages that combine `webpage` with `faqs` and/or `breadcrumbs` props — found while adding FAQ schema to `dch-automotive`'s `/car-remaps` page; verified no regression on existing location-page FAQ schemas.

## 2026-02-19

- LocationFrontmatterSchema: `county` field relaxed from East Sussex/West Sussex/Kent/Surrey enum to free-form string; new optional `countySlug` field added for URL-safe grouping
- LocationFrontmatterSchema: services link constraint relaxed from `/services/` prefix to any relative path
- LocationFrontmatterSchema: generic hero fields added (`primaryActionLabel`, `primaryActionHref`, `highlightItems`); legacy `phone`/`trustBadges` fields retained for backward compatibility
