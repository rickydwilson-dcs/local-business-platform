# YOLO Implementation Brief: `/pipeline.stitch-design` Skill

**Branch:** feature/pipeline-stitch-design (created from develop)
**Session spec:** output/sessions/2026-03-28_pipeline-stitch-design/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The platform's `pipeline.ingest` skill requires a real reference website to scrape a theme from. For net-new clients with no existing site, there's no design input and the result is generic. This skill creates a parallel path: use Google Stitch (free AI design tool with MCP integration) to generate a bespoke design for any trade type, extract the design system and HTML, build a new named theme package, and scaffold a test site — all before touching production code.

The plan was dual-model peer reviewed (Claude + Codex independently), synthesised, and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier | Alias | Cost (in/out per MTok) | Use for |
|------|-------|----------------------|---------|
| Opus | `opus` | $15 / $75 | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15 | Standard implementation — file edits, feature wiring, most phases |
| Haiku | `haiku` | $0.80 / $4 | Mechanical tasks: find-replace, import additions, grep checks, content validation |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/pipeline-stitch-design
pnpm type-check   # must be clean before starting
```

If `pnpm type-check` fails, STOP and report the errors. Do not proceed with a dirty baseline.

---

## Phase 1: Write the `pipeline.stitch-design` Skill File

**Goal:** Create `.claude/commands/pipeline.stitch-design.md` — the complete skill definition
**Model:** sonnet — substantial prose writing with embedded code blocks and structured decision logic

Read these files in parallel before writing:
- `.claude/commands/pipeline.ingest.md` — structural reference for step format
- `.claude/commands/pipeline.kill-site.md` — cross-reference for cleanup commands
- `tools/lib/theme-name-picker.ts` — understand pickNextThemeName() call
- `packages/themes/vega/index.ts` — theme package export pattern
- `packages/theme-system/src/types.ts` (first 80 lines) — ComponentRegistry, DeepPartialThemeConfig types
- `packages/theme-system/src/theme-names.ts` — CONSTELLATION_NAMES list

Write `.claude/commands/pipeline.stitch-design.md` with the following structure (expand each step fully — this file IS the executable specification, not a summary):

### Header and Usage

```markdown
# Pipeline Stitch Design

Generate a new theme and test site using Google Stitch as the design source.
No reference URL required — Stitch creates the design from a trade/profession description.

**Usage:** `/pipeline.stitch-design --trade "electrical contractor" [--colors "dark navy and yellow"]`

- `--trade` (required) — the business/profession type; used to prompt Stitch
- `--colors` (optional) — colour scheme guidance; if omitted, Stitch chooses its own

Theme name is auto-assigned from the constellation namespace.
```

### Step 1: Preflight

Expand fully:
1. Confirm branch is `develop` (`git branch --show-current`) — STOP if not
2. Check working tree (`git status --porcelain`) — WARN if dirty, continue
3. Parse `--trade` (required) and `--colors` (optional); STOP with usage if `--trade` missing
4. Verify Stitch MCP reachable — attempt lightweight probe call. On failure, STOP:
   ```
   Stitch MCP tools not available.
   Ensure the Stitch MCP server is configured at user level (~/.claude/).
   See the Stitch MCP documentation for setup instructions.
   ```
5. Auto-pick theme name:
   ```bash
   npx tsx tools/lib/theme-name-picker.ts
   ```
   Store as `$THEME_NAME`. This reads `THEME_NAMES` from `packages/theme-system/src/types.ts` and returns the first unused name from `CONSTELLATION_NAMES`.
6. Defensive collision check — if `packages/themes/$THEME_NAME/` already exists, STOP:
   ```
   Theme $THEME_NAME already exists in packages/themes/ but is not in THEME_NAMES —
   THEME_NAMES may be out of sync. Investigate before proceeding.
   ```

### Step 2: Create Stitch Project and Generate Pages

2a. Call Stitch MCP `create_project` with human-readable name:
```
<ThemeNameTitleCase> <Trade> Website
```
e.g. for theme `lyra` + trade `electrical contractor` → `Lyra Electrical Contractor Website`

Store returned project ID as `$PROJECT_ID`.

2b. Apply project-level design intent (send as the initial generation prompt or project description):
```
Design a professional website for a [TRADE] business in the UK.
[If --colors provided:] Use a colour scheme of [COLORS].
[If --colors omitted:] Choose a colour scheme appropriate for a [TRADE] business.

Design intent:
- Trustworthy, local, and conversion-focused — not generic SaaS
- Consistent typography, spacing rhythm, and component language across all pages
- Token-driven colour usage (primary, secondary, accent, surface, on-primary)
- Use realistic placeholder content (company name: "Smith & Sons [Trade]", services, testimonials, contact details)
- Mobile-first layout, clean navigation, prominent CTA buttons
```

2c. Generate exactly 5 screens using page-specific prompts:

| Screen | Slug | Key sections |
|--------|------|-------------|
| Home | `home` | Hero with strong CTA, services overview (3–4 cards), social proof/testimonials, stats bar, footer |
| About | `about` | Company story, founding year, team/values, trust signals (accreditations, awards), footer |
| Contact | `contact` | Contact form (name, email, phone, message), business phone/address, opening hours, map placeholder, footer |
| Services | `services` | Grid/listing of service categories with icon, title, short description, "Learn more" link, breadcrumb nav |
| Service Detail | `service-detail` | Single service page: hero + service name, description paragraphs, benefits list, image gallery placeholder, FAQ accordion, CTA panel, breadcrumb back to Services |

After submitting all 5 screens, call `list_screens` for `$PROJECT_ID` and confirm exactly 5 exist. If any failed, STOP and report which screen(s) failed.

```bash
# Verification gate — STOP if this fails
# Confirm list_screens returns exactly 5 screens for $PROJECT_ID
```

### Step 3: Download Design Assets

Create output folders:
```bash
mkdir -p output/ingestion/$THEME_NAME-stitch/design-system
mkdir -p output/ingestion/$THEME_NAME-stitch/html
mkdir -p output/ingestion/$THEME_NAME-stitch/meta
```

Download in parallel where possible:
- Call `get_design_system` for `$PROJECT_ID` → write `output/ingestion/$THEME_NAME-stitch/design-system/tokens.json`
- Call `list_screens` → write `output/ingestion/$THEME_NAME-stitch/meta/screens.json`
- Write `output/ingestion/$THEME_NAME-stitch/meta/project.json`:
  ```json
  {
    "projectId": "$PROJECT_ID",
    "projectName": "<ThemeNameTitleCase> <Trade> Website",
    "themeName": "$THEME_NAME",
    "trade": "<trade arg>",
    "colors": "<colors arg or null>",
    "generatedAt": "<ISO timestamp>"
  }
  ```
- For each of the 5 screens, call the Stitch HTML export tool → write to `output/ingestion/$THEME_NAME-stitch/html/<slug>.html`

```bash
# Verification gate — STOP if this fails
ls output/ingestion/$THEME_NAME-stitch/design-system/tokens.json
ls output/ingestion/$THEME_NAME-stitch/html/home.html
ls output/ingestion/$THEME_NAME-stitch/html/about.html
ls output/ingestion/$THEME_NAME-stitch/html/contact.html
ls output/ingestion/$THEME_NAME-stitch/html/services.html
ls output/ingestion/$THEME_NAME-stitch/html/service-detail.html
ls output/ingestion/$THEME_NAME-stitch/meta/project.json
ls output/ingestion/$THEME_NAME-stitch/meta/screens.json
# All 8 files must exist and be non-empty
```

### Step 4: Create Theme Package

Read `output/ingestion/$THEME_NAME-stitch/design-system/tokens.json` and extract colours using this alias resolution order (first match wins):

| ThemeConfig field | Stitch token aliases to try (in order) | Fallback |
|---|---|---|
| `colors.brand.primary` | `primaryColor`, `primary`, `colors.primary`, `brand.primary`, `brandColor` | `#2563eb` |
| `colors.brand.primaryHover` | `primaryHover`, `primary-hover` | Darken primary ~12% |
| `colors.brand.secondary` | `secondaryColor`, `secondary`, `colors.secondary` | `#1e3a5f` |
| `colors.brand.accent` | `accentColor`, `accent`, `tertiary`, `highlight` | `#06b6d4` |
| `colors.brand.onPrimary` | `onPrimary`, `primaryForeground`, `primaryText` | `#ffffff` if primary luminance < 0.5, else `#111827` |
| `colors.surface.background` | `backgroundColor`, `background`, `surface`, `bgColor` | `#ffffff` |
| `colors.surface.foreground` | `onBackground`, `textColor`, `foreground`, `text` | `#111827` |
| `colors.surface.card` | `surfaceColor`, `cardBackground`, `card`, `surfaceContainer` | `#ffffff` |
| `colors.surface.cardBorder` | `outlineColor`, `border`, `outline`, `divider` | `#e2e8f0` |
| `colors.surface.muted` | `neutralColor`, `muted`, `surfaceVariant`, `neutral` | `#f8fafc` |
| `colors.semantic.success` | `success`, `successColor` | `#10b981` |
| `colors.semantic.warning` | `warning`, `warningColor` | `#f59e0b` |
| `colors.semantic.error` | `error`, `errorColor` | `#ef4444` |
| `colors.semantic.info` | `info`, `infoColor` | `#3b82f6` |
| `colors.overlay.dark` | `overlayDark`, `scrim` | `rgba(0,0,0,0.8)` |
| `colors.overlay.light` | `overlayLight` | `rgba(255,255,255,0.8)` |
| `colors.overlay.primary` | `overlayPrimary` | `rgba(<primary-rgb>,0.8)` |

Record provenance for every token and write `output/ingestion/$THEME_NAME-stitch/meta/token-mapping-report.json`:
```json
{
  "colors.brand.primary": { "source": "direct", "stitchKey": "primaryColor", "value": "#dc2626" },
  "colors.brand.primaryHover": { "source": "derived", "from": "colors.brand.primary", "value": "#b91c1c" },
  "colors.surface.muted": { "source": "fallback", "value": "#f8fafc" }
}
```

Infer `ComponentRegistry` variants from `html/home.html`:

| Field | Heuristic | Values |
|---|---|---|
| `heroVariant` | Full-width background image or `background-image` CSS → `"image-overlay"`; two-column split → `"split"` | `"image-overlay"` \| `"split"` |
| `headerVariant` | Header/nav background luminance < 0.3 → `"dark"` | `"dark"` \| `"light"` |
| `cardVariant` | Circular icon containers (`border-radius:50%` or `rounded-full`) → `"icon-circle"`; image overlay cards → `"overlay"`; else → `"standard"` | `"icon-circle"` \| `"overlay"` \| `"standard"` |
| `sectionVariant` | Alternating dark brand block → `"dark-accent"`; recurring gradients → `"gradient"`; alternating tinted bands → `"banded"`; else → `"standard"` | `"dark-accent"` \| `"gradient"` \| `"banded"` \| `"standard"` |

Write `packages/themes/$THEME_NAME/index.ts` following the orion/vega pattern exactly:
```typescript
/**
 * [ThemeNameTitleCase] Theme
 *
 * Generated by /pipeline.stitch-design
 * Stitch project: <project-name> (id: <project-id>)
 * Trade type: <trade>
 *
 * Sites using [ThemeNameTitleCase]: (none yet)
 */
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const [camelCaseThemeName]Registry: ComponentRegistry = {
  theme: "[theme-name]",
  heroVariant: "<inferred>",
  headerVariant: "<inferred>",
  cardVariant: "<inferred>",
  sectionVariant: "<inferred>",
};

export const [camelCaseThemeName]DefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: { primary: '...', primaryHover: '...', secondary: '...', accent: '...', onPrimary: '...' },
    surface: { background: '...', foreground: '...', card: '...', cardBorder: '...', muted: '...' },
    semantic: { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' },
    overlay: { dark: '...', light: '...', primary: '...' },
  },
};

registerTheme({ name: '[theme-name]', label: '[ThemeNameTitleCase]', config: [camelCaseThemeName]DefaultConfig });
```

Write `packages/themes/$THEME_NAME/globals.css`:
Copy `packages/themes/vega/globals.css` verbatim (it uses only `@apply` with theme tokens — entirely colour-agnostic). Update the file header comment to identify the new theme name. Prepend the animation import exactly as in vega's globals.css.

Update `THEME_NAMES` in `packages/theme-system/src/types.ts` — append `"$THEME_NAME"` to the array. This is MANDATORY. Without it, the next run of `pickNextThemeName()` will try to create the same name again.

Verify `THEME_NAMES` sync:
```bash
# Verification gate — STOP if this fails
npx tsx -e "import { pickNextThemeName } from './tools/lib/theme-name-picker.ts'; console.log(pickNextThemeName());"
# Output must be the constellation name AFTER $THEME_NAME, not $THEME_NAME itself
```

### Step 5: Scaffold and Wire Test Site

Copy base-template:
```bash
cp -r sites/base-template sites/$THEME_NAME-test
rm -rf sites/$THEME_NAME-test/node_modules sites/$THEME_NAME-test/.next sites/$THEME_NAME-test/.turbo
```

Write `sites/$THEME_NAME-test/.pipeline-test-site.json`:
```json
{
  "createdAt": "<ISO timestamp>",
  "themeName": "$THEME_NAME",
  "sourceUrl": "stitch:<PROJECT_ID>",
  "pipelineOutput": "output/ingestion/$THEME_NAME-stitch/"
}
```

Rewrite `sites/$THEME_NAME-test/theme.config.ts`:
```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { [camelCaseThemeName]Registry, [camelCaseThemeName]DefaultConfig } from '@platform/themes/$THEME_NAME';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: [camelCaseThemeName]Registry,
  ...[camelCaseThemeName]DefaultConfig,
};
```

Rewrite `sites/$THEME_NAME-test/app/globals.css`:
```css
@import "../../../packages/themes/$THEME_NAME/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * Pipeline Test Site — $THEME_NAME theme (Stitch)
 * Generated by /pipeline.stitch-design
 */

@layer base {
  html { scroll-behavior: smooth; }
  body {
    @apply bg-surface-background text-surface-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
}
```

Generate CI-inert `package.json`:
1. Read `sites/base-template/package.json`
2. Call `generateTestSitePackageJson('$THEME_NAME-test', basePackageJson)` from `tools/lib/test-site-package.ts`
3. Write result to `sites/$THEME_NAME-test/package.json`

Verify CI-inert:
```bash
# Verification gate — STOP if this fails
node -e "
  const p = require('./sites/$THEME_NAME-test/package.json');
  const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]);
  if (bad.length) { console.error('FAIL: CI scripts present:', bad); process.exit(1); }
  if (!p.pipelineTestSite) { console.error('FAIL: missing pipelineTestSite marker'); process.exit(1); }
  console.log('PASS: test site is CI-inert');
"
```

Update `site.config.ts` tagline to `'Pipeline Test Site — $THEME_NAME theme (Stitch)'`.

Rewrite `app/layout.tsx` as bare shell (no SiteHeader/Footer — base-template pages provide their own):
```typescript
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider } from '@platform/core-components';
import { [camelCaseThemeName]Registry } from '@platform/themes/$THEME_NAME';
import { ReviewPanel } from './components/ReviewPanel';

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.tagline,
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col">
        <ThemeProvider theme="$THEME_NAME" registry={[camelCaseThemeName]Registry}>
          {children}
          <ReviewPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Do NOT attempt to convert Stitch HTML to TSX — this is out of scope for v1. The test site uses base-template pages wired to the new theme.

### Step 6: Lockfile and Type-check

```bash
pnpm install --lockfile-only
# If that fails:
pnpm install
```

Verify lockfile is valid:
```bash
pnpm install --frozen-lockfile
```

Run type-check on test site (report errors but do not block):
```bash
cd sites/$THEME_NAME-test && npx tsc --noEmit
```

Stage everything:
```bash
git add sites/$THEME_NAME-test/ packages/themes/$THEME_NAME/ packages/theme-system/src/types.ts pnpm-lock.yaml
```

### Step 7: Report

Output this summary to the user:
```
✓ Theme assigned:   $THEME_NAME  (constellation namespace)
✓ Stitch project:   <project-name>  (id: $PROJECT_ID)
✓ Design assets:    output/ingestion/$THEME_NAME-stitch/
    html/           — 5 page exports (home, about, contact, services, service-detail)
    design-system/  — tokens.json
    meta/           — project.json, screens.json, token-mapping-report.json
✓ Theme package:    packages/themes/$THEME_NAME/
✓ Test site:        sites/$THEME_NAME-test/
✓ THEME_NAMES:      updated in packages/theme-system/src/types.ts

Dev server:   cd sites/$THEME_NAME-test && npm run dev
Cleanup:      /pipeline.kill-site $THEME_NAME-test   (removes test site)
              /pipeline.kill-theme $THEME_NAME        (removes theme package)

Next steps:
  1. Open Stitch project to review and iterate designs visually
  2. Inspect meta/token-mapping-report.json — verify colour extraction looks correct
  3. Start dev server and confirm theme tokens resolve
  4. When satisfied: /deploy.changes
```

### Rules

- This command does NOT commit or push anything
- Never modifies `sites/base-template/` — only the copy
- If any step fails, STOP and report — do not create a partial theme or test site

---

**[End of skill file content]**

```bash
# Verification gate — STOP if this fails
ls .claude/commands/pipeline.stitch-design.md
```

Commit:
```bash
git add .claude/commands/pipeline.stitch-design.md
git commit -m "$(cat <<'EOF'
feat(pipeline): add /pipeline.stitch-design skill

New skill that creates a theme and test site using Google Stitch as
the design source instead of a reference URL. Accepts --trade and
optional --colors; auto-assigns theme name from constellation namespace.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Update `pipeline.kill-site` for Dual Naming Compatibility

**Goal:** Update `.claude/commands/pipeline.kill-site.md` to accept both `<name>-test` (new style) and `test-<name>` (old style)
**Model:** sonnet — careful prose edit to an existing instruction file; logic must be unambiguous

Read `.claude/commands/pipeline.kill-site.md` in full before editing.

Replace the current normalisation logic in Step 1 (which only prepends `test-` to bare names) with expanded logic:

```
Normalize the site name:
1. If argument matches an existing directory directly (e.g. `lyra-test` → `sites/lyra-test/`): use it as-is
2. If argument starts with `test-` (e.g. `test-lyra`): use as-is → `sites/test-lyra/`
3. If argument ends with `-test` (e.g. `lyra-test`): use as-is → `sites/lyra-test/`
4. If argument is a bare name (e.g. `lyra`): try `sites/lyra-test/` first, then `sites/test-lyra/`; use whichever exists
5. If both `sites/<name>-test/` and `sites/test-<name>/` exist: STOP — "Ambiguous: both sites/<name>-test/ and sites/test-<name>/ exist. Pass the full folder name."
6. If neither exists: "Site not found — nothing to remove." (idempotent success)
```

Also update the header line to reflect the new skill:
```markdown
Remove a test site created by `/pipeline.ingest` or `/pipeline.stitch-design`.
```

```bash
# Verification gate — STOP if this fails
grep -q "lyra-test" .claude/commands/pipeline.kill-site.md
grep -q "test-lyra" .claude/commands/pipeline.kill-site.md
echo "PASS: both naming conventions present in kill-site"
```

Commit:
```bash
git add .claude/commands/pipeline.kill-site.md
git commit -m "$(cat <<'EOF'
fix(pipeline): update kill-site to handle both <name>-test and test-<name> formats

pipeline.stitch-design creates sites/<name>-test; pipeline.ingest creates
sites/test-<name>. kill-site now resolves both patterns unambiguously.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Final Type-check and Verification

**Goal:** Confirm monorepo type-checks clean after the skill file changes
**Model:** haiku — mechanical verification only

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

If type-check fails, investigate and fix before committing. These are skill markdown files so type errors here would come from Phase 1's edits to `packages/theme-system/src/types.ts` template — check that the `THEME_NAMES` example in the skill file uses valid string literals consistent with the schema.

Note: The skill file contains template placeholders like `$THEME_NAME` — these are runtime variables in the skill's instruction context, not TypeScript. The type-check here validates the monorepo's existing TypeScript, not the skill file itself.

```bash
# Additional smoke check
pnpm lint
```

Commit any fixes if needed:
```bash
git add -p   # stage only what changed
git commit -m "$(cat <<'EOF'
fix(pipeline): resolve type-check issues post stitch-design skill

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Cost Estimate

| Phase | Model | Est. input tokens | Est. output tokens | Est. cost |
|-------|-------|------------------|--------------------|-----------|
| Phase 1: Write skill file | sonnet | ~18k | ~5k | ~$0.13 |
| Phase 2: Update kill-site | sonnet | ~8k | ~1.5k | ~$0.05 |
| Phase 3: Type-check + lint | haiku | ~6k | ~0.5k | ~$0.01 |
| **Total** | | **~32k** | **~7k** | **~$0.19** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~3k) + system prompt (~3k).

---

## Final Report

After all phases complete, output:
1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check` passes (build not required — no TypeScript was changed)
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model | Est. input tokens | Est. output tokens | Est. cost |
   |-------|------------------|--------------------|-----------|
   | sonnet | [total across phases] | | $X.XX |
   | haiku | [if used] | | $X.XX |
   | **Total** | | | **$X.XX** |

   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-03-28_pipeline-stitch-design/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises or deviations]

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
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used: `Claude Sonnet 4.6 <noreply@anthropic.com>`
- This implementation creates only skill/markdown files — no TypeScript compilation of the skill itself is needed; type-check validates the monorepo's existing TS

---

## Completed

**Date:** 2026-03-29
**Status:** All phases executed successfully

All three phases completed on branch `feature/pipeline-stitch-design`. Phase 1 wrote the full `/pipeline.stitch-design` skill file with all 7 steps expanded — preflight, Stitch project creation, asset download, theme package generation, test site scaffolding, lockfile/type-check, and report. Phase 2 updated `pipeline.kill-site.md` to handle both `<name>-test` (new stitch-design naming) and `test-<name>` (original ingest naming) with unambiguous resolution logic. One deviation: the initial Phase 1 commit landed on `feature/smercer` due to a shell context issue — it was cherry-picked to the correct `feature/pipeline-stitch-design` branch before proceeding. Phase 3 confirmed `pnpm type-check` and `pnpm lint` both pass clean.

### Commits

- `e168732` feat(pipeline): add /pipeline.stitch-design skill
- `90ae712` fix(pipeline): update kill-site to handle both <name>-test and test-<name> formats
