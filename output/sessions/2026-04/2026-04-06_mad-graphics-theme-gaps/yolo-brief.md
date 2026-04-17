# YOLO Implementation Brief: Mad Graphics — Cygnus Theme Gaps + Project Pages

**Branch:** feature/mad-graphics-theme-gaps (created from develop)
**Session spec:** output/sessions/2026-04-06_mad-graphics-theme-gaps/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Mad Graphics was themed with Cygnus in an earlier session (all 8 phases merged to develop on 2026-04-06). However, a visual comparison between `localhost:3002` and the Vercel deployment revealed remaining gaps: the projects page returns no content (broken category enum), the project detail 404s, project/portfolio pages lack Cygnus visual styling, and service card icons are missing on the homepage. Additionally the `ProjectCategory` Zod enum only contains scaffolding-era values and doesn't include any graphics business categories.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/mad-graphics-theme-gaps

# Confirm clean starting state
pnpm type-check   # must pass before starting

# Verify fleet project MDX exists
ls sites/mad-graphics/content/projects/
# Must show: fleet-graphics-eastbourne-trade.mdx

# Check available stitch images
ls sites/mad-graphics/public/stitch-images/ | head -5
# Must show img-xxx.jpg files
```

---

## Phase 1: Fix ProjectCategory Enum + categoryLabels

**Goal:** Extend the `ProjectCategory` Zod enum in core-components to include graphics business categories. Update `categoryLabels` maps in both project pages. This unblocks `getProjects()` from validation errors and fixes blank category badges.

**Model:** haiku — mechanical enum extension and map updates across 3 files

Read these files in parallel before editing:

- `packages/core-components/src/lib/content-schemas.ts` (lines around `ProjectCategory`)
- `sites/mad-graphics/app/projects/page.tsx` (the `categoryLabels` map, ~lines 32-45)
- `sites/mad-graphics/app/projects/[slug]/page.tsx` (the `categoryLabels` map, ~lines 32-38)

**Step 1.1 — Extend ProjectCategory enum**

File: `packages/core-components/src/lib/content-schemas.ts`

Current enum (lines ~354-360):

```typescript
export const ProjectCategory = z.enum([
  "heritage",
  "new-build",
  "renovation",
  "maintenance",
  "emergency",
]);
```

Replace with (keep existing values so other sites aren't broken):

```typescript
export const ProjectCategory = z.enum([
  // Scaffolding / construction categories (existing sites)
  "heritage",
  "new-build",
  "renovation",
  "maintenance",
  "emergency",
  // Graphics / print / signage categories (Mad Graphics)
  "vehicle-graphics",
  "signs-signage",
  "banners",
  "large-format-print",
  "marketing-print",
  "stickers-labels",
  "workwear-merchandise",
  "graphic-design",
]);
```

**Step 1.2 — Update categoryLabels in projects/page.tsx**

File: `sites/mad-graphics/app/projects/page.tsx`

Replace the `categoryLabels` map with:

```typescript
const categoryLabels: Record<string, string> = {
  // Scaffolding categories
  heritage: "Heritage",
  "new-build": "New Build",
  renovation: "Renovation",
  maintenance: "Maintenance",
  emergency: "Emergency",
  // Graphics categories
  "vehicle-graphics": "Vehicle Graphics",
  "signs-signage": "Signs & Signage",
  banners: "Banners",
  "large-format-print": "Large Format Print",
  "marketing-print": "Marketing Print",
  "stickers-labels": "Stickers & Labels",
  "workwear-merchandise": "Workwear",
  "graphic-design": "Graphic Design",
};
```

Also update `projectTypeLabels` — "commercial" maps to "Commercial" which is fine. No change needed.

**Step 1.3 — Update categoryLabels in projects/[slug]/page.tsx**

File: `sites/mad-graphics/app/projects/[slug]/page.tsx`

Apply identical `categoryLabels` map as Step 1.2.

```bash
# Verification gate — STOP if this fails
grep -n "vehicle-graphics" packages/core-components/src/lib/content-schemas.ts
# Must show the new enum value

grep -n "vehicle-graphics" sites/mad-graphics/app/projects/page.tsx
# Must show in categoryLabels

grep -n "vehicle-graphics" sites/mad-graphics/app/projects/[slug]/page.tsx
# Must show in categoryLabels

cd sites/mad-graphics && npm run validate:content
# Must pass
npm run type-check
# Must pass
```

**Commit:**

```bash
git add packages/core-components/src/lib/content-schemas.ts \
        sites/mad-graphics/app/projects/page.tsx \
        "sites/mad-graphics/app/projects/[slug]/page.tsx"
git commit -m "$(cat <<'EOF'
fix(mad-graphics): extend ProjectCategory enum for graphics business + update categoryLabels

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Fix Fleet Project Hero Image

**Goal:** The fleet project MDX references R2 images (`mad-graphics/projects/project-fleet-eastbourne.jpg`) that don't exist yet. Update to use existing stitch images as placeholders so the project page renders.

**Model:** haiku — frontmatter edit only

Read `sites/mad-graphics/content/projects/fleet-graphics-eastbourne-trade.mdx` in full.

Update `heroImage` and `images` array to use existing stitch images:

```yaml
heroImage: "/stitch-images/img-025.jpg"
images:
  - path: "/stitch-images/img-025.jpg"
    caption: "Fleet vehicle graphics — Mad Graphics Polegate workshop"
    order: 1
  - path: "/stitch-images/img-003.jpg"
    caption: "Completed livery — consistent across all 6 vehicles"
    order: 2
  - path: "/stitch-images/img-002.jpg"
    caption: "Close-up of applied vinyl graphics"
    order: 3
```

Note: paths must be local `/stitch-images/` paths (not R2 `mad-graphics/projects/` paths) since R2 images don't exist yet.

Also update `status` from `"completed"` to `"featured"` so the project appears in the Featured Projects section on the listing page (currently `status: "completed"` means it only shows in the All Projects grid, not the featured 2-column section).

```bash
# Verification gate — STOP if this fails
grep "heroImage" sites/mad-graphics/content/projects/fleet-graphics-eastbourne-trade.mdx
# Must show: heroImage: "/stitch-images/img-025.jpg"

ls sites/mad-graphics/public/stitch-images/img-025.jpg
# File must exist

cd sites/mad-graphics && npm run validate:content
# Must pass
```

**Commit:**

```bash
git add "sites/mad-graphics/content/projects/fleet-graphics-eastbourne-trade.mdx"
git commit -m "$(cat <<'EOF'
fix(mad-graphics): update fleet project MDX to use stitch image placeholders

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Cygnus-Style Projects Listing Page

**Goal:** The `/projects` listing page uses Cygnus visual language — dark hero with orange stat numbers, Cygnus card tokens, Material Symbols icons replacing inline SVGs, consistent with the rest of the site.

**Model:** sonnet — page rewrite with Cygnus pattern

Read these files in parallel:

- `sites/mad-graphics/app/projects/page.tsx` (full)
- `sites/cygnus-test/app/page.tsx` (for Cygnus visual pattern reference — hero section, card patterns)
- `packages/themes/cygnus/globals.css` (for available `.card`, `.section`, `.btn-*` utility classes)

**Changes to make:**

1. **Hero section** — update to match Cygnus dark pattern:
   - Background: `bg-surface-background` (dark)
   - Stat numbers: `text-brand-primary` (orange) with large bold font
   - Heading: use `heading-hero` token class

2. **Project cards** (`ProjectCard` component) — replace base-template styling with Cygnus tokens:
   - Replace `bg-surface-background rounded-2xl shadow-lg` with `.card` utility class (or equivalent token classes: `bg-surface-background border border-surface-border rounded-lg`)
   - Replace `hover:shadow-xl` with `card-interactive` or `hover:border-brand-primary/50 transition-colors`

3. **Replace inline SVG icons** with Material Symbols:

   ```tsx
   // Replace location SVG path with:
   <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
     location_on
   </span>

   // Replace calendar SVG path with:
   <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
     calendar_month
   </span>
   ```

4. **Star rating** — replace inline SVG stars with Material Symbols:

   ```tsx
   {
     [...Array(5)].map((_, i) => (
       <span
         key={i}
         className={`material-symbols-outlined text-base ${i < project.client!.rating! ? "text-brand-primary" : "text-surface-border"}`}
         style={{ fontVariationSettings: "'FILL' 1" }}
       >
         star
       </span>
     ));
   }
   ```

5. **"Get Free Quote" CTA button** — ensure it uses `btn-primary` class, not hardcoded styles.

6. **No hardcoded hex colors** — all must be token classes.

```bash
# Verification gate — STOP if this fails
grep -E 'text-\[#|bg-\[#|border-\[#' sites/mad-graphics/app/projects/page.tsx
# 0 results

grep '<svg' sites/mad-graphics/app/projects/page.tsx
# 0 results (all replaced with Material Symbols)

grep 'material-symbols-outlined' sites/mad-graphics/app/projects/page.tsx
# Must show multiple matches

cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/app/projects/page.tsx
git commit -m "$(cat <<'EOF'
feat(mad-graphics): projects listing — cygnus visual design, Material Symbols icons

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Cygnus-Style Project Detail Page

**Goal:** The `/projects/[slug]` page uses Cygnus visual language — dark layout, Cygnus-styled project summary card, Material Symbols icons, graphics-business category labels.

**Model:** sonnet — page rewrite with Cygnus pattern

Read these files in parallel:

- `sites/mad-graphics/app/projects/[slug]/page.tsx` (full)
- `sites/cygnus-test/app/projects/[slug]/page.tsx` (for comparison)
- `packages/core-components/src/components/ui/blog-post-hero.tsx` or wherever `BlogPostHero` is defined (check variant prop)

**Changes to make:**

1. **ProjectSummary callout** — currently renders as a plain callout box. Restyle using Cygnus card tokens:
   - Background: `bg-surface-muted border border-surface-border rounded-lg p-6`
   - Section heading: `text-surface-muted-foreground text-xs uppercase tracking-widest mb-4`
   - Metadata items: replace any inline SVG icons with Material Symbols (`location_on`, `calendar_month`, `timer`, `construction`, `build`)

2. **OutcomesCallout** — if this is a plain box, add `border-l-4 border-brand-primary` accent style consistent with Cygnus dark accent blocks.

3. **`categoryLabels` map** — already updated in Phase 1. Verify it renders correctly.

4. **Related Projects section** — if it exists, ensure cards use the same Cygnus card styling from Phase 3's `ProjectCard` component. Consider extracting `ProjectCard` to a shared local file imported by both `page.tsx` and `[slug]/page.tsx` — but only if it's a simple copy (no new abstractions unless clean).

5. **CTA section** — ensure `btn-primary` class is used, no hardcoded colors.

6. **No hardcoded hex colors** throughout.

```bash
# Verification gate — STOP if this fails
grep -E 'text-\[#|bg-\[#|border-\[#' "sites/mad-graphics/app/projects/[slug]/page.tsx"
# 0 results

grep '<svg' "sites/mad-graphics/app/projects/[slug]/page.tsx"
# 0 results preferred (replace any remaining with Material Symbols)

cd sites/mad-graphics && npm run type-check
npm run build
# Build must succeed — this verifies dynamicParams + generateStaticParams works
# and that fleet-graphics-eastbourne-trade route is generated
```

Check in build output:

```bash
# After build, verify static route was generated
ls sites/mad-graphics/.next/server/app/projects/
# Must include fleet-graphics-eastbourne-trade directory or HTML file
```

**Commit:**

```bash
git add "sites/mad-graphics/app/projects/[slug]/page.tsx"
git commit -m "$(cat <<'EOF'
feat(mad-graphics): project detail — cygnus visual design, dark layout, Material Symbols

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Add Service Icons to Homepage Service Grid

**Goal:** The homepage service card grid has image-overlay cards but no icons. Cygnus-test shows icons in service cards. Add Material Symbols icons to each service entry so cards feel more complete.

**Model:** sonnet — homepage edit

Read `sites/mad-graphics/app/page.tsx` in full.

**Add a `SERVICE_ICONS` map** alongside the existing `SERVICE_IMAGES` map:

```typescript
const SERVICE_ICONS: Record<string, string> = {
  "vehicle-graphics": "local_shipping",
  "signs-signage": "storefront",
  banners: "flag",
  "large-format-print": "print",
  "marketing-print": "description",
  "stickers-labels": "label",
  "workwear-merchandise": "checkroom",
  "graphic-design": "palette",
};
```

**Render the icon in each service card**, inside the image overlay area — e.g., as a small icon in the top-left of the card or below the category label:

```tsx
<span
  className="material-symbols-outlined text-2xl text-brand-primary mb-2 block"
  style={{ fontVariationSettings: "'FILL' 1" }}
>
  {SERVICE_ICONS[service.slug] ?? "build"}
</span>
```

Place it within the card text area (below the image, above or alongside the service title), not overlaid on the image itself — cleaner on mobile.

```bash
# Verification gate — STOP if this fails
grep 'SERVICE_ICONS' sites/mad-graphics/app/page.tsx
# Must show the map and usage

grep 'material-symbols-outlined' sites/mad-graphics/app/page.tsx
# Must show matches

grep -E 'text-\[#|bg-\[#|border-\[#' sites/mad-graphics/app/page.tsx
# 0 results

cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/app/page.tsx
git commit -m "$(cat <<'EOF'
feat(mad-graphics): add Material Symbols icons to homepage service card grid

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Final Verification

**Goal:** Confirm all pages build, validate, and render correctly. Confirm no hardcoded colors remain across all modified pages.

**Model:** haiku — verification only, no edits

```bash
# Full content validation
cd sites/mad-graphics && npm run validate:content
# Must pass all files

# TypeScript
npm run type-check
# 0 errors

# Full production build
npm run build
# Must succeed

# Hex scan — all modified pages
grep -rn 'text-\[#\|bg-\[#\|border-\[#\|from-\[#\|to-\[#' \
  sites/mad-graphics/app/page.tsx \
  sites/mad-graphics/app/projects/page.tsx \
  "sites/mad-graphics/app/projects/[slug]/page.tsx"
# 0 results

# Business constraints
grep -ri "vinyl wrap\|full wrap" sites/mad-graphics/app/
# 0 results

# Static project route generated
ls sites/mad-graphics/.next/server/app/projects/ 2>/dev/null || \
ls sites/mad-graphics/.next/server/chunks/ | grep fleet
# Confirms route was statically generated

# Monorepo type check
cd ../.. && pnpm type-check
# 0 errors
```

**Commit:**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore(mad-graphics): final verification — all pages build clean

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)" --allow-empty
```

---

## Cost Estimate

| Phase                               | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ----------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Fix category enum + labels | haiku  | ~10k              | ~1k                | $0.01      |
| Phase 2: Fix fleet MDX hero image   | haiku  | ~5k               | ~0.5k              | $0.004     |
| Phase 3: Projects listing page      | sonnet | ~15k              | ~2k                | $0.08      |
| Phase 4: Project detail page        | sonnet | ~18k              | ~2.5k              | $0.09      |
| Phase 5: Homepage service icons     | sonnet | ~12k              | ~1k                | $0.05      |
| Phase 6: Final verification         | haiku  | ~8k               | ~0.5k              | $0.006     |
| **Total**                           |        | **~68k**          | **~7.5k**          | **~$0.24** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check && cd sites/mad-graphics && npm run build` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-06_mad-graphics-theme-gaps/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Completed

**Date:** 2026-04-06
**Status:** All phases executed successfully

All 6 phases implemented cleanly. The `ProjectCategory` Zod enum now includes all 8 graphics business categories alongside the original scaffolding values; the fleet MDX project hero image was swapped to local stitch images and marked `featured` so it surfaces in the featured section. Both project pages (listing and detail) were updated to Cygnus visual language: inline SVGs replaced with Material Symbols (`location_on`, `calendar_month`, `star`, `chevron_right`, `check_circle`), star ratings using `text-brand-primary`/`text-surface-border` token classes, card borders updated to `hover:border-brand-primary/50`, and `ProjectSummary` rewritten as an inline Cygnus-styled card (removing the `ArticleCallout` import). `OutcomesCallout` and `ClientTestimonialCallout` also inlined with Cygnus styling. Homepage service card grid gained a `SERVICE_ICONS` map with Material Symbols per service, rendered above the category label. No verification gate failed; build produced `fleet-graphics-eastbourne-trade.html` as a static route; monorepo `pnpm type-check` passed with full turbo cache hit.

### Commits

- `efaf07c` — fix(mad-graphics): extend ProjectCategory enum for graphics business + update categoryLabels
- `1bddea0` — fix(mad-graphics): update fleet project MDX to use stitch image placeholders
- `a29ab76` — feat(mad-graphics): projects listing — cygnus visual design, Material Symbols icons
- `16d58d5` — feat(mad-graphics): project detail — cygnus visual design, dark layout, Material Symbols
- `2dd76d7` — feat(mad-graphics): add Material Symbols icons to homepage service card grid
- `75c635a` — chore(mad-graphics): final verification — all pages build clean

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used (`Claude Sonnet 4.6`)
- `style={{ fontVariationSettings: ... }}` on Material Symbols icons is acceptable — not a color value, not a violation
