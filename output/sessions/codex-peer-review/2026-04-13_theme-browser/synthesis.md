# Implementation Plan: Theme Browser

**Date:** 2026-04-13
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                 | Claude                                                                                  | Codex                                                                                 | Synthesised Decision                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Data layer location    | `app/theme-preview/_lib/` (co-located with route)                                       | `lib/theme-preview/` (outside route, shared lib)                                      | **Codex wins** — `lib/` follows existing DCS convention for shared utilities                                                       |
| Component rendering    | Switch statement in `ThemeComponents.tsx` per theme                                     | Centralised `renderers.tsx` adapter with `renderHeader()`, `renderFooter()` functions | **Codex wins** — keeps route components declarative; adapter handles prop variance in one typed place                              |
| Solaris route          | `/theme-preview/ui-kit` only                                                            | `/theme-preview/ui-kit` + `/theme-preview/solaris` for parity                         | **Both** — `ui-kit` is curated, `[name]/solaris` is the standard detail page (no extra work since it comes from the generic route) |
| Bundle concern         | Not raised                                                                              | Noted: importing all theme components increases bundle weight                         | **Claude adds:** Atlas/corvus use `manifest.ts` exports; note for impl to check each theme's index.ts                              |
| Showcase cleanup depth | Includes deleting `showcase-registry.tsx` from theme packages + removing export entries | Mentions searching for references only                                                | **Claude wins** — explicit surgical cleanup is safer than a grep-only check                                                        |

## Blind Spots Caught

- **Codex caught:** Bundle weight from importing all 9 themes' components at once on preview routes. Mitigation: acceptable for an unlisted tool, but implement as `React.lazy`/dynamic imports if build size becomes an issue.
- **Claude caught (Codex missed):**
  - Atlas and Corvus have `manifest.ts` files alongside their `index.ts` — the config export name may differ from other themes. Must check each theme's `index.ts` before writing the registry.
  - `showcase-registry.tsx` files exist inside each full theme package (written there by `tools/sync-themes.ts`). These need explicit deletion, not just a grep check.
  - Home page templates (where they exist) use async data fetching (`getContentItems()`). The renderer must pass mock static props instead of calling content loaders.

---

## Implementation Plan

### Phase 1 — Kill Showcase

**1.1 Delete the showcase site**

```bash
rm -rf sites/showcase/
```

`pnpm-workspace.yaml` uses `sites/*` wildcard — no workspace config change needed.

**1.2 Clean `tools/sync-themes.ts`**

Remove these sections (exact line numbers from source):

- The comment on line ~9 referencing `sites/showcase/lib/register-all-themes.ts`
- `const REGISTER_FILE = join(ROOT, "sites/showcase/lib/register-all-themes.ts")` (line ~26)
- The `existsSync(showcasePath)` block (lines ~67–69) that adds `./${name}/showcase` entries to theme package.json exports
- The `syncRegisterFile()` call in the results array (line ~124)
- The `syncRegisterFile()` function definition itself

**1.3 Clean `tools/scaffold-theme-package.ts`**

Remove the section that generates `showcase-registry.tsx` in new theme packages. Keep all other scaffolding intact.

**1.4 Delete showcase-registry.tsx from theme packages**

```bash
find packages/themes -name "showcase-registry.tsx" -delete
```

Then remove the `"./{name}/showcase"` entries from each theme's `package.json` exports field. These were added by `sync-themes.ts` and point to the now-deleted files.

**Gate A — must pass before continuing**

```bash
# Nothing references showcase anymore
grep -r "showcase" . \
  --include="*.ts" --include="*.tsx" --include="*.json" --include="*.yaml" \
  | grep -v node_modules | grep -v ".next" | grep -v ".git"

# Type check
pnpm type-check
```

Expected: zero functional references, zero type errors.

---

### Phase 2 — Theme Catalog Data Layer

**Location:** `sites/dcs/lib/theme-preview/` (follows DCS `lib/` convention)

**2.1 Read each theme's `index.ts` before writing**

Before coding, check the actual export name for each theme config:

- Most export `export const [name]Config = ...` (e.g. `orionConfig`, `solarisConfig`)
- Atlas/Corvus may export from `manifest.ts` — check their `index.ts` to see what's re-exported

**2.2 Create `lib/theme-preview/themes.ts`**

```ts
import { generateCssVariables } from '@platform/theme-system';
// Import each theme config — check exact export name from theme's index.ts
import { orionConfig } from '@platform/themes/orion';
// ... etc for all 11 themes

export type ThemeCategory = 'full' | 'tokens-only';

export interface ThemeCatalogEntry {
  name: string;           // slug: 'orion', 'polaris', etc.
  label: string;          // display name: 'Orion', 'Polaris', etc.
  category: ThemeCategory;
  cssVars: Record<string, string>;       // from generateCssVariables(config)
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
    header: 'dark' | 'light';
    card: string;
  };
  capabilities: {
    hasComponents: boolean;
    hasPageTemplates: boolean;
    pageTemplateNames: string[];
  };
}

export const THEME_CATALOG: ThemeCatalogEntry[] = [
  {
    name: 'orion',
    label: 'Orion',
    category: 'full',
    cssVars: generateCssVariables(orionConfig),
    colors: { primary: orionConfig.colors.brand.primary, ... },
    // ...
  },
  // polaris, sirius get category: 'tokens-only', capabilities.hasComponents: false
];

export const fullThemes = THEME_CATALOG.filter(t => t.category === 'full');
export const tokenOnlyThemes = THEME_CATALOG.filter(t => t.category === 'tokens-only');
export function getThemeBySlug(slug: string) {
  return THEME_CATALOG.find(t => t.name === slug);
}
```

**2.3 Create `lib/theme-preview/mocks.ts`**

```ts
export const mockBusiness = {
  name: "Preview Business",
  tagline: "Quality service, every time",
  phone: "01234 567890",
  phoneTel: "tel:01234567890",
};

export const mockNavItems = [
  { label: "Services", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

export const mockCta = { label: "Get a Quote", href: "#" };

export const mockLocations = [
  { name: "London", slug: "london" },
  { name: "Manchester", slug: "manchester" },
];

export const mockServices = [
  {
    title: "Service One",
    description: "Professional service delivered reliably.",
    slug: "service-one",
  },
  {
    title: "Service Two",
    description: "Expert installation and maintenance.",
    slug: "service-two",
  },
  {
    title: "Service Three",
    description: "Fully insured, local specialists.",
    slug: "service-three",
  },
];
```

**2.4 Create `lib/theme-preview/renderers.tsx`**

Centralises all per-theme prop variance. Each renderer function maps the shared mock data to a specific theme component's prop interface. The route components import these and stay declarative.

```tsx
import { OrionHeader, OrionFooter } from '@platform/themes/orion/components';
import { SolarisHeader, SolarisFooter } from '@platform/themes/solaris/components';
// ... all other full-theme components

import { mockBusiness, mockNavItems, mockCta, mockLocations } from './mocks';

type ThemeRenderer = {
  renderHeader: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
  renderHeroStub: () => React.ReactNode;  // manual stub or page template call
};

export const RENDERERS: Record<string, ThemeRenderer> = {
  orion: {
    renderHeader: () => (
      <OrionHeader
        siteName={mockBusiness.name}
        primaryCta={mockCta}
        navigation={mockNavItems}
        locations={mockLocations}
        showPhone
        phoneDisplay={mockBusiness.phone}
        phoneTel={mockBusiness.phoneTel}
      />
    ),
    renderFooter: () => <OrionFooter ... />,
    renderHeroStub: () => <section className="...">...</section>,
  },
  solaris: { ... },
  // etc. for all 9 full themes
};
```

**Note on async page templates:** If using a theme's exported page template (e.g. `OrionHomePage`), it likely calls async content loaders internally. Do NOT use page templates for the preview — compose a static hero stub manually. Pass only static mock data.

**Gate B**

```bash
pnpm type-check
# Ensure all renderer function signatures satisfy each theme component's prop types
```

---

### Phase 3 — Theme Preview Routes

**3.1 Nested layout: `sites/dcs/app/theme-preview/layout.tsx`**

```tsx
export const metadata = {
  robots: { index: false, follow: false },
};

export default function ThemePreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-surface-subtle-border bg-surface-subtle px-6 py-2 text-sm text-surface-muted-foreground flex items-center gap-3">
        <a href="/" className="hover:text-surface-foreground">
          ← Back to DCS
        </a>
        <span aria-hidden>|</span>
        <span>Theme Preview</span>
      </div>
      {children}
    </div>
  );
}
```

The `metadata` export on the layout applies `noindex`/`nofollow` to all child routes.

**3.2 Gallery: `sites/dcs/app/theme-preview/page.tsx`**

```tsx
export const metadata = { robots: { index: false, follow: false } };

export default function ThemeGallery() {
  return (
    <div className="container-standard py-12">
      <h1 className="text-h1 mb-2">Theme Gallery</h1>
      <p className="text-surface-muted-foreground mb-10">
        Available themes for the Local Business Platform.
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

**ThemeCard** (co-located in `_components/ThemeCard.tsx`):

- Colour strip: 3 `<div>` elements with `style={{ backgroundColor: entry.colors.primary }}` etc.
- Font name text with `style={{ fontFamily: entry.typography.sansFamily }}`
- Badges: hero variant, header light/dark, page template count or "Design spec only"
- Link to `/theme-preview/[name]`

**3.3 Per-theme detail: `sites/dcs/app/theme-preview/[name]/page.tsx`**

```tsx
export async function generateStaticParams() {
  return THEME_CATALOG.map((t) => ({ name: t.name }));
}

export default function ThemeDetailPage({ params }: { params: { name: string } }) {
  const entry = getThemeBySlug(params.name);
  if (!entry) notFound();

  if (entry.category === "tokens-only") {
    return <TokenOnlyView entry={entry} />;
  }

  const renderer = RENDERERS[entry.name];

  return (
    <div style={entry.cssVars as React.CSSProperties}>
      {renderer.renderHeader()}
      {renderer.renderHeroStub()}
      {/* Card grid using mock services */}
      <section className="section">
        <div className="container-standard grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockServices.map((s) => (
            <div key={s.slug} className="card p-6">
              <h3 className="text-h3">{s.title}</h3>
              <p className="text-surface-muted-foreground mt-2">{s.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Design token panel */}
      <ColorPalette cssVars={entry.cssVars} />
      {renderer.renderFooter()}
    </div>
  );
}
```

**Key:** The `style={entry.cssVars as React.CSSProperties}` sets all `--color-*`, `--radius-*` etc. on the wrapper. CSS custom property inheritance means all theme components inside resolve to these values, not the Solaris `:root` values.

**3.4 Token-only view: `_components/TokenOnlyView.tsx`**

Renders: "Design spec — no component implementations yet" badge, full colour palette swatches with hex codes, typography scale table.

**3.5 UI kit: `sites/dcs/app/theme-preview/ui-kit/page.tsx`**

No CSS injection needed (Solaris is native). Sections:

- Colour palette from `generateCssVariables(solarisConfig)` displayed as swatches
- Typography scale (each level rendered at actual size)
- Button variants: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- Card variants: `.card`, `.card-interactive`, `.card-simple`
- Sample core-components: `<StarRating>`, CTA section

**Gate C**

```bash
# Dev server
pnpm --filter dcs dev
# Manual checks:
# /theme-preview → 11 theme cards
# /theme-preview/orion → Orion red/orange components
# /theme-preview/polaris → token-only state
# /theme-preview/ui-kit → Solaris native kit
```

---

### Phase 4 — Sitemap + Robots Exclusion

**4.1 Review `sites/dcs/app/sitemap.ts`**

Verify `/theme-preview` routes are not emitted. The sitemap likely generates from MDX content directories — static routes under `app/` are typically not auto-included. If the sitemap manually enumerates routes, ensure `theme-preview` is absent.

**4.2 Update `sites/dcs/app/robots.ts`**

Add:

```ts
disallow: ['/theme-preview'],
```

to the rules block. This reinforces the per-page noindex.

**Gate D**

```bash
# Build and inspect sitemap
pnpm --filter dcs build
# Check .next/server/app/sitemap.xml — no /theme-preview* entries
# Check page source on /theme-preview: <meta name="robots" content="noindex,nofollow">
```

---

### Phase 5 — Final Verification

```bash
# 1. Showcase fully removed
grep -r "showcase" . \
  --include="*.ts" --include="*.tsx" --include="*.json" --include="*.yaml" \
  | grep -v node_modules | grep -v ".next" | grep -v ".git"

# 2. Type check
pnpm type-check

# 3. DCS build
pnpm --filter dcs build

# 4. Acceptance walkthrough (dev server)
# /theme-preview             → grid of 11 theme cards with colour swatches
# /theme-preview/orion       → Orion red/orange; OrionHeader + Footer visible
# /theme-preview/solaris     → Solaris colours; SolarisHeader + Footer visible
# /theme-preview/polaris     → "Design spec only" graceful state
# /theme-preview/ui-kit      → Solaris buttons, cards, type scale, colour palette
# /sitemap.xml               → zero /theme-preview* entries
# Nav + site.config.ts       → no theme-preview link
```

---

## Risks and Mitigations

| Risk                                                              | Likelihood | Mitigation                                                                                                                                     |
| ----------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Atlas/Corvus config export names differ from other themes         | Medium     | Read each theme's `index.ts` before writing catalog; fall back to `default` export                                                             |
| Home page templates call async loaders internally                 | Medium     | Never use page templates for hero render — compose static stubs using mock data                                                                |
| CSS utility class drift (.btn-primary uses Solaris border-radius) | Low        | Acceptable limitation — colours are correct, minor token drift is fine                                                                         |
| Bundle weight from importing all theme components                 | Low        | Acceptable for unlisted tool; refactor with `React.lazy`/dynamic imports if build size degrades                                                |
| sync-themes still runs and tries to write register-all-themes.ts  | Low        | After removal, verify by running `npx tsx tools/sync-themes.ts --dry-run` (or just run it and check it errors cleanly on missing showcase dir) |

---

## File Inventory

### Deleted

```
sites/showcase/                                    (entire directory)
packages/themes/*/showcase-registry.tsx            (one per full theme, ~9 files)
```

### Modified

```
tools/sync-themes.ts                               (remove showcase blocks)
tools/scaffold-theme-package.ts                    (remove showcase-registry generation)
packages/themes/*/package.json                     (remove ./{name}/showcase export entries)
sites/dcs/app/robots.ts                            (add Disallow: /theme-preview)
```

### Created

```
sites/dcs/lib/theme-preview/themes.ts
sites/dcs/lib/theme-preview/mocks.ts
sites/dcs/lib/theme-preview/renderers.tsx

sites/dcs/app/theme-preview/layout.tsx
sites/dcs/app/theme-preview/page.tsx
sites/dcs/app/theme-preview/ui-kit/page.tsx
sites/dcs/app/theme-preview/[name]/page.tsx
sites/dcs/app/theme-preview/_components/ThemeCard.tsx
sites/dcs/app/theme-preview/_components/TokenOnlyView.tsx
sites/dcs/app/theme-preview/_components/ColorPalette.tsx
```
