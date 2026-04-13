# How Clone CSS Works

## Overview

Clone-based themes use a two-layer CSS model:

1. **Clone CSS layer** — Frozen CSS from the reference site, loaded as a static file via `<link>` tag. Provides layout, typography, animations, and visual structure using the original site's CSS classes. Bypasses PostCSS/Tailwind entirely.

2. **Tailwind layer** — The platform's theme token system. Loaded via `@tailwind components` + `@tailwind utilities` (Preflight disabled). Provides white-label customisation utilities.

## How It Works

### CSS Preprocessing

The `tools/lib/clone-css-preprocessor.ts` module processes raw clone CSS into a deployable bundle:

1. Discovers all CSS files from the clone's `assets/css/` directory
2. Classifies files (include layout CSS, exclude plugin CSS)
3. Sanitises each file (strips broken URLs, rewrites valid ones, handles fonts)
4. Assembles into a single `clone-styles.css` bundle
5. Produces a `clone-assets.manifest.json` for debugging

### Asset Paths

Clone assets are served from a namespaced public directory:

```
public/clone-assets/<theme>/
├── styles/clone.css    # Preprocessed CSS bundle
├── images/             # Clone images
├── fonts/              # Clone fonts (if available)
└── icons/              # Clone icons (if any)
```

### Site Wiring

Clone theme sites differ from native themes:

| Aspect            | Native Theme (orion/vega)             | Clone Theme (corvus)                           |
| ----------------- | ------------------------------------- | ---------------------------------------------- |
| globals.css       | `@tailwind base/components/utilities` | `@tailwind components/utilities` (no base)     |
| CSS loading       | Theme CSS via `@import` in globals    | Clone CSS via `<link>` in layout.tsx           |
| Preflight         | Enabled                               | Disabled (`corePlugins: { preflight: false }`) |
| Component classes | `@apply`-based Tailwind tokens        | Raw clone CSS classes                          |

### Font Handling

- **Local fonts** (referenced via relative path in `@font-face`): copied if files exist in `assets/fonts/`, stripped with system font fallback if not
- **Remote fonts** (referenced via `https://` in `@font-face`): kept as-is — browser loads them directly
- **Google Fonts** via `<link>` tag: not handled by preprocessor — add manually to layout.tsx if needed
- Manifest records all font decisions for QA review

### File Classification

**Included by default:**

- `*-defaults.css` — Breakdance layout defaults per post
- `post-*.css` — Per-page Breakdance styles
- `global-settings.css` — CSS custom properties and global settings
- `presets.css` — Breakdance preset styles
- `common-*.css` — Shared utility CSS
- `normalize*.css` — Browser normalisation
- `custom_font_*.css` — Custom font declarations

**Excluded by default:**

- `style.min.css` — WordPress core theme CSS (unused)
- `rsvp.css`, `square.css`, `free.css` — Plugin-specific CSS
- `woocommerce*.css` — WooCommerce plugin CSS
- Any file over 500KB

### Preprocessor Config

Override defaults via `PreprocessorConfig`:

```typescript
const result = await preprocessCloneCss({
  cloneDir: "output/clones/corvus",
  themeName: "corvus",
  customProperties: ":root { --color-brand-primary: #292661; }",
  inlineCss: "/* CSS from JSX comment blocks */",
  excludePatterns: ["extra-plugin.css"],
});
```

The `extract-theme.ts --pass componentize` command calls this automatically with the clone's computed styles and inline CSS extracted from JSX comment headers.

## Integration with extract-theme Pipeline

The componentize pass (`tools/extract-theme.ts --clone <name> --pass componentize`) handles the full workflow automatically:

1. Runs `preprocessCloneCss()` after generating page layouts
2. Writes `clone-styles.css` → `packages/themes/<name>/clone-styles.css`
3. Writes `clone-assets.manifest.json` → `packages/themes/<name>/clone-assets.manifest.json`
4. Copies images to `packages/themes/<name>/assets/images/`
5. If a test site (`sites/_<name>*`) exists:
   - Copies CSS to `public/clone-assets/<name>/styles/clone.css`
   - Copies images to `public/clone-assets/<name>/images/`
   - Auto-generates `app/globals.css` (no `@tailwind base`)
   - Inserts `<link>` for clone CSS in `app/layout.tsx`
   - Sets `corePlugins: { preflight: false }` in `tailwind.config.ts`

## Debugging

Check the manifest for what was included and why:

```bash
python3 -c "
import json
m = json.load(open('packages/themes/corvus/clone-assets.manifest.json'))
print('Included:', m['includedFiles'])
print('Excluded:', m['excludedFiles'])
print('Stripped fonts:', m['strippedFontFaces'])
print('Warnings:', m['warnings'])
"
```
