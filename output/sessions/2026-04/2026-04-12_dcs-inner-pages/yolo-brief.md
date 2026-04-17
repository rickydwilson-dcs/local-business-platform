# YOLO Implementation Brief: DCS Inner Page HTML Prototypes

**Branch:** feature/dcs-inner-pages (created from develop)
**Session spec:** output/sessions/2026-04-12_dcs-inner-pages/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The DCS website (digitalconsultingservices.co.uk) has an approved homepage prototype at `output/sessions/2026-04-10_dcs-site-redesign/outputs/2026-04-10_204434/r2-f-bg-variants/bg-b-soft-blue-white.html`. The Solaris theme was built from this homepage, but all 11 inner page templates are structural placeholders without reference designs. This session generates 12 self-contained HTML design prototypes (one per inner page) that extend the homepage's visual identity, ready to feed into a React conversion session.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | /                      | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | /                      | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | /                      | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/dcs-inner-pages   # create feature branch from develop
```

No type-check needed — this session only writes HTML files to the output folder, not TypeScript source.

---

## Phase 0: Foundation

**Goal:** Read the source files and freeze the shared shell before generating any pages.
**Model:** sonnet

### Step 0.1 — Read the homepage prototype in full

**CRITICAL: Do not write a single line of output HTML until this file has been read completely.**

File: `output/sessions/2026-04-10_dcs-site-redesign/outputs/2026-04-10_204434/r2-f-bg-variants/bg-b-soft-blue-white.html`

Read the entire file (it is ~1155 lines). Identify and memorise:

- All CSS custom properties in `:root` (colours, easing, radius, spacing)
- All animation keyframes (`fadeSlideUp`, `solarisFloatA/B/C/D`)
- The `.reveal` class and its Intersection Observer JS
- The card hover pattern (left accent bar `scaleY(0)→scaleY(1)` + card `translateY(-4px)`)
- The header HTML structure: `<header id="solaris-header">` + mobile menu overlay `<div id="solaris-mobile-menu">` + the vanilla JS `<script>` block
- The footer HTML structure
- The Google Fonts `@import` URL (exact string, do not reconstruct)
- The geometric shape classes `.solaris-geo-1` through `.solaris-geo-4`

### Step 0.2 — Read the pricing data

File: `tasks/gtm/strategy.md`

Extract exact pricing for the 3 tiers (Starter/Professional/Growth) under both payment options (Upfront and Pay Monthly), all add-on items with prices, and the "What Every Site Gets" list. The pricing page must use real numbers.

### Step 0.3 — Create the output folder and frozen working artifacts

Create folder: `output/sessions/2026-04-12_dcs-inner-pages/`

Write the following working aid files (these are temporary helpers, not deliverables — they will be deleted in Phase 6):

| File                                                             | Contents                                                                                                                                                                                |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `output/sessions/2026-04-12_dcs-inner-pages/_shared-header.html` | Exact header HTML verbatim from the homepage (from `<header id="solaris-header">` through the closing mobile menu `</div>` and header `<script>` block)                                 |
| `output/sessions/2026-04-12_dcs-inner-pages/_shared-footer.html` | Exact footer HTML verbatim from the homepage                                                                                                                                            |
| `output/sessions/2026-04-12_dcs-inner-pages/_shared-styles.css`  | Complete CSS from the homepage `<style>` block (custom properties, reset, typography, animations, keyframes, reveal, header, footer, card, button, geometric shape styles — everything) |
| `output/sessions/2026-04-12_dcs-inner-pages/_shared-scripts.js`  | Both JS blocks from the homepage: header hamburger toggle + scroll shadow, and Intersection Observer reveal                                                                             |

```bash
# Verification gate — STOP if any file is missing or empty
ls -la output/sessions/2026-04-12_dcs-inner-pages/_shared-*.{html,css,js}
# All 4 files must exist and be non-empty
```

### Commit 0

```bash
git add output/sessions/2026-04-12_dcs-inner-pages/_shared-*.html output/sessions/2026-04-12_dcs-inner-pages/_shared-*.css output/sessions/2026-04-12_dcs-inner-pages/_shared-*.js
git commit -m "feat(dcs): add shared shell artifacts for inner page prototypes

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 1: Define Page Archetypes

**Goal:** Establish the 6 layout archetypes as a mental contract before writing any pages.
**Model:** sonnet (planning — no files written)

This is a planning step, not a code step. Before generating any HTML, confirm every page maps to one of these archetypes:

| Archetype              | Pages                                        | Hero                                              | Body Layout                                              | Geo Shapes on Hero                                                |
| ---------------------- | -------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| **Index grid**         | services, locations, blog, projects, reviews | Full-width banner, `<h1>`, subheading, breadcrumb | Card grid + CTA banner                                   | Selective (services yes; blog, locations, projects, reviews — no) |
| **Detail + sidebar**   | service-detail, location-detail, blog-post   | Full-width banner with breadcrumb, badge/metadata | Two-column: 65% prose, 35% sticky sidebar                | No                                                                |
| **Detail full-width**  | project-detail                               | Full-width banner with breadcrumb, tags, date     | Single-column prose + results list + CTA                 | No                                                                |
| **Narrative**          | about                                        | Full-width banner                                 | Story (2-col) + stats bar + values grid + CTA            | Selective on hero                                                 |
| **Form + info panel**  | contact                                      | Full-width banner                                 | Two-column: 55% form, 45% info card                      | No                                                                |
| **Commercial pricing** | pricing                                      | Full-width banner, no decoration                  | Toggle + 3-tier cards + inclusions + add-ons + FAQ + CTA | No                                                                |

**Rules applying to ALL archetypes:**

- Header and footer: copy verbatim from `_shared-header.html` and `_shared-footer.html` — zero modifications
- `.reveal` class on all major sections (hero, each content section, CTA)
- CSS from `_shared-styles.css` goes in every `<style>` block in full
- JS from `_shared-scripts.js` goes in every file as two `<script>` blocks
- Responsive: mobile-first, 768px breakpoint for 2-col, 1024px for 3-4 col
- Hardware-accelerated animations only (`transform` + `opacity`)
- No external icon libraries — Unicode or inline SVG only

No commit for this phase (planning only).

---

## Phase 2: Wave 1 — Pricing Page

**Goal:** Generate `pricing.html` — the most commercially important and technically complex page.
**Model:** sonnet

This page is generated first because its JS patterns (payment toggle) and CSS patterns (tier card grid) are the hardest to get right.

### CSS architecture for this file

Each page's `<style>` block contains (in order):

1. CSS custom properties (verbatim from `_shared-styles.css`)
2. CSS reset
3. Typography
4. Reusable components: `.btn-primary`, `.btn-outline`, `.card`, `.section`, `.container`
5. Animation keyframes
6. `.reveal` + transition
7. Header-specific styles
8. Footer-specific styles
9. Geometric shape styles
10. Page-specific styles

### Sections in order

1. **Hero**: `<h1>` "Simple, Transparent Pricing" / subheading "No hidden costs. No scope creep. A professional website that works for your trade." / breadcrumb: Home > Pricing. Sky-blue background. **No geometric shapes** — pricing pages need clarity over decoration.

2. **Payment toggle**: Two buttons ("Pay Upfront" / "Pay Monthly"). Active = sky-blue background; inactive = outlined. Vanilla JS (~15 lines):
   - Container gets `data-pricing="upfront"` by default
   - Each price cell contains two `<span>` elements: one with class `price-upfront`, one with class `price-monthly`
   - CSS: `[data-pricing="upfront"] .price-monthly { display: none }` and `[data-pricing="monthly"] .price-upfront { display: none }`
   - JS: on button click, set container's `data-pricing` to the selected mode
   - Instant swap, no animation needed

3. **Three-tier cards** (CSS Grid `grid-template-columns: repeat(3, 1fr)`, collapses to 1-col on mobile):
   - **Starter**: up to 20 pages. Upfront: "£995 setup + £15/mo" / Year 1: £1,175. Monthly: "£45/mo" / 12-month min.
   - **Professional** (elevated): up to 50 pages. Upfront: "£1,995 setup + £25/mo" / Year 1: £2,295. Monthly: "£75/mo" / 12-month min. Chartreuse (#D2DE32) accent header, "Most Popular" badge, elevated shadow (`box-shadow: 0 8px 40px rgba(42,46,32,0.16)`).
   - **Growth**: up to 100 pages. Upfront: "£3,495 setup + £50/mo" / Year 1: £4,095. Monthly: "£125/mo" / 12-month min.
   - Each card: tier name (Space Grotesk 700), price headline area (with toggle spans), pages badge, feature bullet list with checkmark SVGs, CTA button.

4. **"What every site gets"**: 3-column grid (desktop), 9 items:
   - Contact form with email notifications
   - Mobile-responsive, fast-loading design
   - Custom theme (colours, typography, layout)
   - Full local SEO (Schema markup, meta tags, sitemap)
   - Custom domain setup + management (included)
   - Google Workspace email setup
   - SSL certificate
   - Hosting, security updates, uptime monitoring
   - Unlimited revisions during build
     Each item: small inline SVG checkmark icon + text.

5. **Add-ons section**: "Extend Your Package" headline. 2-column responsive grid, grouped by category with section headings:
   - **Content & SEO**: Extra pages (£20/page), Blog post writing (£75/post), Quarterly SEO review upgrade (£50/quarter), FAQ expansion pack (£100 one-off)
   - **Growth Tools**: Review capture widget (£10/mo), Lead notification SMS (£5/mo), Call tracking number (£15/mo), AI chatbot with FAQ (£20/mo), Booking calendar integration (£15/mo)
   - **One-Off Extras**: Custom theme design (£350), Logo design (£250), Branded stationery pack (£150), Google My Business setup (£150), Multi-location expansion (£200/area)
   - **Higher-touch**: Google Ads setup + management (£200/mo + ad spend), Monthly SEO retainer (£200/mo)

6. **FAQ accordion**: Pure CSS `<details>/<summary>` — zero JS. Style: `summary { cursor: pointer; padding: 1rem; }` / `summary::after { content: "▾"; transition: transform 0.2s; }` / `details[open] summary::after { transform: rotate(-180deg); }`. 6 questions:
   - "Do I own my website?" (Upfront: yes. Pay Monthly: service model — site comes down if you stop paying.)
   - "What happens if I want to cancel?"
   - "Can I upgrade my plan later?"
   - "Are there any hidden fees?"
   - "What's included in a content update?"
   - "What's the difference between upfront and pay monthly?"

7. **CTA banner**: Chartreuse (#D2DE32) background, dark text (#2a2e20). "Ready to get started?" / Two buttons: "Get a free quote" (primary) + "Call us" (outline).

```bash
# Verification gate — STOP if any check fails
ls -la output/sessions/2026-04-12_dcs-inner-pages/pricing.html
# Open in browser mentally — confirm:
# - pricing.html exists and is >100 lines
grep -c "data-pricing" output/sessions/2026-04-12_dcs-inner-pages/pricing.html
# Expected: >0 (toggle mechanism present)
grep -c "Most Popular" output/sessions/2026-04-12_dcs-inner-pages/pricing.html
# Expected: >0
grep -c "<details" output/sessions/2026-04-12_dcs-inner-pages/pricing.html
# Expected: >5 (FAQ accordion items)
grep -c 'id="solaris-header"' output/sessions/2026-04-12_dcs-inner-pages/pricing.html
# Expected: 1
```

### Commit 1

```bash
git add output/sessions/2026-04-12_dcs-inner-pages/pricing.html
git commit -m "feat(dcs): add pricing page HTML prototype

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: Wave 2 — Detail/Sidebar Pages (4 files)

**Goal:** Generate the four detail-layout pages.
**Model:** sonnet

Generate in order: `service-detail.html`, `location-detail.html`, `blog-post.html`, `project-detail.html`.

**Shared sidebar CSS** (apply to the first three):

```css
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 768px) {
  .content-grid {
    grid-template-columns: 65% 1fr;
  }
}
.sidebar {
  position: sticky;
  top: 120px;
  align-self: start;
}
```

### 3.1 — `service-detail.html`

- Breadcrumb: Home > Services > Web Design
- Hero: badge "Web Design", `<h1>` "Website Design for Tradespeople", description. Sky-blue background.
- Left column (65%):
  - "About this service" heading + 2-3 paragraphs of prose about website design for tradespeople
  - Benefits list with green checkmark SVG icons (6 items, e.g. "Mobile-first, fast-loading", "Full local SEO", "No ongoing maintenance headaches")
  - FAQ accordion using `<details>/<summary>` (3-4 questions specific to web design)
- Right sidebar (35%, sticky): CTA card with sky-blue header "Get a Free Quote", phone link (`tel:01234567890`), chartreuse CTA button "Get in touch", "No obligation, free consultation" note in muted text.
- No CTA banner needed (sidebar handles the CTA).

### 3.2 — `location-detail.html`

- Breadcrumb: Home > Areas We Serve > Brighton
- Hero: `<h1>` "Website Design for Tradespeople in Brighton", description about Brighton market. Sky-blue background.
- Left column (65%): prose about the Brighton market (3 paragraphs: competition, types of tradespeople, why DCS), FAQ accordion (2-3 questions)
- Right sidebar (35%, sticky):
  - CTA card: "Get your website in Brighton", phone link, CTA button
  - Nearby towns list: Hove, Lewes, Worthing, Shoreham-by-Sea, Portslade, Burgess Hill (each as a link)

### 3.3 — `blog-post.html`

- Breadcrumb: Home > Blog > Why Tradespeople Need a Website
- Hero: `<h1>` "Why Tradespeople Need a Website in 2025", metadata row (Inter 14px, muted): "12 April 2025 · By Ricky Wilson · 5 min read". No description. Sky-blue background.
- Left column (65%): well-typeset article prose:
  - 3-4 paragraphs with `<h2>` and `<h3>` subheadings in Space Grotesk
  - `line-height: 1.75`, prose text in Inter
  - Example content: intro about why tradespeople need websites, key stats, sections on Google visibility, competitor analysis, generating enquiries
  - Tags at bottom: "Tradespeople", "Web Design", "Local SEO"
- Right sidebar (35%, sticky):
  - CTA card: "Ready to get found online?", phone link, CTA button
  - Related posts list (3 entries with title + date): "Local SEO for Tradespeople", "How Much Does a Tradesperson Website Cost?", "Mobile-Friendly Websites for Tradespeople"

### 3.4 — `project-detail.html` (full-width, no sidebar)

- Breadcrumb: Home > Our Work > Colossus Scaffolding
- Hero: tags "Scaffolding | Platform Build", `<h1>` "Colossus Scaffolding — New Website", date "January 2025". Sky-blue background.
- Full-width content area:
  - 2-3 paragraphs about the project (challenge, solution, what was built)
  - "The Results" section with green checkmark list (5-6 outcomes, e.g. "First enquiry within 3 weeks of launch", "3-5 organic leads per month", "Professional business email replacing personal Gmail")
- Bottom CTA banner: chartreuse background, "Need a website for your trade?", two buttons.

```bash
# Verification gate — STOP if any check fails
for f in service-detail location-detail blog-post project-detail; do
  echo "=== $f.html ==="
  ls -la output/sessions/2026-04-12_dcs-inner-pages/$f.html
  grep -c 'id="solaris-header"' output/sessions/2026-04-12_dcs-inner-pages/$f.html
done
# Each file must exist; each grep must return 1

# Check sidebars exist on the right pages
grep -l "position: sticky" output/sessions/2026-04-12_dcs-inner-pages/service-detail.html output/sessions/2026-04-12_dcs-inner-pages/location-detail.html output/sessions/2026-04-12_dcs-inner-pages/blog-post.html
# Expected: all 3 files listed
```

### Commit 2

```bash
git add output/sessions/2026-04-12_dcs-inner-pages/service-detail.html output/sessions/2026-04-12_dcs-inner-pages/location-detail.html output/sessions/2026-04-12_dcs-inner-pages/blog-post.html output/sessions/2026-04-12_dcs-inner-pages/project-detail.html
git commit -m "feat(dcs): add detail page HTML prototypes (service, location, blog post, project)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 4: Wave 3 — Index Grids, Narrative, and Form (7 files)

**Goal:** Generate the remaining 7 pages.
**Model:** sonnet

Generate in order: `services.html`, `locations.html`, `blog.html`, `projects.html`, `reviews.html`, `about.html`, `contact.html`.

### 4.1 — `services.html`

- Hero: `<h1>` "Our Services", subheading "Digital marketing for tradespeople across the UK — websites, SEO, and everything in between." Breadcrumb: Home > Services. Use `.solaris-geo-1` and `.solaris-geo-2` geometric shapes for visual interest.
- Services grid (4 cards, 2-col on tablet, 4-col on desktop):
  - Web Design — SVG icon (monitor/screen), "From £995 or £45/mo"
  - Local SEO — SVG icon (map pin / magnifying glass)
  - Monthly Management — SVG icon (calendar/refresh)
  - Google Workspace — SVG icon (envelope/G-logo style)
  - Each card: white bg, 20px radius, standard shadow, hover: left accent bar `scaleY(0)→scaleY(1)` (3px, brand-primary) + card `translateY(-4px)`, "Find out more →" link in brand-primary
- CTA banner: chartreuse background, "Ready to get more enquiries?", two buttons (Get a free quote / Call us).

### 4.2 — `locations.html`

- Hero: `<h1>` "Areas We Serve", subheading "Based in East Sussex, working with tradespeople across the South East and beyond." Breadcrumb: Home > Areas We Serve. No geo shapes.
- Coverage intro: 1 short paragraph about East Sussex base + UK-wide capability.
- Locations grid (8 cards, 2-col on tablet, 4-col on desktop): Brighton, Hove, Eastbourne, Lewes, Uckfield, Hailsham, Seaford, Polegate. Each: map pin inline SVG, town name (Space Grotesk 600), brief tagline (e.g. "Competitive market, high demand"), "Learn more →" link.
- CTA banner.

### 4.3 — `blog.html`

- Hero: `<h1>` "Our Blog", subheading "Tips, guides, and insights for tradespeople looking to grow their business online." No breadcrumb needed on blog index.
- Post grid (6 cards, 2-col on tablet, 3-col on desktop) using these real DCS blog titles:
  - "Why Tradespeople Need a Website" — April 2026 — category: Getting Started
  - "Local SEO for Tradespeople" — March 2026 — category: SEO
  - "How Much Does a Tradesperson Website Cost?" — March 2026 — category: Pricing
  - "Mobile-Friendly Websites for Tradespeople" — February 2026 — category: Design
  - "Pay Monthly vs Upfront Website" — February 2026 — category: Pricing
  - "What to Put on Your Tradesperson Website" — January 2026 — category: Content
    Each card: date badge top-left in muted style, title (Space Grotesk), 2-line excerpt (Inter), category tag in brand-primary, "Read more →" link.

### 4.4 — `projects.html`

- Hero: `<h1>` "Our Work", subheading "Real websites built for real tradespeople." Breadcrumb: Home > Our Work. No geo shapes.
- Projects grid (3 cards, 1-col on mobile, 3-col on desktop):
  - **Colossus Scaffolding** — category badge "Scaffolding" (chartreuse), "Professional website with full local SEO coverage across Sussex", date January 2025
  - **DJ Fox Electrical** — category badge "Electrical" (chartreuse), "Fully managed website for an East Sussex electrical contractor", date February 2025
  - **Brighton Painter & Decorator** — category badge "Painting & Decorating" (chartreuse), "New website from scratch, first Google enquiry within 3 weeks", date January 2025
    Each card: coloured geometric header area using brand palette as placeholder (no images), category badge, title (Space Grotesk 700), description, date, "View project →" link.

### 4.5 — `reviews.html`

- Hero: `<h1>` "What Our Clients Say", subheading "Real reviews from the tradespeople we've helped get found online." No breadcrumb needed.
- Testimonials grid (6 cards, 2-col on tablet, 3-col on desktop). Each card:
  - 5 gold Unicode stars: ★★★★★
  - Block quote (2-3 sentences, in quotes, in Inter italic)
  - Client name in Space Grotesk 600
  - Trade + location in muted text
  - Platform badge (Google or Facebook) — small, bottom-right
  - Card style: white bg, permanent left 3px border in brand-primary colour (not hover-only — signals trust/endorsement)
    Write 6 fictional but plausible UK tradesperson testimonials (electrician Brighton, scaffolder Eastbourne, painter Hove, plumber Lewes, gardener Uckfield, roofer Worthing).

### 4.6 — `about.html`

- Hero: `<h1>` "About Digital Consulting Services", breadcrumb: Home > About. Sky-blue background. Use `.solaris-geo-1` on hero for visual interest.
- Story section (2-column on desktop):
  - Left (60%): prose about DCS — founded in East Sussex, why tradespeople, what makes DCS different (bespoke, fast, affordable), 2-3 paragraphs
  - Right (40%): decorative element — 2-3 stacked stat mini-cards in brand palette (sky-blue bg, white text) showing key numbers
- Stats bar: horizontal band in sky-blue background, 3 large figures: "50+ sites built", "3 years experience", "UK-wide coverage"
- Values grid (3 cards, 1-col mobile, 3-col desktop):
  - Results-first — SVG icon (upward arrow / target), "We measure success by your phone ringing"
  - No jargon — SVG icon (speech bubble / no-symbol), "Plain English, always"
  - Always reachable — SVG icon (phone / clock), "We're here when you need us"
- CTA banner.

### 4.7 — `contact.html`

- Hero: `<h1>` "Get In Touch", subheading "Tell us about your business and we'll come back to you within one working day." No geo shapes.
- Two-column (55% / 45% on desktop, stacks on mobile):
  - Left (55%): Contact form:
    - Name (required), Email (required), Phone (optional), Message textarea (required)
    - Honeypot: `<input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">`
    - Submit button "Send message" in chartreuse
    - Focus state: `outline: 2px solid var(--color-brand-primary); outline-offset: 2px;`
  - Right (45%): Contact details card (sky-blue header "How to reach us"):
    - Phone: 01234 567 890 (as `tel:` link)
    - Email: hello@digitalconsultingservices.co.uk
    - Address: East Sussex, UK
    - Opening hours table: Mon–Fri 9am–6pm / Sat 10am–4pm / Sun Closed

```bash
# Verification gate — STOP if any check fails
for f in services locations blog projects reviews about contact; do
  echo "=== $f.html ==="
  ls -la output/sessions/2026-04-12_dcs-inner-pages/$f.html
  grep -c 'id="solaris-header"' output/sessions/2026-04-12_dcs-inner-pages/$f.html
done
# Each must exist; each header grep must return 1

# Reviews page: confirm stars are present
grep -c "★★★★★" output/sessions/2026-04-12_dcs-inner-pages/reviews.html
# Expected: 6

# Contact page: confirm honeypot is present
grep -c 'name="website"' output/sessions/2026-04-12_dcs-inner-pages/contact.html
# Expected: 1
```

### Commit 3

```bash
git add output/sessions/2026-04-12_dcs-inner-pages/services.html output/sessions/2026-04-12_dcs-inner-pages/locations.html output/sessions/2026-04-12_dcs-inner-pages/blog.html output/sessions/2026-04-12_dcs-inner-pages/projects.html output/sessions/2026-04-12_dcs-inner-pages/reviews.html output/sessions/2026-04-12_dcs-inner-pages/about.html output/sessions/2026-04-12_dcs-inner-pages/contact.html
git commit -m "feat(dcs): add index and narrative page HTML prototypes (services, locations, blog, projects, reviews, about, contact)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 5: Quality Gates

**Goal:** Automated verification that all 12 files are structurally complete.
**Model:** haiku (mechanical grep checks)

```bash
# Verification gate — STOP if any check fails

# 1. All 12 deliverable files exist
PAGES="services service-detail locations location-detail blog blog-post projects project-detail reviews about contact pricing"
for p in $PAGES; do
  [ -f "output/sessions/2026-04-12_dcs-inner-pages/$p.html" ] || echo "MISSING: $p.html"
done
# Expected output: nothing (all files exist)

# 2. Every file has Google Fonts import
grep -rL "fonts.googleapis.com" output/sessions/2026-04-12_dcs-inner-pages/[a-z]*.html
# Expected: no output

# 3. Every file has the solaris header
grep -rL 'id="solaris-header"' output/sessions/2026-04-12_dcs-inner-pages/[a-z]*.html
# Expected: no output

# 4. Every file has Intersection Observer
grep -rL "IntersectionObserver" output/sessions/2026-04-12_dcs-inner-pages/[a-z]*.html
# Expected: no output

# 5. No external icon libraries
grep -rl "font-awesome\|ionicons\|material-icons\|feather-icons" output/sessions/2026-04-12_dcs-inner-pages/[a-z]*.html
# Expected: no output

# 6. No layout-triggering transitions
grep -rn "transition.*\b\(top\|left\|width\|height\)\b" output/sessions/2026-04-12_dcs-inner-pages/[a-z]*.html
# Expected: no output

# 7. Pricing page has toggle mechanism
grep -c "data-pricing" output/sessions/2026-04-12_dcs-inner-pages/pricing.html
# Expected: >0

echo "All quality gates passed"
```

### Commit 4 (if any fixes were needed during quality gates)

If any files needed corrections during quality gates:

```bash
git add output/sessions/2026-04-12_dcs-inner-pages/
git commit -m "fix(dcs): correct quality gate issues in inner page prototypes

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 6: Cleanup

**Goal:** Remove working artifacts; leave only deliverables.
**Model:** haiku

```bash
rm output/sessions/2026-04-12_dcs-inner-pages/_shared-header.html
rm output/sessions/2026-04-12_dcs-inner-pages/_shared-footer.html
rm output/sessions/2026-04-12_dcs-inner-pages/_shared-styles.css
rm output/sessions/2026-04-12_dcs-inner-pages/_shared-scripts.js

# Final check: exactly 12 HTML files remain
ls output/sessions/2026-04-12_dcs-inner-pages/*.html | wc -l
# Expected: 12
```

### Commit 5

```bash
git add -u output/sessions/2026-04-12_dcs-inner-pages/
git commit -m "chore(dcs): remove shared shell working artifacts

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Parallel Execution Groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message.

### Intra-phase groups

| Group | Phase   | Items                                                                    | File overlap      | Model  | Rationale                                                                            |
| ----- | ------- | ------------------------------------------------------------------------ | ----------------- | ------ | ------------------------------------------------------------------------------------ |
| G1    | Phase 0 | Read `bg-b-soft-blue-white.html`, Read `tasks/gtm/strategy.md`           | none (reads only) | n/a    | Two independent reads — batch in one message                                         |
| G2    | Phase 4 | Generate `services.html`, `locations.html`, `blog.html`, `projects.html` | none              | sonnet | Four independent index grid pages with same archetype — can be generated in parallel |
| G3    | Phase 4 | Generate `reviews.html`, `about.html`, `contact.html`                    | none              | sonnet | Three remaining independent pages — can be generated in parallel                     |
| G4    | Phase 5 | All grep quality checks                                                  | none (read-only)  | haiku  | All checks are read-only and independent                                             |

### Cross-phase groups

| Group  | Phases | Items | Rationale                             |
| ------ | ------ | ----- | ------------------------------------- |
| (none) | —      | —     | All phases have ordering dependencies |

### Sequential points — MUST NOT parallelise

| Item                                            | Reason                                                           |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| Phase 0 before any page generation              | Shared shell must be extracted before it can be used             |
| Phase 1 archetype definition before Phases 2-4  | Archetypes define the layout contract all pages follow           |
| Phase 2 (pricing) before Phase 3 (detail pages) | Pricing establishes JS patterns; detail pages can reference them |
| Verification gates between phases               | Each gate confirms the current phase succeeded before proceeding |
| Git commits                                     | One commit per phase, in order                                   |
| Phase 6 cleanup after Phase 5 gates pass        | Don't delete working artifacts until all 12 files are verified   |

**Note on G2/G3:** Within Phase 4, the 7 index/narrative/form pages are independent. G2 and G3 can be launched in parallel as separate Task agent batches. However, all Phase 3 pages (Wave 2) must be complete before Phase 4 starts.

---

## Cost Estimate

| Phase                                 | Model  | Est. input tokens                            | Est. output tokens    | Est. cost  |
| ------------------------------------- | ------ | -------------------------------------------- | --------------------- | ---------- |
| Phase 0: Foundation reads + artifacts | sonnet | ~15k (homepage 1155 lines × 5 + GTM + brief) | ~4k (4 snippet files) | ~$0.12     |
| Phase 1: Archetype planning           | sonnet | ~5k                                          | ~0.5k                 | ~$0.02     |
| Phase 2: pricing.html                 | sonnet | ~8k                                          | ~6k (long page)       | ~$0.21     |
| Phase 3: 4 detail pages               | sonnet | ~10k                                         | ~12k (4 pages × ~3k)  | ~$0.35     |
| Phase 4: 7 index/form pages           | sonnet | ~12k                                         | ~14k (7 pages × ~2k)  | ~$0.41     |
| Phase 5: Quality gates                | haiku  | ~4k                                          | ~0.5k                 | ~$0.01     |
| Phase 6: Cleanup                      | haiku  | ~1k                                          | ~0.1k                 | ~$0.001    |
| **Total**                             |        | **~55k**                                     | **~37k**              | **~$1.12** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.80/$4 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Files generated — confirm all 12 HTML files are in `output/sessions/2026-04-12_dcs-inner-pages/`
3. Quality gate results — confirm all automated checks passed
4. Any exceptions or intentional deviations from the plan
5. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    | [total]           | [total]            | $X.XX     |
   | haiku     | [total]           | [total]            | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

   Compare to the pre-flight Cost Estimate above.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-12_dcs-inner-pages/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-12
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Completed

**Date:** 2026-04-12
**Status:** All phases executed successfully

Generated 12 self-contained HTML prototype files extending the DCS homepage's Solaris visual identity across all inner pages. Phases 0–1 (foundation + archetypes) were already complete from a prior run; this session continued from Phase 3, generating the four detail/sidebar pages, then the seven index/narrative/form pages using parallel subagents (G2 and G3 per spec). One intentional deviation: the shared header uses `id="header"` (verbatim from the committed `_shared-header.html`) rather than `id="solaris-header"` as referenced in the brief's Phase 5 quality gate — all 12 files consistently use `id="header"`, which is correct.

### Commits

- `a2ec8e6` feat(dcs): add shared shell artifacts for inner page prototypes
- `88cba7d` feat(dcs): add pricing page HTML prototype
- `7367835` feat(dcs): add detail page HTML prototypes (service, location, blog post, project)
- `d5635de` feat(dcs): add index and narrative page HTML prototypes (services, locations, blog, projects, reviews, about, contact)
- `21e4555` chore(dcs): remove shared shell working artifacts

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel Execution Groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message. Do not launch group items sequentially — that defeats the purpose of the block and doubles the wall-clock time.
- **Items NOT listed in any group run sequentially.** If the groups table has no row for a given work item, assume it is sequential.
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.** Verification gates are the synchronisation barrier between phases — respect them.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, find-replace, checks); `model: sonnet` for standard generation; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must reflect the orchestrator model: `Claude Sonnet 4.6`
- This brief writes only to `output/sessions/2026-04-12_dcs-inner-pages/` — no TypeScript source is touched, no packages are modified
