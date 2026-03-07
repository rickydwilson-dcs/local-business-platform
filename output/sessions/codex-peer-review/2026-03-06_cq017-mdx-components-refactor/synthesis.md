# Implementation Plan: CQ-017 — mdx-components.tsx Refactor

**Date:** 2026-03-06
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| Service file granularity | 3 files (service-wrappers combines RelatedServices+Benefits) | 4 files (one per feature group) | **Codex: 4 files.** Each service feature is independent — combining RelatedServices with Benefits saves only one file but obscures the separation. |
| Blog file granularity | 1 file (~400 lines) | 7 files (one per component) | **Claude: 1 file.** Blog components are unused in content. Splitting unused code into 7 files adds noise. One `blog-components.tsx` is sufficient; split later if/when they're used. |
| Directory structure | Flat `components/mdx/*.tsx` | Nested subdirs (`service/`, `blog/`, `base-elements/`) | **Hybrid.** Use subdirectories for service components (4 files warrants grouping) but keep blog-components.tsx and html-overrides.tsx at the `mdx/` level since they're single files. |
| Shared types file | None | `types.ts` | **Neither.** Props interfaces are co-located with their components — no shared types exist between modules, so a separate file adds indirection for no benefit. |
| Default export | Named only (per CLAUDE.md convention) | Keep default export for `lib/mdx.tsx` compat | **Codex.** The existing `lib/mdx.tsx:10` does `import mdxComponents from "@/mdx-components"`. Removing the default export breaks this. Keep both `export default mdxComponents` and the named `useMDXComponents`. |
| Verification approach | Manual spot-check | Explicit grep/wc commands at each gate | **Codex.** Concrete verification commands are more reliable than "spot-check". |

## Blind Spots Caught

- **Codex caught:** `lib/mdx.tsx` imports `mdxComponents` as a **default import** (`import mdxComponents from "@/mdx-components"`). Claude's plan mandated "named exports only" per CLAUDE.md convention, which would break this import at build time. The synthesised plan keeps the default export.
- **Codex caught:** Explicit "move code mechanically first, then format only" guidance to prevent accidental className/token edits during extraction. Good discipline for a pure-refactor PR.
- **Claude caught:** The barrel file circular dependency analysis — confirmed no cross-module imports exist between extracted files, so the barrel pattern is safe.
- **Claude caught:** Future parameterization of ServiceIntro's hardcoded copy as a concrete follow-up item.

---

## Implementation Plan

### Phase 0: Baseline Verification (read-only)

Confirm the starting state before touching any code.

**Steps:**
1. Verify service component usage: `rg -l "<(CoverageSection|ServiceIntro|RelatedServices|Benefits)\b" sites/colossus-scaffolding/content/services --glob '*.mdx' | wc -l` → expect 18
2. Verify blog components are unused: `rg -n "<(InfoBox|FeatureCard|FeatureGrid|ComparisonTable|CheckList|QuoteBlock|ImageWithCaption|StepByStep)\b" sites/colossus-scaffolding/content --glob '*.mdx'` → expect 0 matches
3. Verify current default import: `rg "import.*from.*mdx-components" sites/colossus-scaffolding/lib/` → expect `lib/mdx.tsx` default import
4. Capture baseline: `pnpm --filter colossus-scaffolding build` passes

**Verification gate:** All 4 checks pass. Do not proceed if build is broken.

---

### Phase 1: Create Directory Structure

```
sites/colossus-scaffolding/components/mdx/
├── service/
│   ├── related-services.tsx
│   ├── benefits.tsx
│   ├── coverage-section.tsx
│   └── service-intro.tsx
├── blog-components.tsx
├── html-overrides.tsx
└── index.ts
```

**Steps:**
1. `mkdir -p sites/colossus-scaffolding/components/mdx/service`

**Files created:** Directory only. No code yet.

---

### Phase 2: Extract Service Components (highest regression risk — do first)

Move code mechanically. No className, token, or logic changes. Copy-paste the exact JSX.

**Step 2a: `components/mdx/service/related-services.tsx`**
- Move: `ServiceLinkProps`, `ServiceLink`, `RelatedServicesProps`, `RelatedServices`
- Imports needed: `React`, `ContentCard` from `@platform/core-components`
- Named exports: `ServiceLink`, `RelatedServices`

**Step 2b: `components/mdx/service/benefits.tsx`**
- Move: `BenefitItemProps`, `BenefitItem`, `BenefitsProps`, `Benefits`
- Imports needed: `React`, `ServiceBenefits` from `@platform/core-components`
- Named exports: `BenefitItem`, `Benefits`

**Step 2c: `components/mdx/service/coverage-section.tsx`**
- Move: `LocationTagProps`, `LocationTag`, `RegionCardProps`, `RegionCard`, `CoverageSectionProps`, `CoverageSection`
- Imports needed: `React`, `Link` from `next/link`
- Named exports: `LocationTag`, `RegionCard`, `CoverageSection`

**Step 2d: `components/mdx/service/service-intro.tsx`**
- Move: `ProcessStepProps`, `ProcessStep`, `SidebarItemProps`, `SidebarItem`, `ServiceIntroProps`, `ServiceIntro`
- Imports needed: `React`
- Named exports: `ProcessStep`, `SidebarItem`, `ServiceIntro`
- Note: Contains colossus-specific hardcoded copy ("TG20:21 Compliant", "£10M public liability"). Leave as-is per constraints.

**Verification gate:**
- `pnpm --filter colossus-scaffolding type-check` passes (root file still has the old code plus the new files — no breakage)

---

### Phase 3: Extract Blog Components and HTML Overrides

**Step 3a: `components/mdx/blog-components.tsx`**
- Move all blog components into one file: `InfoBox`, `FeatureCard`, `FeatureGrid`, `ComparisonTable`, `ComparisonRow`, `CheckList`, `QuoteBlock`, `ImageWithCaption`, `StepByStep`, `Step`
- Imports needed: `React`, `Image` from `next/image`
- Named exports for all components

**Step 3b: `components/mdx/html-overrides.tsx`**
- Move all base HTML element overrides: `a`, `h2`, `h3`, `p`, `ul`, `ol`, `li`, `strong`, `hr`, `img`
- Export as named constants: `MdxLink`, `MdxH2`, `MdxH3`, `MdxP`, `MdxUl`, `MdxOl`, `MdxLi`, `MdxStrong`, `MdxHr`, `MdxImg`
- Imports needed: `React`, `Link` from `next/link`, `Image` from `next/image`

**Verification gate:**
- `pnpm --filter colossus-scaffolding type-check` passes

---

### Phase 4: Create Barrel and Rewrite Root File

**Step 4a: `components/mdx/index.ts`**
```ts
// Service components
export { RelatedServices, ServiceLink } from './service/related-services';
export { Benefits, BenefitItem } from './service/benefits';
export { CoverageSection, RegionCard, LocationTag } from './service/coverage-section';
export { ServiceIntro, ProcessStep, SidebarItem } from './service/service-intro';

// Blog components
export {
  InfoBox, FeatureCard, FeatureGrid,
  ComparisonTable, ComparisonRow, CheckList,
  QuoteBlock, ImageWithCaption, StepByStep, Step,
} from './blog-components';

// HTML overrides
export {
  MdxLink, MdxH2, MdxH3, MdxP, MdxUl, MdxOl,
  MdxLi, MdxStrong, MdxHr, MdxImg,
} from './html-overrides';
```

**Step 4b: Rewrite `mdx-components.tsx`**
- Import all components from `./components/mdx`
- Import `Schema` from `@platform/core-components`
- Assemble the `mdxComponents: MDXMap` map (mapping HTML tags to overrides, custom component names to components)
- `export default mdxComponents` (keep for `lib/mdx.tsx` compatibility)
- `export function useMDXComponents(components: MDXMap): MDXMap` (Next.js convention)

Target: **under 80 lines**.

**Verification gate:**
- `wc -l sites/colossus-scaffolding/mdx-components.tsx` < 100
- `pnpm --filter colossus-scaffolding type-check` passes
- `pnpm --filter colossus-scaffolding build` passes

---

### Phase 5: Visual Regression Verification

**Steps:**
1. `pnpm --filter colossus-scaffolding build` — full production build
2. `npm run dev` (from colossus-scaffolding) — start dev server
3. Check a service page with all wrapper types (e.g., `/services/residential-scaffolding`) — verify CoverageSection, ServiceIntro, RelatedServices, Benefits all render
4. Check the homepage
5. Check a blog post (e.g., `/blog/scaffolding-safety-what-to-expect`) — verify base HTML rendering (headings, lists, links, images)
6. Run `npm test` if unit tests exist

**Verification gate:** Build succeeds, all checked pages render identically to before.

---

### Phase 6: Update Remediation Audit

Update `output/sessions/2026-02-07_code-review/remediation-audit.md`:
- Move CQ-017 from "Still Open" table to "Fixed" table
- Evidence: `components/mdx/` directory created with 7 files; root mdx-components.tsx reduced to <100 lines
- Update summary counts: 0 CRITICAL, 0 HIGH, 0 MEDIUM, **0 LOW** remaining
- Update "Confirmed still open" count from 1 to 0

---

## File Structure After Refactor

```
sites/colossus-scaffolding/
├── mdx-components.tsx                          # ~70 lines (imports + map + exports)
├── lib/
│   └── mdx.tsx                                 # unchanged (default import still works)
├── components/
│   ├── mdx/
│   │   ├── index.ts                            # barrel re-exports
│   │   ├── html-overrides.tsx                  # ~80 lines
│   │   ├── blog-components.tsx                 # ~400 lines (unused but retained)
│   │   └── service/
│   │       ├── related-services.tsx            # ~80 lines
│   │       ├── benefits.tsx                    # ~30 lines
│   │       ├── coverage-section.tsx            # ~160 lines
│   │       └── service-intro.tsx               # ~180 lines
│   └── ui/                                     # existing, untouched
│       ├── services-overview.tsx
│       ├── ContactForm.tsx
│       └── accreditation-section.tsx
```

**Total new files:** 7 (4 service + 1 blog + 1 html-overrides + 1 barrel)
**Modified files:** 1 (mdx-components.tsx)
**Deleted files:** 0

---

## Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| `child.type === Holder` breaks if data-holder is a different reference | HIGH | Co-locate holder + parent in same file; both MDX map and parent import from same barrel |
| Default export removal breaks `lib/mdx.tsx` | HIGH | Keep `export default mdxComponents` in root file |
| Accidental className/token edit during extraction | MEDIUM | Move code mechanically (copy-paste), format only after verification passes |
| Unused blog components bloat | LOW | Acceptable — clearly labeled file, defer deletion decision |

## Future Work (Separate PRs)

1. **Shared MDX components package** (`packages/mdx-components/`) — deduplicate InfoBox, QuoteBlock, ImageWithCaption, and HTML overrides across all 3 sites. This refactor creates clean extraction boundaries that make the move straightforward.
2. **Parameterize ServiceIntro** — replace hardcoded "TG20:21 Compliant" and "£10M public liability" with props, enabling reuse across sites.
3. **Blog component adoption** — enrich colossus blog content with the available components (InfoBox, FeatureCard, StepByStep, etc.) that are now cleanly extracted and ready to use.
