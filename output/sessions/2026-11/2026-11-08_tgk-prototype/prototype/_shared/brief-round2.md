# Round 2 — read this AFTER brief.md. Where they conflict, THIS file wins.

Ricky reviewed round 1 and said: (1) too many words and not enough imagery, services listed like a menu (the nav dropdown is the menu), "visual is what matters" for a graphics business; (2) **cardinal rule: on desktop each section — the hero above all — must fit inside the viewport height. Sections must not scroll past the fold.** Stacking and taller sections are acceptable on mobile only.

## Rule 1 — images carry the page

Real imagery is now available in `../_shared/img/` (relative to your folder: `../_shared/img/web/<name>.jpg`, 1800px wide, 3:2 unless stated; `van.jpg` is 16:9). These are AI-generated mock-ups showing the Graphic Kings logo applied to each product — NOT photos of real client work. Everywhere they appear, the page must make that honest with one small, tasteful line or tag near the first use ("Illustrative mock-ups — real project photos to come") so no one can mistake them for finished jobs. Do not copy them anywhere else; reference them via the relative path.

Mapping (use whichever fit your direction; every one of the 7 categories must show a picture):

- Vehicle graphics: `van.jpg`, `fleet.jpg`, `magnetic.jpg`
- Signs & signage: `shopfront.jpg`, `signs.jpg`, `hoarding.jpg`
- Banners: `banner.jpg`, `rollerbanners.jpg`
- Large format, window & wall: `window.jpg`, `wall.jpg`, `floor.jpg`
- Stickers & labels: `stickers.jpg`
- Print & stationery: `print.jpg`
- Design: `design.jpg`

Replace the text-ledger services block with **image-led service cards** (category image, category name, 2-4 example services as a short line, an arrow). Keep copy short: headline + one line per section is the target. No paragraphs of explanation. Mobile can stack. Keep every other round-1 content rule (no invented testimonials/prices/stats, no full wraps note, TCK cross-link, honest placeholders for reviews).

## Rule 2 — sections fit the viewport (desktop)

- The goal is that every top-level section's rendered height is **≤ the viewport height**. Design each section to fit within `100svh` (allow for a sticky header if you use one) at **1440x900 and 1280x720**. Use `height`/`max-height` with `svh` units plus tighter type and layouts, or split a long section into two sections.
- 7 service cards on one desktop viewport means a compact card grid or a horizontal scroller/snap row inside the viewport — design it deliberately; do not let it run to two screens of cards.
- The 19 areas, why-us, recent work, quote band and footer each fit within a viewport too.
- Total page can be long (many sections), but no single section exceeds the viewport on desktop. Use CSS `scroll-snap` only if it genuinely helps; never trap scrolling.
- **Verify by measuring**: with Playwright, at 1440x900 and 1280x720, assert for every `section`/`header`/`footer` that its `getBoundingClientRect().height <= window.innerHeight + 1`, and report the table (section, height, viewport, pass/fail) in your NOTES.md. Fix failures before reporting. On 390x844 mobile this check is not required, but also check no horizontal overflow.
- Hero: must show headline, one primary CTA and an image **fully within the first viewport at 1440x900 and 1280x720**, with the next section's edge optionally peeking.

Image weight: the web jpgs are ~300-530KB each; use `loading="lazy"` and explicit `width`/`height` below the fold, and `fetchpriority="high"` on the hero image.
