# YOLO Implementation Brief: Fix Missing Hero on Detail Pages

**Branch:** feature/detail-page-hero-fix (created from feature/dev-site-card-link-parity)
**Session spec:** output/sessions/2026-04/2026-04-20_detail-page-hero-fix/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

`ComposableHeroSection` renders on `/services/[slug]` and `/locations/[slug]` in `sites/dj-fox-electrical-test/` but appears visually absent because: (1) no `layout.background` is set so it uses `bg-surface-background` (white, blends into page), (2) no CTA text is provided so buttons don't render, (3) no `layout.align = "split"` for services so the hero image never shows. Three files need changes: `composition.json` (add layout config), and both detail page files (add CTA + trustBadge data to hero objects).

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
git checkout feature/dev-site-card-link-parity
git checkout -b feature/detail-page-hero-fix
pnpm type-check   # must be clean before starting
```

Note: branch from `feature/dev-site-card-link-parity` (not develop) so both fixes are on the same line of work for eventual merge.

---

## Phase 1: Update `composition.json` — add layout config to detail page heroes

**Goal:** Add `layout.background: "subtle"` and `layout.align: "split"` to the `service-detail` HeroSection entry. Add `layout.background: "subtle"` to the `location-detail` HeroSection entry. Enable `showTrustBadges` slot on service-detail.
**Model:** haiku — JSON key additions only

**File:** `sites/dj-fox-electrical-test/composition.json`

Read the file first. Find the `"pageType": "service-detail"` page entry. The HeroSection section currently reads:

```json
{
  "component": "HeroSection",
  "dataKey": "hero",
  "slots": { "showHeroImage": true, "showBreadcrumbs": true }
}
```

Change it to:

```json
{
  "component": "HeroSection",
  "dataKey": "hero",
  "slots": { "showHeroImage": true, "showBreadcrumbs": true, "showTrustBadges": true },
  "layout": { "background": "subtle", "align": "split" }
}
```

Find the `"pageType": "location-detail"` page entry. The HeroSection section currently reads:

```json
{
  "component": "HeroSection",
  "dataKey": "hero",
  "slots": { "showHeroImage": false, "showBreadcrumbs": true }
}
```

Change it to:

```json
{
  "component": "HeroSection",
  "dataKey": "hero",
  "slots": { "showHeroImage": false, "showBreadcrumbs": true },
  "layout": { "background": "subtle" }
}
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Commit:

```bash
git add sites/dj-fox-electrical-test/composition.json
git commit -m "$(cat <<'EOF'
fix(dj-fox-test): add layout background and split align to detail page heroes

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Add CTA and trust badge data to service detail hero

**Goal:** Add `primaryCtaText`, `primaryCtaHref`, `secondaryCtaText`, `secondaryCtaHref`, and `trustBadges` to the `hero` object in the service detail page.
**Model:** sonnet

**File:** `sites/dj-fox-electrical-test/app/services/[slug]/page.tsx`

Read the file first. Find the `hero:` object inside `renderComposedPage` data (around line 146). It currently reads:

```ts
hero: {
  heading: fm.title,
  subheading: fm.description || `Professional ${fm.title.toLowerCase()} services by ${siteConfig.business.name}.`,
  eyebrow: "Our Services",
  image: heroImage,
  heroImageSrc: heroImage,
  breadcrumbs: [...]
},
```

Add CTA and trust badge fields — the final hero object should be:

```ts
hero: {
  heading: fm.title,
  subheading:
    fm.description ||
    `Professional ${fm.title.toLowerCase()} services by ${siteConfig.business.name}.`,
  eyebrow: "Our Services",
  image: heroImage,
  heroImageSrc: heroImage,
  primaryCtaText: "Get Free Quote",
  primaryCtaHref: "/contact",
  secondaryCtaText: `Call ${PHONE_DISPLAY}`,
  secondaryCtaHref: `tel:${siteConfig.business.phone}`,
  trustBadges: ["NICEIC Approved", "Fully Insured", "Free Quotes"],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: serviceName, href: `/services/${slug}` },
  ],
},
```

`PHONE_DISPLAY` is already imported at the top of the file. `siteConfig` is already imported.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Commit:

```bash
git add sites/dj-fox-electrical-test/app/services/[slug]/page.tsx
git commit -m "$(cat <<'EOF'
fix(dj-fox-test): add CTA buttons and trust badges to service detail hero

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Add CTA and trust badge data to location detail hero

**Goal:** Add `primaryCtaText`, `primaryCtaHref`, `secondaryCtaText`, `secondaryCtaHref`, and `trustBadges` to the `hero` object in the location detail page.
**Model:** sonnet

**File:** `sites/dj-fox-electrical-test/app/locations/[slug]/page.tsx`

Read the file first. Find the `hero:` object inside `renderComposedPage` data (around line 139). It currently reads:

```ts
hero: {
  heading: `Electricians in ${locationName}`,
  subheading: (fm as ...).description || `Professional electrical services...`,
  eyebrow: locationName,
  image: heroImage,
  heroImageSrc: heroImage,
  trustBadges: (fm.hero as ...)?.trustBadges,
  breadcrumbs: [...]
},
```

Replace the entire hero object with:

```ts
hero: {
  heading: `Electricians in ${locationName}`,
  subheading:
    (fm as unknown as Record<string, string | undefined>).description ||
    `Professional electrical services in ${locationName} by ${siteConfig.business.name}.`,
  eyebrow: locationName,
  heroImageSrc: heroImage,
  primaryCtaText: "Get Free Quote",
  primaryCtaHref: "/contact",
  secondaryCtaText: `Call ${PHONE_DISPLAY}`,
  secondaryCtaHref: `tel:${siteConfig.business.phone}`,
  trustBadges: ["NICEIC Approved", "Fully Insured", "Free Quotes"],
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: locationName, href: `/locations/${slug}` },
  ],
},
```

`PHONE_DISPLAY` is already imported. `siteConfig` is already imported.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Commit:

```bash
git add "sites/dj-fox-electrical-test/app/locations/[slug]/page.tsx"
git commit -m "$(cat <<'EOF'
fix(dj-fox-test): add CTA buttons and trust badges to location detail hero

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase       | Items                                                             | File overlap      | Model | Rationale                                |
| ----- | ----------- | ----------------------------------------------------------------- | ----------------- | ----- | ---------------------------------------- |
| G1    | Phase 2 + 3 | Read `services/[slug]/page.tsx`, Read `locations/[slug]/page.tsx` | none (reads only) | n/a   | Independent reads — batch in one message |

### Cross-phase groups

Phases 2 and 3 edit different files with no shared dependency. However, both depend on Phase 1 (composition.json) being committed first for coherence. They MAY be run as parallel Task agents after Phase 1 commits.

| Group | Phases      | Items                                                                               | Rationale                                                       |
| ----- | ----------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| G2    | Phase 2 + 3 | Edit `services/[slug]/page.tsx` (sonnet), Edit `locations/[slug]/page.tsx` (sonnet) | No file overlap — can run as parallel Task agents after Phase 1 |

### Sequential points — MUST NOT parallelise

| Item                            | Reason                                                      |
| ------------------------------- | ----------------------------------------------------------- |
| Phase 1 must complete before G2 | composition.json changes set context for the data additions |
| Git commits within each phase   | One per phase, in order                                     |

---

## Cost Estimate

| Phase                            | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: composition.json layout | haiku  | ~4k               | ~0.5k              | ~$0.002    |
| Phase 2: service hero CTAs       | sonnet | ~5k               | ~0.5k              | ~$0.02     |
| Phase 3: location hero CTAs      | sonnet | ~5k               | ~0.5k              | ~$0.02     |
| **Total**                        |        | **~14k**          | **~1.5k**          | **~$0.05** |

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
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-20_detail-page-hero-fix/yolo-brief.md`:

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
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits
- The Co-Authored-By line in commits must reflect the orchestrator model: `Claude Sonnet 4.6`

## Completed

**Date:** 2026-04-20
**Status:** All phases executed successfully

Three phases implemented without surprises. Phase 1 added `layout.background: "subtle"` and `layout.align: "split"` to the `service-detail` HeroSection in `composition.json`, with `showTrustBadges: true` slot, and `layout.background: "subtle"` to the `location-detail` HeroSection. Phase 2 added `primaryCtaText/Href`, `secondaryCtaText/Href`, and `trustBadges: ["NICEIC Approved", "Fully Insured", "Free Quotes"]` to the service detail hero data object. Phase 3 replaced the location detail hero with the same CTA/trust badge fields, removing the old `image` key (replaced by `heroImageSrc`) and dropping the dynamic `trustBadges` lookup from frontmatter in favour of hardcoded defaults. All type-checks passed; no deviations from the plan.

### Commits

- `d194b9c` fix(dj-fox-test): add layout background and split align to detail page heroes
- `605c504` fix(dj-fox-test): add CTA buttons and trust badges to service detail hero
- `6a45f89` fix(dj-fox-test): add CTA buttons and trust badges to location detail hero
