# Aggregated Review Findings

**Site:** dj-fox-electrical-test
**Date:** 2026-04-19
**Agents:** cs-visual-fidelity-reviewer, cs-frontend-engineer (a11y), cs-frontend-engineer (perf)

---

## By Domain

### Visual Fidelity

**VFR-001 [Critical]:** Composition renderer drops section content for nested dataKeys — single-level `data[key]` lookup fails for all dot-notation keys (`"home.hero"`, `"home.stats"`, etc.). 10 of 12 pages render near-blank.
**Fix:** Add dot-path resolver to `render-page.tsx`.

**VFR-002 [Critical]:** MDX content directory missing — test site has no `content/` tree. All `[slug]` detail routes crash with ENOENT.
**Fix:** `cp -R sites/dj-fox-electrical/content sites/dj-fox-electrical-test/content`

**VFR-003 [Critical]:** Site logo broken — test site has no `public/` directory. `/logo.svg` returns 404 on every page.
**Fix:** `cp -R sites/dj-fox-electrical/public sites/dj-fox-electrical-test/public`

**VFR-004 [High]:** Hero sections have no image/overlay support — `ComposableHeroSection` cannot render the full-bleed dark-image-with-overlay variant that Orion uses. Hero renders as white block with text.
**Fix:** Extend `ComposableHeroSection` to support `background: "image"` with overlay slot.

**VFR-005 [High]:** `ContactSection` renders hardcoded placeholder text instead of a form.
**Fix:** Replace placeholder `<p>` with `<ContactForm>` or accept `children`.

**VFR-006 [High]:** Services index missing category cards and service grouping.
**Fix:** Add `CategoryCardsSection` composable and category grouping to `ServiceCards`.

**VFR-007 [High]:** Locations index loses trust details; renders 10 locations instead of 21.
**Fix:** Source locations from MDX once `content/` is copied.

**VFR-008 [High]:** Reviews page empty — testimonials array stubbed, MDX loader not wired.
**Fix:** Wire reviews MDX loader in `lib/page-data.ts`.

**VFR-009 [High]:** Projects, blog, pricing pages empty — MDX arrays stubbed + dataKey bug.
**Fix:** Fix VFR-001, wire MDX loaders, copy `content/`.

**VFR-011 [Medium]:** "Why Choose Us" and stats strip missing dark backgrounds — `composition.json` uses `background: "subtle"` instead of `background: "inverse"`.
**Fix:** Update `composition.json` `home.whyChooseUs` and `home.stats` layout entries.

**VFR-010 [Medium]:** Hero headings render at reduced scale without visual anchor.
**Fix:** `ComposableHeroSection` should render a coloured strip even when `background !== "image"`.

**VFR-012 [Medium]:** Vertical rhythm audit deferred — cannot assess fully until VFR-001 is fixed.

### Accessibility

**A11Y-001 [High]:** Multiple `<nav>` elements with no `aria-label` in `site-header.tsx` and `mobile-menu.tsx`.
**Fix:** Add `aria-label="Main navigation"` / `aria-label="Mobile navigation"`.

**A11Y-002 [High]:** `.mobile-menu-close` removes focus outline without a replacement ring.
**Fix:** Add `focus:ring-2 focus:ring-brand-primary focus:ring-offset-2` to `orion/globals.css` line 369.

**A11Y-003 [High]:** Chevron SVGs in `LocationsDropdown` and `MobileMenu` not `aria-hidden`.
**Fix:** Add `aria-hidden="true"` to the chevron `<svg>` elements.

**A11Y-004 [High]:** `LocationsDropdown` menu items have redundant `tabIndex={0}` and `aria-haspopup="true"` should be `"menu"`.
**Fix:** Remove `tabIndex={0}` from `<Link role="menuitem">` elements. Change `aria-haspopup`.

**A11Y-005 [Medium]:** `TestimonialGrid` star ratings lack accessible numeric value.
**Fix:** Add `aria-label` to container, `aria-hidden` to individual stars.

**A11Y-006 [Medium]:** `ContactSection` placeholder paragraph — no accessible form. (Duplicates VFR-005.)

**A11Y-007 [Medium]:** Hero and ContentSection images use unconditional `alt=""`.
**Fix:** Accept `heroImageAlt`/`imageAlt` data keys.

**A11Y-008 [Medium]:** `TextSection` table uses `<td>` for row headers — should be `<th scope="row">`.
**Fix:** Change first `<td>` in each table row to `<th scope="row">`.

**A11Y-011 [Low]:** `CTASection` subheading uses `text-surface-muted-foreground` on `bg-brand-primary` — contrast ~2.5:1, below WCAG AA.
**Fix:** Use `text-brand-on-primary` when `background === "brand"`.

### Performance

**PERF-001 [High]:** `ImageGridSection` uses `fill` without `sizes` — defaults to `100vw`, ~3x oversized images.
**Fix:** Add `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`.

**PERF-002 [Medium]:** `images.formats` not set — AVIF not enabled in `next.config.ts`.
**Fix:** Add `formats: ['image/avif', 'image/webp']`.

---

## All Medium + Low findings (not listed above)

- VFR-013/014/015: Brand colour correct, no hardcoded tokens, footer correct — all passes
- A11Y-009: `not-found.tsx` icons need `aria-hidden` — trivial
- A11Y-010: Repeated "Learn more →" links need `aria-label` — trivial
- A11Y-012: Blog dates should use `<time dateTime>` — trivial
- PERF-003: `compress` not explicit — trivial
- PERF-004: `swcMinify` absent — pass, no action

---

## Aggregated Statistics

| Domain          | Critical | High   | Medium | Low   | Total  |
| --------------- | -------- | ------ | ------ | ----- | ------ |
| Visual Fidelity | 3        | 6      | 3      | 3     | 15     |
| Accessibility   | 0        | 4      | 4      | 4     | 12     |
| Performance     | 0        | 1      | 1      | 2     | 4      |
| **Total**       | **3**    | **11** | **8**  | **9** | **31** |

**Gate:** Critical + High total = **14** → fix agent runs.

---

## Priority Fix Order

The following fixes unblock the majority of findings and should be applied first:

1. **VFR-001**: Dot-path resolver in `render-page.tsx` — small effort, unblocks 10 pages
2. **VFR-002**: `cp -R content/` — trivial, unblocks all detail routes
3. **VFR-003**: `cp -R public/` — trivial, fixes logo on every page
4. **PERF-001**: Add `sizes` to `image-grid-section.tsx` — trivial
5. **A11Y-001–004**: Trivial/small a11y fixes in core-components and orion theme
6. **VFR-011**: Update `composition.json` background values — trivial
7. **A11Y-011**: Fix CTA subheading contrast — small
8. **VFR-004/005**: Hero image overlay + ContactForm integration — medium (follow-up)
9. **VFR-006/007/008/009**: MDX loader wiring + content population — medium (follow-up)
