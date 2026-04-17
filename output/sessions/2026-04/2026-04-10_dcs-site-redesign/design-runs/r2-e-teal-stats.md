# Run R2-E: Warm Teal & Coral — Stats Hero

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

Staggered hero delays: label 0.2s, h1 0.35s, sub 0.5s, CTAs 0.65s, stats 0.6s/0.75s/0.9s.

### Section layouts (preserve all)

- How It Works: 4-col grid, even cards translateY(2rem)
- What's Included: 3-col grid, cards 2+5 translateY(1.5rem)
- Work: card 2 translateY(2rem), hover rotate(-0.5deg)
- Testimonials: rotated/offset cards
- Examples: 1.2fr/0.8fr asymmetric, first tile 2 rows
- Section skew backgrounds: skewY(-2deg)

### Cards (preserve all)

- 20px radius step/included, 24px pricing/work/testimonials
- Included: left accent bar 0→100% on hover
- Hover: 0.3–0.4s var(--ease-out)

---

## Colour Palette — THIS RUN: Warm Teal & Coral

```css
:root {
  --primary: #537d96;
  --primary-deep: #3d6070;
  --primary-light: #6b9ab5;
  --accent: #ec8f8d;
  --accent-hover: #d97a78;
  --support: #44a194;
  --support-dark: #349587;
  --bg: #f4f0e4;
  --white: #ffffff;
  --gray-100: #f0ece0;
  --gray-200: #e4dfd0;
  --gray-400: #9a9590;
  --gray-600: #6b6560;
  --gray-800: #2c2820;

  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
body {
  background: var(--bg);
}
```

Map: indigo→primary, orange→accent, teal→support, cream→bg.
Pricing section + CTA banner inner + featured testimonial: `var(--primary)`.

---

## Hero — THIS RUN: Stats Column

Two-column grid. `::before` diagonal skew in `var(--primary)`. Right column shows bold stat stack on dark background.

```html
<div class="hero-stats">
  <div class="hero-stat">
    <span class="stat-number">47</span>
    <span class="stat-label">Sites live</span>
  </div>
  <hr class="stat-divider" />
  <div class="hero-stat">
    <span class="stat-number">11 days</span>
    <span class="stat-label">Average setup</span>
  </div>
  <hr class="stat-divider" />
  <div class="hero-stat">
    <span class="stat-number">94%</span>
    <span class="stat-label">Client retention</span>
  </div>
</div>
```

```css
.hero-stats {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
}
.hero-stat {
  padding: 1.5rem 0;
  opacity: 0;
}
.hero-stat:nth-child(1) {
  animation: fadeSlideUp 0.6s var(--ease-out) 0.6s forwards;
}
.hero-stat:nth-child(3) {
  animation: fadeSlideUp 0.6s var(--ease-out) 0.75s forwards;
}
.hero-stat:nth-child(5) {
  animation: fadeSlideUp 0.6s var(--ease-out) 0.9s forwards;
}
.stat-number {
  display: block;
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--white);
  line-height: 1;
  letter-spacing: -0.03em;
}
.stat-label {
  display: block;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--support);
  margin-top: 0.4rem;
}
.stat-divider {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin: 0;
  opacity: 0;
}
.stat-divider:nth-child(2) {
  animation: fadeSlideUp 0.3s ease 0.65s forwards;
}
.stat-divider:nth-child(4) {
  animation: fadeSlideUp 0.3s ease 0.8s forwards;
}
```

Hide stats on mobile, single column layout.

---

## Page Sections

### 1. Header: DCS logo, nav (Services, Our Work, Examples, About, Blog), CTA "Get in touch". Sticky + hamburger.

### 2. Hero: "Websites as professional as you are" / stats column visual

### 3. How It Works: 4 steps

### 4. What's Included: 6 items

### 5. Pricing: 3 tiers, toggle (Starter £995+£29 / £59mo; Professional £1,995+£39 / £99mo; Growth £3,495+£59 / £149mo)

### 6. Recent Work: Colossus Scaffolding, DJ Fox Electrical, Bexhill Removals

### 7. Testimonials: Paul / Sarah / Mark

### 8. Examples preview: Plumbing / Electrical / Gardening

### 9. CTA Banner: Ready to get started? 15 minutes.

### 10. FAQ: 4 questions (how long / need to provide / changes / cancel)

### 11. Footer: logo, nav, contact (mail@digitalconsultingservices.co.uk | 07395 063764), legal, © 2025

---

## Design Constraints

UK English. No stock photography. No emojis. Mobile responsive (375px). Pricing toggle JS. FAQ accordion JS. Accessible.

## Output

Single file: index.html. Save to current working directory. No supporting files.
