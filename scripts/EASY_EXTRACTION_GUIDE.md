# Easiest Way to Extract baseline.json

## TL;DR - Copy & Paste Method (5 minutes)

### Step 1: Open the Source File

```bash
code app/services/[slug]/page.tsx
# OR open in any text editor
```

### Step 2: Select and Copy

1. Scroll to line 62: `function getServiceData(slug: string) {`
2. Find line 63: `const serviceDataMap: Record<string, ServiceData> = {`
3. **Select from line 64 to line 754** (the entire object content)
4. Copy to clipboard (Cmd+C / Ctrl+C)

### Step 3: Use This Online Tool

Go to: https://transform.tools/typescript-to-json

1. Paste the TypeScript object
2. It will automatically convert to JSON
3. Copy the result

### Step 4: Save the JSON

Create: `scripts/migration-snapshots/baseline.json`

Paste the converted JSON

### Step 5: Fix getServiceFAQs() Calls

The JSON will have function calls that won't work. Run:

```bash
node scripts/convert-servicemap-to-json.js --generate-faqs
```

This generates all the FAQ arrays. Replace each `getServiceFAQs("...")` with the corresponding array.

## Alternative: VS Code Find & Replace (10 minutes)

### Step 1: Copy serviceDataMap

Copy lines 63-755 from `app/services/[slug]/page.tsx` to a new temp file

### Step 2: Replace Property Names

**Find**: `^(\s+)([a-zA-Z]+):`
**Replace**: `$1"$2":`
**Regex**: ON

This converts:

```typescript
title: "...";
```

To:

```json
    "title": "..."
```

### Step 3: Handle FAQs

Generate all FAQs:

```bash
node scripts/convert-servicemap-to-json.js --generate-faqs > faqs-output.txt
```

Then manually replace each:

```typescript
faqs: getServiceFAQs("access scaffolding"),
```

With the corresponding array from faqs-output.txt

### Step 4: Wrap in Object

Add `{` at start and `}` at end

### Step 5: Validate

```bash
node -e "JSON.parse(require('fs').readFileSync('scripts/migration-snapshots/baseline.json', 'utf-8'))"
```

No output = valid JSON ✅
Error = fix the syntax issue ❌

## Super Easy Method: Let Me Do It For You

If you want, I can:

1. Read the page.tsx file
2. Extract each service manually
3. Generate the complete baseline.json

Just ask: "Please extract the baseline for me"

## What the baseline.json Should Look Like

```json
{
  "access-scaffolding": {
    "title": "Access Scaffolding Services",
    "description": "...",
    "badge": "Most Popular",
    "heroImage": "/Access-Scaffolding-new-build.png",
    "benefits": [
      "Benefit 1",
      "Benefit 2"
    ],
    "faqs": [
      {
        "question": "Question?",
        "answer": "Answer."
      }
    ]
  },
  "facade-scaffolding": {
    ...
  },
  ...
}
```

## How Many Services?

From inventory.json, we have **25 services** that need to be in the baseline:

✅ **Base Services (19)**

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

✅ **Location-Specific Services (6)**

- commercial-scaffolding-brighton
- commercial-scaffolding-canterbury
- commercial-scaffolding-hastings
- residential-scaffolding-brighton
- residential-scaffolding-canterbury
- residential-scaffolding-hastings

## Why Do We Need This?

The baseline.json is our **source of truth** for testing. After migrating to MDX, we'll:

1. Parse the MDX frontmatter
2. Compare it field-by-field with baseline.json
3. Ensure 100% match = zero regression

## Next Steps After baseline.json Exists

```bash
# Run the comparison test
npm run test:migration -- --phase compare

# Should output:
# ✅ Passed: 25/25 services
# ❌ Failed: 0/25 services
```

## Need Help?

Just say "extract the baseline for me" and I'll do it programmatically.
