# Implementation Plan: Typography Unification

**Date:** 2026-04-21
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude's and Codex's independent plans

## Key Differences Between Plans

| Aspect                                                       | Claude                                                                                                           | Codex                                                                                         | Synthesised Decision                                                                                                                                                                                                                                   |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Canonical size table                                         | Concrete values per class (e.g. `heading-hero` = `text-4xl md:text-5xl lg:text-6xl font-bold`)                   | Deferred to audit; called out targets in prose                                                | **Use Claude's concrete table.** Defining values before the audit removes ambiguity and lets both sites restore in parallel.                                                                                                                           |
| New utility-class vocabulary                                 | `text-body`, `text-body-sm`, `text-caption`, `text-eyebrow`                                                      | Same four **+ `text-label`** for small-semibold titles (e.g. why-choose-us item titles)       | **Adopt all 5 new classes.** `text-label` covers a real pattern Claude missed.                                                                                                                                                                         |
| Phase 3 commit strategy                                      | 6 functional-group commits (heroes, content blocks, grids, stats, location, contact) with per-group verification | 1 big commit (Commit B) — argues easier revert                                                | **Hybrid.** Commit by functional group to catch errors during a tedious mechanical migration, but treat the 6 commits as one logical rollback unit. Each group commit runs a verification gate before proceeding; if using PRs later, squash at merge. |
| Cross-family audit (ui/\* classes undefined in site globals) | Embedded as a "watch for this during migration" note                                                             | Dedicated phase with explicit diff between shared-component class references and site globals | **Adopt Codex's explicit phase.** Run the grep-diff as a scripted audit, not a vigilance check. Catches bugs that vigilance won't.                                                                                                                     |
| Tracking/letter-spacing rule                                 | Explicit: `tracking-*` stays inline; utility classes don't mandate tracking                                      | Not addressed                                                                                 | **Keep Claude's rule.** Semantic utilities cover size+weight+transform only. Tracking/colour/layout stay inline.                                                                                                                                       |
| Tailwind-classname-collision check                           | Explicit pre-flight: verify `text-body` etc. are not Tailwind default utilities                                  | Not addressed                                                                                 | **Keep Claude's check** as a Phase 1 precondition.                                                                                                                                                                                                     |
| Test-file class-name assertion risk                          | Flagged (grep test dir before migrating)                                                                         | Not addressed                                                                                 | **Keep Claude's grep** as a Phase 3 precondition.                                                                                                                                                                                                      |
| Mapping artifact                                             | Implied in commits                                                                                               | Build artifact for PR description, not committed                                              | **Adopt Codex's approach.** Generate the mapping table during Phase 3 audit; include in session wrap-up, not in the repo.                                                                                                                              |

## Blind Spots Caught

**Codex caught (that Claude missed):**

- **`text-label` as a distinct semantic class.** `text-sm font-semibold` appears on small titles and item labels (e.g. `why-choose-us-section.tsx:91`). Treating it as `text-body` would be semantically wrong (labels aren't body copy) and would drop `font-semibold` rendering.
- **Cross-family audit as its own phase.** Running a scripted diff between `ui/*` + `composable/*` class references vs. site globals.css definitions is a distinct verification gate, not a vigilance task folded into another phase.
- **Artifact-in-PR-description, not in repo.** The mapping table is scratch work, not documentation.

**Claude caught (that Codex missed):**

- **Canonical sizing table with exact `text-*` values.** Without this, the "restore" phase is ambiguous (restore to what?). The table is the contract.
- **Functional-group migration for reviewability.** A 29-file single-commit is harder to review and harder to visually verify than per-group batches.
- **Tailwind-classname-collision risk.** `text-body` is _not_ a Tailwind default utility (verified), but `text-caption`, `text-label` etc. similarly need pre-flight confirmation.
- **Test-file class-name assertion risk.** Any unit test or Playwright assertion doing `expect(el).toHaveClass('text-4xl')` will break when the element uses `heading-hero` instead.
- **`tracking-*` stays inline rule.** Otherwise semantic utilities accumulate layout-ish opinions over time.

---

# Implementation Plan

## Target canonical scale (used by Phase 1)

| Class                    | `@apply` value                                                            | Rendered @ lg               |
| ------------------------ | ------------------------------------------------------------------------- | --------------------------- |
| `heading-hero`           | `text-4xl md:text-5xl lg:text-6xl font-bold text-surface-foreground mb-6` | 60px                        |
| `heading-section`        | `text-2xl sm:text-3xl md:text-4xl font-bold text-surface-foreground mb-4` | 36px @ md                   |
| `heading-subsection`     | `text-3xl font-bold text-surface-foreground mb-4`                         | 30px                        |
| `heading-card`           | `text-xl sm:text-2xl font-bold text-surface-foreground mb-4`              | 24px @ sm                   |
| `heading-card-sm`        | `text-lg font-bold text-surface-foreground mb-1`                          | 18px                        |
| `stat-number`            | `text-4xl font-extrabold text-surface-foreground mb-3 tracking-tight`     | 36px                        |
| `text-subtitle`          | `text-lg sm:text-xl text-surface-foreground`                              | 20px @ sm                   |
| `text-body-lg`           | `text-lg text-surface-foreground leading-relaxed`                         | 18px                        |
| `text-body` **(new)**    | `text-base leading-relaxed`                                               | 16px — **new default body** |
| `text-body-sm` **(new)** | `text-sm leading-relaxed`                                                 | 14px                        |
| `text-caption` **(new)** | `text-xs`                                                                 | 12px                        |
| `text-eyebrow` **(new)** | `text-sm font-semibold uppercase tracking-widest`                         | 14px                        |
| `text-label` **(new)**   | `text-sm font-semibold`                                                   | 14px                        |

Colour (`text-surface-foreground`) is included in existing classes because that's where both sites already have it. The four new classes deliberately DO NOT bake in colour — composables set colour inline based on `layout?.background` (e.g. `text-white` for inverse backgrounds). This is intentional.

---

## Phase 1 — Site globals.css: restore canonical + add vocabulary

### Preconditions

- Verify `text-body`, `text-body-sm`, `text-caption`, `text-eyebrow`, `text-label` are NOT Tailwind default utility class names:
  ```bash
  grep -r "text-body\|text-caption\|text-eyebrow\|text-label" node_modules/tailwindcss/src/ 2>/dev/null | head
  ```
  Expected: no Tailwind definitions. (Expected based on research, but confirm.)
- Verify theme-contract safety:
  ```bash
  pnpm validate:theme-contract
  ```
  Note baseline result. Re-run after Phase 1 to confirm no new violations.

### Changes

- `sites/dj-fox-electrical/app/globals.css` — restore existing 8 utility classes to canonical sizes (table above); add 5 new classes.
- `sites/colossus-scaffolding/app/globals.css` — same edits.

### Verification gate

- `pnpm --filter dj-fox-electrical build` → clean.
- `pnpm --filter colossus-scaffolding build` → clean.
- `pnpm lint` at repo root → clean.
- `pnpm validate:theme-contract` → no new violations.
- Dev-server visual check on BOTH sites: MDX-rendered pages (e.g. an about/privacy page) that use `.heading-hero`, `.text-body-lg` render at canonical sizes.
- Grep confirmation — every utility class is defined in both files:
  ```bash
  for class in heading-hero heading-section heading-subsection heading-card heading-card-sm stat-number text-subtitle text-body-lg text-body text-body-sm text-caption text-eyebrow text-label; do
    count_dj=$(grep -c "\\.${class}[[:space:]]*{" sites/dj-fox-electrical/app/globals.css)
    count_co=$(grep -c "\\.${class}[[:space:]]*{" sites/colossus-scaffolding/app/globals.css)
    echo "${class}: djfox=${count_dj} colossus=${count_co}"
  done
  ```
  Both columns must be `1` for every row.

### Commit

`fix(typography): restore site globals to canonical scale; add body/label/eyebrow/caption utilities`

### Rollback-only value

If Phase 2/3 hit unforeseen issues and are reverted, Phase 1 alone already fixes MDX-rendered content and `ui/*`-component pages. DJ Fox and Colossus home pages (composable-rendered) would remain at the scaled-down state until later phases land.

---

## Phase 2 — Cross-family audit (Codex-flagged defensive step)

Before migrating composables, confirm NO shared component references a utility class that isn't defined in both site globals. This catches silently-undefined classes that render as no-ops today.

### Script

```bash
# Extract every semantic utility class used in shared components
USED=$(rg -oh '\b(heading-\S+|text-subtitle|text-body\S*|text-caption|text-eyebrow|text-label|stat-\S+)\b' \
  packages/core-components/src/components/ui/ \
  packages/core-components/src/components/composable/ \
  2>/dev/null | sort -u)

# For each, verify it's defined in BOTH site globals
for class in $USED; do
  in_dj=$(grep -c "\\.${class}[[:space:]]*{" sites/dj-fox-electrical/app/globals.css 2>/dev/null)
  in_co=$(grep -c "\\.${class}[[:space:]]*{" sites/colossus-scaffolding/app/globals.css 2>/dev/null)
  if [ "$in_dj" != "1" ] || [ "$in_co" != "1" ]; then
    echo "MISSING: ${class} (djfox=${in_dj} colossus=${in_co})"
  fi
done
```

### Action

- If any class is missing from a site globals: either add it (if legitimate) or update the shared component to use an existing approved class.
- If nothing is missing: Phase 2 is a null verification step. Commit nothing.

### Verification gate

- Script output is empty.
- If changes were made: repeat Phase 1 verification gate.

### Commit (only if changes made)

`fix(typography): define missing utility classes used by shared components`

---

## Phase 3 — Composable migration: inline text-\* → semantic utilities

Replace inline `text-<size>` class stacks in `packages/core-components/src/components/composable/*.tsx` with semantic utility classes. 29 files, ~189 `text-*` occurrences (many of which are colour/layout and stay inline).

### Preconditions

- **Test-file class-name assertion check:**
  ```bash
  rg 'toHaveClass\(['\''"]text-[0-9xsmlbase]+' packages/ sites/ --type=ts --type=tsx
  ```
  Any matches need updating in lockstep with the migration (or pre-updating to use semantic classes).

### Mapping convention

| Inline pattern                                                                    | Replace with         |
| --------------------------------------------------------------------------------- | -------------------- |
| `text-4xl md:text-5xl lg:text-6xl font-bold` (H1, any breakpoint variant)         | `heading-hero`       |
| `text-4xl sm:text-5xl lg:text-6xl font-bold` (H1 alternate)                       | `heading-hero`       |
| `text-2xl md:text-3xl font-bold` or `text-3xl md:text-4xl font-bold` (section H2) | `heading-section`    |
| `text-3xl font-bold` (subsection)                                                 | `heading-subsection` |
| `text-xl sm:text-2xl font-bold` / `text-2xl font-bold` (card title)               | `heading-card`       |
| `text-lg font-bold` (small card title)                                            | `heading-card-sm`    |
| `text-4xl font-extrabold` / `text-3xl font-extrabold` (stat number)               | `stat-number`        |
| `text-xl leading-relaxed` (hero lede, image-bleed)                                | `text-subtitle`      |
| `text-lg leading-relaxed` / `text-lg` (large body)                                | `text-body-lg`       |
| `text-base leading-relaxed` / `text-base` (body paragraph)                        | `text-body`          |
| `text-sm` (meta, dates, body-small)                                               | `text-body-sm`       |
| `text-sm font-semibold` (small title/label, NO uppercase)                         | `text-label`         |
| `text-sm font-semibold uppercase tracking-widest` (eyebrow)                       | `text-eyebrow`       |
| `text-xs` (badges, breadcrumbs, disclaimers, micro-copy)                          | `text-caption`       |

### Rules

- Semantic utility replaces **only size + weight + text-transform**.
- Colour (`text-white`, `text-surface-muted-foreground`, etc.) — **stays inline**.
- Alignment (`text-center`, `text-right`) — **stays inline**.
- Tracking/letter-spacing — **stays inline** (per Claude's rule; utilities don't mandate tracking).
- Layout (`mb-6`, `max-w-*`, `leading-tight`) — **stays inline** unless the utility class already includes it (e.g. `heading-hero` has `mb-6` — don't double it up).
- `data-slot="..."` attributes — **preserved exactly**. Non-negotiable selector hook for per-site overrides.

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

### Execution — six functional groups (Claude's structure)

For each group:

1. Make the edits.
2. Run `pnpm type-check` and `pnpm lint` — clean.
3. Dev-server visual spot-check the affected sections on BOTH sites.
4. Commit.

**Group 1 — Heroes:** `hero-section.tsx`
Commit: `refactor(composable): migrate hero typography to semantic utilities`

**Group 2 — Content blocks:** `content-section.tsx`, `text-section.tsx`, `why-choose-us-section.tsx`, `cta-section.tsx`, `emergency-banner.tsx`, `faq-section.tsx`, `faq-item.tsx`, `faq-item.client.tsx`
Commit: `refactor(composable): migrate content blocks to semantic utilities`

**Group 3 — Grids and cards:** `service-cards.tsx`, `feature-grid.tsx`, `testimonial-grid.tsx`, `service-list-section.tsx`, `blog-grid.tsx`, `project-grid.tsx`, `category-cards-section.tsx`, `image-grid-section.tsx`
Commit: `refactor(composable): migrate grids and cards to semantic utilities`

**Group 4 — Stats and pricing:** `stats-strip.tsx`, `pricing-table.tsx`, `pricing-packages-section.tsx`, `rate-cards-section.tsx`
Commit: `refactor(composable): migrate stats and pricing to semantic utilities`

**Group 5 — Location/coverage:** `location-pills-section.tsx`, `coverage-map-section.tsx`, `coverage-map-section.client.tsx`, `town-finder-section.tsx`, `town-finder-section.client.tsx`, `county-gateway-cards.tsx`, `local-authority-expertise.tsx`
Commit: `refactor(composable): migrate location and coverage to semantic utilities`

**Group 6 — Contact:** `contact-section.tsx`
Commit: `refactor(composable): migrate contact section to semantic utilities`

### Final verification gate (after Group 6)

1. Scripted residue check — no inline typography sizes remain in composables:

   ```bash
   rg '\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b' \
     packages/core-components/src/components/composable/ \
     | grep -v 'text-center\|text-right\|text-left\|text-white\|text-black\|text-brand\|text-surface\|text-on-'
   ```

   Expected: empty result.

2. `pnpm type-check` at repo root — clean.

3. `pnpm lint` at repo root — clean.

4. `pnpm validate:theme-contract` — no new violations.

5. Both site builds:
   - `pnpm --filter dj-fox-electrical build`
   - `pnpm --filter colossus-scaffolding build`

6. E2E smoke where cheap:
   - `pnpm --filter dj-fox-electrical test:e2e:smoke`
   - `pnpm --filter colossus-scaffolding test:e2e:smoke`

7. Full visual sweep (manual, dev server):
   - Home, services listing, one service detail, locations listing, one location detail, blog listing, one blog post, about, contact — on BOTH sites.
   - Target sizes: H1 60px@lg, body paragraph 16px, hero subheading 16px standard / 20px image-bleed, stat numbers visibly large, eyebrows small-caps.

8. Colossus visual-baseline gate:
   - `pnpm --filter colossus-scaffolding visual:parity` (or whatever script name — verify during execution).
   - EXPECT failure; diff is typography-only (no layout collapse, overflow, clipping).
   - Re-baseline with explicit note: "typography unification canonicalization."
   - Commit: `chore(colossus): rebaseline visual-parity gate post-typography unification`

---

## Phase 4 — Documentation

### File

`docs/standards/styling.md`

### Section to add

Add `## Typography` (place near top, after theme-tokens section if present):

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

### PR checklist

When adding or modifying shared components:

- [ ] No inline `text-<size>` classes on text elements.
- [ ] If a new semantic class is needed, define it in EVERY site's `globals.css` in the same PR.
- [ ] `pnpm validate:theme-contract` passes.
```

Cross-link: add one-line mention in `packages/core-components/CLAUDE.md` → "Typography conventions in `docs/standards/styling.md`."

### Verification gate

- Doc renders correctly (markdown preview).
- All classes listed in the doc are defined in both site globals.

### Commit

`docs(styling): document typography convention`

---

## Commit summary (10 commits in total)

| #   | Phase | Message                                                                                              |
| --- | ----- | ---------------------------------------------------------------------------------------------------- |
| 1   | 1     | `fix(typography): restore site globals to canonical scale; add body/label/eyebrow/caption utilities` |
| 2   | 2     | _(skip unless cross-family audit finds something)_                                                   |
| 3   | 3.1   | `refactor(composable): migrate hero typography to semantic utilities`                                |
| 4   | 3.2   | `refactor(composable): migrate content blocks to semantic utilities`                                 |
| 5   | 3.3   | `refactor(composable): migrate grids and cards to semantic utilities`                                |
| 6   | 3.4   | `refactor(composable): migrate stats and pricing to semantic utilities`                              |
| 7   | 3.5   | `refactor(composable): migrate location and coverage to semantic utilities`                          |
| 8   | 3.6   | `refactor(composable): migrate contact section to semantic utilities`                                |
| 9   | 3     | `chore(colossus): rebaseline visual-parity gate post-typography unification`                         |
| 10  | 4     | `docs(styling): document typography convention`                                                      |

All land on `develop`. User runs `/deploy.changes` when ready.

## Risks & mitigations

1. **Visual regression slips past type-check/lint.** → Per-group dev-server spot-check before each Phase 3 commit.
2. **Colossus visual-parity gate fails.** → Expected. Re-baseline in Commit 9 after human-reviewed diff.
3. **Theme contract rejection.** → Run `pnpm validate:theme-contract` after Phase 1 to confirm new class names are safe.
4. **Missed `text-*` occurrence during migration.** → Residue-check grep at end of Phase 3 (empty result is the success signal).
5. **Classname collision with existing Tailwind utilities.** → Pre-flight grep in Phase 1 preconditions.
6. **Test-file class-name assertions break.** → Pre-flight grep in Phase 3 preconditions; update assertions alongside component edits if any found.
7. **Over-aggressive replacement of colour/layout classes.** → Mapping convention explicitly scopes to size+weight+transform; grep command excludes colour/layout.
8. **`tracking-*` modifiers ambiguity.** → Rule: stays inline. Utilities don't mandate letter-spacing.

## Rollback plan

- **Visual regression appears after Phase 3:** Revert the Phase 3 commits (single `git revert` of the range, or commit-by-commit if targeted). Keep Phase 1 and Phase 4. Sites look correct for MDX + `ui/*` content; composable sections remain at scaled-down state until re-attempted.
- **Visual-baseline rebaseline (commit 9) turns out wrong:** Revert only commit 9. Regenerate baseline after fixes.
- **Phase 1 causes build break (e.g. `@apply`-unknown class):** Should be caught by verification gate before commit. If it somehow lands: revert commit 1; no other phases are blocked from retry after fix.

## Files created or modified

**Phase 1:**

- `sites/dj-fox-electrical/app/globals.css`
- `sites/colossus-scaffolding/app/globals.css`

**Phase 3:**

- 29 files in `packages/core-components/src/components/composable/*.tsx`
- `sites/colossus-scaffolding/tests/visual-baseline/` (rebaseline artefacts)

**Phase 4:**

- `docs/standards/styling.md`
- `packages/core-components/CLAUDE.md` (one-line cross-link)

## End state

- 29 composable components use only semantic typography utilities.
- Both sites define 13 typography classes in `globals.css` at canonical sizes.
- `docs/standards/styling.md` documents the convention.
- Visual state: home-page H1 60px@lg, body 16px, hero subheading 16/20px.
- Changing any site's typography is one `@apply`-line edit in that site's globals.css. Zero shared-component edits.
