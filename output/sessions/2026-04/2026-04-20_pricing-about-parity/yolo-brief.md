# YOLO Implementation Brief: Align /pricing and /about pages with Production

**Branch:** feature/pricing-about-parity (created from develop)
**Session spec:** output/sessions/2026-04/2026-04-20_pricing-about-parity/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

`sites/dj-fox-electrical-test/` (localhost:3001) is the composition-system migration of the live production site `sites/dj-fox-electrical/` (djfoxelectrical.com). The `/pricing` and `/about` pages on the dev site are missing several sections that exist in production. The task is to add those missing sections — using the composition-system architecture (composition.json + composable components + page-data.ts) — so dev matches production in content, look, feel, and interactions.

**User amendment:** The hero background on both pages uses `"background": "inverse"` (navy/dark) and should stay that way — production uses light/white but the user is happy to keep the navy background on the dev site. Do not change hero layout or background.

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
git checkout -b feature/pricing-about-parity   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Read and understand current state

**Goal:** Read all files that will be modified before touching anything. Establish ground truth.
**Model:** haiku — read-only

Read in parallel:

- `packages/core-components/src/components/composable/pricing-table.tsx`
- `packages/core-components/src/components/composable/faq-item.tsx`
- `packages/core-components/src/components/composable/faq-section.tsx`
- `packages/core-components/src/components/composable/content-section.tsx`
- `packages/core-components/src/components/composable/feature-grid.tsx`
- `packages/core-components/src/components/composable/index.ts`
- `packages/component-composition/src/component-registry.ts`
- `sites/dj-fox-electrical-test/composition.json`
- `sites/dj-fox-electrical-test/lib/page-data.ts`

No commit for this phase.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

---

## Phase 2: Create EmergencyBanner composable component

**Goal:** Create `packages/core-components/src/components/composable/emergency-banner.tsx` — the black "24/7 Emergency Callout" banner that appears at the top of the pricing page immediately below the hero.
**Model:** sonnet

### Component spec

**File:** `packages/core-components/src/components/composable/emergency-banner.tsx`

Props interface:

```ts
interface EmergencyBannerData {
  heading: string; // "24/7 Emergency Callout"
  points: { icon: string; label: string }[]; // up to 3 items
  description: string;
  ctaText: string;
  ctaHref: string;
}

interface EmergencyBannerSlots {
  showHeading?: boolean; // default true
  showPoints?: boolean; // default true
  showDescription?: boolean; // default true
  showCta?: boolean; // default true
}

interface EmergencyBannerLayout {
  background?: "inverse"; // default "inverse" (black bg, white text)
}
```

Visual implementation — match production `sites/dj-fox-electrical/app/pricing/page.tsx` lines 106-147 exactly:

```tsx
"use server"; // Server Component — no "use client"

import { Phone, AlertCircle, Clock, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Map point icons to Lucide components by position or keyword
// icon "⏰" or index 0 → Clock
// icon "⚡" or index 1 → Zap
// icon "✅" or index 2 → CheckCircle2
// Fallback → CheckCircle2
```

Layout:

- Section: `bg-black text-white py-12`
- Inner: `container-standard` → `max-w-4xl mx-auto`
- Flex row: icon circle left + content right
- Icon circle: `w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center` containing `AlertCircle w-8 h-8 text-white`
- Heading: `text-3xl font-bold mb-3`
- Points grid: `grid md:grid-cols-3 gap-4 mb-6`, each: `flex items-center gap-2`, icon `w-5 h-5 text-brand-primary flex-shrink-0`, label `text-sm`
- Description: `text-surface-muted-foreground mb-4`
- CTA button: `inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primaryHover transition-colors` with `Phone w-5 h-5` icon

Export the component as a named export: `export function EmergencyBanner(...)`

After creating the file:

1. Add named export to `packages/core-components/src/components/composable/index.ts`:

   ```ts
   export { EmergencyBanner } from "./emergency-banner";
   ```

2. Register in `packages/component-composition/src/component-registry.ts`:
   ```ts
   EmergencyBanner: dynamic(() =>
     import("@platform/core-components/composable").then((m) => ({ default: m.EmergencyBanner }))
   ),
   ```
   (Match the existing pattern in the registry file exactly.)

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add packages/core-components/src/components/composable/emergency-banner.tsx \
        packages/core-components/src/components/composable/index.ts \
        packages/component-composition/src/component-registry.ts
git commit -m "$(cat <<'EOF'
feat(composable): add EmergencyBanner section component

Adds a new composable section for the black 24/7 emergency callout banner,
matching the production pricing page design — icon circle, 3-point grid, phone CTA.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Create RateCardsSection composable component

**Goal:** Create `packages/core-components/src/components/composable/rate-cards-section.tsx` — the 3-card "Hourly Rates" section with a featured (scaled, red-background) centre card.
**Model:** sonnet

### Component spec

**File:** `packages/core-components/src/components/composable/rate-cards-section.tsx`

Props interface:

```ts
interface RateCard {
  icon: string; // emoji or icon hint: "⏰" → Clock, "🚨" → AlertCircle, "🛡️" → Shield
  title: string;
  price: string; // "£45-65"
  unit: string; // "per hour"
  description: string;
  featured?: boolean; // default false — featured card gets brand primary bg + scale
}

interface RateCardsSectionData {
  heading?: string; // "Hourly Rates"
  cards: RateCard[];
}

interface RateCardsSectionSlots {
  showHeading?: boolean; // default true
}

interface RateCardsSectionLayout {
  background?: string; // default "" (white/standard)
}
```

Icon mapping (server component — no dynamic import):

- icon contains "⏰" or title contains "Standard" → `<Clock />`
- icon contains "🚨" or title contains "Emergency" → `<AlertCircle />`
- icon contains "🛡️" or title contains "Commercial" → `<Shield />`
- fallback → `<Zap />`

Layout — match production `sites/dj-fox-electrical/app/pricing/page.tsx` lines 149-202:

- Section: `section-standard`
- Container: `container-standard` → `max-w-4xl mx-auto`
- Optional heading: `text-3xl font-bold text-surface-foreground mb-8 text-center`
- Grid: `grid md:grid-cols-3 gap-6`

Non-featured card:

```
bg-surface-subtle rounded-lg p-6 border-2 border-surface-border
  icon: w-12 h-12 text-brand-primary mx-auto mb-4
  title: text-xl font-bold text-surface-foreground mb-2 text-center
  price: text-3xl font-bold text-brand-primary mb-2 text-center
  unit: text-sm text-surface-muted-foreground text-center
  description: text-sm text-surface-muted-foreground mt-4 text-center
```

Featured card (featured === true):

```
bg-brand-primary text-white rounded-lg p-6 border-4 border-brand-primary shadow-xl transform md:scale-105
  icon: w-12 h-12 text-white mx-auto mb-4
  title: text-xl font-bold mb-2 text-center
  price: text-3xl font-bold mb-2 text-center
  unit: text-sm text-white/90 text-center
  description: text-sm text-white/90 mt-4 text-center
```

Named export: `export function RateCardsSection(...)`

After creating:

1. Add to `packages/core-components/src/components/composable/index.ts`
2. Register in `packages/component-composition/src/component-registry.ts`

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add packages/core-components/src/components/composable/rate-cards-section.tsx \
        packages/core-components/src/components/composable/index.ts \
        packages/component-composition/src/component-registry.ts
git commit -m "$(cat <<'EOF'
feat(composable): add RateCardsSection component

3-card hourly rates grid with featured centre card (brand primary bg, scaled),
matching production pricing page design.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Extend PricingTable and wire FAQItem accordion

**Goal:** (a) Add `description` field to PricingTable item cards. (b) Confirm or add client-side accordion to FAQItem.
**Model:** sonnet

### 4a: PricingTable description field

**File:** `packages/core-components/src/components/composable/pricing-table.tsx`

In the item data interface, add `description?: string`.

In the card render, after the `priceRange` span, add:

```tsx
{
  item.description && (
    <p className="text-sm text-surface-muted-foreground mt-2">{item.description}</p>
  );
}
```

### 4b: FAQItem accordion interaction

**File:** `packages/core-components/src/components/composable/faq-item.tsx`

Read the current implementation. If it is already a `"use client"` component with expand/collapse toggle and ChevronDown animation, leave it untouched.

If it is a static server component with no toggle:

- Add `"use client"` directive at top
- Add `useState` for `isOpen` (default false)
- Wrap the answer in a conditional render or `hidden` class
- Add `ChevronDown` from lucide-react with `transition-transform duration-200` and `rotate-180` when open
- Button/trigger: the question heading becomes a `<button>` with `onClick={() => setIsOpen(!isOpen)}`
- Match production `sites/dj-fox-electrical/app/pricing/pricing-page.client.tsx` interaction pattern

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add packages/core-components/src/components/composable/pricing-table.tsx \
        packages/core-components/src/components/composable/faq-item.tsx
git commit -m "$(cat <<'EOF'
feat(composable): add description to PricingTable items; add accordion to FAQItem

PricingTable now renders optional description below price range.
FAQItem now has client-side expand/collapse with ChevronDown animation.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Update composition.json and page-data.ts for /pricing

**Goal:** Wire all new + existing components into the pricing page sections and supply the correct data.
**Model:** sonnet

### 5a: Update composition.json — pricing sections

Replace the existing `"pageType": "pricing"` sections array with:

```json
{
  "pageType": "pricing",
  "sections": [
    {
      "component": "HeroSection",
      "dataKey": "pricing.hero",
      "slots": { "showHeroImage": false, "showBreadcrumbs": true },
      "layout": { "background": "inverse" }
    },
    {
      "component": "EmergencyBanner",
      "dataKey": "pricing.emergencyBanner"
    },
    {
      "component": "RateCardsSection",
      "dataKey": "pricing.rateCards"
    },
    {
      "component": "PricingTable",
      "dataKey": "pricing.jobCosts",
      "slots": { "showDisclaimer": true },
      "layout": { "columns": 4, "background": "subtle" }
    },
    {
      "component": "ContentSection",
      "dataKey": "pricing.checklist",
      "slots": { "showImage": true, "showList": true, "showCta": false, "showSubheading": false },
      "layout": { "align": "split" }
    },
    {
      "component": "FeatureGrid",
      "dataKey": "pricing.benefits",
      "layout": { "columns": 3, "background": "subtle" }
    },
    {
      "component": "FAQSection",
      "dataKey": "pricing.faqs",
      "slots": { "showPhonePrompt": true }
    },
    {
      "component": "CTASection",
      "dataKey": "pricing.cta",
      "layout": { "background": "brand" }
    }
  ]
}
```

Note: CTASection now uses `pricing.cta` (not `home.cta`) so the CTA text is pricing-specific ("Get Your Free Quote Today").

### 5b: Update page-data.ts — pricing.jobCosts items

In `sites/dj-fox-electrical-test/lib/page-data.ts`, add `description` to each item in `pricing.jobCosts.items[]`. Copy descriptions verbatim from production `sites/dj-fox-electrical/app/pricing/page.tsx` lines 35-83:

```ts
items: [
  { label: "Consumer Unit Upgrade", priceRange: "£400-800", icon: "🛡️", description: "Replace old fuse box with modern RCD protection" },
  { label: "Full House Rewire (3-bed)", priceRange: "£3,500-6,000", icon: "⚡", description: "Complete electrical rewiring to current standards" },
  { label: "EICR Certificate", priceRange: "£150-350", icon: "✅", description: "Electrical Installation Condition Report" },
  { label: "EV Charger Installation", priceRange: "£800-1,200", icon: "🔌", description: "Home electric vehicle charging point" },
  { label: "Additional Sockets", priceRange: "£80-150 each", icon: "🔌", description: "New power outlets in convenient locations" },
  { label: "LED Lighting Upgrade", priceRange: "£200-500 per room", icon: "💡", description: "Energy-efficient LED lighting installation" },
  { label: "Smart Home Wiring", priceRange: "£500-2,000", icon: "🏠", description: "Future-proof structured cabling and automation" },
  { label: "Solar Panel Installation", priceRange: "£4,000-8,000", icon: "☀️", description: "Complete solar PV system design and installation" },
],
```

### 5c: Verify pricing.checklist data

Check that `pricing.checklist` in `page-data.ts` has an `imageSrc` field (not `image`). The ContentSection component expects `data.imageSrc`. If page-data.ts uses `image`, rename it to `imageSrc`.

Current page-data.ts has `image: "djfoxelectrical/sections/electrical-inspection.jpg"` — rename to `imageSrc`.

Also check ContentSection's `data` interface for the `listItems` field name — if it's `items` or `list`, match it.

### 5d: Verify pricing.emergencyBanner and pricing.rateCards field names

`pricing.emergencyBanner` data already exists in page-data.ts. Verify the field names match EmergencyBanner's `data` interface:

- `heading` ✅
- `points[].icon` ✅
- `points[].label` ✅
- `description` ✅
- `ctaText` ✅
- `ctaHref` ✅

`pricing.rateCards` data already exists. Verify against RateCardsSection's `data` interface:

- The top-level shape is an array (not an object with `.cards` sub-key). Check page-data.ts — if it's a bare array, update RateCardsSection to accept either shape, or wrap the array in a `{ heading: "Hourly Rates", cards: [...] }` object in page-data.ts.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add sites/dj-fox-electrical-test/composition.json \
        sites/dj-fox-electrical-test/lib/page-data.ts
git commit -m "$(cat <<'EOF'
feat(dj-fox-test): wire pricing page sections in composition

Adds EmergencyBanner, RateCardsSection, ContentSection (checklist), and
pricing-specific CTA to composition.json. Adds job cost descriptions to page-data.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Update composition.json and page-data.ts for /about

**Goal:** Reorder about sections to match production structure; add 50/50 image+highlights; add benefits section.
**Model:** sonnet

### 6a: Update composition.json — about sections

Replace the existing `"pageType": "about"` sections array with:

```json
{
  "pageType": "about",
  "sections": [
    {
      "component": "HeroSection",
      "dataKey": "about.hero",
      "slots": { "showHeroImage": false, "showBreadcrumbs": true },
      "layout": { "background": "inverse" }
    },
    {
      "component": "StatsStrip",
      "dataKey": "about.stats",
      "layout": { "background": "inverse" }
    },
    {
      "component": "ContentSection",
      "dataKey": "about.content",
      "slots": { "showImage": true, "showList": true, "showSubheading": true, "showCta": false },
      "layout": { "align": "split" }
    },
    {
      "component": "FeatureGrid",
      "dataKey": "about.values",
      "layout": { "columns": 3 }
    },
    {
      "component": "FeatureGrid",
      "dataKey": "about.benefits",
      "layout": { "columns": 2, "background": "subtle" }
    },
    {
      "component": "CTASection",
      "dataKey": "home.cta",
      "layout": { "background": "inverse" }
    }
  ]
}
```

Key changes from current:

- StatsStrip moved ABOVE ContentSection (matches production order: hero → stats → content)
- ContentSection gains `showImage: true` and `showList: true` slots
- New `FeatureGrid` entry for `about.benefits` (2-col, subtle bg)

### 6b: Update page-data.ts — about.content

Add `imageSrc` and `listItems` to `about.content`:

```ts
content: {
  subheading: "Our Work",
  heading: "What sets us apart",
  body: "We are committed to delivering exceptional electrical service...",
  imageSrc: "djfoxelectrical/hero/about-hero.jpg",
  listItems: [
    "Fully qualified and NICEIC approved electricians",
    "Comprehensive electrical services for all needs",
    "24/7 emergency callout service available",
    "Part P certified and fully insured with £5M cover",
  ],
},
```

### 6c: Add page-data.ts — about.benefits

Add a new `benefits` key inside the `about` object:

```ts
benefits: {
  heading: "Why Choose D J Fox Electrical?",
  features: [
    { icon: "✅", title: "Fully insured and accredited", description: "£5M public liability insurance and full NICEIC accreditation." },
    { icon: "✅", title: "Free quotes and consultations", description: "No-obligation site visits and detailed written quotes." },
    { icon: "✅", title: "Competitive pricing", description: "Transparent rates with no hidden fees or surprise charges." },
    { icon: "✅", title: "Quality workmanship guaranteed", description: "All work certified and backed by a comprehensive guarantee." },
    { icon: "✅", title: "Professional, uniformed team", description: "Courteous, smart, and respectful of your home or business." },
    { icon: "✅", title: "Clear communication throughout", description: "You're kept informed at every stage of the work." },
    { icon: "✅", title: "Flexible scheduling", description: "We work around you, including evenings and weekends where possible." },
    { icon: "✅", title: "Comprehensive aftercare", description: "We're here if you have questions or need follow-up support." },
  ],
},
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit:**

```bash
git add sites/dj-fox-electrical-test/composition.json \
        sites/dj-fox-electrical-test/lib/page-data.ts
git commit -m "$(cat <<'EOF'
feat(dj-fox-test): align about page sections with production

Reorders about sections (stats above content), adds image+checklist split
to ContentSection, and adds benefits FeatureGrid matching OrionAboutPage structure.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: Final verification

**Goal:** Confirm both pages render correctly and type-check is clean.
**Model:** haiku

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

Then from `sites/dj-fox-electrical-test/`:

```bash
npm run build 2>&1 | tail -30
```

Confirm no type errors, no build errors. Check that:

- `EmergencyBanner` and `RateCardsSection` are exported from the composable index
- Both are registered in the component registry
- composition.json is valid JSON (use `node -e "require('./sites/dj-fox-electrical-test/composition.json')"`)

**Final commit if any minor fixes needed — otherwise no commit for this phase.**

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase     | Items                                                                                                                                                                           | File overlap      | Model | Rationale                        |
| ----- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----- | -------------------------------- |
| G1    | Phase 1   | Read `pricing-table.tsx`, `faq-item.tsx`, `faq-section.tsx`, `content-section.tsx`, `feature-grid.tsx`, `index.ts`, `component-registry.ts`, `composition.json`, `page-data.ts` | none (reads only) | n/a   | All reads — batch in one message |
| G2    | Phase 5+6 | Phases 5 and 6 both edit `composition.json` and `page-data.ts` — they share files                                                                                               | shared files      | —     | Must serialise (phases 5 then 6) |

### Cross-phase groups (only if phases are truly independent)

| Group  | Phases | Items | Rationale                                                                                                                                                            |
| ------ | ------ | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (none) |        |       | Phase 2 (EmergencyBanner) and Phase 3 (RateCardsSection) create independent files but both write to the same `index.ts` and `component-registry.ts` — serialise them |

### Sequential points — MUST NOT parallelise

| Item                                                                   | Reason                                                                 |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Verification gates (`pnpm type-check`, `npm run build`) between phases | Each phase's output gates the next                                     |
| Git commits                                                            | One commit per phase, in order                                         |
| Phase 5 and Phase 6                                                    | Both edit `composition.json` and `page-data.ts` — must run in sequence |
| Phase 2 and Phase 3                                                    | Both write to `index.ts` and `component-registry.ts`                   |

---

## Cost Estimate

| Phase                                           | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ----------------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Read files                             | haiku  | ~20k              | ~0                 | ~$0.005    |
| Phase 2: EmergencyBanner                        | sonnet | ~15k              | ~2k                | ~$0.075    |
| Phase 3: RateCardsSection                       | sonnet | ~10k              | ~2k                | ~$0.060    |
| Phase 4: PricingTable + FAQItem                 | sonnet | ~12k              | ~1.5k              | ~$0.058    |
| Phase 5: composition.json + page-data (pricing) | sonnet | ~25k              | ~2k                | ~$0.105    |
| Phase 6: composition.json + page-data (about)   | sonnet | ~15k              | ~1.5k              | ~$0.058    |
| Phase 7: Verification                           | haiku  | ~5k               | ~0.5k              | ~$0.002    |
| **Total**                                       |        | **~102k**         | **~9.5k**          | **~$0.36** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check && npm run build` passes in the test site
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    | [total]           |                    | $X.XX     |
   | haiku     | [if used]         |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

   Compare to the pre-flight Cost Estimate above.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-20_pricing-about-parity/yolo-brief.md`:

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
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.** The groups block is the authoritative execution plan.
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)
- **ContentSection field name check is critical:** Before writing data, confirm whether ContentSection uses `imageSrc` or `image` for the image field, and `listItems` or `items` or `list` for the checklist field. Read the component first (Phase 1) and match exactly.

## Completed

**Date:** 2026-04-20
**Status:** All phases executed successfully

Created two new composable section components (`EmergencyBanner`, `RateCardsSection`) and registered them across `types.ts`, `registry.ts`, `schemas.ts`, and the composable `index.ts`. Extended `PricingTable` with an optional `description` field per item. Confirmed FAQItem already had accordion — left untouched. Updated `composition.json` to add 4 new sections to /pricing (EmergencyBanner, RateCardsSection, ContentSection checklist, pricing-specific CTA) and restructured /about sections (stats above content, split ContentSection, new benefits FeatureGrid). Updated `page-data.ts` with job cost descriptions, wrapped `rateCards` bare array into an object, renamed `pricing.checklist.items` → `listItems` to match ContentSection's expected field, added `image` field to `about.content`, and added `about.benefits`. Notable deviation from brief: ContentSection uses `data.image` (not `data.imageSrc`) — corrected the brief's field-rename instruction based on reading the component.

### Commits

- `ddfe06b` feat(composable): add EmergencyBanner and RateCardsSection section components
- `d49a2e7` feat(composable): add description to PricingTable items; FAQItem accordion unchanged
- `1bdc0b2` feat(dj-fox-test): wire pricing page sections in composition
- `7b6aae7` feat(dj-fox-test): align about page sections with production
