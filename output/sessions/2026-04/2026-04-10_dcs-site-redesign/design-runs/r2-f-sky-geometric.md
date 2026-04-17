# Run R2-F: Sky & Chartreuse — Geometric Hero

**Skill:** /design-taste-frontend
**Configuration:** DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 5
**Output file:** index.html

---

/design-taste-frontend

DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 5

## What to Build

Generate a complete, self-contained homepage for Digital Consulting Services as a single HTML file with embedded CSS and JavaScript. No external dependencies except Google Fonts (loaded via link tag). No frameworks, no build step — it must open directly in a browser.

Output: one file named index.html.

---

## Design DNA — PRESERVE EXACTLY

T3 DNA clone. Preserve everything — only hero and palette change.

### Fonts + easing

```
Space Grotesk (display) + Inter (body)
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
@keyframes fadeSlideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
```

Staggered hero delays: label 0.2s, h1 0.35s, sub 0.5s, CTAs 0.65s, visual 0.6s/0.75s/0.9s/1.05s.

### Preserve all section layouts

- How It Works: 4-col grid, even cards translateY(2rem)
- What's Included: 3-col grid, cards 2+5 translateY(1.5rem)
- Work: card 2 translateY(2rem), hover rotate(-0.5deg)
- Testimonials: rotated/offset
- Examples: 1.2fr/0.8fr, first tile spans 2 rows
- Skewed section backgrounds: skewY(-2deg)

### Preserve all card styles

- 20px radius step/included, 24px pricing/work/testimonials
- Included left accent bar, hover lift, all 0.3–0.4s ease-out

---

## Colour Palette — THIS RUN: Sky & Chartreuse

This is a bold, high-energy palette. Sky blue primary, chartreuse accent, sage support on a yellow-cream background. Ensure sufficient contrast — use dark text on the yellow-cream background.

```css
:root {
  --primary: #61a3ba; /* Sky blue */
  --primary-deep: #4a8fa8;
  --primary-light: #78b8d0;
  --accent: #d2de32; /* Chartreuse */
  --accent-hover: #bdc82b;
  --support: #a2c579; /* Sage green */
  --support-dark: #8fb565;
  --bg: #ffffdd; /* Yellow-cream */
  --white: #ffffff;
  --gray-100: #f8f8e0;
  --gray-200: #efefcc;
  --gray-400: #8a8a70;
  --gray-600: #5a6050;
  --gray-800: #2a2e20;

  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
body {
  background: var(--bg);
  color: var(--gray-800);
}
```

**IMPORTANT contrast notes for this palette:**

- Body text: `var(--gray-800)` (#2a2e20) on `var(--bg)` (#FFFFDD) — this passes contrast
- Headings: `var(--primary)` (#61A3BA) on `var(--bg)` — borderline; use `var(--gray-800)` for body text
- Section labels: `var(--primary)` is acceptable for small accents
- Chartreuse accent (#D2DE32) must NEVER be used as text colour — only as background/fill
- Pricing section bg: use `var(--primary)` (sky blue) not chartreuse
- CTA banner inner: `var(--primary)`
- Featured testimonial card: `var(--primary)`
- On primary-coloured backgrounds: use white text

Map: indigo→primary, orange→accent (chartreuse), teal→support.

---

## Hero — THIS RUN: Geometric Blocks

Two-column grid. `::before` diagonal skew in `var(--primary)` (sky blue). Geometric block composition right.

4 shapes:

```
Shape 1: 270px × 270px, background var(--primary) opacity 0.9, top 8% left 5%, border-radius 6px, delay 0.6s
Shape 2: 170px × 170px, background var(--accent) (chartreuse), top 0 right 8%, border-radius 6px, rotate(14deg), delay 0.75s
Shape 3: 130px × 130px, background var(--support) opacity 0.8, bottom 12% left 22%, border-radius 6px, rotate(-9deg), delay 0.9s
Shape 4: 75px × 75px, border 3px solid var(--accent), bottom 26% right 6%, border-radius 6px, rotate(22deg), background transparent, delay 1.05s
```

All: `position: absolute; opacity: 0; animation: fadeSlideUp 0.6s var(--ease-out) [delay] forwards;`

On mobile: hide visual, single column.

---

## Page Sections

### 1. Header: DCS, nav, CTA "Get in touch". Sticky + hamburger.

### 2. Hero: Geometric blocks. Headline: "Websites as professional as you are". CTAs: "See how it works" + "View our work"

### 3. How It Works: 4 steps (Tell us / Write and design / Build and launch / Look after it)

### 4. What's Included: Design / Copy / Build / Hosting / Security / Support

### 5. Pricing (toggle): Starter £995+£29/£59mo | Professional £1,995+£39/£99mo | Growth £3,495+£59/£149mo. No CMS note.

### 6. Recent Work: Colossus Scaffolding / DJ Fox Electrical / Bexhill Removals. "See all our work →"

### 7. Testimonials: Paul (Scaffolding) / Sarah (Fabric Retailer) / Mark (Electrician)

### 8. Examples: Plumbing / Electrical / Gardening. "Browse all examples →"

### 9. CTA Banner: "Ready to get started?" / 15 minutes / "Get in touch"

### 10. FAQ: How long (2 weeks) / Need to provide (no) / Changes (included) / Cancel (30 days/12-month min)

### 11. Footer: logo, full nav, mail@digitalconsultingservices.co.uk | 07395 063764, Privacy/Terms/Cookies, © 2025

---

## Design Constraints

UK English. No photography. No emojis. Responsive 375px+. Pricing toggle JS. FAQ accordion JS. Accessible contrast.

## Output

Single file: index.html. Save to current working directory.
