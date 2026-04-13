# YOLO Implementation Brief: Translate Pipeline — AI-Generated Native Tailwind from Clone References

**Branch:** feature/translate-pipeline (created from develop)
**Session spec:** output/sessions/2026-04-13_translate-pipeline/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The old `--pass componentize` (which copied clone CSS verbatim) has been torn down. The `--pass translate` placeholder in `tools/extract-theme.ts` needs to be implemented. It reads the clone's HTML structure, CSS rules, and screenshots as reference material, then uses Claude to generate native Tailwind components from scratch — no clone CSS loaded at runtime.

The key building blocks already exist:

- Vision analysis → section blueprints (`tools/generate-theme-from-reference.ts` has `analyseWithVision()`)
- Computed styles → theme tokens (`tools/lib/computed-style-token-mapper.ts`)
- Blueprint → validated Tailwind JSX with 5-layer gauntlet (`tools/lib/theme-component-generator.ts`)
- Theme package scaffolding (`tools/scaffold-theme-package.ts`)
- HTML structure analysis (`tools/lib/html-structure-analyzer.ts`)

What's missing: feeding clone HTML + CSS context into the component generator, and assembling the results into page files.

This requires `ANTHROPIC_API_KEY` to be set (for Claude vision + component generation API calls).

The plan was reviewed and approved. Implement it exactly as specified below.

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
git checkout -b feature/translate-pipeline
pnpm type-check   # must be clean before starting

# Verify ANTHROPIC_API_KEY is set (required for Claude API calls)
test -n "$ANTHROPIC_API_KEY" && echo "API key set — OK" || echo "STOP: ANTHROPIC_API_KEY not set"

# Verify clone exists
test -d output/clones/corvus/html/pages && echo "Clone HTML ready"
test -d output/clones/corvus/reference-screenshots && echo "Screenshots ready"
test -f output/clones/corvus/styles/computed-styles.json && echo "Computed styles ready"
test -d output/clones/corvus/assets/css && echo "Clone CSS ready (as reference)"
```

---

## Phase 1: CSS Rule Extractor

**Goal:** Create a module that extracts CSS rules relevant to a specific HTML section from the clone's CSS files. This gives the AI focused context (2-5KB per section) rather than the full 53 files.
**Model:** sonnet

### Step 1.1: Read reference files

Read these in parallel:

- `output/clones/corvus/assets/css/post-13-defaults.css` (core Breakdance layout CSS — understand the naming convention)
- `output/clones/corvus/assets/css/global-settings.css` (shared variables)
- `output/clones/corvus/html/pages/home.html` (first 300 lines — understand the HTML class patterns)

### Step 1.2: Create `tools/lib/clone-css-rule-extractor.ts`

```typescript
/**
 * Clone CSS Rule Extractor
 *
 * Extracts CSS rules relevant to a specific HTML section from
 * the clone's CSS files. Used as read-only reference context for
 * AI-based Tailwind translation — the CSS is never loaded at runtime.
 */

/**
 * Parse all class names from an HTML fragment.
 */
export function extractClassNamesFromHtml(html: string): string[] {
  // Match class="..." and className="..." attributes
  const classRe = /(?:class|className)="([^"]*)"/gi;
  const classes = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = classRe.exec(html)) !== null) {
    for (const cls of m[1].split(/\s+/).filter(Boolean)) {
      classes.add(cls);
    }
  }
  return [...classes];
}

/**
 * Extract CSS rules from a CSS string that match any of the given class names.
 * Returns the matching rules as a string.
 */
export function extractRulesForClasses(css: string, classNames: string[]): string {
  // Split CSS into individual rules (handle minified CSS)
  // Split on } but keep the } with the rule
  const rules = css
    .split(/\}\s*/)
    .filter(Boolean)
    .map((r) => r.trim() + "}");

  const matching: string[] = [];
  for (const rule of rules) {
    // Check if any class name appears in the selector part (before {)
    const selectorPart = rule.split("{")[0] ?? "";
    for (const cls of classNames) {
      if (selectorPart.includes(`.${cls}`) || selectorPart.includes(cls)) {
        matching.push(rule);
        break;
      }
    }
  }
  return matching.join("\n\n");
}

/**
 * Extract CSS rules relevant to an HTML section from the clone's CSS directory.
 * Returns a focused CSS string suitable for AI context.
 */
export function extractRelevantCssForSection(sectionHtml: string, cssDir: string): string {
  // 1. Parse all class names from the section HTML
  const classNames = extractClassNamesFromHtml(sectionHtml);
  if (classNames.length === 0) return "";

  // 2. Identify which CSS files to read based on Breakdance naming convention
  // bde-{type}-{postId}-{nodeId} → read post-{postId}.css and post-{postId}-defaults.css
  const postIds = new Set<string>();
  for (const cls of classNames) {
    const m = cls.match(/^bde-\w+-(\d+)-\d+$/);
    if (m) postIds.add(m[1]);
  }

  // Build file list: per-post files + always include globals
  const filesToRead: string[] = [];
  for (const id of postIds) {
    filesToRead.push(`post-${id}.css`, `post-${id}-defaults.css`);
  }
  // Always include shared layout/preset files
  filesToRead.push(
    "global-settings.css",
    "presets.css",
    "common-full.css",
    "common-responsive.css"
  );

  // 3. Read each file and extract matching rules
  const allRules: string[] = [];
  for (const filename of filesToRead) {
    const filePath = path.join(cssDir, filename);
    if (!fs.existsSync(filePath)) continue;
    const css = fs.readFileSync(filePath, "utf-8");
    const rules = extractRulesForClasses(css, classNames);
    if (rules.trim()) {
      allRules.push(`/* --- ${filename} --- */\n${rules}`);
    }
  }

  // 4. Truncate if too large (keep under 8KB for AI context)
  let result = allRules.join("\n\n");
  if (result.length > 8000) {
    result = result.slice(0, 8000) + "\n/* ... truncated ... */";
  }

  return result;
}
```

Add the necessary imports (`fs`, `path`) at the top.

### Step 1.3: Verification gate

```bash
# Verification gate — STOP if this fails
npx tsx -e "
  import { extractClassNamesFromHtml, extractRelevantCssForSection } from './tools/lib/clone-css-rule-extractor.js';

  // Test class extraction
  const classes = extractClassNamesFromHtml('<section class=\"bde-section-17-100 bde-section\"><div class=\"bde-div-17-101\">test</div></section>');
  console.log('Classes:', classes);
  if (!classes.includes('bde-section-17-100')) { console.error('FAIL: missing class'); process.exit(1); }

  // Test CSS extraction from real clone data
  const css = extractRelevantCssForSection(
    '<section class=\"bde-section-17-100 bde-section\"><div class=\"section-container\">test</div></section>',
    'output/clones/corvus/assets/css'
  );
  console.log('CSS length:', css.length);
  if (css.length === 0) { console.error('FAIL: no CSS extracted'); process.exit(1); }
  console.log('Phase 1 PASSED');
"
pnpm type-check 2>&1 | tail -5
```

**Commit:**

```bash
git add tools/lib/clone-css-rule-extractor.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): add clone CSS rule extractor for AI reference context

New module that extracts CSS rules relevant to specific HTML sections
from clone CSS files. Uses Breakdance class naming convention to find
per-post CSS files. Output is used as read-only AI context for
generating native Tailwind — never loaded at runtime.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Clone Section Extractor

**Goal:** Create a module that extracts HTML section fragments from clone pages and correlates them with vision analysis blueprints. This gives the AI the actual DOM structure of each section.
**Model:** sonnet

### Step 2.1: Read reference files

Read these in parallel:

- `tools/lib/html-structure-analyzer.ts` (full — understand `extractTopLevelBlocks` and `RawBlock` interface)
- `tools/lib/reference-analysis-types.ts` (full — understand `SectionBlueprint`, `ReferenceAnalysis`)
- `output/clones/corvus/html/pages/home.html` (first 100 lines of `<body>` — find where sections start)

### Step 2.2: Export `extractTopLevelBlocks` from html-structure-analyzer

The `extractTopLevelBlocks()` function is currently private. We need to either:

- Export it (preferred — minimal change), OR
- Recreate the section extraction in the new module

Read the function signature and decide. If it's straightforward to export, just add `export` to the function declaration. Also export the `RawBlock` interface.

### Step 2.3: Add optional fields to SectionBlueprint

In `tools/lib/reference-analysis-types.ts`, add to the `SectionBlueprint` interface:

```typescript
  // Clone context — populated during translate pass enrichment
  cloneHtmlFragment?: string;
  cloneRelevantCss?: string;
  sectionIndex?: number;
```

These are optional, so existing code that creates `SectionBlueprint` objects is unaffected.

### Step 2.4: Create `tools/lib/clone-section-extractor.ts`

```typescript
/**
 * Clone Section Extractor
 *
 * Extracts top-level HTML sections from clone pages and correlates
 * them with vision analysis blueprints. Each blueprint gets enriched
 * with its corresponding HTML fragment and relevant CSS rules.
 */

import * as fs from "fs";
import * as path from "path";
import type { SectionBlueprint, DiscoveredPage } from "./reference-analysis-types";
import { extractTopLevelBlocks } from "./html-structure-analyzer"; // needs to be exported
import { extractRelevantCssForSection } from "./clone-css-rule-extractor";

export interface CloneSection {
  index: number;
  tag: string;
  headingText?: string;
  html: string; // the full HTML of this section
  cssClasses: string[];
}

/**
 * Extract top-level HTML sections from a clone HTML page.
 */
export function extractCloneSections(htmlPath: string): CloneSection[] {
  const html = fs.readFileSync(htmlPath, "utf-8");

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;

  // Use the html-structure-analyzer's block extraction
  // We need a DiscoveredPage for the analyzer — create a minimal one
  const page: DiscoveredPage = { url: htmlPath, type: "home", slug: "home" };

  // Actually, use extractTopLevelBlocks directly for raw HTML fragments
  const blocks = extractTopLevelBlocks(bodyHtml);

  return blocks.map((block, index) => {
    // Extract heading text
    const headingMatch = block.innerHtml.match(/<h[1-3][^>]*>([^<]+)</i);
    const headingText = headingMatch ? headingMatch[1].trim().slice(0, 80) : undefined;

    // Extract CSS classes from the opening tag
    const classMatch = block.openingTag.match(/class="([^"]*)"/);
    const cssClasses = classMatch ? classMatch[1].split(/\s+/).filter(Boolean) : [];

    return {
      index,
      tag: block.tag,
      headingText,
      html: block.fullMatch,
      cssClasses,
    };
  });
}

/**
 * Correlate vision analysis blueprints with clone HTML sections.
 * Enriches each blueprint with cloneHtmlFragment and cloneRelevantCss.
 *
 * Matching strategy:
 * 1. Match by heading text (fuzzy — case-insensitive substring)
 * 2. Fall back to index order (vision sections are top-to-bottom)
 */
export function correlateWithBlueprints(
  sections: CloneSection[],
  blueprints: SectionBlueprint[],
  cssDir: string
): SectionBlueprint[] {
  const usedSectionIndices = new Set<number>();

  return blueprints.map((blueprint, bpIndex) => {
    // Try heading-text match first
    let matched: CloneSection | undefined;

    if (blueprint.name) {
      const bpName = blueprint.name.toLowerCase();
      matched = sections.find((s, i) => {
        if (usedSectionIndices.has(i)) return false;
        if (!s.headingText) return false;
        return (
          s.headingText.toLowerCase().includes(bpName) ||
          bpName.includes(s.headingText.toLowerCase())
        );
      });
    }

    // Fall back to index order
    if (!matched) {
      // Skip header/nav sections (index 0 is often a <header>)
      const contentSections = sections.filter((s) => s.tag === "section");
      if (bpIndex < contentSections.length) {
        const candidate = contentSections[bpIndex];
        if (candidate && !usedSectionIndices.has(candidate.index)) {
          matched = candidate;
        }
      }
    }

    if (matched) {
      usedSectionIndices.add(matched.index);

      // Extract relevant CSS for this section
      const relevantCss = extractRelevantCssForSection(matched.html, cssDir);

      return {
        ...blueprint,
        cloneHtmlFragment: matched.html,
        cloneRelevantCss: relevantCss,
        sectionIndex: matched.index,
      };
    }

    return { ...blueprint, sectionIndex: bpIndex };
  });
}

/**
 * Orchestrator: read clone HTML, extract sections, correlate with blueprints.
 */
export function enrichBlueprintsForPage(
  pageName: string,
  cloneDir: string,
  blueprints: SectionBlueprint[]
): SectionBlueprint[] {
  const htmlDir = path.join(cloneDir, "html", "pages");
  const cssDir = path.join(cloneDir, "assets", "css");

  // Find the HTML file for this page
  const htmlFile = path.join(htmlDir, `${pageName}.html`);
  if (!fs.existsSync(htmlFile)) {
    console.log(`[extract] No HTML file for page "${pageName}" — skipping enrichment`);
    return blueprints;
  }

  const sections = extractCloneSections(htmlFile);
  console.log(`[extract] Extracted ${sections.length} sections from ${pageName}.html`);

  return correlateWithBlueprints(sections, blueprints, cssDir);
}
```

### Step 2.5: Verification gate

```bash
# Verification gate — STOP if this fails
npx tsx -e "
  import { extractCloneSections, enrichBlueprintsForPage } from './tools/lib/clone-section-extractor.js';

  const sections = extractCloneSections('output/clones/corvus/html/pages/home.html');
  console.log('Sections extracted:', sections.length);
  console.log('Section tags:', sections.map(s => s.tag));
  console.log('Headings:', sections.filter(s => s.headingText).map(s => s.headingText));

  if (sections.length < 3) { console.error('FAIL: too few sections'); process.exit(1); }
  console.log('Phase 2 PASSED');
"
pnpm type-check 2>&1 | tail -5
```

**Commit:**

```bash
git add tools/lib/clone-section-extractor.ts tools/lib/html-structure-analyzer.ts tools/lib/reference-analysis-types.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): add clone section extractor for blueprint enrichment

New module that extracts HTML section fragments from clone pages
and correlates them with vision analysis blueprints. Each blueprint
gets enriched with its actual HTML structure and filtered CSS rules.

Also exports extractTopLevelBlocks from html-structure-analyzer
and adds optional clone context fields to SectionBlueprint type.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Clone Translation Prompt

**Goal:** Create the AI prompt that converts clone HTML + CSS reference into native Tailwind JSX. This is the core of the translate pipeline.
**Model:** opus — the prompt engineering here is the highest-judgment task; it must produce high-quality Tailwind output consistently

### Step 3.1: Read reference files

Read these in parallel:

- `tools/lib/theme-component-templates.ts` (full — understand `buildComponentGenerationPrompt()` structure)
- `tools/lib/reference-analysis-prompts.ts` (full — understand existing vision analysis prompts)
- `packages/themes/orion/pages/home.tsx` (full — gold standard for output format)
- `packages/themes/orion/globals.css` (first 100 lines — understand component class patterns)

### Step 3.2: Add `buildCloneTranslationPrompt()` to theme-component-templates.ts

Add a new function alongside the existing `buildComponentGenerationPrompt()`:

```typescript
/**
 * Build a prompt for translating a clone HTML section to native Tailwind JSX.
 * This prompt gives the AI both the HTML structure and CSS rules as reference,
 * plus token mappings and the gold-standard output format.
 */
export function buildCloneTranslationPrompt(
  blueprint: SectionBlueprint,
  interfaceName: string,
  tokenMappings?: string
): string {
  const slotsDescription = (blueprint.contentSlots ?? []).map((slot) => `- ${slot}`).join("\n");

  const htmlContext = blueprint.cloneHtmlFragment
    ? `\n## REFERENCE HTML (structure and layout reference — do NOT copy class names)\n\n\`\`\`html\n${truncate(blueprint.cloneHtmlFragment, 6000)}\n\`\`\``
    : "";

  const cssContext = blueprint.cloneRelevantCss
    ? `\n## REFERENCE CSS (spacing, layout, sizing reference — do NOT copy rules)\n\nRead these rules to understand spacing (padding, margin, gap), layout (flex, grid, max-width), font sizes, and responsive breakpoints. Then recreate the same visual result using Tailwind utility classes.\n\n\`\`\`css\n${truncate(blueprint.cloneRelevantCss, 4000)}\n\`\`\``
    : "";

  const tokenSection = tokenMappings
    ? `\n## TOKEN MAPPINGS\n\nUse these theme tokens instead of hardcoded colours:\n\n${tokenMappings}`
    : "";

  return `You are converting a cloned website section into a React Server Component using native Tailwind CSS for a Next.js platform.

## TASK

Reproduce the visual layout and design of the reference section below using ONLY Tailwind CSS utility classes and the platform's theme token classes. The result must look like the reference but be built entirely with Tailwind — no copied CSS class names.

## COMPONENT SPEC

- Component name: ${blueprint.componentExportName ?? blueprint.name}
- Props interface: ${interfaceName}
- Category: ${blueprint.category}
- Layout pattern: ${blueprint.layoutPattern ?? "standard"}
- Purpose: ${blueprint.purpose ?? "content section"}

Content slots (these become component props):
${slotsDescription || "- (derive from the HTML structure)"}
${htmlContext}
${cssContext}
${tokenSection}

## TRANSLATION RULES

1. **Layout**: Reproduce the layout using Tailwind utilities (flex, grid, max-w-*, gap-*, etc.). Read the CSS for exact spacing values and convert: 16px→py-4, 24px→py-6, 32px→py-8, 48px→py-12, 64px→py-16, 96px→py-24.
2. **Colours**: NEVER hardcode hex values. Use theme tokens: bg-brand-primary, bg-brand-secondary, bg-surface-inverse, bg-surface-muted, bg-surface-card, text-surface-foreground, text-brand-primary, text-on-brand-primary, text-on-inverse-muted, border-surface-border.
3. **Typography**: Use Tailwind text sizing (text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl, text-5xl). Use font-bold, font-semibold, font-medium, tracking-tight, leading-tight, leading-relaxed.
4. **Responsive**: Mobile-first with md: and lg: breakpoints. Read the CSS @media queries for responsive behaviour.
5. **Semantic HTML**: Use section, div, h1-h6, p, a, img, ul, li. Keep heading hierarchy logical.
6. **Props**: Access props via dot notation (props.heading, props.items). For arrays, use .map() with proper keys.
7. **Images**: Use standard <img> tags with props for src/alt. Decorative images can use hardcoded /images/ paths.
8. **No imports**: Do NOT import React, next/link, lucide-react, or any external modules. The shell wrapper handles imports.
9. **Component classes**: You may use these component utility classes (defined in globals.css): btn-primary, btn-secondary, card, card-interactive, section, container-standard, container-narrow.

## OUTPUT FORMAT

Return ONLY the JSX body — the content of the return statement. Start with a \`<section\` or \`<div\` element. Do NOT include the function signature, imports, or interface.

Example output format:
\`\`\`
<section className="py-16 bg-surface-inverse">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-on-brand-primary">{props.heading}</h2>
    ...
  </div>
</section>
\`\`\``;
}

function truncate(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen) + "\n/* ... truncated ... */";
}
```

### Step 3.3: Verification gate

```bash
# Verification gate — STOP if this fails
npx tsx -e "
  import { buildCloneTranslationPrompt } from './tools/lib/theme-component-templates.js';
  const prompt = buildCloneTranslationPrompt(
    { id: 'hero', name: 'Hero', category: 'hero', componentExportName: 'HeroSection',
      cloneHtmlFragment: '<section class=\"test\">hello</section>',
      cloneRelevantCss: '.test { padding: 16px; }',
      contentSlots: ['heading', 'subheading', 'ctaText'] },
    'HeroSectionProps',
    'bg-brand-primary → #292661'
  );
  console.log('Prompt length:', prompt.length);
  if (prompt.length < 500) { console.error('FAIL: prompt too short'); process.exit(1); }
  if (!prompt.includes('REFERENCE HTML')) { console.error('FAIL: missing HTML section'); process.exit(1); }
  if (!prompt.includes('REFERENCE CSS')) { console.error('FAIL: missing CSS section'); process.exit(1); }
  console.log('Phase 3 PASSED');
"
pnpm type-check 2>&1 | tail -5
```

**Commit:**

```bash
git add tools/lib/theme-component-templates.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): add clone-to-Tailwind translation prompt

New buildCloneTranslationPrompt() function that gives Claude the
clone's HTML structure + CSS rules as reference alongside token
mappings and translation rules. Output is native Tailwind JSX.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Enhanced Component Generator

**Goal:** Extend the existing component generator to accept clone context and use the translation prompt when available. On failure, fall back to blueprint-only generation.
**Model:** sonnet

### Step 4.1: Read the file

Read `tools/lib/theme-component-generator.ts` in full.

### Step 4.2: Add clone context support

Add a new public function `generateThemeComponentsFromClone()` that mirrors the existing `generateThemeComponents()` but passes clone context through.

The existing `generateThemeComponents()` internally calls a private `generateSingleComponent()` which calls `generateJSXBody()`. The modification:

1. In the private `generateJSXBody()` function (or wherever the Claude API call is made), check if the blueprint has `cloneHtmlFragment`. If so, use `buildCloneTranslationPrompt()` instead of `buildComponentGenerationPrompt()`.

2. Increase `max_tokens` from 2048 to 4096 when using the clone translation prompt (the output is typically larger).

3. If the clone-enriched call fails, fall back to `buildComponentGenerationPrompt()` (blueprint-only).

4. Export the new function:

```typescript
export async function generateThemeComponentsFromClone(
  blueprints: SectionBlueprint[],
  outputDir: string,
  tokenMappings?: string,
  componentMatches?: Map<string, ComponentMatch | null>
): Promise<GenerationResult>;
```

The `tokenMappings` parameter is a formatted string of color token mappings (e.g., `"#292661 → bg-brand-primary"`) passed to the translation prompt.

### Step 4.3: Verification gate

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -10
echo "Phase 4 PASSED"
```

Note: We can't fully test this without running the Claude API, which happens in Phase 6.

**Commit:**

```bash
git add tools/lib/theme-component-generator.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): add clone context support to component generator

generateThemeComponentsFromClone() uses the translation prompt when
a blueprint has cloneHtmlFragment, falling back to blueprint-only
generation on failure. max_tokens increased to 4096 for translation.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Wire translate pass into extract-theme.ts

**Goal:** Replace the translate placeholder with the full pipeline: vision analysis → section extraction → blueprint enrichment → AI component generation → theme package assembly.
**Model:** opus — this is the main orchestrator wiring, touches multiple modules and requires judgment about flow

### Step 5.1: Read current files

Read these in parallel:

- `tools/extract-theme.ts` (full — the current 369-line version with placeholder)
- `tools/generate-theme-from-reference.ts` (lines 92-166 — the `analyseWithVision()` function to understand the pattern)
- `tools/scaffold-theme-package.ts` (first 50 lines — understand the interface)
- `tools/lib/computed-style-token-mapper.ts` (exports — understand `mapStylesToTokens`, `mapSectionColors`)

### Step 5.2: Implement the translate pass

Replace the placeholder `if (passArg === "translate" || passArg === "both")` block with the full implementation:

**Step A: Validate CPF**

```typescript
import { validateCPF } from "./lib/cpf-validator";

const validation = validateCPF(cloneDir);
if (!validation.valid) {
  console.error("CPF validation failed:");
  for (const err of validation.errors) console.error(`  - ${err}`);
  process.exit(1);
}
```

**Step B: Read computed styles and map to tokens**

```typescript
import {
  mapStylesToTokens,
  mapSectionColors,
  extractTypographyScale,
} from "./lib/computed-style-token-mapper";
import type { SectionComputedStyle } from "./lib/computed-style-extractor";

const stylesPath = path.join(cloneDir, "styles", "computed-styles.json");
const stylesJson = JSON.parse(fs.readFileSync(stylesPath, "utf-8"));
// ... extract section colors, brand colors, typography scale
// Format token mappings as a string for the AI prompt
```

**Step C: Run vision analysis on homepage screenshot**

Replicate the `analyseWithVision()` pattern from `generate-theme-from-reference.ts`:

- Read the screenshot as base64
- Call Claude claude-sonnet-4-6 with `REFERENCE_ANALYSIS_PROMPT`
- Parse the `ReferenceAnalysis` JSON response
- Extract `sectionBlueprints[]`

If `ANTHROPIC_API_KEY` is not set, create a minimal analysis with placeholder blueprints (matching the pattern in `createMinimalAnalysis()`).

Import `REFERENCE_ANALYSIS_PROMPT` from `tools/lib/reference-analysis-prompts.ts` (it may need to be exported — check and export if needed).

**Step D: Enrich blueprints with clone context**

```typescript
import { enrichBlueprintsForPage } from "./lib/clone-section-extractor";

const enrichedBlueprints = enrichBlueprintsForPage("home", cloneDir, sectionBlueprints);
```

**Step E: Generate components**

```typescript
import { generateThemeComponentsFromClone } from "./lib/theme-component-generator";

const result = await generateThemeComponentsFromClone(
  enrichedBlueprints,
  path.join(themeDir, "components"),
  tokenMappingsString
);
```

**Step F: Assemble theme package**

Write the theme package files:

- `index.ts` — using existing `generateIndexTs()`
- `package.json` — using existing `generatePackageJson()`
- `globals.css` — use the orion pattern (import animations + basic component classes). For now, generate a reasonable globals.css based on the token mappings. A full AI-generated globals.css can be a follow-up.
- `components/index.ts` — barrel
- `pages/` — For v1, create a single `HomePage.tsx` that imports and composes the generated section components. Use the orion HomePage as a structural reference. For other pages, generate stubs.

**Step G: Copy images**

Copy images from `output/clones/{name}/assets/images/` to the test site's `public/images/` directory (standard path, not `public/clone-assets/`).

**Step H: Deploy to test site (if exists)**

Same pattern as before but simpler:

- Standard `globals.css` with `@tailwind base/components/utilities`
- No `<link>` tag
- No Preflight disable
- Images to `public/images/`

### Step 5.3: Verification gate

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -10

# Verify extract-theme accepts --pass translate without errors (it will call the API)
npx tsx tools/extract-theme.ts --clone corvus --pass translate 2>&1 | tail -20

# Check theme was generated
test -d packages/themes/corvus/components && echo "Components dir exists — OK"
test -f packages/themes/corvus/globals.css && echo "globals.css exists — OK"
test -f packages/themes/corvus/index.ts && echo "index.ts exists — OK"

# Check no @ts-nocheck in generated components
grep -r "@ts-nocheck" packages/themes/corvus/components/ && echo "WARN: @ts-nocheck found" || echo "No @ts-nocheck — OK"

# Check no hardcoded hex in components
grep -r '#[0-9a-fA-F]\{6\}' packages/themes/corvus/components/*.tsx && echo "WARN: hardcoded hex found" || echo "No hardcoded hex — OK"

echo "Phase 5 PASSED"
```

**Commit:**

```bash
git add tools/extract-theme.ts tools/lib/reference-analysis-prompts.ts packages/themes/corvus/
git commit -m "$(cat <<'EOF'
feat(pipeline): implement --pass translate in extract-theme

Full translate pipeline: vision analysis on screenshots → section
extraction from clone HTML → blueprint enrichment with CSS context →
AI-generated native Tailwind components → theme package assembly.

Clone CSS is read-only reference material — never loaded at runtime.
Standard Tailwind wiring (with @tailwind base, Preflight enabled).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: End-to-end verification

**Goal:** Full pipeline test — clean slate to rendering site.
**Model:** sonnet

### Step 6.1: Clean and regenerate

```bash
rm -rf packages/themes/corvus/
npx tsx tools/extract-theme.ts --clone corvus --pass translate 2>&1 | tail -30
```

### Step 6.2: Verify output

```bash
echo "=== Theme package ==="
ls packages/themes/corvus/
ls packages/themes/corvus/components/ 2>/dev/null || echo "no components dir"
echo "---"
echo "globals.css lines: $(wc -l < packages/themes/corvus/globals.css)"
echo "Has @apply: $(grep -c '@apply' packages/themes/corvus/globals.css)"
echo "Has animations import: $(grep -c 'animations.css' packages/themes/corvus/globals.css)"
```

### Step 6.3: Type check

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -10
```

### Step 6.4: Dev server smoke test

```bash
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
cd sites/_corvus-digital-marketing-events && npx next dev &
DEV_PID=$!
sleep 25

# Check page renders
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
echo "HTTP status: $HTTP_STATUS"

# Check no clone-assets references
CLONE_ASSETS=$(curl -s http://localhost:3000 2>/dev/null | grep -c "clone-assets" || echo "0")
echo "clone-assets references: $CLONE_ASSETS"

kill $DEV_PID 2>/dev/null
cd /Users/rickywilson/Sites/local-business-platform

echo "Phase 6 PASSED"
```

**Commit:**

```bash
git add packages/themes/corvus/ sites/_corvus-digital-marketing-events/
git commit -m "$(cat <<'EOF'
chore(corvus): regenerate theme via --pass translate

First theme generated entirely by AI translation from clone
HTML/CSS/screenshots. Native Tailwind components — no clone CSS
loaded at runtime.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: Final verification

**Goal:** Full commit log and status check.
**Model:** haiku

```bash
# Verification gate — STOP if this fails
pnpm type-check 2>&1 | tail -5
echo "==="
echo "Commits on this branch:"
git log --oneline develop..HEAD
echo "==="
echo "New files created:"
git diff --name-only --diff-filter=A develop..HEAD
echo "==="
echo "Phase 7 PASSED"
```

No commit needed.

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                                      | File overlap      | Model  | Rationale                         |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ | --------------------------------- |
| G1    | Phase 1 | Read `post-13-defaults.css`, `global-settings.css`, `home.html`                                                            | none (reads only) | n/a    | Independent reads before creating |
| G2    | Phase 2 | Read `html-structure-analyzer.ts`, `reference-analysis-types.ts`, `home.html`                                              | none (reads only) | n/a    | Independent reads before creating |
| G3    | Phase 3 | Read `theme-component-templates.ts`, `reference-analysis-prompts.ts`, `orion/pages/home.tsx`, `orion/globals.css`          | none (reads only) | n/a    | Independent reads before editing  |
| G4    | Phase 5 | Read `extract-theme.ts`, `generate-theme-from-reference.ts`, `scaffold-theme-package.ts`, `computed-style-token-mapper.ts` | none (reads only) | n/a    | Independent reads before editing  |
| —     | Phase 4 | — no parallel work in this phase —                                                                                         |                   | sonnet | Single file modification          |
| —     | Phase 6 | — no parallel work in this phase —                                                                                         |                   | sonnet | Sequential: regenerate → verify   |
| —     | Phase 7 | — no parallel work in this phase —                                                                                         |                   | haiku  | Single verification               |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                                           |
| --------------------------------- | ---------------------------------------------------------------- |
| Verification gates between phases | Each phase's output gates the next                               |
| Git commits                       | One per phase, in order                                          |
| Phase 2 depends on Phase 1        | Section extractor imports from CSS rule extractor                |
| Phase 3 depends on Phase 2        | Translation prompt uses SectionBlueprint fields added in Phase 2 |
| Phase 4 depends on Phase 3        | Component generator calls translation prompt from Phase 3        |
| Phase 5 depends on Phase 4        | extract-theme.ts calls component generator modified in Phase 4   |
| Phase 6 depends on Phase 5        | End-to-end test requires the full pipeline wired                 |

---

## Cost Estimate

Note: This brief has two cost dimensions — the YOLO session cost (Claude Code) and the pipeline API cost (Claude API calls made by the tools during Phase 5-6).

### YOLO session cost (Claude Code)

| Phase                        | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: CSS rule extractor  | sonnet | ~12k              | ~3k                | $0.08      |
| Phase 2: Section extractor   | sonnet | ~15k              | ~4k                | $0.11      |
| Phase 3: Translation prompt  | opus   | ~20k              | ~5k                | $0.68      |
| Phase 4: Enhanced generator  | sonnet | ~15k              | ~3k                | $0.09      |
| Phase 5: Wire translate pass | opus   | ~25k              | ~8k                | $0.98      |
| Phase 6: E2E verification    | sonnet | ~10k              | ~2k                | $0.06      |
| Phase 7: Final verification  | haiku  | ~5k               | ~0.5k              | $0.002     |
| **Total (YOLO)**             |        | **~102k**         | **~25.5k**         | **~$2.00** |

### Pipeline API cost (Claude API calls during translate pass execution)

| Call                               | Model             | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------------- | ----------------- | ----------------- | ------------------ | ---------- |
| Vision analysis (1 screenshot)     | claude-sonnet-4-6 | ~5k               | ~4k                | $0.08      |
| Component generation (~8 sections) | claude-sonnet-4-6 | ~40k              | ~16k               | $0.36      |
| **Total (API)**                    |                   | **~45k**          | **~20k**           | **~$0.44** |

**Combined estimated cost: ~$2.44**

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. How many sections were detected by vision analysis
4. How many sections got clone HTML enrichment
5. How many components were successfully generated (vs placeholders)
6. Dev server smoke test result
7. Any exceptions or intentional deviations from the plan
8. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-13_translate-pipeline/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises, AI generation quality]

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
- **DO NOT touch** clone-site.ts, scaffold-client-site.ts, visual-qa-loop.ts, or cpf-validator.ts
- **DO NOT modify live site themes** (orion, vega, cygnus, solaris, lyra, nova, sirius, atlas, castor, polaris) — only corvus
- The generated Tailwind components must NOT contain any Breakdance class names (bde-\*, breakdance, etc.)
- The generated components must NOT contain hardcoded hex colour values — use theme tokens only
- If a component generation API call fails, fall back to a placeholder component — do NOT stop the pipeline
- If `ANTHROPIC_API_KEY` is not set, log a clear error and exit — do not generate an empty theme
