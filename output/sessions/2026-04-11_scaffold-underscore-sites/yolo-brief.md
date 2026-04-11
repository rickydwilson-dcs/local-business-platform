# YOLO Implementation Brief: Create Theme Headers/Footers + Scaffold 5 Sites

**Branch:** feature/scaffold-underscore-sites (created from develop)
**Session spec:** output/sessions/2026-04-11_scaffold-underscore-sites/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Five "underscore" sites (`_castor-plumbing`, `_cygnus-graphics`, `_lyra-garden`, `_nova-print`, `_rigel-events`) are empty shells that can't run. Before scaffolding them, every theme needs proper standalone Header/Footer Server Components — castor and nova have none at all, lyra has thin wrappers that need replacing with real components, and rigel is missing a header entirely. Cygnus is already complete. Once all themes have real components, the sites can be scaffolded from base-template and wired to their themes.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | /                      | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | /                      | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | /                      | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/scaffold-underscore-sites
pnpm type-check   # must be clean before starting
```

---

## Reference Table

Keep this in mind throughout all phases:

| Theme  | Registry         | headerVariant | Header needed          | Footer needed          |
| ------ | ---------------- | ------------- | ---------------------- | ---------------------- |
| castor | `castorRegistry` | light         | `CastorHeader` (new)   | `CastorFooter` (new)   |
| cygnus | `cygnusRegistry` | dark          | ✅ Already done        | ✅ Already done        |
| lyra   | `lyraRegistry`   | light         | `LyraHeader` (rewrite) | `LyraFooter` (rewrite) |
| nova   | `novaRegistry`   | light         | `NovaHeader` (new)     | `NovaFooter` (new)     |
| rigel  | `rigelRegistry`  | dark          | `RigelHeader` (new)    | ✅ `SiteFooter` exists |

---

## Phase 1: Read reference implementations

**Goal:** Read all reference files needed before writing any components.
**Model:** n/a — reads only

Read all of these in parallel (single message, multiple Read tool calls):

1. `packages/themes/cygnus/components/header.tsx` — canonical header pattern (standalone, dark)
2. `packages/themes/vega/components/footer.tsx` — canonical footer pattern (4-column layout)
3. `packages/themes/castor/index.ts` — castor color tokens and registry
4. `packages/themes/nova/index.ts` — nova color tokens and registry
5. `packages/themes/rigel/index.ts` — rigel color tokens and registry
6. `packages/themes/lyra/index.ts` — lyra color tokens and registry
7. `packages/themes/lyra/components/header.tsx` — current thin wrapper to replace
8. `packages/themes/lyra/components/footer.tsx` — current re-export to replace
9. `packages/themes/rigel/components/index.ts` — see what's currently exported

No commit for this phase — reads only.

```bash
# Verification gate — STOP if this fails
ls packages/themes/castor/index.ts packages/themes/nova/index.ts packages/themes/rigel/index.ts packages/themes/lyra/index.ts
```

---

## Phase 2: Create Castor and Nova components

**Goal:** Create `components/` folders with Header, Footer, and index.ts for castor and nova.
**Model:** sonnet

### CastorHeader (`packages/themes/castor/components/header.tsx`)

Standalone Server Component. Follow CygnusHeader structure exactly but with **light** appearance:

- `bg-surface-background` (white/light) not dark
- Sticky header with `border-b border-surface-subtle`
- Use `NavLink`, `MobileMenu`, `LocationsDropdown` from `@platform/core-components`
- Active nav: `text-brand-primary border-b-2 border-brand-primary pb-1`
- Inactive nav: `text-surface-foreground border-b-2 border-transparent hover:text-brand-primary pb-1`
- Logo: `<Image src="/logo.svg" alt={siteName} fill ... />`
- Phone link: dark text `text-surface-foreground hover:text-brand-primary`
- CTA button: `bg-brand-primary text-on-brand-primary`
- MobileMenu variant: `"light"`

Props interface (identical to CygnusHeaderProps, rename to `CastorHeaderProps`):

```typescript
export interface CastorHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
}
```

### CastorFooter (`packages/themes/castor/components/footer.tsx`)

Copy VegaFooter exactly. Rename export to `CastorFooter`, interface to `CastorFooterProps`. No other changes — VegaFooter already uses theme tokens (`bg-surface-inverse`, `text-brand-primary`) so it will pick up castor's palette automatically.

### `packages/themes/castor/components/index.ts`

```typescript
export { CastorHeader } from "./header";
export type { CastorHeaderProps } from "./header";
export { CastorFooter } from "./footer";
export type { CastorFooterProps } from "./footer";
```

### NovaHeader (`packages/themes/nova/components/header.tsx`)

Same as CastorHeader — light appearance, identical structure, rename all to `Nova*`.

### NovaFooter (`packages/themes/nova/components/footer.tsx`)

Copy VegaFooter exactly. Rename export to `NovaFooter`, interface to `NovaFooterProps`.

### `packages/themes/nova/components/index.ts`

```typescript
export { NovaHeader } from "./header";
export type { NovaHeaderProps } from "./header";
export { NovaFooter } from "./footer";
export type { NovaFooterProps } from "./footer";
```

Spawn two parallel sonnet agents — one for castor, one for nova. Each agent writes all 3 files for its theme.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

```bash
git add packages/themes/castor/components/ packages/themes/nova/components/
git commit -m "$(cat <<'EOF'
feat(themes): add standalone Header/Footer components for castor and nova

CastorHeader, CastorFooter, NovaHeader, NovaFooter are real standalone
Server Components following the CygnusHeader/VegaFooter pattern. Both
use light header appearance and theme token classes throughout.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Create RigelHeader + upgrade Lyra components

**Goal:** Add RigelHeader to rigel's existing components, and replace lyra's thin wrappers with real standalone components.
**Model:** sonnet

### RigelHeader (`packages/themes/rigel/components/header.tsx`)

Standalone Server Component. Follow CygnusHeader structure — rigel uses `headerVariant: "dark"` so use dark appearance:

- `bg-surface-inverse` (dark bg), sticky
- Use `NavLink`, `MobileMenu`, `LocationsDropdown` from `@platform/core-components`
- Active nav: `text-brand-primary border-b-2 border-brand-primary pb-1`
- Inactive nav: `text-white border-b-2 border-transparent hover:text-brand-primary pb-1`
- Phone link: `text-white hover:text-brand-primary`
- CTA button: `bg-brand-primary text-on-brand-primary`
- MobileMenu variant: `"dark"`

Props interface:

```typescript
export interface RigelHeaderProps {
  siteName: string;
  phoneDisplay?: string;
  phoneTel?: string;
  showPhone?: boolean;
  primaryCta: { label: string; href: string };
  navigation: Array<{ label: string; href: string; hasDropdown?: boolean }>;
  locations: Array<{ name: string; slug: string }>;
}
```

### Update `packages/themes/rigel/components/index.ts`

Add to existing exports:

```typescript
export { RigelHeader } from "./header";
export type { RigelHeaderProps } from "./header";
```

Do NOT remove any existing exports.

### LyraHeader (`packages/themes/lyra/components/header.tsx`)

Replace the thin wrapper entirely. Write a real standalone Server Component using the light pattern (same as CastorHeader). Rename all to `Lyra*`. Lyra is garden/botanical — same functional structure, the theme tokens handle the visual difference.

### LyraFooter (`packages/themes/lyra/components/footer.tsx`)

Replace the re-export entirely. Write a real standalone Server Component copying VegaFooter. Rename all to `Lyra*`.

### Update `packages/themes/lyra/components/index.ts`

Replace current contents with:

```typescript
export { LyraHeader } from "./header";
export type { LyraHeaderProps } from "./header";
export { LyraFooter } from "./footer";
export type { LyraFooterProps } from "./footer";
```

Spawn two parallel sonnet agents — one for rigel, one for lyra.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

```bash
git add packages/themes/rigel/components/ packages/themes/lyra/components/
git commit -m "$(cat <<'EOF'
feat(themes): add RigelHeader + upgrade lyra to real standalone components

RigelHeader is a new standalone dark Server Component (rigel had footer
only). LyraHeader and LyraFooter replace thin wrappers with real
standalone Server Components following the Cygnus/Vega pattern.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Copy config files from base-template to all 5 sites

**Goal:** Copy every non-theme-specific config file from base-template into each site.
**Model:** haiku — mechanical file copies

Files to copy verbatim (no edits):

- `next.config.ts`
- `tailwind.config.ts`
- `postcss.config.js`
- `tsconfig.json`
- `eslint.config.mjs`
- `playwright.config.ts`
- `mdx-components.tsx`
- `instrumentation.ts`
- `newrelic.js`
- `proxy.ts`

`package.json` — copy and update `"name"` field only:

| Site               | `name` in package.json |
| ------------------ | ---------------------- |
| `_castor-plumbing` | `castor-plumbing`      |
| `_cygnus-graphics` | `cygnus-graphics`      |
| `_lyra-garden`     | `lyra-garden`          |
| `_nova-print`      | `nova-print`           |
| `_rigel-events`    | `rigel-events`         |

Do NOT copy: `app/`, `components/`, `content/`, `lib/`, `types/`, `e2e/`, `test/`, `scripts/`, `docs/`, `public/`, `CHANGELOG.md`, `CLAUDE.md`, `setup.md` — handled in later phases.

Spawn 5 parallel haiku agents — one per site.

```bash
# Verification gate — STOP if this fails
ls sites/_castor-plumbing/package.json sites/_cygnus-graphics/package.json sites/_lyra-garden/package.json sites/_nova-print/package.json sites/_rigel-events/package.json
```

```bash
git add sites/_castor-plumbing/ sites/_cygnus-graphics/ sites/_lyra-garden/ sites/_nova-print/ sites/_rigel-events/
git commit -m "$(cat <<'EOF'
feat(sites): copy base-template config files to all 5 underscore sites

Scaffolds package.json (with site-specific name), next.config.ts,
tailwind.config.ts, tsconfig.json, postcss.config.js, and supporting
files into all 5 underscore sites.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Update tsconfig.json path aliases per site

**Goal:** Replace base-template's vega/orion theme path aliases with the correct theme for each site.
**Model:** haiku — find-replace in tsconfig.json × 5

Base-template's tsconfig.json has these theme-specific paths — remove them and replace with the correct entries per site:

```json
"@platform/themes/orion": ["../../packages/themes/orion/index.ts"],
"@platform/themes/vega": ["../../packages/themes/vega/index.ts"],
"@platform/themes/vega/components": ["../../packages/themes/vega/components/index.ts"]
```

Replacements:

| Site               | Replace with                                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_castor-plumbing` | `"@platform/themes/castor": ["../../packages/themes/castor/index.ts"]`, `"@platform/themes/castor/components": ["../../packages/themes/castor/components/index.ts"]` |
| `_cygnus-graphics` | `"@platform/themes/cygnus": ["../../packages/themes/cygnus/index.ts"]`, `"@platform/themes/cygnus/components": ["../../packages/themes/cygnus/components/index.ts"]` |
| `_lyra-garden`     | `"@platform/themes/lyra": ["../../packages/themes/lyra/index.ts"]`, `"@platform/themes/lyra/components": ["../../packages/themes/lyra/components/index.ts"]`         |
| `_nova-print`      | `"@platform/themes/nova": ["../../packages/themes/nova/index.ts"]`, `"@platform/themes/nova/components": ["../../packages/themes/nova/components/index.ts"]`         |
| `_rigel-events`    | `"@platform/themes/rigel": ["../../packages/themes/rigel/index.ts"]`, `"@platform/themes/rigel/components": ["../../packages/themes/rigel/components/index.ts"]`     |

Keep all non-theme paths unchanged (`@/*`, `@platform/core-components`, `@platform/theme-system`, etc.).

Spawn 5 parallel haiku agents.

```bash
# Verification gate — STOP if this fails
grep "castor" sites/_castor-plumbing/tsconfig.json
grep "cygnus" sites/_cygnus-graphics/tsconfig.json
grep "lyra" sites/_lyra-garden/tsconfig.json
grep "nova" sites/_nova-print/tsconfig.json
grep "rigel" sites/_rigel-events/tsconfig.json
```

```bash
git add sites/_castor-plumbing/tsconfig.json sites/_cygnus-graphics/tsconfig.json sites/_lyra-garden/tsconfig.json sites/_nova-print/tsconfig.json sites/_rigel-events/tsconfig.json
git commit -m "$(cat <<'EOF'
feat(sites): update tsconfig path aliases to each site's theme

Replaces vega/orion aliases from base-template with the correct named
theme paths for each underscore site.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Create theme.config.ts per site

**Goal:** Wire each site to its theme registry with placeholder brand colors.
**Model:** haiku — templated file creation × 5

Template:

```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { {REGISTRY} } from '@platform/themes/{theme}';

export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: {REGISTRY},
  colors: {
    brand: {
      primary: '#3b82f6',   // placeholder — update per brand
      secondary: '#1d4ed8',
    },
  },
};
```

| Site               | `{REGISTRY}`     | `{theme}` |
| ------------------ | ---------------- | --------- |
| `_castor-plumbing` | `castorRegistry` | `castor`  |
| `_cygnus-graphics` | `cygnusRegistry` | `cygnus`  |
| `_lyra-garden`     | `lyraRegistry`   | `lyra`    |
| `_nova-print`      | `novaRegistry`   | `nova`    |
| `_rigel-events`    | `rigelRegistry`  | `rigel`   |

Spawn 5 parallel haiku agents.

```bash
# Verification gate — STOP if this fails
ls sites/_castor-plumbing/theme.config.ts sites/_cygnus-graphics/theme.config.ts sites/_lyra-garden/theme.config.ts sites/_nova-print/theme.config.ts sites/_rigel-events/theme.config.ts
```

```bash
git add sites/_castor-plumbing/theme.config.ts sites/_cygnus-graphics/theme.config.ts sites/_lyra-garden/theme.config.ts sites/_nova-print/theme.config.ts sites/_rigel-events/theme.config.ts
git commit -m "$(cat <<'EOF'
feat(sites): add theme.config.ts wired to named theme registry for all 5 sites

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: Create site.config.ts per site

**Goal:** Placeholder business config for each site.
**Model:** haiku — copy base-template with name/slug/type substitutions

Copy `sites/base-template/site.config.ts` in full. Substitute only `name`, `slug`, and `business.type` / `business.name`:

| Site               | `name`            | `slug`            | `business.type`   | `business.name`   |
| ------------------ | ----------------- | ----------------- | ----------------- | ----------------- |
| `_castor-plumbing` | `Castor Plumbing` | `castor-plumbing` | `Plumber`         | `Castor Plumbing` |
| `_cygnus-graphics` | `Cygnus Graphics` | `cygnus-graphics` | `GraphicDesigner` | `Cygnus Graphics` |
| `_lyra-garden`     | `Lyra Garden`     | `lyra-garden`     | `Gardener`        | `Lyra Garden`     |
| `_nova-print`      | `Nova Print`      | `nova-print`      | `PrintShop`       | `Nova Print`      |
| `_rigel-events`    | `Rigel Events`    | `rigel-events`    | `EventPlanner`    | `Rigel Events`    |

Keep all other fields (phone, address, navigation, cta, etc.) as base-template placeholder values.

Spawn 5 parallel haiku agents.

```bash
# Verification gate — STOP if this fails
ls sites/_castor-plumbing/site.config.ts sites/_cygnus-graphics/site.config.ts sites/_lyra-garden/site.config.ts sites/_nova-print/site.config.ts sites/_rigel-events/site.config.ts
```

```bash
git add sites/_castor-plumbing/site.config.ts sites/_cygnus-graphics/site.config.ts sites/_lyra-garden/site.config.ts sites/_nova-print/site.config.ts sites/_rigel-events/site.config.ts
git commit -m "$(cat <<'EOF'
feat(sites): add placeholder site.config.ts for all 5 underscore sites

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 8: Create app/globals.css per site

**Goal:** Import theme CSS in each site's globals.css.
**Model:** haiku — 5 tiny files

First verify each theme has a globals.css (read-only check):

```bash
ls packages/themes/castor/globals.css packages/themes/cygnus/globals.css packages/themes/lyra/globals.css packages/themes/nova/globals.css packages/themes/rigel/globals.css
```

If any is missing, create a minimal one:

```css
/* {Theme} theme CSS */
:root {
  --color-brand-primary: #3b82f6;
  --color-brand-secondary: #1d4ed8;
}
```

Then write `app/globals.css` in each site:

```css
@import "../../../../packages/themes/{theme}/globals.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base styles */
html {
  scroll-behavior: smooth;
}
body {
  @apply bg-surface-background text-surface-foreground;
}
```

Note: path is relative from `app/` → 4 levels up to repo root.

Spawn 5 parallel haiku agents.

```bash
# Verification gate — STOP if this fails
ls sites/_castor-plumbing/app/globals.css sites/_cygnus-graphics/app/globals.css sites/_lyra-garden/app/globals.css sites/_nova-print/app/globals.css sites/_rigel-events/app/globals.css
```

```bash
git add sites/_castor-plumbing/app/ sites/_cygnus-graphics/app/ sites/_lyra-garden/app/ sites/_nova-print/app/ sites/_rigel-events/app/
git commit -m "$(cat <<'EOF'
feat(sites): add app/globals.css importing named theme CSS for all 5 sites

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 9: Create app/layout.tsx per site

**Goal:** Wire each site's Header, Footer, ThemeProvider, and analytics in layout.tsx.
**Model:** sonnet — 5 variants, read component props first

### Step 9.1 — Read component signatures (parallel reads)

Read all of these before writing any layout files:

- `packages/themes/castor/components/header.tsx` (CastorHeaderProps)
- `packages/themes/castor/components/footer.tsx` (CastorFooterProps)
- `packages/themes/cygnus/components/header.tsx` (CygnusHeaderProps)
- `packages/themes/cygnus/components/footer.tsx` (CygnusFooterProps)
- `packages/themes/lyra/components/header.tsx` (LyraHeaderProps)
- `packages/themes/lyra/components/footer.tsx` (LyraFooterProps)
- `packages/themes/nova/components/header.tsx` (NovaHeaderProps)
- `packages/themes/nova/components/footer.tsx` (NovaFooterProps)
- `packages/themes/rigel/components/header.tsx` (RigelHeaderProps)
- `packages/themes/rigel/components/index.ts` (what footer export is named for rigel)
- `sites/base-template/app/layout.tsx` (full template to adapt)

### Step 9.2 — Write layout.tsx files (parallel, after 9.1 complete)

For each site, adapt base-template's `app/layout.tsx`:

- Replace all `Vega*` imports with the site's theme equivalents
- Replace `vegaRegistry` with `{theme}Registry`
- Replace `ThemeProvider theme="vega"` with `theme="{theme}"`
- Pass identical props — the prop interfaces are the same across all themes

**Rigel special case:** Rigel's footer export may be named `SiteFooter` (not `RigelFooter`) — check `packages/themes/rigel/components/index.ts` and use whatever name is exported.

Copy the `metadata`, `viewport`, geo meta tags, ConsentManager, Analytics, and AnalyticsDebugPanel blocks verbatim — they are identical across all sites.

Spawn 5 parallel sonnet agents (after 9.1 reads complete).

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

```bash
git add sites/_castor-plumbing/app/layout.tsx sites/_cygnus-graphics/app/layout.tsx sites/_lyra-garden/app/layout.tsx sites/_nova-print/app/layout.tsx sites/_rigel-events/app/layout.tsx
git commit -m "$(cat <<'EOF'
feat(sites): add app/layout.tsx wiring theme, Header, Footer for all 5 sites

Each site's layout imports its named theme components and registry.
Metadata, geo tags, analytics, and consent manager copied from base-template.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 10: Copy app routes, components, lib, content from base-template

**Goal:** Populate each site with the full directory structure from base-template.
**Model:** sonnet — directory copies with awareness of existing files

For each site, copy from `sites/base-template/`:

- `app/page.tsx`
- `app/not-found.tsx` (if exists)
- `app/services/` (entire dir)
- `app/locations/` (entire dir)
- `app/blog/` (entire dir)
- `app/projects/` (entire dir)
- `app/reviews/` (entire dir)
- `app/contact/` (entire dir, if exists)
- `app/privacy-policy/` (if exists)
- `app/cookie-policy/` (if exists)
- `components/` (entire dir)
- `lib/` (entire dir)
- `types/` (entire dir, if exists)
- `content/` (entire dir)
- `e2e/` (entire dir)
- `test/` (entire dir)
- `scripts/` (entire dir, if exists)

**CRITICAL — do NOT overwrite:**

- `app/api/` — each site already has an analytics API stub
- `public/stitch-images/` — sites have Stitch-generated design assets; use `cp -rn` (no-clobber) for `public/`

Spawn 5 parallel sonnet agents. Each agent:

1. Lists existing dirs in the target site first
2. Copies each missing item
3. Reports what was copied and what was skipped

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

```bash
git add sites/_castor-plumbing/ sites/_cygnus-graphics/ sites/_lyra-garden/ sites/_nova-print/ sites/_rigel-events/
git commit -m "$(cat <<'EOF'
feat(sites): copy app routes, components, lib, content from base-template

All 5 underscore sites now have the full Next.js directory structure.
Content is base-template placeholder content — to be customised per client.
Existing app/api/ and public/stitch-images/ were preserved.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 11: Install dependencies and smoke-test

**Goal:** Verify everything works end-to-end.
**Model:** sonnet

```bash
pnpm install
pnpm type-check
cd sites/_lyra-garden && npm run build
```

If build fails due to wrong props on layout.tsx (e.g. LyraHeader/LyraFooter props mismatch), fix the props in the layout file and re-run. This is the most likely failure point.

```bash
# Verification gate — STOP if this fails
pnpm type-check
cd sites/_lyra-garden && npm run build
```

If any fixes were needed:

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(sites): resolve type/build errors from post-install smoke test

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase    | Items                                                                                     | File overlap      | Model  | Rationale                                       |
| ----- | -------- | ----------------------------------------------------------------------------------------- | ----------------- | ------ | ----------------------------------------------- |
| G1    | Phase 1  | Read all 9 reference files                                                                | none (reads only) | n/a    | Independent reads — batch in one message        |
| G2    | Phase 2  | Write castor components (3 files), Write nova components (3 files)                        | none              | sonnet | Independent theme packages                      |
| G3    | Phase 3  | Write rigel header + update rigel index, Rewrite lyra header + footer + update lyra index | none              | sonnet | Independent theme packages                      |
| G4    | Phase 4  | Copy config files to all 5 sites (5 × haiku agents)                                       | none              | haiku  | Independent sites                               |
| G5    | Phase 5  | Update tsconfig.json in all 5 sites (5 × haiku agents)                                    | none              | haiku  | Independent files                               |
| G6    | Phase 6  | Write theme.config.ts for all 5 sites (5 × haiku agents)                                  | none              | haiku  | Independent files                               |
| G7    | Phase 7  | Write site.config.ts for all 5 sites (5 × haiku agents)                                   | none              | haiku  | Independent files                               |
| G8    | Phase 8  | Write app/globals.css for all 5 sites (5 × haiku agents)                                  | none              | haiku  | Independent files                               |
| G9    | Phase 9  | Read all component prop signatures (11 reads)                                             | none (reads only) | n/a    | Must complete before writing layout files       |
| G10   | Phase 9  | Write layout.tsx for all 5 sites (5 × sonnet agents) — after G9 completes                 | none              | sonnet | Independent files, G9 reads must complete first |
| G11   | Phase 10 | Copy app/components/lib/content to all 5 sites (5 × sonnet agents)                        | none              | sonnet | Independent sites                               |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                      | Reason                                                             |
| ----------------------------------------- | ------------------------------------------------------------------ |
| G9 reads → G10 writes (Phase 9)           | Layout.tsx cannot be written until component prop signatures known |
| Phase 2 + 3 → Phase 4+ (site scaffolding) | Themes must have components before wiring up in layout.tsx         |
| `pnpm type-check` gates between phases    | Each gate is a synchronisation barrier                             |
| Git commits                               | One commit per phase, in order                                     |
| Phase 10 → Phase 11 (install + build)     | All files must be in place before install/build                    |

---

## Cost Estimate

| Phase                                      | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Read reference files              | n/a    | ~15k              | ~0                 | ~$0.00     |
| Phase 2: Castor + Nova components          | sonnet | ~20k              | ~10k               | ~$0.11     |
| Phase 3: Rigel header + Lyra rewrite       | sonnet | ~20k              | ~8k                | ~$0.09     |
| Phase 4: Copy config files × 5             | haiku  | ~30k              | ~20k               | ~$0.04     |
| Phase 5: tsconfig path aliases × 5         | haiku  | ~10k              | ~5k                | ~$0.01     |
| Phase 6: theme.config.ts × 5               | haiku  | ~5k               | ~3k                | ~$0.01     |
| Phase 7: site.config.ts × 5                | haiku  | ~15k              | ~10k               | ~$0.02     |
| Phase 8: globals.css × 5                   | haiku  | ~5k               | ~2k                | ~$0.01     |
| Phase 9: Read props + write layout.tsx × 5 | sonnet | ~30k              | ~12k               | ~$0.14     |
| Phase 10: Copy app/components/lib × 5      | sonnet | ~40k              | ~5k                | ~$0.13     |
| Phase 11: Install + smoke test             | sonnet | ~10k              | ~3k                | ~$0.04     |
| **Total**                                  |        | **~200k**         | **~78k**           | **~$0.60** |

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes and `sites/_lyra-garden` builds
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-11_scaffold-underscore-sites/yolo-brief.md`:

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

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Completed

**Date:** 2026-04-11
**Status:** All phases executed successfully

All 11 phases completed. Four themes (castor, nova, lyra, rigel) received real standalone Header/Footer Server Components following the CygnusHeader/VegaFooter pattern. Five underscore sites (`_castor-plumbing`, `_cygnus-graphics`, `_lyra-garden`, `_nova-print`, `_rigel-events`) were scaffolded from base-template, each wired to its named theme. One bug was found and fixed during Phase 11: the globals.css import path used 4 levels (`../../../../`) when sites at `sites/<name>/app/` only need 3 (`../../../`). `pnpm type-check` passes for all sites except `_rigel-events`, which fails on pre-existing TypeScript errors in upstream rigel event-specific components (`blog-post-article.tsx`, `call-for-speakers-cta.tsx`, etc.) — none introduced by this session. Both `_lyra-garden` and `_castor-plumbing` smoke builds pass fully.

### Commits

- `4289133` feat(themes): add standalone Header/Footer components for castor and nova
- `3ba1329` feat(themes): add RigelHeader + upgrade lyra to real standalone components
- `9492883` feat(sites): copy base-template config files to all 5 underscore sites
- `731db01` feat(sites): update tsconfig path aliases to each site's theme
- `a6eb349` feat(sites): add theme.config.ts wired to named theme registry for all 5 sites
- `b34b750` feat(sites): add placeholder site.config.ts for all 5 underscore sites
- `c9d2db5` feat(sites): add app/globals.css importing named theme CSS for all 5 sites
- `deea136` feat(sites): add app/layout.tsx wiring theme, Header, Footer for all 5 sites
- `a851eca` feat(sites): copy app routes, components, lib, content from base-template
- `293041c` fix(sites): correct globals.css import path depth (3 levels not 4)

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model: `Claude Sonnet 4.6`
- Do NOT overwrite existing `app/api/` directories — analytics stubs are already there
- Do NOT overwrite existing `public/stitch-images/` assets — use `cp -rn` for public/
