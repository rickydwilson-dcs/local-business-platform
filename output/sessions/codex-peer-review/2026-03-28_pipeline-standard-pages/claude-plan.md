# Claude's Plan: Pipeline Standard Pages

**Date:** 2026-03-28
**Author:** Claude (independent — written before seeing Codex plan)

---

## Overview

The change is entirely in `.claude/commands/pipeline.ingest.md`. Step 5f is replaced with a deterministic five-page generation routine. No TypeScript tooling changes are needed — the skill instructs the executing AI model to read `site-analysis.json` and generate page TSX directly.

The old example-pages output (`output/ingestion/<theme>/example-pages/`) is ignored and eventually superseded. The analysis pipeline keeps generating it, but the skill no longer copies it into the test site.

---

## Phase 1: Pre-generation inventory (new sub-steps before page writing)

Before generating any page, Claude needs to know what components are available to import. This happens inside the new Step 5f.

### Step 5f-0: Read site-analysis.json

```bash
cat output/ingestion/<theme-name>/site-analysis.json
```

Extract and record:
- `pageBlueprints[]` — section structure for each discovered page
- `sectionBlueprints[]` — full specs (id, componentFileName, componentExportName)
- `componentMatches[]` — which blueprints matched core-components
- `registryRecommendation.themeName` — orion or vega (drives hero variant choice)
- `discoveredPages[]` — which pages were actually captured

### Step 5f-1: Inventory available theme components

```bash
ls packages/themes/<theme-name>/components/ 2>/dev/null
```

Build a map: `blueprintId → componentExportName` for every `.tsx` file found.

If the directory doesn't exist or is empty, note that all sections will need inline generation.

Also check for `TopNavigation`/`SiteHeader` and `SiteFooter` exports — these must appear on every page. If they exist as theme components, use them. If not, import `SiteHeader` from `@platform/core-components` for nav, and `Footer` from `@platform/core-components/src/components/ui/footer` for footer.

### Step 5f-2: Detect category slug

Read `discoveredPages[]` and `pageBlueprints[]` from site-analysis.json. Apply this decision tree:

1. Look for a `pageBlueprints` entry whose `path` matches `/services` → slug = `services`
2. Look for `/products` → slug = `products`
3. Look for `/projects` → slug = `projects`
4. Look for `/events` → slug = `events`
5. Look for any path that appears to be a listing page (multiple items, no dynamic segment) → use that path slug
6. If `registryRecommendation.themeName === "orion"` and no match found → default `services`
7. Otherwise → default `services`

Record the resolved `CATEGORY_SLUG` (e.g. `services`).

### Step 5f-3: Clean test site pages

Remove all pre-existing page.tsx files from the test site (keep layout.tsx and globals.css):

```bash
find sites/test-<theme-name>/app -name "page.tsx" -delete
find sites/test-<theme-name>/app -type d -empty -delete
```

---

## Phase 2: Generate each page

For each of the five pages, Claude follows the same pattern:

1. Find the matching entry in `pageBlueprints` (match by path)
2. If found: use its `sections[]` array (ordered by `order`) to determine section sequence
3. For each section in sequence:
   - Check if `componentMatches` has an "exact" or "close" match → import from `@platform/core-components`
   - Check if the theme component file exists in inventory → import from `@platform/themes/<theme-name>/components`
   - Otherwise: generate the section inline as JSX within the page file
4. If no blueprint found: use the fallback template

### Step 5f-4: Generate `app/page.tsx` (Home)

**Reference-first:** Find `pageBlueprints` entry with `path === "/"` or `pageType === "home"`.

Compose the page using the sections array. Typical Orion-style home:
```tsx
import { TopNavigation, SiteFooter, HeroSection, ServiceGrid } from '@platform/themes/<theme-name>/components';
// or fall back to core-components if not in theme

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavigation />
      <main className="flex-1">
        {/* sections in order from pageBlueprints */}
      </main>
      <SiteFooter />
    </div>
  );
}
```

**Inline section example** (when no component exists):
```tsx
{/* About/intro section — inline, no matching component */}
<section className="py-16 bg-surface-background">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-surface-foreground mb-4">Who We Are</h2>
    <p className="text-surface-secondary-foreground text-lg max-w-2xl">
      A trusted local business serving the community with quality service and professionalism.
    </p>
  </div>
</section>
```

**Fallback (no home blueprint):**
TopNav → Hero (use `HeroWithImage` if orion, `HeroSection` if vega, generate inline if neither available) → 3-card category grid → stats strip (4 numbers inline) → CTA inline → Footer

### Step 5f-5: Generate `app/about/page.tsx`

**Reference-first:** Find `pageBlueprints` entry with `path === "/about"` or `pageType === "about"`.

**Fallback:**
```
TopNav
→ PageHero (from core-components) with title "About Us"
→ Story section (inline): 2-col layout, left text block, right image placeholder
→ Values grid (inline): 3 cards with icon placeholder + title + text
→ CTA section: use CTASection from core-components if available
→ Footer
```

### Step 5f-6: Generate `app/contact/page.tsx`

**Reference-first:** Find `pageBlueprints` entry with `path === "/contact"`.

**Fallback:**
```
TopNav
→ PageHero with title "Get In Touch"
→ 2-column layout:
    Left (2/3 width): ContactForm from @platform/core-components
    Right (1/3 width): inline contact info block (phone, email, address, hours)
→ Footer
```

ContactForm is always available from core-components — use it as the primary contact mechanism regardless of reference site.

### Step 5f-7: Generate `app/<CATEGORY_SLUG>/page.tsx`

**Reference-first:** Find `pageBlueprints` entry whose path matches `/<CATEGORY_SLUG>`.

**Fallback:**
```
TopNav
→ PageHero with title derived from CATEGORY_SLUG (e.g. "Our Services")
→ Card grid (inline): 3 hardcoded example items
    Each card: title, short description, "Learn more" link to /<CATEGORY_SLUG>/example-item
→ CTA section
→ Footer
```

### Step 5f-8: Generate `app/<CATEGORY_SLUG>/[slug]/page.tsx`

**Reference-first:** Find `pageBlueprints` entry with a dynamic path like `/<CATEGORY_SLUG>/[slug]` or `/<CATEGORY_SLUG>/:slug`.

**Fallback:**
```
TopNav
→ Detail hero (inline): large title + breadcrumb + description
→ Rich text body (inline): 2-3 paragraphs of relevant placeholder copy
→ Features/benefits list (inline): 3-4 bullet points
→ Related items (inline): 2 cards linking back to /<CATEGORY_SLUG>
→ CTA section
→ Footer
```

This page uses a **static export** (no generateStaticParams, no dynamic data fetching). The `[slug]` segment exists for URL structure — the page renders the same example content regardless of slug.

---

## Phase 3: Validation gates

### Step 5f-9: Verify all five pages exist

```bash
ls sites/test-<theme-name>/app/page.tsx
ls sites/test-<theme-name>/app/about/page.tsx
ls sites/test-<theme-name>/app/contact/page.tsx
ls sites/test-<theme-name>/app/<CATEGORY_SLUG>/page.tsx
ls sites/test-<theme-name>/app/<CATEGORY_SLUG>/\[slug\]/page.tsx
```

If any are missing: STOP. Report which page failed to generate.

### Step 5f-10: Check for hardcoded hex colors

```bash
grep -rn '#[0-9a-fA-F]\{6\}\b' sites/test-<theme-name>/app/page.tsx \
  sites/test-<theme-name>/app/about/page.tsx \
  sites/test-<theme-name>/app/contact/page.tsx \
  sites/test-<theme-name>/app/<CATEGORY_SLUG>/page.tsx \
  "sites/test-<theme-name>/app/<CATEGORY_SLUG>/[slug]/page.tsx" 2>/dev/null
```

If matches found: WARN with file:line references. Do not STOP — report and continue (minor issues shouldn't block the test site).

### Step 5f-11: TypeScript check on generated pages

```bash
cd sites/test-<theme-name> && npx tsc --noEmit 2>&1 | head -40
```

If errors found: report them but continue (same behaviour as current Step 6 type-check).

---

## Files modified

| File | Change |
|---|---|
| `.claude/commands/pipeline.ingest.md` | Replace Step 5f (entire section) with the new multi-sub-step routine above |

No TypeScript tooling changes. No new files in `tools/`. The `output/ingestion/<theme>/example-pages/` directory continues to be generated by the analysis pipeline but is no longer used by the skill.

---

## Risks & Trade-offs

### Risk 1: Component availability uncertainty
The skill can't know at plan-write time exactly which theme components exist (they're generated per-run). The inventory step (5f-1) must be run at execution time. If `ls packages/themes/<theme-name>/components/` returns nothing, all sections must be inline — this produces functional but visually simpler pages.

**Mitigation:** The fallback templates are solid enough that inline-only pages still look reasonable. The visual comparison test will show the diff against reference.

### Risk 2: TopNavigation/SiteFooter component naming varies
The analysis may generate a nav component named `Header`, `TopBar`, `Navigation`, `SiteHeader`, etc. The skill needs to be flexible about this — it should look for any component whose name contains "Nav", "Header", "Top" for navigation, and "Footer" for footer.

**Mitigation:** Step 5f-1 lists all component files. The skill should scan filenames for nav/footer patterns rather than requiring exact names.

### Risk 3: `[slug]` dynamic route requires special handling
The item detail page at `app/<CATEGORY_SLUG>/[slug]/page.tsx` will cause a Next.js build error if there's also a `generateStaticParams` export that fails. Since we're using `npm run dev` (not `npm run build`) for test sites, this is fine — dev mode handles dynamic routes without static params. But the skill should be explicit: do NOT add `generateStaticParams` to this page.

**Mitigation:** Add explicit instruction in the skill: "Do not add generateStaticParams() — this page is dev-mode only."

### Risk 4: ContactForm dependency on site config
`ContactForm` from core-components reads from `@/lib/contact-info` which reads from `site.config.ts`. The test site has a placeholder `site.config.ts`. This should work (the form will render with placeholder copy) but if contact-info factory is broken, the contact page crashes.

**Mitigation:** Import ContactForm but wrap in a try/catch boundary, or use a simpler inline form if ContactForm fails type-check.

### Risk 5: Old example-pages output is now ignored
The analysis pipeline continues generating `output/ingestion/<theme>/example-pages/` but the skill no longer uses it. This is wasted computation.

**Decision:** Leave the analysis pipeline unchanged. The example-pages generation is a small part of the total analysis time, and changing the analysis tool is out of scope. Note this as future cleanup.

### Risk 6: Inline section quality
Claude-generated inline JSX within the page file, during pipeline execution, could vary in quality. There's no retry mechanism for inline sections (unlike the component generator which retries and falls back to placeholders).

**Mitigation:** The skill should provide very specific inline section templates with token classes pre-specified. The instructions should say "use exactly these Tailwind token classes" rather than "style it appropriately." This constrains the generation space.

---

## Verification (end-to-end)

1. Run `/pipeline.ingest --url https://www.djfoxelectrical.co.uk` (or any local business site)
2. Wait for analysis to complete
3. Confirm `output/ingestion/<theme>/site-analysis.json` exists with `pageBlueprints`
4. Watch Step 5f execute — confirm each of the five pages is generated in sequence
5. `cd sites/test-<theme> && npm run dev`
6. Visit all five pages in browser, confirm:
   - No JS runtime errors in console
   - Header + footer appear on every page
   - Colors match the theme (brand-primary, not default blue)
   - Contact page renders ContactForm
   - Category page shows 3 example item cards
   - Detail page renders without errors (even though slug is dynamic)
7. Run visual comparison test: `npx playwright test e2e/visual-compare.spec.ts`
