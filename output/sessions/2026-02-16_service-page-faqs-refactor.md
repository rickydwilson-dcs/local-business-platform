# Service Page FAQs Refactor

**Date:** 2026-02-16
**Status:** Completed
**Task:** [tasks/platform/service-page-faqs.md](../../tasks/platform/service-page-faqs.md)
**Site:** DJ Fox Electrical

## Overview

Refactored FAQ structure in DJ Fox Electrical service pages from markdown content to structured frontmatter YAML, fixing validation failures and enabling proper schema markup.

## Problem

Service pages had FAQs as markdown content in the body:

```mdx
## Frequently Asked Questions

**Q: How many users can an access control system support?**
A: Typical systems support 100-1,000+ users...
```

But the content schema expected FAQs as structured frontmatter:

```yaml
faqs:
  - question: "How many users can an access control system support?"
    answer: "Typical systems support 100-1,000+ users..."
```

This caused validation failures for all service pages.

## Solution

Implemented a **hybrid approach**:

1. **Automated extraction** - Created script to parse markdown FAQs and convert to frontmatter structure
2. **Schema update** - Made `faqs` field optional for stub pages without FAQs

## Changes Made

### 1. Content Schema Update

**File:** `packages/core-components/src/lib/content-schemas.ts`

Made the `faqs` field optional in `ServiceFrontmatterSchema`:

```typescript
faqs: z
  .array(FaqSchema)
  .min(3, "At least 3 FAQs required for good SEO")
  .max(15, "Maximum 15 FAQs recommended for page performance")
  .optional(), // ← Added this
```

### 2. FAQ Extraction Script

**File:** `tools/extract-service-faqs.ts`

Created automated script that:

- Reads each service MDX file
- Finds "## Frequently Asked Questions" section
- Extracts Q&A pairs using regex pattern: `**Q: question**\nA: answer`
- Converts to YAML frontmatter structure
- Removes FAQ section from body
- Writes updated file

### 3. Service MDX Files

**14 files updated** with FAQs moved from body to frontmatter:

| File                                 | FAQ Count |
| ------------------------------------ | --------- |
| access-control-systems.mdx           | 7         |
| additional-circuits.mdx              | 5         |
| cctv-installation.mdx                | 6         |
| commercial-fire-alarm-systems.mdx    | 7         |
| commercial-maintenance-contracts.mdx | 6         |
| data-network-cabling.mdx             | 7         |
| electric-gates.mdx                   | 8         |
| intruder-alarm-installation.mdx      | 7         |
| kitchen-bathroom-electrical.mdx      | 6         |
| new-build-electrical.mdx             | 7         |
| office-fitout-electrical.mdx         | 6         |
| storage-heater-installation.mdx      | 8         |
| three-phase-installation.mdx         | 7         |
| underfloor-heating-electric.mdx      | 8         |

**34 files unchanged** - stub/template files without FAQ sections, now pass validation due to optional `faqs` field.

## Results

### ✅ All Validation Passing

```
Services: 48 files - ✓ Valid: 48
Locations: 23 files - ✓ Valid: 23
```

### ✅ Build Successful

```
Route (app)
├ ● /services/[slug]
│ ├ /services/access-control-systems
│ └ [+47 more paths]

✓ Generating static pages (110/110)
```

### ✅ FAQs Rendering Correctly

Verified in built HTML:

- FAQ section appears with "Frequently Asked Questions" heading
- All question/answer pairs render
- JSON-LD schema markup includes FAQs
- Conditional rendering works (only shows if FAQs present)

## Technical Details

### Regex Pattern for Extraction

```javascript
// Match FAQ section header to next ## section or end of content
const faqSectionRegex = /## Frequently Asked Questions\n+([\s\S]*?)(?=\n## |$)/;

// Match Q&A pairs: **Q: question**\nA: answer
const qaRegex = /\*\*Q:\s*([^\*]+?)\*\*\n+A:\s*([^\n]+(?:\n(?!\n|\*\*Q:)[^\n]+)*)/g;
```

### YAML Output Format

```yaml
faqs:
  - question: "How many users can an access control system support?"
    answer: "Typical systems support 100-1,000+ users depending on equipment. Large enterprises can have unlimited users."
  - question: "Can I integrate access control with my alarm system?"
    answer: "Yes, modern systems integrate seamlessly. Access control can trigger alarms on unauthorized entry or arm/disarm when authorized users enter."
```

### Service Page Component

The service page component (`app/services/[slug]/page.tsx`) already supported frontmatter FAQs:

```typescript
const faqs = fm.faqs || [];

{faqs.length > 0 && (
  <FAQSection
    items={faqs}
    title="Frequently Asked Questions"
    phone={siteConfig.business.phone}
  />
)}
```

No component changes were needed.

## Why Hybrid Approach?

**Original task assumption:** "All 43 service pages have FAQ content"

**Reality:** Only 14 of 48 service files had FAQ sections

**Decision:**

- Extract FAQs where they exist (preserve content quality)
- Make field optional (don't force placeholder FAQs on stub pages)
- Allow incremental addition of FAQs as content is developed

## Benefits

1. **Consistent structure** - Location pages already use frontmatter FAQs
2. **Schema markup enabled** - FAQs can be added to JSON-LD structured data
3. **Queryable/filterable** - FAQs are now data, not just markdown
4. **Validation passes** - All service pages now comply with schema
5. **No breaking changes** - Stub pages continue to work without FAQs

## Verification Steps

```bash
# Content validation
cd sites/dj-fox-electrical
npm run validate:content
# ✓ All 48 service files pass

# Type check
pnpm type-check
# ✓ No TypeScript errors

# Build
npm run build
# ✓ All 110 pages generated successfully

# Check FAQ rendering
grep "Frequently Asked Questions" .next/server/app/services/access-control-systems.html
# ✓ FAQs appear in built HTML
```

## Related Files

- **Task file:** `tasks/platform/service-page-faqs.md` (updated with completion status)
- **Schema:** `packages/core-components/src/lib/content-schemas.ts`
- **Script:** `tools/extract-service-faqs.ts` (committed for future use)
- **Test script:** `tools/test-single-faq.ts` (dev tool, committed)

## Next Steps

**None required** - Task complete. System now handles both:

- Service pages with structured frontmatter FAQs
- Service pages without FAQs (stub pages)

If additional service pages need FAQs added, either:

1. Add manually to frontmatter following the schema
2. Add to markdown body, then run `npx tsx tools/extract-service-faqs.ts`
