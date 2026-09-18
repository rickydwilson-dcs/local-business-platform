# The inner-page bar is 81px, not 74.5px — and `.detail{top:120px}` is correct

**Resolved 2026-09-18, by measurement.** Raised by Agent G, which reported 81px against the
wave 2 brief's 74.5px and said "anyone about to rely on 74.5px should measure first." It was
right. This note exists because the stale figure had propagated into four documents and was
one edit away from being "fixed" into a real bug.

## What the handoff claimed

> `.detail{top:120px}` (`kit.css:732`) hardcodes an offset for an 81px bar; the inner-page
> bar measures **74.5px at 1440 and 65px at 390**.

Listed under "redundant CSS left for a single tidy pass" — i.e. queued as something to correct.

## What is actually true

Measured in a real 1440-wide iframe, at 1:1, on five approved wave 1 pages
(`service-detail`, `services-list`, `pricing`, `projects-list`, `about`) plus Agent G's
`locations-list`. **Every one returns a bar of exactly 81.00px.**

| Page                            | Bar at 1440 |
| ------------------------------- | ----------- |
| `service-detail.html`           | 81.00px     |
| `services-list.html`            | 81.00px     |
| `pricing.html`                  | 81.00px     |
| `projects-list.html`            | 81.00px     |
| `about.html`                    | 81.00px     |
| `locations-list.html` (Agent G) | 81.00px     |

## Why it changed — the causal chain

The bar is `padding: clamp(11px,1.5vw,17px)` + its tallest child + a 1px bottom rule. At 1440
the padding clamps to 17px. The tallest child is what moved:

| State                 | Tallest child in `.bar__r`                                                                          | Arithmetic         | Bar        |
| --------------------- | --------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| **Before Decision 5** | `.hire` at 39.5px — burger was `display:none` at desktop                                            | 17 + 39.5 + 17 + 1 | **74.5px** |
| **After Decision 5**  | `.burger` at 46px — `clamp(40px,3.4vw,46px)`, and 3.4vw = 48.96 at 1440, so it pins to the 46px cap | 17 + 46 + 17 + 1   | **81px**   |

Confirmed against the two stylesheets directly:

- `kit.css.pre-phase4.bak:1195` — `.bar .burger{display:none}`
- `kit.css:1246` — `.bar .burger{display:grid}`

**So the 74.5px measurement was correct when it was taken.** `notes-c.md` §13 and `notes-d.md`
both recorded it honestly, before the burger-at-every-width ruling. Decision 5 — Ricky's own
call, made later in the same session — invalidated it, and the handoff carried the pre-decision
number forward without re-measuring. This is a decision silently changing a measurement taken
under the old regime, not anybody's error.

## The consequence, which is the opposite of the queued fix

`.detail{top:120px}` was written against an 81px bar. The inner-page bar **is now 81px**, the
same as the homepage's. The mismatch the handoff describes **no longer exists**, so:

- **Strike the tidy-up item. Do not change `top:120px`.** Re-basing it on 74.5px would have
  introduced a 6.5px error against every sticky detail pane on the site.
- The 39px gap between the 81px bar and the 120px offset is deliberate breathing room, not a
  miscalculation.

## The 65px mobile bar does not matter

The bar is genuinely 65px at 390 — but `.detail` computes `position: static` there, so
`top:120px` never applies. Measured on `pricing.html`:

| Width | Bar  | `.burger` | `.detail` position | `top`         |
| ----- | ---- | --------- | ------------------ | ------------- |
| 1440  | 81px | `grid`    | `sticky`           | 120px         |
| 390   | 65px | `grid`    | `static`           | 120px (inert) |

## What still stands from that tidy-up list

Unaffected by this correction, still worth doing at the Phase 4 merge:

- `kit.css:931` and §34 both still hide `.bar nav` at a breakpoint, for a nav hidden at all widths.
- `.panel--tight` (`kit.css:344`) duplicates `.mast`.
- The five wave 1 `kit-additions-*.css` files are orphaned — merged, and no page links them.
- Five stray harness files in `prototype/` (`_a_harness`, `_d_harness`, `_harness-b`,
  `_harness-b390`, `_harness-e`) plus wave 2's three.

## The general lesson

A measurement is only valid under the configuration it was taken in. Decision 5 changed the
chrome at every width, and every number measured before it needs re-taking rather than
inheriting. The wave 1 notes are trustworthy about _when_ they measured; the handoff lost that
context when it summarised them.
