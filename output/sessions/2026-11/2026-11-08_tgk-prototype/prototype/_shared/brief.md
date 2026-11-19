# The Graphic Kings — homepage prototype brief (round 1)

You are designing ONE homepage direction for **The Graphic Kings** (rebrand of Mad Graphics), a vehicle-graphics / signage / banner / print & design business in Polegate, East Sussex. Sister brands: The Tape Kings (blue crown) and The Clothing Kings (yellow crown). The Graphic Kings crown is **red**.

Output: a static, self-contained prototype in YOUR direction folder only: `index.html` (+ optional `styles.css`, `app.js`). Plain HTML/CSS/JS, no build step, no frameworks. Google Fonts via `<link>` is fine. Reference the logo as `../_shared/tgk-logo.svg` (transparent background; white script, black outline, red crown — it needs a surface where the white halo reads).

Do NOT write outside your folder. Do NOT run git. Do NOT touch `sites/`.

## Process

1. Load the `impeccable` skill first, plus `ui-ux-pro-max` and `design-taste-frontend` (use others if relevant). Follow their guidance to make real design decisions, not generic ones.
2. Read your direction below. Then build the homepage.
3. If you can render screenshots (for example Playwright from `~/Sites/ttk/node_modules`, or Chrome tools), check 1440px and 390px, fix horizontal overflow and anything broken. If you cannot, say so plainly in your report. Never trigger browser alert/confirm dialogs.
4. Finish with a short `NOTES.md` in your folder: the concept in 3 lines, tokens used (hex values), fonts, contrast ratios for every text/accent pairing you used (numbers, WCAG), what you'd change next, and anything you could not verify.

## Content rules (important)

- Use the real facts in `content.md` (same folder). Write fresh, specific, human copy; do not paste the old templated copy.
- **Never invent**: testimonials, client names, prices, statistics, awards, photos of real work, or years beyond "Est. 2004" (needs client confirmation; mark it). Where a real item is missing, show an honest, clearly styled placeholder such as "Project photo — to come" or "Client review — to come", not fake content.
- No images exist yet. Build visual interest from type, colour, layout, SVG and CSS. Do not hotlink stock photos.
- State plainly, somewhere sensible: **no full vehicle wraps** are offered (partial/lettering/livery graphics only).
- Clothing and workwear are NOT offered; include a small, tasteful "Clothing & workwear → The Clothing Kings" cross-link (use `#` as href).
- Primary action everywhere: get a free quote / call 01323 589 700.

## Colour rules

- The red is **#DD201B** (sampled from the logo photo; use exactly, do not reinterpret). Black from the logo is **#160E0B**. The user is colourblind: do not recolour by eye; report contrast as numbers and flag any accent-on-background pairing below 4.5:1 for text (or 3:1 for large text/UI).
- Use CSS custom properties with the `--tgk-` prefix for all tokens, defined once on `:root`. No hardcoded hex outside the token block.

## Page requirements (homepage only)

Header with logo, primary nav (Services, Areas, About, Contact) and phone/quote CTA; a hero; the 7 service categories with a few example services each (link to `#`); a "why us" section built only from real facts (in-house design, UV-rated materials, free quotes, Est. 2004 [confirm]); areas served; an honest placeholder for recent work and for reviews; a quote CTA band; footer with contact details, hours, areas, TCK cross-link. Mobile nav that works (no JS framework; a simple accessible disclosure is fine; do NOT nest a `position: fixed` overlay inside an element with `backdrop-filter` or `transform`).
Accessibility: semantic landmarks, one `h1`, visible focus states, `prefers-reduced-motion` respected, alt text/title for the logo.
Performance: no autoplay video, no heavy libraries.

## Fonts

Choose deliberately for your direction. (Direction B must use Barlow Condensed + Barlow to match TTK.) If you use a display face with a thousands-comma figure anywhere, do not use tabular-nums or a monospace face on it.
