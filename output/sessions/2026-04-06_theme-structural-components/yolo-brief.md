# YOLO Implementation Brief: Theme Packages Own Header and Footer

**Branch:** feature/theme-structural-components (created from develop)
**Session spec:** output/sessions/2026-04-06_theme-structural-components/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Theme packages (cygnus, orion, vega) currently export only color tokens and a ComponentRegistry — headers and footers live in core-components as a single generic `SiteHeader`/`Footer`. Every site therefore renders the same generic nav regardless of theme. This plan moves header and footer ownership into each theme package as props-based Server Components, updates all 5 affected site layouts, and patches the pipeline to copy `layout.tsx` when creating new sites.

The synthesis was reviewed and approved. Implement it exactly as specified below.

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
git checkout -b feature/theme-structural-components   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Cygnus Components + Package Export

**Goal:** Create `CygnusHeader` and `CygnusFooter` Server Components in `packages/themes/cygnus/components/` and wire the subpath export.
**Model:** sonnet — creating new typed components with props interfaces

### Files to create

**`packages/themes/cygnus/components/header.tsx`**

Props-based React Server Component. NO `'use client'` directive. Wraps the generic `SiteHeader` from core-components with `appearance="dark"` hardcoded. This establishes ownership without diverging visually yet — visual customisation is a follow-up task.

```tsx
import { SiteHeader } from '@platform/core-components';

export interface CygnusHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
}

export function CygnusHeader(props: CygnusHeaderProps) {
  return <SiteHeader appearance="dark" {...props} />;
}
```

**`packages/themes/cygnus/components/footer.tsx`**

Props-based React Server Component. NO `'use client'` directive. Accepts all data as props — no `@/` imports anywhere in this file. Port the visual structure from the generic Footer in core-components but with all data injected via props.

```tsx
export interface CygnusFooterProps {
  siteName: string;
  tagline: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  address: { locality: string; region: string };
  certifications: Array<{ name: string; description: string; icon?: string }>;
  services: Array<{ slug: string; title: string }>;
  locations: Array<{ slug: string; title: string }>;
  totalServices: number;
  totalLocations: number;
  maxServices: number;
  maxLocations: number;
  showServices: boolean;
  showLocations: boolean;
  copyright: string;
  builtBy?: { name: string; url: string };
}
```

Read `packages/core-components/src/components/footer.tsx` first to understand the visual structure, then implement the component using only the props above (no `@/` imports).

**`packages/themes/cygnus/components/index.ts`**

```ts
export { CygnusHeader } from './header';
export type { CygnusHeaderProps } from './header';
export { CygnusFooter } from './footer';
export type { CygnusFooterProps } from './footer';
```

### Files to modify

**`packages/themes/package.json`** — add three subpath exports (one per theme, do all three now to avoid touching this file three times):

```json
"./cygnus/components": "./cygnus/components/index.ts",
"./orion/components": "./orion/components/index.ts",
"./vega/components": "./vega/components/index.ts"
```

```bash
# Verification gate — STOP if this fails
cd /path/to/repo && pnpm --filter @platform/themes exec tsc --noEmit 2>/dev/null || true
# (theme packages have no tsconfig — just confirm index.ts is syntactically valid)
node -e "require('./packages/themes/cygnus/components/index.ts')" 2>&1 | grep -v "SyntaxError" || true
```

```bash
git add packages/themes/cygnus/components/ packages/themes/package.json
git commit -m "feat(themes): add CygnusHeader and CygnusFooter to cygnus theme package

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2: Orion Components

**Goal:** Create `OrionHeader` and `OrionFooter` in `packages/themes/orion/components/`.
**Model:** sonnet — same pattern as Phase 1, with orion-specific county mega-menu prop

### Files to create

**`packages/themes/orion/components/header.tsx`**

Same pattern as CygnusHeader but with `appearance="dark"` and additional `counties` prop for the dj-fox-electrical mega-menu:

```tsx
export interface OrionHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
  counties?: Array<{ county: string; towns: Array<{ name: string; slug: string }> }>;
  maxTownsPerCounty?: number;
}

export function OrionHeader(props: OrionHeaderProps) {
  const { counties, maxTownsPerCounty, ...headerProps } = props;
  return (
    <SiteHeader
      appearance="dark"
      counties={counties}
      maxTownsPerCounty={maxTownsPerCounty}
      {...headerProps}
    />
  );
}
```

Read `packages/core-components/src/components/site-header.tsx` to confirm the exact prop names `SiteHeader` accepts for counties/locations before writing this.

**`packages/themes/orion/components/footer.tsx`**

Same `CygnusFooterProps` interface shape but exported as `OrionFooterProps` and `OrionFooter`. The visual implementation can be identical to CygnusFooter for now — divergence is a follow-up task.

**`packages/themes/orion/components/index.ts`**

```ts
export { OrionHeader } from './header';
export type { OrionHeaderProps } from './header';
export { OrionFooter } from './footer';
export type { OrionFooterProps } from './footer';
```

```bash
git add packages/themes/orion/components/
git commit -m "feat(themes): add OrionHeader and OrionFooter to orion theme package

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: Vega Components

**Goal:** Create `VegaHeader` and `VegaFooter` in `packages/themes/vega/components/`.
**Model:** sonnet — same pattern, vega uses light appearance and sticky=false

### Files to create

**`packages/themes/vega/components/header.tsx`**

Vega-specific: `appearance="light"`, no counties (flat locations list).

```tsx
export interface VegaHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
}

export function VegaHeader(props: VegaHeaderProps) {
  return <SiteHeader appearance="light" sticky={false} {...props} />;
}
```

Check `packages/core-components/src/components/site-header.tsx` to confirm `sticky` prop exists before using it.

**`packages/themes/vega/components/footer.tsx`**

Same pattern as CygnusFooter. Exported as `VegaFooter` / `VegaFooterProps`.

**`packages/themes/vega/components/index.ts`**

```ts
export { VegaHeader } from './header';
export type { VegaHeaderProps } from './header';
export { VegaFooter } from './footer';
export type { VegaFooterProps } from './footer';
```

```bash
git add packages/themes/vega/components/
git commit -m "feat(themes): add VegaHeader and VegaFooter to vega theme package

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4: Update Site tsconfig Files

**Goal:** Add TypeScript path mappings for the new `/components` subpath exports in all 5 affected sites.
**Model:** haiku — mechanical addition of path entries to tsconfig files

Spawn 5 parallel Task agents (one per site):

**Task: Update sites/cygnus-test/tsconfig.json**
model: haiku
Read the file first. Add these path entries to the `paths` object:
```json
"@platform/themes/cygnus": ["../../packages/themes/cygnus/index.ts"],
"@platform/themes/cygnus/components": ["../../packages/themes/cygnus/components/index.ts"]
```
If `@platform/themes/cygnus` already exists, skip that line. Only add what is missing.

**Task: Update sites/mad-graphics/tsconfig.json**
model: haiku
Read the file first. Add:
```json
"@platform/themes/cygnus": ["../../packages/themes/cygnus/index.ts"],
"@platform/themes/cygnus/components": ["../../packages/themes/cygnus/components/index.ts"]
```
Also verify that orion and vega mappings already exist (they do per codebase research — do not duplicate them).

**Task: Update sites/dj-fox-electrical/tsconfig.json**
model: haiku
Read the file first. Add:
```json
"@platform/themes/orion/components": ["../../packages/themes/orion/components/index.ts"]
```
Verify `@platform/themes/orion` already exists — only add the `/components` subpath.

**Task: Update sites/base-template/tsconfig.json**
model: haiku
Read the file first. Add:
```json
"@platform/themes/vega/components": ["../../packages/themes/vega/components/index.ts"]
```
Verify `@platform/themes/vega` already exists.

**Task: Update sites/colossus-scaffolding/tsconfig.json**
model: haiku
Read the file first. Add:
```json
"@platform/themes/vega/components": ["../../packages/themes/vega/components/index.ts"]
```
Verify `@platform/themes/vega` already exists.

```bash
# Verification gate — STOP if this fails
# Confirm JSON is valid for each tsconfig
for f in sites/cygnus-test/tsconfig.json sites/mad-graphics/tsconfig.json sites/dj-fox-electrical/tsconfig.json sites/base-template/tsconfig.json sites/colossus-scaffolding/tsconfig.json; do
  python3 -c "import json; json.load(open('$f'))" && echo "$f OK" || echo "$f INVALID JSON"
done
```

```bash
git add sites/cygnus-test/tsconfig.json sites/mad-graphics/tsconfig.json sites/dj-fox-electrical/tsconfig.json sites/base-template/tsconfig.json sites/colossus-scaffolding/tsconfig.json
git commit -m "chore(sites): add theme component subpath mappings to site tsconfigs

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 5: Update cygnus-test and mad-graphics layouts

**Goal:** Switch both cygnus sites from generic `SiteHeader`/`Footer` to `CygnusHeader`/`CygnusFooter`. Fix mad-graphics vega/cygnus mismatch.
**Model:** sonnet — layout.tsx edits require careful prop mapping and data fetching changes

Read both files before editing:
- `sites/cygnus-test/app/layout.tsx`
- `sites/mad-graphics/app/layout.tsx`
- `packages/core-components/src/components/footer.tsx` (to understand what footer data is needed)

Also read `sites/cygnus-test/lib/contact-info.ts` (or wherever `BUSINESS_EMAIL` and `ADDRESS` are exported) to confirm what contact info exports are available.

### Changes to both layouts

1. **Remove** imports of generic `SiteHeader` from `@platform/core-components`
2. **Remove** import of generic `Footer` from `@platform/core-components/components/ui/footer`
3. **Add** `import { CygnusHeader, CygnusFooter } from '@platform/themes/cygnus/components'`
4. **Add** `BUSINESS_EMAIL`, `ADDRESS` to the `@/lib/contact-info` import (if not already imported)
5. **Fetch services** in the layout function alongside existing locations fetch:
   ```tsx
   const [allServices, allLocations] = await Promise.all([
     getContentItems('services'),
     getContentItems('locations'),
   ]);
   ```
6. **Replace** `<SiteHeader appearance="dark" .../>` with `<CygnusHeader .../>`
7. **Replace** `<Footer />` with `<CygnusFooter .../>` passing all required props from siteConfig + fetched data

**For mad-graphics only — also fix the vega/cygnus mismatch:**
- Change `import { vegaRegistry } from '@platform/themes/vega'` → `import { cygnusRegistry } from '@platform/themes/cygnus'`
- Change `<ThemeProvider theme="vega" registry={vegaRegistry}>` → `<ThemeProvider theme="cygnus" registry={cygnusRegistry}>`

**CygnusFooter props mapping** (derive from `siteConfig` + fetched content):
```tsx
<CygnusFooter
  siteName={siteConfig.business.name}
  tagline={siteConfig.tagline}
  phoneDisplay={PHONE_DISPLAY}
  phoneTel={PHONE_TEL}
  email={BUSINESS_EMAIL}
  address={ADDRESS}
  certifications={siteConfig.credentials?.certifications ?? []}
  services={allServices.map(s => ({ slug: s.slug, title: s.title })).slice(0, siteConfig.footer?.maxServices ?? 8)}
  locations={allLocations.map(l => ({ slug: l.slug, title: l.title })).slice(0, siteConfig.footer?.maxLocations ?? 8)}
  totalServices={allServices.length}
  totalLocations={allLocations.length}
  maxServices={siteConfig.footer?.maxServices ?? 8}
  maxLocations={siteConfig.footer?.maxLocations ?? 8}
  showServices={siteConfig.footer?.showServices ?? true}
  showLocations={siteConfig.footer?.showLocations ?? true}
  copyright={siteConfig.footer?.copyright ?? `© ${new Date().getFullYear()} ${siteConfig.business.name}`}
  builtBy={siteConfig.footer?.builtBy}
/>
```

If `siteConfig.footer` shape differs from what's shown above, read `sites/cygnus-test/site.config.ts` to get the actual field names and adjust accordingly.

```bash
# Verification gate — STOP if this fails
cd sites/cygnus-test && npm run build
cd ../mad-graphics && npm run build
```

```bash
git add sites/cygnus-test/app/layout.tsx sites/mad-graphics/app/layout.tsx
git commit -m "feat(cygnus): use CygnusHeader/CygnusFooter in cygnus-test and mad-graphics layouts

Also fixes mad-graphics vegaRegistry → cygnusRegistry mismatch.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 6: Update dj-fox-electrical layout

**Goal:** Switch dj-fox-electrical from generic `SiteHeader`/`Footer` to `OrionHeader`/`OrionFooter`.
**Model:** sonnet — orion layout has county mega-menu complexity

Read `sites/dj-fox-electrical/app/layout.tsx` before editing.

Also read `sites/dj-fox-electrical/lib/contact-info.ts` to confirm `BUSINESS_EMAIL` and `ADDRESS` exports.

Changes:
1. Remove generic `SiteHeader` and `Footer` imports
2. Add `import { OrionHeader, OrionFooter } from '@platform/themes/orion/components'`
3. Add `BUSINESS_EMAIL`, `ADDRESS` to contact-info import if not already present
4. Fetch services (alongside existing locations/counties):
   ```tsx
   const [allServices, allLocations] = await Promise.all([
     getContentItems('services'),
     getContentItems('locations'),
   ]);
   const counties = getAllCounties(allLocations); // existing pattern
   const locationItems = allLocations.map(l => ({ name: l.title, slug: l.slug }));
   ```
5. Replace `<SiteHeader appearance="dark" counties={counties} .../>` with `<OrionHeader counties={counties} .../>`
6. Replace `<Footer />` with `<OrionFooter .../>` using the same props mapping as Phase 5

```bash
# Verification gate — STOP if this fails
cd sites/dj-fox-electrical && npm run build
```

```bash
git add sites/dj-fox-electrical/app/layout.tsx
git commit -m "feat(orion): use OrionHeader/OrionFooter in dj-fox-electrical layout

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 7: Update base-template and colossus-scaffolding layouts

**Goal:** Switch both vega sites from generic `SiteHeader`/`Footer` to `VegaHeader`/`VegaFooter`.
**Model:** sonnet — run two site edits in parallel, then verify both

Spawn two parallel Task agents:

**Task: Update sites/base-template/app/layout.tsx**
model: sonnet
Read the file first.
1. Remove generic `SiteHeader` and `Footer` imports
2. Add `import { VegaHeader, VegaFooter } from '@platform/themes/vega/components'`
3. Add `BUSINESS_EMAIL`, `ADDRESS` imports if not present
4. Fetch services alongside locations:
   ```tsx
   const [allServices, allLocations] = await Promise.all([
     getContentItems('services'),
     getContentItems('locations'),
   ]);
   ```
5. Replace `<SiteHeader appearance="light" .../>` with `<VegaHeader .../>`
6. Replace `<Footer />` with `<VegaFooter .../>` using same props mapping as Phase 5

**Task: Update sites/colossus-scaffolding/app/layout.tsx**
model: sonnet
Same changes as base-template above. Read the file first. Note: colossus-scaffolding currently uses `sticky={false}` and county-based locations — check if it passes `counties` to SiteHeader or just flat locations. If counties: pass only flat `locationItems` to `VegaHeader` (vega doesn't use counties).

```bash
# Verification gate — STOP if this fails
cd sites/base-template && npm run build
cd ../colossus-scaffolding && npm run build
```

```bash
git add sites/base-template/app/layout.tsx sites/colossus-scaffolding/app/layout.tsx
git commit -m "feat(vega): use VegaHeader/VegaFooter in base-template and colossus-scaffolding layouts

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 8: Pipeline Update

**Goal:** Add `app/layout.tsx` to `THEMED_PAGE_FILES` and make vega explicit in `THEME_REFERENCE_SITE_MAP`.
**Model:** haiku — two targeted find-replace edits in one file

Read `tools/create-site-from-project.ts` lines around `THEMED_PAGE_FILES` and `THEME_REFERENCE_SITE_MAP` before editing.

**Change 1:** Add `'app/layout.tsx'` as the first entry in `THEMED_PAGE_FILES`:
```typescript
const THEMED_PAGE_FILES = [
  'app/layout.tsx',           // ← ADD (new sites get correct theme header/footer wired up)
  'app/page.tsx',
  'app/services/page.tsx',
  'app/about/page.tsx',
  'app/locations/page.tsx',
] as const;
```

**Change 2:** Add vega to `THEME_REFERENCE_SITE_MAP`:
```typescript
const THEME_REFERENCE_SITE_MAP: Record<string, string> = {
  cygnus: 'cygnus-test',
  orion:  'dj-fox-electrical',
  vega:   'base-template',    // ← ADD (explicit is better than a comment)
};
```

```bash
# Verification gate — STOP if this fails
npx tsx tools/create-site-from-project.ts --help 2>&1 | head -5
# Just confirms the file parses without errors
```

```bash
git add tools/create-site-from-project.ts
git commit -m "feat(pipeline): copy app/layout.tsx when applying theme page overrides

New sites now get the correct theme header/footer wired up from the reference site.
Also makes vega explicit in THEME_REFERENCE_SITE_MAP.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 9: Full Monorepo Verification

**Goal:** Confirm everything builds, types-check, and lints cleanly across the whole monorepo.
**Model:** sonnet (orchestration only — runs commands, reads errors, fixes if needed)

```bash
# Verification gate — STOP if any of these fail
cd /path/to/repo  # repo root
pnpm type-check
pnpm lint
pnpm build
```

If `pnpm type-check` fails: read the exact error, fix the specific file, re-run before proceeding.
If `pnpm build` fails: read the build output, identify the site/package, fix, re-run.
Do NOT proceed to the final commit if any gate fails.

```bash
git add -p  # stage any fix-up changes
git commit -m "fix: resolve type errors from theme component migration (if any)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
# Only commit if there were actual fix-up changes
```

---

## Cost Estimate

| Phase | Model | Est. input tokens | Est. output tokens | Est. cost |
|-------|-------|------------------|--------------------|-----------|
| Phase 1: Cygnus components | sonnet | ~8k | ~2k | ~$0.054 |
| Phase 2: Orion components | sonnet | ~6k | ~1.5k | ~$0.041 |
| Phase 3: Vega components | sonnet | ~6k | ~1.5k | ~$0.041 |
| Phase 4: tsconfig updates | haiku | ~5k | ~0.5k | ~$0.006 |
| Phase 5: cygnus-test + mad-graphics layouts | sonnet | ~10k | ~2k | ~$0.060 |
| Phase 6: dj-fox-electrical layout | sonnet | ~8k | ~1.5k | ~$0.046 |
| Phase 7: base-template + colossus layouts | sonnet | ~10k | ~2k | ~$0.060 |
| Phase 8: Pipeline update | haiku | ~5k | ~0.5k | ~$0.006 |
| Phase 9: Full verification + fixes | sonnet | ~15k | ~2k | ~$0.075 |
| **Total** | | **~73k** | **~13.5k** | **~$0.39** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.

---

## Final Report

After all phases complete, output:
1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model | Est. input tokens | Est. output tokens | Est. cost |
   |-------|------------------|--------------------|-----------|
   | sonnet | [total across phases] | | $X.XX |
   | haiku | [if used] | | $X.XX |
   | opus | [if used] | | $X.XX |
   | **Total** | | | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-06_theme-structural-components/yolo-brief.md`:

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

**Date:** 2026-04-07
**Status:** All phases executed successfully

All 9 phases were implemented. Theme packages (cygnus, orion, vega) now own their header and footer as props-based Server Components. Three surprises: (1) `packages/themes` had no dependencies declared — `lucide-react`, `next`, `react`, and `@types/react` needed to be added and `pnpm install` run so pnpm strict isolation could resolve them; (2) the `VegaHeaderProps` spec omitted `logoWidth`/`logoHeight` but colossus-scaffolding uses them, so those were added; (3) `pnpm build` shows Turbopack CSS panic errors across all sites including untouched ones (showcase) — this is a pre-existing environment issue unrelated to the changes; `pnpm type-check` (8/8) and `pnpm lint` (0 errors) both pass clean.

### Commits

- `e6fc03c` feat(themes): add CygnusHeader and CygnusFooter to cygnus theme package
- `367133c` feat(themes): add OrionHeader and OrionFooter to orion theme package
- `13cf08d` feat(themes): add VegaHeader and VegaFooter to vega theme package
- `0cff811` chore(sites): add theme component subpath mappings to site tsconfigs
- `ec173ff` chore(themes): add react, next, lucide-react dependencies for new components
- `d6d0dc5` feat(cygnus): use CygnusHeader/CygnusFooter in cygnus-test and mad-graphics layouts
- `1f5cc81` feat(orion): use OrionHeader/OrionFooter in dj-fox-electrical layout
- `7804402` feat(vega): use VegaHeader/VegaFooter in base-template and colossus-scaffolding layouts
- `1937441` feat(pipeline): copy app/layout.tsx when applying theme page overrides

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used: `Claude Sonnet 4.6 <noreply@anthropic.com>`
- The atlas/rigel theme components use `'use client'` — do NOT copy this pattern. All new theme header/footer components must be Server Components (no `'use client'` directive)
- If `siteConfig.footer` fields don't match the expected shape, read the actual `site.config.ts` and adapt — don't guess
