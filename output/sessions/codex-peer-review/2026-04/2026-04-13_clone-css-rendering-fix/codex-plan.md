# codex-plan.md

## Implementation Plan: Clone CSS Rendering Fix (Next.js + Tailwind + Extract Pipeline)

## 1) Strategy Decision (Core Architecture)

1. **Bypass PostCSS/Tailwind for clone CSS entirely** by serving clone CSS as a **static compiled stylesheet** from the site’s `/public` folder and loading via `<link rel="stylesheet">` in app layout/head.
2. Keep `site/app/globals.css` for Tailwind tokens/utilities only (platform layer), while clone CSS provides visual/layout fidelity.
3. Add an automated **CSS preprocessing pipeline inside `extract-theme.ts`** (or helper module it calls) to:
   - select/merge relevant CSS files,
   - sanitize problematic syntax/URLs/fonts,
   - output one safe runtime CSS file plus manifest.
4. Copy clone assets (images + optional fonts/icons) into a stable public path and rewrite URLs accordingly.

**Why:** This avoids Turbopack/PostCSS parser failures and preserves fidelity while still allowing Tailwind utilities in platform components.

---

## 2) Target Runtime Contract

Implement a generic runtime contract for clone-based themes:

- **Static stylesheet path:**  
  `/clone-assets/<theme-slug>/styles/clone.css`
- **Static assets path:**  
  `/clone-assets/<theme-slug>/images/*`, `/fonts/*`, `/icons/*` as needed
- **Optional manifest:**  
  `packages/themes/<theme>/clone-assets.manifest.json` (debug + reproducibility)

At render time (site layout):

- Inject `<link href="/clone-assets/<theme>/styles/clone.css" rel="stylesheet" />`
- Keep Tailwind globals loaded normally.

---

## 3) Phase 1 — Add CSS Preprocessing Module (tools)

### Files to create/modify

1. **Create** `tools/lib/clone-css-preprocessor.ts`
2. **Modify** `tools/extract-theme.ts` to call preprocessor instead of embedding raw clone CSS in theme `globals.css`.

### Preprocessor responsibilities

1. **Input discovery**
   - Read clone CSS dir (`output/clones/<clone>/assets/css/`).
   - Classify CSS files into:
     - core layout/framework (high priority),
     - page-specific overrides,
     - plugin/vendor low-priority.
2. **Selection strategy (generic, deterministic)**
   - Include all core + page CSS by default.
   - Exclude known noisy plugin CSS by heuristic list (e.g. WooCommerce/events plugin files) unless selectors are detected in clone JSX.
   - Keep this rule-driven and overrideable via config object (not hardcoded to corvus only).
3. **Sanitization transforms**
   - Remove/replace malformed at-rules/selectors that break bundlers (only where necessary).
   - Normalize extreme minified lines (safe splitting where possible).
   - Rewrite `url(...)`:
     - convert relative URLs to absolute `/clone-assets/<theme>/...` paths,
     - drop or comment unresolved references when files do not exist.
4. **Font handling**
   - Parse `@font-face`.
   - If font files exist in clone assets: copy and rewrite URLs.
   - If missing: replace family to fallback stack (or strip unusable `@font-face`) and record warning.
5. **Output**
   - Write merged sanitized CSS to:
     - theme package artifact (for traceability), and/or
     - staging output for site public copy step.
   - Emit manifest with:
     - included/excluded files,
     - rewritten URLs count,
     - unresolved assets,
     - font fallback actions.

### Verification gate

- Run preprocessor for corvus and assert:
  - output CSS file exists,
  - no unresolved parser-breaking constructs remain (basic static checks),
  - manifest generated with non-empty included file list.

---

## 4) Phase 2 — Update Theme Generation Behavior

### Files to modify

1. **Modify** `tools/extract-theme.ts`:
   - Replace `generateGlobalsCss()` behavior:
     - **remove** invalid `@import "../theme-system/dist/base.css";`
     - stop embedding giant clone CSS inline.
   - Generate a lean theme `globals.css` containing only theme-level Tailwind-safe rules (if any).
   - Persist clone stylesheet as external asset artifact produced by preprocessor.

2. **Modify (if needed)** theme output template files in `packages/themes/<theme>/...` generation logic to include metadata:
   - clone asset folder name,
   - stylesheet relative target.

### Verification gate

- Regenerate corvus theme.
- Confirm `packages/themes/corvus/globals.css` is Tailwind-safe (no raw 370KB clone CSS, no broken import).
- Confirm preprocessed clone CSS artifact exists.

---

## 5) Phase 3 — Site Integration (load CSS via `<link>`)

### Files to modify

1. **Site layout for corvus test site** (`sites/_corvus-digital-marketing-events/app/layout.tsx` or equivalent):
   - add `<link rel="stylesheet" href="/clone-assets/corvus/styles/clone.css" />` in `<head>`.
2. **Site globals** (`sites/_corvus-digital-marketing-events/app/globals.css`):
   - keep `@tailwind utilities` and token layers.
   - isolate/reset base behavior if needed (see coexistence phase).
   - avoid importing raw clone CSS here.

### Verification gate

- `npx next dev` loads page without CSS parser errors.
- Network tab shows clone.css served as static asset.

---

## 6) Phase 4 — Public Asset Copy Pipeline

### Files to create/modify

1. **Create** helper in tools (e.g. `tools/lib/clone-asset-publisher.ts`) or include in preprocessor module.
2. **Modify** extraction/scaffold integration points so generated/scaffolded site receives:
   - `/public/clone-assets/<theme>/styles/clone.css`
   - `/public/clone-assets/<theme>/images/*`
   - optional `/fonts/*`, `/icons/*` required by rewritten URLs.

### Notes

- Do not modify forbidden files directly (`scaffold-client-site.ts` is listed as non-modifiable).  
  Therefore:
  - integrate copy step where allowed (`extract-theme.ts` or new post-extract script it invokes),
  - and ensure scaffolded sites can consume already-packaged assets from theme output.

### Verification gate

- Confirm 91 clone images are available under public clone-assets path.
- Confirm rendered page uses those assets (no 404 for images/icons/fonts).

---

## 7) Phase 5 — Tailwind Coexistence & Preflight Conflict Mitigation

### Approach

1. Keep Tailwind for platform utilities/tokens.
2. For clone sites, avoid global Preflight interference where possible:
   - Preferred: configure Tailwind with `corePlugins: { preflight: false }` **for clone test site only** (or clone profile).
   - Alternative if global change is risky: add scoped base override layer that reverts key Preflight conflicts for clone root.
3. Wrap clone-rendered pages/components in a stable root class (e.g. `.clone-root`) and add targeted compatibility rules only if required.

### Files to modify

- `sites/_corvus-digital-marketing-events/tailwind.config.*` (or site-specific Tailwind config path)
- Possibly site layout/page wrapper adding `className="clone-root"`

### Verification gate

- Compare rendered homepage against raw clone HTML visually:
  - heading sizes, body typography, spacing, section widths align.
- Tailwind utility classes still work in non-clone platform UI (`bg-brand-primary`, `text-h1` etc.).

---

## 8) Phase 6 — Build Compatibility (Dev + Prod)

### Required checks

1. `npx next dev` (Turbopack) succeeds without CSS parser crashes.
2. `npx next build --webpack` succeeds.
3. `pnpm type-check` succeeds.

### Why this should hold

- clone CSS is static linked and not processed by PostCSS/Turbopack CSS pipeline.
- Tailwind CSS remains conventional and small.

---

## 9) Phase 7 — Generalization for Future Clones

### Implement configurable policy

In preprocessor, define reusable config structure:

- file classification patterns,
- exclusion heuristics,
- URL rewrite rules,
- font policy (`copy-if-present`, `fallback-if-missing`),
- optional per-clone overrides JSON.

### Expected behavior for non-Breakdance clones

- If CSS is clean: include as-is with only URL/font rewrite.
- If framework-specific noise exists: apply heuristic exclusion + selector-reference detection from JSX.

### Verification gate

- Run extraction for at least one additional clone sample to ensure pipeline does not assume Breakdance-only filenames/selectors.

---

## 10) Risks / Trade-offs

1. **Visual fidelity vs. CSS exclusion**
   - Over-aggressive plugin CSS exclusion may remove needed rules.
   - Mitigation: conservative default include + manifest warnings + override config.
2. **Preflight disable impact**
   - Disabling Preflight for clone site may affect platform components.
   - Mitigation: use utility-first classes for platform components and add minimal base layer intentionally.
3. **Asset path drift**
   - URL rewriting must stay synchronized with copied asset tree.
   - Mitigation: manifest-driven copy + validation pass for broken URLs.
4. **Font licensing/availability**
   - Some cloned fonts may be unavailable.
   - Mitigation: fallback stack + explicit warning output.

---

## 11) Concrete Acceptance Mapping

1. **Visual fidelity in dev**: achieved by static clone.css + clone assets + preflight mitigation.
2. **`next build` no parser errors**: clone CSS bypasses bundler CSS parser.
3. **`pnpm type-check` pass**: only typed tool/site edits.
4. **Tailwind utilities work**: Tailwind kept in site globals; clone CSS isolated.
5. **Automated in extract pipeline**: preprocessor + asset publisher invoked by `extract-theme.ts`.
6. **Images render**: copied to `/public/clone-assets/...` and URL rewritten.
7. **Fonts load/degrade**: copy when present, fallback when missing.

---

## 12) Suggested Execution Order (with gates)

1. Build preprocessor + manifest generation.
2. Wire into `extract-theme.ts` and remove bad `theme-system` import behavior.
3. Add static stylesheet link in corvus site layout.
4. Implement asset copy + URL rewrite validation.
5. Resolve Tailwind preflight coexistence.
6. Run dev/build/type-check + visual parity pass.
7. Harden for generic clone support with config + docs.

---

```bash
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-13_clone-css-rendering-fix/
```
