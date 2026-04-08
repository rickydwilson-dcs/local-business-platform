# YOLO Implementation Brief: Mad Graphics — Design Elevation

**Branch:** feature/tasks-skill-review (already created from develop)
**Session spec:** output/sessions/2026-04-08_mad-graphics-design-elevation/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Mad Graphics is a print and signage agency site built on the Cygnus dark theme. The site has strong editorial bones (Newsreader + Work Sans, `#131313` dark background, warm orange `#F47B20`) but is inconsistent in two major ways: (1) service detail pages use generic `core-components` heroes and CTAs that clash with the dark editorial style established on the homepage, about, and services listing pages; (2) all page files use hardcoded hex colors instead of theme tokens, creating a maintenance burden and subtle color drift.

The plan was approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout feature/tasks-skill-review
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Add utility classes to globals.css

**Goal:** Add two utility classes to reduce repetition and centralise the "dark brown on orange" color.
**Model:** haiku — two class additions to a small CSS file.

Read `sites/mad-graphics/app/globals.css` first.

Add to the `@layer utilities` block (create it if absent):

```css
@layer utilities {
  .label-overline {
    @apply text-brand-primary font-body uppercase tracking-[0.3em] font-bold text-sm;
  }
  .cta-band-text-dark {
    color: #2d1600;
  }
}
```

**Verification gate — STOP if this fails:**

```bash
cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/app/globals.css
git commit -m "$(cat <<'EOF'
style(mad-graphics): add label-overline and cta-band-text-dark utilities

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Create reusable local components

**Goal:** Create two site-specific components — `CtaBand` (the orange CTA strip used on every page) and `ServicePageHero` (a dark editorial service hero that matches the site's style, replacing the generic `ServiceHero` from core-components).
**Model:** sonnet

### 2a. Create `sites/mad-graphics/components/ui/cta-band.tsx`

This replaces the inline CTA band JSX duplicated across homepage, about, services listing, and service detail pages.

```tsx
interface CtaBandProps {
  headline: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CtaBand({
  headline,
  subtext,
  primaryLabel = "Get a Quote",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: CtaBandProps) {
  return (
    <section className="bg-brand-primary py-24">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl text-center md:text-left">
          <h2 className="md:text-6xl mb-4 text-5xl font-headline font-bold mt-4 cta-band-text-dark">
            {headline}
          </h2>
          {subtext && (
            <p className="text-lg font-body font-medium cta-band-text-dark opacity-70">{subtext}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <a
            href={primaryHref}
            className="bg-surface-background text-brand-primary px-10 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform uppercase tracking-widest"
          >
            {primaryLabel}
          </a>
          {secondaryLabel && secondaryHref && (
            <a
              href={secondaryHref}
              className="bg-brand-primary-hover/20 cta-band-text-dark border border-[#2d1600]/30 px-10 py-4 rounded-lg font-bold text-lg hover:bg-brand-primary-hover/30 transition-colors uppercase tracking-widest"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
```

### 2b. Create `sites/mad-graphics/components/ui/service-page-hero.tsx`

This is a dark, editorial service hero for the service detail page. It must be a Server Component (no `'use client'`).

```tsx
import Image from "next/image";
import Link from "next/link";

interface ServicePageHeroProps {
  title: string;
  description: string;
  badge?: string;
  heroImage?: string;
  phone: string;
}

export function ServicePageHero({
  title,
  description,
  badge,
  heroImage,
  phone,
}: ServicePageHeroProps) {
  const phoneTel = phone.replace(/\s/g, "");

  return (
    <section className="relative bg-surface-background py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text column */}
          <div>
            {badge && <span className="label-overline mb-6 inline-block">{badge}</span>}
            <h1 className="text-6xl md:text-7xl font-headline font-bold italic tracking-tight leading-none mb-8">
              {title}
            </h1>
            <p className="text-lg text-surface-muted-foreground font-body leading-relaxed max-w-xl mb-10">
              {description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-brand-primary text-surface-background px-10 py-4 rounded-lg font-bold text-base hover:bg-brand-primary-hover transition-colors uppercase tracking-widest"
              >
                Get Free Quote
              </Link>
              <Link
                href={`tel:${phoneTel}`}
                className="border border-surface-card-border text-surface-foreground px-10 py-4 rounded-lg font-bold text-base hover:bg-surface-muted transition-colors uppercase tracking-widest inline-flex items-center gap-2"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {phone}
              </Link>
            </div>
          </div>

          {/* Image column */}
          <div className="relative">
            {heroImage ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={heroImage}
                  alt={`Professional ${title.toLowerCase()} services`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-surface-background/40 to-transparent" />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-surface-muted rounded-lg border border-surface-card-border flex items-center justify-center">
                <span className="text-surface-muted-foreground font-body text-sm uppercase tracking-widest">
                  Service Photography
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Verification gate — STOP if this fails:**

```bash
cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/components/ui/cta-band.tsx sites/mad-graphics/components/ui/service-page-hero.tsx
git commit -m "$(cat <<'EOF'
feat(mad-graphics): add CtaBand and ServicePageHero site components

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Update homepage (`app/page.tsx`)

**Goal:** Replace hardcoded hex values with theme tokens, left-align testimonials header, use `CtaBand` component.
**Model:** sonnet

Read `sites/mad-graphics/app/page.tsx` in full before editing.

Changes to make:

1. **Services section label** — `text-[#f7941d]` → `text-brand-primary`
2. **Service card category label** — `text-[#f7941d]` → `text-brand-primary`
3. **Service card description** — `text-[#dac2af]` → `text-surface-muted-foreground`
4. **Service card "Learn more" link** — `text-[#f7941d]` → `text-brand-primary`
5. **Service card image overlay** — `bg-[#0e0e0e]/20` → `bg-surface-background/20`
6. **Testimonials section background** — `bg-[#0e0e0e]` → `bg-surface-muted`
7. **Testimonials header** — remove `text-center` from the `<div className="text-center mb-20">`, change to `mb-20`
8. **Testimonials label color** — `text-[#5BA829]` → `text-brand-secondary`
9. **Testimonials card border** — `border-[#544435]/10` → `border-surface-card-border`
10. **Testimonials star icons** — `text-[#f7941d]` → `text-brand-primary`
11. **Testimonials customer company text** — `text-[#dac2af]` → `text-surface-muted-foreground`
12. **CTA Band section** — replace the entire `<section className="bg-[#f7941d] py-24">...</section>` block with:
    ```tsx
    <CtaBand
      headline="Ready to make your brand stand out?"
      subtext="Let's discuss your project today and get a custom quote within 24 hours."
      primaryLabel="Get a Quote"
      primaryHref="/contact"
      secondaryLabel="Contact Us"
      secondaryHref="/contact"
    />
    ```
13. Add import at the top: `import { CtaBand } from '@/components/ui/cta-band';`
14. Remove the `import Link from 'next/link'` if it's only used in the CTA (check — it may still be needed for service card links).

**Verification gate — STOP if this fails:**

```bash
cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/app/page.tsx
git commit -m "$(cat <<'EOF'
style(mad-graphics): token cleanup and CtaBand on homepage

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Update about page (`app/about/page.tsx`)

**Goal:** Token cleanup, convert 3-equal-card values section to editorial zig-zag rows, use `CtaBand`.
**Model:** sonnet

Read `sites/mad-graphics/app/about/page.tsx` in full before editing.

**4a. Token replacements across all sections:**

- `text-[#f7941d]` → `text-brand-primary`
- `bg-[#0e0e0e]` (Trust Bar section) → `bg-surface-muted`
- `border-[#544435]/10` → `border-surface-card-border`
- `text-[#5BA829]` → `text-brand-secondary` (if present)
- `border-[#f7941d]` (blockquote left border) → `border-brand-primary`
- `bg-[#2a2a2a]` (blockquote bg) → `bg-surface-muted`
- `text-[#f7941d]` on team member role labels → `text-brand-primary`

**4b. Values section — replace 3-equal-card grid with zig-zag rows:**

Replace the entire `{/* Values Cards */}` section with:

```tsx
{
  /* Values */
}
<section className="py-32 bg-surface-background">
  <div className="max-w-7xl mx-auto px-8">
    <div className="mb-20">
      <h2 className="text-5xl font-headline font-bold">Our Principles.</h2>
    </div>
    <div className="divide-y border-surface-card-border">
      {/* Precision */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-16 items-start">
        <div className="md:col-span-4 flex items-center gap-6">
          <span className="material-symbols-outlined text-5xl text-brand-primary">
            architecture
          </span>
          <h3 className="text-3xl font-headline font-bold">Precision</h3>
        </div>
        <div className="md:col-span-8">
          <p className="text-surface-foreground/70 leading-relaxed text-lg">
            Measurements down to the millimeter. Color matching that hits the mark every time. We
            don&apos;t settle for &lsquo;close enough&rsquo;.
          </p>
        </div>
      </div>
      {/* Creativity */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-16 items-start">
        <div className="md:col-span-4 flex items-center gap-6">
          <span className="material-symbols-outlined text-5xl text-brand-primary">brush</span>
          <h3 className="text-3xl font-headline font-bold">Creativity</h3>
        </div>
        <div className="md:col-span-8">
          <p className="text-surface-foreground/70 leading-relaxed text-lg">
            Turning industrial materials into visual masterpieces. We find the art in the technical
            and the beauty in the functional.
          </p>
        </div>
      </div>
      {/* Reliability */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-16 items-start">
        <div className="md:col-span-4 flex items-center gap-6">
          <span className="material-symbols-outlined text-5xl text-brand-primary">handshake</span>
          <h3 className="text-3xl font-headline font-bold">Reliability</h3>
        </div>
        <div className="md:col-span-8">
          <p className="text-surface-foreground/70 leading-relaxed text-lg">
            On time, on budget, and built to withstand the elements. When we give our word, consider
            it set in vinyl and steel.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>;
```

Note: The `divide-y` utility needs the border color on the parent. Use `divide-y divide-surface-card-border` (check if this token resolves — if not, use `divide-[#2e2b2b]`).

**4c. Replace CTA Band section:**

Replace the `<section className="bg-[#f7941d] py-24">...</section>` block at the bottom with:

```tsx
<CtaBand
  headline="Work with us"
  subtext="Ready to build your brand's physical presence? Let's discuss your next project."
  primaryLabel="Get a Quote"
  primaryHref="/contact"
/>
```

Add import: `import { CtaBand } from '@/components/ui/cta-band';`

**Verification gate — STOP if this fails:**

```bash
cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/app/about/page.tsx
git commit -m "$(cat <<'EOF'
style(mad-graphics): token cleanup, editorial values layout on about page

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: Update services listing page (`app/services/page.tsx`)

**Goal:** Add max-width container, token cleanup, use `CtaBand`.
**Model:** haiku — mostly find-replace + minor structural change.

Read `sites/mad-graphics/app/services/page.tsx` in full before editing.

Changes:

1. **Wrap entire page content in a max-width container.** The page currently has no `max-w-7xl` wrapper — the breadcrumb, header, grid, and CTA are all direct children with `px-6 md:px-10`. Wrap `<div>` contents in `<div className="max-w-7xl mx-auto">` — but keep individual section padding where it makes sense.
   - Breadcrumb div: change `px-6 md:px-10` → remove (let the wrapper handle it), add `px-6 md:px-10` to the wrapper instead. Actually — keep per-section `px-6 md:px-10` padding for consistency; just add `max-w-7xl mx-auto` to the outer `<div>` wrapper replacing the existing outer `<div>`.
2. **Token replacements:**
   - `bg-[#1A1A1A]` → `bg-surface-muted`
   - `bg-[#544435]/10` and `border-[#544435]/10` → `border-surface-card-border` and `bg-surface-card-border` accordingly
   - `text-[#f7941d]` → `text-brand-primary`
3. **Replace the entire `{/* ── CTA Band ── */}` div** at the bottom with:
   ```tsx
   <div className="mt-20 px-6 md:px-10">
     <CtaBand
       headline="Ready to get started?"
       subtext="Let's talk about your next project. No obligation, no hard sell."
       primaryLabel="Get a Quote"
       primaryHref="/contact"
     />
   </div>
   ```
4. Add import: `import { CtaBand } from '@/components/ui/cta-band';`

**Verification gate — STOP if this fails:**

```bash
cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/app/services/page.tsx
git commit -m "$(cat <<'EOF'
style(mad-graphics): max-width container, token cleanup on services listing

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: Update service detail page (`app/services/[slug]/page.tsx`)

**Goal:** Replace `ServiceHero` (from core-components) with the new local `ServicePageHero`, and replace `CTASection` with `CtaBand`.
**Model:** sonnet

Read `sites/mad-graphics/app/services/[slug]/page.tsx` in full before editing.

Changes:

1. **Remove import of `ServiceHero` from `@platform/core-components`** (keep all other imports from that package).
2. **Add imports at the top:**
   ```tsx
   import { ServicePageHero } from "@/components/ui/service-page-hero";
   import { CtaBand } from "@/components/ui/cta-band";
   ```
3. **Remove import of `CTASection` from `@platform/core-components`** (keep all other imports).
4. **Replace the `<ServiceHero ... />` usage** with:
   ```tsx
   <ServicePageHero
     title={fm.title}
     description={fm.description || ""}
     badge={fm.badge}
     heroImage={heroImage ? getImageUrl(heroImage) : undefined}
     phone={siteConfig.business.phone}
   />
   ```
5. **Replace the `<CTASection ... />` usage** with:
   ```tsx
   <CtaBand
     headline={`Ready for professional ${serviceName}?`}
     subtext={`Contact ${siteConfig.business.name} for a free quote. Our team is ready to help.`}
     primaryLabel="Get Free Quote"
     primaryHref="/contact"
     secondaryLabel={siteConfig.business.phone}
     secondaryHref={`tel:${siteConfig.business.phone.replace(/\s/g, "")}`}
   />
   ```

**Verification gate — STOP if this fails:**

```bash
cd sites/mad-graphics && npm run type-check
```

**Commit:**

```bash
git add sites/mad-graphics/app/services/[slug]/page.tsx
git commit -m "$(cat <<'EOF'
feat(mad-graphics): replace ServiceHero/CTASection with site-specific components on service detail page

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: Final verification

**Goal:** Confirm the full build passes with all changes in place.
**Model:** haiku

```bash
# Verification gate — STOP if this fails
cd /path/to/local-business-platform
pnpm type-check
cd sites/mad-graphics && npm run build
```

If build fails, read the error output, diagnose the root cause, fix it, and re-run before committing.

**Commit (only if a fix was needed):**

```bash
git add [fixed files]
git commit -m "$(cat <<'EOF'
fix(mad-graphics): resolve build error from design elevation changes

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Cost Estimate

| Phase                     | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: globals.css      | haiku  | ~2k               | ~0.2k              | <$0.01     |
| Phase 2: new components   | sonnet | ~5k               | ~2k                | $0.05      |
| Phase 3: homepage         | sonnet | ~8k               | ~2k                | $0.05      |
| Phase 4: about page       | sonnet | ~10k              | ~3k                | $0.07      |
| Phase 5: services listing | haiku  | ~6k               | ~1k                | $0.01      |
| Phase 6: service detail   | sonnet | ~10k              | ~2k                | $0.05      |
| Phase 7: final build      | haiku  | ~3k               | ~0.5k              | <$0.01     |
| **Total**                 |        | **~44k**          | **~10.7k**         | **~$0.25** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `npm run build` passes in `sites/mad-graphics`
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    | [total]           | [total]            | $X.XX     |
   | haiku     | [total]           | [total]            | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to this file (`output/sessions/2026-04-08_mad-graphics-design-elevation/yolo-brief.md`):

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Completed

**Date:** 2026-04-08
**Status:** All phases executed successfully

All 6 implementation phases completed. Added `label-overline` and `cta-band-text-dark` utility classes to globals.css, created `CtaBand` and `ServicePageHero` site-specific components in `components/ui/`, replaced all hardcoded hex colors with theme tokens across homepage, about, and services listing pages, converted the values section on the about page from a 3-equal-card hover-effect grid to an editorial zig-zag layout, and swapped the generic `ServiceHero`/`CTASection` from core-components with the new local equivalents on the service detail page. One deviation from plan: `font-body` was removed from the `@apply` in the `label-overline` utility — PostCSS/Tailwind cannot resolve custom font utilities inside `@apply` within `@layer utilities` in this version, causing a build failure. The font is still applied via inline `font-body` className at the component level where needed.

### Commits

- `eed7df4` style(mad-graphics): add label-overline and cta-band-text-dark utilities
- `4b3d818` feat(mad-graphics): add CtaBand and ServicePageHero site components
- `29f4b47` style(mad-graphics): token cleanup and CtaBand on homepage
- `47f9924` style(mad-graphics): token cleanup, editorial values layout on about page
- `e265d4d` style(mad-graphics): max-width container, token cleanup on services listing
- `e12d9cd` feat(mad-graphics): replace ServiceHero/CTASection with site-specific components on service detail page
- `41b83db` fix(mad-graphics): resolve build error from design elevation changes

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model (Claude Sonnet 4.6)
- Do NOT modify anything in `packages/core-components/` — all changes are site-local
