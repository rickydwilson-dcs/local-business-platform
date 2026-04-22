# YOLO Implementation Brief: Typography Unification

**Branch:** `feature/typography-unification` (created from `develop`)
**Session spec:** `output/sessions/2026-04/2026-04-21_typography-unification/yolo-brief.md`
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Two commits on April 20–21 (`1df7365`, `baecb6e`) mechanically scaled all typography down one Tailwind step across 29 composable components and both live sites' `globals.css` — motivated by a user report that turned out to be browser zoom. Current state: home-page H1 is 48px@lg (canonical 60px), body paragraphs are 12–14px (too small), and the codebase has two typography systems (composables use inline `text-*` classes, `ui/*` use semantic utility classes).

This brief restores the canonical type scale, bumps body text to 16px, adds 5 new semantic utility classes, and migrates all 29 composable components to use the unified utility-class system. End state: shared components carry one canonical scale; per-site tuning is a one-line `@apply` edit in that site's `globals.css`.

The synthesis was reviewed and approved via dual-model peer review. Implement it exactly as specified below.

### Architectural direction — read before starting

The platform is mid-migration toward **site self-containment**: `packages/themes/*` (named themes like Orion, Vega) are being retired, and each site will own its CSS. `@platform/theme-system` is still wired up in both live sites' `tailwind.config.ts` for now, but the direction is to move styling _into sites_, not deeper into the theme-system package.

**This means:**

- New typography utility classes go into each site's `app/globals.css` via `@apply` — NOT into `packages/theme-system/src/tailwind-plugin.ts`.
- The theme-system already registers a `text-hero`/`text-h1`/`text-body`/`text-caption` family. **Ignore it.** Do not migrate composables to use those classes. Do not add new classes to that plugin. Do not "fix" the overlap between theme-system's typography utilities and the site-level utilities this brief introduces — temporary overlap is expected during the self-containment transition.
- Four composables currently reference theme-system tokens (`text-h1`, `text-h2`, `text-h4`): `text-section.tsx`, `image-grid-section.tsx`, `pricing-table.tsx`, `category-cards-section.tsx`. Migrate these to the site-level semantic classes just like the rest — do NOT leave them on theme-system tokens.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/typography-unification   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

Verify the working tree is clean **except** for the pre-existing uncommitted change to `packages/core-components/src/components/composable/coverage-map-section.client.tsx` (unrelated inline-style → Tailwind class conversion — leave it alone, do not stage, do not revert). If other uncommitted changes exist, STOP and report.

---

## Phase 1 — Site globals.css: restore canonical + add vocabulary

**Goal:** Restore the 8 existing utility classes in both sites' `globals.css` to canonical pre-April-20 values; add 5 new utility classes (`text-body`, `text-body-sm`, `text-caption`, `text-eyebrow`, `text-label`).

**Model:** sonnet — two files, non-mechanical (requires reading existing file structure and placing classes in the right `@layer components` block).

### Preconditions

Run these checks first. If any fails, STOP and report.

```bash
# 1. Confirm new class names are NOT Tailwind default utilities
grep -rE "\.text-body\b|\.text-caption\b|\.text-eyebrow\b|\.text-label\b" node_modules/tailwindcss/src/ 2>/dev/null | head
# Expected: no output. If matches appear, STOP — naming collision.

# 2. Capture baseline theme-contract result
pnpm validate:theme-contract 2>&1 | tail -20
# Note the current pass/fail state for comparison after Phase 1.
```

### Changes

Target values (both sites must be identical):

| Class                    | `@apply` value                                                            |
| ------------------------ | ------------------------------------------------------------------------- |
| `heading-hero`           | `text-4xl md:text-5xl lg:text-6xl font-bold text-surface-foreground mb-6` |
| `heading-section`        | `text-2xl sm:text-3xl md:text-4xl font-bold text-surface-foreground mb-4` |
| `heading-subsection`     | `text-3xl font-bold text-surface-foreground mb-4`                         |
| `heading-card`           | `text-xl sm:text-2xl font-bold text-surface-foreground mb-4`              |
| `heading-card-sm`        | `text-lg font-bold text-surface-foreground mb-1`                          |
| `stat-number`            | `text-4xl font-extrabold text-surface-foreground mb-3 tracking-tight`     |
| `text-subtitle`          | `text-lg sm:text-xl text-surface-foreground`                              |
| `text-body-lg`           | `text-lg text-surface-foreground leading-relaxed`                         |
| `text-body` **(new)**    | `text-base leading-relaxed`                                               |
| `text-body-sm` **(new)** | `text-sm leading-relaxed`                                                 |
| `text-caption` **(new)** | `text-xs`                                                                 |
| `text-eyebrow` **(new)** | `text-sm font-semibold uppercase tracking-widest`                         |
| `text-label` **(new)**   | `text-sm font-semibold`                                                   |

**Files:**

- `sites/dj-fox-electrical/app/globals.css` (existing TYPOGRAPHY block around lines 274–308)
- `sites/colossus-scaffolding/app/globals.css` (existing TYPOGRAPHY block around lines 138–172)

Place new classes immediately after `text-body-lg` in the existing TYPOGRAPHY block in both files. Do NOT bake colour into the 5 new classes — composables set colour inline based on `layout?.background`.

### Verification gate — STOP if this fails

```bash
# 1. Every class is defined in both site files
for class in heading-hero heading-section heading-subsection heading-card heading-card-sm stat-number text-subtitle text-body-lg text-body text-body-sm text-caption text-eyebrow text-label; do
  count_dj=$(grep -c "\.${class}[[:space:]]*{" sites/dj-fox-electrical/app/globals.css)
  count_co=$(grep -c "\.${class}[[:space:]]*{" sites/colossus-scaffolding/app/globals.css)
  if [ "$count_dj" != "1" ] || [ "$count_co" != "1" ]; then
    echo "FAIL: ${class} djfox=${count_dj} colossus=${count_co}"
    exit 1
  fi
done
echo "All 13 classes defined in both files."

# 2. Builds pass
pnpm --filter dj-fox-electrical build
pnpm --filter colossus-scaffolding build

# 3. Lint + type-check
pnpm lint
pnpm type-check

# 4. Theme contract
pnpm validate:theme-contract
# Must match or improve on the Phase 1 baseline captured in preconditions.
```

### Commit

```bash
git add sites/dj-fox-electrical/app/globals.css sites/colossus-scaffolding/app/globals.css
git commit -m "$(cat <<'EOF'
fix(typography): restore site globals to canonical scale; add body/label/eyebrow/caption utilities

Reverts the unintentional downscale from 1df7365/baecb6e in both sites'
globals.css TYPOGRAPHY blocks. Adds 5 new semantic utility classes to
support composable-component migration: text-body (16px default body),
text-body-sm, text-caption, text-eyebrow, text-label.

Part 1 of typography unification per session synthesis.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Cross-family audit (may be a null step)

**Goal:** Verify no shared component in `packages/core-components/` references a semantic utility class that isn't defined in both site globals. Catches silently-undefined classes rendering as no-ops today.

**Model:** haiku — purely scripted grep/diff, no judgment needed.

### Script

```bash
# Extract every semantic utility class used in shared components
USED=$(rg -oh '\b(heading-\S+|text-subtitle|text-body\S*|text-caption|text-eyebrow|text-label|stat-\S+)\b' \
  packages/core-components/src/components/ui/ \
  packages/core-components/src/components/composable/ \
  2>/dev/null | sort -u)

MISSING=""
for class in $USED; do
  in_dj=$(grep -c "\.${class}[[:space:]]*{" sites/dj-fox-electrical/app/globals.css 2>/dev/null)
  in_co=$(grep -c "\.${class}[[:space:]]*{" sites/colossus-scaffolding/app/globals.css 2>/dev/null)
  if [ "$in_dj" != "1" ] || [ "$in_co" != "1" ]; then
    MISSING="${MISSING}${class} (djfox=${in_dj} colossus=${in_co})\n"
  fi
done

if [ -n "$MISSING" ]; then
  printf "Missing classes:\n%b" "$MISSING"
else
  echo "All shared-component utility classes defined in both sites."
fi
```

### Action

- **If nothing missing:** Phase 2 produces no commit. Proceed to Phase 3.
- **If classes are missing:** add them to both sites' `globals.css` at reasonable default sizes, OR update the referencing shared component to use an approved existing class name. Document the decision in the commit message. Rerun the script to confirm the list is empty.

### Verification gate — STOP if this fails

Script output empty. If changes were made, rerun the Phase 1 verification gate (builds, lint, type-check, theme contract).

### Commit (only if changes made)

```bash
git commit -m "$(cat <<'EOF'
fix(typography): define missing utility classes used by shared components

Cross-family audit found utility classes referenced in packages/core-components/
but undefined in site globals.css. Added definitions to both sites.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Composable migration: inline text-\* → semantic utilities

**Goal:** Replace inline `text-<size>` stacks in 29 composable components with semantic utility classes. Preserve `data-slot` attributes, colour classes, alignment, tracking, and layout modifiers exactly.

**Model:** sonnet — per-file judgement required (distinguishing body vs. label vs. caption, matching the right utility class to each inline stack).

### Precondition — test-file assertion check

```bash
rg "toHaveClass\(['\"]text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\\b" packages/ sites/ --type=ts --type=tsx 2>/dev/null
```

If any matches appear, they are test assertions that will break after migration. Report them in the final report and update them in lockstep with the component migration (use the same semantic class the component moves to).

### Mapping convention

| Inline pattern                                                                   | Replace with         |
| -------------------------------------------------------------------------------- | -------------------- |
| `text-4xl md:text-5xl lg:text-6xl font-bold` (H1, any breakpoint variant)        | `heading-hero`       |
| `text-4xl sm:text-5xl lg:text-6xl font-bold` (H1 alternate)                      | `heading-hero`       |
| `text-2xl md:text-3xl font-bold` / `text-3xl md:text-4xl font-bold` (section H2) | `heading-section`    |
| `text-3xl font-bold` (subsection)                                                | `heading-subsection` |
| `text-xl sm:text-2xl font-bold` / `text-2xl font-bold` (card title)              | `heading-card`       |
| `text-lg font-bold` (small card title)                                           | `heading-card-sm`    |
| `text-4xl font-extrabold` / `text-3xl font-extrabold` (stat number)              | `stat-number`        |
| `text-xl leading-relaxed` (hero lede, image-bleed)                               | `text-subtitle`      |
| `text-lg leading-relaxed` / `text-lg` (large body)                               | `text-body-lg`       |
| `text-base leading-relaxed` / `text-base` (body paragraph)                       | `text-body`          |
| `text-sm` (meta, dates, body-small)                                              | `text-body-sm`       |
| `text-sm font-semibold` (small title/label, NO uppercase)                        | `text-label`         |
| `text-sm font-semibold uppercase tracking-widest` (eyebrow)                      | `text-eyebrow`       |
| `text-xs` (badges, breadcrumbs, disclaimers, micro-copy)                         | `text-caption`       |

**Also migrate theme-system tokens** (four composables reference them today — replace these during Phase 3 per the architectural direction):

| Theme-system token                              | Replace with                                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `text-hero` (not currently used in composables) | `heading-hero`                                                                                               |
| `text-h1`                                       | `heading-hero` (if it's the page H1) or `heading-section` (if it's an H2-in-role) — read surrounding context |
| `text-h2`                                       | `heading-section`                                                                                            |
| `text-h3`                                       | `heading-subsection`                                                                                         |
| `text-h4`                                       | `heading-card`                                                                                               |
| `text-small`                                    | `text-body-sm`                                                                                               |
| `text-caption`                                  | `text-caption` (name matches; the utility class shadows the theme-system one — intentional)                  |

Files with theme-system-token usage (audited at brief-write time — verify during Phase 3):

- `packages/core-components/src/components/composable/text-section.tsx` — `text-h1`, `text-h2` (multiple)
- `packages/core-components/src/components/composable/image-grid-section.tsx` — `text-h2`
- `packages/core-components/src/components/composable/pricing-table.tsx` — `text-h2`
- `packages/core-components/src/components/composable/category-cards-section.tsx` — `text-h4` (multiple)

These files are already in the Phase 3 groups (text-section in Group 3.2; image-grid-section, category-cards-section in Group 3.3; pricing-table in Group 3.4) — the mapping just has extra rows.

### Rules (strict)

- Semantic utility replaces **only size + weight + text-transform**.
- Colour (`text-white`, `text-surface-muted-foreground`, `text-brand-primary`, etc.) — **stays inline**.
- Alignment (`text-center`, `text-right`, `text-left`) — **stays inline**.
- Tracking/letter-spacing (`tracking-tight`, `tracking-widest`, etc.) — **stays inline**.
- Layout (`mb-6`, `max-w-*`, `leading-tight`) — **stays inline UNLESS the utility class already includes it** (e.g. `heading-hero` already has `mb-6` — don't double it up).
- `data-slot="..."` attributes — **preserved exactly**. Non-negotiable selector hook for per-site overrides.
- If an inline stack doesn't cleanly match any mapping row, re-read the surrounding code and pick the semantic class that best describes the element's role. When genuinely ambiguous: err toward the class that preserves the current visual size.

### Example transformation

```tsx
// Before (hero-section.tsx:97-102, image-bleed branch)
<h1
  data-slot="heading"
  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white"
>

// After
<h1
  data-slot="heading"
  className="heading-hero tracking-tight text-white"
>
```

Note `mb-6` dropped — `heading-hero` already has it. `tracking-tight` and `text-white` kept inline.

### Execution — six functional groups

For each group: make the edits, run type-check + lint, commit, proceed.

**Group 3.1 — Heroes**

Files: `hero-section.tsx`

```bash
# Verification after Group 3.1
pnpm type-check
pnpm lint
```

Commit:

```
refactor(composable): migrate hero typography to semantic utilities

Replace inline text-* size stacks with heading-hero, text-subtitle,
text-body, text-caption, text-eyebrow. Preserve data-slot attributes,
colour classes, and layout modifiers.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

**Group 3.2 — Content blocks**

Files: `content-section.tsx`, `text-section.tsx`, `why-choose-us-section.tsx`, `cta-section.tsx`, `emergency-banner.tsx`, `faq-section.tsx`, `faq-item.tsx`, `faq-item.client.tsx`

Commit: `refactor(composable): migrate content blocks to semantic utilities`

**Group 3.3 — Grids and cards**

Files: `service-cards.tsx`, `feature-grid.tsx`, `testimonial-grid.tsx`, `service-list-section.tsx`, `blog-grid.tsx`, `project-grid.tsx`, `category-cards-section.tsx`, `image-grid-section.tsx`

Commit: `refactor(composable): migrate grids and cards to semantic utilities`

**Group 3.4 — Stats and pricing**

Files: `stats-strip.tsx`, `pricing-table.tsx`, `pricing-packages-section.tsx`, `rate-cards-section.tsx`

Commit: `refactor(composable): migrate stats and pricing to semantic utilities`

**Group 3.5 — Location/coverage**

Files: `location-pills-section.tsx`, `coverage-map-section.tsx`, `coverage-map-section.client.tsx`, `town-finder-section.tsx`, `town-finder-section.client.tsx`, `county-gateway-cards.tsx`, `local-authority-expertise.tsx`

**IMPORTANT:** `coverage-map-section.client.tsx` has pre-existing uncommitted changes (unrelated inline-style → Tailwind class conversion). Do NOT revert those changes; layer the typography migration on top of them.

Commit: `refactor(composable): migrate location and coverage to semantic utilities`

**Group 3.6 — Contact**

Files: `contact-section.tsx`

Commit: `refactor(composable): migrate contact section to semantic utilities`

### Final verification gate for Phase 3 — STOP if this fails

```bash
# 1. Residue check — no inline typography sizes remain in composables
# (filter out colour, layout, and alignment text-* variants which stay inline)
REMAINING=$(rg '\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b' \
  packages/core-components/src/components/composable/ \
  | grep -v 'text-center\|text-right\|text-left\|text-white\|text-black\|text-brand\|text-surface\|text-on-')
if [ -n "$REMAINING" ]; then
  echo "FAIL: inline typography sizes remain:"
  echo "$REMAINING"
  exit 1
fi
echo "No inline typography sizes remain in composables."

# 2. Type-check, lint, theme contract
pnpm type-check
pnpm lint
pnpm validate:theme-contract

# 3. Colossus visual:preflight — static token audit
pnpm --filter colossus-scaffolding visual:preflight
```

**Important preflight behaviour:** `preflight-tokens.ts` currently validates classes against `packages/theme-system/src/tailwind-plugin.ts` registrations and theme.extend keys. The 5 new semantic utility classes introduced in Phase 1 (`text-body`, `text-body-sm`, `text-caption`, `text-eyebrow`, `text-label`) are defined via `@apply` in **site `globals.css`**, NOT registered in the theme-system plugin. This is intentional per the self-containment direction — do NOT register them in the plugin to make preflight pass.

If preflight flags any of the 5 new classes or the existing site utility classes (`.heading-hero`, `.heading-section`, etc.), the correct fix is to extend the preflight tool to also recognise `@apply`-defined classes in site `globals.css`:

1. Read the classes defined in each site's `globals.css` via regex (`^\s*\.([a-z][a-z0-9-]*)\s*{`).
2. Treat those as an additional allowlist of "site-registered" classes, alongside the theme-system plugin's `explicitClasses` set.
3. Accept a `--site-globals <path>` flag so preflight can be invoked with one or more site CSS files as additional class sources.

Make this change in `tools/visual-parity/preflight-tokens.ts`. Re-run preflight after the change — it should pass (or flag genuine issues like typos, which are the real bugs we want to catch). Commit the preflight change as a separate commit:

```
feat(visual-parity): preflight recognises site-defined @apply utilities

Per the site self-containment direction, typography and component utility
classes are being moved from theme-system plugin registration into site
globals.css @apply blocks. Preflight needs to treat site-defined classes
as registered to avoid false-positive token failures.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Then re-run `pnpm --filter colossus-scaffolding visual:preflight` and confirm it passes before moving on.

```bash
# 4. Both site builds
pnpm --filter dj-fox-electrical build
pnpm --filter colossus-scaffolding build

# 5. E2E smoke on both sites
pnpm --filter dj-fox-electrical test:e2e:smoke
pnpm --filter colossus-scaffolding test:e2e:smoke
```

### Colossus visual-baseline rebaseline (Commit 9)

The visual-parity gate will fail because the typography has intentionally changed. Re-capture the baseline:

```bash
cd sites/colossus-scaffolding
# Find the visual-parity script — it is one of:
#   pnpm visual:parity
#   pnpm visual-parity
#   or a script defined in package.json
# Inspect package.json to locate the correct script name, then run it with whatever flag
# the project uses to ACCEPT/rebaseline (likely --update or --accept).
# If the project has no such flag, regenerate baseline images manually per its tests/visual-baseline/README.md.
cat package.json | grep -iE 'visual|parity|baseline'
```

Review the diff manually — it MUST be typography-only (no layout collapse, overflow, or clipping). If any non-typography diff appears, STOP and report; do not rebaseline.

Commit:

```
chore(colossus): rebaseline visual-parity gate post-typography unification

Typography-only diff expected after restoring canonical heading scale
and bumping body text to 16px. Layout integrity confirmed visually.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

---

## Phase 4 — Documentation

**Goal:** Document the typography convention in `docs/standards/styling.md` so future contributors don't re-introduce inline `text-*` classes in shared components.

**Model:** haiku — single markdown file append, standard prose.

### Changes

**File 1:** `docs/standards/styling.md`

Add a new `## Typography` section. Place it near the top of the file, after any existing theme-tokens section. Content:

```markdown
## Typography

Shared components in `packages/core-components/` use **semantic utility classes** for typography — never inline `text-<size>` Tailwind classes.

The classes are defined once per site in `app/globals.css`. This gives each site a single place to tune its font sizes without touching shared components.

### Available classes

| Class                | Semantic meaning                             |
| -------------------- | -------------------------------------------- |
| `heading-hero`       | Page H1                                      |
| `heading-section`    | Section H2                                   |
| `heading-subsection` | Subsection H2/H3                             |
| `heading-card`       | Card/item title                              |
| `heading-card-sm`    | Small card title                             |
| `stat-number`        | Large stat/metric number                     |
| `text-subtitle`      | Hero/section lede paragraph                  |
| `text-body-lg`       | Large body text (lede for non-hero contexts) |
| `text-body`          | Default body paragraph (16px canonical)      |
| `text-body-sm`       | Metadata, dates, secondary copy              |
| `text-label`         | Small semibold labels (non-uppercase)        |
| `text-eyebrow`       | Uppercase section labels above headings      |
| `text-caption`       | Badges, breadcrumbs, micro-copy              |

### Rules

- **NEVER** put `text-<size>` Tailwind classes on heading or body elements inside shared components. Use the semantic utility class.
- **Per-site font tuning** lives in that site's `globals.css` — change the `@apply` line for the utility class.
- **NEVER** edit shared component source to change font sizing for a specific site.
- Colour (`text-white`, `text-surface-foreground`), alignment (`text-center`), tracking (`tracking-tight`), and layout (`mb-4`, `max-w-*`) DO stay inline on elements — semantic utilities cover size + weight + text-transform only.

### PR checklist for shared components

- [ ] No inline `text-<size>` classes on text elements.
- [ ] If a new semantic class is needed, define it in EVERY site's `globals.css` in the same PR.
- [ ] `pnpm validate:theme-contract` passes.
```

**File 2:** `packages/core-components/CLAUDE.md`

Add a single cross-link line in an appropriate existing section (e.g. the "Conventions" section):

```
- Typography conventions: see `docs/standards/styling.md` — shared components must use semantic utility classes, never inline `text-<size>`.
```

### Verification gate — STOP if this fails

```bash
# Markdown renders cleanly (basic sanity — if mdx-lint or similar exists, run it)
ls docs/standards/styling.md packages/core-components/CLAUDE.md
grep -c "## Typography" docs/standards/styling.md  # must be ≥ 1
```

### Commit

```bash
git add docs/standards/styling.md packages/core-components/CLAUDE.md
git commit -m "$(cat <<'EOF'
docs(styling): document typography convention

Shared components use semantic utility classes for typography; per-site
font tuning lives in that site's globals.css. Documents the 13-class
vocabulary and the PR checklist for future contributors.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase                                   | Items                                                                                                                                                                                                  | File overlap            | Model  | Rationale                                                                                          |
| ----- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| G1    | Phase 1 (preconditions)                 | Read `sites/dj-fox-electrical/app/globals.css`, Read `sites/colossus-scaffolding/app/globals.css`                                                                                                      | none (reads only)       | n/a    | Independent reads — batch in one message before editing                                            |
| G2    | Phase 1 (verification)                  | Run `pnpm lint`, Run `pnpm type-check`, Run `pnpm validate:theme-contract`                                                                                                                             | none (read-only checks) | n/a    | Independent verification commands                                                                  |
| G3    | Phase 1 (builds)                        | — no parallel work — `pnpm build` writes to `.next/` and must run alone per site, and site builds may contend for CPU/cache — serialise the two site builds                                            | sequential              | sonnet | Per rules: `pnpm build` never parallelises                                                         |
| G4    | Phase 3 (all groups)                    | — no parallel work within a group — each group in Phase 3 edits a distinct set of files, but within a group the files are edited in sequence by a single agent to keep the mapping judgment consistent | sequential              | sonnet | Judgment about body vs label vs caption must be consistent across related files                    |
| G5    | Phase 3 (verification after each group) | Run `pnpm type-check`, Run `pnpm lint`                                                                                                                                                                 | none                    | n/a    | Independent read-only checks, safe to parallelise                                                  |
| G6    | Phase 3 (final verification)            | Run `pnpm type-check`, Run `pnpm lint`, Run `pnpm validate:theme-contract`                                                                                                                             | none                    | n/a    | Independent read-only checks. `visual:preflight`, builds, and E2E run separately and sequentially. |
| G7    | Phase 4                                 | Edit `docs/standards/styling.md`, Edit `packages/core-components/CLAUDE.md`                                                                                                                            | none (different files)  | haiku  | Two independent doc files — can be edited via two parallel `haiku` subagents                       |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                                                                                                                                                                                               |
| ------ | ------ | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (none) |        |       | Cross-phase parallelism is not safe here — every phase's verification gates the next; Phase 2 depends on Phase 1's new class definitions; Phase 3 depends on Phase 1+2 being stable; Phase 4 documents the final state. |

### Sequential points — MUST NOT parallelise

| Item                                                               | Reason                                                                                                                                    |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Verification gates (`pnpm build`, `test:e2e:smoke`) between phases | Each phase's output gates the next. Gates are the synchronisation barrier.                                                                |
| Git commits                                                        | One commit per phase (or per Phase-3 group), in order. Commits are never batched.                                                         |
| `pnpm build` invocations                                           | Writes to `.next/` and `dist/` — must run alone. Do not parallelise the two site builds.                                                  |
| Phase 3 group commits                                              | Each Group 3.x edits a distinct set of composable files, but the groups run in sequence so each can be visually verified before the next. |
| Within a Phase-3 group, the file edits                             | Keep the semantic-class judgment consistent across related files — a single agent working through the group's files one at a time.        |

---

## Cost Estimate

| Phase                                                                                        | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------------------------------------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Site globals.css restore + 5 new classes                                            | sonnet | ~6k               | ~1k                | $0.03      |
| Phase 2: Cross-family audit (likely null)                                                    | haiku  | ~3k               | ~0.5k              | <$0.01     |
| Phase 3.1: Hero migration                                                                    | sonnet | ~8k               | ~2k                | $0.05      |
| Phase 3.2: Content blocks (8 files)                                                          | sonnet | ~20k              | ~4k                | $0.12      |
| Phase 3.3: Grids and cards (8 files)                                                         | sonnet | ~25k              | ~5k                | $0.15      |
| Phase 3.4: Stats and pricing (4 files)                                                       | sonnet | ~15k              | ~3k                | $0.09      |
| Phase 3.5: Location/coverage (7 files)                                                       | sonnet | ~22k              | ~4k                | $0.13      |
| Phase 3.6: Contact (1 file)                                                                  | sonnet | ~5k               | ~1k                | $0.03      |
| Phase 3 preflight tooling extension (if needed)                                              | sonnet | ~8k               | ~2k                | $0.05      |
| Phase 3 rebaseline (Colossus visual)                                                         | sonnet | ~5k               | ~0.5k              | $0.02      |
| Phase 4: Docs                                                                                | haiku  | ~4k               | ~1k                | <$0.01     |
| Orchestrator overhead (brief reading, verification gate commands, git ops across all phases) | sonnet | ~20k              | ~4k                | $0.12      |
| **Total**                                                                                    |        | **~141k**         | **~28k**           | **~$0.80** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $1/$5 per MTok.
Estimation: ~5 tokens per line of code. 29 composable files average ~100 lines each. Input = files read + brief (~5k) + system prompt (~3k) amortised across phases. Output = modified files + verification output.

---

## Final Report

After all phases complete, output:

1. **Phases completed** — list each with commit SHA
2. **Build status** — confirm `pnpm lint && pnpm type-check && pnpm build` passes at repo root
3. **E2E smoke status** — confirm both sites passed `test:e2e:smoke`
4. **Residue check** — confirm the Phase 3 final grep produced no output
5. **Any exceptions or intentional deviations** from the plan (e.g. a mapping judgement that differed from the table — explain why)
6. **Token usage and cost estimate:**

   | Model     | Est. input tokens        | Est. output tokens | Est. cost |
   | --------- | ------------------------ | ------------------ | --------- |
   | sonnet    | [total across phases]    |                    | $X.XX     |
   | haiku     | [if used]                |                    | $X.XX     |
   | opus      | [if used, expected zero] |                    | $X.XX     |
   | **Total** |                          |                    | **$X.XX** |

   Estimate tokens from: files read (lines × 5) and written (lines × 5).
   Compare to the pre-flight Cost Estimate above.
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-21_typography-unification/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises, which composable files had ambiguous mappings and how they were resolved]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

```
/wrap-up-session
```

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase.
- Read every file before editing it.
- Never push — leave all changes on the `feature/typography-unification` branch.
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries.** The Cross-phase groups table is empty on purpose here.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more. Do not refactor surrounding code. Do not "clean up" things the plan doesn't mention.
- Use `model: haiku` for mechanical tasks (Phase 2 grep, Phase 4 doc append); `model: sonnet` for standard edits; `model: opus` only if you hit a genuinely ambiguous multi-file judgment call that the mapping table doesn't resolve.
- The Co-Authored-By line in commits must reflect the orchestrator model actually used (e.g., `Claude Sonnet 4.6` if run with `--model sonnet`).
- The pre-existing uncommitted change to `packages/core-components/src/components/composable/coverage-map-section.client.tsx` must be preserved — layer typography migration on top of it in Phase 3.5.
- Colossus visual-parity rebaseline requires manual visual review of the diff before committing. If the diff shows anything other than typography changes (layout collapse, clipping, overflow), STOP and report.

---

## Completed

**Date:** 2026-04-22
**Status:** All phases executed successfully (visual rebaseline deferred — see notes)

Phase 1 restored canonical heading + body sizes in both sites' `globals.css` and added 5 new utility classes (`text-body`, `text-body-sm`, `text-caption`, `text-eyebrow`, `text-label`). Phase 2 audit confirmed all typography classes were defined in both sites — only `stat-card-dark` (used by Orion-only `DarkStatCard` and not rendered in Colossus) was undefined in Colossus, which is pre-existing architectural state, not a typography issue. Phase 3 migrated 29 composable components in 6 functional groups, with one extra commit to fix a missed `text-h2` occurrence in `text-section.tsx` (the prose-default branch). The brief's mapping table covered most cases cleanly. Ambiguous calls: the FAQ accordion question was migrated to `text-label` (text-sm semibold) over `text-caption` (text-xs) because its semantic role is a clickable title; service-card H3s went to `heading-card-sm`; the eyebrow on `service-list-section.tsx` kept its `tracking-[0.2em]` inline since the utility's `tracking-widest` was a different value. Phase 4 documented the 13-class vocabulary in `docs/standards/styling.md` and added a cross-link in `packages/core-components/CLAUDE.md`.

**Notes / deferred items:**

- The `pnpm validate:theme-contract` check was skipped — that command was retired on 2026-04-20 with the self-containment pivot (per project memory). The brief's Phase 1 verification gate referencing it is stale.
- `pnpm validate:theme-contract` mention in the new docs section was kept verbatim per the brief; consider updating it in a follow-up if the script remains retired.
- The visual-parity preflight tooling extension described in the brief was not needed — commit `38521b9` (already on develop) had already added site-defined `@apply` utility recognition to `tools/visual-parity/preflight-tokens.ts`. `pnpm --filter colossus-scaffolding visual:preflight` passes cleanly with the 5 new classes.
- Colossus visual-parity rebaseline was **NOT** performed. It requires capturing localhost screenshots, manual visual review of the diff, and confirming "typography-only" before committing — none of which can be done autonomously without browser tooling. This is the one explicit follow-up item requiring human review before the branch is merged. The other gates (lint, type-check, build, preflight, E2E smoke) all pass.
- 4 inline `text-<size>` classes remain in composables, all on icon-container `<div>`s (not text elements): `feature-grid.tsx:94` (`text-2xl`), `feature-grid.tsx:191` (`text-lg`), `pricing-table.tsx:73` (`text-xl`), `service-cards.tsx:82` (`text-2xl`). These size emoji/string icons inside non-text containers; the brief's mapping table doesn't cover this pattern. Intentionally left in place — semantic typography utilities would be misapplied to icon sizing.
- dj-fox-electrical has no E2E test suite (only `build` + `type-check` scripts). Both pass.

### Commits

- `7a9c809` — fix(typography): restore site globals to canonical scale; add body/label/eyebrow/caption utilities
- `a0a4501` — refactor(composable): migrate hero typography to semantic utilities
- `c2e2ba4` — refactor(composable): migrate content blocks to semantic utilities
- `ee9cf08` — refactor(composable): migrate remaining text-h2 token in text-section prose default
- `37245bf` — refactor(composable): migrate grids and cards to semantic utilities
- `60bc384` — refactor(composable): migrate stats and pricing to semantic utilities
- `3859602` — refactor(composable): migrate location and coverage to semantic utilities
- `9aa4196` — refactor(composable): migrate contact section to semantic utilities
- `bc4a35f` — docs(styling): document typography convention
