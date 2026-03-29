# Implementation Plan: Pipeline Standard Pages (Step 5f Rewrite)

**Date:** 2026-03-28
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| **Category detection** | Simple priority list checking fixed paths (/services → /products → /projects → /events) | Multi-signal scoring: depth-1 extraction, pageType classification, blueprint cross-ref, detail route presence, nav order | **Codex.** Priority-list breaks on arbitrary slugs (/treatments, /classes, /portfolio). Signal-based scoring handles any category type. |
| **Footer fallback** | Import from `@platform/core-components/src/components/ui/footer` subpath | Inline token-styled footer block | **Codex.** The core Footer calls `getContentItems()` and `fs/promises` — will crash in test sites with no MDX content. Inline footer is the only safe option. |
| **Old example-pages** | Ignored entirely | May be read as optional phrasing hints | **Claude.** They're an unstable upstream artifact from a different route set. Reading them for hints risks pulling in wrong routes or structure. Five standard pages are self-contained. |
| **Validation gates** | File existence (STOP), hex grep (WARN), tsc (WARN) | File existence + count (STOP), section count, hex grep, forbidden API grep, nav/footer presence, home section order | **Codex.** All gates adopted. Section count and home section order as WARN not STOP. |
| **Route count gate** | No explicit count | Hard count = exactly 5 page.tsx files | **Codex.** Prevents stale base-template routes surviving. |
| **Component inventory** | Single flat list | Two explicit sets: themeComponentExports + coreComponentExports | **Codex.** Separation makes import resolution unambiguous. |
| **ContactForm concern** | Identified — wrap or use inline form if type-check fails | Not mentioned | **Claude caught this.** ContactForm itself is safe (barrel export, client component), but generated pages must not import `getContentItems` or `fs/promises`. `@/lib/contact-info` IS safe — test site has a copied `site.config.ts` with placeholder business data. |

---

## Blind Spots Caught

**Codex caught:**
- `Footer` from core-components uses `getContentItems()` + `fs/promises` — will crash in test sites with no MDX content. Inline footer is the correct fallback — this is a real crash bug that Claude's plan would have introduced.
- Hard route count gate (exactly 5) prevents stale base-template page routes surviving the cleanup step.
- Forbidden API grep (`generateStaticParams`, `getContentItems`, `fs.readdir`) as an explicit validation gate.
- Section count structural check ensures pages are not trivially empty.
- Detail route confirmation step in category detection (depth-2 pages as evidence of a usable listing).

**Claude caught:**
- `@/lib/contact-info` IS safe to import in test sites — the module calls `createContactInfo(siteConfig.business)` which works with base-template's placeholder `site.config.ts`. Codex's concern about the contact info module was overcautious.
- `registryRecommendation.themeName` as useful metadata for understanding which hero variant to use in fallback home page generation.
- Inline section quality risk — the skill must provide specific token class templates, not open-ended "style it appropriately" instructions.

---

## Implementation Plan

### Phase 0: Data Inventory (read-only)

**0.1 Load site-analysis.json**

```bash
cat output/ingestion/<theme-name>/site-analysis.json
```

Parse the full JSON. This is the **sole data source** for all five pages. Key fields to extract and hold in working memory:
- `discoveredPages[]` — pages found on the reference site (path, pageType, source, depth)
- `pageBlueprints[]` — per-page section breakdowns (sections[] with blueprintId + order)
- `sectionBlueprints[]` — section definitions (id, componentFileName, componentExportName, category, purpose, layoutPattern, contentSlots)
- `componentMatches[]` — which blueprints matched core-components (matchConfidence: exact/close/partial)
- `registryRecommendation.themeName` — nearest theme constellation (orion|vega)
- `reference.url` — source URL (add as comment in generated pages)

**0.2 Build theme component inventory**

```bash
ls packages/themes/<theme-name>/components/ 2>/dev/null || echo "no-components"
```

Build two sets:

**`themeNavComponents`**: component export names from the theme where the corresponding `sectionBlueprints[].category` is `"Navigation"`, OR the filename contains `nav`, `navigation`, `header`, `topbar`, `top-nav`.

**`themeFooterComponents`**: component export names where category is `"Footer"`, OR filename contains `footer`.

For all other components: build `blueprintId → componentExportName` from `sectionBlueprints[].componentFileName` cross-referenced with the files that exist in `packages/themes/<theme-name>/components/`.

**0.3 Establish component resolution hierarchy**

For each section when composing a page:
1. **Theme component** — if `packages/themes/<theme-name>/components/<componentFileName>` exists → import from `@platform/themes/<theme-name>/components`
2. **Core component match** — if `componentMatches` has "exact" or "close" confidence for this blueprintId → import from `@platform/core-components` (barrel) — ONLY if the component does not require async data (no `getContentItems`, no `fs/promises`)
3. **Inline JSX** — write the section directly in the page file using Tailwind theme tokens

Safe core-components for fallback (barrel import, no async data required):
- `HeroV1`, `HeroV2`, `HeroV3`, `HeroSection`, `HeroWithImage`, `PageHero`
- `CTASection`, `ServiceCards`, `FAQSection`, `Breadcrumbs`
- `ContactForm` (client component — safe)

Do NOT use from core-components:
- `Footer` (uses `getContentItems` + `fs/promises`)
- `PageShell` (test site layout already omits it)
- Any component calling `getContentItems()`, `getLocations()`, `getServices()`

**0.4 Detect category slug**

**Step 1:** Extract all depth-1 paths from `discoveredPages[]`:
```
paths = discoveredPages.filter(p => p.path.split('/').length === 2 && p.path !== '/').map(p => p.path.split('/')[1])
```

**Step 2:** Remove reserved roots:
`about`, `contact`, `privacy`, `privacy-policy`, `cookie-policy`, `cookies`, `terms`, `legal`, `search`, `404`, `500`

**Step 3:** Score remaining candidates:

| Signal | Points |
|--------|--------|
| Has a depth-2 page under `/<slug>/something` in discoveredPages | +3 |
| Has a `pageBlueprints` entry for `/<slug>/` with ≥1 section | +2 |
| Has pageType containing `list` (services-list, blog-list, etc.) | +2 |
| Appears in discoveredPages with `source: "nav"` | +1 |

**Step 4:** Pick the highest-scoring candidate. On tie, prefer the one with the lowest index in `discoveredPages` (nav ordering).

**Step 5:** If no candidates remain: use `"services"` as fallback.

**Step 6:** Emit: `Detected category slug: <slug> (source: <detection-reason>)`

**0.5 Resolve nav and footer components**

**Nav resolution:**
1. If `themeNavComponents` has one or more entries → use the first one (or the one whose blueprint appears first in home page sections)
2. If empty → use inline nav block (template below)

**Footer resolution:**
1. If `themeFooterComponents` has one or more entries → use the first one (or the one whose blueprint appears last in home page sections)
2. If empty → use inline footer block (template below)
3. **Never import `Footer` from core-components subpath** — it crashes without MDX content

---

### Phase 1: Clean Test Site Pages

```bash
find sites/test-<theme-name>/app -name "page.tsx" -delete
find sites/test-<theme-name>/app -type d -empty -delete
```

```bash
mkdir -p sites/test-<theme-name>/app/about
mkdir -p sites/test-<theme-name>/app/contact
mkdir -p "sites/test-<theme-name>/app/<detected-slug>/[slug]"
```

---

### Phase 2: Generate Five Pages (one at a time)

For each page, follow this pattern:
1. Find matching blueprint in `pageBlueprints` (match by `path` or `pageType`)
2. If found: render sections in `sections[]` order, resolving each via the hierarchy in 0.3
3. If NOT found: use the fallback template below
4. Write the file

**Structural rules for ALL pages:**
- `export default function Page()` — NOT async, no server data loading
- All text content is hardcoded strings (static)
- All Tailwind classes use theme tokens: `bg-brand-primary`, `text-on-brand-primary`, `bg-surface-background`, `text-surface-foreground`, `bg-surface-muted`, `text-surface-muted-foreground`, `border-surface-subtle`, `bg-surface-inverse`, `text-brand-primary`, `bg-brand-primary-hover`
- NO hardcoded hex colors
- NO `generateStaticParams`, `getContentItems`, `fs.readdir`, `fs/promises`
- Add a comment at top of sections: `{/* Source: <reference.url> — <pageType> blueprint */}` or `{/* Source: fallback template — no blueprint found */}`

---

**2.1 Generate `app/page.tsx` (Home)**

Blueprint lookup: `pageBlueprints` where `path === "/"` or `pageType === "home"`

**Fallback template (no home blueprint):**

```tsx
<Nav />

{/* Source: fallback template — no blueprint found */}
{/* Hero */}
<section className="bg-brand-primary text-on-brand-primary py-20 md:py-32">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 className="text-4xl md:text-6xl font-bold mb-6">
      Welcome to Our Business
    </h1>
    <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
      Professional services tailored to your needs
    </p>
    <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
      Get in Touch
    </a>
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
      <div>
        <p className="text-4xl font-bold text-brand-primary">10+</p>
        <p className="text-surface-muted-foreground mt-1">Years Experience</p>
      </div>
      <div>
        <p className="text-4xl font-bold text-brand-primary">500+</p>
        <p className="text-surface-muted-foreground mt-1">Happy Clients</p>
      </div>
      <div>
        <p className="text-4xl font-bold text-brand-primary">100%</p>
        <p className="text-surface-muted-foreground mt-1">Satisfaction Rate</p>
      </div>
      <div>
        <p className="text-4xl font-bold text-brand-primary">24/7</p>
        <p className="text-surface-muted-foreground mt-1">Support Available</p>
      </div>
    </div>
  </div>
</section>

{/* CTA */}
<section className="py-16 bg-brand-primary text-on-brand-primary">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
    <p className="text-lg opacity-90 mb-8">Get in touch for a free quote today.</p>
    <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
      Contact Us
    </a>
  </div>
</section>

<Footer />
```

---

**2.2 Generate `app/about/page.tsx`**

Blueprint lookup: `path === "/about"` or `pageType === "about"`

**Fallback template:**

```tsx
<Nav />

{/* Page Header */}
<section className="bg-surface-muted py-12 md:py-16 border-b border-surface-subtle">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold text-surface-foreground">About Us</h1>
    <p className="mt-4 text-lg text-surface-muted-foreground max-w-3xl">
      Learn more about our team and what drives us.
    </p>
  </div>
</section>

{/* Our Story */}
<section className="py-16 md:py-24 bg-surface-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl">
      <h2 className="text-3xl font-bold text-surface-foreground mb-6">Our Story</h2>
      <p className="text-surface-muted-foreground mb-4 text-lg leading-relaxed">
        We are a dedicated team of professionals committed to delivering exceptional service.
        With years of experience in the industry, we understand what it takes to exceed expectations.
      </p>
      <p className="text-surface-muted-foreground text-lg leading-relaxed">
        Our mission is to provide reliable, high-quality solutions that make a real difference
        for our clients and their communities.
      </p>
    </div>
  </div>
</section>

{/* Values */}
<section className="py-16 md:py-24 bg-surface-muted">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-surface-foreground text-center mb-12">Our Values</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-surface-background rounded-lg p-6 border border-surface-subtle text-center">
        <div className="w-12 h-12 bg-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-on-brand-primary text-xl font-bold">1</span>
        </div>
        <h3 className="text-xl font-semibold text-surface-foreground mb-2">Quality</h3>
        <p className="text-surface-muted-foreground">Uncompromising standards in everything we do.</p>
      </div>
      <div className="bg-surface-background rounded-lg p-6 border border-surface-subtle text-center">
        <div className="w-12 h-12 bg-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-on-brand-primary text-xl font-bold">2</span>
        </div>
        <h3 className="text-xl font-semibold text-surface-foreground mb-2">Reliability</h3>
        <p className="text-surface-muted-foreground">Consistent delivery you can count on every time.</p>
      </div>
      <div className="bg-surface-background rounded-lg p-6 border border-surface-subtle text-center">
        <div className="w-12 h-12 bg-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-on-brand-primary text-xl font-bold">3</span>
        </div>
        <h3 className="text-xl font-semibold text-surface-foreground mb-2">Trust</h3>
        <p className="text-surface-muted-foreground">Building lasting relationships with our clients.</p>
      </div>
    </div>
  </div>
</section>

{/* CTA */}
<section className="py-16 bg-brand-primary text-on-brand-primary">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-bold mb-4">Work With Us</h2>
    <p className="text-lg opacity-90 mb-8">Ready to find out what we can do for you?</p>
    <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
      Get in Touch
    </a>
  </div>
</section>

<Footer />
```

---

**2.3 Generate `app/contact/page.tsx`**

Blueprint lookup: `path === "/contact"` or `pageType === "contact"`

Import `ContactForm` from `@platform/core-components` (always — it is safe).
Import `PHONE_DISPLAY`, `PHONE_TEL`, `BUSINESS_EMAIL`, `ADDRESS` from `@/lib/contact-info` if the test site has that shim (it copies from base-template, which it does). Otherwise omit and use placeholder strings.

**Fallback template:**

```tsx
import { ContactForm } from '@platform/core-components';

// ...

<Nav />

{/* Page Header */}
<section className="bg-surface-muted py-12 md:py-16 border-b border-surface-subtle">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold text-surface-foreground">Contact Us</h1>
    <p className="mt-4 text-lg text-surface-muted-foreground max-w-3xl">
      Get in touch with our team — we would love to hear from you.
    </p>
  </div>
</section>

{/* Contact form + info */}
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

**2.4 Generate `app/<detected-slug>/page.tsx`**

Blueprint lookup: `path === "/<detected-slug>"` or `path === "/<detected-slug>/"` in pageBlueprints

**Fallback template** (replace `<SLUG>` with the actual detected slug, `<SLUG_TITLE>` with slug capitalised):

```tsx
const items = [
  { title: '<SLUG_TITLE> One', slug: '<slug>-one', description: 'A detailed overview of this offering and what it includes for you.' },
  { title: '<SLUG_TITLE> Two', slug: '<slug>-two', description: 'Information about this service and the benefits it provides.' },
  { title: '<SLUG_TITLE> Three', slug: '<slug>-three', description: 'How this service can help you achieve your goals.' },
];

// ...

<Nav />

{/* Page Header */}
<section className="bg-surface-muted py-12 md:py-16 border-b border-surface-subtle">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold text-surface-foreground">Our <SLUG_TITLE></h1>
    <p className="mt-4 text-lg text-surface-muted-foreground max-w-3xl">
      Browse our full range of <SLUG> below.
    </p>
  </div>
</section>

{/* Items Grid */}
<section className="py-16 md:py-24 bg-surface-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <a
          key={item.slug}
          href={`/<SLUG>/${item.slug}`}
          className="group block bg-surface-muted rounded-lg border border-surface-subtle overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-video bg-brand-primary opacity-10" />
          <div className="p-6">
            <h2 className="text-xl font-semibold text-surface-foreground group-hover:text-brand-primary transition-colors mb-2">
              {item.title}
            </h2>
            <p className="text-surface-muted-foreground">{item.description}</p>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

{/* CTA */}
<section className="py-16 bg-brand-primary text-on-brand-primary">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-bold mb-4">Interested in Our <SLUG_TITLE>?</h2>
    <p className="text-lg opacity-90 mb-8">Contact us today to discuss your requirements.</p>
    <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
      Get a Quote
    </a>
  </div>
</section>

<Footer />
```

---

**2.5 Generate `app/<detected-slug>/[slug]/page.tsx`**

Blueprint lookup: `routePattern` containing `[slug]` under `/<detected-slug>` in pageBlueprints

**DO NOT add `generateStaticParams`** — this is a dev-mode only test site.

**Fallback template:**

```tsx
export default function Page({ params }: { params: { slug: string } }) {
  const title = params.slug
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
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
          <p className="mt-4 text-xl opacity-90 max-w-2xl">
            Professional <SLUG> services delivered with expertise and care.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-surface-foreground mb-6">Overview</h2>
          <p className="text-surface-muted-foreground text-lg leading-relaxed mb-6">
            Our {title.toLowerCase()} service is delivered by experienced professionals
            committed to quality and reliability. We tailor every project to your
            specific requirements.
          </p>
          <h2 className="text-2xl font-bold text-surface-foreground mt-12 mb-4">What's Included</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-brand-primary mt-1 font-bold">✓</span>
              <span className="text-surface-muted-foreground">Initial consultation and needs assessment</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-primary mt-1 font-bold">✓</span>
              <span className="text-surface-muted-foreground">Detailed planning and preparation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-primary mt-1 font-bold">✓</span>
              <span className="text-surface-muted-foreground">Professional delivery by qualified team</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-primary mt-1 font-bold">✓</span>
              <span className="text-surface-muted-foreground">Follow-up and satisfaction guarantee</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Related */}
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

      {/* CTA */}
      <section className="py-16 bg-brand-primary text-on-brand-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get a Quote for {title}</h2>
          <p className="text-lg opacity-90 mb-8">Contact us to discuss your project.</p>
          <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Contact Us
          </a>
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
        <p className="text-surface-muted-foreground text-sm">Pipeline test site for the <theme-name> theme.</p>
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
      <p className="text-surface-muted-foreground text-xs">
        &copy; {new Date().getFullYear()} Test Site. Generated by pipeline.
      </p>
    </div>
  </div>
</footer>
```

---

### Phase 3: Validation Gates

Run all gates in sequence. STOP gates halt execution and report failure. WARN gates report issues and continue.

**Gate 1: Route existence + count (STOP)**

```bash
ROUTES=$(find sites/test-<theme-name>/app -name "page.tsx" | wc -l | tr -d ' ')
if [ "$ROUTES" -ne 5 ]; then echo "FAIL: Expected 5 page.tsx files, found $ROUTES"; exit 1; fi
echo "PASS: Route count = 5"
```

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

**Gate 2: Hex color grep (WARN)**

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

**Gate 3: Forbidden API grep (WARN)**

```bash
grep -rn 'generateStaticParams\|getContentItems\|getServices\|getLocations\|fs\.readdir\|TODO\|PLACEHOLDER' \
  sites/test-<theme-name>/app/page.tsx \
  sites/test-<theme-name>/app/about/page.tsx \
  sites/test-<theme-name>/app/contact/page.tsx \
  sites/test-<theme-name>/app/<detected-slug>/page.tsx \
  "sites/test-<theme-name>/app/<detected-slug>/[slug]/page.tsx" 2>/dev/null \
  && echo "WARN: Forbidden API usage or placeholder content detected" \
  || echo "PASS: No forbidden APIs"
```

**Gate 4: Nav + footer presence (WARN)**

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

**Gate 5: Section count (WARN)**

```bash
for page in \
  sites/test-<theme-name>/app/page.tsx \
  sites/test-<theme-name>/app/about/page.tsx \
  sites/test-<theme-name>/app/contact/page.tsx \
  sites/test-<theme-name>/app/<detected-slug>/page.tsx; do
  COUNT=$(grep -c '<section' "$page" 2>/dev/null || echo 0)
  [ "$COUNT" -lt 3 ] && echo "WARN: $page has $COUNT <section> elements (expected ≥3)"
done
DETAIL_COUNT=$(grep -c '<section' "sites/test-<theme-name>/app/<detected-slug>/[slug]/page.tsx" 2>/dev/null || echo 0)
[ "$DETAIL_COUNT" -lt 2 ] && echo "WARN: Detail page has $DETAIL_COUNT <section> elements (expected ≥2)"
echo "Section count check complete"
```

---

### Phase 4: Generation Summary

Print at the end of the new Step 5f:

```
=== Step 5f: Standard Pages Generated ===
Source URL: <reference.url>
Category slug: <detected-slug> (source: <detection-reason>)
Nav component: <ThemeNavName OR "inline fallback">
Footer component: <ThemeFooterName OR "inline fallback">
Theme components used: <N> sections
Inline JSX sections: <N> sections

Routes created:
  /                           app/page.tsx          (blueprint: <found|fallback>)
  /about                      app/about/page.tsx     (blueprint: <found|fallback>)
  /contact                    app/contact/page.tsx   (blueprint: <found|fallback>)
  /<detected-slug>/           app/<slug>/page.tsx    (blueprint: <found|fallback>)
  /<detected-slug>/[slug]/    app/<slug>/[slug]/page.tsx (blueprint: <found|fallback>)

Validation:
  Route count:     PASS (5/5)
  Hex colors:      PASS | WARN (<N occurrences at: file:line>)
  Forbidden APIs:  PASS | WARN (<N occurrences>)
  Nav/Footer:      PASS | WARN (<details>)
  Section counts:  PASS | WARN (<details>)
=========================================
```

---

## Files Modified

| File | Change |
|------|--------|
| `.claude/commands/pipeline.ingest.md` | Replace Step 5f entirely with the new Phase 0–4 routine above |

No TypeScript tooling changes. No new files in `tools/`. The `output/ingestion/<theme>/example-pages/` directory continues to be generated by the analysis pipeline but is **no longer read or copied** by the skill.

---

## Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| site-analysis.json has only home blueprint | Medium | All non-home pages use fallback templates — still renders correctly |
| Theme has no nav/footer components | Low | Inline nav/footer templates above handle this |
| ContactForm POST fails (no API route wired) | High | Form renders; submission fails silently — acceptable for visual test site |
| TypeScript errors from theme component import types | Medium | Type-check runs in Step 6, reports but does not block |
| Category detection returns wrong slug for unusual sites | Low | Fallback to `services`; generation summary reports detection source so user can see |

---

## Verification (End-to-End)

1. Run `/pipeline.ingest --url <any-local-business-url>`
2. Wait for analysis pipeline + Step 5f to complete
3. Confirm the generation summary shows 5 routes created
4. `cd sites/test-<theme> && npm run dev`
5. Visit in browser: `/`, `/about`, `/contact`, `/<slug>`, `/<slug>/test-item`
6. Verify:
   - Each page loads without JS console errors
   - Header and footer present on every page
   - Brand colors (not default blue) throughout
   - Contact page shows ContactForm
   - Category page shows 3 item cards
   - Detail page renders (slug in title)
7. Run visual comparison: `npx playwright test e2e/visual-compare.spec.ts`
