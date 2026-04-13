# Implementation Plan: Unified Clone-to-Theme-to-Scaffold Pipeline

**Date:** 2026-04-13
**Status:** Ready for review — synthesised from Claude and Codex independent plans
**Source:** Dual-model peer review (Claude Opus + OpenAI o3 via OpenRouter)

---

## Key Differences Between Plans

| Aspect                      | Claude                                                                      | Codex                                                                                                     | Synthesised Decision                                                                                                                                                                                                                                                                                                 |
| --------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Clone format**            | Loose convention — `output/clones/[name]/` with expected subdirs            | Formal **Clone Package Format (CPF)** with Zod schema validator + `meta.json` versioning + `dom-map.json` | **Adopt CPF spec** — Codex's formal validator catches format drift early, especially important with 3 entry points converging. Skip the `dom-map.json` for v1 (adds complexity without clear consumer).                                                                                                              |
| **HTML parser**             | `node-html-parser` (zero deps, fast)                                        | `posthtml` + `htmltojsx` + custom plugin                                                                  | **Use `node-html-parser`** — simpler, fewer deps, sufficient for mechanical conversion. PostHTML's plugin architecture is overkill when we're doing straightforward attr conversion + script stripping.                                                                                                              |
| **Content stripping**       | Pattern-based regex (phone/email/name detection)                            | Heuristic flagging via business-info matching + "content nodes" vs layout classification                  | **Combine** — use Claude's concrete patterns (regex for phone, email, business name from brief) plus Codex's principle of flagging raw asset images as content. Both agreed AST-based stripping is fragile; pattern-based is correct.                                                                                |
| **Token extraction**        | Enhance existing `computed-style-token-mapper.ts`, add per-section CSS vars | k-means clustering in L*a*b\* color space, map clusters to tokens                                         | **Start with Claude's approach** (direct hex mapping to nearest semantic token) — it's simpler and the existing mapper is well-tested. Add Codex's L*a*b\* clustering as a future enhancement if the simple approach misclassifies colors.                                                                           |
| **Resumability**            | Stage-level markers (`stage-[n]-complete.json`)                             | Per-function `.done.json` with input/output hashes                                                        | **Adopt Codex's granular approach** — per-step `.done.json` with content hashes. More resilient to mid-stage crashes. The orchestrator checks for `.done.json` and skips unless `--force`.                                                                                                                           |
| **Entry C (design skills)** | Pre-generate HTML in interactive pre-step, include in brief                 | Reads zip/tar of skill output, transforms to CPF                                                          | **Claude's approach** — pre-generation in the pre-step is cleaner because design skills are Claude system skills (not callable APIs). The brief references the pre-generated output dir.                                                                                                                             |
| **Testing**                 | Focused on colorcode.events as golden fixture                               | Multi-site fixtures (WordPress, Squarespace, Shopify) + CI matrix                                         | **Adopt Codex's breadth** for fixtures, but not the CI matrix (node 18/20 + mac/linux is overkill for this internal tool). Golden fixtures for 2-3 site types is right.                                                                                                                                              |
| **File structure**          | Tools in `tools/lib/`, orchestrators in `tools/`                            | Entry adaptors in `tools/clone-entry/`, validator as separate package                                     | **Hybrid** — keep tools in `tools/lib/` (matches existing codebase convention) but adopt the entry adaptor pattern as separate files in `tools/lib/clone-entry/`. Skip the separate `packages/cpf-validator/` — put the validator in `tools/lib/cpf-validator.ts` (it's pipeline tooling, not a runtime dependency). |

## Blind Spots Caught

- **Codex caught:** The need for a formal CPF spec document and validator. Without this, three entry points will drift in their output format and Stage 2 will break on edge cases. This is the most valuable insight from Codex's plan.
- **Codex caught:** Per-function resumability with content hashes, not just stage-level markers. A stage with 5 sub-steps that crashes at step 4 would re-run all 5 with Claude's approach.
- **Codex caught:** Multiple site type fixtures for testing the HTML converter (WordPress, Squarespace, Shopify markup all differ significantly).
- **Claude caught:** Entry C (design skills) can't be called as APIs — they're Claude system skills. Codex assumed a zip/tar input, which doesn't exist. The pre-step must generate the HTML interactively.
- **Claude caught:** The visual QA loop needs explicit dev server lifecycle management (spawn, wait for ready, kill between iterations). Codex's plan mentioned the loop but not the server management.
- **Claude caught:** `style` attribute string-to-object conversion is a non-trivial part of HTML-to-JSX (Codex's plan handled it with "convert to Tailwind where trivial else inline CSS block", which is AI-dependent; Claude's mechanical approach is more reliable).

---

## Pre-Step: Intake & Brief Creation (Interactive, Separate)

This runs BEFORE the autonomous pipeline. It produces a self-contained `JobBrief` JSON.

### JobBrief Schema

**Create:** `tools/lib/pipeline-brief-types.ts`

```typescript
// Zod-validated schema
const JobBriefSchema = z.object({
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
    name: z.string().optional(), // from constellation namespace
    brandColors: BrandColorsSchema.optional(),
    preferDark: z.boolean().optional(),
    referenceNotes: z.string().optional(),
  }),

  qa: z.object({
    maxIterations: z.number().int().min(1).max(5).default(3),
    thresholds: z.record(z.string(), z.number()).default({ home: 0.05, about: 0.05, default: 0.1 }),
  }),

  imageGen: z.object({
    enabled: z.boolean().default(true),
    mode: z.enum(["batch", "realtime"]).default("batch"),
    stylePrompt: z.string().optional(),
  }),

  runMode: z.enum(["interactive", "autonomous"]),
});
```

### Brief Creation Tool

**Create:** `tools/create-pipeline-brief.ts`

Interactive CLI:

1. Prompt for entry point type (URL / Stitch / design skill)
2. Collect entry-specific info (URL, or skill name + invoke skill to pre-generate HTML)
3. Collect business info (or accept `--project <projectfile.json>` from existing intake)
4. Collect content seeds (services, locations, about summary)
5. Collect theme preferences (colors, dark/light, reference notes)
6. **Validation loop:**
   - Completeness: Zod parse, flag missing required fields
   - Reachability: if URL entry, `fetch(url)` status check
   - Color coherence: WCAG contrast check on brand color pairs
   - Service/location review: display list for confirmation
   - Design direction: show skill + dials or reference URL for confirmation
   - Full brief summary: human-readable display for final approval
7. Write to `output/briefs/[id].json`

**Modify:** `packages/intake-system/src/chat-intake/tools.ts` — add `generate_pipeline_brief` tool.

**Verification gate:** Create brief for colorcode.events, Zod validates, all fields present.

---

## Clone Package Format (CPF) v0.1

All three entry points produce this exact structure. A Zod validator enforces it.

```
output/clones/<name>/
├── meta.json                      # { jobId, sourceType, sourceRef, capturedAt, cpfVersion: "0.1" }
├── assets/
│   ├── images/                    # All downloaded/generated images
│   └── fonts/                     # Downloaded/generated fonts
├── html/
│   └── pages/{slug}.html          # Original cleaned HTML (scripts stripped)
├── jsx/
│   └── pages/{slug}.tsx           # Mechanical JSX conversion
├── styles/
│   ├── computed-styles.json       # Per-element resolved CSS from Playwright
│   └── imported.css               # External stylesheets (reference only)
├── reference-screenshots/
│   └── {slug}.png                 # Ground truth at 1440x900
├── reports/                       # Visual QA iteration reports (populated by QA loop)
│   └── iteration-{n}/
│       ├── {slug}-diff.png
│       └── {slug}-results.json
└── .done.json                     # Resumability marker (per-step)
```

**Create:** `tools/lib/cpf-validator.ts` — Zod schema that validates a clone directory has all required files and correct `meta.json` structure.

**Create:** `docs/pipeline/CLONE_PACKAGE_FORMAT.md` — human-readable spec.

**Verification gate:** `npx tsx tools/lib/cpf-validator.ts output/clones/corvus/` passes.

---

## Phase 1: Entry Point Adaptors + HTML-to-JSX

### Step 1.1: Asset downloader

**Create:** `tools/lib/asset-downloader.ts`

- Parse HTML for all asset URLs: `<img src>`, `<link rel="stylesheet" href>`, `<source srcset>`, CSS `url()`, `@font-face`
- Download all (no cap), categorize into `assets/images/`, `assets/fonts/`
- Skip: data URIs, inline SVG (stays in HTML), broken URLs (warn + skip)
- Handle: relative URLs, protocol-relative URLs, srcset multiple URLs
- Output: `asset-manifest.json` mapping original URL → local path

**Verification:** Run against colorcode.events HTML, expect 20+ images + fonts.

### Step 1.2: HTML-to-JSX converter

**Add dependency:** `node-html-parser`

**Create:** `tools/lib/html-to-jsx-converter.ts`

Mechanical conversion only — no AI interpretation:

1. Parse with `node-html-parser`
2. **Strip:** `<script>`, `<noscript>`, `<iframe>` (third-party), tracking pixels, comments, WordPress admin bars, Google Tag Manager
3. **Convert attrs:** `class` → `className`, `for` → `htmlFor`, `tabindex` → `tabIndex`, boolean attrs, `style` string → JSX object (mechanical parser, not AI)
4. **Self-close:** `<img />`, `<br />`, `<hr />`, `<input />`, `<meta />`, `<link />`
5. **Rewrite URLs:** asset manifest lookup (original → local path)
6. **Wrap:** each page as `export function Page() { return (<>...</>) }`
7. **Layout:** extract `<html>/<head>/<body>` into shared `layout.tsx`

Edge cases:

- Inline `<style>` → extract to `styles/imported.css`
- SVG inline → preserve (convert attrs only)
- `srcset` → rewrite each URL individually
- CSS custom properties in `style` attr → preserve

Write cleaned HTML to `html/pages/{slug}.html` and JSX to `jsx/pages/{slug}.tsx`.

**Verification:** Convert colorcode.events home → TSX compiles with `tsc --noEmit`. Golden fixture test for WordPress/Squarespace/plain HTML samples.

### Step 1.3: Enhanced computed style extraction

**Modify:** `tools/lib/computed-style-extractor.ts`

Add `extractAllSectionStyles()`:

- `page.evaluate()` iterating ALL `<section>` elements
- Per element: `backgroundColor`, `color`, `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `padding`, `margin`, `borderRadius`
- Also capture `<header>`, `<footer>`, `<nav>`, `<main>` styles
- Write to `styles/computed-styles.json`

**Verification:** Against colorcode.events, captures yellow (#F5D121), blue, green section backgrounds.

### Step 1.4: Entry A — Ingest from live URL

**Create:** `tools/lib/clone-entry/ingest-live-site.ts`

Orchestrates:

1. Discover pages (reuse `site-discovery.ts`)
2. Fetch HTML (reuse existing logic, 500ms between requests)
3. Capture screenshots + computed styles via Playwright (reuse `screenshot-capture.ts`)
4. Download assets (`asset-downloader.ts`)
5. Convert HTML to JSX (`html-to-jsx-converter.ts`)
6. Extract section styles (`computed-style-extractor.ts`)
7. Write `meta.json` + assemble CPF directory
8. Validate with `cpf-validator.ts`

Each sub-step writes `.done.json` with input hash for resumability.

**Verification:** `output/clones/corvus/` passes CPF validation. `meta.json` correct.

### Step 1.5: Entry B — Stitch MCP

**Create:** `tools/lib/clone-entry/stitch-mcp.ts`

Thin wrapper that:

1. Runs existing Stitch pipeline steps 2-3 (create project, design system, generate screens, export HTML, download images)
2. Writes Stitch HTML exports to `html/pages/`
3. Runs HTML-to-JSX converter on Stitch HTML
4. Copies Stitch images to `assets/images/`
5. Captures Stitch-rendered screens as `reference-screenshots/`
6. Assembles CPF

**Modify:** `.claude/commands/pipeline.stitch-design.md` — add `--cpf-output <path>` mode that writes to CPF format alongside existing theme output. Backward compatible — without the flag, behavior unchanged.

**Verification:** Stitch pipeline produces valid CPF. Existing pipeline still works without flag.

### Step 1.6: Entry C — Design skill

**Create:** `tools/lib/clone-entry/design-skill.ts`

1. Reads `brief.source.outputDir` (pre-generated HTML from the interactive pre-step)
2. Runs HTML-to-JSX converter on the skill's HTML output
3. Playwright-renders the HTML to capture reference screenshots
4. Extracts any Google Fonts or image references to `assets/`
5. Assembles CPF

**Verification:** Design skill HTML converts to valid CPF. Reference screenshots captured.

### Step 1.7: Visual QA loop

**Create:** `tools/lib/visual-qa-loop.ts`

```typescript
interface VisualQAConfig {
  clonePath: string; // CPF directory
  maxIterations: number;
  thresholds: Record<string, number>;
  mode: "pixel" | "structural";
}

async function runVisualQALoop(config: VisualQAConfig): Promise<VisualQAResult>;
```

Loop mechanics:

1. **Start dev server:** Spawn `next dev` as child process on the CPF's JSX pages. Wait for "Ready" on stdout (timeout 30s).
2. **Capture:** Playwright captures all pages at 1440x900, saves to `reports/iteration-{n}/`
3. **Compare:** `pipeline-visual-compare.ts` diffs against `reference-screenshots/`. Save diff images.
4. **If all pass** (< threshold) → kill server, return success.
5. **If any fail:**
   a. Write findings summary to `reports/iteration-{n}/findings-input.json`
   b. Spawn `cs-visual-fidelity-reviewer` agent with diff images + both screenshot sets → writes `findings.json`
   c. Spawn `cs-frontend-engineer` agent with findings → applies fixes to JSX/CSS files
   d. Kill dev server. Next iteration restarts it.
6. **After max iterations** → log remaining diffs, return with warnings. Pipeline continues.

**Verification:** Introduce a deliberate CSS error in a clone. Loop detects it, fixes it, second iteration passes.

---

## Phase 2: Theme Extraction

### Step 2.1: Content stripper

**Create:** `tools/lib/content-stripper.ts`

Pattern-based replacement using brief's business data as reference:

**Text replacement:**

- Business name (exact match from brief) → `{props.businessName}`
- Phone patterns → `{props.phone}`
- Email patterns → `{props.email}`
- Address patterns (postcode, city from brief) → `{props.address}`
- Headings (`<h1>`-`<h6>`) → `{props.heading}` / `{props.sectionTitle}`
- Paragraphs (>20 chars) → `{props.body}` / `{props.description}`

**Image replacement:**

- `<img src="/assets/images/...">` → `<img src={props.imageSrc} alt={props.imageAlt} />`
- Background images in style → `style={{ backgroundImage: \`url(\${props.bgImage})\` }}`
- Raw asset images (not decorative SVGs) flagged as content

**Keep hardcoded:**

- All CSS classes
- Decorative elements (SVGs, dividers, geometric shapes)
- Layout structure (grids, flex containers)
- Short label text (<20 chars, likely UI labels)

**Output:** Modified TSX with auto-generated props interfaces.

**Verification:** Stripped components compile. No business-specific text remains. Props interface covers all replaced slots.

### Step 2.2: Token extraction

**Modify:** `tools/lib/computed-style-token-mapper.ts`

1. Map most-used background → `--color-brand-primary`, second → `--color-brand-secondary`, accent → `--color-brand-accent`
2. Map text colors → `--color-surface-foreground`, `--color-surface-background`
3. Per-section backgrounds outside standard palette → `--color-section-[purpose]` CSS custom properties in `globals.css`
4. Typography: map computed font sizes to 8-level scale, extract families and weights
5. Output: standard `ThemeConfig` for `index.ts` + additional CSS vars for `globals.css`

**Verification:** Tokens match reference visually. WCAG contrast passes on all pairs.

### Step 2.3: Component decomposition + page layouts

From stripped JSX pages:

1. Split by `<section>` boundaries → individual components in `packages/themes/[name]/components/`
2. Header + Footer → Server Component exports
3. Page layouts in `packages/themes/[name]/pages/` — section ordering matches reference exactly
4. Barrel `index.ts` with all exports

**Verification:** Each component compiles. Barrel exports correct.

### Step 2.4: Theme package assembly

**Modify:** `tools/scaffold-theme-package.ts`

Accept clone-derived components:

- `package.json` with peer deps
- `index.ts` barrel (registry + config + component exports)
- `globals.css` (standard utilities + per-section color tokens)
- ComponentRegistry metadata

**Verification gate:** TPV passes. `pnpm type-check` passes.

---

## Phase 3: Client Site Scaffolding

### Step 3.1: Site scaffolding

**Create:** `tools/scaffold-client-site.ts`

1. Copy `sites/base-template/` structure
2. Wire to theme: `theme.config.ts`, `layout.tsx`, `tailwind.config.ts`
3. Generate `site.config.ts` from brief's business data
4. Set `pipelineTestSite: true` in package.json

**Verification:** `npm run dev` works with placeholder content.

### Step 3.2: Content generation

Use existing infrastructure:

- `tools/lib/content-prompts.ts` for services
- `tools/lib/location-prompts.ts` for locations
- Brief's services/locations arrays as seed data
- Generate MDX in `content/services/`, `content/locations/`, `content/blog/`

**Verification:** `npm run validate:content` passes.

### Step 3.3: Structural visual QA loop

Same `visual-qa-loop.ts` in `structural` mode:

- Section count matches clone
- Hero/header variant correct
- Card layout matches
- Max 2 iterations

**Verification:** Layout structure preserved from clone through to scaffold.

### Step 3.4: Image generation

**Modify:** `tools/generate-image-manifest.ts` → `tools/lib/image-manifest-generator.ts`

Generalize:

- Accept `--site <path>` flag (any site, not just colossus)
- Scan all content types for image slots
- Style prompts informed by theme visual language from brief
- Support `--batch` (overnight Gemini batch API) and `--realtime` (3s/image)

Pipeline:

1. Generate manifest → `output/image-manifest.json`
2. `generate-images-ai.ts` or `generate-images-batch.ts`
3. `upload-generated-images.ts` → R2
4. `update-mdx-images.ts` → MDX frontmatter

**Verification:** Manifest generated for non-colossus site. At least 1 image generates successfully.

---

## Phase 4: E2E Orchestrator

### Step 4.1: Unified orchestrator

**Create:** `tools/clone-and-scaffold.ts`

```typescript
async function main() {
  const brief = readAndValidateBrief(args.brief);

  // Stage 1: Clone (via appropriate entry adaptor)
  if (!hasCompletedStep(brief.id, "stage-1")) {
    const adaptor = getEntryAdaptor(brief.source.type);
    await adaptor.run(brief);
    await runVisualQALoop({ clonePath: cloneDir, ...brief.qa, mode: "pixel" });
    markStepDone(brief.id, "stage-1");
    if (brief.runMode === "interactive") await checkpoint("Stage 1 complete. Review clone.");
  }

  // Stage 2: Extract theme
  if (!hasCompletedStep(brief.id, "stage-2")) {
    await extractTheme(brief);
    markStepDone(brief.id, "stage-2");
    if (brief.runMode === "interactive") await checkpoint("Stage 2 complete. Review theme.");
  }

  // Stage 3: Scaffold
  if (!hasCompletedStep(brief.id, "stage-3")) {
    await scaffoldSite(brief);
    await runVisualQALoop({ clonePath: siteDir, ...brief.qa, mode: "structural" });
    markStepDone(brief.id, "stage-3");
    if (brief.runMode === "interactive") await checkpoint("Pre-image review.");
  }

  // Image generation
  if (brief.imageGen.enabled && !hasCompletedStep(brief.id, "images")) {
    await generateImages(brief);
    markStepDone(brief.id, "images");
  }

  log(`Done. Site at: sites/_${brief.theme.name}-${brief.business.trade}/`);
}
```

### Step 4.2: Resumability

- `hasCompletedStep()` checks for `.done.json` files with content hashes
- If pipeline crashes mid-step, re-running with same brief skips completed steps
- `--force-stage <n>` flag to re-run a specific stage
- All intermediate artifacts preserved in `output/clones/[name]/`

### Step 4.3: Deathstar invocation

```bash
# Single command for overnight autonomous run
npx tsx tools/clone-and-scaffold.ts --brief output/briefs/[jobId].json
```

**Verification gate (acceptance):** Full pipeline runs unattended against colorcode.events brief. Produces a site at `sites/_corvus-events/` that boots with `npm run dev`, has generated content, and visual diff <10% from reference on major pages.

---

## Testing Strategy

### Unit tests

- CPF validator edge cases (missing files, wrong version, malformed meta.json)
- HTML-to-JSX converter fixtures:
  - Plain semantic HTML (colorcode.events style)
  - WordPress markup (admin bars, wp-content paths)
  - Squarespace (data-block attrs, sqs-gallery)
- Content stripper: phone/email/name detection patterns
- Brief schema validation (missing fields, invalid URLs)

### Integration tests

- Golden fixtures: colorcode.events clone (committed to repo as test fixture)
- Entry adaptor tests with frozen HTML input → expected CPF output

### E2E

- Full pipeline against colorcode.events (nightly or on-demand)
- Visual diff report saved as CI artifact

---

## Implementation Order

| Order | What                                   | Effort | Dependencies           | Files                                                                                                      |
| ----- | -------------------------------------- | ------ | ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1     | JobBrief schema + CPF spec + validator | Low    | None                   | `tools/lib/pipeline-brief-types.ts`, `tools/lib/cpf-validator.ts`, `docs/pipeline/CLONE_PACKAGE_FORMAT.md` |
| 2     | Asset downloader                       | Low    | None                   | `tools/lib/asset-downloader.ts`                                                                            |
| 3     | HTML-to-JSX converter                  | Medium | `node-html-parser` dep | `tools/lib/html-to-jsx-converter.ts`                                                                       |
| 4     | Enhanced style extraction              | Low    | None                   | `tools/lib/computed-style-extractor.ts` (modify)                                                           |
| 5     | Entry A adaptor (ingest)               | Medium | Steps 2-4              | `tools/lib/clone-entry/ingest-live-site.ts`                                                                |
| 6     | Visual QA loop                         | Medium | Entry A working        | `tools/lib/visual-qa-loop.ts`                                                                              |
| 7     | Content stripper + token extraction    | Medium | CPF format             | `tools/lib/content-stripper.ts`, `tools/lib/computed-style-token-mapper.ts` (modify)                       |
| 8     | Component decomposition + assembly     | Medium | Step 7                 | `tools/scaffold-theme-package.ts` (modify), `tools/lib/page-template-generator.ts` (modify)                |
| 9     | Site scaffolding + content gen         | Medium | Step 8                 | `tools/scaffold-client-site.ts`                                                                            |
| 10    | Image manifest generalization          | Low    | Parallel               | `tools/lib/image-manifest-generator.ts`                                                                    |
| 11    | E2E orchestrator                       | Low    | All stages             | `tools/clone-and-scaffold.ts`                                                                              |
| 12    | Entry B (Stitch wiring)                | Low    | CPF format             | `tools/lib/clone-entry/stitch-mcp.ts`, `.claude/commands/pipeline.stitch-design.md` (modify)               |
| 13    | Entry C (Design skill)                 | Low    | CPF format             | `tools/lib/clone-entry/design-skill.ts`                                                                    |
| 14    | Brief creation tool                    | Low    | Schema (Step 1)        | `tools/create-pipeline-brief.ts`                                                                           |

**Critical path:** Steps 1 → 2-4 (parallel) → 5 → 6 → 7-8 → 9 → 11. Entries B+C and the brief tool are additive and can be wired in any time after the CPF format is stable.

---

## Risks and Mitigations

| Risk                                                                        | Impact | Mitigation                                                                                                                                                                                                    |
| --------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTML-to-JSX fails on complex sites (WordPress, heavy CSS-in-JS)             | High   | Start with `node-html-parser` mechanical conversion. For pathological markup, fall back to `dangerouslySetInnerHTML` per-section. Visual QA loop catches conversion errors. Golden fixtures for 3 site types. |
| Visual QA loop doesn't converge (reviewer suggests non-deterministic fixes) | Medium | Cap at 3 iterations. Log suggestion history. Continue with warning — human reviews remaining diffs.                                                                                                           |
| Content stripper over/under-strips                                          | Medium | Conservative by default (only strip clear patterns). Leave ambiguous short text hardcoded. Human cleanup may be needed — acceptable for v1.                                                                   |
| Design skill entry requires interactive pre-generation                      | Low    | Documented in pre-step. If design skills become API-callable in future, Entry C adaptor can invoke them directly.                                                                                             |
| Gemini quota exceeded during image gen                                      | Low    | Brief's `imageGen.mode: "batch"` uses 2M token quota. If quota still exceeded, generate placeholder images and flag for manual completion.                                                                    |
