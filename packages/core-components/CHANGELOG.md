# Changelog — @platform/core-components

## 2026-02-19

- LocationFrontmatterSchema: `county` field relaxed from East Sussex/West Sussex/Kent/Surrey enum to free-form string; new optional `countySlug` field added for URL-safe grouping
- LocationFrontmatterSchema: services link constraint relaxed from `/services/` prefix to any relative path
- LocationFrontmatterSchema: generic hero fields added (`primaryActionLabel`, `primaryActionHref`, `highlightItems`); legacy `phone`/`trustBadges` fields retained for backward compatibility
