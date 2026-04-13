# Claude's Plan: Clone CSS Rendering Fix

**Date:** 2026-04-13
**Author:** Claude (independent plan, before seeing Codex output)

---

## Approach: Option A + D Hybrid — Public CSS with Automated Preprocessing

After analysing all four options, the right approach is a hybrid of **Option A** (load clone CSS via `<link>` tag from `public/`) and **Option D** (preprocess the CSS to sanitize it). This completely bypasses PostCSS/Turbopack CSS parsing while keeping the CSS clean and portable.

**Why not the other options:**

- **Option B** (`dangerouslySetInnerHTML` `<style>`) — Bloats HTML, causes FOUC on navigation, doesn't scale to 370KB of CSS.
- **Option C** (convert to Tailwind) — Months of work, extremely brittle, loses visual fidelity.
- **Pure Option A** without preprocessing — Broken `url()` references and missing fonts would still cause console errors and missing visual elements.
- **Pure Option D** (make CSS Turbopack-compatible) — Fighting the CSS parser is a losing battle; new clone sites will bring new CSS edge cases. Better to bypass entirely.

### Key Insight: Two CSS Layers

The clone theme operates on a **two-layer CSS model**:

1. **Clone CSS layer** — Frozen CSS from the reference site. Loaded via `<link>` tag, bypasses PostCSS entirely. Provides layout, typography, animations, and visual structure using the original CSS classes.
2. **Tailwind layer** — The platform's theme token system. Loaded via `@tailwind utilities` (no `base`, no `components`). Provides white-label overrides (`bg-brand-primary`, `text-h1`, etc.) that can be applied on top of clone CSS.

The `@tailwind base` (Preflight) reset is the enemy. It must be excluded from clone-based themes. Only `@tailwind utilities` is used — and even that is optional initially (clone themes may not use any Tailwind classes until the customization pass later in the product lifecycle).

---

## Phase 1: Create CSS Preprocessor (`tools/lib/clone-css-preprocessor.ts`)

A new module that takes raw clone CSS files and produces a single, sanitized CSS bundle.

### What the Preprocessor Does

1. **Categorize CSS files** — Separate essential layout CSS from plugin CSS that can be excluded.
   - **Include:** Files matching patterns: `*-defaults.css`, `global-settings.css`, `presets.css`, `common-*.css`, `normalize*.css`, `post-*.css`, and any `custom_font_*.css`
   - **Exclude:** Known WordPress plugin CSS: `rsvp.css`, `square.css`, `free.css`, `woocommerce*.css`, `style.min.css` (WordPress core theme)
   - **Config-driven:** An allowlist/blocklist system so new clones can adjust

2. **Sanitize each CSS file:**
   - **Strip broken `url()` references** — Replace `url(icons/...)`, `url(fonts/...)`, and other relative paths that won't resolve with empty/fallback values: `url()` → remove the declaration entirely, or replace with `url(data:,)` (empty data URI)
   - **Rewrite font `url()` paths** — If font files are available in the clone assets, rewrite paths to `/fonts/[filename]`. If not available, strip the `@font-face` rule entirely and let the browser fall back.
   - **Rewrite image `url()` paths** — Any `url(images/...)` or `url(../images/...)` → `/images/[filename]`
   - **Split mega-lines** — Some minified CSS files have single lines >100KB. Insert newlines after `}` to split into individual rules (prevents Turbopack line-length issues if the file is ever accidentally processed).
   - **Strip source map comments** — Remove `/*# sourceURL=... */` and `/*# sourceMappingURL=... */`
   - **Preserve `!important`** — Breakdance uses it everywhere; don't strip it.

3. **Deduplicate** — If the same CSS rule appears in multiple files (common with WordPress), keep only the first occurrence.

4. **Prepend CSS variables** — Add the computed section colors from `styles/computed-styles.json` as `:root { --color-section-0: ...; }` at the top.

5. **Append clone inline CSS** — The CSS block extracted from the clone JSX files (the comment block before `export function`) gets appended. This often contains page-specific inline styles.

6. **Output** — Write the combined, sanitized CSS to a single file.

### File: `tools/lib/clone-css-preprocessor.ts`

```typescript
interface PreprocessorConfig {
  cloneDir: string; // e.g., "output/clones/corvus"
  themeName: string; // e.g., "corvus"
  outputDir: string; // e.g., "packages/themes/corvus"
  customProperties?: string; // :root CSS variables from computed-styles.json
  inlineCss?: string; // CSS extracted from clone JSX comment blocks
  excludePatterns?: string[]; // Additional glob patterns to exclude
}

interface PreprocessorResult {
  cssPath: string; // Path to the generated CSS bundle
  fontFiles: string[]; // Font files found in clone assets
  imageFiles: string[]; // Image files found in clone assets
  excludedFiles: string[]; // CSS files that were excluded
  warnings: string[]; // Non-fatal issues encountered
}

export async function preprocessCloneCss(config: PreprocessorConfig): Promise<PreprocessorResult>;
```

### Verification Gate

```bash
# Run preprocessor standalone on corvus clone
npx tsx tools/test-css-preprocessor.ts --clone corvus
# Should output: CSS bundle written to packages/themes/corvus/public/clone-styles.css
# Should list excluded files and any warnings
# The output CSS file should be loadable in a browser without errors
```

---

## Phase 2: Update `extract-theme.ts` to Use Preprocessor

### Changes to `generateGlobalsCss()`

Replace the current implementation that concatenates raw CSS with a call to the preprocessor:

**Before:**

```typescript
function generateGlobalsCss(customProperties: string, cloneCss: string): string {
  return `/* ... */\n@import "../theme-system/dist/base.css";\n:root {\n${customProperties}\n}\n${cloneCss}`;
}
```

**After:**
The theme `globals.css` becomes a thin file that imports only the platform animation CSS (like orion/vega do) and declares any Tailwind-compatible overrides. The clone CSS is NOT in `globals.css` — it's in a separate file loaded via `<link>`.

```css
/* packages/themes/corvus/globals.css — auto-generated */
@import "../../core-components/src/styles/animations.css";

/* Clone themes use <link> for clone CSS, not @import.
   Only platform-level @apply classes go here if needed. */
```

### New Output: `packages/themes/corvus/public/clone-styles.css`

The preprocessor writes the sanitized CSS bundle here. The scaffolder (or extract-theme) copies this to the site's `public/css/` directory.

### Changes to Componentize Pass

After generating the theme package files, the componentize pass now also:

1. Calls `preprocessCloneCss()` to generate `public/clone-styles.css` in the theme directory
2. Copies font files from clone assets to `public/fonts/` in the theme directory
3. Copies image files from clone assets to `public/images/` in the theme directory

### Verification Gate

```bash
npx tsx tools/extract-theme.ts --clone corvus --pass componentize
test -f packages/themes/corvus/public/clone-styles.css && echo "CSS bundle exists" || echo "FAIL"
wc -c packages/themes/corvus/public/clone-styles.css
# Should be < 400KB (stripped of plugin CSS)
```

---

## Phase 3: Update Theme Package Exports

### New export: `getCloneAssets()`

Add a function to the corvus theme `index.ts` that tells sites where to find clone assets:

```typescript
export function getCloneAssets() {
  return {
    cssPath: require.resolve("@platform/themes/corvus/public/clone-styles.css"),
    hasCloneCss: true,
    fontsDir: require.resolve("@platform/themes/corvus/public/fonts/"),
    imagesDir: require.resolve("@platform/themes/corvus/public/images/"),
  };
}
```

Actually, this is overengineered. The scaffolder should just copy the files. Let me simplify.

### Simpler approach: Scaffolder copies clone assets

When `scaffold-client-site.ts` creates a new site from a clone theme, it:

1. Checks if `packages/themes/{theme}/public/` exists
2. If so, copies `clone-styles.css` → `sites/{site}/public/css/clone-styles.css`
3. Copies `fonts/` → `sites/{site}/public/fonts/`
4. Copies `images/` → `sites/{site}/public/images/`

**Wait — constraint says DO NOT modify scaffold-client-site.ts.** So the asset copying must happen in `extract-theme.ts` itself, writing directly to the test site directory. Or better: the extract-theme tool writes to the theme package, and the test site's layout loads from the theme package's public directory.

### Revised approach: Site loads CSS from theme package via `<link>`

Actually, Next.js `public/` directory is per-site. The cleanest approach:

1. `extract-theme.ts` writes `clone-styles.css` to `packages/themes/corvus/clone-styles.css` (not in `public/`)
2. `extract-theme.ts` also writes the file to `sites/_corvus-digital-marketing-events/public/css/clone-styles.css` (the test site's public directory)
3. For new sites, the scaffolder would need to copy this — but since we can't modify the scaffolder, we document this as a manual step (or add it to extract-theme's output)

**Best approach: extract-theme writes to both locations.** The theme package is the source of truth; the site's `public/css/` is the deployment copy.

### Verification Gate

```bash
test -f sites/_corvus-digital-marketing-events/public/css/clone-styles.css && echo "Site CSS exists" || echo "FAIL"
```

---

## Phase 4: Update Site Layout to Load Clone CSS

### Changes to `sites/_corvus-digital-marketing-events/app/layout.tsx`

Add the `<link>` tag for clone CSS in the `<head>`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/clone-styles.css" />
      </head>
      <body>{/* ... existing ThemeProvider, PageShell, etc. ... */}</body>
    </html>
  );
}
```

### Changes to `sites/_corvus-digital-marketing-events/app/globals.css`

```css
/* Clone theme globals — minimal Tailwind integration */
@import "../../../packages/themes/corvus/globals.css";

/* NO @tailwind base — Preflight reset conflicts with clone CSS */
/* NO @tailwind components — clone doesn't use Tailwind component layer */
@tailwind utilities;

/* Site-specific overrides can go here */
```

The critical change: **no `@tailwind base`**. This prevents Tailwind's Preflight reset from overriding clone CSS typography and layout. Only `@tailwind utilities` is included so that Tailwind utility classes (like `bg-brand-primary`) are available if needed.

### Verification Gate

```bash
cd sites/_corvus-digital-marketing-events && npx next dev &
sleep 15
curl -s http://localhost:3000 | grep -c "clone-styles.css"
# Should find 1 (the <link> tag)
kill %1
```

---

## Phase 5: Handle Images

### Image Copying

The extract-theme tool should copy clone images to the site's `public/images/` directory:

```bash
# In extract-theme.ts componentize pass:
cp -r output/clones/corvus/assets/images/* sites/_corvus-digital-marketing-events/public/images/
```

The clone JSX references images as `src="/images/filename.png"` (the converter uses absolute paths from the clone root). In the Next.js site, `public/images/filename.png` maps to `/images/filename.png` — so the paths should just work.

### Image Path Rewriting (if needed)

If the clone JSX uses different path patterns (e.g., `src="assets/images/..."` or `src="wp-content/uploads/..."`), the extract-theme tool should normalize all image `src` attributes to `/images/filename` during the componentize pass.

### Verification Gate

```bash
ls sites/_corvus-digital-marketing-events/public/images/ | wc -l
# Should be ~91 (matching clone asset count)
```

---

## Phase 6: Handle Fonts

### Strategy: Graceful Degradation with Optional Font Loading

1. **Check if font files exist in clone assets:** Look for `.woff`, `.woff2`, `.ttf`, `.otf` files in `output/clones/corvus/assets/fonts/` or `output/clones/corvus/assets/css/` (some themes embed font files next to CSS).

2. **If font files exist:**
   - Copy to `sites/{site}/public/fonts/`
   - Rewrite `@font-face` declarations in `clone-styles.css` to use `/fonts/filename.woff2`
   - Keep the `@font-face` rules in the CSS bundle

3. **If font files don't exist (common — fonts often behind CDN/licensing):**
   - Strip the `@font-face` declarations from `clone-styles.css`
   - Add a CSS fallback that maps the missing font family to a system font stack:
     ```css
     /* Font fallback — original font not available */
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
   - Document which fonts were expected for future reference (in a comment at the top of `clone-styles.css`)

4. **For Google Fonts:** If the clone references Google Fonts (detected by `fonts.googleapis.com` in CSS or HTML), add a `<link>` tag in `layout.tsx` to load them from Google's CDN. This is the pattern already established for external fonts in the platform (per memory: CSS `@import url()` for Google Fonts is silently ignored — must use `<link>` in layout.tsx).

### Verification Gate

```bash
# Check for font references in the processed CSS
grep -c "@font-face" sites/_corvus-digital-marketing-events/public/css/clone-styles.css
# Should be 0 if fonts not available, or N if fonts were found and included
```

---

## Phase 7: Generate Clone Theme Layout Template

### Problem

Currently, `extract-theme.ts` generates the theme package but the site layout wiring (the `<link>` tag for clone CSS, the modified globals.css without `@tailwind base`) must be done manually or by the scaffolder.

### Solution: Generate a Layout Hint File

`extract-theme.ts` writes a file `packages/themes/corvus/LAYOUT_INSTRUCTIONS.md` that documents exactly how to wire the site:

````markdown
# Corvus Theme — Site Layout Instructions

This theme uses clone CSS loaded via `<link>` tag (not through Tailwind/PostCSS).

## Required in app/layout.tsx

Add this to the `<head>`:

```html
<link rel="stylesheet" href="/css/clone-styles.css" />
```
````

## Required in app/globals.css

```css
@import "../../../packages/themes/corvus/globals.css";
@tailwind utilities;
/* Do NOT include @tailwind base or @tailwind components */
```

## Required in public/

Copy from the theme package:

- `packages/themes/corvus/clone-styles.css` → `public/css/clone-styles.css`
- Clone images → `public/images/`

````

### Better: Auto-generate the Site Files

For the test site, `extract-theme.ts --pass componentize` should also:
1. Write the correct `app/globals.css` (with `@tailwind utilities` only)
2. Write the `<link>` tag into the layout template
3. Copy CSS and images to `public/`

This way the componentize pass produces a fully-wired, renderable test site.

### Verification Gate

```bash
# Full end-to-end: regenerate theme + start dev server
npx tsx tools/extract-theme.ts --clone corvus --pass componentize
cd sites/_corvus-digital-marketing-events && npx next dev &
sleep 20
# Visually inspect localhost:3000 or use curl to check for content
curl -s http://localhost:3000 | grep -c "bde-section"
# Should find Breakdance class names in the rendered HTML
kill %1
````

---

## Phase 8: Verification and Cleanup

### Full Pipeline Test

```bash
# Clean slate
rm -rf packages/themes/corvus/
rm -rf sites/_corvus-digital-marketing-events/public/css/
rm -rf sites/_corvus-digital-marketing-events/public/images/

# Run full pipeline
npx tsx tools/extract-theme.ts --clone corvus --pass componentize

# Verify theme package
ls packages/themes/corvus/
# Should include: components/ pages/ globals.css clone-styles.css index.ts package.json

# Verify site assets
ls sites/_corvus-digital-marketing-events/public/css/
# Should include: clone-styles.css

ls sites/_corvus-digital-marketing-events/public/images/ | wc -l
# Should be ~91

# Type check
pnpm type-check

# Dev server
cd sites/_corvus-digital-marketing-events && npx next dev
# Manually verify visual fidelity against reference screenshots
```

### Cleanup Uncommitted Debug Hacks

After verifying the new approach works:

1. Remove the 1,266-line concatenated `globals.css` from corvus theme — replace with the thin version
2. Remove any `sed`-hacked CSS files
3. Ensure the site's `globals.css` uses the clean two-line version (import + `@tailwind utilities`)

---

## Risks and Trade-offs

### Risks

1. **CSS specificity conflicts** — Even without `@tailwind base`, Tailwind utility classes might conflict with Breakdance `!important` rules. Mitigation: Tailwind utilities are lower specificity than `!important`, so clone CSS wins by default. Test with a few utility classes to confirm.

2. **Missing Breakdance CSS variables** — If `global-settings.css` is excluded or sanitized too aggressively, the `--bde-*` variables it defines will be missing, causing layout to collapse. Mitigation: The preprocessor must extract and preserve CSS variable declarations from all files, even those with broken `url()` references.

3. **Turbopack `<link>` tag handling** — Turbopack (`next dev`) might still try to process CSS loaded via `<link>` from `public/`. Need to verify it treats `public/` files as static assets (it should — this is standard Next.js behavior).

4. **Build size** — The clone CSS bundle (~300-370KB) is large for a single stylesheet. Mitigation: The preprocessor should strip unused plugin CSS, which should bring it under 200KB. For production, consider minifying the output.

5. **Generalization** — Different cloned sites will use different CSS frameworks (not just Breakdance). The preprocessor's exclude patterns and sanitization rules need to be configurable. The current plan uses Breakdance-specific patterns as defaults but allows overrides.

### Trade-offs

1. **Two CSS loading mechanisms** — Clone themes load CSS via `<link>` while native themes use the Tailwind/PostCSS pipeline. This is a divergence in the theme architecture. Accepted because: clone themes are inherently different from native themes; trying to force clone CSS through PostCSS is the root cause of the current problem.

2. **No `@tailwind base`** — Clone theme sites don't get Tailwind's Preflight reset. This means any new components added to the site that expect Preflight (e.g., from core-components) may look slightly different. Mitigation: Clone themes are meant to use the clone's own component markup, not mix in core-component primitives.

3. **Static asset duplication** — Clone images are copied to each site's `public/images/`. If multiple sites use the same clone theme, images are duplicated. Acceptable at current scale (91 images for corvus, one site per clone theme).

4. **Font licensing** — Clone fonts (Aeonik) may be licensed to the original site only. The plan gracefully degrades to system fonts when font files aren't available. The font situation should be reviewed per-client during the intake process.

---

## File Change Summary

| File                                                                 | Action                 | Purpose                                                                                                 |
| -------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------- |
| `tools/lib/clone-css-preprocessor.ts`                                | **Create**             | New module: sanitizes and bundles clone CSS                                                             |
| `tools/extract-theme.ts`                                             | **Modify**             | Call preprocessor during componentize pass; fix `generateGlobalsCss()` output; copy assets to test site |
| `packages/themes/corvus/globals.css`                                 | **Rewrite**            | Thin file (import animations, no clone CSS)                                                             |
| `packages/themes/corvus/clone-styles.css`                            | **Create** (generated) | Preprocessed clone CSS bundle                                                                           |
| `sites/_corvus-digital-marketing-events/app/globals.css`             | **Modify**             | Remove `@tailwind base/components`, keep `@tailwind utilities` only                                     |
| `sites/_corvus-digital-marketing-events/app/layout.tsx`              | **Modify**             | Add `<link rel="stylesheet" href="/css/clone-styles.css" />`                                            |
| `sites/_corvus-digital-marketing-events/public/css/clone-styles.css` | **Create** (copied)    | Deployed clone CSS bundle                                                                               |
| `sites/_corvus-digital-marketing-events/public/images/`              | **Create** (copied)    | Clone images                                                                                            |

---

## Implementation Order

1. Phase 1: Create CSS preprocessor (new file, no side effects)
2. Phase 2: Update extract-theme.ts to use preprocessor
3. Phase 3: Update theme package exports (minimal)
4. Phase 4: Update site layout and globals.css
5. Phase 5: Handle images
6. Phase 6: Handle fonts
7. Phase 7: Generate layout template / auto-wire site
8. Phase 8: Full verification and cleanup

Phases 1-3 can be tested independently. Phase 4 enables the first visual verification. Phases 5-6 improve fidelity. Phase 7 automates the setup. Phase 8 is final verification.
