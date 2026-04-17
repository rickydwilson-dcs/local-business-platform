# YOLO Implementation Brief: CQ-017 — mdx-components.tsx Refactor

**Branch:** feature/cq017-mdx-components-refactor (created from develop)
**Session spec:** output/sessions/2026-03-06_cq017-mdx-components-refactor/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

`sites/colossus-scaffolding/mdx-components.tsx` is 963 lines — all MDX custom component definitions crammed into a single file. This is the last open finding (CQ-017) from a 59-item code review. The plan extracts components into 7 focused files under `components/mdx/`, leaving the root file as a thin ~70-line assembly point.

The synthesis was reviewed and approved via dual-model peer review (Claude + Codex). Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (-> haiku) or requires deep cross-file reasoning (-> opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/cq017-mdx-components-refactor   # create feature branch from develop
pnpm --filter colossus-scaffolding type-check   # must be clean before starting
```

---

## Phase 0: Baseline Verification

**Goal:** Confirm starting state before touching any code.
**Model:** haiku — read-only grep checks

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform

# 1. Verify service component usage (expect 18 files)
rg -l "<(CoverageSection|ServiceIntro|RelatedServices|Benefits)\b" sites/colossus-scaffolding/content/services --glob '*.mdx' | wc -l

# 2. Verify blog components are unused (expect 0 matches)
rg -c "<(InfoBox|FeatureCard|FeatureGrid|ComparisonTable|CheckList|QuoteBlock|ImageWithCaption|StepByStep)\b" sites/colossus-scaffolding/content --glob '*.mdx'

# 3. Verify default import exists in lib/mdx.tsx
rg "import.*from.*mdx-components" sites/colossus-scaffolding/lib/

# 4. Baseline build
pnpm --filter colossus-scaffolding build
```

All 4 checks must pass. Do not proceed if build is broken.

---

## Phase 1: Create Directory Structure

**Goal:** Create the extraction target directories.
**Model:** haiku — single mkdir command

```bash
mkdir -p sites/colossus-scaffolding/components/mdx/service
```

No commit for this phase — directories alone aren't meaningful.

---

## Phase 2: Extract Service Components

**Goal:** Move service wrapper components from mdx-components.tsx into 4 focused files. Highest regression risk — do first. Move code mechanically with zero className, token, or logic changes.
**Model:** sonnet — standard file creation with careful copy-paste

Read `sites/colossus-scaffolding/mdx-components.tsx` in full first.

**Step 2a: Create `sites/colossus-scaffolding/components/mdx/service/related-services.tsx`**

- Move from root: `ServiceLinkProps` interface, `ServiceLink` component, `RelatedServicesProps` interface, `RelatedServices` component
- Imports needed: `React`, `{ ContentCard }` from `@platform/core-components`
- Named exports: `ServiceLink`, `RelatedServices` (and their Props interfaces)
- CRITICAL: `ServiceLink` and `RelatedServices` MUST be in the same file because `RelatedServices` does `child.type === ServiceLink`

**Step 2b: Create `sites/colossus-scaffolding/components/mdx/service/benefits.tsx`**

- Move from root: `BenefitItemProps` interface, `BenefitItem` component, `BenefitsProps` interface, `Benefits` component
- Imports needed: `React`, `{ ServiceBenefits }` from `@platform/core-components`
- Named exports: `BenefitItem`, `Benefits`
- CRITICAL: `BenefitItem` and `Benefits` MUST be in the same file (same data-holder pattern)

**Step 2c: Create `sites/colossus-scaffolding/components/mdx/service/coverage-section.tsx`**

- Move from root: `LocationTagProps`, `LocationTag`, `RegionCardProps`, `RegionCard`, `CoverageSectionProps`, `CoverageSection`
- Imports needed: `React`, `Link` from `next/link`
- Named exports: `LocationTag`, `RegionCard`, `CoverageSection`
- CRITICAL: All three MUST be in the same file (nested data-holder chain)

**Step 2d: Create `sites/colossus-scaffolding/components/mdx/service/service-intro.tsx`**

- Move from root: `ProcessStepProps`, `ProcessStep`, `SidebarItemProps`, `SidebarItem`, `ServiceIntroProps`, `ServiceIntro`
- Imports needed: `React`
- Named exports: `ProcessStep`, `SidebarItem`, `ServiceIntro`
- Contains colossus-specific hardcoded copy ("TG20:21 Compliant", "£10M public liability") — leave as-is

All 4 files can be created in parallel (no dependencies between them).

```bash
# Verification gate — STOP if this fails
pnpm --filter colossus-scaffolding type-check
```

No commit yet — root file still has the old code alongside the new files.

---

## Phase 3: Extract Blog Components and HTML Overrides

**Goal:** Move blog components and base HTML overrides into dedicated files.
**Model:** sonnet — standard file creation

**Step 3a: Create `sites/colossus-scaffolding/components/mdx/blog-components.tsx`**

- Move ALL blog components into one file: `InfoBox` (with `InfoBoxProps`), `FeatureCard` (with `FeatureCardProps`), `FeatureGrid` (with `FeatureGridProps`), `ComparisonTable` (with `ComparisonTableProps`), `ComparisonRow` (with `ComparisonRowProps`), `CheckList` (with `CheckListProps`), `QuoteBlock` (with `QuoteBlockProps`), `ImageWithCaption` (with `ImageWithCaptionProps`), `StepByStep` (with `StepByStepProps`), `Step` (with `StepProps`)
- Imports needed: `React`, `Image` from `next/image`
- Named exports for all components and interfaces

**Step 3b: Create `sites/colossus-scaffolding/components/mdx/html-overrides.tsx`**

- Move all base HTML element overrides: the component functions assigned to `a`, `h2`, `h3`, `p`, `ul`, `ol`, `li`, `strong`, `hr`, `img` in the mdxComponents map
- Export as named constants: `MdxLink`, `MdxH2`, `MdxH3`, `MdxP`, `MdxUl`, `MdxOl`, `MdxLi`, `MdxStrong`, `MdxHr`, `MdxImg`
- Imports needed: `React`, `Link` from `next/link`, `Image` from `next/image`

Both files can be created in parallel.

```bash
# Verification gate — STOP if this fails
pnpm --filter colossus-scaffolding type-check
```

No commit yet.

---

## Phase 4: Create Barrel and Rewrite Root File

**Goal:** Create the barrel index.ts, then rewrite mdx-components.tsx as a thin assembly file under 100 lines.
**Model:** sonnet — wiring imports and assembling the component map

**Step 4a: Create `sites/colossus-scaffolding/components/mdx/index.ts`**

```ts
// Service components
export { RelatedServices, ServiceLink } from "./service/related-services";
export { Benefits, BenefitItem } from "./service/benefits";
export { CoverageSection, RegionCard, LocationTag } from "./service/coverage-section";
export { ServiceIntro, ProcessStep, SidebarItem } from "./service/service-intro";

// Blog components
export {
  InfoBox,
  FeatureCard,
  FeatureGrid,
  ComparisonTable,
  ComparisonRow,
  CheckList,
  QuoteBlock,
  ImageWithCaption,
  StepByStep,
  Step,
} from "./blog-components";

// HTML overrides
export {
  MdxLink,
  MdxH2,
  MdxH3,
  MdxP,
  MdxUl,
  MdxOl,
  MdxLi,
  MdxStrong,
  MdxHr,
  MdxImg,
} from "./html-overrides";
```

**Step 4b: Rewrite `sites/colossus-scaffolding/mdx-components.tsx`**

The new file should contain ONLY:

1. Imports from `./components/mdx` (all extracted components)
2. Import of `Schema` from `@platform/core-components`
3. Import of `MDXComponents as MDXMap` from `mdx/types`
4. The `mdxComponents: MDXMap` object assembling the map:
   - HTML tag overrides: `a: MdxLink`, `h2: MdxH2`, `h3: MdxH3`, `p: MdxP`, `ul: MdxUl`, `ol: MdxOl`, `li: MdxLi`, `strong: MdxStrong`, `hr: MdxHr`, `img: MdxImg`
   - Core: `Schema`
   - Service components: `RelatedServices`, `ServiceLink`, `Benefits`, `BenefitItem`, `CoverageSection`, `RegionCard`, `LocationTag`, `ServiceIntro`, `ProcessStep`, `SidebarItem`
   - Blog components: `InfoBox`, `FeatureCard`, `FeatureGrid`, `ComparisonTable`, `ComparisonRow`, `CheckList`, `QuoteBlock`, `ImageWithCaption`, `StepByStep`, `Step`
5. `export default mdxComponents` (MUST keep — `lib/mdx.tsx` does a default import)
6. `export function useMDXComponents(components: MDXMap): MDXMap { return { ...mdxComponents, ...components }; }` (Next.js convention)

Target: under 80 lines.

```bash
# Verification gate — STOP if this fails
wc -l sites/colossus-scaffolding/mdx-components.tsx   # must be < 100
pnpm --filter colossus-scaffolding type-check
pnpm --filter colossus-scaffolding build
```

**Commit after this phase:**

```bash
git add sites/colossus-scaffolding/components/mdx/ sites/colossus-scaffolding/mdx-components.tsx
git commit -m "$(cat <<'EOF'
refactor(colossus): extract mdx-components into focused files (CQ-017)

Break 963-line mdx-components.tsx into 7 focused files under
components/mdx/. Service wrappers in service/ subdirectory,
blog components and HTML overrides at mdx/ level. Root file
is now a thin ~70-line assembly point.

Closes CQ-017 from the Feb 2026 code review.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Update Remediation Audit

**Goal:** Move CQ-017 from "Still Open" to "Fixed" in the remediation audit and update summary counts.
**Model:** haiku — mechanical document edit

Read `output/sessions/2026-02-07_code-review/remediation-audit.md` in full first.

Edit the file:

1. Move the CQ-017 row from the "Still Open" table to the "Fixed" table
2. Add evidence: `sites/colossus-scaffolding/components/mdx/` — 7 files extracted; root mdx-components.tsx reduced from 963 to ~70 lines
3. Update the "Still Open" section heading to show 0 findings
4. Update the Summary table:
   - "Fixed since review" → 53 (was 52)
   - "Confirmed still open" → 0 (was 1)
   - "Open by severity" → 0 HIGH, 0 MEDIUM, 0 LOW

```bash
# Verification gate — STOP if this fails
# Confirm the audit file no longer mentions CQ-017 in "Still Open"
rg "Still Open" output/sessions/2026-02-07_code-review/remediation-audit.md
rg "CQ-017" output/sessions/2026-02-07_code-review/remediation-audit.md
```

**Commit:**

```bash
git add output/sessions/2026-02-07_code-review/remediation-audit.md
git commit -m "$(cat <<'EOF'
docs: mark CQ-017 as fixed in remediation audit

All 59 findings from the Feb 2026 code review are now resolved.
0 findings remaining.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Final Build Verification

**Goal:** Full monorepo verification to confirm nothing is broken.
**Model:** haiku — running commands only

```bash
# Verification gate — STOP if this fails
pnpm --filter colossus-scaffolding type-check
pnpm --filter colossus-scaffolding build
pnpm lint --filter colossus-scaffolding
```

No commit for this phase — verification only.

---

## Cost Estimate

| Phase                                  | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 0: Baseline verification         | haiku  | ~8k               | ~500               | $0.01      |
| Phase 1: Create directories            | haiku  | ~4k               | ~200               | $0.01      |
| Phase 2: Extract service components    | sonnet | ~20k              | ~4k                | $0.12      |
| Phase 3: Extract blog + HTML overrides | sonnet | ~18k              | ~4k                | $0.11      |
| Phase 4: Barrel + rewrite root         | sonnet | ~15k              | ~2k                | $0.08      |
| Phase 5: Update remediation audit      | haiku  | ~10k              | ~1k                | $0.01      |
| Phase 6: Final verification            | haiku  | ~5k               | ~500               | $0.01      |
| **Total**                              |        | **~80k**          | **~12k**           | **~$0.35** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes for colossus-scaffolding
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-03-06_cq017-mdx-components-refactor/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Move code mechanically first — no className, token, or logic changes during extraction
- Keep `export default mdxComponents` in the root file (lib/mdx.tsx depends on default import)
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)

---

## Completed

**Date:** 2026-03-06
**Status:** All phases executed successfully

Extracted `sites/colossus-scaffolding/mdx-components.tsx` from 963 lines into 7 focused files under `components/mdx/`: four service component files (`related-services.tsx`, `benefits.tsx`, `coverage-section.tsx`, `service-intro.tsx`) in a `service/` subdirectory, plus `blog-components.tsx`, `html-overrides.tsx`, and a barrel `index.ts`. The root file is now 66 lines — a thin assembly point importing from the barrel and assembling the MDX component map. One minor deviation from the plan: `MdxImg` did not spread `{...rest}` onto `next/image` because `React.ImgHTMLAttributes` types `src` as `string | Blob` (wider than `next/image` accepts), causing a type error; instead, only `src` (cast to `string`), `alt`, `width`, `height`, and `className` are passed explicitly — identical runtime behavior to the original. All verification gates passed: type-check, lint, and production build throughout.

### Commits

- `3c2f976` — refactor(colossus): extract mdx-components into focused files (CQ-017)
- `d619f30` — docs: mark CQ-017 as fixed in remediation audit
