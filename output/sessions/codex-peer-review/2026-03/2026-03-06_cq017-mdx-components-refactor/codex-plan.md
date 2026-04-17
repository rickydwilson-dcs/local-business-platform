# CQ-017 Implementation Plan (Codex)

1. Baseline inventory and safety snapshot

- Scope and inventory:
  - Confirm current line counts and component boundaries in `sites/colossus-scaffolding/mdx-components.tsx`.
  - Confirm actual MDX usage:
    - Service wrappers used in 18 files under `sites/colossus-scaffolding/content/services/*.mdx`.
    - Blog-specific MDX components currently unused in content.
- Files touched:
  - None (read-only step).
- Verification gate:
  - `rg -l "<(CoverageSection|ServiceIntro|RelatedServices|Benefits)\\b" sites/colossus-scaffolding/content/services --glob '*.mdx' | wc -l` returns `18`.
  - `rg -n "<(InfoBox|FeatureCard|FeatureGrid|ComparisonTable|ComparisonRow|CheckList|QuoteBlock|ImageWithCaption|StepByStep|Step)\\b" sites/colossus-scaffolding/content --glob '*.mdx'` returns no matches.

2. Define target module layout under site scope

- Create a dedicated MDX component folder in colossus (site-specific, not shared package yet):
  - `sites/colossus-scaffolding/components/mdx/service/`
  - `sites/colossus-scaffolding/components/mdx/blog/`
  - `sites/colossus-scaffolding/components/mdx/base-elements/`
  - `sites/colossus-scaffolding/components/mdx/types.ts`
  - `sites/colossus-scaffolding/components/mdx/index.ts`
- Grouping strategy:
  - Keep data-holder + renderer together per feature to preserve `child.type === Holder` behavior.
  - Proposed service files:
    - `related-services.tsx` (`RelatedServices`, `ServiceLink`, props)
    - `benefits.tsx` (`Benefits`, `BenefitItem`, props)
    - `coverage-section.tsx` (`CoverageSection`, `RegionCard`, `LocationTag`, props)
    - `service-intro.tsx` (`ServiceIntro`, `ProcessStep`, `SidebarItem`, props)
  - Proposed blog files:
    - `info-box.tsx`
    - `feature-grid.tsx` (`FeatureGrid`, `FeatureCard`)
    - `comparison-table.tsx` (`ComparisonTable`, `ComparisonRow`)
    - `checklist.tsx`
    - `quote-block.tsx`
    - `image-with-caption.tsx`
    - `step-by-step.tsx` (`StepByStep`, `Step`)
  - Base overrides:
    - `base-elements/index.tsx` exports `a/h2/h3/p/ul/ol/li/strong/hr/img` wrapper functions.
- Files touched:
  - Create files listed above.
- Verification gate:
  - All new files compile with named exports only; each component has a local or exported `interface` for props.

3. Extract service wrapper components first (highest regression risk)

- Move service section logic out of root file into `components/mdx/service/*` with zero JSX/class changes.
- Preserve exact data-holder pattern implementation:
  - `const Holder: React.FC<Props> = () => null`
  - Parent filters on `React.isValidElement(child) && child.type === Holder`.
- Keep colossus-specific copy in `service-intro.tsx` (e.g., TG20:21 text, insurance phrasing) to satisfy site-specific constraint.
- Files touched:
  - New: `sites/colossus-scaffolding/components/mdx/service/*.tsx`
  - Modified: `sites/colossus-scaffolding/mdx-components.tsx`
- Verification gate:
  - `pnpm --filter colossus-scaffolding type-check` passes.
  - No diff in rendered structure/classNames for service wrappers (code review check).

4. Extract blog components and base HTML overrides

- Move blog-specific definitions to `components/mdx/blog/*`.
- Move base element overrides (`a`, headings, typography/list/image wrappers) to `components/mdx/base-elements/index.tsx`.
- Keep behavior identical, including link internal/external branching and image defaults.
- Files touched:
  - New: `sites/colossus-scaffolding/components/mdx/blog/*.tsx`
  - New: `sites/colossus-scaffolding/components/mdx/base-elements/index.tsx`
  - Modified: `sites/colossus-scaffolding/mdx-components.tsx`
- Verification gate:
  - `pnpm --filter colossus-scaffolding build` passes.
  - `pnpm --filter colossus-scaffolding type-check` passes.

5. Assemble a thin root `mdx-components.tsx` (<100 lines)

- Retain root file at project root (Next.js convention).
- Keep `useMDXComponents` export.
- Keep default export for compatibility with `sites/colossus-scaffolding/lib/mdx.tsx` (`import mdxComponents from "@/mdx-components"`).
- Root file should contain:
  - Imports from `components/mdx/*` modules.
  - `const mdxComponents: MDXMap = { ... }` assembly only.
  - `export default mdxComponents` and `export function useMDXComponents(...)`.
- Files touched:
  - Modified: `sites/colossus-scaffolding/mdx-components.tsx`
  - New/modified: `sites/colossus-scaffolding/components/mdx/index.ts`
- Verification gate:
  - `wc -l sites/colossus-scaffolding/mdx-components.tsx` < 100.
  - `rg -n "const mdxComponents: MDXMap" sites/colossus-scaffolding/mdx-components.tsx` confirms single assembly point.

6. Visual-regression verification focused on service pages

- Functional compile checks:
  - `pnpm --filter colossus-scaffolding build`
  - `pnpm --filter colossus-scaffolding type-check`
- Content rendering checks:
  - Confirm all 18 service pages still include expected wrapper output by running the app and spot-checking representative pages from each service type.
  - Validate that `CoverageSection`, `ServiceIntro`, `RelatedServices`, `Benefits` still render with unchanged layout/classes and populated children.
- Blog safety checks (despite current non-usage):
  - Open at least one blog page to ensure base markdown rendering (`a/h2/h3/p/ul/ol/li/img`) still works.
- Files touched:
  - None (verification).
- Verification gate:
  - No compile/type failures and no visual/layout regressions in sampled service/blog pages.

7. Duplication decision and follow-up boundary (this PR vs later)

- In this PR:
  - Do not move MDX components to shared packages yet.
  - Refactor only colossus file structure to close CQ-017 with minimal blast radius.
- Documented follow-up (separate PR):
  - Candidate shared module for cross-site duplicate/near-duplicate blog/base components:
    - `packages/core-components/src/mdx/` (or new `packages/mdx-components/`).
  - Introduce a factory for minor token/class differences (e.g., muted text token variants) to avoid forced visual changes.
  - Migrate `base-template` and `dj-fox-electrical` first (they are currently identical), then evaluate colossus adoption selectively.
- Files touched:
  - Optional: add short note in PR description or session notes; no code required for CQ-017 acceptance.

## Risks and Trade-offs

1. Data-holder identity risk (`child.type === Holder`)

- Risk: Separating holder components incorrectly (or wrapping/re-exporting through unstable indirection) can break child extraction silently.
- Mitigation: Keep holder + parent in same module and export both symbols directly; avoid runtime wrappers/HOCs.

2. Convention conflict: named exports vs existing default import path

- Risk: Removing default export from root file breaks `lib/mdx.tsx` immediately.
- Mitigation: Keep default export in root assembly file for compatibility in this refactor; maintain named exports for extracted modules.

3. “Unused” blog components may still be externally referenced later

- Risk: Deleting now could break future content drafts or author expectations.
- Mitigation: Keep and extract them; do not delete in CQ-017.

4. Hidden visual drift during extraction

- Risk: Small className/token edits during move create regressions.
- Mitigation: Move code mechanically first, then format only; run focused visual checks on service pages where business-critical wrappers are used.

5. Over-scoping into shared-package migration

- Risk: Cross-site package move increases review and regression surface beyond CQ-017.
- Mitigation: Explicitly defer package-level dedupe to a follow-up PR with dedicated migration plan.
