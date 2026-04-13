I’ll draft the implementation plan and save it to the requested `codex-plan.md` path, then provide the exact synth command.

Implemented plan content for `output/sessions/codex-peer-review/2026-04-13_theme-browser/codex-plan.md`:

```md
# Codex Implementation Plan — Theme Browser Migration into DCS

## 1) Remove Showcase and Its Automation Debt

### 1.1 Delete dead app

- **Delete directory:** `sites/showcase/` (entire tree)

### 1.2 Remove showcase-specific code generation/sync

- **Modify:** `tools/sync-themes.ts`
  - Remove showcase path/constants and any write operations for:
    - `register-all-themes.ts` in showcase
    - any showcase-only manifests or generated imports
  - Remove logic at the noted hotspots (brief references lines ~26, 67–69, 124).
- **Modify:** `tools/scaffold-theme-package.ts`
  - Remove generation of `showcase-registry.tsx` stubs in new theme packages.
  - Keep any still-needed package scaffolding untouched.

### 1.3 Cleanup references

- Search and remove stale references:
  - `showcase-registry`
  - `register-all-themes`
  - `sites/showcase`
- Ensure no scripts/docs still assume showcase exists.

### Gate A (must pass before route work)

- `rg -n "showcase-registry|register-all-themes|sites/showcase" .`
  - Expect no functional references (docs/comments optional).
- `pnpm type-check`
  - Confirms script/type integrity after deletion.

---

## 2) Add Theme Preview Data Layer in DCS

Create a small, explicit registry for 11 themes (typed, no codegen).

### 2.1 Create theme preview registry

- **Create:** `sites/dcs/lib/theme-preview/themes.ts`
  - Static imports of all theme configs from `@platform/themes/*`.
  - For full themes (9), also import Header/Footer components (and optional page templates if available).
  - Define typed metadata per theme:
    - `slug` (`atlas`, `castor`, ..., `sirius`)
    - `name`
    - `category`: `"full"` | `"tokens-only"`
    - `designVariant` badges (as needed by gallery)
    - key brand colours (derived from config or explicit display fields)
  - Export:
    - `allThemes`
    - `fullThemes`
    - `tokenOnlyThemes`
    - `getThemeBySlug(slug)`

### 2.2 Add shared mock content + render adapters

- **Create:** `sites/dcs/lib/theme-preview/mocks.ts`
  - Shared mock business/profile/nav/cta/location content.
- **Create:** `sites/dcs/lib/theme-preview/renderers.tsx`
  - Adapter functions that map shared mock data to each theme component’s specific prop contract.
  - Avoid 9 route-level conditionals by centralizing differences here.
  - Example output shape per theme:
    - `renderHeader()`
    - `renderHeroStub()`
    - `renderCardGridStub()`
    - `renderFooter()`
    - `renderPageTemplate?()` (when theme exports it)

### Why this approach

- Keeps route components clean and mostly declarative.
- Handles prop variance (e.g., Orion vs Solaris headers) in one typed layer.
- Static imports are acceptable at 11 themes and reduce hidden magic/maintenance risk.

### Gate B

- `pnpm type-check`
  - Ensures adapter signatures satisfy each imported component’s props.

---

## 3) Build `/theme-preview` Route Group in DCS (Unlisted)

### 3.1 Route structure

- **Create:** `sites/dcs/app/theme-preview/layout.tsx`
  - Nested layout for all preview pages.
  - Add route metadata robots rules:
    - `index: false`, `follow: false` (noindex/nofollow)
  - Simple wrapper/title; do **not** touch global nav config.
- **Create:** `sites/dcs/app/theme-preview/page.tsx`
  - Gallery grid for all themes.
- **Create:** `sites/dcs/app/theme-preview/[name]/page.tsx`
  - Per-theme detail page.
- **Create:** `sites/dcs/app/theme-preview/ui-kit/page.tsx`
  - Solaris-native UI kit examples.

> Note: DCS root layout remains additive (Solaris frame stays). This is expected/accepted.

### 3.2 Gallery page requirements

- Card per theme showing:
  - Theme name
  - Design variant badge(s)
  - Font names (from config metadata where available)
  - Colour swatches (primary/secondary/accent/surface tokens)
  - Link to `/theme-preview/[slug]`
- For token-only themes, visually indicate “Design spec only”.

### Gate C

- Run dev and verify:
  - `/theme-preview` renders 11 cards.
  - Route is reachable but not linked from main nav.

---

## 4) Implement CSS Variable Injection for Live Rendering

### 4.1 Theme scope wrapper

- In detail page, call:
  - `generateCssVariables(theme.config)` from `@platform/theme-system`
- Apply to wrapper:
  - `<section style={cssVarsAsStyle}> ...theme preview... </section>`
- Create helper (optional) for typing cast:
  - `Record<string,string> -> React.CSSProperties`

### 4.2 What this guarantees

- Cascading CSS custom properties override Solaris root tokens within wrapper scope.
- Tailwind utilities using `var(--color-...)` resolve to selected theme inside that subtree.
- No theme package modifications required.

### Known limitation (acceptable per brief)

- Global utility class definitions (`.btn-primary`, `.card`) come from Solaris CSS, so non-colour traits can drift slightly.
- Colour identity and broad style are still accurately previewed.

### Gate D

- Visual verify `/theme-preview/orion` appears Orion red/orange (not Solaris blue).

---

## 5) Per-Theme Detail Page Behavior

### 5.1 Full themes (9)

For each full theme slug:

- Render (inside CSS-vars wrapper):
  - Theme Header (live component)
  - Hero stub section (shared mock content)
  - Card grid stub section
  - Theme Footer (live component)
- If a theme exports page templates and adapter supports it, optionally render a template block as additional section.

### 5.2 Token-only themes (`polaris`, `sirius`)

- Do **not** attempt component imports that do not exist.
- Render:
  - Theme metadata + swatches + typography/token highlights
  - Notice text:
    - “Design spec — no component implementations yet”

### 5.3 404 handling

- Unknown slug in `[name]` route:
  - `notFound()`.

### Gate E

- `/theme-preview/orion` shows Orion header/hero/footer in Orion colours.
- `/theme-preview/polaris` shows graceful token-only notice.

---

## 6) Solaris UI Kit Page

### 6.1 Build `/theme-preview/ui-kit`

- Render Solaris in native context (no special CSS override needed).
- Include:
  - Buttons (primary/secondary/ghost etc. as available)
  - Cards
  - Type scale samples
  - Colour palette swatches
- Prefer existing Solaris classes/components already available in DCS/theme packages.

### 6.2 Optional consistency

- Also allow `/theme-preview/solaris` via generic detail page for parity with other themes.
- `ui-kit` remains the curated Solaris demo surface.

### Gate F

- `/theme-preview/ui-kit` and `/theme-preview/solaris` both render valid Solaris visuals.

---

## 7) Sitemap and Indexing Protections

### 7.1 Keep out of sitemap

- **Review/Modify:** `sites/dcs/app/sitemap.ts`
  - Ensure no `/theme-preview` URLs are emitted.
  - If sitemap is composed from route arrays, explicitly exclude prefix `/theme-preview`.
  - If static list, no change except verify absence.

### 7.2 Keep out of navigation

- **No change expected:** `sites/dcs/site.config.ts`
  - Confirm no theme-preview nav entries added.

### 7.3 Robots metadata

- Route-level metadata from `app/theme-preview/layout.tsx` applies noindex/nofollow to all child pages.

### Gate G

- Inspect generated sitemap output (or source list) → no `/theme-preview*`.
- View page `<meta name="robots"...>` confirms noindex/nofollow on preview routes.

---

## 8) Final Validation + Build Confidence

### 8.1 Required checks

- `pnpm type-check`
- `pnpm --filter dcs build`

### 8.2 Manual acceptance walkthrough

- `/theme-preview` grid with swatches + badges
- `/theme-preview/orion` live components in Orion palette
- `/theme-preview/solaris` or `/theme-preview/ui-kit` Solaris-native render
- `/theme-preview/polaris` token-only message
- No sitemap/nav leakage

### 8.3 Regression check after showcase removal

- Run any tooling workflow that previously touched showcase (`sync-themes`, scaffold).
- Ensure they complete without attempting showcase file writes.

---

## Risks / Trade-offs

1. **Root Solaris shell remains visible**  
   By Next.js additive layout design. Accepted in brief.

2. **Utility class drift across themes**  
   Token override gives correct colours; some radius/weight details may reflect Solaris globals. Accepted limitation.

3. **Static registry maintenance**  
   Adding future themes requires one registry edit. This is explicit and safer than hidden codegen.

4. **Bundle weight on preview routes**  
   Importing many theme components increases route bundle/server load. Acceptable for unlisted preview tool; can optimize later with dynamic imports if needed.
```

/plan.with.codex synthesise
