# YOLO Implementation Brief: Dev Site Card/Link Parity with Production

**Branch:** feature/dev-site-card-link-parity (created from develop)
**Session spec:** output/sessions/2026-04/2026-04-20_dev-site-card-link-parity/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

`sites/dj-fox-electrical-test/` (localhost:3001) is the composition-system migration of the production site (`sites/dj-fox-electrical/` → djfoxelectrical.com). Services listing cards are only partially clickable (just the "Learn more →" text), and locations listing cards are not clickable at all. Production wraps every card in a `<Link>` making the entire card interactive. The fix touches two shared composable components and the site's page-data file.

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
git checkout -b feature/dev-site-card-link-parity
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Fix `ServiceCards` — full-card clickability

**Goal:** Replace the `<div>` card wrapper in `ServiceCards` with a Next.js `<Link>` when `service.href` is present. Remove the nested `<a>` CTA element (the whole card is the link). Keep "Learn more →" as non-interactive decorated text inside the card.
**Model:** sonnet

**File:** `packages/core-components/src/components/composable/service-cards.tsx`

Read the file first, then apply the following changes:

1. Add `import Link from 'next/link';` at the top
2. In the `services.map(...)` block, replace the outer `<div>` card element with conditional rendering:
   - When `service.href` is present: wrap all card content in `<Link href={service.href} ...>` with class `group bg-surface-card rounded-2xl shadow-lg border border-surface-border p-6 transition-shadow duration-200 hover:shadow-xl block`
   - When `service.href` is absent: keep as `<div>` with the same classes (minus `block`)
3. Replace the `{slots.showCta && service.href && <a href={service.href} ...>Learn more →</a>}` element with `{slots.showCta && service.href && <span className="inline-flex items-center text-brand-primary font-medium group-hover:translate-x-1 transition-transform">Learn more <span aria-hidden="true">→</span></span>}` — the `<span>` is decorative text, not a link, since the card itself navigates
4. The `focus-visible` ring classes from the old `<a>` should move to the `<Link>` wrapper

The final card structure for the `href`-present case:

```tsx
<Link
  key={i}
  href={service.href}
  className="group bg-surface-card rounded-2xl shadow-lg border border-surface-border p-6 transition-shadow duration-200 hover:shadow-xl block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:rounded-2xl"
>
  {/* badge, icon, image slots unchanged */}
  <h3 ...>{service.title}</h3>
  {/* description slot unchanged */}
  {slots.showCta && (
    <span className="inline-flex items-center text-brand-primary font-medium group-hover:translate-x-1 transition-transform">
      Learn more <span aria-hidden="true">→</span>
    </span>
  )}
</Link>
```

Note: `showCta` no longer gates on `service.href` since the Link wrapper already requires it. Show the text whenever `slots.showCta` is true (and we're in the `href`-present branch).

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Commit:

```bash
git add packages/core-components/src/components/composable/service-cards.tsx
git commit -m "$(cat <<'EOF'
fix(composable): make ServiceCards full-card clickable via Link wrapper

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Fix `FeatureGrid` — add optional link support

**Goal:** Add `href?: string` to `FeatureItem` in `FeatureGrid`. When `href` is present, wrap the card in `<Link>` with hover state and a "View services →" CTA span. When absent, render a plain `<div>` as today — preserving existing usages on about/pricing pages.
**Model:** sonnet

**File:** `packages/core-components/src/components/composable/feature-grid.tsx`

Read the file first, then apply:

1. Add `import Link from 'next/link';` at the top
2. Add `href?: string` to the `FeatureItem` interface
3. In `features.map(...)`, replace the single `<div>` card with conditional rendering:
   - When `feature.href` is present: use `<Link href={feature.href} ...>` with classes `flex gap-5 p-6 bg-surface-card rounded-2xl border border-surface-card-border group hover:shadow-xl transition-shadow block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:rounded-2xl`
   - When `feature.href` is absent: keep existing `<div className="flex gap-5 p-6 bg-surface-card rounded-2xl border border-surface-card-border">`
4. Inside the card, after the description, add a conditional CTA: `{feature.href && <span className="inline-flex items-center mt-4 text-brand-primary font-medium group-hover:translate-x-1 transition-transform text-sm">View services <span aria-hidden="true">→</span></span>}`

The `group-hover:*` classes on the title/description inside the card will only activate when the card itself is a `<Link>` (i.e. has `href`), so no style regressions on linkless cards.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Commit:

```bash
git add packages/core-components/src/components/composable/feature-grid.tsx
git commit -m "$(cat <<'EOF'
fix(composable): add optional href link support to FeatureGrid cards

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Fix locations data + swap to `ServiceCards` on locations listing

**Goal:** Two changes in one phase (both touch data/config only):

1. Add `href` to the `locations.features` data in `page-data.ts` (fixes `FeatureGrid` linkability)
2. Add a `locationCards` array to the locations data shaped for `ServiceCards`
3. Update `composition.json` to swap `FeatureGrid` → `ServiceCards` on the locations listing page, pointing at the new `locationCards` data

**Model:** sonnet

### 3a. Update `page-data.ts`

**File:** `sites/dj-fox-electrical-test/lib/page-data.ts`

Read the file. Find the `locations:` data block (around line 490–509). Apply two changes:

**Change 1** — add `href` to the existing `features` array (fixes `FeatureGrid` if it's still used elsewhere):

```ts
features: allLocationsFromConfig.map((l) => ({
  title: l.title,
  description: l.description,
  href: `/locations/${l.slug}`,
})),
```

**Change 2** — add a new `locationCards` key alongside `features`, shaped for `ServiceCards`:

```ts
locationCards: allLocationsFromConfig.map((l) => ({
  title: l.title,
  description: l.description,
  href: `/locations/${l.slug}`,
})),
```

Also ensure the locations data object has `heading` and `subheading` keys (ServiceCards reads `data.heading` and `data.subheading`). It already has `heading: "Areas We Serve"` and `intro`. Add `subheading` mirroring `intro` if not present:

```ts
subheading: `${siteConfig.business.name} serves customers across ${siteConfig.serviceAreas.join(", ")}. Find our electrical services in your area.`,
```

The `ServiceCards` component reads:

- `data.heading` → section heading
- `data.subheading` → section subheading
- `data.services` → the cards array

So the `locationCards` array must be accessible as `services` when passed to `ServiceCards`. The composition renderer passes `data[dataKey]` — so we need the data shape to be `{ heading, subheading, services: [...] }`.

**Revised approach for locationCards:** Instead of adding `locationCards` as a separate array, add a `locationCardsSection` object:

```ts
locationCardsSection: {
  heading: "Areas We Serve",
  subheading: `${siteConfig.business.name} serves customers across ${siteConfig.serviceAreas.join(", ")}. Find electrical services in your area.`,
  services: allLocationsFromConfig.map((l) => ({
    title: l.title,
    description: l.description,
    href: `/locations/${l.slug}`,
  })),
},
```

### 3b. Update `composition.json`

**File:** `sites/dj-fox-electrical-test/composition.json`

Read the file. Find the `"pageType": "locations"` page entry. Change the `FeatureGrid` section entry to use `ServiceCards`:

From:

```json
{
  "component": "FeatureGrid",
  "dataKey": "locations",
  "layout": { "columns": 3 }
}
```

To:

```json
{
  "component": "ServiceCards",
  "dataKey": "locations.locationCardsSection",
  "layout": { "columns": 3 }
}
```

The HeroSection, CTASection entries on the locations page remain unchanged.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Verify the composition renderer resolves dot-path `dataKey` values correctly. Check `packages/component-composition/src/render-page.tsx` for `getByPath` usage — this was already fixed (per platform history). The dot-path `"locations.locationCardsSection"` should resolve correctly.

Commit:

```bash
git add sites/dj-fox-electrical-test/lib/page-data.ts sites/dj-fox-electrical-test/composition.json
git commit -m "$(cat <<'EOF'
fix(dj-fox-test): wire location cards as ServiceCards with full-card links

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Full verification

**Goal:** Confirm all changes work together — type-check passes, dev server builds, pages render with clickable cards.
**Model:** sonnet

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Then do a production build of the test site to confirm no build errors:

```bash
cd sites/dj-fox-electrical-test && npm run build 2>&1 | tail -30
```

Spot-check that `FeatureGrid` usages without `href` (about/pricing pages) still work by reading the relevant sections of `page-data.ts`:

- `about.values` features — confirm no `href` field → will still render as `<div>`
- `pricing.benefits` features — confirm no `href` field → will still render as `<div>`

No commits in this phase — verification only.

---

## Parallel execution groups

This section lists work units that can run concurrently.

### Intra-phase groups

| Group | Phase   | Items                                        | File overlap            | Model | Rationale                                                  |
| ----- | ------- | -------------------------------------------- | ----------------------- | ----- | ---------------------------------------------------------- |
| G1    | Phase 1 | Read `service-cards.tsx`                     | none (read only)        | n/a   | Single file read before edit                               |
| G2    | Phase 2 | Read `feature-grid.tsx`                      | none (read only)        | n/a   | Single file read before edit                               |
| G3    | Phase 3 | Read `page-data.ts`, Read `composition.json` | none (reads only)       | n/a   | Independent reads — batch in one message                   |
| G4    | Phase 4 | `pnpm type-check`, `npm run build`           | none (read-only checks) | n/a   | Type-check and build are independent verification commands |

### Cross-phase groups

| Group  | Phases | Items | Rationale                             |
| ------ | ------ | ----- | ------------------------------------- |
| (none) |        |       | All phases have ordering dependencies |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                                             |
| --------------------------------- | ------------------------------------------------------------------ |
| Verification gates between phases | Each phase gates the next                                          |
| Git commits                       | One per phase, in order                                            |
| Phase 3a before Phase 3b          | `composition.json` references the data key added in `page-data.ts` |

---

## Cost Estimate

| Phase                             | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| --------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: ServiceCards link fix    | sonnet | ~6k               | ~1k                | ~$0.03     |
| Phase 2: FeatureGrid link support | sonnet | ~5k               | ~1k                | ~$0.03     |
| Phase 3: page-data + composition  | sonnet | ~8k               | ~1.5k              | ~$0.05     |
| Phase 4: verification             | sonnet | ~4k               | ~0.5k              | ~$0.02     |
| **Total**                         |        | **~23k**          | **~4k**            | **~$0.13** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes and `npm run build` succeeds in `sites/dj-fox-electrical-test`
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-20_dev-site-card-link-parity/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-20
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
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used: `Claude Sonnet 4.6`

## Completed

**Date:** 2026-04-20
**Status:** All phases executed successfully

Three phases implemented without surprises. Phase 1 refactored `ServiceCards` to use a `<Link>` wrapper when `service.href` is present, extracting card content into a shared variable to avoid duplication, and replacing the nested `<a>` CTA with a decorative `<span>`. Phase 2 added `href?: string` to `FeatureItem` in `FeatureGrid` with identical conditional Link/div rendering and a "View services →" CTA span. Phase 3 added `locationCardsSection` data to `page-data.ts` shaped for `ServiceCards`, and swapped the locations listing page in `composition.json` from `FeatureGrid` → `ServiceCards` with `dataKey: "locations.locationCardsSection"`. All verification gates passed; production build of `dj-fox-electrical-test` completed cleanly with all 15 page types rendered. No deviations from the plan.

### Commits

- `71c42ae` fix(composable): make ServiceCards full-card clickable via Link wrapper
- `37332af` fix(composable): add optional href link support to FeatureGrid cards
- `9f2479c` fix(dj-fox-test): wire location cards as ServiceCards with full-card links
