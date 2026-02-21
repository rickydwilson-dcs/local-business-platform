# Commercial Scaffolding Hero Image Replacement

**Date:** 2026-01-28
**Objective:** Replace inappropriate hero image on commercial scaffolding page
**Status:** ✅ Complete

## Context

The commercial scaffolding service page had a hero image featuring London buses and palm trees, which is not appropriate for a South Coast UK (Brighton/Sussex) scaffolding company.

**Page:** https://www.colossus-scaffolding.co.uk/services/commercial-scaffolding

## Solution

Created a new, geographically appropriate hero image using Gemini AI image generation.

### Image Generation

**Tool Created:** `tools/generate-single-service-image.ts`

- Single-purpose script for generating service hero images
- Uses Gemini 3 Pro Image Preview model
- South Coast UK focused prompts

**Prompt Used:**

```
Professional commercial scaffolding installation on a modern office building in Brighton, UK.
The scene shows a multi-story commercial property with scaffolding covering the facade, featuring
metal scaffolding tubes and boards in a professional grid pattern. Construction workers in
high-visibility yellow vests and white hard hats are visible on the scaffolding platforms.
The architecture is typical South Coast UK style - modern glass and brick. Background shows
the Brighton/Sussex area with characteristic British buildings, no palm trees. Overcast British
sky with soft natural daylight. Professional construction photography, photorealistic, sharp focus,
commercial quality, 800x600 landscape format.
```

### Generated Image Features

✅ Brighton/Sussex coastal cityscape background
✅ Modern commercial building (glass/brick)
✅ Professional scaffolding installation
✅ Workers in high-vis vests and hard hats
✅ Overcast British weather (realistic South Coast)
✅ No palm trees or London landmarks
✅ Professional construction photography style

## Technical Details

**File Path:** `output/generated-images/colossus-reference/hero/service/commercial-scaffolding_brighton.webp`
**R2 Path:** `colossus-reference/hero/service/commercial-scaffolding_brighton.webp`
**Public URL:** https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/colossus-reference/hero/service/commercial-scaffolding_brighton.webp
**File Size:** 927KB original, 206KB uploaded (optimized)

## Commands Used

```bash
# Generate image
pnpm exec tsx tools/generate-single-service-image.ts commercial-scaffolding

# Upload to R2
pnpm exec tsx tools/upload-single-image.ts \
  "output/generated-images/colossus-reference/hero/service/commercial-scaffolding_brighton.webp" \
  "colossus-reference/hero/service/commercial-scaffolding_brighton"

# Verify build
npm run build
```

## MDX Configuration

The MDX file already references the correct image path:

```yaml
hero:
  image: "colossus-reference/hero/service/commercial-scaffolding_brighton.webp"
```

**File:** `sites/colossus-reference/content/services/commercial-scaffolding.mdx:5`

No MDX updates required - the image reference was already correct, we just needed to generate the actual image file.

## Verification

- ✅ Image generated successfully
- ✅ Uploaded to R2 with optimizations (640w responsive variant)
- ✅ R2 URL returns 200 OK with `Content-Type: image/webp`
- ✅ Site builds successfully
- ✅ Image is geographically appropriate for South Coast UK

## New Tool Created

**File:** `tools/generate-single-service-image.ts`

This tool can be reused for generating other service hero images with similar requirements:

```bash
tsx tools/generate-single-service-image.ts <service-name>
```

Currently supports:

- `commercial-scaffolding` (✅ generated)

To add more services, update the `SERVICE_PROMPTS` object in the script.

## Next Steps

None required - the task is complete. The new image is live and appropriate for the South Coast UK market.
