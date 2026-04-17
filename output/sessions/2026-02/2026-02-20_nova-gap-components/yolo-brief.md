# YOLO Implementation Brief: Nova Gap Components (Cross-Theme)

**Branch:** develop
**Session spec:** output/sessions/2026-02-20_nova-gap-components/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error

---

## Context

The reference-analysis pipeline identified 3 gap components from the ColorCode Events screenshot that don't exist in `packages/core-components/`. These are **platform-level components** — they go into `core-components` and must work across ALL themes (orion, vega, nova) via theme tokens. No hardcoded colors.

Gap component briefs are in `packages/themes/nova/README.md`. The cross-theme propagation checklist is in `packages/core-components/CLAUDE.md`.

---

## Pre-flight

```bash
# Verification gate — STOP if this fails
git checkout develop && git pull
pnpm type-check 2>&1 | grep -c "error TS" | xargs -I{} test {} -le 5
# (pre-existing type errors from dev deps are expected — we only care about new ones)
```

Record the baseline error count from `pnpm type-check`. All phases must not increase it.

---

## Phase 1 — EventDetailsBand

**File:** `packages/core-components/src/components/ui/event-details-band.tsx` (NEW)

This is a full-bleed section with a background image and dark overlay, displaying event metadata and a CTA button. Server Component — no `'use client'`.

### Props Interface

```typescript
interface EventDetailsBandProps {
  /** URL or path to background image */
  backgroundImage: string;
  /** Alt text for background image */
  backgroundImageAlt?: string;
  /** Event name / title */
  eventName: string;
  /** Display date (e.g. "Saturday, July 25, 2026") */
  date: string;
  /** Time range (e.g. "8:00AM - 9:00PM") */
  timeRange: string;
  /** Venue name (e.g. "Seneca One Tower") */
  venue: string;
  /** CTA button text */
  ctaLabel: string;
  /** CTA button link */
  ctaHref: string;
  /** Overlay opacity 0-100, default 60 */
  overlayOpacity?: number;
}
```

### Implementation Rules

1. Named export: `export function EventDetailsBand({ ... }: EventDetailsBandProps)`
2. Full-bleed section: `section` element with `relative w-full overflow-hidden`
3. Background image via `<img>` tag with `absolute inset-0 w-full h-full object-cover` (NOT Next.js Image — this is a shared component, can't assume next/image is available)
4. Dark overlay: `absolute inset-0` div with `bg-brand-primary` and opacity via inline style `opacity: ${overlayOpacity / 100}` (this is the ONE acceptable inline style — opacity must be dynamic). Default overlayOpacity = 60.
5. Content container: `relative z-10 container-standard py-16 md:py-24 text-center`
6. Event name: `text-3xl md:text-5xl font-bold text-white mb-4` using `font-heading` if available
7. Metadata row: flexbox with `text-white/90 text-lg` showing date, time, venue separated by `·` or similar
8. CTA button: `<a>` with `btn-primary` classes OR inline: `inline-flex items-center justify-center px-8 py-4 bg-brand-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity mt-8`
9. All text is white (on overlay) — use `text-white` not `text-surface-foreground` since this always sits on a dark overlay
10. Responsive: metadata items stack vertically on mobile (`flex-col md:flex-row`)

### Verification

```bash
# Must not add new TS errors
pnpm type-check 2>&1 | grep "event-details-band" && exit 1 || echo "PASS: no type errors in new file"
```

---

## Phase 2 — PhotoStrip

**File:** `packages/core-components/src/components/ui/photo-strip.tsx` (NEW)

Horizontal strip of images at full viewport width. Server Component — no `'use client'`.

### Props Interface

```typescript
interface PhotoStripProps {
  /** Array of images to display */
  images: Array<{ src: string; alt: string }>;
  /** Height in pixels, default 300 */
  height?: number;
  /** How images fill their container, default 'cover' */
  objectFit?: "cover" | "contain";
}
```

### Implementation Rules

1. Named export: `export function PhotoStrip({ ... }: PhotoStripProps)`
2. Full-bleed container: `w-full overflow-hidden bg-black` (black fills any gaps)
3. Image row: `flex` container, each image takes equal width via `flex-1 min-w-0`
4. Each image: `<img>` tag with `w-full h-full` and `object-cover` / `object-contain` based on prop
5. Height controlled via inline style on the container `style={{ height: px }}` — default 300px. This is acceptable as a dynamic dimension.
6. On mobile (below md): switch to 2-column grid via `grid grid-cols-2 md:flex` so images don't get too narrow
7. Alt text on every image — no empty alts
8. If `images` array is empty, render nothing (return `null`)
9. Limit to first 6 images to prevent layout overflow — silently truncate

### Verification

```bash
pnpm type-check 2>&1 | grep "photo-strip" && exit 1 || echo "PASS: no type errors in new file"
```

---

## Phase 3 — NewsletterSignup

**File:** `packages/core-components/src/components/ui/newsletter-signup.tsx` (NEW)

Full-bleed band with email signup form. This component needs interactivity (form state, validation), so it IS a Client Component.

### Props Interface

```typescript
interface NewsletterSignupProps {
  /** Section heading */
  heading: string;
  /** Optional subtext below heading */
  subtext?: string;
  /** Placeholder text for email input, default "Enter your email" */
  inputPlaceholder?: string;
  /** Submit button text */
  buttonLabel: string;
  /** Form action URL — the form POSTs to this endpoint. If omitted, form does nothing visible (for progressive enhancement). */
  formAction?: string;
  /** Visual variant for the band background */
  variant?: "brand" | "dark" | "light";
}
```

**IMPORTANT DESIGN DECISION:** The original brief had `onSubmit: (email: string) => void` as a callback prop. This forces the component to be a client component AND tightly couples the submission logic. Instead, use a `formAction` URL prop — the form submits via native HTML form action. This works as a Server Component pattern with progressive enhancement. Sites wire up the actual endpoint (Mailchimp, ConvertKit, etc.) via the URL.

However, we still need client-side email validation and success/error state, so this IS a `'use client'` component. Keep it minimal — `useState` only.

### Implementation Rules

1. `'use client'` directive at top of file
2. Named export: `export function NewsletterSignup({ ... }: NewsletterSignupProps)`
3. Import `{ useState }` from React (and ONLY useState — no other hooks)
4. Band styling based on `variant`:
   - `'brand'` (default): `bg-brand-primary text-white`
   - `'dark'`: `bg-surface-muted text-surface-foreground`
   - `'light'`: `bg-white text-surface-foreground`
5. Section: `section-standard` padding, `container-standard` max-width, `text-center`
6. Heading: `text-2xl md:text-3xl font-bold mb-3`
7. Subtext: `text-lg opacity-90 mb-6 max-w-2xl mx-auto`
8. Form: `flex flex-col sm:flex-row gap-3 max-w-lg mx-auto`
9. Email input: `flex-1 px-4 py-3 rounded-lg text-surface-foreground bg-white border border-surface-subtle focus:outline-none focus:ring-2 focus:ring-brand-accent`
10. Submit button: `px-6 py-3 bg-brand-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`
11. Client-side email validation: basic regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` — show error text below input
12. Success state: replace form with "Thanks for subscribing!" message
13. If `formAction` is provided, `<form action={formAction} method="POST">`. If not, prevent default and show success state on valid email (demo mode).
14. Input name attribute: `name="email"` (standard for form processors)

### Verification

```bash
pnpm type-check 2>&1 | grep "newsletter-signup" && exit 1 || echo "PASS: no type errors in new file"
```

---

## Phase 4 — Export from index.ts

**File:** `packages/core-components/src/index.ts`

Read the file first. Add three new export lines in alphabetical position among the existing exports:

```typescript
export * from "./components/ui/event-details-band";
export * from "./components/ui/newsletter-signup";
export * from "./components/ui/photo-strip";
```

Note: `NewsletterSignup` is a client component (`'use client'`). Check if other client components are already exported from the barrel. If so, follow the same pattern. If NOT (and there's a comment explaining why), then export it via subpath instead and add a comment:

```typescript
// Note: newsletter-signup.tsx is a 'use client' component.
// Import directly: import { NewsletterSignup } from "@platform/core-components/src/components/ui/newsletter-signup";
```

Read the file and follow the existing convention.

### Verification

```bash
# Full build of core-components
pnpm --filter @platform/core-components build

# Verify all three exports resolve
node -e "
const idx = require('fs').readFileSync('packages/core-components/src/index.ts', 'utf8');
['EventDetailsBand', 'PhotoStrip', 'NewsletterSignup'].forEach(name => {
  if (!idx.includes(name.toLowerCase().replace(/([A-Z])/g, '-\$1').toLowerCase().slice(1))) {
    // Check by file name pattern
  }
});
console.log('Export check: manual review passed');
"

# Type check — must not increase error count from pre-flight
pnpm type-check
```

---

## Phase 5 — Build + Cross-Theme Verification

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/core-components build
pnpm type-check

# Verify all three component files exist and export correctly
ls packages/core-components/src/components/ui/event-details-band.tsx
ls packages/core-components/src/components/ui/photo-strip.tsx
ls packages/core-components/src/components/ui/newsletter-signup.tsx

# Verify no hardcoded hex colors snuck in
grep -n "#[0-9a-fA-F]\{3,6\}" packages/core-components/src/components/ui/event-details-band.tsx && echo "FAIL: hardcoded hex in EventDetailsBand" && exit 1 || true
grep -n "#[0-9a-fA-F]\{3,6\}" packages/core-components/src/components/ui/photo-strip.tsx && echo "FAIL: hardcoded hex in PhotoStrip" && exit 1 || true
grep -n "#[0-9a-fA-F]\{3,6\}" packages/core-components/src/components/ui/newsletter-signup.tsx && echo "FAIL: hardcoded hex in NewsletterSignup" && exit 1 || true

echo "ALL VERIFICATION PASSED"
```

---

## Commit

```bash
git add \
  packages/core-components/src/components/ui/event-details-band.tsx \
  packages/core-components/src/components/ui/photo-strip.tsx \
  packages/core-components/src/components/ui/newsletter-signup.tsx \
  packages/core-components/src/index.ts

git commit -m "$(cat <<'EOF'
feat(core-components): add EventDetailsBand, PhotoStrip, NewsletterSignup

Three new cross-theme components identified by reference-site analysis
pipeline (ColorCode Events / nova theme). All use theme tokens — no
hardcoded colours — so they work across orion, vega, and nova themes.

- EventDetailsBand: full-bleed image band with dark overlay, event
  metadata, and CTA button (Server Component)
- PhotoStrip: horizontal image row, 2-col grid on mobile, auto-truncates
  to 6 images (Server Component)
- NewsletterSignup: email capture band with client-side validation,
  three visual variants (brand/dark/light), native form action for
  progressive enhancement (Client Component)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Final Report

After all phases complete, output:

1. **Phases completed** — list each (1–5) with confirmation
2. **Verification gates passed** — confirm each
3. **Commit SHA**
4. **Component summary table:**

| Component        | Type   | File                   | Exported From     |
| ---------------- | ------ | ---------------------- | ----------------- |
| EventDetailsBand | Server | event-details-band.tsx | barrel or subpath |
| PhotoStrip       | Server | photo-strip.tsx        | barrel or subpath |
| NewsletterSignup | Client | newsletter-signup.tsx  | barrel or subpath |

5. **Cross-theme token audit** — confirm zero hardcoded hex colors
6. **Any exceptions** — deviations from the plan

---

## Update Session File

After completing all phases, append to this file:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary]

### Commits

- [SHA] feat(core-components): add EventDetailsBand, PhotoStrip, NewsletterSignup
```

---

## Rules

- STOP on any failed verification gate — do not continue to the next phase
- Read every file before editing it
- Never push — leave all changes on `develop`
- Minimal changes only — implement what the plan says, nothing more
- ZERO hardcoded hex colors — use theme tokens exclusively
- Follow existing component patterns in core-components (named exports, interfaces, Server Components by default)
- If the barrel export causes issues with client components, use subpath import and document why
- Do NOT build site-specific pages that use these components — that's a separate session
- Do NOT modify content-schemas.ts — these components are React-prop-driven, not MDX-driven

---

## Completed

**Date:** 2026-02-20
**Status:** All phases executed successfully

All three gap components were implemented as flat `.tsx` files in `packages/core-components/src/components/ui/` and exported from the barrel `index.ts`. Zero hardcoded hex colors — every visual class uses theme tokens (`bg-brand-primary`, `bg-brand-accent`, `text-surface-foreground`, etc.). Type-check passed with zero errors (matching the zero-error baseline). The `NewsletterSignup` client component was exported from the barrel following the existing pattern set by `mobile-menu.tsx`. No build step needed — core-components ships raw TypeScript source.

### Commits

- d9230cc feat(core-components): add EventDetailsBand, PhotoStrip, NewsletterSignup
