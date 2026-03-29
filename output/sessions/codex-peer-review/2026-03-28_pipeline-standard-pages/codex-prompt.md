# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-03-28_pipeline-standard-pages/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise
```

---

## Brief: Pipeline Standard Pages

**Date:** 2026-03-28
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.
**Note:** No clarified brief was produced for this topic. Challenge assumptions accordingly and flag any scope gaps you identify.

---

### Problem Statement

The `/pipeline.ingest` skill ingests a reference website URL, generates a theme package (colors, tokens, CSS utilities, custom section components), and creates a test site at `sites/test-<theme-name>/`. The test site currently has no guaranteed page content — Step 5f copies whatever example pages the analysis happened to produce, which is unreliable: if the analysis only found one page, only one page exists; if it found an unusual set (e.g. an events directory), the pages don't reflect standard business site patterns.

The goal is to make every ingested test site always render five standard pages:

1. **Home** (`/`)
2. **About** (`/about`)
3. **Contact** (`/contact`)
4. **Category index** (e.g. `/services`, `/products`, `/events` — auto-detected from reference nav)
5. **Item detail** (e.g. `/services/[slug]`, `/blog/[slug]` — a single item page for the detected category)

Pages should **mirror the reference site's layout as closely as possible** where the reference page exists (reference-first fidelity). Only fall back to platform defaults when no corresponding page was found on the reference site.

---

### Goals

- Every ingested test site has exactly these five pages, every time
- Each page renders real, styled content (not placeholder divs or TODO comments)
- Pages use the generated theme components wherever they match a required section
- Missing sections are generated as **inline JSX within the page file** (no separate component file for one-off inline code)
- The category page type is auto-detected from the reference site's nav structure
- Pages are consistent: every page has TopNavigation and SiteFooter from the generated theme (since the test site uses a bare layout shell with no shared header/footer)

---

### Non-Goals

- Replacing the analysis tooling (`tools/analyse-site.ts`) — the analysis pipeline stays as-is
- Generating a full production-quality site — this is a visual preview/theme validation test site
- Adding MDX content files or dynamic routes — all content can be static/hardcoded in the page file
- Modifying `sites/base-template/` — test sites are always copies, never modify the template
- CI integration — test sites have `pipelineTestSite: true` and stripped CI scripts

---

### Acceptance Criteria

1. After `/pipeline.ingest --url <any-url>` completes, `sites/test-<theme-name>/app/` contains exactly these routes (plus `layout.tsx` and `globals.css`):
   - `page.tsx`
   - `about/page.tsx`
   - `contact/page.tsx`
   - `<category-slug>/page.tsx`
   - `<category-slug>/[slug]/page.tsx`
2. Each page renders without runtime errors when `npm run dev` is started in the test site
3. No hardcoded hex colors (`#RRGGBB`) in any generated page file
4. Every page imports and renders TopNavigation and SiteFooter (or equivalent) from `@platform/themes/<theme-name>/components` (if those components exist in the theme)
5. Home page section order matches the reference site's `pageBlueprints[home].sections` array where those blueprints exist
6. The category slug is derived from the reference site's navigation — not hardcoded to `services`

---

### Constraints

- **Skill-only change**: The implementation is a rewrite of **Step 5f** in `.claude/commands/pipeline.ingest.md` — the markdown skill file that Claude reads and executes. This is NOT a TypeScript tool change. The skill tells Claude what to do step-by-step during execution; the AI model doing the execution reads the site-analysis.json and generates page TSX in response to instructions in the skill.
- **Bare layout shell**: `app/layout.tsx` in test sites wraps only `ThemeProvider` — no SiteHeader, Footer, PageShell, analytics, consent. Generated pages must include their own nav/footer by importing theme components directly.
- **No MDX/dynamic content**: Test site pages are static. No `generateStaticParams()`, no `fs.readdir()`, no `getContentItems()`. Category and detail pages can use hardcoded example items (2-3).
- **Token-only styling**: No hardcoded hex colors. All Tailwind classes must use theme tokens (`bg-brand-primary`, `text-surface-foreground`, `bg-surface-inverse`, etc.) or standard Tailwind utilities (spacing, layout, typography scale classes).
- **Import source**: Theme components import from `@platform/themes/<theme-name>/components`. Core components import from `@platform/core-components`. The skill must check which components are available in each location before generating page code.
- **site-analysis.json is the sole data source**: The skill reads this file from `output/ingestion/<theme-name>/site-analysis.json` to determine page blueprints, section order, available components, and category type. No new analysis steps.
- **Inline missing sections**: When a page needs a section that has no matching theme component and no matching core-component, generate it as inline JSX in the page file. Do not create a new component file for one-off sections.
- **Fallback templates**: When a reference page wasn't captured (e.g. /about wasn't found), use a sensible structural default (see below) — not blank.

---

### Relevant Architecture

**Theme package structure** (`packages/themes/<theme-name>/`):
- `index.ts` — exports `<theme>Registry` (ComponentRegistry) and `<theme>DefaultConfig` (DeepPartialThemeConfig)
- `globals.css` — button utilities, theme-specific CSS classes (e.g. `btn-primary`, `accent-underline`)
- `components/` — generated component files, one per section blueprint that needed custom generation

**Core components available** (`@platform/core-components`):
- Hero variants: `HeroSection`, `HeroWithImage`, `PageHero`, `PageHeroImage`, `ServiceHero`, `LocationHero`, `BlogPostHero`
- Sections: `ServiceCards`, `ServiceBenefits`, `CTASection`, `FAQSection`, `TestimonialCard`, `ContactForm`, `CardGrid`, `ContentGrid`, `SectionWrapper`, `CoverageAreas`
- Navigation: `SiteHeader`, `MobileMenu`, `LocationsDropdown`, `Breadcrumbs`
- Layout: `PageLayout`, `PageShell`
- (Note: `Footer` requires subpath import `@platform/core-components/src/components/ui/footer` — uses fs/promises)

**Test site layout.tsx** (bare shell — already written in Step 5e):
```tsx
<html><body>
  <ThemeProvider theme="<name>" registry={<name>Registry}>
    {children}
    <ReviewPanel />
  </ThemeProvider>
</body></html>
```
No SiteHeader, Footer, PageShell. Pages provide their own.

**site-analysis.json key fields**:
- `discoveredPages[]` — pages found on reference site (path, pageType, source)
- `pageBlueprints[]` — section structure per page (sections array with blueprintId + order)
- `sectionBlueprints[]` — full spec for each section (id, name, category, purpose, layoutPattern, componentFileName, componentExportName)
- `componentMatches[]` — which blueprints map to existing core-components
- `registryRecommendation.themeName` — closest theme match (orion|vega)

**Available theme components** (from generate step, will exist in `packages/themes/<theme-name>/components/`):
- One `.tsx` file per section blueprint that was NOT an exact/close match to a core-component
- File names are `<blueprintId>.tsx`, export names are `<ComponentExportName>`
- The skill must `ls packages/themes/<theme-name>/components/` to know what's available

**Fallback page templates** (when reference page wasn't captured):

| Page | Default sections |
|---|---|
| Home | TopNav → Hero (full-bleed or split based on heroPattern) → Category/services grid (3 items) → Trust/stats strip → CTA → Footer |
| About | TopNav → Page hero → Story text block → Values grid (3 values) → CTA → Footer |
| Contact | TopNav → Page hero → Split layout (ContactForm from core-components left, info + hours right) → Footer |
| Category index | TopNav → Page hero → Card grid (3 example items with title + description) → CTA → Footer |
| Item detail | TopNav → Detail hero → Rich text body → Related items (2 cards) → CTA → Footer |

---

### Codebase Snapshot

```
.claude/commands/pipeline.ingest.md     — The skill file to modify (Steps 1-8)
output/ingestion/<theme>/site-analysis.json  — Data source for page generation
packages/themes/<theme>/index.ts        — Registry + config exports
packages/themes/<theme>/components/     — Generated theme components
packages/core-components/src/index.ts   — Shared component barrel
sites/base-template/app/page.tsx        — Reference for token-correct page patterns
sites/dj-fox-electrical/app/page.tsx    — Reference for Orion-style page patterns
```

**Current Step 5f** (what we're replacing):
```
1. Hard-fail gate: check output/ingestion/<theme>/example-pages/app/page.tsx exists
2. List example page routes
3. Delete all base-template page routes from test site
4. Copy output/ingestion/<theme>/example-pages/app/* into test site
5. Copy components/
6. Import contract check (warn if pages don't import theme components)
```

The problem: Step 5f is entirely dependent on whatever the analysis happened to generate. If example-pages is sparse or missing, the test site is broken.

---

### What a Good Plan Should Cover

1. **Where exactly does the logic live?** The skill is a markdown file that instructs an AI model at execution time. How should the five-page generation instructions be structured — as explicit sub-steps in the skill, as a prompt that Claude self-executes, or as a call to a new TypeScript tool?

2. **Category detection algorithm**: What's the exact decision tree for detecting the category slug from `site-analysis.json`? What fields to read, what priority order, what fallback?

3. **Component inventory step**: Before generating any page, the skill needs to know what's available. How should Claude enumerate available theme components and core-components to decide what to import vs generate inline?

4. **Page generation approach**: Should the skill tell Claude to generate all five pages in sequence (one at a time, verifying each) or in a single generation pass? What's the right prompt structure for each page?

5. **Inline section generation**: When a section needs to be generated inline, what constraints ensure it stays token-correct? What validation should run after generation?

6. **Fallback handling**: When a reference page wasn't captured, how does the skill know to use a fallback vs attempt reference-first? Which fields in `site-analysis.json` indicate a page was/wasn't found?

7. **What happens to the old example-pages output?** The analysis still generates `output/ingestion/<theme>/example-pages/` — should the skill use this as a starting point, ignore it, or delete it?

8. **Verification gates**: What checks run after page generation before moving to Step 6 (lockfile)?

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-03-28_pipeline-standard-pages/`.

Then output this command for the user to copy-paste into Claude Code:
```
/plan.with.codex synthesise
```
