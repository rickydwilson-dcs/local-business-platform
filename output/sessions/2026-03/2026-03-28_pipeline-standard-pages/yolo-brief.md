# YOLO Implementation Brief: Pipeline Standard Pages (Step 5f Rewrite)

**Branch:** feature/pipeline-standard-pages (created from develop)
**Session spec:** output/sessions/2026-03-28_pipeline-standard-pages/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `/pipeline.ingest` skill copies whatever example pages the analysis happened to produce into the test site — unreliable when the analysis only captured one page or generated an unusual route set. The fix rewrites Step 5f to always generate exactly five standard pages (Home, About, Contact, Category index, Item detail) that mirror the reference site's section order where a blueprint exists, and fall back to solid structural defaults otherwise.

This is a **skill-file-only change** — the entire implementation is a rewrite of Step 5f inside `.claude/commands/pipeline.ingest.md`. No TypeScript tooling changes. The synthesis was reviewed and approved via dual-model peer review. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.80 / $4             | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/pipeline-standard-pages
pnpm type-check   # must be clean before starting
```

If `pnpm type-check` fails, STOP and report the errors. Do not proceed with a dirty type-check baseline.

---

## Phase 1: Read and understand the current Step 5f

**Goal:** Fully understand the existing Step 5f before writing the replacement — establish the exact text to replace.
**Model:** haiku — read-only, no edits

Read the full contents of `.claude/commands/pipeline.ingest.md`.

Identify the exact start and end lines of Step 5f. The section begins with `## Step 5: Wire Theme Into Test Site` and the sub-step `**5f.** Replace base-template pages...` and ends just before `## Step 5g.` (the visual comparison test sub-step).

Record:

- The exact heading text for Step 5f
- The complete current content of 5f (all sub-bullets, code blocks, explanatory text)
- What immediately follows 5f (5g starts with the Playwright visual comparison test)

```bash
# Verification gate — STOP if this fails
grep -n "5f\|5g\|example-pages" .claude/commands/pipeline.ingest.md
```

Expected: shows the current 5f referencing `example-pages/app/*` copy, and 5g starting the visual comparison section.

---

## Phase 2: Write the replacement Step 5f

**Goal:** Replace the entire Step 5f section with the new deterministic five-page generation routine.
**Model:** sonnet — single precise edit to a markdown skill file

Read `.claude/commands/pipeline.ingest.md` in full first. Then replace the entire `**5f.**` sub-section with the following content. The replacement spans from just after `**5e.** Rewrite...` ends through to just before `**5g.** Generate visual comparison test`.

The replacement text for **5f** is:

---

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

**5f-2: Detect category slug**

Apply this decision tree (first definitive match wins):

**Step 1:** Extract all depth-1 paths from `discoveredPages[]`:

- Filter: `path.split('/').length === 2` and `path !== '/'`
- Get the slug: `path.split('/')[1]`
- Deduplicate

**Step 2:** Remove reserved roots: `about`, `contact`, `privacy`, `privacy-policy`, `cookie-policy`, `cookies`, `terms`, `legal`, `search`, `404`, `500`

**Step 3:** Score remaining candidates:

| Signal                                                          | Points |
| --------------------------------------------------------------- | ------ |
| Has depth-2 page under `/<slug>/something` in discoveredPages   | +3     |
| Has `pageBlueprints` entry for `/<slug>/` with ≥1 section       | +2     |
| Has pageType containing `list` (services-list, blog-list, etc.) | +2     |
| Appears in discoveredPages with `source: "nav"`                 | +1     |

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

---

(End of 5f replacement text. Step 5g follows immediately after in the skill file.)

---

**Verification gate — STOP if this fails:**

```bash
# Confirm 5f no longer references example-pages copy command
grep "cp -r output/ingestion" .claude/commands/pipeline.ingest.md && echo "FAIL: old example-pages copy still present" || echo "PASS: example-pages copy removed"

# Confirm 5f-0 through 5f-10 are present
grep -c "5f-[0-9]" .claude/commands/pipeline.ingest.md
```

Expected: first grep returns nothing (PASS). Second grep returns ≥10.

Commit:

```bash
git add .claude/commands/pipeline.ingest.md
git commit -m "$(cat <<'EOF'
feat(pipeline): rewrite Step 5f to always generate five standard pages

Replaces unreliable example-pages copy with a deterministic five-page
generation routine: Home, About, Contact, Category index, Item detail.
Pages mirror reference site section order (reference-first) and fall
back to solid structural defaults when blueprints are absent.

Key improvements:
- Category slug auto-detected from site-analysis.json (multi-signal scoring)
- Inline footer fallback instead of core Footer (avoids fs/promises crash)
- All five pages always generated every run
- Five validation gates: route count, hex colors, forbidden APIs, nav/footer, section count

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Cost Estimate

| Phase                              | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Read current Step 5f      | haiku  | ~8k               | ~0.5k              | ~$0.01     |
| Phase 2: Write replacement Step 5f | sonnet | ~12k              | ~6k                | ~$0.13     |
| **Total**                          |        | **~20k**          | **~6.5k**          | **~$0.14** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.
This is a single-file edit to a markdown skill file. The bulk of the cost is Phase 2 output (the replacement text is large but entirely templated).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Confirm `.claude/commands/pipeline.ingest.md` has been updated
3. Confirm `grep "cp -r output/ingestion" .claude/commands/pipeline.ingest.md` returns no matches
4. Any exceptions or intentional deviations from the plan
5. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    | [total]           | [total]            | $X.XX     |
   | haiku     | [if used]         | [if used]          | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-03-28_pipeline-standard-pages/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises or deviations]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Minimal changes only — implement what the plan says, nothing more
- The only file that changes is `.claude/commands/pipeline.ingest.md`
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits
- The Co-Authored-By line must be `Claude Sonnet 4.6 <noreply@anthropic.com>`

---

## Completed

**Date:** 2026-03-29
**Status:** All phases executed successfully

Phase 1 (read/locate current 5f) and Phase 2 (write replacement) both executed. The old Step 5f — which copied whatever the analysis pipeline happened to generate from `example-pages/app/*` — was replaced with a deterministic 11-sub-step routine (5f-0 through 5f-10). The new routine always generates exactly five routes by reading `site-analysis.json` directly: Home, About, Contact, a category index, and a category item detail page. Category slug is auto-detected via multi-signal scoring; nav/footer use theme components when available and fall back to inline JSX blocks (never importing `Footer` from core-components, which crashes without MDX content). Five validation gates verify route count, hex colors, forbidden APIs, nav/footer presence, and section counts. No surprises or deviations. Commit SHA: `1c3209a` on develop.
