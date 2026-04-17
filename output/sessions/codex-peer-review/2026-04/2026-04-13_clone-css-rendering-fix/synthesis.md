# Implementation Plan: Clone CSS Rendering Fix

**Date:** 2026-04-13
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                     | Claude                                                | Codex                                                                                   | Synthesised Decision                                                                                                                                                                                                        |
| -------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public asset path          | `/css/clone-styles.css` and `/images/`                | `/clone-assets/<theme>/styles/clone.css` and `/clone-assets/<theme>/images/`            | **Codex's namespaced path** — `/clone-assets/<theme>/` avoids collisions if a site ever mixes clone + platform assets, and is cleaner for multi-theme scenarios                                                             |
| Preflight disable method   | Remove `@tailwind base` from site globals.css         | `corePlugins: { preflight: false }` in Tailwind config                                  | **Codex's approach** — `corePlugins: { preflight: false }` is explicit, documented in Tailwind docs, and doesn't break `@tailwind components` layer. Removing the entire `@tailwind base` directive is heavier than needed. |
| Manifest/debugging         | Not mentioned                                         | `clone-assets.manifest.json` with included/excluded files, rewritten URLs, font actions | **Include manifest** — zero cost, valuable for debugging "why is X missing" questions                                                                                                                                       |
| Font handling              | Strip `@font-face` + add CSS fallback rule            | Copy if present, fallback if missing, record in manifest                                | **Same approach**, Codex adds manifest tracking which is better                                                                                                                                                             |
| CSS file categorisation    | Allowlist/blocklist with hardcoded defaults           | Heuristic classification + selector-reference detection from JSX                        | **Hybrid**: use allowlist defaults (simpler) but add a "referenced class check" pass — scan clone JSX for class names actually used, warn about CSS files with no matching selectors                                        |
| Scope of new files         | `tools/lib/clone-css-preprocessor.ts` only            | Separate `clone-css-preprocessor.ts` + `clone-asset-publisher.ts`                       | **Single file** (`clone-css-preprocessor.ts`) that handles both CSS and asset publishing — splitting into two modules is premature for what's essentially one sequential pipeline                                           |
| Layout template generation | Auto-generate site globals.css + layout modifications | Manual wiring documented in layout instructions                                         | **Auto-generate during componentize pass** — the whole point is automation. Document the contract, but also produce the files                                                                                               |

## Blind Spots Caught

- **Codex caught:** Namespaced public paths (`/clone-assets/<theme>/`) — Claude used flat paths that could collide with platform assets
- **Codex caught:** `corePlugins: { preflight: false }` is cleaner than removing `@tailwind base` entirely — preserves `@tailwind components` layer
- **Codex caught:** Manifest file for debugging and reproducibility
- **Claude caught:** The broken `@import "../theme-system/dist/base.css"` in `generateGlobalsCss()` needs explicit removal — Codex mentions it but doesn't detail the fix
- **Claude caught:** The inline CSS block extracted from clone JSX comment headers needs to be appended to the bundle (not just the 53 asset CSS files)
- **Claude caught:** Google Fonts in clones need `<link>` tags in layout.tsx (per established platform pattern), not CSS `@import`

---

## Implementation Plan

### Phase 1: Create CSS Preprocessor

**Goal:** New module that takes raw clone CSS files + inline CSS from JSX and produces a single sanitized bundle + asset manifest.

**File:** `tools/lib/clone-css-preprocessor.ts`

**Interface:**

```typescript
interface PreprocessorConfig {
  cloneDir: string; // e.g., "output/clones/corvus"
  themeName: string; // e.g., "corvus"
  customProperties?: string; // :root CSS variables from computed-styles.json
  inlineCss?: string; // CSS extracted from clone JSX comment blocks
  excludePatterns?: string[]; // Additional file patterns to exclude
}

interface PreprocessorResult {
  css: string; // The sanitized, combined CSS content
  manifest: {
    includedFiles: string[];
    excludedFiles: string[];
    rewrittenUrls: number;
    strippedFontFaces: string[]; // Font families stripped (files missing)
    copiedFontFiles: string[]; // Font files found and included
    warnings: string[];
  };
  fontFiles: string[]; // Absolute paths to font files found in clone
  imageFiles: string[]; // Absolute paths to image files found in clone
}

export async function preprocessCloneCss(config: PreprocessorConfig): Promise<PreprocessorResult>;
```

**Preprocessing steps (in order):**

1. **Discover CSS files** — Read all `.css` files from `{cloneDir}/assets/css/`

2. **Classify and filter:**
   - **Include by default:** `*-defaults.css`, `post-*.css`, `global-settings.css`, `presets.css`, `common-*.css`, `normalize*.css`, `custom_font_*.css`
   - **Exclude by default:** `rsvp.css`, `square.css`, `free.css`, `woocommerce*.css`, `style.min.css` (WordPress core), any file > 500KB (probably a full plugin CSS dump)
   - **Override:** `excludePatterns` config param adds to exclusion list
   - Inclusion/exclusion logged to manifest

3. **Sanitize each included file:**
   - **Strip broken `url()` references:** For each `url(...)` declaration, check if the referenced file exists in clone assets. If not, replace with `url(data:,)` (empty data URI) or remove the entire declaration if it's decorative. Log count to manifest.
   - **Rewrite valid asset URLs:** `url(icons/eye.svg)` → `url(/clone-assets/{theme}/icons/eye.svg)`, `url(images/foo.png)` → `url(/clone-assets/{theme}/images/foo.png)`, `url(fonts/Aeonik.woff2)` → `url(/clone-assets/{theme}/fonts/Aeonik.woff2)`
   - **Handle `@font-face`:** Parse font-family name. If referenced font files exist in clone assets → rewrite URLs and include. If files missing → strip the `@font-face` block, add font family to `strippedFontFaces` in manifest.
   - **Split mega-lines:** Insert `\n` after every `}` in lines > 10KB (prevents Turbopack line-length parse failures if the file is ever accidentally processed)
   - **Strip source map comments:** Remove `/*# sourceURL=...*/` and `/*# sourceMappingURL=...*/`

4. **Assemble bundle:**
   - Start with `:root { ... }` block from `customProperties` (computed section colors)
   - Add a basic `.container` utility: `max-width: 1280px; margin-inline: auto; padding-inline: 1.5rem;`
   - Add each included CSS file, separated by `/* === filename.css === */` comments
   - Append `inlineCss` (the CSS extracted from clone JSX comment blocks) at the end
   - Add font fallback rule at the bottom if any fonts were stripped:
     ```css
     /* Font fallback — original fonts not available */
     body,
     .breakdance,
     .breakdance * {
       font-family:
         system-ui,
         -apple-system,
         BlinkMacSystemFont,
         "Segoe UI",
         Roboto,
         sans-serif;
     }
     ```

5. **Build manifest** — Write `clone-assets.manifest.json` with all tracking info

**Verification gate:**

```bash
npx tsx -e "
  import { preprocessCloneCss } from './tools/lib/clone-css-preprocessor';
  const result = await preprocessCloneCss({ cloneDir: 'output/clones/corvus', themeName: 'corvus' });
  console.log('CSS size:', result.css.length);
  console.log('Included:', result.manifest.includedFiles.length);
  console.log('Excluded:', result.manifest.excludedFiles.length);
  console.log('Warnings:', result.manifest.warnings);
"
# CSS size should be < 400KB (stripped of plugin CSS)
# Included should be ~20-30 files
# Excluded should include rsvp.css, square.css, free.css
```

---

### Phase 2: Integrate Preprocessor into extract-theme.ts

**Goal:** Replace the broken `generateGlobalsCss()` with the preprocessor. The componentize pass now produces all clone assets ready for deployment.

**File:** `tools/extract-theme.ts`

**Changes:**

1. **Remove `generateGlobalsCss()` function** — it generates the broken `@import "../theme-system/dist/base.css"` and embeds raw clone CSS

2. **Replace with `generateThemeGlobalsCss()`:**

   ```css
   /* packages/themes/{theme}/globals.css — auto-generated */
   @import "../../core-components/src/styles/animations.css";

   /* Clone themes load visual CSS via <link> tag (bypasses PostCSS).
      Only platform-level animation imports go here. */
   ```

   This matches the orion/vega pattern — thin, Tailwind-safe.

3. **Add to componentize pass (after generating theme components):**
   - Call `preprocessCloneCss()` with clone dir, theme name, computed CSS variables, and inline CSS from JSX headers
   - Write `clone-styles.css` to `packages/themes/{themeName}/clone-styles.css` (source of truth)
   - Write manifest to `packages/themes/{themeName}/clone-assets.manifest.json`
   - Copy clone images from `{cloneDir}/assets/images/` to `packages/themes/{themeName}/assets/images/`
   - Copy found font files to `packages/themes/{themeName}/assets/fonts/`
   - If test site exists (`sites/_*` matching theme name): auto-deploy assets:
     - `clone-styles.css` → `sites/{site}/public/clone-assets/{theme}/styles/clone.css`
     - images → `sites/{site}/public/clone-assets/{theme}/images/`
     - fonts → `sites/{site}/public/clone-assets/{theme}/fonts/`
     - icons → `sites/{site}/public/clone-assets/{theme}/icons/` (if any exist)

4. **Auto-generate site globals.css for clone themes:**
   When writing to the test site, also update `sites/{site}/app/globals.css`:

   ```css
   /* Auto-generated for clone theme — do not add @tailwind base */
   @import "../../../packages/themes/{theme}/globals.css";

   @tailwind components;
   @tailwind utilities;
   ```

5. **Auto-update site layout.tsx:**
   Insert `<link rel="stylesheet" href="/clone-assets/{theme}/styles/clone.css" />` in the `<head>` section. Detect if it already exists (idempotent).

**Verification gate:**

```bash
npx tsx tools/extract-theme.ts --clone corvus --pass componentize

# Theme package
test -f packages/themes/corvus/clone-styles.css && echo "Theme CSS exists"
test -f packages/themes/corvus/clone-assets.manifest.json && echo "Manifest exists"
cat packages/themes/corvus/globals.css  # Should be ~3 lines, no clone CSS

# Site assets
test -f sites/_corvus-digital-marketing-events/public/clone-assets/corvus/styles/clone.css && echo "Site CSS deployed"
ls sites/_corvus-digital-marketing-events/public/clone-assets/corvus/images/ | wc -l  # ~91

# Globals.css
grep -c "@tailwind base" sites/_corvus-digital-marketing-events/app/globals.css  # Should be 0
grep -c "@tailwind utilities" sites/_corvus-digital-marketing-events/app/globals.css  # Should be 1

pnpm type-check
```

---

### Phase 3: Disable Preflight for Clone Sites

**Goal:** Prevent Tailwind's Preflight CSS reset from overriding clone CSS typography and layout.

**File:** `sites/_corvus-digital-marketing-events/tailwind.config.ts`

**Change:** Add `corePlugins: { preflight: false }` to the Tailwind config:

```typescript
export default {
  // ... existing config ...
  corePlugins: {
    preflight: false,
  },
} satisfies Config;
```

This is the Tailwind-recommended way to disable Preflight. It's per-site, so it only affects clone theme sites. Native themes (orion, vega, etc.) keep Preflight enabled.

**Note:** The extract-theme tool should auto-generate this config for clone theme sites (add to the componentize pass's site file generation).

**Verification gate:**

```bash
grep "preflight" sites/_corvus-digital-marketing-events/tailwind.config.ts
# Should show: preflight: false
```

---

### Phase 4: Handle Fonts

**Goal:** Clone fonts load when available, degrade gracefully when not.

**Handled by the preprocessor (Phase 1)**, but the layout needs attention for Google Fonts:

1. **Local fonts (e.g., Aeonik):** Preprocessor copies files if found, strips `@font-face` if not. Fallback CSS rule applied.

2. **Google Fonts:** If the clone HTML references `fonts.googleapis.com`:
   - The extract-theme tool detects this during componentize (scan clone HTML for Google Font URLs)
   - Adds `<link>` tags to the generated layout.tsx (per platform pattern — CSS `@import url()` for Google Fonts is silently ignored)

3. **Font detection is best-effort.** The manifest records what was found and what was stripped. Manual review of the manifest during QA catches gaps.

**Verification gate:**

```bash
# Check font situation in manifest
python3 -c "
import json
m = json.load(open('packages/themes/corvus/clone-assets.manifest.json'))
print('Stripped fonts:', m.get('strippedFontFaces', []))
print('Copied fonts:', m.get('copiedFontFiles', []))
print('Warnings:', m.get('warnings', []))
"
```

---

### Phase 5: Image Path Normalisation

**Goal:** All clone images render correctly in the Next.js site.

**Handled by the preprocessor and asset copy (Phases 1-2)**, but need to verify the JSX image paths match the public directory structure.

1. **Clone JSX image src patterns:**
   - `/images/filename.png` → maps to `/clone-assets/{theme}/images/filename.png` after asset copy
   - If the clone JSX uses this format, the componentize pass needs to rewrite `src="/images/"` → `src="/clone-assets/{theme}/images/"` in the generated page components

2. **Add to componentize pass in extract-theme.ts:**
   After generating page layouts, do a global find/replace on image paths:

   ```
   src="/images/ → src="/clone-assets/{theme}/images/
   src="images/  → src="/clone-assets/{theme}/images/
   ```

   This keeps the JSX consistent with the public asset path.

3. **CSS `url(images/...)` rewriting** is already handled by the preprocessor (Phase 1, step 3).

**Verification gate:**

```bash
# Check no broken image references in generated pages
grep -r 'src="/images/' packages/themes/corvus/pages/ && echo "WARN: un-rewritten image paths" || echo "OK: all image paths namespaced"
grep -c 'clone-assets/corvus/images' packages/themes/corvus/pages/HomePage.tsx
# Should be > 0
```

---

### Phase 6: Full Verification

**Goal:** End-to-end pipeline test — clean slate to rendering site.

```bash
# 1. Clean slate
rm -rf packages/themes/corvus/
rm -rf sites/_corvus-digital-marketing-events/public/clone-assets/

# 2. Run full pipeline
npx tsx tools/extract-theme.ts --clone corvus --pass componentize

# 3. Verify theme package
ls packages/themes/corvus/
# Expected: components/ pages/ globals.css clone-styles.css clone-assets.manifest.json index.ts package.json

# 4. Verify site assets
ls sites/_corvus-digital-marketing-events/public/clone-assets/corvus/styles/
ls sites/_corvus-digital-marketing-events/public/clone-assets/corvus/images/ | wc -l

# 5. Type check
pnpm type-check

# 6. Dev server test
cd sites/_corvus-digital-marketing-events && npx next dev &
sleep 20
curl -s http://localhost:3000 | grep -c "clone-assets/corvus/styles/clone.css"
# Should be 1 (the <link> tag)
curl -s http://localhost:3000 | grep -c "bde-section"
# Should be > 0 (Breakdance class names in rendered HTML)
kill %1

# 7. Production build test
cd sites/_corvus-digital-marketing-events && npx next build --webpack
# Should succeed without CSS parser errors
```

---

### Phase 7: Generalisation Safeguards

**Goal:** Ensure the pipeline works for non-Breakdance clones.

**Changes to preprocessor config:**

1. **No Breakdance-specific assumptions in the core logic.** The file classification patterns are defaults that can be overridden per-clone via the brief JSON:

   ```json
   {
     "cssPreprocessor": {
       "excludePatterns": ["woocommerce*.css", "rsvp.css"],
       "includePatterns": ["*.css"],
       "fontPolicy": "fallback-if-missing"
     }
   }
   ```

2. **Selector-reference validation (optional, Phase 7 only):**
   After building the CSS bundle, scan the clone JSX for class names actually used. Warn (not error) about CSS files where <10% of selectors match any JSX class. This helps identify dead CSS without breaking anything.

3. **Document the clone CSS contract** in `docs/architecture/how-clone-css-works.md`:
   - Two-layer model (clone CSS + Tailwind utilities)
   - Public asset path convention
   - Preprocessor config options
   - Font handling policy
   - Known limitations

**Verification gate:**

- Documentation written
- Preprocessor config documented in JSDoc comments

---

## File Change Summary

| File                                                                 | Action                  | Purpose                                                                                          |
| -------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------ |
| `tools/lib/clone-css-preprocessor.ts`                                | **Create**              | CSS sanitisation, bundling, asset discovery, manifest generation                                 |
| `tools/extract-theme.ts`                                             | **Modify**              | Replace `generateGlobalsCss()`, call preprocessor, copy assets to site, auto-generate site files |
| `packages/themes/corvus/globals.css`                                 | **Rewrite** (generated) | Thin file — animation import only, no clone CSS                                                  |
| `packages/themes/corvus/clone-styles.css`                            | **Create** (generated)  | Preprocessed clone CSS bundle                                                                    |
| `packages/themes/corvus/clone-assets.manifest.json`                  | **Create** (generated)  | Debug/reproducibility manifest                                                                   |
| `sites/_corvus-digital-marketing-events/app/globals.css`             | **Modify** (generated)  | `@tailwind components` + `@tailwind utilities` only, no `@tailwind base`                         |
| `sites/_corvus-digital-marketing-events/app/layout.tsx`              | **Modify**              | Add `<link>` for clone CSS                                                                       |
| `sites/_corvus-digital-marketing-events/tailwind.config.ts`          | **Modify**              | `corePlugins: { preflight: false }`                                                              |
| `sites/_corvus-digital-marketing-events/public/clone-assets/corvus/` | **Create** (generated)  | Static clone CSS, images, fonts, icons                                                           |
| `docs/architecture/how-clone-css-works.md`                           | **Create**              | Architecture doc for clone CSS system                                                            |

---

## Execution Order with Dependencies

```
Phase 1 (preprocessor)
  ↓
Phase 2 (integrate into extract-theme) — depends on Phase 1
  ↓
Phase 3 (preflight disable) — independent, can parallel with Phase 2
  ↓
Phase 4 (fonts) — handled by Phase 1+2, just verification
  ↓
Phase 5 (image paths) — depends on Phase 2
  ↓
Phase 6 (full verification) — depends on all above
  ↓
Phase 7 (generalisation) — independent, can run after Phase 6
```

Phases 1-2 are the critical path. Phase 3 can be done in parallel with Phase 2. Phases 4-5 are mostly verification of work already done in Phases 1-2. Phase 6 is the gate. Phase 7 is polish.

---

## Risks

1. **Breakdance CSS variable definitions in rejected files** — `global-settings.css` defines `--bde-section-width` etc. but also has broken `url()` references. The preprocessor must sanitise the file (strip broken URLs) rather than exclude it, otherwise layout collapses. **Mitigation:** Sanitise before classify — broken URLs are fixed, not used for exclusion.

2. **CSS specificity between clone and Tailwind** — Clone CSS uses `!important` heavily. Tailwind utilities are lower specificity. This means Tailwind overrides won't work where clone CSS has `!important`. **Mitigation:** Acceptable for clone themes — the clone CSS is the visual truth. White-label customisation happens via CSS custom properties, not Tailwind class overrides on clone elements.

3. **Turbopack handling of `<link>` to public assets** — Turbopack should serve files from `public/` as static assets without processing. This is standard Next.js behaviour. **Mitigation:** Verify in Phase 6 dev server test.

4. **Large CSS bundle (~300KB)** — The combined clone CSS is large. **Mitigation:** The preprocessor strips plugin CSS (saves ~100KB). For production, the file should be served with gzip/brotli compression (Vercel does this automatically). Minification could be added later but isn't blocking.

5. **Font licensing** — Clone fonts (Aeonik) may be licensed to the original site. **Mitigation:** Graceful degradation to system fonts. Font situation reviewed per-client during intake.
