# Claude's Plan: CQ-017 — mdx-components.tsx Refactor

**Date:** 2026-03-06
**Author:** Claude (independent plan, written before seeing Codex output)

---

## Analysis

The 963-line file breaks down into four clear categories:

| Category | Lines | Components | Used in Content? |
|----------|-------|------------|-----------------|
| Service wrappers | ~430 | RelatedServices, ServiceLink, Benefits, BenefitItem, CoverageSection, RegionCard, LocationTag, ServiceIntro, ProcessStep, SidebarItem | Yes — 18 service MDX files, 54 occurrences |
| Blog components | ~400 | InfoBox, FeatureCard, FeatureGrid, ComparisonTable, ComparisonRow, CheckList, QuoteBlock, ImageWithCaption, StepByStep, Step | No — 0 occurrences in any MDX content |
| Base HTML overrides | ~80 | a, h2, h3, p, ul, ol, li, strong, hr, img | Yes — applied to all MDX rendering |
| Map assembly | ~30 | mdxComponents object, useMDXComponents | Yes — entry point |

Key insight: the blog components account for ~400 lines and are **never used**. The service wrappers are colossus-specific and heavily used. The HTML overrides are likely duplicated across sites.

## Plan

### Phase 1: Create extraction directory and files

Create `sites/colossus-scaffolding/components/mdx/` as the home for extracted MDX components. This keeps them separate from general UI components in `components/ui/`.

**Files to create:**

1. **`components/mdx/service-wrappers.tsx`** (~200 lines)
   - `RelatedServices`, `ServiceLink` (and their interfaces)
   - `Benefits`, `BenefitItem` (and their interfaces)

   Rationale: RelatedServices uses ServiceLink as a data holder (checks `child.type === ServiceLink`), so they MUST be co-located in the same file. Same for Benefits/BenefitItem.

2. **`components/mdx/coverage-section.tsx`** (~160 lines)
   - `CoverageSection`, `RegionCard`, `LocationTag` (and their interfaces)

   Rationale: Same data-holder dependency chain. CoverageSection filters for RegionCard children, RegionCard filters for LocationTag children.

3. **`components/mdx/service-intro.tsx`** (~180 lines)
   - `ServiceIntro`, `ProcessStep`, `SidebarItem` (and their interfaces)

   Rationale: Same pattern — ServiceIntro extracts ProcessStep and SidebarItem children. Contains colossus-specific hardcoded copy ("TG20:21 Compliant", "£10M public liability").

4. **`components/mdx/blog-components.tsx`** (~400 lines)
   - `InfoBox`, `FeatureCard`, `FeatureGrid`, `ComparisonTable`, `ComparisonRow`, `CheckList`, `QuoteBlock`, `ImageWithCaption`, `StepByStep`, `Step` (and their interfaces)

   Rationale: Group all blog components together. Even though unused, keeping them available costs nothing at build time (tree-shaking) and they may be used when blog content is enriched later. Deleting them risks losing work that was intentionally written.

5. **`components/mdx/html-overrides.tsx`** (~80 lines)
   - `MdxLink`, `MdxH2`, `MdxH3`, `MdxP`, `MdxUl`, `MdxOl`, `MdxLi`, `MdxStrong`, `MdxHr`, `MdxImg` (and their types)

   Rationale: These are the base HTML element overrides. Extracting them makes it easy to see what styling is applied to standard markdown elements.

6. **`components/mdx/index.ts`** — barrel export file
   - Re-exports everything from the 5 files above
   - This is the single import point for mdx-components.tsx

**Modified files:**

7. **`sites/colossus-scaffolding/mdx-components.tsx`** — slim down to ~50 lines
   - Import all components from `./components/mdx`
   - Import `Schema` from `@platform/core-components`
   - Assemble the `mdxComponents` map
   - Export `useMDXComponents`

### Phase 2: Execute extraction

Work bottom-up to avoid breaking imports:

1. Create `components/mdx/` directory
2. Extract HTML overrides → `html-overrides.tsx`
3. Extract service wrappers → `service-wrappers.tsx`
4. Extract coverage section → `coverage-section.tsx`
5. Extract service intro → `service-intro.tsx`
6. Extract blog components → `blog-components.tsx`
7. Create barrel `index.ts`
8. Rewrite `mdx-components.tsx` to import from barrel

**Verification gate:** `npm run type-check` must pass after this phase.

### Phase 3: Verify build and rendering

1. Run `npm run build` in colossus-scaffolding
2. Run `npm run dev` and spot-check:
   - A service page that uses all 3 service wrapper groups (e.g., residential-scaffolding)
   - The homepage
   - A blog post
3. Run `npm test` if unit tests exist for MDX rendering

**Verification gate:** Build succeeds, pages render identically.

### Phase 4: Update remediation audit

Update `output/sessions/2026-02-07_code-review/remediation-audit.md`:
- Move CQ-017 from "Still Open" to "Fixed" table
- Update evidence column with the extraction details
- Update summary counts (0 findings remaining)

---

## File Structure After Refactor

```
sites/colossus-scaffolding/
├── mdx-components.tsx              # ~50 lines (imports + map assembly)
├── components/
│   ├── mdx/
│   │   ├── index.ts                # barrel exports
│   │   ├── html-overrides.tsx      # ~80 lines (a, h2, h3, p, ul, ol, li, strong, hr, img)
│   │   ├── service-wrappers.tsx    # ~200 lines (RelatedServices, ServiceLink, Benefits, BenefitItem)
│   │   ├── coverage-section.tsx    # ~160 lines (CoverageSection, RegionCard, LocationTag)
│   │   ├── service-intro.tsx       # ~180 lines (ServiceIntro, ProcessStep, SidebarItem)
│   │   └── blog-components.tsx     # ~400 lines (InfoBox, FeatureCard, FeatureGrid, etc.)
│   └── ui/
│       ├── services-overview.tsx   # existing
│       ├── ContactForm.tsx         # existing
│       └── accreditation-section.tsx # existing
```

## Risks and Trade-offs

### Risk 1: Data-holder pattern breaks if components are in separate files
The `React.Children.toArray(children).filter(child => child.type === ServiceLink)` pattern relies on referencing the exact component function. If `ServiceLink` is imported from a different module than where it's checked, the reference comparison still works — **as long as it's the same import**. This is safe because both the parent component and the mdx-components map import from the same barrel file.

**Mitigation:** Verify with a build + manual check of a service page.

### Risk 2: Unused blog components — keep or delete?
Keeping ~400 lines of unused code is technically debt. However:
- The components were intentionally written (they're well-crafted with icons, styling variants)
- Blog content exists (5 posts) and may use them in future
- Deleting and re-creating later is more expensive than keeping them
- They're in a clearly labeled file (`blog-components.tsx`)

**Decision:** Keep them. Note in a comment that they're available for future blog content enrichment.

### Risk 3: Breaking barrel import cycles
If `components/mdx/index.ts` re-exports components that import from each other, circular dependencies could occur. In this case, no component imports from another extracted file — they only import React, Next.js Link/Image. No risk here.

### Trade-off: Single blog-components.tsx vs individual files
The blog components file will still be ~400 lines. Could split further into `blog-callouts.tsx` (InfoBox, QuoteBlock), `blog-content.tsx` (FeatureCard, FeatureGrid, CheckList), `blog-data.tsx` (ComparisonTable, StepByStep). But since these components are unused, the extra file granularity provides little benefit and adds noise. If/when blog content starts using them, we can split further.

## Future Work (Out of Scope)

1. **Shared MDX components package** — InfoBox and HTML overrides are duplicated in base-template and dj-fox. A `packages/mdx-components/` package could eliminate this duplication. This refactor makes that easier by having clean extracted files to move.
2. **Parameterize ServiceIntro** — Currently has hardcoded "TG20:21 Compliant" and "£10M public liability" text. Could accept these as props to make it reusable across sites.
3. **Delete unused blog components** — If after 3+ months they're still unused in content, consider removing them.
