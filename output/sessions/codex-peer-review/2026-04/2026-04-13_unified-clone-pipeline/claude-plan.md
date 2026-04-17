# Claude's Implementation Plan: Unified Clone-to-Theme-to-Scaffold Pipeline

**Date:** 2026-04-13
**Author:** Claude (independent plan, before Codex synthesis)

---

## Phase 0: Pre-Step — Intake & Brief Creation

### Step 0.1: Define PipelineBrief schema

**Create:** `tools/lib/pipeline-brief-types.ts`

Define a Zod-validated schema for the job brief:

```typescript
interface PipelineBrief {
  jobId: string;
  createdAt: string;
  entry: {
    type: "ingest" | "stitch" | "design-skill";
    referenceUrl?: string;
    stitchConfig?: { designMd?: string; tasteSkill?: string; tasteDials?: TasteDials };
    designSkill?: string;
    designBrief?: string;
  };
  business: {
    name: string;
    trade: string;
    tagline?: string;
    phone?: string;
    email?: string;
    address?: { city: string; postcode: string; region?: string };
    website?: string;
  };
  content: {
    services: string[];
    locations?: string[];
    aboutSummary?: string;
    tone?: string;
    competitors?: string[];
  };
  theme: {
    name?: string;
    brandColors?: { primary?: string; secondary?: string; accent?: string };
    preferDark?: boolean;
    referenceNotes?: string;
  };
  pipeline: {
    mode: "autonomous" | "interactive";
    generateImages: boolean;
    imageBatchMode: boolean;
    maxQAIterations: number;
    skipStages?: string[];
  };
}
```

**Verification:** Types compile, schema validates a sample brief.

### Step 0.2: Build brief creation tool

**Create:** `tools/create-pipeline-brief.ts`

Interactive CLI that:

1. Prompts for entry point type
2. Collects business info (or accepts existing ProjectFile JSON via `--project` flag)
3. Collects entry-point-specific info (URL for ingest, skill name for design-skill, etc.)
4. Runs validation loop:
   - Completeness: all required fields present
   - Reachability: if ingest, `fetch(url)` returns 200
   - Color coherence: if brand colors provided, check WCAG contrast pairs
   - Service/location review: print list for confirmation
   - Design direction: show chosen skill/dials for confirmation
5. Writes validated brief to `output/briefs/[jobId].json`

**Modify:** `packages/intake-system/src/chat-intake/tools.ts` — add `generate_pipeline_brief` tool for the chat-based flow.

**Verification:** Create a brief for colorcode.events ingest, verify JSON is complete and validates.

---

## Phase 1: Clone Format & Entry Points

### Step 1.1: Define clone format

**Create:** `tools/lib/clone-types.ts`

Types for the intermediate clone format:

```typescript
interface CloneManifest {
  source: {
    entry: "ingest" | "stitch" | "design-skill";
    url?: string;
    stitchProjectId?: string;
    designSkill?: string;
  };
  pages: Array<{ route: string; tsxFile: string; referenceScreenshot: string }>;
  assets: Array<{ originalUrl: string; localPath: string; type: "image" | "font" | "css" }>;
  computedStyles: Record<string, ElementStyles>;
  createdAt: string;
}
```

**Verification:** Types compile.

### Step 1.2: Build asset downloader

**Create:** `tools/lib/asset-downloader.ts`

- Parse HTML for ALL asset URLs: `<img src>`, `<link rel="stylesheet" href>`, `<source srcset>`, CSS `url()` refs, `@font-face src`
- Download all (no cap), categorized into `images/`, `fonts/`, `css/`
- Create `asset-manifest.json`: `{ originalUrl → localPath }`
- Handle: relative URLs, protocol-relative URLs, data URIs (skip), SVG inline (keep in HTML), broken URLs (warn, skip)

**Verification:** Run against colorcode.events HTML — expect 20+ images, fonts, CSS files. All local paths valid.

### Step 1.3: Build HTML-to-JSX converter

**Add dependency:** `node-html-parser` (fast, no native deps, 0 dependencies)

**Create:** `tools/lib/html-to-jsx-converter.ts`

Mechanical conversion (NO AI interpretation):

1. Parse HTML with `node-html-parser`
2. Strip: `<script>`, `<noscript>`, `<iframe>` (third-party), tracking pixels, `<!-- comments -->`, WordPress admin bar markup, Google Tag Manager
3. Convert attributes: `class` → `className`, `for` → `htmlFor`, `tabindex` → `tabIndex`, `autocomplete` → `autoComplete`, boolean attrs (`checked`, `disabled`), `style` string → JSX object
4. Self-close void elements: `<img>`, `<br>`, `<hr>`, `<input>`, `<meta>`, `<link>`
5. Rewrite asset URLs using asset manifest (original → local path)
6. Wrap in React component: `export function PageName() { return (<>...</>) }`
7. Generate shared `layout.tsx` from `<html>`, `<head>`, `<body>` wrapper

Edge cases:

- Inline `<style>` blocks → extract to globals.css or keep as `<style dangerouslySetInnerHTML>`
- SVG inline → preserve as-is (JSX-compatible already if attrs converted)
- `srcset` → preserve, rewrite each URL
- CSS custom properties in `style` attr → preserve verbatim

**Verification:** Convert colorcode.events home page HTML → TSX. Compile with `tsc --noEmit`. Render in Next.js dev server. Visual diff < 15% against reference screenshot.

### Step 1.4: Enhance computed style extraction

**Modify:** `tools/lib/computed-style-extractor.ts`

Add a new function `extractAllSectionStyles()`:

- `page.evaluate()` that iterates ALL `<section>` elements (not just 16 roles)
- For each: `backgroundColor`, `color`, `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `padding`, `margin`, `borderRadius`
- Also capture `<header>`, `<footer>`, `<nav>`, `<main>` wrapper styles
- Return as `SectionComputedStyles[]` with section index and heading text for identification

**Verification:** Run against colorcode.events — should capture the yellow (#F5D121), blue, green section backgrounds.

### Step 1.5: Build Entry A orchestrator (ingest)

**Create:** `tools/clone-site.ts`

Orchestrator for cloning a live URL:

1. Read brief JSON (or accept `--url` + `--name` flags for standalone use)
2. Discover pages (reuse `site-discovery.ts`)
3. Fetch HTML for all pages (reuse existing Step 3 logic)
4. Capture screenshots + computed styles via Playwright (reuse `screenshot-capture.ts`)
5. Download all assets (`asset-downloader.ts`)
6. Convert HTML to JSX per page (`html-to-jsx-converter.ts`)
7. Extract all section styles (`computed-style-extractor.ts`)
8. Assemble clone directory:
   ```
   output/clones/[name]/
   ├── app/{layout,page,about/page,...}.tsx
   ├── public/{images,fonts}/
   ├── meta/{reference-screenshots,computed-styles.json,asset-manifest.json,clone-manifest.json}
   ├── next.config.js (static export)
   ├── package.json
   └── tsconfig.json
   ```
9. Run visual QA loop (Step 1.8)

**Verification:** `output/clones/corvus/` exists with all expected files. `npm run dev` works.

### Step 1.6: Wire Entry B (Stitch)

**Modify:** `.claude/commands/pipeline.stitch-design.md`

Minimal change — after Step 4b (HTML→React conversion), also write the converted pages + downloaded images + Stitch screenshots to `output/clones/[name]/` in the standard clone format. The existing Stitch pipeline continues to also produce `packages/themes/[name]/` directly (backward compatible).

Add a new flag or config option: `--clone-output` that triggers the clone format output.

**Verification:** Run Stitch pipeline with `--clone-output`. Both `output/clones/[name]/` and `packages/themes/[name]/` exist.

### Step 1.7: Wire Entry C (Design Skill)

**Create:** `tools/lib/design-skill-runner.ts`

1. Read brief's `entry.designSkill` and `entry.designBrief`
2. Construct a prompt that invokes the specified skill with the business context
3. The skill outputs HTML/CSS files to a temp directory
4. Run through the same `html-to-jsx-converter.ts` as Entry A
5. Playwright-render the HTML to capture reference screenshots
6. Assemble clone format

**Challenge:** Design skills are Claude system skills, not callable APIs. This step needs to either:

- Option A: Shell out to a Claude CLI invocation with the skill loaded
- Option B: Generate the prompt and include it in the pipeline orchestrator's own context (skill invocation within the pipeline run)
- Option C: Pre-generate the design HTML in the brief creation pre-step and include it in the brief

**Recommendation:** Option C — during the pre-step, invoke the design skill interactively, save the HTML output to `output/briefs/[jobId]-design-output/`, and reference it in the brief JSON. The autonomous pipeline then just converts the pre-generated HTML. This keeps the pipeline itself deterministic and non-interactive.

**Verification:** Design skill HTML converts to valid TSX. Playwright renders it. Clone format assembled.

### Step 1.8: Visual QA loop

**Create:** `tools/lib/visual-qa-loop.ts`

```typescript
interface VisualQAConfig {
  referenceDir: string;
  targetDir: string;
  maxIterations: number;
  thresholds: Record<string, number>;
  mode: "pixel" | "structural";
}

async function runVisualQALoop(config: VisualQAConfig): Promise<VisualQAResult> {
  for (let i = 0; i < config.maxIterations; i++) {
    // 1. Start dev server (next dev, wait for ready)
    // 2. Playwright captures all pages at 1440x900
    // 3. pipeline-visual-compare.ts diffs each page
    // 4. If all pass → return success
    // 5. If any fail:
    //    a. Write findings summary to temp file
    //    b. Spawn cs-visual-fidelity-reviewer agent (read-only) → findings JSON
    //    c. Spawn cs-frontend-engineer agent with findings → applies fixes
    //    d. Kill dev server, restart for next iteration
    // 6. After max iterations → return with warnings
  }
}
```

**Key decisions:**

- Dev server management: spawn `next dev` as child process, wait for "Ready" on stdout, kill between iterations
- Agent communication: findings written to `meta/qa-iteration-[n]/findings.json`, fixes applied directly to clone TSX files
- Diff images saved to `meta/qa-iteration-[n]/diffs/` for debugging

**Verification:** Run loop against a clone with a deliberate CSS error. Verify it detects the error, applies a fix, and the second iteration passes.

---

## Phase 2: Theme Extraction

### Step 2.1: Content stripper

**Create:** `tools/lib/content-stripper.ts`

Strategy: pattern-based replacement (not AST, which is fragile for generated JSX).

1. **Text content detection:**
   - Headings (`<h1>`-`<h6>`) → `{heading}` or `{props.sectionTitle}`
   - Paragraphs (`<p>`) with >20 chars of text → `{props.body}` or `{props.description}`
   - Short text in spans/divs → likely labels, keep hardcoded
   - List items → `{props.items.map(...)}`

2. **Image detection:**
   - `<img src="/images/...">` → `<img src={props.imageSrc} alt={props.imageAlt} />`
   - Background images in style → `style={{ backgroundImage: \`url(\${props.bgImage})\` }}`

3. **Business info detection:**
   - Phone number patterns (`/[\d\s\-()]+\d{4,}/`) → `{props.phone}`
   - Email patterns → `{props.email}`
   - Address patterns (postcode, city names from brief) → `{props.address}`
   - Business name (exact match from brief) → `{props.businessName}`

4. **Keep hardcoded:**
   - CSS classes (all of them)
   - Decorative elements (SVG shapes, dividers, icons)
   - Layout structure (grid definitions, flex containers)
   - Aria labels, data attributes

**Output:** Modified TSX files with props interfaces auto-generated at the top.

**Verification:** Stripped component compiles. Props interface covers all replaced content. No business-specific text remains.

### Step 2.2: Token extraction

**Modify:** `tools/lib/computed-style-token-mapper.ts`

Enhance the existing mapper:

1. **Standard token mapping:** Map the most-used background color to `--color-brand-primary`, second to `--color-brand-secondary`, accent to `--color-brand-accent`. Map text colors to `--color-surface-foreground`, `--color-surface-background`.

2. **Per-section tokens:** For section background colors that don't fit standard tokens, create `--color-section-[slug]` custom properties. E.g., `--color-section-speakers: #F5D121`, `--color-section-sponsors: #2563eb`, `--color-section-volunteers: #16a34a`.

3. **Typography extraction:** Map computed font sizes to the 8-level scale (`hero`, `h1`-`h4`, `body`, `small`, `caption`). Extract font families, weights.

4. **Output:** Standard `ThemeConfig` object for `index.ts`, plus additional CSS custom properties for `globals.css`.

**Verification:** Generated tokens match the reference site's visual appearance. WCAG contrast check passes for all foreground/background pairs.

### Step 2.3: Component decomposition

Each page's stripped sections become individual component files:

1. Identify section boundaries (already marked by `<section>` tags or top-level flex/grid children)
2. Extract each section into its own `.tsx` file in `packages/themes/[name]/components/`
3. Generate props interface from content slots
4. Create barrel `index.ts` exporting all components + Header + Footer

**Verification:** Each component compiles independently. Barrel exports match component count.

### Step 2.4: Page layout generation

**Modify:** `tools/lib/page-template-generator.ts`

Generate layout files in `packages/themes/[name]/pages/`:

```typescript
// packages/themes/corvus/pages/home.tsx
export function CorvusHomePage(props: CorvusHomePageProps) {
  return (
    <main>
      <HeroFullBleedText heading={props.heroHeading} />
      <CallForSpeakers {...props.speakersSection} />
      <CallForSponsors {...props.sponsorsSection} />
      <CallForVolunteers {...props.volunteersSection} />
      <BlogPreviewGrid posts={props.blogPosts} />
      <NewsletterCTA {...props.newsletterSection} />
    </main>
  );
}
```

Section ordering matches the reference exactly.

**Verification:** Page layout renders with mock props. Section order matches reference screenshot.

### Step 2.5: Theme package assembly

**Modify:** `tools/scaffold-theme-package.ts`

Accept clone-derived components (from Steps 2.3-2.4) instead of AI-generated ones:

- `package.json` with peer deps
- `index.ts` barrel with registry + config exports
- `globals.css` with standard utilities + per-section color tokens
- `components/` directory with extracted components
- `pages/` directory with layout templates

**Verification:** TPV (Theme Package Validator) passes. `pnpm type-check` passes.

---

## Phase 3: Client Site Scaffolding

### Step 3.1: Site scaffolding

**Create:** `tools/scaffold-client-site.ts`

1. Copy `sites/base-template/` structure
2. Wire to theme: `theme.config.ts`, `layout.tsx` imports, `tailwind.config.ts`
3. Generate `site.config.ts` from brief's business data
4. Set `pipelineTestSite: true` in package.json (CI-inert)

**Verification:** `npm run dev` works with placeholder content.

### Step 3.2: Content generation

Use existing content generation infrastructure:

- `tools/lib/content-prompts.ts` for service descriptions
- `tools/lib/location-prompts.ts` for location pages
- Brief's `content.services[]` and `content.locations[]` as seed data

Generate MDX files in `content/services/`, `content/locations/`, `content/blog/`.

**Verification:** `npm run validate:content` passes.

### Step 3.3: Structural visual QA loop

Same `visual-qa-loop.ts` but in `structural` mode:

- Compare section COUNT (not pixel-perfect colors)
- Verify hero variant, header variant, card layout match clone
- Max 2 iterations

**Verification:** Section count matches. Layout structure preserved.

### Step 3.4: Image generation

**Modify:** `tools/generate-image-manifest.ts`

Generalize from colossus-specific to any site:

- Accept `--site` flag pointing to a site directory
- Scan all MDX content types (services, locations, blog, projects) for image slots
- Generate prompts informed by theme visual language (color palette, style)
- Support both real-time and batch modes based on brief config

Pipeline:

1. `generate-image-manifest.ts --site sites/_corvus-events` → `output/image-manifest.json`
2. `generate-images-ai.ts` (real-time) or `generate-images-batch.ts` (overnight)
3. `upload-generated-images.ts` → R2
4. `update-mdx-images.ts` → MDX frontmatter

**Verification:** Manifest generated with correct image slots. Images generated (at least 1 in test). MDX updated with R2 URLs.

---

## Phase 4: E2E Orchestrator

### Step 4.1: Build unified orchestrator

**Create:** `tools/clone-and-scaffold.ts`

Reads brief JSON, runs all stages:

```typescript
async function main() {
  const brief = readAndValidateBrief(args.brief);

  // Stage 1: Clone
  if (!brief.pipeline.skipStages?.includes("clone")) {
    const clone = await runStage1(brief);
    if (brief.pipeline.mode === "interactive") await checkpoint("Stage 1 complete. Review clone.");
  }

  // Stage 2: Extract
  if (!brief.pipeline.skipStages?.includes("extract")) {
    const theme = await runStage2(brief);
    if (brief.pipeline.mode === "interactive") await checkpoint("Stage 2 complete. Review theme.");
  }

  // Stage 3: Scaffold
  const site = await runStage3(brief);
  if (brief.pipeline.mode === "interactive") await checkpoint("Pre-image review.");

  if (brief.pipeline.generateImages) {
    await runImageGeneration(brief, site);
  }

  console.log(`Done. Site at: ${site.path}`);
}
```

**Verification:** End-to-end run with colorcode.events brief produces a deployable site.

### Step 4.2: Error handling and resumability

- Each stage writes a `stage-[n]-complete.json` marker on success
- If the pipeline crashes, re-running with the same brief detects markers and skips completed stages
- `--force-stage [n]` flag to re-run a specific stage
- All intermediate artifacts preserved in `output/clones/[name]/`

**Verification:** Kill pipeline mid-Stage-2, re-run, verify it resumes from Stage 2.

---

## Risks and Trade-offs

### Risk 1: HTML-to-JSX fidelity for complex sites

**Impact:** High — if the converter can't handle a site's markup, Stage 1 fails.
**Mitigation:** Start with `node-html-parser` (mechanical, predictable). If a site has pathological markup (deeply nested WordPress, heavy CSS-in-JS), fall back to a simpler per-section extraction. The visual QA loop catches conversion errors.
**Trade-off:** Mechanical conversion preserves structure but may produce verbose JSX. Accept this — Stage 2's content stripper cleans it up.

### Risk 2: Visual QA loop may not converge

**Impact:** Medium — if the fidelity reviewer can't describe actionable fixes, or the frontend engineer applies wrong fixes, the loop wastes iterations.
**Mitigation:** Cap at 3 iterations. Log all findings and diffs for human review. In autonomous mode, continue with a warning rather than blocking.
**Trade-off:** Some sites may have >5% diff after 3 iterations. Accept this for v1 — human can fix the remaining issues.

### Risk 3: Content stripping is heuristic

**Impact:** Medium — pattern-based content detection may miss some text or over-strip decorative text.
**Mitigation:** Conservative stripping — only replace text that matches clear patterns (long paragraphs, phone numbers, email, business name). Leave ambiguous short text hardcoded.
**Trade-off:** Some manual cleanup of theme components may be needed. Better than over-stripping.

### Risk 4: Design skill entry point requires pre-generation

**Impact:** Low-Medium — Entry C can't invoke design skills autonomously (they're Claude system skills, not APIs).
**Decision:** Pre-generate design HTML in the interactive pre-step. Include the HTML files in the brief output. The autonomous pipeline converts them mechanically.
**Trade-off:** Entry C requires more work in the pre-step. Acceptable since the pre-step is interactive anyway.

### Risk 5: Gemini image manifest generalization

**Impact:** Low — current manifest is colossus-specific but the pattern is clear.
**Mitigation:** Parameterize the MDX content scanner. Each content type (service, location, blog, project) has known image slot patterns. The manifest generator just needs to accept a site directory path instead of hardcoding colossus paths.

---

## Implementation Order

| Order | What                                    | Effort | Dependencies            |
| ----- | --------------------------------------- | ------ | ----------------------- |
| 1     | Phase 0: Brief types + creation tool    | Low    | None                    |
| 2     | Step 1.2: Asset downloader              | Low    | None                    |
| 3     | Step 1.3: HTML-to-JSX converter         | Medium | `node-html-parser` dep  |
| 4     | Step 1.4: Enhanced style extraction     | Low    | None                    |
| 5     | Step 1.5: Entry A orchestrator          | Medium | Steps 1.2-1.4           |
| 6     | Step 1.8: Visual QA loop                | Medium | Entry A working         |
| 7     | Phase 2: All steps                      | Medium | Stage 1 producing clone |
| 8     | Phase 3: Steps 3.1-3.3                  | Medium | Stage 2 producing theme |
| 9     | Step 3.4: Image manifest generalization | Low    | None (parallel)         |
| 10    | Phase 4: E2E orchestrator               | Low    | All stages              |
| 11    | Step 1.6: Entry B (Stitch wiring)       | Low    | Clone format defined    |
| 12    | Step 1.7: Entry C (Design skill)        | Low    | Clone format defined    |

**Total estimated effort:** 7-10 working sessions. Entry A + Stages 2-3 are the critical path. Entries B and C can be wired in afterward since they converge to the same format.
