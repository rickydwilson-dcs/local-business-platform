# Run R2-H: Citrus — Stats Hero

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

### Preserve all section layouts

- How It Works: 4-col grid, even cards translateY(2rem)
- What's Included: 3-col grid, cards 2+5 translateY(1.5rem)
- Work: card 2 translateY(2rem), hover rotate(-0.5deg)
- Testimonials: rotated/offset
- Examples: 1.2fr/0.8fr, first tile 2 rows
- Skewed backgrounds: skewY(-2deg)

### Preserve all card styles

- 20px radius step/included, 24px pricing/work/testimonials
- Included left accent bar, hover lift

---

## Colour Palette — THIS RUN: Citrus

```css
:root {
  --primary: #1a1a1a;
  --primary-deep: #0a0a0a;
  --primary-light: #2d2d2d;
  --accent: #ff6b00;
  --accent-hover: #e05f00;
  --support: #7cb518;
  --support-dark: #6ba015;
  --bg: #fdf0e8;
  --white: #ffffff;
  --gray-100: #f8ebe0;
  --gray-200: #f0ddd0;
  --gray-400: #9a9590;
  --gray-600: #5a5450;
  --gray-800: #2a2420;

  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
body {
  background: var(--bg);
}
```

Map: indigo→primary, orange→accent (tangerine), teal→support (lime).
Pricing bg + CTA banner + featured testimonial: `var(--primary)`.

---

## Hero — THIS RUN: Stats Column

Two-column grid. `::before` diagonal skew in `var(--primary)` (near-black). Stats displayed on dark background.

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
  padding: 2rem;
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
  color: var(--accent);
  margin-top: 0.4rem;
}
.stat-divider {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
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

Note: use `var(--accent)` (tangerine) for stat labels — vibrant against near-black background.

Hide stats on mobile, single column.

---

## Page Sections

### 1. Header: DCS, nav, CTA. Sticky + hamburger.

### 2. Hero: Stats column. "Websites as professional as you are". CTAs: "See how it works" + "View our work"

### 3. How It Works: 4 steps

### 4. What's Included: 6 items

### 5. Pricing (toggle): Starter £995+£29/£59mo | Professional £1,995+£39/£99mo | Growth £3,495+£59/£149mo

### 6. Recent Work: Colossus / DJ Fox / Bexhill Removals

### 7. Testimonials: Paul / Sarah / Mark

### 8. Examples: Plumbing / Electrical / Gardening

### 9. CTA Banner: Ready to get started? / Get in touch

### 10. FAQ: 4 questions

### 11. Footer: full nav, contact, legal, © 2025 Digital Consulting Services

---

## Design Constraints

UK English. No photography. No emojis. Responsive 375px+. Pricing toggle JS. FAQ accordion JS. Accessible contrast.

## Output

Single file: index.html. Save to current working directory.
