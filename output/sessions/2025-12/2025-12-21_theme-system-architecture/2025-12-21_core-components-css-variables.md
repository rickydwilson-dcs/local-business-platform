# Core Components CSS Variables Migration

**Date:** 2025-12-21
**Objective:** Update core-components package to use CSS variables instead of hardcoded colors

## Context

The theme system uses CSS variables mapped from theme.config.ts. Components should use semantic class names that reference these variables, not hardcoded colors.

## Files Found

### Files with `brand-blue` references (34 total):

- service-cards.tsx
- coverage-map.tsx
- town-finder-section.tsx
- service-showcase.tsx
- service-location-matrix.tsx
- service-hero.tsx
- service-faq.tsx
- service-cta.tsx
- service-components.tsx
- service-benefits.tsx
- service-about.tsx
- pricing-packages.tsx
- mobile-menu.tsx
- location-services.tsx
- locations-dropdown.tsx
- location-hero.tsx
- location-components.tsx
- location-coverage.tsx
- location-faq.tsx
- local-specialists-benefits.tsx
- local-authority-expertise.tsx
- large-feature-cards.tsx
- footer.tsx
- hero-section.tsx
- custom-footer.tsx
- coverage-stats-section.tsx
- cta-section.tsx
- county-gateway-cards.tsx
- coverage-areas.tsx
- coverage-map-section.tsx
- content-card.tsx
- card-grid.tsx
- capability-showcase.tsx
- ConsentManager.tsx

### Files with hex color values (4 total):

- service-cards.tsx (#005A9E)
- coverage-map.tsx
- service-showcase.tsx
- content-card.tsx

## Replacement Patterns

| Old Pattern            | New Pattern                    |
| ---------------------- | ------------------------------ |
| `brand-blue`           | `brand-primary`                |
| `brand-blue-hover`     | `brand-primary-hover`          |
| `brand-blue-light`     | `brand-secondary`              |
| `bg-[#005A9E]`         | `bg-brand-primary`             |
| `hover:bg-[#004a85]`   | `hover:bg-brand-primary-hover` |
| `focus:ring-[#005A9E]` | `focus:ring-brand-primary`     |
| `text-[#005A9E]`       | `text-brand-primary`           |

## Implementation Steps

1. Update all 34 files with brand-blue references
2. Update 4 files with hex color values
3. Test build to ensure no breaks
4. Update documentation

## Status

- [x] Search completed
- [ ] Files updated
- [ ] Build tested
- [ ] Documentation updated
