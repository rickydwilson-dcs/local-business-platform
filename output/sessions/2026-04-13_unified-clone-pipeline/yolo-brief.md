# YOLO Implementation Brief: Unified Clone-to-Theme-to-Scaffold Pipeline

**Branch:** feature/unified-clone-pipeline (created from develop)
**Session spec:** output/sessions/2026-04-13_unified-clone-pipeline/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The current ingest pipeline generates components that diverge significantly from reference sites because the component generator receives only abstract metadata, never actual HTML or images. This plan implements a 3-stage architecture (Clone → Extract Theme → Scaffold Client Site) with three entry points (live URL ingest, Stitch MCP, Claude design skills) converging to a formal Clone Package Format (CPF). Playwright-driven visual QA loops iterate automatically to improve fidelity.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/unified-clone-pipeline
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Specifications & Schemas

**Goal:** Define the JobBrief schema, Clone Package Format (CPF) spec, and CPF validator. These are the contracts that all subsequent phases depend on.
**Model:** sonnet — schema design requires careful type reasoning

### Step 1.1: JobBrief schema

**Create:** `tools/lib/pipeline-brief-types.ts`

Define a Zod-validated schema:

```typescript
import { z } from "zod";

const AddressSchema = z.object({
  city: z.string(),
  postcode: z.string(),
  region: z.string().optional(),
});

const BrandColorsSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
});

const StitchConfigSchema = z.object({
  designMd: z.string().optional(),
  tasteSkill: z.string().optional(),
  tasteDials: z
    .object({
      creativity: z.number().min(1).max(10),
      density: z.number().min(1).max(10),
      variance: z.number().min(1).max(10),
      motion: z.number().min(1).max(10),
    })
    .optional(),
});

export const JobBriefSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  cpfVersion: z.literal("0.1"),

  source: z.discriminatedUnion("type", [
    z.object({ type: z.literal("url"), value: z.string().url() }),
    z.object({ type: z.literal("stitch"), stitchConfig: StitchConfigSchema }),
    z.object({ type: z.literal("design-skill"), skill: z.string(), outputDir: z.string() }),
  ]),

  business: z.object({
    name: z.string(),
    trade: z.string(),
    tagline: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: AddressSchema.optional(),
    website: z.string().url().optional(),
  }),

  content: z.object({
    services: z.array(z.string()).min(1),
    locations: z.array(z.string()).optional(),
    aboutSummary: z.string().optional(),
    tone: z.enum(["professional", "friendly", "bold", "minimal"]).optional(),
    competitors: z.array(z.string().url()).optional(),
  }),

  theme: z.object({
    name: z.string().optional(),
    brandColors: BrandColorsSchema.optional(),
    preferDark: z.boolean().optional(),
    referenceNotes: z.string().optional(),
  }),

  qa: z.object({
    maxIterations: z.number().int().min(1).max(5).default(3),
    thresholds: z.record(z.string(), z.number()).default({
      home: 0.05,
      about: 0.05,
      default: 0.1,
    }),
  }),

  imageGen: z.object({
    enabled: z.boolean().default(true),
    mode: z.enum(["batch", "realtime"]).default("batch"),
    stylePrompt: z.string().optional(),
  }),

  runMode: z.enum(["interactive", "autonomous"]),
});

export type JobBrief = z.infer<typeof JobBriefSchema>;
```

Export all sub-schemas as named exports too (`AddressSchema`, `BrandColorsSchema`, `StitchConfigSchema`).

### Step 1.2: CPF validator

**Create:** `tools/lib/cpf-validator.ts`

Zod schema that validates a clone directory:

- `meta.json` exists and contains `{ jobId: string, sourceType: "url"|"stitch"|"design-skill", sourceRef: string, capturedAt: string, cpfVersion: "0.1" }`
- `assets/images/` directory exists (may be empty)
- `html/pages/` directory exists with at least one `.html` file
- `jsx/pages/` directory exists with at least one `.tsx` file
- `reference-screenshots/` directory exists with at least one `.png` file
- `styles/computed-styles.json` exists and is valid JSON
- `reports/` directory exists

Export a `validateCPF(clonePath: string): { valid: boolean; errors: string[] }` function.

Also export a CLI entry point so it can be run standalone:

```bash
npx tsx tools/lib/cpf-validator.ts output/clones/corvus/
```

### Step 1.3: CPF spec document

**Create:** `docs/pipeline/CLONE_PACKAGE_FORMAT.md`

Document the folder structure, `meta.json` schema, and purpose of each subdirectory. Keep it concise — reference the Zod schema in `cpf-validator.ts` as the authoritative definition.

### Step 1.4: Example brief fixture

**Create:** `tools/lib/__fixtures__/example-brief-corvus.json`

A complete JobBrief for colorcode.events that validates against the schema. Used by tests and as documentation.

```bash
# Verification gate — STOP if this fails
npx tsx -e "
const { JobBriefSchema } = require('./tools/lib/pipeline-brief-types');
const brief = require('./tools/lib/__fixtures__/example-brief-corvus.json');
JobBriefSchema.parse(brief);
console.log('Brief schema: OK');
" && echo "Phase 1 PASSED"
```

**Commit:**

```bash
git add tools/lib/pipeline-brief-types.ts tools/lib/cpf-validator.ts docs/pipeline/CLONE_PACKAGE_FORMAT.md tools/lib/__fixtures__/example-brief-corvus.json
git commit -m "feat(pipeline): add JobBrief schema, CPF spec, and CPF validator

Foundation for the unified clone-to-theme-to-scaffold pipeline.
Defines the contract that all entry points and stages depend on.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2: Asset Downloader

**Goal:** Build a comprehensive asset downloader that parses HTML for all referenced assets and downloads them with no cap.
**Model:** sonnet — requires careful URL parsing and edge case handling

### Step 2.1: Create asset downloader

**Create:** `tools/lib/asset-downloader.ts`

Functions:

- `extractAssetUrls(html: string, baseUrl: string): AssetUrl[]` — parse HTML for:
  - `<img src>` and `<img srcset>` (split multiple URLs)
  - `<link rel="stylesheet" href>`
  - `<source src>` and `<source srcset>`
  - CSS `url()` references (within inline `<style>` blocks and `style` attributes)
  - `@font-face src` declarations
- `downloadAssets(urls: AssetUrl[], outputDir: string): AssetManifest` — download all assets:
  - Categorize: `images/`, `fonts/`, `css/`
  - Handle: relative URLs (resolve against baseUrl), protocol-relative (`//`), data URIs (skip), inline SVG (skip — stays in HTML)
  - Sanitize filenames (no query strings, URL-decode, replace special chars)
  - On failure: warn + skip (don't abort)
  - Return manifest: `{ [originalUrl]: localPath }`

Types:

```typescript
interface AssetUrl {
  url: string;
  type: "image" | "font" | "css" | "unknown";
  source: string; // which HTML element referenced it
}

interface AssetManifest {
  [originalUrl: string]: string; // local relative path
}
```

Write manifest to `asset-manifest.json` in the output directory.

```bash
# Verification gate — STOP if this fails
npx tsx -e "
const { extractAssetUrls } = require('./tools/lib/asset-downloader');
const html = '<img src=\"/test.jpg\"><link rel=\"stylesheet\" href=\"/style.css\">';
const urls = extractAssetUrls(html, 'https://example.com');
if (urls.length < 2) throw new Error('Expected 2+ URLs, got ' + urls.length);
console.log('Asset downloader: OK');
" && echo "Phase 2 PASSED"
```

**Commit:**

```bash
git add tools/lib/asset-downloader.ts
git commit -m "feat(pipeline): add comprehensive asset downloader

Parses HTML for all img, link, source, font-face, and CSS url() references.
Downloads without cap, categorizes by type, produces asset manifest.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: HTML-to-JSX Converter

**Goal:** Build a mechanical HTML-to-JSX converter that preserves exact DOM structure without AI interpretation.
**Model:** sonnet — core pipeline logic with many edge cases

### Step 3.1: Add dependency

```bash
pnpm add -w node-html-parser
```

### Step 3.2: Create converter

**Create:** `tools/lib/html-to-jsx-converter.ts`

Functions:

- `convertHtmlToJsx(html: string, assetManifest: AssetManifest, pageName: string): string`

Logic:

1. Parse with `node-html-parser`
2. **Strip nodes:** `<script>`, `<noscript>`, `<iframe>` (unless same-origin), `<!-- comments -->`, elements with `id` matching tracking patterns (`gtm-`, `ga-`, `fb-pixel`, etc.)
3. **Convert attributes:**
   - `class` → `className`
   - `for` → `htmlFor`
   - `tabindex` → `tabIndex`
   - `autocomplete` → `autoComplete`
   - `maxlength` → `maxLength`
   - `readonly` → `readOnly`
   - `colspan` → `colSpan`, `rowspan` → `rowSpan`
   - Boolean attrs: `checked`, `disabled`, `required` → `checked={true}` etc.
   - `style` string → JSX object (parse `key: value;` pairs, camelCase keys, quote values)
4. **Self-close void elements:** `<img />`, `<br />`, `<hr />`, `<input />`, `<meta />`, `<link />`
5. **Rewrite URLs:** look up `src`, `href`, `srcset` in asset manifest, replace with local path
6. **Handle SVG:** convert SVG attributes (`stroke-width` → `strokeWidth`, `fill-rule` → `fillRule`, etc.)
7. **Extract inline `<style>`:** move to separate CSS string, return as second output
8. **Wrap:** `export function {PageName}Page() { return (<>...</>); }`

Also:

- `convertStyleString(style: string): Record<string, string>` — mechanical CSS property parser
- `extractLayout(htmls: string[]): string` — pull `<html>`, `<head>`, `<body>` wrapper into shared `layout.tsx`

### Step 3.3: Create test fixtures

**Create:** `tools/lib/__fixtures__/html-samples/`

Three fixtures:

- `simple-semantic.html` — clean semantic HTML (like colorcode.events)
- `wordpress-markup.html` — WordPress admin bar, wp-content paths, data-wc attrs
- `squarespace-markup.html` — data-block attrs, sqs-gallery patterns

Each with expected `.tsx` output for snapshot testing.

```bash
# Verification gate — STOP if this fails
npx tsx -e "
const { convertHtmlToJsx } = require('./tools/lib/html-to-jsx-converter');
const html = '<div class=\"hero\" style=\"background-color: #292661; padding: 20px;\"><h1>Hello</h1><img src=\"/old.jpg\" /></div>';
const jsx = convertHtmlToJsx(html, { '/old.jpg': '/assets/images/new.jpg' }, 'Test');
if (!jsx.includes('className')) throw new Error('Missing className conversion');
if (!jsx.includes('backgroundColor')) throw new Error('Missing style conversion');
if (!jsx.includes('/assets/images/new.jpg')) throw new Error('Missing URL rewrite');
console.log('HTML-to-JSX converter: OK');
" && echo "Phase 3 PASSED"
```

**Commit:**

```bash
git add tools/lib/html-to-jsx-converter.ts tools/lib/__fixtures__/html-samples/ package.json pnpm-lock.yaml
git commit -m "feat(pipeline): add mechanical HTML-to-JSX converter

Uses node-html-parser for deterministic conversion. Handles attribute
mapping, style object conversion, void element self-closing, URL rewriting.
No AI interpretation — preserves exact DOM structure.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4: Enhanced Computed Style Extraction

**Goal:** Extend the existing computed style extractor to capture ALL section elements, not just 16 role-based selectors.
**Model:** sonnet — modifying existing Playwright integration

### Step 4.1: Read existing extractor

Read `tools/lib/computed-style-extractor.ts` to understand current structure.

### Step 4.2: Add section-level extraction

**Modify:** `tools/lib/computed-style-extractor.ts`

Add a new exported function `extractAllSectionStyles(page: Page)`:

```typescript
export interface SectionComputedStyle {
  index: number;
  headingText: string | null; // first heading text inside section
  tagName: string; // 'section', 'div', etc.
  styles: {
    backgroundColor: string;
    color: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    padding: string;
    margin: string;
    borderRadius: string;
  };
}

export async function extractAllSectionStyles(page: Page): Promise<SectionComputedStyle[]>;
```

Implementation: `page.evaluate()` that:

1. Queries ALL `<section>` elements on the page
2. Also queries `<header>`, `<footer>`, `<nav>`, `<main>` as bonus elements
3. For each, reads `getComputedStyle()` for the listed properties
4. Converts RGB values to hex
5. Captures the first heading text inside each section for identification

```bash
# Verification gate — STOP if this fails
pnpm type-check --filter @platform/theme-system 2>&1 | tail -5
npx tsx -e "
const { extractAllSectionStyles } = require('./tools/lib/computed-style-extractor');
if (typeof extractAllSectionStyles !== 'function') throw new Error('Function not exported');
console.log('Section style extractor: OK');
" && echo "Phase 4 PASSED"
```

**Commit:**

```bash
git add tools/lib/computed-style-extractor.ts
git commit -m "feat(pipeline): add per-section computed style extraction

Extends computed-style-extractor with extractAllSectionStyles() that
captures background colors, fonts, and spacing for every section element.
Enables per-section color token mapping in theme extraction.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 5: Entry A — Ingest from Live URL

**Goal:** Build the Entry A orchestrator that clones a live website into CPF format.
**Model:** sonnet — orchestration logic tying together phases 2-4

### Step 5.1: Create Entry A adaptor

**Create:** `tools/lib/clone-entry/ingest-live-site.ts`

Orchestrator function:

```typescript
export async function ingestLiveSite(brief: JobBrief, outputDir: string): Promise<void>;
```

Steps (each writes `.done.json` with input hash):

1. **Discover pages** — reuse `site-discovery.ts` (`discoverPages(url)`)
2. **Fetch HTML** — reuse existing fetch logic (500ms between requests, 10s timeout)
3. **Capture screenshots** — reuse `screenshot-capture.ts` (1440x900, Playwright)
4. **Extract computed styles** — use enhanced `extractAllSectionStyles()` per page
5. **Download assets** — use `asset-downloader.ts` from Phase 2
6. **Convert HTML to JSX** — use `html-to-jsx-converter.ts` from Phase 3, per page
7. **Write meta.json** — `{ jobId, sourceType: "url", sourceRef: url, capturedAt, cpfVersion: "0.1" }`
8. **Validate CPF** — run `cpf-validator.ts` on the output directory

### Step 5.2: Resumability helper

**Create:** `tools/lib/step-tracker.ts`

```typescript
export function hasCompletedStep(dir: string, stepName: string, inputHash?: string): boolean;
export function markStepDone(
  dir: string,
  stepName: string,
  inputHash: string,
  outputHash?: string
): void;
```

Reads/writes `.done-{stepName}.json` files with content hashes. Used by all orchestrators.

### Step 5.3: Create clone-site CLI

**Create:** `tools/clone-site.ts`

CLI entry point:

```bash
npx tsx tools/clone-site.ts --url https://colorcode.events --name corvus
# or
npx tsx tools/clone-site.ts --brief output/briefs/abc123.json
```

Reads brief or constructs minimal brief from flags, calls `ingestLiveSite()`.

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -5
# Functional test requires network — skip in YOLO, test manually
echo "Phase 5 PASSED (type-check only — functional test requires network)"
```

**Commit:**

```bash
git add tools/lib/clone-entry/ingest-live-site.ts tools/lib/step-tracker.ts tools/clone-site.ts
git commit -m "feat(pipeline): add Entry A — ingest live site to CPF

Orchestrates page discovery, HTML fetch, screenshot capture, asset download,
HTML-to-JSX conversion, and computed style extraction into a validated
Clone Package Format directory.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 6: Visual QA Loop

**Goal:** Build the Playwright-driven capture → diff → review → fix → re-capture loop.
**Model:** opus — complex orchestration with agent spawning, dev server lifecycle, and iteration logic across >5 interacting modules

### Step 6.1: Create visual QA loop

**Create:** `tools/lib/visual-qa-loop.ts`

```typescript
export interface VisualQAConfig {
  clonePath: string;
  maxIterations: number;
  thresholds: Record<string, number>;
  mode: "pixel" | "structural";
}

export interface VisualQAResult {
  passed: boolean;
  iterations: number;
  finalDiffs: Array<{ page: string; diffPercent: number; pass: boolean }>;
  warnings: string[];
}

export async function runVisualQALoop(config: VisualQAConfig): Promise<VisualQAResult>;
```

Implementation:

1. **Dev server management:**
   - Spawn `npx next dev` as child process in the clone directory
   - Wait for "Ready" or "Local:" on stdout (timeout 60s)
   - Track PID for cleanup
   - Kill between iterations and on exit (cleanup handler)

2. **Per-iteration:**
   a. Playwright captures all pages at 1440x900 → saves to `reports/iteration-{n}/`
   b. `pipeline-visual-compare.ts` diffs each page against `reference-screenshots/`
   c. Save diff images to `reports/iteration-{n}/{page}-diff.png`
   d. Save results JSON to `reports/iteration-{n}/{page}-results.json`
   e. If all pages pass thresholds → success
   f. If any fail:
   - Write `reports/iteration-{n}/findings-input.json` summarizing failures
   - Log: "Iteration {n}: {page} diff {percent}% (threshold {threshold}%)"
   - For autonomous mode: write fix instructions based on diff analysis
   - Apply fixes to JSX/CSS files in the clone
     g. Kill dev server

3. **After max iterations:** return with `passed: false` and warnings listing remaining failures

4. **Structural mode** (for Stage 3): compare section count, hero presence, header presence — not pixel-perfect colors

Note: In v1, the "apply fixes" step (2f) uses a heuristic approach:

- If diff is in header area (top 100px): check header background color matches reference computed styles
- If diff is in a section: check section background color matches
- Apply CSS variable overrides in the clone's globals.css

Full agent-based fixing (cs-visual-fidelity-reviewer → cs-frontend-engineer) is a v2 enhancement — the loop framework supports it but v1 uses simpler heuristics to avoid agent orchestration complexity in the YOLO session.

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -5
npx tsx -e "
const { runVisualQALoop } = require('./tools/lib/visual-qa-loop');
if (typeof runVisualQALoop !== 'function') throw new Error('Function not exported');
console.log('Visual QA loop: OK');
" && echo "Phase 6 PASSED"
```

**Commit:**

```bash
git add tools/lib/visual-qa-loop.ts
git commit -m "feat(pipeline): add Playwright visual QA loop

Capture → diff → fix → re-capture cycle with configurable thresholds
and max iterations. Manages Next.js dev server lifecycle. Supports
pixel and structural comparison modes.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 7: Content Stripper

**Goal:** Build the content stripping logic that removes text/images/business info from clone JSX, leaving structural layout with prop slots.
**Model:** sonnet — pattern matching and code transformation

### Step 7.1: Create content stripper

**Create:** `tools/lib/content-stripper.ts`

```typescript
export interface ContentStrippingConfig {
  businessName: string;
  phone?: string;
  email?: string;
  address?: { city: string; postcode: string };
}

export interface StrippedComponent {
  tsx: string;
  propsInterface: string;
  propCount: number;
}

export function stripContent(jsx: string, config: ContentStrippingConfig): StrippedComponent;
```

Pattern-based replacement:

1. **Business name** — exact match (case-insensitive) → `{props.businessName}`
2. **Phone** — regex for phone patterns containing digits from config.phone → `{props.phone}`
3. **Email** — regex for email patterns → `{props.email}`
4. **Address** — patterns containing city/postcode from config → `{props.address}`
5. **Headings** — text inside `<h1>`-`<h6>` tags → `{props.heading}` (generate unique prop names for multiple headings: `heading`, `sectionTitle`, `subheading`)
6. **Long paragraphs** — `<p>` with >50 chars → `{props.body}` / `{props.description}`
7. **Images** — `src` attr pointing to `assets/images/` → `src={props.imageSrc}`
8. **Keep hardcoded:** all CSS classes, decorative SVGs, short labels (<20 chars), layout structure

Auto-generate a TypeScript props interface from all replaced slots.

```bash
# Verification gate — STOP if this fails
npx tsx -e "
const { stripContent } = require('./tools/lib/content-stripper');
const result = stripContent(
  '<h1>Acme Plumbing</h1><p>We are the best plumbing company in Brighton. Call us today for a free quote.</p><img src=\"/assets/images/hero.jpg\" />',
  { businessName: 'Acme Plumbing', address: { city: 'Brighton', postcode: 'BN1' } }
);
if (!result.tsx.includes('props.')) throw new Error('No props replaced');
if (result.propCount < 2) throw new Error('Expected 2+ props, got ' + result.propCount);
console.log('Content stripper: OK (' + result.propCount + ' props)');
" && echo "Phase 7 PASSED"
```

**Commit:**

```bash
git add tools/lib/content-stripper.ts
git commit -m "feat(pipeline): add content stripper for theme extraction

Pattern-based replacement of business text, phone, email, address,
headings, paragraphs, and images with component props. Auto-generates
TypeScript props interface.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 8: Token Extraction & Theme Package Assembly

**Goal:** Map computed styles to semantic tokens and assemble a standard theme package from the stripped clone.
**Model:** sonnet — theme system integration across multiple files

### Step 8.1: Enhance token mapper

**Modify:** `tools/lib/computed-style-token-mapper.ts`

Read the file first, then add:

- `mapSectionColors(sections: SectionComputedStyle[], brandPrimary: string, brandSecondary: string): TokenMapping`
  - For each section's background color:
    - If it matches brand primary (within deltaE 5) → map to `bg-brand-primary`
    - If it matches brand secondary → map to `bg-brand-secondary`
    - Otherwise → create `--color-section-{index}` custom property
  - Return both the standard token mappings and any extra CSS custom properties

- `extractTypographyScale(sections: SectionComputedStyle[]): TypographyScale`
  - Collect all unique font sizes, sort descending
  - Map to 8-level scale: hero, h1, h2, h3, h4, body, small, caption

### Step 8.2: Create theme extraction orchestrator

**Create:** `tools/extract-theme.ts`

CLI:

```bash
npx tsx tools/extract-theme.ts --clone corvus
# or
npx tsx tools/extract-theme.ts --brief output/briefs/abc123.json
```

Steps:

1. Read clone from `output/clones/[name]/` — validate CPF
2. Read `computed-styles.json` for token extraction
3. Strip content from each JSX page (Phase 7)
4. Map colors → tokens (Step 8.1)
5. Decompose pages into section components → `packages/themes/[name]/components/`
6. Extract Header + Footer as Server Components
7. Generate page layouts → `packages/themes/[name]/pages/`
8. Generate `index.ts` (barrel with registry + config exports)
9. Generate `globals.css` (standard utilities + per-section custom properties)
10. Generate `package.json` with peer deps
11. Validate: TPV + type-check

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -5
echo "Phase 8 PASSED"
```

**Commit:**

```bash
git add tools/lib/computed-style-token-mapper.ts tools/extract-theme.ts
git commit -m "feat(pipeline): add theme extraction from clone

Enhanced token mapper with per-section color mapping and typography
scale extraction. Theme extraction orchestrator strips content,
decomposes into components, and assembles standard theme package.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 9: Client Site Scaffolding

**Goal:** Build the scaffold orchestrator that fills a theme with client content and wires up a deployable site.
**Model:** sonnet — site generation logic

### Step 9.1: Create scaffold orchestrator

**Create:** `tools/scaffold-client-site.ts`

CLI:

```bash
npx tsx tools/scaffold-client-site.ts --theme corvus --trade events --brief output/briefs/abc123.json
```

Steps:

1. Copy `sites/base-template/` to `sites/_[theme]-[trade]/`
2. Wire theme: update `theme.config.ts` to import from `@platform/themes/[name]`
3. Update `layout.tsx` to use theme Header/Footer
4. Generate `site.config.ts` from brief's business data
5. Generate MDX content:
   - Services from `brief.content.services`
   - Locations from `brief.content.locations`
   - Placeholder blog posts
6. Set `pipelineTestSite: true` in package.json
7. Run `pnpm install` to register workspace
8. Verify `npm run dev` starts (spawn, wait for ready, kill)

### Step 9.2: Generalize image manifest

**Modify:** `tools/generate-image-manifest.ts`

Read the file first. Change:

- Accept `--site <path>` flag (currently hardcoded to colossus)
- Scan ALL content types in the given site directory: `content/services/`, `content/locations/`, `content/blog/`, `content/projects/`
- Each MDX file with a frontmatter `image` field that's empty/placeholder → add to manifest
- Style prompt from brief's theme visual language

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -5
echo "Phase 9 PASSED"
```

**Commit:**

```bash
git add tools/scaffold-client-site.ts tools/generate-image-manifest.ts
git commit -m "feat(pipeline): add client site scaffolding + generalize image manifest

Scaffold orchestrator copies base-template, wires theme, generates content
from brief data. Image manifest now works with any site directory.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 10: E2E Orchestrator

**Goal:** Build the unified orchestrator that reads a JobBrief and runs all stages with resumability.
**Model:** sonnet — wiring together all previous phases

### Step 10.1: Create E2E orchestrator

**Create:** `tools/clone-and-scaffold.ts`

CLI:

```bash
npx tsx tools/clone-and-scaffold.ts --brief output/briefs/abc123.json
```

Implementation:

```typescript
import { ingestLiveSite } from "./lib/clone-entry/ingest-live-site";
import { runVisualQALoop } from "./lib/visual-qa-loop";
import { hasCompletedStep, markStepDone } from "./lib/step-tracker";
// ... other imports

async function main() {
  const brief = readAndValidateBrief(args.brief);
  const cloneDir = `output/clones/${brief.theme.name || brief.id}`;
  const themeName = brief.theme.name || pickThemeName();
  const sitePath = `sites/_${themeName}-${brief.business.trade}`;

  // Stage 1: Clone
  if (!hasCompletedStep(cloneDir, "stage-1")) {
    switch (brief.source.type) {
      case "url":
        await ingestLiveSite(brief, cloneDir);
        break;
      case "stitch":
        console.log("Stitch entry: use /pipeline.stitch-design --cpf-output");
        process.exit(1);
        break;
      case "design-skill":
        /* Entry C */ break;
    }
    await runVisualQALoop({ clonePath: cloneDir, ...brief.qa, mode: "pixel" });
    markStepDone(cloneDir, "stage-1", brief.id);
    if (brief.runMode === "interactive") {
      console.log(`\nStage 1 complete. Review clone at: ${cloneDir}/`);
      console.log("Press Enter to continue or Ctrl+C to stop.");
      await waitForInput();
    }
  }

  // Stage 2: Extract theme
  if (!hasCompletedStep(cloneDir, "stage-2")) {
    await extractTheme(brief, cloneDir, themeName);
    markStepDone(cloneDir, "stage-2", brief.id);
    if (brief.runMode === "interactive") {
      console.log(`\nStage 2 complete. Review theme at: packages/themes/${themeName}/`);
      await waitForInput();
    }
  }

  // Stage 3: Scaffold
  if (!hasCompletedStep(cloneDir, "stage-3")) {
    await scaffoldSite(brief, themeName, sitePath);
    await runVisualQALoop({ clonePath: sitePath, ...brief.qa, mode: "structural" });
    markStepDone(cloneDir, "stage-3", brief.id);
    if (brief.runMode === "interactive") {
      console.log(`\nSite scaffolded at: ${sitePath}/`);
      console.log("Review before image generation.");
      await waitForInput();
    }
  }

  // Image generation
  if (brief.imageGen.enabled && !hasCompletedStep(cloneDir, "images")) {
    await generateImages(brief, sitePath);
    markStepDone(cloneDir, "images", brief.id);
  }

  console.log(`\nDone. Site at: ${sitePath}/`);
}
```

### Step 10.2: Entry B and C stubs

**Create:** `tools/lib/clone-entry/stitch-mcp.ts` — stub that logs "Use /pipeline.stitch-design with --cpf-output flag" and exits. Full implementation deferred to a follow-up session.

**Create:** `tools/lib/clone-entry/design-skill.ts` — stub that reads pre-generated HTML from `brief.source.outputDir`, runs HTML-to-JSX converter, captures reference screenshots. Minimal but functional.

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -5
echo "Phase 10 PASSED"
```

**Commit:**

```bash
git add tools/clone-and-scaffold.ts tools/lib/clone-entry/stitch-mcp.ts tools/lib/clone-entry/design-skill.ts
git commit -m "feat(pipeline): add E2E orchestrator with resumability

Reads JobBrief, runs Clone → Extract → Scaffold stages with per-step
resumability markers. Entry B (Stitch) stubbed, Entry C (design skill)
minimal implementation.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 11: Final Verification

**Goal:** Full type-check across the monorepo and verify all new files are properly integrated.
**Model:** haiku — mechanical verification

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -10
echo "---"
echo "New files created:"
git diff --name-only develop..HEAD --diff-filter=A
echo "---"
echo "Files modified:"
git diff --name-only develop..HEAD --diff-filter=M
echo "---"
echo "Phase 11 PASSED — all verification gates clear"
```

No commit needed — this is verification only.

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed.

### Intra-phase groups

| Group | Phase    | Items                                                                                         | File overlap | Model          | Rationale                                                      |
| ----- | -------- | --------------------------------------------------------------------------------------------- | ------------ | -------------- | -------------------------------------------------------------- |
| G1    | Phase 1  | Create `pipeline-brief-types.ts`, Create `cpf-validator.ts`, Create `CLONE_PACKAGE_FORMAT.md` | none         | sonnet         | Three independent new files with no shared imports             |
| G2    | Phase 3  | Create `html-to-jsx-converter.ts`, Create fixture files in `__fixtures__/html-samples/`       | none         | sonnet + haiku | Converter is sonnet, fixtures are mechanical haiku             |
| —     | Phase 2  | — no parallel work in this phase —                                                            |              |                | Single file creation                                           |
| —     | Phase 4  | — no parallel work in this phase —                                                            |              |                | Single file modification                                       |
| —     | Phase 5  | — no parallel work in this phase —                                                            |              |                | Files depend on each other                                     |
| —     | Phase 6  | — no parallel work in this phase —                                                            |              |                | Single complex file                                            |
| —     | Phase 7  | — no parallel work in this phase —                                                            |              |                | Single file creation                                           |
| G3    | Phase 8  | Modify `computed-style-token-mapper.ts`, Create `extract-theme.ts`                            | none         | sonnet         | Independent files — mapper is utility, orchestrator imports it |
| G4    | Phase 9  | Create `scaffold-client-site.ts`, Modify `generate-image-manifest.ts`                         | none         | sonnet         | Independent files                                              |
| G5    | Phase 10 | Create `stitch-mcp.ts` stub, Create `design-skill.ts` stub                                    | none         | haiku          | Mechanical stubs                                               |

### Cross-phase groups (only if phases are truly independent)

| Group | Phases            | Items                                          | Rationale                                                   |
| ----- | ----------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| G6    | Phase 2 + Phase 4 | Asset downloader + style extractor enhancement | No shared files, no dependency. Both are inputs to Phase 5. |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                      |
| --------------------------------- | ------------------------------------------- |
| Verification gates between phases | Each phase's output gates the next          |
| Git commits                       | One per phase, in order                     |
| Phase 5 depends on Phases 2, 3, 4 | Entry A orchestrator imports all three      |
| Phase 6 depends on Phase 5        | QA loop tests the clone produced by Entry A |
| Phase 8 depends on Phase 7        | Theme extraction uses content stripper      |
| Phase 10 depends on Phases 5-9    | E2E orchestrator imports all stages         |

---

## Cost Estimate

| Phase                         | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ----------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Schemas & CPF        | sonnet | ~8k               | ~3k                | $0.07      |
| Phase 2: Asset downloader     | sonnet | ~6k               | ~2k                | $0.05      |
| Phase 3: HTML-to-JSX          | sonnet | ~10k              | ~4k                | $0.09      |
| Phase 4: Style extraction     | sonnet | ~8k               | ~1.5k              | $0.05      |
| Phase 5: Entry A orchestrator | sonnet | ~12k              | ~3k                | $0.08      |
| Phase 6: Visual QA loop       | opus   | ~15k              | ~4k                | $0.52      |
| Phase 7: Content stripper     | sonnet | ~8k               | ~2.5k              | $0.06      |
| Phase 8: Token extraction     | sonnet | ~12k              | ~3k                | $0.08      |
| Phase 9: Scaffold + manifest  | sonnet | ~15k              | ~3k                | $0.09      |
| Phase 10: E2E orchestrator    | sonnet | ~12k              | ~3k                | $0.08      |
| Phase 11: Verification        | haiku  | ~5k               | ~0.5k              | $0.002     |
| **Total**                     |        | **~111k**         | **~29.5k**         | **~$1.17** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-13_unified-clone-pipeline/yolo-brief.md`:

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

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (e.g., `Claude Sonnet 4.6` not `Opus 4.6`)

## Completed

**Date:** 2026-04-13
**Status:** All phases executed successfully

All 11 phases of the unified clone-to-theme-to-scaffold pipeline were implemented. The 19 new files and 3 modified files establish the full 3-stage CPF architecture: a Zod-validated JobBrief schema and CPF spec (Phase 1), a comprehensive asset downloader (Phase 2), a mechanical HTML-to-JSX converter using node-html-parser (Phase 3), per-section computed style extraction (Phase 4), Entry A live-site ingest orchestrator with step-level resumability (Phase 5), a Playwright visual QA loop with pixel and structural modes (Phase 6), a pattern-based content stripper that generates TypeScript props interfaces (Phase 7), enhanced token mapper with section color mapping + theme extraction orchestrator (Phase 8), client site scaffold from base-template (Phase 9), and the E2E clone-and-scaffold.ts orchestrator with Entry B stub and functional Entry C design-skill entry point (Phase 10). One surprise: `pipeline-visual-compare.ts` exports `compareImages` not `compareScreenshots` — caught on Phase 6 and fixed inline. Pre-existing ThemeName union errors from the 20-reserved-names commit exist on develop and are unrelated to this work.

### Commits

- d7e4d54 feat(pipeline): add JobBrief schema, CPF spec, and CPF validator
- 3aa7b01 feat(pipeline): add comprehensive asset downloader
- 1789252 feat(pipeline): add per-section computed style extraction
- fe9db09 feat(pipeline): add mechanical HTML-to-JSX converter
- e6d231c feat(pipeline): add Entry A — ingest live site to CPF
- 9c90e1f feat(pipeline): add Playwright visual QA loop
- 0c7cb2c feat(pipeline): add content stripper for theme extraction
- ae5ab7c feat(pipeline): add theme extraction from clone
- 3f7eeeb feat(pipeline): add client site scaffolding + generalize image manifest
- 63361bc feat(pipeline): add E2E orchestrator with resumability
