# YOLO Implementation Brief: Lyra Theme + Lyra-Garden Consistency Fix

**Branch:** feature/lyra-theme-consistency (created from develop)
**Session spec:** output/sessions/2026-04-11_lyra-theme-consistency/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `_lyra-garden` site was one of the first built with the Stitch pipeline. Unlike the mature Vega and Orion themes, the Lyra theme has no Header or Footer components. The Stitch pipeline therefore hardcoded navigation inline on every page. This creates: duplicated nav markup across 5+ page files, hardcoded hex colors that bypass the theme system, redundant inline `style={{ fontFamily }}` overrides, and a non-reusable pattern that will break future Lyra sites. The site config also still has placeholder "Your Business Name" values.

This brief brings Lyra into parity with Orion and Vega: theme-owned Header/Footer components, a `PageShell`-wrapped layout, all colors from tokens, and site config updated with fictitious "Lyra Gardening and Landscapes" client details.

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
git checkout -b feature/lyra-theme-consistency
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Read existing reference files

**Goal:** Understand the exact patterns used by Vega and Orion before creating Lyra equivalents.
**Model:** haiku — read-only, mechanical

Read all of these files in a single parallel batch:

- `packages/themes/vega/components/header.tsx`
- `packages/themes/vega/components/footer.tsx`
- `packages/themes/vega/components/index.ts`
- `packages/themes/orion/components/header.tsx`
- `packages/themes/orion/components/footer.tsx`
- `packages/themes/orion/components/index.ts`
- `packages/themes/lyra/index.ts`
- `packages/themes/lyra/globals.css`
- `packages/core-components/src/components/ui/site-header.tsx`
- `packages/core-components/src/components/ui/footer.tsx`
- `packages/core-components/src/components/ui/page-shell.tsx`
- `packages/core-components/src/index.ts`
- `sites/_lyra-garden/app/layout.tsx`
- `sites/_lyra-garden/site.config.ts`
- `sites/_lyra-garden/tailwind.config.ts`
- `sites/_lyra-garden/lib/contact-info.ts`

Also grep for all hardcoded hex patterns in the site:

```bash
grep -rn 'text-\[#\|bg-\[#\|border-\[#' sites/_lyra-garden/app/ | sort
grep -rn 'style={{ fontFamily' sites/_lyra-garden/app/ | sort
grep -rn '<nav ' sites/_lyra-garden/app/ | sort
```

No changes in this phase — read only.

---

## Phase 2: Add missing color tokens to Lyra theme

**Goal:** Extend `lyraDefaultConfig` with two colors used by the Stitch design but missing from the token config.
**Model:** haiku — targeted token addition to one file

**File:** `packages/themes/lyra/index.ts`

In `lyraDefaultConfig.colors.brand`, add two new entries:

```typescript
brand: {
  primary: '#163526',
  primaryHover: '#132f21',
  secondary: '#77574d',
  accent: '#f8bd2a',
  onPrimary: '#ffffff',
  light: '#c7ebd4',    // hero accent text, light CTAs (from Stitch design)
  dark: '#2d4c3b',     // hero gradient end (from Stitch design)
},
```

Also check the ThemeConfig type in `packages/theme-system/src/types.ts` — if `brand.light` and `brand.dark` are not in the type, add them. Read the type first to verify.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Commit:**

```bash
git add packages/themes/lyra/index.ts packages/theme-system/src/types.ts
git commit -m "$(cat <<'EOF'
feat(lyra): add brand.light and brand.dark color tokens

Extends lyraDefaultConfig with two colors used in the Stitch-generated
design but missing from the token config (#c7ebd4 light green,
#2d4c3b darker green). Enables hex-free token-based styling in page files.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Create Lyra theme components

**Goal:** Create LyraHeader and LyraFooter components following the exact Vega/Orion pattern. These are thin wrappers — do not invent new logic.
**Model:** sonnet — new files, pattern-following

### 3a. Read reference files first (already done in Phase 1)

### 3b. Create `packages/themes/lyra/components/header.tsx`

Model this exactly on `packages/themes/vega/components/header.tsx`. Key differences:

- Appearance: `"light"` (same as Vega)
- Sticky: `true` (the Lyra design has a fixed top nav)
- Re-export type from `SiteHeaderProps` from core-components

```typescript
import type { SiteHeaderProps } from "@platform/core-components";
import { SiteHeader } from "@platform/core-components";

export type LyraHeaderProps = Omit<SiteHeaderProps, "appearance" | "sticky">;

export function LyraHeader(props: LyraHeaderProps) {
  return <SiteHeader appearance="light" sticky={true} {...props} />;
}
```

### 3c. Create `packages/themes/lyra/components/footer.tsx`

The core `Footer` component (in core-components) is a self-fetching Server Component — it reads from `@/lib/content`, `@/lib/contact-info`, and `@/site.config` via alias imports. It takes no props.

Check how VegaFooter and OrionFooter handle this:

- If they re-export the core Footer directly: do the same
- If they wrap it with props: follow that pattern

Create `packages/themes/lyra/components/footer.tsx` to match.

### 3d. Create `packages/themes/lyra/components/index.ts`

Export both components:

```typescript
export { LyraHeader } from "./header";
export type { LyraHeaderProps } from "./header";
export { LyraFooter } from "./footer";
```

### 3e. Update `packages/themes/lyra/index.ts`

Add a re-export block at the bottom pointing to the new components (match the pattern in vega/index.ts or orion/index.ts):

```typescript
// Component exports — import via @platform/themes/lyra/components
export * from "./components";
```

If Vega/Orion use a different export pattern (e.g. subpath-only, no barrel re-export), match that instead.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Commit:**

```bash
git add packages/themes/lyra/
git commit -m "$(cat <<'EOF'
feat(lyra): add LyraHeader and LyraFooter theme components

Creates packages/themes/lyra/components/ with header.tsx, footer.tsx,
and index.ts following the Vega/Orion component pattern. LyraHeader
wraps SiteHeader with appearance="light" sticky=true. LyraFooter wraps
the core self-fetching Footer component.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Update Lyra-Garden tailwind.config.ts

**Goal:** Add `brand-light` and `brand-dark` Tailwind color entries so the new tokens are available as utility classes.
**Model:** haiku — small targeted addition to one config file

**File:** `sites/_lyra-garden/tailwind.config.ts`

In the `theme.extend.colors.brand` object, add:

```typescript
brand: {
  primary: 'var(--color-brand-primary)',
  'primary-hover': 'var(--color-brand-primary-hover)',
  secondary: 'var(--color-brand-secondary)',
  accent: 'var(--color-brand-accent)',
  'on-primary': 'var(--color-brand-on-primary)',
  light: 'var(--color-brand-light)',    // NEW
  dark: 'var(--color-brand-dark)',      // NEW
},
```

Read the file first to see the current exact structure, then add only the missing entries.

Also verify that the theme-system plugin generates CSS variables for `brand.light` and `brand.dark` correctly. It should — the plugin reads `lyraDefaultConfig` and generates `--color-brand-light` and `--color-brand-dark` automatically from the token names. No plugin changes needed.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Commit:**

```bash
git add sites/_lyra-garden/tailwind.config.ts
git commit -m "$(cat <<'EOF'
feat(lyra-garden): add brand-light and brand-dark Tailwind color entries

Extends tailwind.config.ts with CSS variable references for the two new
Lyra token colors (brand.light = #c7ebd4, brand.dark = #2d4c3b).
Enables text-brand-light, bg-brand-dark, etc. utility classes.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Update site.config.ts with fictitious client details

**Goal:** Replace placeholder "Your Business Name" values with consistent fictitious client data for the test site.
**Model:** haiku — search-and-replace in one file

**File:** `sites/_lyra-garden/site.config.ts`

Read the file first, then update these values throughout:

| Field                             | Old value              | New value                                                        |
| --------------------------------- | ---------------------- | ---------------------------------------------------------------- |
| `business.name`                   | `'Your Business Name'` | `'Lyra Gardening and Landscapes'`                                |
| `business.legalName`              | `'Your Business Ltd'`  | `'Lyra Gardening and Landscapes Ltd'`                            |
| `business.phone`                  | `'+44 1234 567890'`    | `'+44 1632 960987'`                                              |
| `business.email`                  | `'info@example.com'`   | `'hello@lyra-gardening.co.uk'`                                   |
| `business.address.street`         | `'123 Main Street'`    | `'14 Fernwood Avenue'`                                           |
| `business.address.city`           | `'City Name'`          | `'Cheltenham'`                                                   |
| `business.address.region`         | `'County/Region'`      | `'Gloucestershire'`                                              |
| `business.address.postalCode`     | `'AB12 3CD'`           | `'GL50 2NW'`                                                     |
| `name` (site name, top of config) | any placeholder        | `'Lyra Gardening and Landscapes'`                                |
| `tagline`                         | any placeholder        | `'Expert gardening and landscaping across Gloucestershire'`      |
| `footer.copyright`                | any placeholder        | `'2025 Lyra Gardening and Landscapes Ltd. All rights reserved.'` |

Note: `+44 1632 960987` is a UK Ofcom-designated non-working number safe for test use.

Also update `PHONE_DISPLAY` and `PHONE_TEL` values if they are hardcoded constants in the file (not derived from `business.phone`).

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
```

**Commit:**

```bash
git add sites/_lyra-garden/site.config.ts
git commit -m "$(cat <<'EOF'
chore(lyra-garden): update site config with fictitious client details

Replaces placeholder 'Your Business Name' values with Lyra Gardening
and Landscapes test client data. Uses Ofcom non-working number
(01632 960987) and fictitious Cheltenham address.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Refactor layout.tsx to use PageShell + LyraHeader

**Goal:** Wire the new LyraHeader and Footer into the layout so all pages share a consistent header/footer from a single source of truth.
**Model:** sonnet — meaningful structural change to one file

**File:** `sites/_lyra-garden/app/layout.tsx`

Read the current file first. Then rewrite it to match the DJ Fox Electrical pattern (`sites/dj-fox-electrical/app/layout.tsx`), adapting for Lyra:

```typescript
import type { Metadata, Viewport } from 'next';
import { Newsreader, Work_Sans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider, PageShell } from '@platform/core-components';
import { lyraRegistry } from '@platform/themes/lyra';
import { LyraHeader } from '@platform/themes/lyra/components';
import { Footer } from '@platform/core-components/src/components/ui/footer';
import { getContentItems } from '@/lib/content';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.tagline,
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const allLocations = await getContentItems('locations');
  const locationItems = allLocations.map(l => ({ name: l.title, slug: l.slug }));

  return (
    <html lang="en-GB" className={`${newsreader.variable} ${workSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider theme="lyra" registry={lyraRegistry}>
          <PageShell
            header={
              <LyraHeader
                siteName={siteConfig.business.name}
                phoneDisplay={PHONE_DISPLAY}
                phoneTel={PHONE_TEL}
                showPhone={siteConfig.cta.phone.show}
                primaryCta={siteConfig.cta.primary}
                navigation={siteConfig.navigation.main}
                locations={locationItems}
              />
            }
            footer={<Footer />}
          >
            {children}
          </PageShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Important import notes:

- Import `Footer` via subpath `@platform/core-components/src/components/ui/footer` — NOT from the barrel `@platform/core-components`. The barrel causes circular deps in vitest.
- Import `LyraHeader` from `@platform/themes/lyra/components` (the components subpath).
- Check how DJ Fox imports `OrionHeader` and replicate the import path style exactly.

If `getContentItems` is not exported from `@/lib/content`, check what IS exported and use the appropriate function to get location slugs/names.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
cd sites/_lyra-garden && npm run build
```

**Commit:**

```bash
git add sites/_lyra-garden/app/layout.tsx
git commit -m "$(cat <<'EOF'
feat(lyra-garden): add PageShell + LyraHeader + Footer to layout

Refactors RootLayout to use PageShell with LyraHeader and core Footer,
matching the DJ Fox / Colossus pattern. All pages now share a single
consistent header and footer from layout.tsx rather than per-page markup.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: Remove hardcoded nav from all page files

**Goal:** Strip the inline `<nav>` block from every page file that repeats it.
**Model:** sonnet — careful targeted removal across multiple files

First, identify all page files containing hardcoded nav:

```bash
grep -rl '<nav ' sites/_lyra-garden/app/ --include="*.tsx"
```

For each file found:

1. Read the file
2. Remove the entire inline `<nav>...</nav>` block
3. If the nav came with a top-level `<>` fragment wrapper that is now no longer needed (because the page no longer needs to co-locate nav + content), simplify accordingly — but do NOT restructure the page content

The nav block to remove looks like this pattern (may vary slightly per page):

```tsx
<nav className="fixed top-0 left-0 right-0 bg-[#fbf9f5]/80 ...">...</nav>
```

Also: if any page has `pt-16` or `mt-16` top padding that was added to compensate for the fixed nav, keep it — the `PageShell`'s `SiteHeader` is `sticky` (not `fixed`), so the page content flows naturally below it without needing manual offset. Actually: check by reading `page-shell.tsx` and `site-header.tsx` — if sticky header is used, no offset needed. If they had `fixed` nav, pages needed top padding. Remove any `pt-16` padding that was only there to offset the now-removed fixed nav.

Expected files to touch: `app/page.tsx`, `app/services/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, possibly others.

Spawn parallel Task agents (model: sonnet) for each page file — they edit independent files:

```
Task: Remove hardcoded nav from app/page.tsx
model: sonnet
Prompt: Read sites/_lyra-garden/app/page.tsx in full. Remove the hardcoded <nav> block at the top. Remove any top padding (pt-16, mt-16) that was only there to offset the fixed nav. Keep all other page content exactly as-is. Write the file back.

Task: Remove hardcoded nav from app/services/page.tsx
model: sonnet
Prompt: [same instruction for services/page.tsx]

Task: Remove hardcoded nav from app/about/page.tsx
model: sonnet
Prompt: [same instruction for about/page.tsx]

Task: Remove hardcoded nav from app/contact/page.tsx
model: sonnet
Prompt: [same instruction for contact/page.tsx]
```

If grep found additional files, spawn agents for those too.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
cd sites/_lyra-garden && npm run build
```

**Commit:**

```bash
git add sites/_lyra-garden/app/
git commit -m "$(cat <<'EOF'
refactor(lyra-garden): remove hardcoded nav from all page files

Strips the duplicated inline <nav> block from page.tsx, services/page.tsx,
about/page.tsx, contact/page.tsx and any other pages where it appears.
Header is now provided globally by PageShell in layout.tsx.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 8: Replace hardcoded hex colors with theme tokens

**Goal:** Eliminate all `text-[#xxx]`, `bg-[#xxx]`, and `border-[#xxx]` patterns in page files, replacing each with the appropriate theme token class.
**Model:** sonnet — systematic replacement requiring judgment on token mapping

First, re-run the audit:

```bash
grep -rn 'text-\[#\|bg-\[#\|border-\[#' sites/_lyra-garden/app/ | sort
```

Apply these replacements throughout all files:

| Hardcoded class                    | Replacement token class           | Notes                               |
| ---------------------------------- | --------------------------------- | ----------------------------------- |
| `text-[#424843]`                   | `text-surface-secondary`          | Nav link color                      |
| `bg-[#fbf9f5]`                     | `bg-surface-background`           | Cream background                    |
| `bg-[#fbf9f5]/80`                  | `bg-surface-background/80`        | Backdrop                            |
| `text-[#c7ebd4]`                   | `text-brand-light`                | Hero accent text                    |
| `bg-[#c7ebd4]`                     | `bg-brand-light`                  | Light CTA background                |
| `text-[#2d4c3b]` or `to-[#2d4c3b]` | `bg-brand-dark` / `to-brand-dark` | Gradient end                        |
| `from-[#163526]`                   | `from-brand-primary`              | Gradient start (already token-able) |
| `bg-[#2d4c3b]`                     | `bg-brand-dark`                   | Dark section background             |
| `text-[#012113]`                   | `text-brand-primary`              | Very dark green button text         |
| `text-[#261a00]`                   | `text-surface-foreground`         | Near-black body text                |
| `text-[#1b1c1a]`                   | `text-surface-foreground`         | Already the foreground token        |
| `bg-[#163526]`                     | `bg-brand-primary`                | Primary brand bg                    |
| `bg-[#132f21]`                     | `bg-brand-primary-hover`          | Hover state                         |

If you encounter a hex color NOT in this list, check it against `lyraDefaultConfig` in `packages/themes/lyra/index.ts`. Map it to the nearest token. If there is no reasonable mapping, leave it with a `// TODO: no token` comment and note it in the final report.

Also check for gradient syntax: `bg-gradient-to-br from-brand-primary to-[#2d4c3b]` → `from-brand-primary to-brand-dark`.

Use parallel Task agents (model: haiku) per file for mechanical replacements, once the mapping table is confirmed.

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
grep -rn 'text-\[#\|bg-\[#\|border-\[#' sites/_lyra-garden/app/ | sort
# Above grep should return 0 results (or only items with TODO comments)
cd sites/_lyra-garden && npm run build
```

**Commit:**

```bash
git add sites/_lyra-garden/app/
git commit -m "$(cat <<'EOF'
refactor(lyra-garden): replace hardcoded hex colors with theme tokens

Replaces all text-[#xxx] / bg-[#xxx] / border-[#xxx] Tailwind arbitrary
values in page files with Lyra theme token classes (bg-brand-primary,
text-brand-light, text-surface-secondary, etc.). Ensures white-labeling
works correctly via the theme system.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 9: Remove inline font-family style overrides

**Goal:** Remove all `style={{ fontFamily: 'Newsreader, serif' }}` from JSX — these are defensive redundancies left by the pipeline. The font is already set in globals.css `@layer base`.
**Model:** haiku — mechanical string removal

```bash
grep -rn "style={{ fontFamily" sites/_lyra-garden/app/ | sort
```

For each occurrence found, remove the entire `style={{ fontFamily: '...' }}` attribute from the JSX element. Do not remove the element itself — just strip the style prop.

Example:

```tsx
// Before
<h1 className="text-5xl font-bold text-white" style={{ fontFamily: 'Newsreader, serif' }}>

// After
<h1 className="text-5xl font-bold text-white">
```

**Verification gate — STOP if this fails:**

```bash
pnpm type-check
grep -rn "style={{ fontFamily" sites/_lyra-garden/app/ | sort
# Should return 0 results
```

**Commit:**

```bash
git add sites/_lyra-garden/app/
git commit -m "$(cat <<'EOF'
refactor(lyra-garden): remove inline fontFamily style overrides

Strips redundant style={{ fontFamily: 'Newsreader, serif' }} attributes
from JSX elements throughout page files. Font families are already set
globally in globals.css @layer base.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 10: Final verification

**Goal:** Confirm the entire site builds cleanly and all structural issues are resolved.
**Model:** sonnet

Run the full verification sequence:

```bash
# Verification gate — STOP if any of these fail
pnpm type-check
cd sites/_lyra-garden && npm run build
```

Then do a final audit:

```bash
# These should return 0 results
grep -rn 'text-\[#\|bg-\[#\|border-\[#' sites/_lyra-garden/app/
grep -rn 'style={{ fontFamily' sites/_lyra-garden/app/
grep -rn '<nav ' sites/_lyra-garden/app/
```

If any results remain (other than items intentionally left with TODO comments), fix them before committing.

**Final commit:**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore(lyra): final verification pass — all structural issues resolved

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)" --allow-empty-message
# Only commit if there are outstanding changes
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Groups run sequentially in the listed order.

### Intra-phase groups

| Group | Phase    | Items                                                                                                  | File overlap      | Model  | Rationale                                |
| ----- | -------- | ------------------------------------------------------------------------------------------------------ | ----------------- | ------ | ---------------------------------------- |
| G1    | Phase 1  | Read all 16 reference files listed in Phase 1                                                          | none (reads only) | n/a    | Independent reads — batch in one message |
| G2    | Phase 7  | Remove nav from page.tsx, services/page.tsx, about/page.tsx, contact/page.tsx (4 parallel Task agents) | none              | sonnet | Independent files — parallelise safely   |
| G3    | Phase 8  | Hex color replacements per page file (once token mapping confirmed)                                    | none              | haiku  | Mechanical per-file replacements         |
| G4    | Phase 10 | `pnpm type-check` + final grep audits (after build passes)                                             | none (read-only)  | n/a    | Independent verification commands        |

### Cross-phase groups

| Group  | Phases | Items | Rationale                               |
| ------ | ------ | ----- | --------------------------------------- |
| (none) |        |       | All phases have sequential dependencies |

### Sequential points — MUST NOT parallelise

| Item                              | Reason                                                                |
| --------------------------------- | --------------------------------------------------------------------- |
| Phase 2 before Phase 4            | Tailwind config must reference tokens that exist in lyraDefaultConfig |
| Phase 3 before Phase 6            | LyraHeader component must exist before layout.tsx imports it          |
| Phase 6 before Phase 7            | layout.tsx must provide the header before we remove per-page nav      |
| Verification gates between phases | Each phase's output gates the next                                    |
| Git commits                       | One commit per phase, in order                                        |

---

## Cost Estimate

| Phase                           | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Read reference files   | haiku  | ~25k              | ~0                 | ~$0.01     |
| Phase 2: Add color tokens       | haiku  | ~5k               | ~0.5k              | ~$0.00     |
| Phase 3: Create Lyra components | sonnet | ~10k              | ~2k                | ~$0.06     |
| Phase 4: Tailwind config        | haiku  | ~3k               | ~0.2k              | ~$0.00     |
| Phase 5: site.config.ts update  | haiku  | ~5k               | ~0.5k              | ~$0.00     |
| Phase 6: Refactor layout.tsx    | sonnet | ~8k               | ~1.5k              | ~$0.05     |
| Phase 7: Remove nav (4 agents)  | sonnet | ~20k              | ~4k                | ~$0.18     |
| Phase 8: Replace hex colors     | haiku  | ~15k              | ~2k                | ~$0.01     |
| Phase 9: Remove style overrides | haiku  | ~8k               | ~0.5k              | ~$0.00     |
| Phase 10: Final verification    | sonnet | ~5k               | ~0.5k              | ~$0.02     |
| **Total**                       |        | **~104k**         | **~11k**           | **~$0.33** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check && cd sites/_lyra-garden && npm run build` passes
3. Remaining hex values (if any left with TODO comments)
4. Any deviations from this plan
5. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-11_lyra-theme-consistency/yolo-brief.md`:

---

## Completed

**Date:** 2026-04-11
**Status:** All phases executed successfully

Phases 1–9 all implemented on `feature/lyra-theme-consistency`. The brief referenced `sites/_lyra-garden` but the actual Lyra test site with the described problems is `sites/lyra-test` — all work applied there. Key deviations: (1) the theme-system plugin does NOT auto-generate `--color-brand-light`/`dark` from config — they were added manually to `packages/themes/lyra/globals.css`; (2) `lyra-test` had no `node_modules` and was missing `build`/`type-check` scripts which were added; (3) `font-heading` utility added to `tailwind.config.ts` so non-heading elements (blockquote, decorative div, pull-quote p) could use Newsreader without inline style props. Build passes, type-check clean.

### Commits

- `d207bbf` feat(lyra): add brand.light and brand.dark color tokens
- `b864944` feat(lyra): add LyraHeader and LyraFooter theme components
- `4950a32` feat(lyra-test): add brand-light and brand-dark Tailwind color entries
- `0ab7939` chore(lyra-test): update site config with fictitious client details
- `6f608fb` feat(lyra-test): add PageShell + LyraHeader + Footer to layout
- `be89a64` refactor(lyra-test): remove hardcoded nav and footer from all page files
- `e8d41fb` refactor(lyra-test): replace hardcoded hex colors with theme tokens

Confirm this was done in the final report.

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
- The Co-Authored-By line in commits must reflect the orchestrator model: `Claude Sonnet 4.6 <noreply@anthropic.com>`
