# Claude's Plan: Theme Browser

**Date:** 2026-04-13
**Independent plan — written before seeing Codex output**

---

## Phase 1: Kill Showcase

### 1.1 Delete the showcase site

```bash
rm -rf sites/showcase/
```

`pnpm-workspace.yaml` uses `sites/*` wildcard — no workspace config change needed.

### 1.2 Clean tools/sync-themes.ts

The file has three showcase-specific sections. Remove:

- **Line 9 (comment):** `* 3. sites/showcase/lib/register-all-themes.ts — side-effect imports`
- **Line 26:** `const REGISTER_FILE = join(ROOT, "sites/showcase/lib/register-all-themes.ts");`
- **Lines 67-69:** The `existsSync(showcasePath)` block that adds `./${name}/showcase` exports to theme packages
- **Line 124:** `{ file: "sites/showcase/lib/register-all-themes.ts", changed: syncRegisterFile(themes) }` from the sync results array
- Remove the `syncRegisterFile()` function itself (it has no other callers)

Also remove the `./${name}/showcase` export entries from all theme `package.json` files — these were added by `sync-themes.ts` and point to `showcase-registry.tsx` files that will now be deleted with the showcase directory. (Or, since the showcase site is gone, they're harmless dead exports, but clean removal is cleaner.)

### 1.3 Clean tools/scaffold-theme-package.ts

Remove the section that generates `showcase-registry.tsx` in new theme packages. After removal, verify the tool still generates the core theme structure (index.ts, globals.css, components/, pages/).

### 1.4 Remove showcase-registry.tsx from all theme packages

The `tools/sync-themes.ts` added `./${name}/showcase` export entries to theme package.json files pointing to `showcase-registry.tsx`. After removing showcase:

- Delete `packages/themes/*/showcase-registry.tsx` files
- Remove the `"./{name}/showcase"` entries from each theme's `package.json` exports

### 1.5 Verification gate

```bash
# Nothing references showcase anymore
grep -r "showcase" . --include="*.ts" --include="*.tsx" --include="*.json" --include="*.yaml" \
  | grep -v node_modules | grep -v ".next" | grep -v ".git"

# Type check still passes
pnpm type-check
```

Expected: no results from grep, no errors from type-check.

---

## Phase 2: Theme Browser Data Layer

### 2.1 Create the data layer

**File:** `sites/dcs/app/theme-preview/_lib/theme-catalog.ts`

Static array of `ThemeCatalogEntry` objects, one per theme. This avoids using the runtime theme registry (which requires imports to have been executed) and instead directly imports each theme's config.

```ts
import { generateCssVariables } from "@platform/theme-system";
import { orionConfig } from "@platform/themes/orion";
// ... import all theme configs

export interface ThemeCatalogEntry {
  name: string;
  label: string;
  cssVars: Record<string, string>; // from generateCssVariables(config)
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  typography: {
    sansFamily: string;
    headingFamily?: string;
  };
  variants: {
    hero: string;
    header: "dark" | "light";
    card: string;
  };
  capabilities: {
    hasComponents: boolean; // false for polaris, sirius
    hasPageTemplates: boolean;
    pageTemplateNames: string[];
  };
}
```

Using `generateCssVariables()` for each theme config gives us the exact CSS custom property map to inject into the wrapper div.

**Risk:** Some theme configs may not export a named `orionConfig` — need to check actual export names. Fall back to default export if needed. Check each theme's `index.ts` for the exact export name.

**Note on atlas/corvus:** These themes have `manifest.ts` files instead of a simple config export. The catalog import strategy needs to handle this variation. Check their index.ts exports.

### 2.2 Mock content

**File:** `sites/dcs/app/theme-preview/_lib/mock-content.ts`

```ts
export const mockBusiness = {
  name: "Preview Business",
  tagline: "Quality service, every time",
  phone: "01234 567890",
  phoneTel: "tel:01234567890",
  email: "hello@preview.example",
};

export const mockNavItems = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const mockCta = { label: "Get a Quote", href: "#contact" };

export const mockLocations = [
  { name: "London", slug: "london" },
  { name: "Manchester", slug: "manchester" },
  { name: "Birmingham", slug: "birmingham" },
];

export const mockServices = [
  { title: "Service One", description: "Professional service delivered reliably.", icon: "⚡" },
  { title: "Service Two", description: "Expert installation and maintenance.", icon: "🔧" },
  { title: "Service Three", description: "Fully insured, local specialists.", icon: "✓" },
];
```

---

## Phase 3: Theme Preview Routes

### 3.1 Nested layout for /theme-preview

**File:** `sites/dcs/app/theme-preview/layout.tsx`

This layout is nested inside the root layout (which always renders SolarisHeader + SolarisFooter). The nested layout adds a thin "preview mode" indicator bar at the top of the content area, before the page's content. It does NOT remove the Solaris frame — that's architecturally impossible with nested layouts.

```tsx
export default function ThemePreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-preview-shell">
      <div className="bg-surface-subtle border-b border-surface-subtle-border px-6 py-2 flex items-center gap-4 text-sm text-surface-muted-foreground">
        <a href="/" className="hover:text-surface-foreground">
          ← Back to DCS
        </a>
        <span>|</span>
        <span>Theme Preview</span>
      </div>
      {children}
    </div>
  );
}
```

No metadata here — noindex is handled per-page.

### 3.2 Gallery page

**File:** `sites/dcs/app/theme-preview/page.tsx`

```tsx
export const metadata = { robots: { index: false, follow: false } };

export default function ThemePreviewGallery() {
  return (
    <div className="container-standard py-12">
      <h1 className="text-h1 mb-2">Theme Gallery</h1>
      <p className="text-surface-muted-foreground mb-10">
        All available themes for the Local Business Platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEME_CATALOG.map((entry) => (
          <ThemeCard key={entry.name} entry={entry} />
        ))}
      </div>
    </div>
  );
}
```

**ThemeCard component** (co-located in `_components/ThemeCard.tsx`):

- Colour strip: 3 `<div>` elements with inline `backgroundColor: entry.colors.primary/secondary/accent`
- Font name displayed using `style={{ fontFamily: entry.typography.sansFamily }}`
- Badges: hero variant, header dark/light, "N page templates" or "Design spec only"
- "Open preview →" link to `/theme-preview/[name]`

### 3.3 Per-theme detail page

**File:** `sites/dcs/app/theme-preview/[name]/page.tsx`

```tsx
export async function generateStaticParams() {
  return THEME_CATALOG.map((t) => ({ name: t.name }));
}

export async function generateMetadata({ params }: { params: { name: string } }) {
  return { robots: { index: false, follow: false } };
}

export default function ThemeDetailPage({ params }: { params: { name: string } }) {
  const entry = THEME_CATALOG.find((t) => t.name === params.name);
  if (!entry) notFound();

  if (!entry.capabilities.hasComponents) {
    return <TokenOnlyView entry={entry} />;
  }

  return (
    <ThemePreviewWrapper cssVars={entry.cssVars}>
      <ThemeComponents name={entry.name} entry={entry} />
    </ThemePreviewWrapper>
  );
}
```

**ThemePreviewWrapper** (`_components/ThemePreviewWrapper.tsx`):

```tsx
export function ThemePreviewWrapper({
  cssVars,
  children,
}: {
  cssVars: Record<string, string>;
  children: React.ReactNode;
}) {
  return <div style={cssVars as React.CSSProperties}>{children}</div>;
}
```

**ThemeComponents** (`_components/ThemeComponents.tsx`):
A `switch` (or object map) on `name` that renders the correct theme's Header and Footer with mock content. Each theme's components are dynamically imported based on the name. This is the part that requires knowing each theme's prop interface.

```tsx
// For orion:
import { OrionHeader, OrionFooter } from "@platform/themes/orion/components";
<OrionHeader
  siteName={mockBusiness.name}
  primaryCta={mockCta}
  navigation={mockNavItems}
  locations={mockLocations}
  showPhone={true}
  phoneDisplay={mockBusiness.phone}
  phoneTel={mockBusiness.phoneTel}
/>;
```

**Risk:** Each theme's Header/Footer has different prop interfaces. The `ThemeComponents` switch will be verbose (9 cases). This is acceptable — it's explicit, type-safe, and doesn't require new abstractions.

**Alternative considered:** A shared mock adapter that maps a common mock shape to each theme's prop format. Rejected — adds abstraction for one use case, and the theme prop interfaces are stable (they don't change often).

### 3.4 Hero section rendering

For themes with page templates, import and render the home page template with mock content (stripping real data fetching):

- If `pages/home.tsx` is available: import `OrionHomePage` and render with mock service props
- If not available: render a manually composed `<section>` with mock headline + CTA using the theme's CSS vars for colour

This requires checking which themes export `pages/`. From the earlier exploration:

- Full pages: castor, cygnus, lyra, nova, orion, solaris (all export home/service/blog/etc.)
- Components only (no pages): atlas, corvus, vega
- Token only: polaris, sirius

For atlas/corvus/vega (components but no pages), compose a simple hero stub using the `SiteHeader` from core-components and a plain `<section>`.

### 3.5 Token-only view

**File:** `_components/TokenOnlyView.tsx`

When `!entry.capabilities.hasComponents`, render:

- Badge: "Design spec — no component implementations yet"
- Full colour palette (all CSS vars displayed as swatches with variable names)
- Typography scale table
- Note: "This theme defines design tokens only. Component implementations are planned."

### 3.6 UI kit page

**File:** `sites/dcs/app/theme-preview/ui-kit/page.tsx`

No CSS injection needed — Solaris is the host theme.

Sections:

1. Colour palette (all `--color-*` vars from `solarisConfig` via `generateCssVariables`)
2. Typography scale (render each scale level at actual size)
3. Button variants: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
4. Card variants: `.card`, `.card-interactive`
5. Section patterns (example section with `.section` class)
6. A sample of core-components: `<StarRating>`, `<TestimonialCard>`, `<CtaSection>`

---

## Phase 4: Sitemap Exclusion

Check `sites/dcs/app/sitemap.ts`. The sitemap likely uses `generateStaticParams()` results from content directories. Since `/theme-preview` has no MDX content and is a static route, it shouldn't appear in the sitemap automatically — but verify.

Also add `robots.txt` exclusion if needed:

```
Disallow: /theme-preview/
```

in `sites/dcs/app/robots.ts`.

---

## Phase 5: Verification

```bash
# 1. Showcase fully removed
grep -r "showcase" . \
  --include="*.ts" --include="*.tsx" --include="*.json" --include="*.yaml" \
  | grep -v node_modules | grep -v ".next"

# 2. Type check
pnpm type-check

# 3. DCS build
pnpm --filter dcs build

# 4. Dev server smoke test
pnpm --filter dcs dev
# Visit: http://localhost:3000/theme-preview
# Visit: http://localhost:3000/theme-preview/orion
# Visit: http://localhost:3000/theme-preview/polaris  (token-only state)
# Visit: http://localhost:3000/theme-preview/ui-kit
# Visit: http://localhost:3000/sitemap.xml  (no /theme-preview entries)
```

---

## Risks and Trade-offs

| Risk                                                                               | Likelihood | Mitigation                                                                                         |
| ---------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| Theme config export names differ across packages (e.g. `orionConfig` vs `default`) | Medium     | Read each theme's `index.ts` before implementation; fall back to default export                    |
| Atlas/Corvus have `manifest.ts` instead of standard config                         | Medium     | Check their index.ts exports; may need to import from manifest                                     |
| Home page templates require async data fetching (MDX files)                        | Medium     | For preview, pass static mock data; don't call `getContentItems()`                                 |
| CSS utility class drift (.btn-primary border-radius uses Solaris values)           | Low        | Acceptable — documented limitation, colours are correct                                            |
| `generateCssVariables()` output doesn't cover all vars needed by components        | Low        | Check generated output against what Tailwind plugin registers; add missing vars manually if needed |
| sync-themes.ts: removing showcase logic breaks theme package exports               | Low        | Run `grep` after removal to verify no theme package still references showcase-registry.tsx         |

---

## Files Created

### New files in sites/dcs/

```
app/theme-preview/layout.tsx
app/theme-preview/page.tsx
app/theme-preview/ui-kit/page.tsx
app/theme-preview/[name]/page.tsx
app/theme-preview/_lib/theme-catalog.ts
app/theme-preview/_lib/mock-content.ts
app/theme-preview/_components/ThemeCard.tsx
app/theme-preview/_components/ThemePreviewWrapper.tsx
app/theme-preview/_components/ThemeComponents.tsx
app/theme-preview/_components/TokenOnlyView.tsx
app/theme-preview/_components/ColorPalette.tsx
app/theme-preview/_components/TypeScaleDisplay.tsx
```

### Modified files

```
tools/sync-themes.ts              (remove showcase blocks)
tools/scaffold-theme-package.ts   (remove showcase-registry generation)
packages/themes/*/package.json    (remove ./{name}/showcase export entries)
sites/dcs/app/robots.ts           (add Disallow: /theme-preview/)
```

### Deleted

```
sites/showcase/                   (entire directory)
packages/themes/*/showcase-registry.tsx  (one per full theme)
```
