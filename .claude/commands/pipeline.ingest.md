# Pipeline Ingest

Run the full ingestion pipeline against a URL, then create a temporary test site using the generated theme.

**Usage:** `/pipeline.ingest --url https://example.com [--name my-theme]`

---

## Step 1: Preflight Checks

```bash
git branch --show-current
```

Must be on `develop`. If not, STOP: "Switch to develop branch first."

Check working tree:
```bash
git status --porcelain
```
If dirty, WARN: "Working tree has uncommitted changes. Proceeding anyway — test site creation does not commit."

Parse `$ARGUMENTS` for:
- `--url` (required) — the website URL to analyse
- `--name` (optional) — override the auto-assigned theme name

If `--url` is missing, STOP with: "Usage: /pipeline.ingest --url https://example.com [--name my-theme]"

## Step 2: Run Ingestion Pipeline

```bash
npx tsx tools/analyse-site.ts --url $URL [--name $NAME]
```

This takes several minutes. Wait for completion.

After the pipeline finishes, determine the theme name:
- If `--name` was supplied, use that
- Otherwise, parse from the pipeline summary output (look for "Theme: <name>")
- As a fallback, find the newest folder under `output/ingestion/`

**Verification gate — STOP if this fails:**
```bash
ls packages/themes/<theme-name>/index.ts
```
If the theme package was not created, STOP: "Pipeline did not create theme package. Check output above for errors."

## Step 2b: Capture Reference HTML Source

Create output directories:
```bash
mkdir -p output/ingestion/<theme-name>/html
mkdir -p output/ingestion/<theme-name>/meta
```

For each page in `discoveredPages[]` from `output/ingestion/<theme-name>/site-analysis.json`, download the HTML source using curl. Map `pageType` to filename:
- `pageType === "home"` → `home.html`
- `pageType === "about"` → `about.html`
- `pageType === "contact"` → `contact.html`
- `pageType` containing `services-list` or `blog-list` → `<pageType>.html`
- `pageType` containing `service-detail` or `blog-post` → `<pageType>.html` (first depth-2 page only)

```bash
curl -s --max-time 15 -L -A "Mozilla/5.0" "<page.url>" \
  -o "output/ingestion/<theme-name>/html/<pageType>.html"
```

**WARN not STOP** if curl fails — many sites block crawlers. Screenshots (already captured by Step 2) are the primary reference; HTML is supplementary for structural comparison by the review agent.

Write `output/ingestion/<theme-name>/meta/html-manifest.json`:
```json
{
  "capturedAt": "<ISO timestamp>",
  "pages": [
    { "pageType": "home", "url": "<page url>", "file": "html/home.html" }
  ]
}
```

## Step 2c: Download Reference Images

Download images from the reference site and place them into the test site's public directory so the fix agent can wire them into components.

Create directories:
```bash
mkdir -p output/ingestion/<theme-name>/images
mkdir -p sites/test-<theme-name>/public/images
```

For each HTML file captured in Step 2b, extract `<img src="...">` values:
```bash
grep -oh 'src="[^"]*"' output/ingestion/<theme-name>/html/*.html 2>/dev/null \
  | sed 's/src="//;s/"//' \
  | grep -v '^data:' \
  | grep -v '^$' \
  | sort -u > /tmp/<theme-name>-img-urls.txt
```

For each URL in that list (max 20 total):
- Skip if URL length > 2000 chars
- Resolve relative URLs to absolute using the page base URL (prefix `<source-url>` if path starts with `/`)
- Sanitise filename — **use python3, not `tr`** (`tr` produces a trailing `-` on most image URLs):
```bash
python3 -c "
import sys, re
url = sys.argv[1]
name = url.split('/')[-1].split('?')[0].split('#')[0]
name = re.sub(r'[^a-zA-Z0-9._-]', '-', name)
name = name.strip('-') or 'image'
print(name)
" "$url"
```
- Download to ingestion dir only (test site gets the images later in Step 3):
```bash
curl -s --max-time 10 -L -A "Mozilla/5.0" "$url" \
  -o "output/ingestion/<theme-name>/images/<sanitised-filename>"
```

**WARN not STOP** on any curl failure — CDNs frequently block direct downloads. Continue to next image.

Write `output/ingestion/<theme-name>/meta/image-manifest.json`:
```json
{
  "capturedAt": "<ISO timestamp>",
  "images": [
    {
      "originalUrl": "https://example.com/hero.jpg",
      "localPath": "output/ingestion/<theme-name>/images/hero.jpg",
      "publicPath": "/images/hero.jpg"
    }
  ]
}
```

Print: `Downloaded N/M images (M attempted) → output/ingestion/<theme-name>/images/`

## Step 3: Create Test Site

Copy base-template to create the test site. **Important:** `sites/test-<theme-name>/` must NOT exist yet when `cp -r` runs — if Step 2c created `public/images/` inside it first, `cp -r` nests `base-template/` inside the existing directory instead of replacing it.

```bash
cp -r sites/base-template sites/test-<theme-name>
rm -rf sites/test-<theme-name>/node_modules sites/test-<theme-name>/.next sites/test-<theme-name>/.turbo
```

Then copy the downloaded reference images into the test site's public directory:
```bash
mkdir -p sites/test-<theme-name>/public/images
cp output/ingestion/<theme-name>/images/* sites/test-<theme-name>/public/images/ 2>/dev/null || true
```

## Step 4: Write Marker File

Create `sites/test-<theme-name>/.pipeline-test-site.json` with:
```json
{
  "createdAt": "<current ISO timestamp>",
  "themeName": "<theme-name>",
  "sourceUrl": "<url>",
  "pipelineOutput": "output/ingestion/<theme-name>/"
}
```

## Step 5: Wire Theme Into Test Site

**5a.** Rewrite `sites/test-<theme-name>/theme.config.ts`:

First, read `packages/themes/<theme-name>/index.ts` to find the exported Registry and DefaultConfig variable names (e.g. `lyraRegistry` and `lyraDefaultConfig`).

Then write:

```typescript
import type { DeepPartialThemeConfig } from '@platform/theme-system';
import { <camelCaseThemeName>Registry, <camelCaseThemeName>DefaultConfig } from '@platform/themes/<theme-name>';

/**
 * Test site theme configuration
 * Generated by /pipeline.ingest
 */
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: <camelCaseThemeName>Registry,
  ...<camelCaseThemeName>DefaultConfig,
  // Always override surface tokens directly in theme.config.ts.
  // The theme-system Tailwind plugin is pre-compiled to dist/ — values imported from
  // theme packages are not guaranteed to be picked up at the consuming site's build time.
  // Overrides in theme.config.ts are always applied.
  colors: {
    ...<camelCaseThemeName>DefaultConfig.colors,
    surface: {
      ...<camelCaseThemeName>DefaultConfig.colors?.surface,
      inverse: '<surface-inverse-hex>',
    },
  },
};
```

Where:
- `<camelCaseThemeName>` is the theme name in camelCase (e.g., `lyra` → `lyra`, `dark-forest` → `darkForest`)
- `<surface-inverse-hex>` is from `themeTokenRecommendations.colors.surface.inverse` in `site-analysis.json`. If the field is absent or null, use `'#111111'` as a safe dark fallback.

**Why this matters:** If `surface.inverse` is not overridden here and the theme's hero/CTA uses `bg-surface-inverse`, it will render as `#111827` (the theme-system default near-black) instead of the intended brand colour. This makes hero sections appear much darker than the reference site.

**5b.** Rewrite `sites/test-<theme-name>/app/globals.css` with:

```css
@import "../../../packages/themes/<theme-name>/globals.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * Pipeline Test Site — <theme-name> theme
 * Generated by /pipeline.ingest
 */

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(<$BODY_VAR>), sans-serif;
    @apply bg-surface-background text-surface-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }

  h1, h2, h3, h4 {
    font-family: var(<$HEADING_VAR>), serif;
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    direction: ltr;
    font-feature-settings: 'liga';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
  }
}
```

`$BODY_VAR` and `$HEADING_VAR` are the CSS custom property names computed during Step 5e font determination (e.g. `--font-inter`, `--font-newsreader`). Write globals.css **after** Step 5e font determination so the correct variable names can be substituted.

**5c.** Generate a CI-inert `sites/test-<theme-name>/package.json`:

1. Read `sites/base-template/package.json`
2. Use `generateTestSitePackageJson('test-<theme-name>', basePackageJson)` from `tools/lib/test-site-package.ts` to generate the test site package.json
3. Write the result to `sites/test-<theme-name>/package.json`

The utility strips all scripts except `dev`, `start`, and `clean`, and adds `"pipelineTestSite": true`.

Verify the result is CI-inert:
```bash
node -e "
  const p = require('./sites/test-<theme-name>/package.json');
  const bad = ['build','type-check','lint','test'].filter(s => p.scripts?.[s]);
  if (bad.length) { console.error('FAIL: test site has CI scripts:', bad); process.exit(1); }
  if (!p.pipelineTestSite) { console.error('FAIL: missing pipelineTestSite marker'); process.exit(1); }
  console.log('PASS: test site is CI-inert');
"
```

**5d.** Update `sites/test-<theme-name>/site.config.ts` — find the `tagline` value and change it to `'Pipeline Test Site — <theme-name> theme'`.

**5e.** Rewrite `sites/test-<theme-name>/app/layout.tsx`.

**5e-i: Determine fonts**

Read `output/ingestion/<theme-name>/site-analysis.json`. Extract:
- `themeTokenRecommendations.typography.fontFamilySans[0]` → `$BODY_FONT_NAME`
- `themeTokenRecommendations.typography.fontFamilyHeading[0]` → `$HEADING_FONT_NAME`

Fallback (if field missing or null): `$BODY_FONT_NAME = "Work Sans"`, `$HEADING_FONT_NAME = "Newsreader"`

**next/font/google export name:** Replace spaces with underscores: `"Work Sans"` → `Work_Sans`, `"DM Sans"` → `DM_Sans`, `"Plus Jakarta Sans"` → `Plus_Jakarta_Sans`, `"Source Serif 4"` → `Source_Serif_4`, etc.

**Confirmed available in next/font/google:** `Inter`, `Lato`, `Work_Sans`, `Newsreader`, `Outfit`, `Montserrat`, `DM_Sans`, `Plus_Jakarta_Sans`, `Space_Grotesk`, `Manrope`, `Rubik`, `Geist`, `Sora`, `EB_Garamond`, `Literata`, `Source_Serif_4`, `Domine`, `Libre_Caslon_Text`, `Noto_Serif`, `Raleway`, `Open_Sans`, `Poppins`, `Nunito`, `Roboto`, `Mulish`, `Barlow`.

Any font NOT in the confirmed list → fall back to `Work_Sans` (body) or `Newsreader` (heading).

**CSS variable name:** Lowercase + underscores→hyphens: `Work_Sans` → `--font-work-sans`, `Source_Serif_4` → `--font-source-serif-4`. These become `$BODY_VAR` and `$HEADING_VAR`, also used in Step 5b globals.css.

**5e-ii: Determine font weights**

- Body font: `['300', '400', '500', '600', '700']`
- Heading font (serif — Newsreader, EB_Garamond, Literata, Source_Serif_4, Domine, Libre_Caslon_Text, Noto_Serif): `['200', '300', '400', '500', '600', '700', '800']` + `style: ['normal', 'italic']`
- Heading font (sans-serif): `['400', '500', '600', '700', '800']`

**5e-iii: Write layout.tsx**

If body and heading are the same font, use a single font instance with `variable: '--font-primary'`. globals.css uses `var(--font-primary)` for both body and h1-h4.

For two different fonts (the typical case):

```typescript
import type { Metadata, Viewport } from 'next';
import { <BodyExportName>, <HeadingExportName> } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/site.config';
import { ThemeProvider } from '@platform/core-components';
import { <camelCaseThemeName>Registry } from '@platform/themes/<theme-name>';

const bodyFont = <BodyExportName>({
  subsets: ['latin'],
  variable: '<$BODY_VAR>',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const headingFont = <HeadingExportName>({
  subsets: ['latin'],
  variable: '<$HEADING_VAR>',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.tagline,
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider theme="<theme-name>" registry={<camelCaseThemeName>Registry}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Why bare shell:** Generated pages include Nav and Footer inline — no double header/footer. Do NOT include SiteHeader, Footer, PageShell, ReviewPanel, analytics, or consent components.

**After writing layout.tsx:** Go back and write `globals.css` (Step 5b) using the `$BODY_VAR` and `$HEADING_VAR` names computed above.

**5f.** Generate five standard pages in the test site.

This step always produces exactly five routes regardless of what the analysis pipeline generated. The `output/ingestion/<theme-name>/example-pages/` directory is **not used** — the five pages are generated fresh from `site-analysis.json`.

**5f-0: Load site-analysis.json**

Read the full JSON:
```bash
cat output/ingestion/<theme-name>/site-analysis.json
```

Extract and hold in working memory:
- `discoveredPages[]` — pages found on reference site (path, pageType, source, depth)
- `pageBlueprints[]` — section structure per page (sections[] with blueprintId + order)
- `sectionBlueprints[]` — section definitions (id, componentFileName, componentExportName, category, purpose, layoutPattern)
- `componentMatches[]` — which blueprints matched core-components (exact/close/partial)
- `registryRecommendation.themeName` — nearest theme constellation (orion|vega)
- `reference.url` — source URL (add as comment in generated page files)

**5f-1: Build component inventory**

```bash
ls packages/themes/<theme-name>/components/ 2>/dev/null || echo "no-components"
```

Build two sets:

**`themeNavComponents`** — component export names from the theme where the `sectionBlueprints[].category` is `"Navigation"` OR the filename contains `nav`, `navigation`, `header`, `topbar`, `top-nav`.

**`themeFooterComponents`** — component export names where category is `"Footer"` OR filename contains `footer`.

For all other components: build a map of `blueprintId → componentExportName` from `sectionBlueprints[].componentFileName` cross-referenced with files actually present in `packages/themes/<theme-name>/components/`.

**Safe core-components for fallback** (barrel import, no async data):
- Hero: `HeroV1`, `HeroV2`, `HeroV3`, `HeroSection`, `HeroWithImage`, `PageHero`
- Sections: `CTASection`, `ServiceCards`, `FAQSection`, `Breadcrumbs`
- Forms: `ContactForm` (client component — always safe)

**Never use from core-components:**
- `Footer` — uses `getContentItems()` + `fs/promises`, will crash without MDX content
- Any component calling `getContentItems()`, `getLocations()`, `getServices()`

**Component resolution hierarchy** (per section):
1. Theme component — if `packages/themes/<theme-name>/components/<componentFileName>` exists → import from `@platform/themes/<theme-name>/components`
2. Core component match — if `componentMatches` has "exact" or "close" confidence → import from `@platform/core-components` (barrel only, no subpath)
3. Inline JSX — write the section directly in the page file using Tailwind theme tokens

**5f-1b: Verify and clean theme barrel index**

The pipeline sometimes marks components as "reused from core" but still appends their names to the theme's `index.ts` barrel. This causes import errors at build time. After building the component inventory, verify every named export in `packages/themes/<theme-name>/components/index.ts` has a corresponding file:

```bash
# List exports from barrel
grep -o "export \* from '\./[^']*'" packages/themes/<theme-name>/components/index.ts \
  | sed "s|export \* from '\./||;s|'||" \
  | while read name; do
    file="packages/themes/<theme-name>/components/${name}.tsx"
    [ -f "$file" ] || echo "MISSING: $name"
  done
```

For each MISSING export: remove that `export * from './...'` line from `packages/themes/<theme-name>/components/index.ts`.

**This is a known pipeline defect** — do not skip this step even if the inventory looks complete.

**5f-1c: Fix animation import paths in theme components**

AI-generated theme components frequently use the wrong import path for animation primitives. The pipeline writes:
```
@platform/core-components/src/components/animation
```
but the correct path is:
```
@platform/core-components/components/animation
```

Batch-fix all affected files:
```bash
grep -rl '@platform/core-components/src/components/animation' \
  packages/themes/<theme-name>/components/ \
  | xargs -I{} sed -i '' \
    's|@platform/core-components/src/components/animation|@platform/core-components/components/animation|g' {}
```

Verify the fix:
```bash
grep -r '@platform/core-components/src/components/animation' \
  packages/themes/<theme-name>/components/ 2>/dev/null \
  && echo "WARN: Some import paths not fixed" \
  || echo "PASS: Animation import paths clean"
```

**5f-2: Detect category slug**

Apply this decision tree (first definitive match wins):

**Step 1:** Extract all depth-1 paths from `discoveredPages[]`:
- Filter: `path.split('/').length === 2` and `path !== '/'`
- Get the slug: `path.split('/')[1]`
- Deduplicate

**Step 2:** Remove reserved roots: `about`, `contact`, `privacy`, `privacy-policy`, `cookie-policy`, `cookies`, `terms`, `legal`, `search`, `404`, `500`

**Step 3:** Score remaining candidates:

| Signal | Points |
|--------|--------|
| Has depth-2 page under `/<slug>/something` in discoveredPages | +3 |
| Has `pageBlueprints` entry for `/<slug>/` with ≥1 section | +2 |
| Has pageType containing `list` (services-list, blog-list, etc.) | +2 |
| Appears in discoveredPages with `source: "nav"` | +1 |

**Step 4:** Pick the highest-scoring candidate. On tie, prefer the one with the lowest index in `discoveredPages` (nav ordering).

**Step 5:** If no candidates remain: use `"services"` as fallback.

**Step 6:** Emit: `Detected category slug: <slug> (source: <detection-reason>)`

**Nav/Footer resolution:**
- Nav: if `themeNavComponents` has entries → use the first (or the one whose blueprint appears first in home page sections). If empty → use inline nav block.
- Footer: if `themeFooterComponents` has entries → use the first (or the one whose blueprint appears last in home page sections). If empty → use inline footer block. **Never import Footer from core-components** — it crashes without MDX content.

**5f-3: Clean test site pages**

```bash
find sites/test-<theme-name>/app -name "page.tsx" -delete
find sites/test-<theme-name>/app -type d -empty -delete
mkdir -p sites/test-<theme-name>/app/about
mkdir -p sites/test-<theme-name>/app/contact
mkdir -p "sites/test-<theme-name>/app/<detected-slug>/[slug]"
```

**5f-4 through 5f-8: Generate five pages (one at a time)**

For each page:
1. Find matching blueprint in `pageBlueprints` (match by `path` or `pageType`)
2. If found: render sections in `sections[]` order, resolving each via the hierarchy in 5f-1
3. If NOT found: use the fallback template

**Structural rules for ALL generated pages:**
- `export default function Page()` — not async, no server data loading
- All Tailwind classes use theme tokens: `bg-brand-primary`, `text-on-brand-primary`, `bg-surface-background`, `text-surface-foreground`, `bg-surface-muted`, `text-surface-muted-foreground`, `border-surface-subtle`, `bg-surface-inverse`, `text-brand-primary`
- **No hardcoded hex colors**
- **No `generateStaticParams`, `getContentItems`, `getServices`, `getLocations`, `fs.readdir`**
- Add comment at top of sections block: `{/* Source: <reference.url> — <pageType> blueprint */}` or `{/* Source: fallback template */}`
- **Opacity modifier on CSS custom properties does not work:** Tailwind's `/opacity` modifier (e.g. `bg-surface-background/80`) renders transparent when the colour comes from a CSS custom property (`var()`). For semi-transparent theme colours, use the hex value from `themeTokenRecommendations` as an arbitrary value: `bg-[#hexvalue]/80`. This applies to sticky navs, hero overlays, and decorative backgrounds.
- **Preserve all CSS animation and interaction classes:** Do not omit transition durations (`duration-300`, `duration-500`, `duration-700`), hover transforms (`hover:scale-105`, `hover:-translate-y-1`), grayscale filters (`grayscale`, `grayscale-[20%]`), or opacity transitions. If the blueprint indicates an interactive pattern, the TSX must implement it.
- **No hardcoded hex colours** — except for the opacity workaround above, where a hardcoded hex is the only correct solution.

---

**5f-4: `app/page.tsx` (Home)**

Blueprint lookup: `pageBlueprints` where `path === "/"` or `pageType === "home"`

Fallback template (use when no home blueprint exists):

```tsx
<Nav />
{/* Source: fallback template */}

{/* Hero */}
<section className="bg-brand-primary text-on-brand-primary py-20 md:py-32">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Our Business</h1>
    <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">Professional services tailored to your needs</p>
    <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">Get in Touch</a>
  </div>
</section>

{/* Services/Category Overview */}
<section className="py-16 md:py-24 bg-surface-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-surface-foreground text-center mb-12">What We Do</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-surface-muted rounded-lg p-6 border border-surface-subtle">
        <h3 className="text-xl font-semibold text-surface-foreground mb-3">Quality Service</h3>
        <p className="text-surface-muted-foreground">Experienced professionals delivering reliable results every time.</p>
      </div>
      <div className="bg-surface-muted rounded-lg p-6 border border-surface-subtle">
        <h3 className="text-xl font-semibold text-surface-foreground mb-3">Tailored Solutions</h3>
        <p className="text-surface-muted-foreground">Customised approaches that meet your specific requirements.</p>
      </div>
      <div className="bg-surface-muted rounded-lg p-6 border border-surface-subtle">
        <h3 className="text-xl font-semibold text-surface-foreground mb-3">Get Started</h3>
        <p className="text-surface-muted-foreground">Contact us today for a free, no-obligation consultation.</p>
      </div>
    </div>
  </div>
</section>

{/* Stats strip */}
<section className="py-12 bg-surface-inverse">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div><p className="text-4xl font-bold text-brand-primary">10+</p><p className="text-surface-muted-foreground mt-1">Years Experience</p></div>
      <div><p className="text-4xl font-bold text-brand-primary">500+</p><p className="text-surface-muted-foreground mt-1">Happy Clients</p></div>
      <div><p className="text-4xl font-bold text-brand-primary">100%</p><p className="text-surface-muted-foreground mt-1">Satisfaction Rate</p></div>
      <div><p className="text-4xl font-bold text-brand-primary">24/7</p><p className="text-surface-muted-foreground mt-1">Support Available</p></div>
    </div>
  </div>
</section>

{/* CTA */}
<section className="py-16 bg-brand-primary text-on-brand-primary">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
    <p className="text-lg opacity-90 mb-8">Get in touch for a free quote today.</p>
    <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">Contact Us</a>
  </div>
</section>

<Footer />
```

---

**5f-5: `app/about/page.tsx`**

Blueprint lookup: `path === "/about"` or `pageType === "about"`

Fallback template:

```tsx
<Nav />
{/* Source: fallback template */}

<section className="bg-surface-muted py-12 md:py-16 border-b border-surface-subtle">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold text-surface-foreground">About Us</h1>
    <p className="mt-4 text-lg text-surface-muted-foreground max-w-3xl">Learn more about our team and what drives us.</p>
  </div>
</section>

<section className="py-16 md:py-24 bg-surface-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl">
      <h2 className="text-3xl font-bold text-surface-foreground mb-6">Our Story</h2>
      <p className="text-surface-muted-foreground mb-4 text-lg leading-relaxed">We are a dedicated team of professionals committed to delivering exceptional service. With years of experience in the industry, we understand what it takes to exceed expectations.</p>
      <p className="text-surface-muted-foreground text-lg leading-relaxed">Our mission is to provide reliable, high-quality solutions that make a real difference for our clients and their communities.</p>
    </div>
  </div>
</section>

<section className="py-16 md:py-24 bg-surface-muted">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-surface-foreground text-center mb-12">Our Values</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-surface-background rounded-lg p-6 border border-surface-subtle text-center">
        <div className="w-12 h-12 bg-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center"><span className="text-on-brand-primary text-xl font-bold">1</span></div>
        <h3 className="text-xl font-semibold text-surface-foreground mb-2">Quality</h3>
        <p className="text-surface-muted-foreground">Uncompromising standards in everything we do.</p>
      </div>
      <div className="bg-surface-background rounded-lg p-6 border border-surface-subtle text-center">
        <div className="w-12 h-12 bg-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center"><span className="text-on-brand-primary text-xl font-bold">2</span></div>
        <h3 className="text-xl font-semibold text-surface-foreground mb-2">Reliability</h3>
        <p className="text-surface-muted-foreground">Consistent delivery you can count on every time.</p>
      </div>
      <div className="bg-surface-background rounded-lg p-6 border border-surface-subtle text-center">
        <div className="w-12 h-12 bg-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center"><span className="text-on-brand-primary text-xl font-bold">3</span></div>
        <h3 className="text-xl font-semibold text-surface-foreground mb-2">Trust</h3>
        <p className="text-surface-muted-foreground">Building lasting relationships with our clients.</p>
      </div>
    </div>
  </div>
</section>

<section className="py-16 bg-brand-primary text-on-brand-primary">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-bold mb-4">Work With Us</h2>
    <p className="text-lg opacity-90 mb-8">Ready to find out what we can do for you?</p>
    <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">Get in Touch</a>
  </div>
</section>

<Footer />
```

---

**5f-6: `app/contact/page.tsx`**

Blueprint lookup: `path === "/contact"` or `pageType === "contact"`

Import `ContactForm` from `@platform/core-components` — it is a safe client component that does not use `getContentItems` or `fs/promises`. Do NOT import `Footer` from core-components.

Fallback template:

```tsx
import { ContactForm } from '@platform/core-components';

// ...

<Nav />
{/* Source: fallback template */}

<section className="bg-surface-muted py-12 md:py-16 border-b border-surface-subtle">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold text-surface-foreground">Contact Us</h1>
    <p className="mt-4 text-lg text-surface-muted-foreground max-w-3xl">Get in touch with our team — we would love to hear from you.</p>
  </div>
</section>

<section className="py-16 md:py-24 bg-surface-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <ContactForm />
      </div>
      <div className="space-y-6">
        <div className="bg-surface-muted rounded-lg p-6 border border-surface-subtle">
          <h2 className="text-xl font-bold text-surface-foreground mb-4">Get in Touch</h2>
          <div className="space-y-3 text-surface-muted-foreground text-sm">
            <p>We aim to respond to all enquiries within 24 hours.</p>
            <p>For urgent matters, please call us directly.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<Footer />
```

---

**5f-7: `app/<detected-slug>/page.tsx`**

Blueprint lookup: `path === "/<detected-slug>"` or `path === "/<detected-slug>/"` in pageBlueprints

Fallback template (replace `<SLUG>` with actual slug, `<SLUG_TITLE>` with slug capitalised):

```tsx
const items = [
  { title: '<SLUG_TITLE> One', slug: '<slug>-one', description: 'A detailed overview of this offering and what it includes for you.' },
  { title: '<SLUG_TITLE> Two', slug: '<slug>-two', description: 'Information about this service and the benefits it provides.' },
  { title: '<SLUG_TITLE> Three', slug: '<slug>-three', description: 'How this service can help you achieve your goals.' },
];

// ...

<Nav />
{/* Source: fallback template */}

<section className="bg-surface-muted py-12 md:py-16 border-b border-surface-subtle">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold text-surface-foreground">Our <SLUG_TITLE></h1>
    <p className="mt-4 text-lg text-surface-muted-foreground max-w-3xl">Browse our full range of <SLUG> below.</p>
  </div>
</section>

<section className="py-16 md:py-24 bg-surface-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <a key={item.slug} href={`/<SLUG>/${item.slug}`} className="group block bg-surface-muted rounded-lg border border-surface-subtle overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video bg-brand-primary opacity-10" />
          <div className="p-6">
            <h2 className="text-xl font-semibold text-surface-foreground group-hover:text-brand-primary transition-colors mb-2">{item.title}</h2>
            <p className="text-surface-muted-foreground">{item.description}</p>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

<section className="py-16 bg-brand-primary text-on-brand-primary">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-bold mb-4">Interested in Our <SLUG_TITLE>?</h2>
    <p className="text-lg opacity-90 mb-8">Contact us today to discuss your requirements.</p>
    <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">Get a Quote</a>
  </div>
</section>

<Footer />
```

---

**5f-8: `app/<detected-slug>/[slug]/page.tsx`**

Blueprint lookup: `routePattern` containing `[slug]` under `/<detected-slug>` in pageBlueprints

**Do NOT add `generateStaticParams`** — dev-mode only test site.

Fallback template:

```tsx
export default function Page({ params }: { params: { slug: string } }) {
  const title = params.slug
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen">
      <Nav />
      {/* Source: fallback template */}

      <section className="bg-brand-primary text-on-brand-primary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm mb-4 opacity-75" aria-label="Breadcrumb">
            <a href="/" className="hover:underline">Home</a>
            <span className="mx-2">/</span>
            <a href="/<SLUG>" className="hover:underline capitalize"><SLUG></a>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">{title}</h1>
          <p className="mt-4 text-xl opacity-90 max-w-2xl">Professional <SLUG> services delivered with expertise and care.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-surface-foreground mb-6">Overview</h2>
          <p className="text-surface-muted-foreground text-lg leading-relaxed mb-6">Our {title.toLowerCase()} service is delivered by experienced professionals committed to quality and reliability. We tailor every project to your specific requirements.</p>
          <h2 className="text-2xl font-bold text-surface-foreground mt-12 mb-4">{"What's Included"}</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3"><span className="text-brand-primary mt-1 font-bold">✓</span><span className="text-surface-muted-foreground">Initial consultation and needs assessment</span></li>
            <li className="flex items-start gap-3"><span className="text-brand-primary mt-1 font-bold">✓</span><span className="text-surface-muted-foreground">Detailed planning and preparation</span></li>
            <li className="flex items-start gap-3"><span className="text-brand-primary mt-1 font-bold">✓</span><span className="text-surface-muted-foreground">Professional delivery by qualified team</span></li>
            <li className="flex items-start gap-3"><span className="text-brand-primary mt-1 font-bold">✓</span><span className="text-surface-muted-foreground">Follow-up and satisfaction guarantee</span></li>
          </ul>
        </div>
      </section>

      <section className="py-16 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-surface-foreground mb-8">Related <SLUG_TITLE></h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a href="/<SLUG>/<SLUG>-one" className="block bg-surface-background rounded-lg p-6 border border-surface-subtle hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-surface-foreground hover:text-brand-primary transition-colors mb-2"><SLUG_TITLE> One</h3>
              <p className="text-surface-muted-foreground text-sm">A related service offering from our portfolio.</p>
            </a>
            <a href="/<SLUG>/<SLUG>-two" className="block bg-surface-background rounded-lg p-6 border border-surface-subtle hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-surface-foreground hover:text-brand-primary transition-colors mb-2"><SLUG_TITLE> Two</h3>
              <p className="text-surface-muted-foreground text-sm">Another service offering from our portfolio.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-primary text-on-brand-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get a Quote for {title}</h2>
          <p className="text-lg opacity-90 mb-8">Contact us to discuss your project.</p>
          <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">Contact Us</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

---

**Inline Nav fallback** (when no theme nav component exists):

```tsx
{/* Inline navigation — no theme nav component found */}
<header className="w-full bg-surface-background border-b border-surface-subtle sticky top-0 z-50">
  <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between" aria-label="Global">
    <a href="/" className="text-xl font-bold text-surface-foreground">Test Site</a>
    <div className="flex items-center gap-6 text-sm">
      <a href="/about" className="text-surface-muted-foreground hover:text-surface-foreground transition-colors">About</a>
      <a href="/<SLUG>" className="text-surface-muted-foreground hover:text-surface-foreground transition-colors capitalize"><SLUG></a>
      <a href="/contact" className="bg-brand-primary text-on-brand-primary px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Contact</a>
    </div>
  </nav>
</header>
```

**Inline Footer fallback** (when no theme footer component exists):

```tsx
{/* Inline footer — no theme footer component found */}
<footer className="bg-surface-inverse py-12 mt-auto">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-3 gap-8 mb-8">
      <div>
        <h3 className="text-lg font-semibold text-surface-background mb-3">Test Site</h3>
        <p className="text-surface-muted-foreground text-sm">Pipeline test site.</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-surface-background mb-3">Pages</h3>
        <ul className="space-y-2 text-sm text-surface-muted-foreground">
          <li><a href="/" className="hover:text-brand-primary transition-colors">Home</a></li>
          <li><a href="/about" className="hover:text-brand-primary transition-colors">About</a></li>
          <li><a href="/<SLUG>" className="hover:text-brand-primary transition-colors capitalize"><SLUG></a></li>
          <li><a href="/contact" className="hover:text-brand-primary transition-colors">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-surface-background mb-3">Contact</h3>
        <p className="text-surface-muted-foreground text-sm">Pipeline test site — placeholder content only.</p>
      </div>
    </div>
    <div className="border-t border-surface-subtle pt-6 text-center">
      <p className="text-surface-muted-foreground text-xs">&copy; {new Date().getFullYear()} Test Site. Generated by pipeline.</p>
    </div>
  </div>
</footer>
```

---

**5f-9: Validation gates**

Run all gates. STOP gates halt. WARN gates report and continue.

**Gate 1 — Route count (STOP):**
```bash
ROUTES=$(find sites/test-<theme-name>/app -name "page.tsx" | wc -l | tr -d ' ')
[ "$ROUTES" -ne 5 ] && { echo "FAIL: Expected 5 page.tsx files, found $ROUTES"; exit 1; }
echo "PASS: Route count = 5"
```

**Gate 2 — All required routes present (STOP):**
```bash
for route in \
  "sites/test-<theme-name>/app/page.tsx" \
  "sites/test-<theme-name>/app/about/page.tsx" \
  "sites/test-<theme-name>/app/contact/page.tsx" \
  "sites/test-<theme-name>/app/<detected-slug>/page.tsx" \
  "sites/test-<theme-name>/app/<detected-slug>/[slug]/page.tsx"; do
  test -f "$route" || { echo "FAIL: Missing $route"; exit 1; }
done
echo "PASS: All required routes present"
```

**Gate 3 — No hardcoded hex colors (WARN):**
```bash
grep -rn '#[0-9a-fA-F]\{3,8\}' \
  sites/test-<theme-name>/app/page.tsx \
  sites/test-<theme-name>/app/about/page.tsx \
  sites/test-<theme-name>/app/contact/page.tsx \
  sites/test-<theme-name>/app/<detected-slug>/page.tsx \
  "sites/test-<theme-name>/app/<detected-slug>/[slug]/page.tsx" 2>/dev/null \
  && echo "WARN: Hardcoded hex colors found — replace with Tailwind theme tokens" \
  || echo "PASS: No hardcoded hex colors"
```

**Gate 4 — No forbidden APIs (WARN):**
```bash
grep -rn 'generateStaticParams\|getContentItems\|getServices\|getLocations\|fs\.readdir\|TODO\|PLACEHOLDER' \
  sites/test-<theme-name>/app/page.tsx \
  sites/test-<theme-name>/app/about/page.tsx \
  sites/test-<theme-name>/app/contact/page.tsx \
  sites/test-<theme-name>/app/<detected-slug>/page.tsx \
  "sites/test-<theme-name>/app/<detected-slug>/[slug]/page.tsx" 2>/dev/null \
  && echo "WARN: Forbidden API usage detected" \
  || echo "PASS: No forbidden APIs"
```

**Gate 5 — Nav + footer present (WARN):**
```bash
for page in \
  sites/test-<theme-name>/app/page.tsx \
  sites/test-<theme-name>/app/about/page.tsx \
  sites/test-<theme-name>/app/contact/page.tsx \
  sites/test-<theme-name>/app/<detected-slug>/page.tsx \
  "sites/test-<theme-name>/app/<detected-slug>/[slug]/page.tsx"; do
  HAS_NAV=$(grep -cE '<nav|<header|Navigation|TopNav|NavBar|SiteHeader' "$page" 2>/dev/null || echo 0)
  HAS_FOOTER=$(grep -cE '<footer|Footer|SiteFooter' "$page" 2>/dev/null || echo 0)
  [ "$HAS_NAV" -eq 0 ] && echo "WARN: $page has no navigation"
  [ "$HAS_FOOTER" -eq 0 ] && echo "WARN: $page has no footer"
done
echo "Nav/footer check complete"
```

**Gate 6 — Section count (WARN):**
```bash
for page in \
  sites/test-<theme-name>/app/page.tsx \
  sites/test-<theme-name>/app/about/page.tsx \
  sites/test-<theme-name>/app/contact/page.tsx \
  sites/test-<theme-name>/app/<detected-slug>/page.tsx; do
  COUNT=$(grep -c '<section' "$page" 2>/dev/null || echo 0)
  [ "$COUNT" -lt 3 ] && echo "WARN: $page has only $COUNT <section> elements (expected ≥3)"
done
DETAIL=$(grep -c '<section' "sites/test-<theme-name>/app/<detected-slug>/[slug]/page.tsx" 2>/dev/null || echo 0)
[ "$DETAIL" -lt 2 ] && echo "WARN: Detail page has $DETAIL <section> elements (expected ≥2)"
echo "Section count check complete"
```

**5f-10: Generation summary**

Print:
```
=== Step 5f: Standard Pages Generated ===
Source URL: <reference.url>
Category slug: <detected-slug> (source: <detection-reason>)
Nav component: <ThemeNavName | inline fallback>
Footer component: <ThemeFooterName | inline fallback>
Theme components used: <N> sections
Inline JSX sections: <N> sections

Routes created:
  /                          app/page.tsx           (blueprint: found|fallback)
  /about                     app/about/page.tsx      (blueprint: found|fallback)
  /contact                   app/contact/page.tsx    (blueprint: found|fallback)
  /<slug>/                   app/<slug>/page.tsx     (blueprint: found|fallback)
  /<slug>/[slug]/            app/<slug>/[slug]/page.tsx (blueprint: found|fallback)

Validation:
  Route count:    PASS (5/5)
  Hex colors:     PASS | WARN (N occurrences)
  Forbidden APIs: PASS | WARN (N occurrences)
  Nav/Footer:     PASS | WARN (details)
  Section counts: PASS | WARN (details)
=========================================
```

**5g.** Patch `sites/test-<theme-name>/next.config.ts` — Add Google Fonts to CSP.

The base-template CSP blocks Google Fonts. Find the `Content-Security-Policy` value in `next.config.ts` and change:

```
style-src 'self' 'unsafe-inline'; font-src 'self';
```

To:

```
style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com;
```

**Verification gate — STOP if fails:**
```bash
grep "fonts.googleapis.com" sites/test-<theme-name>/next.config.ts && echo "PASS: CSP patched" || { echo "FAIL: CSP not patched — fonts will be blocked"; exit 1; }
```

## Step 5h: Fidelity Review + Fix

Write the review criteria to `output/ingestion/<theme-name>/meta/validate-review-prompt.txt`:

```
Review the 5 test site pages for brand fidelity against the reference site.

**Reference material:**
- **Dev server screenshots** (actual rendered output): `output/ingestion/<theme-name>/meta/dev-screenshots/` — `home.png`, `about.png`, `contact.png`, `category-list.png`, `category-detail.png`. Run `ls` to confirm which exist. **Read these PNG files directly** to see what the test site actually looks like.
- **Reference site screenshots**: `output/ingestion/<theme-name>/screenshots/` — `home.png`, `about.png`, `blog-list.png`, etc. Read these to see what the reference looks like.
- **HTML source**: `output/ingestion/<theme-name>/html/` (structural reference)
- **Section blueprints**: `output/ingestion/<theme-name>/site-analysis.json` → `pageBlueprints[]`, `sectionBlueprints[]`
- **Extracted tokens**: `site-analysis.json` → `themeTokenRecommendations`
- **Downloaded images**: `output/ingestion/<theme-name>/meta/image-manifest.json` — list of images available in the test site's `public/images/` directory

**Primary comparison method**: Read both the dev screenshot and the reference screenshot for each page. Compare them visually — look at layout, colours, typography scale, spacing, and image presence. Use WebFetch on the dev server URL for structural/code checks only.

**Pages to compare:**
- `meta/dev-screenshots/home.png` ↔ `screenshots/home.png`
- `meta/dev-screenshots/about.png` ↔ `screenshots/about.png` (if both exist)
- `meta/dev-screenshots/contact.png` ↔ (no reference — check structure only)
- `meta/dev-screenshots/category-list.png` ↔ `screenshots/blog-list.png` or `screenshots/services-list.png`
- `meta/dev-screenshots/category-detail.png` ↔ `screenshots/blog-post.png` or `screenshots/service-detail.png`

Also read each corresponding TSX file so you can identify where to apply fixes.

**What to check (ingest-specific — brand fidelity, not exact replication):**
1. **Font loading** — Is body text rendering in the extracted font (not browser default sans-serif)?
2. **Brand colours** — Do primary/secondary/accent colours match `themeTokenRecommendations.brand`?
3. **Section completeness** — Is every section in `pageBlueprints[page].sections[]` present in the rendered page?
4. **Nav and footer** — Present on every page? Are they rendering real content or placeholder stubs?
5. **Layout pattern** — Does header style (dark/light) match `visualLanguage.heroPattern.headerDark`? Does hero pattern match `visualLanguage.heroPattern.type`?
6. **CSS completeness** — Are hover effects, transitions, and interactive states present?
7. **Image rendering** — Are images present in the rendered output, or are they still colour-block placeholders? Check `image-manifest.json` for available downloaded images. If images exist in the manifest but components show placeholders, flag as `visual`.
8. **Logo rendering** — Is the nav component rendering the logo as an `<img>` element, or as text? If `logo` is passed as a prop but appears as a string (e.g. `/images/logo.svg` shown as text), the component is outputting the prop value as text instead of an image source. Flag as `visual`.
9. **Hamburger menu** — Is the mobile menu icon visible on desktop (not hidden with `md:hidden`)? Does it have an `onClick` handler and produce a dropdown with links? A hamburger that does nothing when clicked is a `blocker`. A hamburger hidden on desktop is a `visual`.
10. **CTA colour variety** — If the page has multiple distinct CTA sections (e.g. speakers, sponsors, volunteers), do they each use a different background colour? If all CTAs share the same `bg-brand-primary` background when the reference shows yellow/blue/green variety, flag each one as `visual` with the target colour from the reference screenshot.
11. **Invisible text** — Look for `text-surface-background` classes used as text colour. On dark `bg-surface-inverse` sections, `text-surface-background` renders the text the same colour as the background (invisible). This is always a `blocker` — flag with the correct replacement (`text-surface-foreground` or `text-white`).

**What NOT to check:**
- Whether content pixel-matches the reference site — it will not
- Whether specific copy is identical
- Form field interactivity (static visual comparison only — `readOnly` is intentional)
- High pixel-diff scores — these are expected and informational only

**Fix guidance for common finding types:**
- **Image placeholder findings** (colour blocks where images should appear): read the component's props interface, then pass the appropriate downloaded image(s) from `image-manifest.json` as props. Use the `publicPath` field (e.g. `/images/hero.jpg`).
- **Logo-as-text findings**: open the theme nav component file. Find where `props.logo` is used. If it outputs `{props.logo}` as text, replace with `<img src={props.logo} alt="Site logo" className="h-8 w-auto" />`.
- **Hamburger findings**: the theme nav component needs `"use client"` at top, `useState` for `open` state, `onClick={() => setOpen(!open)}` on the button, and a conditional `{open && <div>...</div>}` block. The hamburger button should NOT have `md:hidden`.
- **CTA colour findings**: assign distinct backgrounds — `bg-brand-secondary` for registration/speakers, `bg-[#hex]` for sponsors, `bg-brand-accent` for volunteers. Never use `text-on-brand-primary` on non-brand-primary backgrounds.
- **Invisible text findings**: change `text-surface-background` → `text-surface-foreground` on dark sections.
```

Then run the shared validation skill:

```
/pipeline.validate-site \
  --site-dir sites/test-<theme-name> \
  --pages "/ /about /contact /<detected-slug>/ /<detected-slug>/test-item" \
  --review-prompt-file output/ingestion/<theme-name>/meta/validate-review-prompt.txt \
  --findings-file output/ingestion/<theme-name>/meta/tsx-review-findings.json \
  --fix-log-file output/ingestion/<theme-name>/meta/tsx-fix-log.json \
  --screenshot-dir output/ingestion/<theme-name>/meta/dev-screenshots
```

After the pixel-diff baseline (run inside the validate-site skill's screenshot step), also run:
```bash
npx tsx -e "
import fs from 'fs';
import path from 'path';
import { compareImages } from './tools/lib/pipeline-visual-compare.ts';
const devDir = 'output/ingestion/<theme-name>/meta/dev-screenshots';
const refDir = 'output/ingestion/<theme-name>/screenshots';
const pairs = [
  ['home.png','home.png'], ['about.png','about.png'],
  ['category-list.png','blog-list.png'], ['category-list.png','services-list.png'],
];
for (const [devFile, refFile] of pairs) {
  const devPath = path.join(devDir, devFile);
  const refPath = path.join(refDir, refFile);
  if (!fs.existsSync(devPath) || !fs.existsSync(refPath)) continue;
  const buf = fs.readFileSync(devPath);
  const result = await compareImages(refPath, buf);
  console.log(devFile + ': ' + (result.diffPercent * 100).toFixed(1) + '% pixel diff vs reference (informational)');
}
" 2>/dev/null || echo "WARN: Visual diff skipped (pipeline-visual-compare unavailable)"
```

Print diff percentages as informational only — high values (30–70%) are expected since content differs.

## Step 6: Reconcile Lockfile

1. Run `pnpm install --lockfile-only` at the monorepo root. This updates `pnpm-lock.yaml` to include the new test site workspace without modifying `node_modules`.
2. If `--lockfile-only` fails, fall back to `pnpm install`.
3. Verify: `pnpm install --frozen-lockfile` must succeed.

Then run type-check:
```bash
cd sites/test-<theme-name> && npx tsc --noEmit
```

If type-check fails, report the errors but continue — the user needs to see what went wrong with the generated theme.

## Step 7: Stage Lockfile With Test Site

Stage `pnpm-lock.yaml` alongside the test site directory. The lockfile MUST be in the same commit as the test site to prevent `ERR_PNPM_OUTDATED_LOCKFILE` on any branch.

```bash
git add sites/test-<theme-name>/ pnpm-lock.yaml
```

## Step 8: Report

Output:

```
✓ Theme name:     <theme-name>
✓ Source URL:     <url>
✓ Test site:      sites/test-<theme-name>/

Reference assets: output/ingestion/<theme-name>/
  screenshots/    — <N> reference site page captures (taken during Step 2)
  html/           — <N> reference HTML pages (<or "not captured" if curl was blocked>)
  meta/           — html-manifest.json, tsx-review-findings.json, tsx-fix-log.json

Fidelity review:  <N> findings — <N_blockers> blockers, <N_visual> visual, <N_minor> minor
Fix pass:         <N_fixed> fixed, <N_skipped> skipped
<If any blockers were not resolved: "⚠ Unresolved blockers: <list>">

Dev server:   cd sites/test-<theme-name> && npm run dev

Reference comparison:
  http://localhost:3000               ↔  screenshots/home.png
  http://localhost:3000/about         ↔  screenshots/about.png
  http://localhost:3000/contact       ↔  screenshots/contact.png
  http://localhost:3000/<slug>/       ↔  screenshots/services-list.png (or blog-list.png)
  http://localhost:3000/<slug>/<item> ↔  screenshots/service-detail.png (or blog-post.png)

Cleanup:      /pipeline.kill-site test-<theme-name>   (removes test site)
              /pipeline.kill-theme <theme-name>        (removes theme package)

Next steps:
  1. Start dev server, compare each page against the reference screenshots above
  2. Review meta/tsx-review-findings.json — what the fidelity pass found
  3. Review meta/tsx-fix-log.json — what was auto-fixed vs skipped
  4. Iterate on theme.config.ts if brand colours need tuning
  5. When satisfied: /deploy.changes
```

---

## Rules

- This command does NOT commit or push anything
- Never modify `sites/base-template/` — only the copy
- If the pipeline fails, STOP and report — do not attempt to create a partial test site
