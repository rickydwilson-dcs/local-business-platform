# Add Hero Images to DJ Fox Services

**Date:** 2026-02-16
**Status:** Completed
**Issue:** Service cards on `/services` page and hero images on `/services/[slug]` pages were showing placeholder icons instead of images.

## Root Cause

Service MDX files were missing `image` and `hero.image` fields in their frontmatter. The components were designed to display images but had no image paths to work with:

- **ContentCard** component (used on services listing) checks for `item.image` or `item.heroImage`
- **ServiceHero** component (used on individual service pages) checks for `heroImage` prop

## Solution

Added both fields to all 48 service MDX files following the same pattern as locations:

```yaml
image: djfoxelectrical/categories/[category]-category.jpg
hero:
  image: djfoxelectrical/categories/[category]-category.jpg
```

Images are mapped by category:

- `installation` → `djfoxelectrical/categories/installation-category.jpg`
- `maintenance` → `djfoxelectrical/categories/maintenance-category.jpg`
- `repair` → `djfoxelectrical/categories/repair-category.jpg`

## Files Modified

- **Tool created:** `tools/add-hero-images-to-services.ts`
- **Services updated:** All 48 service MDX files in `sites/dj-fox-electrical/content/services/`

## Pattern Consistency

This now matches the pattern used in:

- **Colossus services:** Use `hero.image` field
- **DJ Fox locations:** Use both `image` and `hero.image` fields

## Next Steps

For service-specific images (rather than category-level placeholders):

1. Upload service-specific images to R2 at: `djfoxelectrical/services/[service-slug].jpg`
2. Update frontmatter in individual service MDX files to reference the specific images

Example:

```yaml
image: djfoxelectrical/services/ev-charger-installation.jpg
hero:
  image: djfoxelectrical/services/ev-charger-installation.jpg
```

## Verification

- ✅ Type check passed
- ✅ Build succeeded (all 48 service pages generated)
- ✅ No errors or warnings
