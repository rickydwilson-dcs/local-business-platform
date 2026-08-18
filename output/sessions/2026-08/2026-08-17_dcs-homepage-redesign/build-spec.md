# DCS Homepage Prototypes — Build Spec

Applies to every one of the twelve prototype files. Read this **and**
`content-brief.md` before writing a line of markup.

---

## Output

One file, written to:

```
output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/<your-filename>.html
```

Absolute path root: `/Users/rickywilson/Sites/local-business-platform/`

It is a **complete, standalone homepage** — full `<!DOCTYPE html>` document, opened
directly from disk with `file://`. Not a fragment, not a React component, not a
placeholder-riddled sketch. Every section fully written with real copy.

## Self-contained

- All CSS inline in a single `<style>` block in `<head>`. No external stylesheet files.
- All JS inline in `<script>` at the end of `<body>`.
- **No local image files.** There is no photography for this site. Build every visual out
  of CSS, SVG, gradients, canvas, or type. Mock browser frames containing miniature
  CSS-drawn site layouts are a strong pattern for a web agency portfolio — use them.
- The only local asset available is the DCS logo: `assets/logo.svg` (600×300, a raster
  image embedded in an SVG wrapper — treat it as a logo lockup image with transparent
  background; it reads as dark artwork, so on a dark background either place it on a light
  chip/plate or set an appropriate filter). You may also set the brand as pure type instead
  of using the logo file if the direction calls for it.
- Google Fonts via `<link>` in `<head>` is allowed and encouraged.
- Motion libraries via CDN (`gsap`, `motion` / Motion One, `lenis`) are allowed **if** the
  page still looks and works correctly when the CDN fails. Guard every use.
- No build step, no bundler, no framework.

## Quality bar

This is a **web design agency's own homepage**. The single job of these prototypes is to
prove DCS can design. Anything that reads as a stock Bootstrap/Tailwind-default landing
page is a failed prototype. Specifically avoid:

- Centred hero + subhead + two pill buttons + three equal feature cards with circle icons.
- Purple-to-blue gradient on white. Generic soft drop shadows on everything.
- Inter/Poppins/Roboto at default weights with no typographic contrast.
- Emoji as icons. Lorem ipsum. `<!-- TODO -->`. Truncated sections.

Do bring: a real type system with genuine scale contrast, a deliberate colour system, an
opinionated grid (asymmetry, overlap, editorial rhythm), considered spacing, real
micro-detail (borders, rules, numbering, captions, states), and motion that has a point.

## Responsive

Must work at 1440px, 1024px, 768px and 390px. Test the breakpoints mentally section by
section — no horizontal scroll on mobile, no 8px text, tap targets ≥ 44px.

## Motion

Round 1 is HTML, but these directions are going to be rebuilt in React with a real motion
library later, so **motion is part of the design, not a garnish**. Include at least:

- Scroll-reveal on major sections (IntersectionObserver, staggered).
- One signature moment unique to this direction — a hero build-in, a marquee, a scroll-
  driven transform, a magnetic/hover state, a number count-up, a sticky pinned sequence.
- Considered hover/focus states on every interactive element.

Wrap all of it in `@media (prefers-reduced-motion: reduce)` handling: motion off, content
still fully visible. Never gate content visibility on JS alone — if the script never runs,
the page must still be readable (e.g. add the reveal class only after JS confirms support,
or set the hidden state from JS).

## Accessibility

Semantic landmarks (`header`/`nav`/`main`/`section`/`footer`), one `h1`, sensible heading
order, `alt` text, visible focus rings, WCAG AA contrast on body text. A dark, moody
direction is fine — illegible body copy is not.

## Header / footer

Every prototype needs a working site header (logo/wordmark, the five nav items, primary
CTA) and a full footer (services, service areas, contact details, copyright
"© 2026 Digital Consulting Services"). Mobile nav should open and close for real.

## Freedom

Colour, type, layout, section order, section invention, and voice within the brief's tone
are **entirely yours**. Ignore the current DCS site. Ignore the platform's theme tokens.
Ignore any house style. The point of running twelve directions is that they should be
genuinely, obviously different from one another — not twelve recolours of the same layout.

## Length

Expect roughly 600–1200 lines. If it's under 400 you have almost certainly under-built it.

## Self-check before you finish

1. Open the file's structure in your head at 390px wide — does anything break?
2. Are all prices, client names and testimonials exactly as the content brief states them?
3. Is there a single placeholder, TODO, lorem, or empty `href="#"` on a primary CTA?
4. Would a stranger looking at this believe the agency that made it is expensive?

## Report back

Return a short summary only: filename, direction name, the one-line pitch, the palette
(hex), the fonts, and the signature motion moment. Do not paste the HTML.
