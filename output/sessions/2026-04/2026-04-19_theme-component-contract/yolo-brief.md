# YOLO Implementation Brief: Theme Component Contract

**Branch:** `feature/theme-component-contract` (created from `develop`)
**Session spec:** `output/sessions/2026-04/2026-04-19_theme-component-contract/yolo-brief.md`
**Source plan:** `~/.claude/plans/abundant-questing-axolotl.md` (approved by user — read in full before starting)
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

`develop` now contains composable section components (`packages/core-components/src/components/composable/*.tsx`) that reference Orion-specific CSS classes: `.btn-tertiary`, `.btn-on-brand-primary`, `.btn-on-brand-primary-outline`, `.section-dark-accent`, `.noise-overlay`, `.location-pill`, `.location-pill-arrow`, `.stat-value`. These classes are defined only in `packages/themes/orion/globals.css` — Vega, Cygnus, Solaris, Designlab, Navagarden do not define them. Any composition site on a non-Orion theme renders broken CTAs, missing textures, unstyled phone buttons.

This brief establishes a **Theme Component Contract**: a canonical list of CSS utility classes every theme MUST define, paired with a CI-enforced validator. All six themes get backfilled with theme-appropriate implementations of the contract. The composition architecture becomes "pure by default" — no Orion escape hatches, no silent drift.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Design Principles (apply to every phase)

1. **Contract constrains class NAMES, not implementation.** Each theme implements contract classes with its own visual identity (Orion red-on-black, Vega navy-on-white, Cygnus sharp-squared, Solaris pastel-pill, etc.). Classes must look distinct per theme while satisfying the same name contract.
2. **Token-only CSS inside each implementation.** Use `@apply bg-brand-primary`, `@apply text-on-brand-primary`, `var(--color-...)`. No hardcoded hex anywhere.
3. **No changes to composable sections.** The contract is additive — composable class references become valid once every theme satisfies the contract. Do not edit `packages/core-components/src/components/composable/*.tsx`.
4. **No prop/schema changes.** Contract work is purely CSS + a small TS contract file + a validator tool.
5. **RSC-only rule still applies to the codebase.** No new client components introduced by this brief.
6. **Preserve every existing class** in every theme's globals.css. The contract is additive — never delete existing utilities, even if they look duplicative.
7. **Read the source plan before starting:** `~/.claude/plans/abundant-questing-axolotl.md`. It has the rationale and decisions behind the contract shape.
8. **The six themes are:** orion, vega, cygnus, solaris, designlab, navagarden. All have `packages/themes/<name>/globals.css`.
9. **Orion is the reference implementation** — it already defines every contract class. Use its implementations as visual targets when other themes need a "safe default."

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/theme-component-contract
pnpm type-check   # must be clean before starting
```

If `develop` is not up to date with origin, pull first. If `type-check` fails on develop, STOP and report — do not start the work.

---

## Phase 1 — Contract source + validator scaffolding

**Goal:** Create the canonical contract file, re-export it, and build the validator in `--warn-only` mode so Orion passes and the other five themes show expected failures without blocking the build.
**Model:** sonnet — small number of files, needs accurate spec.

### Files to create

**1. `packages/theme-system/src/component-contract.ts`:**

```ts
/**
 * Theme Component Contract
 *
 * Every theme's globals.css MUST define these CSS classes.
 * Composable section components in @platform/core-components rely on
 * them and will render broken on any theme that does not implement them.
 *
 * Classes are identified by NAME only — each theme implements them with
 * its own visual identity (colours, radii, shadows). Contract compliance
 * is validated in CI by tools/validate-theme-globals.ts.
 */

export type ContractGroup = "button" | "section" | "overlay" | "utility";

export interface ContractClass {
  name: string;
  group: ContractGroup;
  purpose: string;
  consumers: readonly string[];
}

export const THEME_COMPONENT_CONTRACT: readonly ContractClass[] = [
  // Buttons
  {
    name: "btn-primary",
    group: "button",
    purpose: "Primary action button on any section background.",
    consumers: ["hero-section.tsx", "cta-section.tsx"],
  },
  {
    name: "btn-secondary",
    group: "button",
    purpose: "Secondary action button on any section background.",
    consumers: [
      "hero-section.tsx",
      "cta-section.tsx",
      "service-list-section.tsx",
      "location-pills-section.tsx",
    ],
  },
  {
    name: "btn-tertiary",
    group: "button",
    purpose: "Action button on a dark section-dark-accent section.",
    consumers: ["cta-section.tsx"],
  },
  {
    name: "btn-on-brand-primary",
    group: "button",
    purpose: "Primary action button when the surrounding section background is bg-brand-primary.",
    consumers: ["cta-section.tsx"],
  },
  {
    name: "btn-on-brand-primary-outline",
    group: "button",
    purpose:
      "Outline/secondary action button when the surrounding section background is bg-brand-primary.",
    consumers: ["cta-section.tsx"],
  },
  // Sections
  {
    name: "section-dark-accent",
    group: "section",
    purpose:
      "Theme's signature dark CTA/callout section background with auto-styled h2/h3/p descendants.",
    consumers: ["cta-section.tsx"],
  },
  // Overlays
  {
    name: "noise-overlay",
    group: "overlay",
    purpose: "Subtle grain/texture overlay for depth on flat sections.",
    consumers: [
      "cta-section.tsx",
      "hero-section.tsx",
      "feature-grid.tsx",
      "stats-strip.tsx",
      "why-choose-us-section.tsx",
    ],
  },
  // Component utilities
  {
    name: "stat-value",
    group: "utility",
    purpose: "Stat number typography with tabular-nums.",
    consumers: ["stats-strip.tsx", "why-choose-us-section.tsx"],
  },
  {
    name: "location-pill",
    group: "utility",
    purpose: "Interactive pill-style link used in location lists.",
    consumers: ["location-pills-section.tsx"],
  },
  {
    name: "location-pill-arrow",
    group: "utility",
    purpose: "Arrow icon inside a location-pill; animates on hover.",
    consumers: ["location-pills-section.tsx"],
  },
] as const;

export const CONTRACT_CLASS_NAMES: readonly string[] = THEME_COMPONENT_CONTRACT.map((c) => c.name);
```

**2. Re-export from `packages/theme-system/src/index.ts`** — append (do not overwrite):

```ts
// Theme component contract — classes every theme's globals.css must define
export type { ContractClass, ContractGroup } from "./component-contract";
export { THEME_COMPONENT_CONTRACT, CONTRACT_CLASS_NAMES } from "./component-contract";
```

**3. `tools/validate-theme-globals.ts`:**

```ts
#!/usr/bin/env tsx
/**
 * Theme Component Contract Validator
 *
 * Reads every packages/themes/<name>/globals.css and verifies it defines
 * every class in THEME_COMPONENT_CONTRACT. Exit 0 on success, 1 on missing.
 *
 * Usage:
 *   tsx tools/validate-theme-globals.ts               # validate all themes
 *   tsx tools/validate-theme-globals.ts --theme orion # validate single theme
 *   tsx tools/validate-theme-globals.ts --json        # machine-readable output
 *   tsx tools/validate-theme-globals.ts --warn-only   # exit 0 even on failure
 */

import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CONTRACT_CLASS_NAMES,
  THEME_COMPONENT_CONTRACT,
} from "../packages/theme-system/src/component-contract";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = join(__dirname, "..", "packages", "themes");

interface Args {
  theme?: string;
  json: boolean;
  warnOnly: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { json: false, warnOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--theme") args.theme = argv[++i];
    else if (a === "--json") args.json = true;
    else if (a === "--warn-only") args.warnOnly = true;
  }
  return args;
}

/**
 * Strip CSS comments and the contents of url("...") / url('...') expressions
 * so data URIs containing literal strings like `.filter` don't false-positive.
 */
function stripNoise(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/url\(\s*(["'])[\s\S]*?\1\s*\)/g, "url()")
    .replace(/url\(\s*[^)"']*?\s*\)/g, "url()");
}

/**
 * Extract every class name that is defined (appears as a selector, with or
 * without pseudo-classes/elements, combinators, or attached modifiers).
 */
function extractDefinedClasses(css: string): Set<string> {
  const cleaned = stripNoise(css);
  const classNameRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g;
  const defined = new Set<string>();

  // Only extract classes from selector positions — lines that look like they
  // end in `{` (the start of a rule). This rejects references inside `@apply`.
  const lines = cleaned.split("\n");
  let buffer = "";
  for (const line of lines) {
    buffer += " " + line;
    const braceIdx = buffer.indexOf("{");
    if (braceIdx >= 0) {
      const selectorPart = buffer.slice(0, braceIdx);
      // Exclude @apply usage — @apply occurs inside a rule body, never in a selector,
      // but be defensive: ignore @-rules that aren't block selectors.
      if (!/^\s*@/.test(selectorPart.trim())) {
        let m: RegExpExecArray | null;
        while ((m = classNameRegex.exec(selectorPart)) !== null) {
          defined.add(m[1]);
        }
      }
      buffer = buffer.slice(braceIdx + 1);
      classNameRegex.lastIndex = 0;
    }
  }
  return defined;
}

interface ThemeResult {
  theme: string;
  globalsCssPath: string;
  missing: string[];
  definedCount: number;
}

async function validateTheme(theme: string): Promise<ThemeResult> {
  const globalsPath = join(THEMES_DIR, theme, "globals.css");
  const css = await readFile(globalsPath, "utf-8");
  const defined = extractDefinedClasses(css);
  const missing = CONTRACT_CLASS_NAMES.filter((name) => !defined.has(name));
  return { theme, globalsCssPath: globalsPath, missing, definedCount: defined.size };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const themes = args.theme
    ? [args.theme]
    : (await readdir(THEMES_DIR, { withFileTypes: true }))
        .filter((d) => d.isDirectory() && d.name !== "node_modules")
        .map((d) => d.name);

  const results: ThemeResult[] = [];
  for (const t of themes) {
    try {
      results.push(await validateTheme(t));
    } catch (err) {
      console.error(
        `Failed to read globals.css for theme "${t}":`,
        err instanceof Error ? err.message : err
      );
      if (!args.warnOnly) process.exit(1);
    }
  }

  const failingThemes = results.filter((r) => r.missing.length > 0);

  if (args.json) {
    console.log(JSON.stringify({ results, failingCount: failingThemes.length }, null, 2));
  } else {
    for (const r of results) {
      if (r.missing.length === 0) {
        console.log(
          `✓ ${r.theme.padEnd(12)} — all ${CONTRACT_CLASS_NAMES.length} contract classes defined`
        );
      } else {
        console.log(
          `✗ ${r.theme.padEnd(12)} — missing ${r.missing.length}/${CONTRACT_CLASS_NAMES.length}:`
        );
        for (const name of r.missing) {
          const entry = THEME_COMPONENT_CONTRACT.find((c) => c.name === name)!;
          console.log(`    .${name}  (${entry.group}) — ${entry.purpose}`);
          console.log(`       consumers: ${entry.consumers.join(", ")}`);
        }
      }
    }
  }

  if (failingThemes.length > 0 && !args.warnOnly) {
    console.error(`\n${failingThemes.length} theme(s) failed contract validation.`);
    console.error(`Run with --warn-only to inspect without failing CI.`);
    process.exit(1);
  }
  if (failingThemes.length > 0 && args.warnOnly) {
    console.warn(
      `\n${failingThemes.length} theme(s) missing contract classes (warn-only mode — not failing).`
    );
  }
}

main().catch((err) => {
  console.error("validate-theme-globals crashed:", err);
  process.exit(1);
});
```

**4. Root `package.json`** — read current, add a new script under `"scripts"` WITHOUT reformatting anything else:

```json
"validate:theme-contract": "tsx tools/validate-theme-globals.ts"
```

### Verification

Run in warn-only mode and capture output for the commit message:

```bash
pnpm validate:theme-contract --warn-only
# Expected: orion passes; vega/cygnus/solaris/designlab/navagarden fail with specific missing classes listed.
```

### Verification gate — STOP if this fails

```bash
pnpm type-check
# The validator import path must resolve. Confirm tools/validate-theme-globals.ts
# can read THEME_COMPONENT_CONTRACT from packages/theme-system/src/component-contract.ts
# (use tsx, not requires-build).
pnpm tsx tools/validate-theme-globals.ts --warn-only
```

### Commit

```bash
git add packages/theme-system/src/component-contract.ts \
        packages/theme-system/src/index.ts \
        tools/validate-theme-globals.ts \
        package.json
git commit -m "$(cat <<'EOF'
feat(theme-system): introduce Theme Component Contract + validator (warn-only)

Defines the 10 CSS classes every theme's globals.css must implement so
composable sections in @platform/core-components render consistently
across all themes, not just Orion.

Validator runs in warn-only mode until all themes are backfilled (phases 2-6).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Backfill: Vega

**Goal:** Extend `packages/themes/vega/globals.css` so it satisfies the contract, with Vega's navy-on-white visual identity.
**Model:** sonnet — needs design judgement to keep Vega distinct from Orion.

### Read first

- `packages/themes/vega/globals.css` (full file) — understand current button style, section patterns, typography tokens.
- `packages/themes/vega/theme.config.ts` or `manifest.ts` — confirm brand palette (expect navy primary).
- `packages/themes/orion/globals.css` lines 23–60 (btn-\*) and lines 200–215 (section-dark-accent) and lines 528–556 (shadow/grain/press) — reference implementations.

### Changes

Append missing contract classes to `packages/themes/vega/globals.css` inside the existing component layer. Do NOT delete or re-order existing rules. Vega's visual character:

- Primary button: navy fill, thinner border radius than Orion (`rounded-lg` is fine but confirm from existing vega buttons).
- `btn-tertiary`: on `section-dark-accent` (which will be navy) — white-outline button.
- `btn-on-brand-primary` / `-outline`: for sections with `bg-brand-primary` (navy) — the on-brand buttons should use white fill / white border against navy.
- `section-dark-accent`: `bg-surface-inverse` (navy) with `py-20 md:py-28` and auto-styled descendant headings/paragraphs.
- `noise-overlay`: identical data-URI SVG pattern to Orion's — each theme owns its copy; future themes can vary opacity.
- `stat-value`: tabular-nums rendering.
- `location-pill` / `location-pill-arrow`: pill-style link matching Vega's radius + border colour; see `sites/dj-fox-electrical-test/app/globals.css:73-90` for Orion's implementation as the reference; Vega's version uses `border-surface-card-border` + `hover:border-brand-primary` + subtle navy tint on hover.

**Template for each missing class — use @apply with theme tokens, no hardcoded hex:**

```css
.btn-tertiary {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-lg;
  @apply bg-transparent text-white border-2 border-white font-semibold;
  @apply hover:bg-white/10 transition-all duration-200;
  @apply focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-surface-inverse;
}

.btn-on-brand-primary {
  @apply inline-flex items-center justify-center px-8 py-3 rounded-lg;
  @apply bg-white text-brand-primary font-semibold;
  @apply hover:bg-surface-muted transition-colors duration-200;
  @apply focus:ring-2 focus:ring-white focus:ring-offset-2;
  @apply whitespace-nowrap;
}

.btn-on-brand-primary-outline {
  @apply inline-flex items-center justify-center px-8 py-3 rounded-lg;
  @apply border-2 border-white text-white font-semibold;
  @apply hover:bg-white/10 transition-colors duration-200;
  @apply focus:ring-2 focus:ring-white focus:ring-offset-2;
  @apply whitespace-nowrap;
}

.section-dark-accent {
  @apply bg-surface-inverse text-white py-20 md:py-28;
}
.section-dark-accent h1,
.section-dark-accent h2,
.section-dark-accent h3 {
  @apply text-white;
}

.noise-overlay {
  position: relative;
}
.noise-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  pointer-events: none;
  z-index: 0;
}
.noise-overlay > * {
  position: relative;
  z-index: 1;
}

.stat-value {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}

.location-pill {
  @apply flex items-center justify-between px-5 py-4 rounded-xl border border-surface-card-border;
  @apply hover:border-brand-primary transition-all duration-200;
  background-color: transparent;
}
.location-pill:hover {
  background-color: color-mix(in srgb, var(--color-brand-primary) 5%, transparent);
}
.location-pill:hover .location-pill-arrow {
  transform: translateX(4px);
  color: var(--color-brand-primary);
}
.location-pill-arrow {
  transition:
    transform 0.2s ease,
    color 0.2s ease;
  color: var(--color-surface-muted-foreground);
}
```

- If Vega already defines `btn-primary` and `btn-secondary`, do NOT duplicate — only add the missing ones.
- If Vega already has its own aesthetic-distinct `btn-*` pattern (e.g. different padding or border), preserve that pattern when adding the missing classes — only fall back to the template above if Vega has no existing button conventions.

### Verification gate — STOP if this fails

```bash
pnpm type-check
pnpm validate:theme-contract --theme vega
# Must exit 0. Output: "✓ vega — all 10 contract classes defined"
pnpm --filter base-template build
# Base-template uses Vega — must build clean with the new classes.
```

### Commit

```bash
git add packages/themes/vega/globals.css
git commit -m "$(cat <<'EOF'
feat(themes/vega): implement theme component contract

Backfills btn-tertiary, btn-on-brand-primary, btn-on-brand-primary-outline,
section-dark-accent, noise-overlay, stat-value, location-pill,
location-pill-arrow. Uses Vega's navy-on-white visual identity.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Backfill: Designlab + Navagarden (parallel)

**Goal:** Add contract classes to designlab and navagarden, matching each theme's existing aesthetic.
**Model:** sonnet — designlab and navagarden are structurally similar to vega but keep each theme distinct.

### Parallel execution

These two theme globals files are independent — launch two Task agents in a single message.

**Task 1 — Designlab:**

- Read `packages/themes/designlab/globals.css`, `manifest.ts`, `theme.config.ts` (if present).
- Apply the same backfill approach as Vega, matching designlab's brand palette. Designlab's globals may already define some of the contract classes — only add missing ones.
- Verify with `pnpm validate:theme-contract --theme designlab`.

**Task 2 — Navagarden:**

- Same — read `packages/themes/navagarden/globals.css`, `manifest.ts`.
- Backfill missing contract classes matching navagarden's palette (check `manifest.ts` for colour intent — likely green/earthy).
- Verify with `pnpm validate:theme-contract --theme navagarden`.

Both Task agents use `model: sonnet`.

### Verification gate — STOP if this fails

```bash
pnpm type-check
pnpm validate:theme-contract --theme designlab
pnpm validate:theme-contract --theme navagarden
# Both must exit 0.
```

### Commit

```bash
git add packages/themes/designlab/globals.css packages/themes/navagarden/globals.css
git commit -m "$(cat <<'EOF'
feat(themes): implement component contract for designlab + navagarden

Each backfills the full contract with its own brand palette and radius
conventions. Visual identity preserved.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Backfill: Cygnus

**Goal:** Add contract classes to cygnus with its sharp/squared aesthetic.
**Model:** sonnet — cygnus has distinctive radius conventions; design care required.

### Read first

- `packages/themes/cygnus/globals.css` (full file).
- `packages/themes/cygnus/index.ts` — registry and brand palette.

### Changes

Cygnus is the "industrial brutalist" theme — sharp corners (`rounded-none` or very small radius), Signal-Orange accents, Press-Black base. Adjust the contract-class implementations:

- All `btn-*`: likely `rounded-none` to match cygnus identity (OR preserve whatever radius cygnus's existing buttons use — match the theme's convention, don't force `rounded-lg`).
- `section-dark-accent`: press-black background, same contract (auto-style descendants).
- `noise-overlay`: same data-URI pattern, possibly higher opacity (0.06 instead of 0.04) for cygnus's textured aesthetic — implementer's judgement.
- `location-pill`: sharp-cornered box, not pill (if cygnus uses `rounded-none`).

### Verification gate — STOP if this fails

```bash
pnpm type-check
pnpm validate:theme-contract --theme cygnus
```

### Commit

```bash
git add packages/themes/cygnus/globals.css
git commit -m "$(cat <<'EOF'
feat(themes/cygnus): implement theme component contract

Backfills contract classes with cygnus's industrial/sharp aesthetic —
preserves rounded-none convention on buttons where appropriate.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — Backfill: Solaris (largest addition)

**Goal:** Solaris has almost no button utilities today. Add the full contract with Solaris's pastel-pill aesthetic.
**Model:** sonnet — largest single theme backfill; requires careful integration with Solaris's custom radius tokens (`--solaris-radius-btn`).

### Read first

- `packages/themes/solaris/globals.css` (full file).
- `packages/themes/solaris/index.ts` + any manifest files — Solaris uses custom CSS variables like `--solaris-radius-btn`. Honour them.

### Changes

Solaris is likely pastel and high-radius ("pill"-style buttons). Add every missing contract class, referencing `--solaris-radius-btn` (or the equivalent custom property) where applicable:

```css
.btn-primary {
  /* If --solaris-radius-btn is defined: border-radius: var(--solaris-radius-btn); */
  /* Otherwise: @apply rounded-full (or matching Solaris convention). */
}
```

- Buttons likely pill-shaped (`rounded-full`).
- `section-dark-accent`: Solaris probably doesn't have a "dark" aesthetic — use a deep brand-accent colour instead (`bg-brand-primary` at high saturation, or a designated dark token). If Solaris's palette has no dark surface, use `bg-surface-inverse` from theme-system defaults.
- `noise-overlay`: lower opacity (0.02) to fit Solaris's softer look.

### Verification gate — STOP if this fails

```bash
pnpm type-check
pnpm validate:theme-contract --theme solaris
# Must exit 0. This is the largest single change — re-read the diff before committing.
```

### Commit

```bash
git add packages/themes/solaris/globals.css
git commit -m "$(cat <<'EOF'
feat(themes/solaris): implement theme component contract

Adds the full contract suite — solaris previously had sparse button
utilities. Uses solaris's pill radius (--solaris-radius-btn) and
pastel palette.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6 — Migrate stray classes from site globals to Orion

**Goal:** Move `noise-overlay`, `stat-value`, `location-pill`, `location-pill-arrow` from `sites/dj-fox-electrical-test/app/globals.css` into `packages/themes/orion/globals.css` where they belong.
**Model:** sonnet.

### Read first

- `sites/dj-fox-electrical-test/app/globals.css` — identify which utilities are ad-hoc site-level vs. which are site-specific overrides (mega-menu dropdown positioning).
- `packages/themes/orion/globals.css` — find where to add the absorbed classes (after the existing component section utilities).

### Changes

**In `sites/dj-fox-electrical-test/app/globals.css`:**

Delete the blocks for `.noise-overlay`, `.stat-value`, `.location-pill`, `.location-pill-arrow`. KEEP:

- The `@import "../../../packages/themes/orion/globals.css"` directive at the top.
- The `@tailwind base/components/utilities` directives.
- The `@layer base` block with `html { scroll-behavior: smooth }`, body + heading font declarations, `.min-h-screen { min-height: 100dvh }`.
- The mega-menu dropdown positioning block (`nav [class*="absolute"]...`).
- The `grain-light-section` block if present (site-specific).

**In `packages/themes/orion/globals.css`:**

Verify every one of the four absorbed classes is present. They likely already are, since Orion was the reference theme during Phase 2's Vega work. If any are missing, add them now using the EXACT same CSS as was removed from the site globals.

### Verification gate — STOP if this fails

```bash
pnpm type-check
pnpm validate:theme-contract --theme orion
pnpm --filter dj-fox-electrical-test build
# Build must succeed; site must still render with noise overlay, location pills, stat values intact.
```

### Commit

```bash
git add sites/dj-fox-electrical-test/app/globals.css packages/themes/orion/globals.css
git commit -m "$(cat <<'EOF'
refactor(orion): absorb noise-overlay / stat-value / location-pill from site globals

These classes are theme-owned, not site-owned. Moving them out of
sites/dj-fox-electrical-test/app/globals.css into the orion theme
globals makes the site globals a minimal site-specific-override file.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7 — Promote validator to error + wire CI

**Goal:** Switch validator from warn-only to fail-on-missing, add it to turbo.json and the GitHub Actions workflow.
**Model:** sonnet.

### Files to edit

**1. `turbo.json`** — add a new task entry. Read the current file first. Under `"tasks"`, add:

```json
"validate:theme-contract": {
  "inputs": [
    "packages/theme-system/src/component-contract.ts",
    "packages/themes/*/globals.css",
    "tools/validate-theme-globals.ts"
  ],
  "outputs": []
}
```

And add `"validate:theme-contract"` to the `dependsOn` array of the `"build"` task so local builds gate on it.

**2. `.github/workflows/ci.yml`** — add step after `type-check`, before `tests`:

```yaml
- name: Validate theme component contract
  run: pnpm run validate:theme-contract
```

(If multiple CI jobs exist, add to the Quality Checks job — the one that already runs lint + type-check.)

**3. Smoke-test the enforcement** — do NOT commit this step, just verify:

```bash
# Temporarily delete one contract class from vega's globals.css
# Run: pnpm validate:theme-contract → must exit 1 with a clear error naming vega and the missing class
# Revert the delete.
```

### Verification gate — STOP if this fails

```bash
pnpm type-check
pnpm validate:theme-contract
# Must exit 0 now that all 6 themes are backfilled.
pnpm lint
pnpm build
# Full monorepo build — all sites must succeed.
```

### Commit

```bash
git add turbo.json .github/workflows/ci.yml
git commit -m "$(cat <<'EOF'
ci(theme-contract): promote validator to error + wire into CI

After phases 2-6, all six themes satisfy the contract. Switch validator
from warn-only to fail-on-missing. Add to turbo.json as a build-gating
task and to the CI Quality Checks job.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 8 — Documentation

**Goal:** Document the contract, validator, and theme-author workflow.
**Model:** sonnet.

### Files

**1. New: `docs/standards/theme-component-contract.md`**

Content:

- Why the contract exists (1–2 paragraph intro).
- Full table of contract classes: name, group, purpose, consumers.
- Per-theme implementation summary table (orion/vega/cygnus/solaris/designlab/navagarden) with one-line visual intent each.
- How to validate locally (`pnpm validate:theme-contract` and `--theme <name>`).
- How to implement for a new theme (template snippets for each of the 10 classes, using theme-token @apply patterns).
- CI enforcement: note that validator runs in GitHub Actions Quality Checks job and gates build via turbo.

**2. Update `docs/architecture/how-theme-system-works.md`**

Read the file first. Append a "Component Contract" section linking to `docs/standards/theme-component-contract.md`. Keep the existing structure intact.

**3. Update `CLAUDE.md`** (repo root)

Under the "Styling with Theme Tokens" bullet list, add:

> - Every theme must satisfy the Theme Component Contract — see `docs/standards/theme-component-contract.md`. Validated in CI (`pnpm validate:theme-contract`).

**4. Update `packages/core-components/CLAUDE.md`**

Append a rule under the "Conventions" section:

> **Theme contract:** Composable section components may reference any class name in `THEME_COMPONENT_CONTRACT` (exported from `@platform/theme-system`). Any other theme-specific class name is forbidden — it would break non-Orion themes.

**5. Update `docs/guides/creating-new-theme.md`** (if exists — check first)

Add a mandatory step: "Run `pnpm validate:theme-contract --theme <your-theme>` before opening PR. The CI Quality Checks job enforces this — PRs with failing validation will be blocked."

If `docs/guides/creating-new-theme.md` doesn't exist, skip — don't create one as part of this brief.

### Parallel execution

Docs 1, 2, 3, 4, 5 are in independent files — launch 5 Task agents in a single message (one per file). Model: sonnet.

### Verification gate — STOP if this fails

```bash
pnpm type-check
# Docs changes don't affect type-check, but catch any stale code refs.
```

### Commit

```bash
git add docs/standards/theme-component-contract.md \
        docs/architecture/how-theme-system-works.md \
        CLAUDE.md \
        packages/core-components/CLAUDE.md \
        docs/guides/creating-new-theme.md 2>/dev/null || true
git commit -m "$(cat <<'EOF'
docs(theme-contract): document the Theme Component Contract + enforcement

New spec at docs/standards/theme-component-contract.md describing the
10 required classes, per-theme implementations, and the CI validator.
Architecture and CLAUDE.md reference the spec.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 9 — Final verification

**Goal:** Run the full gate suite one more time end-to-end.
**Model:** sonnet.

### Commands

```bash
pnpm type-check
pnpm lint
pnpm validate:theme-contract
pnpm build
# Note: pnpm build will now gate on validate:theme-contract via turbo.json.
pnpm --filter dj-fox-electrical build
pnpm --filter dj-fox-electrical-test build
pnpm --filter base-template build
pnpm --filter colossus-scaffolding build 2>/dev/null || true
```

- Every command must exit 0 (colossus-scaffolding build is optional — not every site always builds in CI).
- If `pnpm lint` surfaces warnings introduced by this pass (unused imports, stale `!important`), fix them in a follow-up commit named `fix(theme-contract): lint cleanup from validator pass`. Unrelated pre-existing warnings are NOT to be touched.
- This brief modifies theme packages and adds a tool under `tools/`. **Run `pnpm pipeline:smoke` if that script exists** in root `package.json` — confirm first, skip if not defined.

### Final commit (only if follow-up fixes were needed)

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(theme-contract): lint cleanup from validator pass

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                                                                                           | File overlap | Model  | Rationale                                                                                                     |
| ----- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------ | ------------------------------------------------------------------------------------------------------------- |
| G1    | Phase 3 | Task: backfill `packages/themes/designlab/globals.css`; Task: backfill `packages/themes/navagarden/globals.css`                                                                                                                                                 | none         | sonnet | Two independent theme globals files. Different visual identities, same contract.                              |
| G2    | Phase 8 | Task: write `docs/standards/theme-component-contract.md`; Task: update `docs/architecture/how-theme-system-works.md`; Task: update `CLAUDE.md`; Task: update `packages/core-components/CLAUDE.md`; Task: update `docs/guides/creating-new-theme.md` (if exists) | none         | sonnet | Five independent doc files.                                                                                   |
| G3    | Phase 9 | Run `pnpm type-check`; Run `pnpm lint`; Run `pnpm validate:theme-contract`                                                                                                                                                                                      | none         | n/a    | Independent read-only verification commands. `pnpm build` runs AFTER alone (writes to .next/ and dist/).      |
| —     | Phase 1 | — no parallel work — (single setup phase: contract file + index export + validator + package.json)                                                                                                                                                              | —            | —      | All edits sequential within the phase because the validator depends on the contract file being present first. |
| —     | Phase 2 | — no parallel work — (single theme backfill: vega)                                                                                                                                                                                                              | —            | —      | Single file edit.                                                                                             |
| —     | Phase 4 | — no parallel work — (single theme backfill: cygnus)                                                                                                                                                                                                            | —            | —      | Single file edit.                                                                                             |
| —     | Phase 5 | — no parallel work — (single theme backfill: solaris)                                                                                                                                                                                                           | —            | —      | Single file edit; largest addition, careful review.                                                           |
| —     | Phase 6 | — no parallel work — (sequential edits to site globals + orion globals to avoid class duplication)                                                                                                                                                              | —            | —      | Must delete from site before adding to orion (or verify already in orion) to avoid duplication.               |
| —     | Phase 7 | — no parallel work — (turbo.json + workflow YAML are tightly coupled)                                                                                                                                                                                           | —            | —      | Sequential: turbo.json change gates build; CI YAML change gates CI.                                           |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                                                                                                                                                                                                               |
| ------ | ------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (none) |        |       | Phases must run in order. Each phase's verification gate synchronises before the next. Phase 7 gates on all backfills (2–5) completing. Phase 6 depends on Phase 2+ (orion's ownership of the absorbed classes is established by then). |

### Sequential points — MUST NOT parallelise

| Item                                                                                               | Reason                                                                                               |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Verification gates (`pnpm type-check`, `pnpm lint`, `pnpm validate:theme-contract`) between phases | Each phase's output gates the next. Gates are the synchronisation barrier.                           |
| `pnpm build` in Phase 9                                                                            | Writes to `.next/` and `dist/`. Must run alone.                                                      |
| Git commits                                                                                        | One commit per phase, in order.                                                                      |
| Phase 1 → Phases 2–5                                                                               | Contract file must exist before theme backfills can be validated.                                    |
| Phases 2–5 → Phase 7                                                                               | Validator can't be promoted to error mode until every theme satisfies contract.                      |
| Phase 6 ordering within itself                                                                     | Delete from site globals first; verify orion has the classes; or vice versa — sequential either way. |

---

## Cost Estimate

| Phase                                      | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: contract + validator scaffolding  | sonnet | ~8k               | ~3k                | $0.07      |
| Phase 2: vega backfill                     | sonnet | ~5k               | ~1k                | $0.03      |
| Phase 3: designlab + navagarden (parallel) | sonnet | ~10k              | ~2k                | $0.06      |
| Phase 4: cygnus backfill                   | sonnet | ~5k               | ~1k                | $0.03      |
| Phase 5: solaris backfill (largest)        | sonnet | ~7k               | ~2k                | $0.05      |
| Phase 6: site → orion absorption           | sonnet | ~5k               | ~0.8k              | $0.03      |
| Phase 7: turbo + CI wiring                 | sonnet | ~5k               | ~0.5k              | $0.02      |
| Phase 8: docs (5 parallel agents)          | sonnet | ~12k              | ~4k                | $0.10      |
| Phase 9: verification                      | sonnet | ~6k               | ~0.5k              | $0.03      |
| Orchestrator overhead (coordination)       | sonnet | ~18k              | ~3k                | $0.10      |
| **Total**                                  |        | **~81k**          | **~17.8k**         | **~$0.52** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $1/$5 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~4k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA.
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm validate:theme-contract && pnpm build` passes.
3. Per-theme backfill: confirm all 6 themes pass validation. Note any intentional deviations per theme (e.g. cygnus using `rounded-none` instead of `rounded-lg`).
4. Any docs files that didn't exist and were skipped (expected: `docs/guides/creating-new-theme.md` may not exist).
5. Smoke-test of validator failure: confirm you ran the "delete a class, validator errors, revert" check.
6. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

   Compare to pre-flight estimate above. Exact figures: console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-19_theme-component-contract/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises — especially per-theme visual decisions for cygnus/solaris that diverged from the brief's defaults]

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

- STOP on any failed verification gate — do not continue to the next phase.
- Read every file before editing it. **Especially** each theme's globals.css — they have distinct existing structure you must preserve.
- Never push — leave all changes on the feature branch.
- **Consult the Parallel Execution Groups section before launching work.** Items in a group go in a single Task-tool message. Items not in a group run sequentially.
- **Minimal changes only** — implement what this brief says, no more. No refactors of theme globals beyond the contract backfill.
- **Token-only styling.** Never hardcode hex in any edit. Always use `@apply bg-brand-primary`, `var(--color-...)`.
- **Preserve each theme's distinct visual identity.** The contract constrains class NAMES, not visual implementation. Orion's button ≠ Cygnus's button ≠ Solaris's button — each looks different, all satisfy `btn-primary`.
- **Do NOT modify composable section components** — this brief is CSS + validator + docs. Composable files are out of scope.
- **Do NOT modify production site pages** (`packages/themes/orion/pages/*.tsx` and site `app/page.tsx` files) — out of scope entirely.
- Use `model: sonnet` for Task agents in Phases 3 and 8 (parallel work). Orchestrator stays sonnet throughout.
- Co-Authored-By reflects the orchestrator: `Claude Sonnet 4.6 <noreply@anthropic.com>`.
- This brief creates a new tool under `tools/` and modifies theme packages. The final phase (Phase 9) MUST check whether `pnpm pipeline:smoke` is defined in root `package.json` and run it if so. Skip if not defined — don't invent a task.
- No `--additionalDirectories` needed — all edits within `/Users/rickywilson/Sites/local-business-platform`.

---

## Completed

**Date:** 2026-04-19
**Status:** All phases executed successfully

Implemented the Theme Component Contract across all 9 phases. The validator had a CSS parser bug in the brief's specified code — `@import` lines and `@apply` content inside rule bodies accumulated in the buffer and caused the class-extraction regex to skip valid selectors. Fixed by rewriting `extractDefinedClasses` with proper brace-depth tracking. All 6 themes now satisfy the 10-class contract with theme-appropriate visual implementations: Cygnus uses `rounded-none` on location pills (matching its card convention) and 0.06 noise opacity; Solaris uses `--solaris-radius-btn` and `--solaris-radius-pill` custom properties with 0.02 noise opacity. Four stray classes migrated from `sites/dj-fox-electrical-test/app/globals.css` to `packages/themes/orion/globals.css`. The `pipeline:smoke` script failed on a pre-existing missing fixture — unrelated.

### Commits

- `f1ddd93` feat(theme-system): introduce Theme Component Contract + validator (warn-only)
- `8ce37f0` feat(themes/vega): implement theme component contract
- `d939ab3` feat(themes): implement component contract for designlab + navagarden
- `b871591` feat(themes/cygnus): implement theme component contract
- `6947c3a` feat(themes/solaris): implement theme component contract
- `4dc268a` refactor(orion): absorb noise-overlay / stat-value / location-pill from site globals
- `8e5d476` ci(theme-contract): promote validator to error + wire into CI
- `bb2119a` docs(theme-contract): document the Theme Component Contract + enforcement
