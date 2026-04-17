# Claude's Implementation Plan: DCS Inner Page HTML Prototypes

**Date:** 2026-04-12
**Model:** Claude Sonnet 4.6
**Status:** Independent plan — written before Codex review

---

## Summary

Generate 12 self-contained HTML design prototypes for the DCS website inner pages. Each page must faithfully extend the homepage visual identity. The Pricing page requires the most design effort. All output lands in `output/sessions/2026-04-12_dcs-inner-pages/`.

---

## Phase 0: Foundation Setup

### Step 0.1 — Read the homepage prototype in full

**File:** `output/sessions/2026-04-10_dcs-site-redesign/outputs/2026-04-10_204434/r2-f-bg-variants/bg-b-soft-blue-white.html`

This is non-negotiable. The implementing agent must read this file completely before writing a single line of output. The reason: header and footer markup must be replicated exactly (not redesigned), and the CSS custom properties, animation keyframes, scroll-reveal JS, and card styles must be copied verbatim.

**Verification gate:** Before generating any page, confirm you can articulate the exact HTML structure of the header, the exact CSS for `.solaris-geo-*` shapes, and the exact JS for the Intersection Observer scroll reveal.

### Step 0.2 — Extract the shared shell

Before generating any pages, mentally extract (do not write to disk yet) the following components from the homepage:

1. **`<head>` block**: `<meta charset>`, viewport, Google Fonts `@import` for Space Grotesk + Inter, the full `<style>` block with all CSS custom properties, resets, `.reveal` animation, keyframes, card styles, button styles, hero styles, footer styles, and the geometric shape classes
2. **Header HTML**: the exact `<header id="solaris-header">` element plus the mobile menu overlay `<div id="solaris-mobile-menu">` and the vanilla JS `<script>` block that handles hamburger toggle and scroll shadow
3. **Footer HTML**: the exact `<footer>` element

These three components are **immutable** — they must appear in every output file without alteration. If the homepage's CSS is 800 lines, all 800 lines go in every file. This is the trade-off of self-contained HTML: duplication for correctness.

**Rationale:** Attempting to reference a shared CSS file would break the self-contained requirement. Recreating the CSS from memory risks drift. Copy-paste is correct here.

---

## Phase 1: Pages Without Sidebars (simpler structure)

Generate in this order to build momentum with lower-complexity pages first.

### Step 1.1 — `services.html` (Services Index)

**Unique sections:**

- Hero: full-width sky-blue banner, `<h1>` "Our Services", subheading about digital marketing for tradespeople, breadcrumb (Home > Services), use `.solaris-geo-1/.solaris-geo-2` for visual interest
- Services grid: 4 cards (Web Design, Local SEO, Monthly Management, Google Workspace), each with: an inline SVG icon in chartreuse, title in Space Grotesk 700, 2-line description, "Find out more →" link in brand primary
- CTA banner: chartreuse (#D2DE32) background, dark text, headline + two buttons (contact + call)

**Card pattern:** white background, 20px radius, `box-shadow: 0 4px 20px rgba(42,46,32,0.08)`, on hover left accent bar (3px wide, brand-primary color) scales in from `scaleY(0)` to `scaleY(1)`, card lifts `translateY(-4px)`

**Verification:** Open in browser, confirm 4 service cards render in a 2×2 or 4-column grid, hover effects work.

---

### Step 1.2 — `locations.html` (Locations Index)

**Unique sections:**

- Hero: "Areas We Serve", subheading about East Sussex coverage, no geo shapes needed
- Coverage intro: short prose about UK-wide capability but East Sussex base
- Locations grid: 8 cards (Brighton, Hove, Eastbourne, Lewes, Uckfield, Hailsham, Seaford, Polegate) — map pin SVG icon, town name, brief tagline, "Learn more →" link
- CTA banner

**Verification:** 8 location cards render correctly.

---

### Step 1.3 — `blog.html` (Blog Index)

**Unique sections:**

- Hero: "Our Blog", subheading about tips and advice for tradespeople
- Post grid: 6 representative posts (pick from the 20 actual blog post titles), each card: date badge top-left, title, 2-line excerpt, category tag, "Read more →" link
- Cards use a slightly different style: date prominent at top, title in Space Grotesk, excerpt in Inter

**Pick posts:** Use 6 of the actual DCS blog post titles (e.g., "Why Tradespeople Need a Website", "Local SEO for Tradespeople", "How Much Does a Tradesperson Website Cost?", "Mobile-Friendly Websites", "Pay Monthly vs Upfront", "What to Put on Your Tradesperson Website")

**Verification:** 6 post cards render in a responsive grid.

---

### Step 1.4 — `projects.html` (Projects Index)

**Unique sections:**

- Hero: "Our Work", subheading "Real websites for real tradespeople"
- Projects grid: 3 cards (Colossus Scaffolding, DJ Fox Electrical, Brighton Painter & Decorator), each: category badge in chartreuse, title, 2-line description, date, "View project →" link
- Cards use aspect-ratio header area (no actual images needed — use a colored geometric placeholder using the brand palette)

**Verification:** 3 project cards render with placeholder header areas.

---

### Step 1.5 — `reviews.html` (Reviews / Testimonials)

**Unique sections:**

- Hero: "What Our Clients Say", subheading about social proof
- Testimonials grid: 6 cards, each with: star rating (5 gold Unicode stars ★★★★★), block quote, client name + trade + location, platform badge (Google / Facebook)
- Write 6 representative testimonials (fictional but plausible for a UK tradesperson audience)
- Card style: white bg, left blue border bar (permanent, not hover-only — this signals endorsement)

**Verification:** 6 testimonial cards render with stars.

---

### Step 1.6 — `about.html` (About Page)

**Unique sections:**

- Hero: "About Digital Consulting Services", breadcrumb (Home > About)
- Story section: 2-column — left: prose about DCS founding story + why tradespeople + East Sussex base; right: decorative element (stacked stats cards or abstract geometry)
- Stats bar: 3 figures (e.g., "50+ sites built", "3 years experience", "UK-wide coverage") in a horizontal band with sky-blue background
- Values grid: 3 cards (Results-first / No jargon / Always reachable), each with an SVG icon, title, short description
- CTA banner

**Verification:** All sections render, stats bar is visually distinct.

---

### Step 1.7 — `project-detail.html` (Project Detail)

**Unique sections:**

- Breadcrumb: Home > Our Work > Colossus Scaffolding
- Hero: tags "Scaffolding | Platform Build", `<h1>` "Colossus Scaffolding — New Website", date
- Full-width content area: prose about the project (2-3 paragraphs), "The Results" section with checkmark list (5-6 outcomes with green ✓ icons)
- Bottom CTA banner: "Need a website for your trade?" with buttons

**Verification:** Single-column layout, prose reads cleanly.

---

## Phase 2: Pages With Sidebars (two-column layouts)

### Step 2.1 — `service-detail.html` (Service Detail)

**Unique sections:**

- Breadcrumb: Home > Services > Web Design
- Hero: badge "Web Design", `<h1>` "Website Design for Tradespeople", description
- Two-column body:
  - Left (65%): "About this service" prose (2-3 paragraphs), benefits list with green checkmarks, FAQ accordion (3-4 questions)
  - Right sidebar (35%): sticky CTA card — sky-blue header with "Get a Free Quote" heading, phone link, chartreuse CTA button, "No obligation, free consultation"

**Sidebar sticky behaviour:** CSS `position: sticky; top: 120px` — works in self-contained HTML without JS.

**Verification:** On wide viewport, sidebar stays visible while scrolling through prose content.

---

### Step 2.2 — `location-detail.html` (Location Detail)

**Unique sections:**

- Breadcrumb: Home > Areas We Serve > Brighton
- Hero: "Website Design for Tradespeople in Brighton", description about Brighton market
- Two-column body:
  - Left (65%): prose about the Brighton market, local competition, why DCS works there
  - Right sidebar (35%): sticky CTA card (customised for Brighton — "Get your website in Brighton"), nearby towns list (Hove, Lewes, Worthing, etc.)

**Verification:** Sidebar renders sticky, nearby towns are listed.

---

### Step 2.3 — `blog-post.html` (Blog Post)

**Unique sections:**

- Breadcrumb: Home > Blog > Why Tradespeople Need a Website
- Hero: `<h1>` title, date/author/reading-time metadata row (Inter 14px, muted), no description
- Two-column body:
  - Left (65%): well-typeset prose article (3-4 paragraphs with subheadings using `h2`/`h3` in Space Grotesk), tags at bottom
  - Right sidebar (35%): sticky CTA card ("Ready to get found online?"), related posts list (3 titles with dates)

**Article typography:** `line-height: 1.75`, `max-width: 65ch` on the prose column, `h2` in Space Grotesk 600 at 1.5rem, `h3` at 1.25rem.

**Verification:** Article prose is readable, sidebar doesn't overflow content column.

---

### Step 2.4 — `contact.html` (Contact Page)

**Unique sections:**

- Hero: "Get In Touch", subheading, no geometric shapes
- Two-column:
  - Left (55%): contact form — name, email, phone (optional), message, honeypot `<input type="text" style="display:none">`, submit button
  - Right (45%): contact details card — sky-blue header, phone (with `tel:` link), email, East Sussex address, opening hours table (Mon-Fri 9am-6pm, Sat 10am-4pm, Sun closed)

**Form styling:** Use native HTML inputs styled with custom CSS (no framework needed). Focus state uses `outline: 2px solid var(--color-brand-primary)`.

**Verification:** Form renders correctly, contact card details are visible.

---

## Phase 3: Pricing Page (highest complexity)

### Step 3.1 — `pricing.html` (Pricing Page — most important)

This page requires the most design attention. Plan it in detail before coding.

**Sections in order:**

1. **Hero**: "Simple, Transparent Pricing", subheading "No hidden costs. No scope creep. A professional website that works for your trade.", no geo shapes (pricing pages need clarity, not decoration)

2. **Payment toggle**: Pure JS toggle — two buttons "Pay Upfront" / "Pay Monthly", toggle switches between two states. On toggle, all price cells update via `data-upfront` and `data-monthly` attributes read by a simple JS listener. The active button gets sky-blue background; inactive is outlined. No animation needed — instant swap is correct UX for a pricing decision.

3. **Three-tier table** (shown as cards, not a traditional HTML table — easier to make responsive):
   - Each card: tier name (Starter/Professional/Growth) in Space Grotesk 700, price headline (Upfront: "£995 setup + £15/mo" / Monthly: "£45/mo"), pages included badge, feature list with checkmarks, CTA button
   - Middle card (Professional) gets: chartreuse accent header, "Most Popular" badge, slightly elevated shadow
   - Recommended approach: CSS Grid `repeat(3, 1fr)` with `grid-column: 1 / -1` collapse on mobile

4. **"What's included in every plan"**: Compact icon+text list of the 9 universal inclusions, in a 3-column grid on desktop

5. **Add-ons section**: Headline "Extend Your Package", then 10 add-on items in a 2-column responsive grid. Each item: short name, price, brief description. Group into: "Content & SEO" / "Growth Tools" / "One-Off Extras"

6. **FAQ accordion**: 5-6 pricing FAQs. Pure CSS accordion using `<details>`/`<summary>` elements — no JS needed. Questions: "Do I own my website?", "What happens if I want to cancel?", "Can I upgrade my plan?", "Are there any hidden fees?", "What's included in a content update?"

7. **CTA banner**: Chartreuse background, "Ready to get started?", two buttons (Get a free quote / Call us)

**Verification:** Toggle switches prices, Professional card is visually elevated, accordion opens/closes, all three tiers visible.

---

## Implementation Notes for the Executing Agent

### CSS Architecture per File

Each HTML file's `<style>` block should include:

```
1. CSS custom properties (identical to homepage: --color-brand-primary: #61A3BA, etc.)
2. CSS reset (box-sizing, margin, padding)
3. Typography (font-family vars, heading sizes, body size/line-height)
4. Reusable component classes: .btn-primary, .btn-outline, .card, .section, .container
5. Animation keyframes: fadeSlideUp, solarisFloatA/B/C/D
6. .reveal class + transition
7. Header-specific styles
8. Footer-specific styles
9. Page-specific styles (hero, grid, sidebar, etc.)
```

### JavaScript per File

Each HTML file needs two JS blocks:

1. **Header toggle block** (from homepage — hamburger menu, scroll shadow)
2. **Scroll reveal block** (Intersection Observer for `.reveal` elements)

Pricing page additionally needs the **payment toggle block** (~15 lines of vanilla JS).

### Responsive breakpoints

- Mobile-first
- Breakpoint 768px: switch grids from 1-col to 2-col
- Breakpoint 1024px: switch to 3-col or 4-col depending on content

---

## Risks and Trade-offs

| Risk                                      | Likelihood                             | Mitigation                                                                |
| ----------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------- |
| Header/footer drift from homepage         | High if generated from memory          | **Copy verbatim** — never paraphrase or recreate                          |
| CSS custom property scope creep           | Medium — agents add page-specific vars | Keep all vars in `:root` block, don't add page-specific roots             |
| Pricing toggle JS bugs                    | Medium                                 | Use `data-*` attributes + simple `querySelectorAll`, test toggle manually |
| Token limit on long pages                 | Medium for pricing.html                | Generate in two passes if needed; pricing HTML will be long               |
| Service-detail/blog-post sidebar overflow | Low                                    | Use `min-height: 0` on flex children, test with long content              |

---

## Output Checklist

After generation, verify each file:

- [ ] `services.html` — 4 service cards, CTA banner
- [ ] `locations.html` — 8 location cards, CTA banner
- [ ] `blog.html` — 6 post cards
- [ ] `projects.html` — 3 project cards
- [ ] `reviews.html` — 6 testimonial cards with stars
- [ ] `about.html` — story, stats bar, values grid, CTA
- [ ] `project-detail.html` — full-width prose, results list, CTA banner
- [ ] `service-detail.html` — two-column with sticky sidebar
- [ ] `location-detail.html` — two-column with sticky sidebar, nearby towns
- [ ] `blog-post.html` — two-column prose + sidebar
- [ ] `contact.html` — form + contact card
- [ ] `pricing.html` — toggle, 3-tier cards, inclusions, add-ons, FAQ accordion, CTA

All 12 files land in: `output/sessions/2026-04-12_dcs-inner-pages/`
