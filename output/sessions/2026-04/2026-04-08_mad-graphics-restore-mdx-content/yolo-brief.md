# YOLO Implementation Brief: Restore MDX Content into Mad Graphics Theming

**Branch:** feature/mad-graphics-restore-mdx-content (created from develop)
**Session spec:** output/sessions/2026-04-08_mad-graphics-restore-mdx-content/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The mad-graphics Stitch design session produced self-contained pages with hardcoded `<header>` (`fixed top-0 z-50`) and `<footer>` elements baked into each page component. These override the `CygnusHeader` and `CygnusFooter` already correctly wired in `layout.tsx`, hiding the real navigation and showing broken anchor-only links instead. Additionally, the homepage and services listing show hardcoded invented content rather than the 46 real MDX service files.

The fix is to remove all inline headers/footers from the three affected pages so `layout.tsx` takes control, then replace hardcoded content with live MDX-backed data from `getContentItems`.

The plan was reviewed and approved. Implement it exactly as specified below.

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
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop && git pull
git checkout -b feature/mad-graphics-restore-mdx-content
cd sites/mad-graphics && npm run type-check   # must be clean before starting
```

---

## Phase 1: Remove inline header/footer from `about/page.tsx`

**Goal:** Strip the hardcoded `<nav>` and `<footer>` blocks from the about page so the layout's CygnusHeader/Footer take control.
**Model:** sonnet — targeted file edit, needs care to preserve the rest of the page content

1. Read `sites/mad-graphics/app/about/page.tsx` in full.
2. Remove the `<nav className="fixed top-0 ...">` block entirely.
3. Remove the `<footer>` block at the bottom entirely.
4. Remove the outer `<>` fragment wrapper if the file now returns a single root element. If the page previously wrapped everything in a fragment to accommodate header + content + footer, consolidate to a single `<main>` or `<div>` as appropriate.
5. Remove the `pt-[nav-height]` padding offset (e.g. `pt-32` or `pt-24`) from the first content section — the layout shell handles this now. Check if there's a top padding that compensates for the fixed nav; remove it.

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform/sites/mad-graphics
npm run type-check
```

Commit:

```bash
git add sites/mad-graphics/app/about/page.tsx
git commit -m "fix(mad-graphics): remove inline nav/footer from about page

Stitch-generated header was overriding CygnusHeader from layout.tsx.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2: Fix `app/page.tsx` — Homepage (remove inline header/footer, wire real data)

**Goal:** Remove the hardcoded header and footer, replace hardcoded service cards and fake testimonials with live MDX data.
**Model:** sonnet — significant rewrite of a single file

Read `sites/mad-graphics/app/page.tsx` in full before making any changes.

### 2a. Remove inline header and footer

- Remove the entire `<header className="fixed top-0 w-full z-50 ...">` block (currently lines 17–58).
- Remove the entire `<footer className="bg-[#0e0e0e] ...">` block (currently lines 443–522).
- Remove the outer `<>` fragment — the component should now return `<main>` directly (or wrap in a single element).

### 2b. Convert to async and fetch MDX data

Add these imports at the top:

```typescript
import { getContentItems } from "@/lib/content";
```

Change the function signature:

```typescript
export default async function HomePage() {
```

Add data fetching at the top of the function body:

```typescript
const [allServices, allTestimonials] = await Promise.all([
  getContentItems("services"),
  getContentItems("testimonials"),
]);
const featuredServices = allServices.slice(0, 6);
const featuredTestimonials = allTestimonials.filter((t) => t.featured).slice(0, 2);
// fallback if no featured testimonials
const displayTestimonials =
  featuredTestimonials.length >= 2 ? featuredTestimonials : allTestimonials.slice(0, 2);
```

### 2c. Replace hardcoded service cards

Replace the 6 hardcoded `<div className="group bg-surface-muted ...">` card blocks with a `.map()`:

```tsx
{
  featuredServices.map((service, i) => {
    const FALLBACK_IMAGES = [
      "/stitch-images/img-019.jpg",
      "/stitch-images/img-010.jpg",
      "/stitch-images/img-003.jpg",
      "/stitch-images/img-025.jpg",
      "/stitch-images/img-008.jpg",
      "/stitch-images/img-015.jpg",
    ];
    const imageSrc = service.hero?.image
      ? `/${service.hero.image}`
      : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
    const category = service.tags?.[0] ?? "Service";

    return (
      <div
        key={service.slug}
        className="group bg-surface-muted rounded-lg overflow-hidden flex flex-col"
      >
        <div className="h-64 overflow-hidden relative">
          <Image
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            src={imageSrc}
            alt={service.title}
          />
          <div className="absolute inset-0 bg-[#0e0e0e]/20" />
        </div>
        <div className="p-8 flex-1 flex flex-col">
          <span className="text-[#f7941d] font-body uppercase tracking-widest text-[10px] font-bold mb-2">
            {category}
          </span>
          <h3 className="text-2xl font-headline font-bold mb-4">{service.title}</h3>
          <p className="text-sm text-[#dac2af] font-body mb-6 flex-1">{service.description}</p>
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-2 text-[#f7941d] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
          >
            Learn more <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    );
  });
}
```

### 2d. Replace fake testimonials

Replace the two hardcoded testimonial `<div>` blocks with a `.map()` over `displayTestimonials`:

```tsx
{
  displayTestimonials.map((t) => (
    <div key={t.slug} className="bg-surface-background p-12 rounded-lg border border-[#544435]/10">
      <div className="flex text-[#f7941d] mb-6">
        {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
          <span
            key={i}
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
      </div>
      <p className="text-2xl font-headline italic text-surface-foreground leading-relaxed mb-8">
        &ldquo;{t.text}&rdquo;
      </p>
      <div>
        <div className="font-bold text-lg uppercase tracking-wider font-body">{t.customerName}</div>
        <div className="text-[#dac2af] text-xs font-body uppercase tracking-widest">
          {t.customerCompany ?? t.customerRole}
        </div>
      </div>
    </div>
  ));
}
```

### 2e. Fix anchor-only CTAs

Replace all `href="#quote"` and `href="#contact"` with `href="/contact"`.
Replace `href="#portfolio"` anchor links in nav (already removed) — no other instances should remain.

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform/sites/mad-graphics
npm run type-check
```

Commit:

```bash
git add sites/mad-graphics/app/page.tsx
git commit -m "fix(mad-graphics): restore homepage — remove inline nav/footer, wire real MDX data

Replace hardcoded service cards and fake testimonials with live MDX content.
Fix anchor-only CTAs to route to /contact.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: Fix `app/services/page.tsx` — Services Listing (remove inline nav/footer, wire real data)

**Goal:** Remove the hardcoded nav and footer, replace the 6-item hardcoded services array with all MDX services.
**Model:** sonnet — significant rewrite of a single file

Read `sites/mad-graphics/app/services/page.tsx` in full before making any changes.

### 3a. Remove inline nav and footer

- Remove the `<nav className="fixed top-0 ...">` block (the full block including the orange bottom border div).
- Remove the `<footer className="bg-[#1C1B1B] ...">` block at the bottom.
- Remove the outer `<div className="min-h-screen bg-[#131313] ...">` wrapper — replace it with a plain `<div>` or `<>` fragment. The layout provides the dark background.
- Remove the `pt-32` top padding from the breadcrumb section — adjust to `pt-8` or similar since the layout shell now handles the header offset.

### 3b. Remove hardcoded services array and convert to async

Delete the entire `const services = [...]` array (lines ~17–66).

Add import:

```typescript
import { getContentItems } from "@/lib/content";
```

Change function signature:

```typescript
export default async function ServicesPage() {
```

Add at top of function body:

```typescript
const services = await getContentItems("services");
```

### 3c. Update the service card map

The existing page uses `services.map((service) => ...)`. The card structure already uses `service.title`, `service.description`, `service.image`, `service.href`. Update the field references to match the MDX content shape:

```tsx
{
  services.map((service, i) => {
    const FALLBACK_IMAGES = [
      "/stitch-images/img-024.jpg",
      "/stitch-images/img-009.jpg",
      "/stitch-images/img-005.jpg",
      "/stitch-images/img-014.jpg",
      "/stitch-images/img-018.jpg",
      "/stitch-images/img-007.jpg",
    ];
    const imageSrc = service.hero?.image
      ? `/${service.hero.image}`
      : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
    const category = service.tags?.[0] ?? "Service";

    return (
      <div key={service.slug} className="bg-[#1A1A1A] p-8 md:p-12 group">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[16/9] mb-8">
          <Image
            fill
            src={imageSrc}
            alt={service.title}
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-[#f7941d]/10 mix-blend-multiply group-hover:bg-transparent transition-all duration-500" />
        </div>
        <p className="text-[#f7941d] uppercase tracking-[0.2em] text-xs font-bold mb-3">
          {category}
        </p>
        <h2 className="text-5xl font-headline font-bold text-white mb-4">{service.title}</h2>
        <p className="text-white/60 mb-8 leading-relaxed">{service.description}</p>
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 text-[#f7941d] font-headline uppercase tracking-tight text-sm font-bold hover:gap-4 transition-all duration-300"
        >
          <span>Learn more</span>
          <span className="material-symbols-outlined text-lg group-hover:translate-x-2 transition-transform duration-300">
            arrow_forward
          </span>
        </Link>
      </div>
    );
  });
}
```

Ensure `Link` is imported from `next/link` (it should already be).

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform/sites/mad-graphics
npm run type-check
```

Commit:

```bash
git add sites/mad-graphics/app/services/page.tsx
git commit -m "fix(mad-graphics): restore services listing — remove inline nav/footer, wire 46 MDX services

Replace hardcoded 6-item services array with dynamic MDX content from getContentItems.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4: Final Verification

**Goal:** Confirm the full build passes cleanly.
**Model:** haiku — mechanical checks only

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform/sites/mad-graphics
npm run type-check && npm run build
```

If build passes, confirm:

- No TypeScript errors
- All 3 amended pages (about, page, services/page) are included in the build output
- No new errors introduced

---

## Cost Estimate

| Phase                     | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: about page       | sonnet | ~6k               | ~1k                | ~$0.03     |
| Phase 2: homepage         | sonnet | ~10k              | ~3k                | ~$0.08     |
| Phase 3: services listing | sonnet | ~10k              | ~3k                | ~$0.08     |
| Phase 4: final verify     | haiku  | ~3k               | ~0.5k              | ~$0.01     |
| **Total**                 |        | **~29k**          | **~7.5k**          | **~$0.20** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `npm run type-check && npm run build` passes in `sites/mad-graphics`
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Compare to the pre-flight Cost Estimate above (~$0.20).
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-08_mad-graphics-restore-mdx-content/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-08
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

## Completed

**Date:** 2026-04-08
**Status:** All phases executed successfully

All three Stitch-generated pages had their inline `<nav>`/`<header>` and `<footer>` blocks removed so `layout.tsx`'s CygnusHeader and CygnusFooter take control. The homepage and services listing were converted to async Server Components using `getContentItems` — the homepage now maps MDX services and testimonials (with fallback images and correct type casts for the `[key: string]: unknown` ContentItem index fields), and the services listing renders all 46 MDX service files dynamically. One small deviation from the spec: the type casts used `const hero = service.hero as { image?: string } | undefined` and extracted typed variables rather than inline casts, which was the minimal change needed to satisfy TypeScript. `npm run type-check && npm run build` passed cleanly with 92 static pages generated.

### Commits

- `6319aaa` fix(mad-graphics): remove inline nav/footer from about page
- `29f91d8` fix(mad-graphics): restore homepage — remove inline nav/footer, wire real MDX data
- `591a6fe` fix(mad-graphics): restore services listing — remove inline nav/footer, wire 46 MDX services

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model used: `Claude Sonnet 4.6 <noreply@anthropic.com>`
