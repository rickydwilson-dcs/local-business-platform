# Service Page FAQs - Structure Issue

**Status:** Backlog
**Priority:** Medium
**Created:** 2026-02-15
**Site:** DJ Fox Electrical

## Problem

All 43 service pages have FAQ content but it's structured incorrectly:

- FAQs exist as **markdown content** in the body (H2 headings with Q&A format)
- Content schema expects FAQs as **structured frontmatter** (YAML array with `question` and `answer` fields)
- This causes validation failures for all service pages

## Example

**Current structure (incorrect):**

```mdx
---
title: Access Control Systems
description: Professional installation...
price_range: "£££-££££"
typical_duration: "1-2 days"
# No faqs field in frontmatter
---

## Frequently Asked Questions

Q: How many users can an access control system support?
A: Typical systems support 100-1,000+ users...
```

**Expected structure (correct):**

```mdx
---
title: Access Control Systems
description: Professional installation...
price_range: "£££-££££"
typical_duration: "1-2 days"
faqs:
  - question: "How many users can an access control system support?"
    answer: "Typical systems support 100-1,000+ users depending on equipment..."
  - question: "Can I integrate access control with my alarm system?"
    answer: "Yes, modern systems integrate seamlessly..."
---

Content body here...
```

## Affected Files (43 total)

All files in `sites/dj-fox-electrical/content/services/`:

1. access-control-systems.mdx
2. additional-circuits.mdx
3. additional-sockets.mdx
4. battery-storage-installation.mdx
5. cctv-installation.mdx
6. circuit-repair.mdx
7. commercial-fire-alarm-systems.mdx
8. commercial-maintenance-contracts.mdx
9. consumer-unit-upgrade.mdx
10. data-network-cabling.mdx
11. dimmer-switch-installation.mdx
12. electric-cooker-installation.mdx
13. electric-gates.mdx
14. electric-shower-installation.mdx
15. electrical-safety-certificate.mdx
16. emergency-electrical-callout.mdx
17. emergency-lighting-testing.mdx
18. ev-charger-installation.mdx
19. extractor-fan-installation.mdx
20. fault-finding.mdx
21. fire-alarm-installation.mdx
22. garden-lighting.mdx
23. intruder-alarm-installation.mdx
24. kitchen-bathroom-electrical.mdx
25. landlord-safety-package.mdx
26. led-lighting-upgrade.mdx
27. light-switch-repair.mdx
28. lighting-installation.mdx
29. new-build-electrical.mdx
30. office-fitout-electrical.mdx
31. outdoor-socket-installation.mdx
32. pat-testing.mdx
33. power-outage-restoration.mdx
34. rewiring.mdx
35. security-lighting.mdx
36. smart-home-wiring.mdx
37. smart-lighting.mdx
38. socket-repair.mdx
39. solar-panel-installation.mdx
40. storage-heater-installation.mdx
41. three-phase-installation.mdx
42. underfloor-heating-electric.mdx
43. usb-socket-installation.mdx

## Solution Options

### Option A: Refactor (Recommended)

Extract FAQ markdown from body → convert to frontmatter structure for all 43 files.

**Pros:**

- Consistent with location pages
- Enables FAQ schema on service pages
- Makes FAQs queryable/filterable

**Cons:**

- Manual work for 43 files
- Need to preserve exact Q&A text

**Estimate:** 2-3 hours

### Option B: Schema Update

Make `faqs` field optional in the service content schema.

**Pros:**

- Quick fix
- FAQs still display correctly (rendered from markdown)

**Cons:**

- Inconsistent structure vs location pages
- Can't query/filter service FAQs
- Technical debt remains

**Estimate:** 5 minutes

### Option C: Hybrid

Keep markdown FAQs for now, add frontmatter FAQs incrementally.

**Pros:**

- No breaking changes
- Gradual migration

**Cons:**

- Duplicate content during transition
- More complex

## Recommendation

**Option A (Full Refactoring)** - Worth doing properly to maintain consistency and enable future FAQ features (schema markup, filtering, etc.).

## Implementation Steps

If choosing Option A:

1. Create extraction script:
   - Read each service MDX file
   - Parse markdown FAQ section (look for "## Frequently Asked Questions" or similar)
   - Extract Q&A pairs from markdown
   - Convert to YAML frontmatter structure
   - Remove FAQ section from body
   - Write updated file

2. Run script across all 43 files

3. Validate all service pages pass content validation

4. Verify FAQs still render correctly on service pages

5. Update service page component if needed to read from frontmatter

## Related

- Location pages already use structured frontmatter FAQs (working correctly)
- Schema: `packages/core-components/src/lib/content-schemas.ts` - `ServiceFrontmatterSchema`
- Content standard: `docs/standards/content.md`

## Notes

- This is separate from the response time commitment removal work completed 2026-02-15
- Location pages validate successfully because they have proper frontmatter FAQs
- Service pages have good FAQ content, just in wrong format
