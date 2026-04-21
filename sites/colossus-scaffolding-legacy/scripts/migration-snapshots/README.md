# Service Migration Testing - Baseline Snapshots

## Overview

This directory contains baseline snapshots and testing infrastructure to ensure **zero regression** when migrating from serviceDataMap to MDX-first architecture.

## Current Status

✅ **Inventory created** - 25 services identified
⏳ **Baseline extraction** - Manual step required (see below)
⏳ **Visual tests** - Optional, requires Playwright
⏳ **Comparison tests** - Awaiting baseline.json

## Testing Strategy

### How We'll Ensure No Regression

1. **Data Comparison** (Most Critical)
   - Extract current serviceDataMap to JSON baseline
   - After migration, parse MDX frontmatter
   - Compare field-by-field (title, description, benefits, FAQs, etc.)
   - **Pass criteria**: 100% exact match

2. **Build Validation**
   - Current: `npm run build` succeeds
   - After migration: Build must still succeed
   - Verify all 25 service routes generate correctly

3. **Visual Comparison** (Optional but Recommended)
   - Screenshot all service pages before migration
   - Screenshot after migration
   - Pixel-diff comparison
   - **Pass criteria**: < 0.1% visual difference

4. **Metadata Validation**
   - Compare page titles, descriptions, keywords
   - Verify OpenGraph tags match
   - Validate schema.org JSON-LD identical

## Files in This Directory

```
migration-snapshots/
├── inventory.json              # List of all 25 services (✅ DONE)
├── baseline.json               # serviceDataMap as JSON (⏳ NEEDED)
├── TESTING_PLAN.md            # Full testing documentation
└── README.md                   # This file
```

## Next Step: Manual Baseline Extraction

### Why Manual?

The `serviceDataMap` in `app/services/[slug]/page.tsx` is 733 lines of complex TypeScript with nested objects, arrays, and template literals. Automated parsing would be error-prone.

### How to Extract

**Option A: Copy and Convert (Recommended)**

1. Open `app/services/[slug]/page.tsx`
2. Find the `getServiceData()` function (line 62)
3. Locate `const serviceDataMap: Record<string, ServiceData> = {`
4. Copy the entire object from line 63 to line 755 (`};`)
5. Create `baseline.json` in this directory
6. Convert TypeScript to valid JSON:
   - Remove `getServiceFAQs("...")` function calls - replace with actual arrays
   - Ensure all strings use double quotes
   - Remove trailing commas if any
7. Validate with: `node -e "JSON.parse(require('fs').readFileSync('baseline.json'))"`

**Option B: Runtime Extraction (Alternative)**

```bash
# Start dev server
npm run dev

# In another terminal, extract data
curl http://localhost:3000/api/extract-services > baseline.json
```

_(Note: Would require creating an API endpoint)_

### Baseline JSON Structure

```json
{
  "access-scaffolding": {
    "title": "Access Scaffolding Services",
    "description": "Safe, TG20:21-compliant access scaffolding...",
    "badge": "Most Popular",
    "heroImage": "/Access-Scaffolding-new-build.png",
    "benefits": [
      "TG20:21 compliant design and installation",
      ...
    ],
    "faqs": [
      {
        "question": "Do you provide access scaffolding in Brighton?",
        "answer": "Yes, we supply professional access scaffolding..."
      },
      ...
    ]
  },
  ...
}
```

## Running Comparison Tests

Once `baseline.json` exists:

```bash
# Compare MDX data with baseline
npm run test:migration -- --phase compare

# Expected output:
# ✅ Passed: 25/25 services
# ❌ Failed: 0/25 services
```

## Test Commands (Future)

```bash
# Create baseline (already done)
npm run test:snapshot

# Data comparison
npm run test:migration -- --phase compare

# Visual regression (optional)
npm run test:visual-regression

# Full test suite
npm run build && npm test
```

## Services Inventory

**Total: 25 services**

### Base Services (19)

- access-scaffolding
- facade-scaffolding
- edge-protection
- temporary-roof-systems
- birdcage-scaffolds
- scaffold-towers-mast-systems
- crash-decks-crane-decks
- heavy-duty-industrial-scaffolding
- pavement-gantries-loading-bays
- public-access-staircases
- scaffold-alarms
- scaffolding-design-drawings
- scaffolding-inspections-maintenance
- sheeting-netting-encapsulation
- staircase-towers
- suspended-scaffolding
- commercial-scaffolding
- industrial-scaffolding
- residential-scaffolding

### Location-Specific Services (6)

- commercial-scaffolding-brighton
- commercial-scaffolding-canterbury
- commercial-scaffolding-hastings
- residential-scaffolding-brighton
- residential-scaffolding-canterbury
- residential-scaffolding-hastings

## Migration Metadata

**Branch**: `feature/mdx-first-services`
**Commit**: `8f704aa`
**Created**: 2025-10-03T20:13:47.109Z

## Success Criteria

✅ All 25 services migrated
✅ 100% data match with baseline
✅ Build succeeds without errors
✅ All routes return 200
✅ Metadata/SEO unchanged
✅ No visual regressions
✅ Performance maintained or improved

## Rollback Plan

If tests fail:

```bash
git checkout main
git branch -D feature/mdx-first-services
```

Then investigate failures and retry.
