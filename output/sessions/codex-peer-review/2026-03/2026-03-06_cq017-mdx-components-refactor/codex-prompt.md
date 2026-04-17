# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-03-06_cq017-mdx-components-refactor/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise
```

---

## Brief: CQ-017 — mdx-components.tsx Refactor

**Date:** 2026-03-06
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

`sites/colossus-scaffolding/mdx-components.tsx` is 963 lines — all MDX custom component definitions are crammed into a single file. This is the last open finding (CQ-017, LOW severity) from a 59-item code review. The file needs to be split into smaller, focused component files for maintainability.

Additionally, several component categories within the file are duplicated across sites (base-template, dj-fox-electrical, colossus-scaffolding), while others are colossus-specific. The refactor should consider which components belong in shared packages vs site-specific directories.

### Goals

1. Break `sites/colossus-scaffolding/mdx-components.tsx` from 963 lines into smaller, focused files
2. Identify and eliminate duplication across sites where components are identical
3. Keep the `mdxComponents` map as the single assembly point (thin file that imports and re-exports)
4. Maintain all existing MDX content rendering — zero visual regressions

### Non-Goals

- Changing the visual design of any component
- Adding new MDX components
- Modifying MDX content files
- Refactoring base-template or dj-fox mdx-components in this PR (though the plan should note what could be shared later)

### Acceptance Criteria

- `sites/colossus-scaffolding/mdx-components.tsx` is under 100 lines (just imports + map assembly)
- All extracted components live in appropriately named files
- `npm run build` passes for colossus-scaffolding
- `npm run type-check` passes for colossus-scaffolding
- All 18 service MDX pages render identically (they use CoverageSection, ServiceIntro, RelatedServices, Benefits)
- No blog MDX pages break (blog content exists but doesn't use the blog-specific MDX components yet)

### Constraints

- **Named exports only** — no default exports (project convention per CLAUDE.md)
- **TypeScript interfaces for all props** — must be co-located or exported with each component
- **Theme tokens only** — no hardcoded hex colors (existing components already follow this)
- **Next.js App Router** — `mdx-components.tsx` must remain at project root with `useMDXComponents` export (Next.js convention)
- **MDX content files must not change** — component names used in MDX (`<CoverageSection>`, `<ServiceIntro>`, etc.) must remain identical
- **Site-specific components stay site-specific** — components with hardcoded colossus copy (like ServiceIntro's "TG20:21 Compliant" text) should not move to shared packages

### Relevant Architecture

**How MDX components work in this platform:**

- Each site has a root-level `mdx-components.tsx` that exports `useMDXComponents()` — this is how Next.js discovers the component map
- The file defines custom React components and maps them to MDX tag names
- Components use a "data holder" pattern: child components render `null` and are only used as structured data carriers (e.g., `<ServiceLink>` holds props, `<RelatedServices>` extracts them via `React.Children`)
- Service MDX content uses these custom components inline: `<RelatedServices><ServiceLink href="..." title="..." /></RelatedServices>`

**Component categories in the 963-line file:**

1. **Service wrapper components** (~430 lines) — RelatedServices/ServiceLink, Benefits/BenefitItem, CoverageSection/RegionCard/LocationTag, ServiceIntro/ProcessStep/SidebarItem — used in 18 service MDX files
2. **Blog components** (~400 lines) — InfoBox, FeatureCard/FeatureGrid, ComparisonTable/ComparisonRow, CheckList, QuoteBlock, ImageWithCaption, StepByStep/Step — defined but **never used in any MDX content** (0 occurrences in content/\*_/_.mdx)
3. **Base HTML overrides** (~80 lines) — a, h2, h3, p, ul, ol, li, strong, hr, img — standard MDX element styling
4. **Component map assembly** (~30 lines) — the `mdxComponents` object and `useMDXComponents` function

**Duplication across sites:**

- `InfoBox` is defined identically in all 3 sites (colossus, base-template, dj-fox)
- Base HTML overrides (h2, h3, p, ul, ol, li, etc.) are similar across sites but may have minor styling differences
- Blog components (FeatureCard, StepByStep, etc.) exist in base-template and dj-fox (276 lines each) but are also duplicated in colossus
- Service wrapper components (CoverageSection, ServiceIntro, etc.) are **colossus-only** — they don't exist in other sites

**Shared packages:**

- `packages/core-components/` — shared component primitives (Schema, ServiceBenefits, ContentCard, ArticleCallout)
- `packages/themes/` — theme packages (orion, vega)
- No shared MDX component package exists currently

### Codebase Snapshot

| File                                            | Lines             | Purpose                                |
| ----------------------------------------------- | ----------------- | -------------------------------------- |
| `sites/colossus-scaffolding/mdx-components.tsx` | 963               | THE file to refactor                   |
| `sites/base-template/mdx-components.tsx`        | 276               | Gold-standard template version         |
| `sites/dj-fox-electrical/mdx-components.tsx`    | 276               | DJ Fox version (matches base-template) |
| `sites/colossus-scaffolding/components/ui/`     | 3 files           | Existing site-specific components      |
| `packages/core-components/src/components/ui/`   | shared components | ServiceBenefits, ContentCard, etc.     |

### What a Good Plan Should Cover

1. **File organization** — Where do extracted components go? `components/mdx/`? `components/ui/`? A new directory?
2. **Grouping strategy** — One file per component, or group related components (e.g., CoverageSection + RegionCard + LocationTag in one file)?
3. **The data-holder pattern** — Components like ServiceLink and BenefitItem render `null` and exist only as prop carriers. Should they be co-located with their parent component or separate?
4. **Unused blog components** — They're defined but never used in content. Delete them? Keep them for future use? Extract to shared package?
5. **Import/export structure** — How does the slim mdx-components.tsx import everything? Barrel file? Direct imports?
6. **Verification approach** — How to confirm zero visual regressions after the refactor?
7. **Future sharing** — What would it take to share the duplicated components (InfoBox, base HTML overrides) across sites later?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-03-06_cq017-mdx-components-refactor/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise`
