# Run R2-A: Sage & Black — Geometric Hero

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

This is a T3 DNA clone. Every design decision below must be followed precisely. Only the hero and colour palette differ from the T3 baseline.

### Fonts

```
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap
--font-display: 'Space Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
```

### Easing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

### Animation keyframes

```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

All hero elements animate in with staggered delays using fadeSlideUp 0.6s var(--ease-out):

- Hero label: delay 0.2s
- H1: delay 0.35s
- Subheading: delay 0.5s
- CTAs: delay 0.65s
- Hero visual: delay 0.6s, 0.8s, 1s (staggered per element)

### Section layout patterns (keep all of these)

- How It Works: 4-column grid, even cards offset down `transform: translateY(2rem)`
- What's Included: 3-column grid, cards 2 and 5 offset down `transform: translateY(1.5rem)`
- Work cards: card 2 offset down `transform: translateY(2rem)`, hover adds `rotate(-0.5deg)`
- Testimonials: card 1 `rotate(-1.5deg)`, card 2 `translateY(1.5rem) rotate(0.5deg)`, card 3 `rotate(1deg)`
- Examples: asymmetric grid `grid-template-columns: 1.2fr 0.8fr` with first tile spanning 2 rows

### Card styles (keep all of these)

- Border radius: 20px on step/included cards, 24px on pricing/work/testimonial cards
- Included cards: left accent bar (4px wide, height animates 0→100% on hover)
- Step cards: soft shadow on hover `0 20px 50px rgba(0,0,0,0.08)`
- Work card hover: `translateY(-8px) rotate(-0.5deg)`
- Skewed section backgrounds: `skewY(-2deg)` pseudo-elements

### Hover interactions (keep all)

- Nav links: underline draws in from left
- Step cards: translateY(-6px) + shadow
- Included cards: translateY(-4px) + left accent bar animates to full height
- Work cards: translateY(-8px) + rotate(-0.5deg)
- All transitions: 0.3–0.4s var(--ease-out)

---

## Colour Palette — THIS RUN: Sage & Black

Replace ALL colour variables with these values. Use these everywhere the T3 used indigo/orange/teal.

```css
:root {
  /* Palette */
  --primary: #1b1b1b; /* Eerie Black — main brand colour, replaces indigo */
  --primary-deep: #0a0a0a; /* Deeper black for hover states */
  --primary-light: #2d2d2d; /* Lighter black for hover */
  --accent: #595f39; /* Muted Moss — replaces orange */
  --accent-hover: #4a5030;
  --support: #c4c5ba; /* Sophisticated Sage — replaces teal */
  --support-dark: #b0b1a6;
  --bg: #e4e4de; /* Ethereal Ivory — main background */
  --white: #ffffff;
  --gray-100: #ededea;
  --gray-200: #dededb;
  --gray-400: #9a9a95;
  --gray-600: #5a5a54;
  --gray-800: #2a2a25;

  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
body {
  background: var(--bg);
}
```

Wherever T3 used `var(--indigo)`, use `var(--primary)`.
Wherever T3 used `var(--accent)` (orange), use `var(--accent)` (moss).
Wherever T3 used `var(--teal)`, use `var(--support)`.
Wherever T3 used `var(--cream)`, use `var(--bg)`.

The pricing section background should be `var(--primary)` (Eerie Black).
The CTA banner inner should be `var(--primary)`.
The featured testimonial card should be `var(--primary)`.

---

## Hero — THIS RUN: Geometric Blocks

The hero uses a two-column grid (text left, visual right), same as T3. The `::before` diagonal skew background shape is kept. Replace the floating cards with a geometric block composition.

### Hero visual (right column)

Create a `hero-visual` div containing a `hero-geometric` div (relative positioned, ~460px max-width, aspect-ratio 4/3).

Inside it, place 4 absolutely-positioned geometric shapes:

```
Shape 1: 280px × 280px square, background var(--primary) at 90% opacity, top: 10%, left: 5%, border-radius: 4px
Shape 2: 180px × 180px square, background var(--accent), top: 5%, right: 10%, border-radius: 4px, transform: rotate(12deg)
Shape 3: 140px × 140px square, background var(--support) at 60% opacity, bottom: 15%, left: 20%, border-radius: 4px, transform: rotate(-8deg)
Shape 4: 80px × 80px square, border: 3px solid var(--accent), bottom: 25%, right: 5%, border-radius: 4px, transform: rotate(20deg), background: transparent
```

Each shape should animate in with fadeSlideUp at staggered delays (0.6s, 0.75s, 0.9s, 1.05s).

On mobile (max-width: 768px): hide hero visual, make hero single column.

### Hero text adjustments for this palette

- H1 colour: `var(--primary)`
- The `em::after` underline: `background: var(--accent); opacity: 0.3`
- Hero label: `color: var(--accent)`
- Hero subheading: `color: var(--gray-600)`
- Primary CTA: `background: var(--primary)`
- Secondary CTA (outline): `border-color: var(--primary); color: var(--primary)`

On mobile when the skew bg covers the text area: `h1 { color: var(--white) }`, subheading `rgba(255,255,255,0.85)`.

---

## Business Context

Company: Digital Consulting Services
Owner: Ricky Wilson
Tagline: Websites as professional as you are
URL: www.digitalconsultingservices.co.uk

Digital Consulting Services gets small businesses and tradespeople online. Ricky does all the work personally — nothing is outsourced. The result is agency-quality output with personal service. Clients do as little as possible; Ricky handles design, copy, hosting, and everything else.

---

## Target Audience

UK tradespeople and local service businesses: plumbers, electricians, builders, scaffolders, gardeners, decorators. Time-poor, not technical, have a real business but no website or an embarrassing outdated one. Price-conscious but will pay for something professional that is looked after long-term.

---

## Page Sections (in order)

Build all of these sections.

### 1. Header / Navigation

- Logo: "DCS" wordmark (typographic, no image needed)
- Nav links: Services, Our Work, Examples, About, Blog
- Primary CTA button: "Get in touch"
- Sticky on scroll, mobile hamburger

### 2. Hero

- Headline: Websites as professional as you are
- Subheading: You tell us about your business. We handle design, copy, hosting, and everything else.
- Primary CTA: "See how it works"
- Secondary CTA: "View our work"
- Supporting visual: geometric blocks as described above

### 3. How It Works (4 steps)

- Tell us about your business — A short conversation. No briefs, no spec documents.
- We write and design it — Copy, images, layout — all handled.
- We build and launch it — Fast, secure, and found on Google from day one.
- We look after it — Hosting, updates, and support. Nothing for you to manage.

### 4. What's Included (feature grid, 6 items)

- Design — A site that looks the part, built around your brand.
- Copy — We write every word. You just check it reads like you.
- Build — Fast, mobile-friendly, and secure as standard.
- Hosting — We manage it. No control panels, no technical decisions.
- Security — Backups, SSL, and updates handled automatically.
- Support — Something needs changing? Just ask.

### 5. Pricing (3 tiers with payment toggle: Upfront vs Monthly)

Starter

- Upfront: £995 setup + £29/month
- Monthly (no setup): £59/month, 12-month minimum
- For tradespeople who want a professional site and to be found on Google

Professional

- Upfront: £1,995 setup + £39/month
- Monthly (no setup): £99/month, 12-month minimum
- Everything in Starter, plus: blog (we write it), portfolio section, reviews page, Google My Business guidance

Growth

- Upfront: £3,495 setup + £59/month
- Monthly (no setup): £149/month, 12-month minimum
- Everything in Professional, plus: monthly analytics report, Google Ads setup, priority support

Small print: All sites include full service and location pages, local SEO, custom domain, SSL, and hosting. No CMS — content updates go through us.

### 6. Recent Work (3 portfolio cards)

- Colossus Scaffolding — Scaffolding company. Professional site with full service and location coverage.
- DJ Fox Electrical — Electrician. Bold design with clear contact CTAs and service area pages.
- Bexhill Removals — Removals company. Simple, clean, and effective.
- Link: "See all our work →"

### 7. Testimonials (3)

- "Ricky handled everything. I didn't have to think about it — the site just appeared and it was exactly right." — Paul, Scaffolding Contractor
- "I've had my site with Ricky for five years. Any time I need a change, it's done the same day." — Sarah, Fabric Retailer
- "I was embarrassed by my old website. Now I'm proud to hand my card out." — Mark, Electrician

### 8. See What's Possible (examples preview, 3 tiles)

- Plumbing site example
- Electrical site example
- Gardening site example
- Link: "Browse all examples →"

### 9. CTA Banner

- Heading: Ready to get started?
- Subtext: It takes about 15 minutes to tell us what you need. We handle everything from there.
- CTA: "Get in touch"

### 10. FAQ (4 questions)

- How long does it take? — Most sites are live within 2 weeks of our first conversation.
- Do I need to provide anything? — Just answer our questions. We write the copy, sort the images, and make all the design decisions.
- What if I want changes after it's live? — Content updates are included in your monthly fee. Just send us a message.
- What happens if I want to cancel? — Upfront clients own the relationship with no lock-in. Pay-monthly clients have a 12-month minimum, then 30 days notice to cancel.

### 11. Footer

- Logo + short strapline: "Professional websites for UK tradespeople and small businesses."
- Nav: Services, Our Work, Examples, About, Blog, Contact, FAQ
- Contact: mail@digitalconsultingservices.co.uk | 07395 063764
- Legal: Privacy Policy, Terms, Cookies
- Copyright: © 2025 Digital Consulting Services

---

## Design Constraints

- UK English throughout (colour, not color)
- No stock photography — use geometric shapes, bold typography, or abstract visuals
- No emojis
- Mobile responsive — must work at 375px width
- The pricing toggle (upfront vs monthly) must be interactive JavaScript
- FAQ accordion must be interactive JavaScript
- Portfolio cards and example tiles are static (no filtering needed on the homepage)
- Accessible: sufficient colour contrast, semantic HTML, descriptive alt text

---

## Output

Single file: index.html
Save to the current working directory.
Do not create supporting files, do not use a build step.
