# Reference read — kota.co.uk

Ricky's note: _"This was more what I was looking for. In your face; possibly overly
animated and powerful use of colour and typography."_

Inspected directly at 1440×900 on 2026-08-17. Measurements below are read from the live
page (computed styles and DOM), not from memory.

---

## What was actually measured

|               |                                                                              |
| ------------- | ---------------------------------------------------------------------------- |
| Typeface      | **PP Neue Montreal** (`__montreal`) — one family for everything, weight 400  |
| Display sizes | **152.64px** and 144px at 1440 wide                                          |
| Ground        | `#EFEFEF`                                                                    |
| Panels        | pure white, pure black                                                       |
| Accent panels | ice `#A8E1EC` · lilac `#C4B5F3` · cream `#F8E5CB`                            |
| Corner radii  | `10px 100px 10px 10px` · `20px 200px 20px 20px` · `0 200px 0 0` · `34px 0 0` |
| Smooth scroll | **Lenis**                                                                    |
| Also present  | `<canvas>`, `<video>`                                                        |
| Page height   | 16,180px                                                                     |

## Where the "in your face" actually comes from

Worth being precise, because the obvious reading is wrong. The page is **not** loud in
colour — its base is grey, black and white, and the accents are soft pastels. What makes it
assertive is:

1. **Type scale.** A 152px headline at 1440 is roughly 10% of the viewport height per line.
   Headlines occupy the screen rather than sitting on it.
2. **One family, one weight.** No serif/sans pairing, no weight contrast games. Confidence
   comes from scale alone.
3. **Per-character motion.** Letters arrive individually at different speeds and opacities —
   the "OUR RESULTS" heading was mid-assembly with each glyph at a different stage. This is
   the "overly animated" quality.
4. **Text resolving grey → black** on scroll, so copy appears to develop rather than fade.
5. **Stacking panels.** Each section is a big rounded panel that slides up over the previous
   one. Sections overlap; the page feels like a deck being dealt.
6. **Hard light ↔ dark cuts.** A full-viewport pastel gradient bloom butts straight into
   pure black with no transition.
7. **Iridescent grain blooms** — huge, soft, grainy gradient fields (pink/blue/lilac/peach)
   used as atmosphere, sometimes filling an entire viewport with no text at all.
8. **Persistent floating CTAs.** "Hire us" top-right and "Start your project" bottom-right,
   always on screen, inverting black↔white as sections change.
9. **Outlined pill tags** for service sub-items; solid pill buttons for actions.
10. **Confidence to leave space empty.** Whole viewports carry a gradient and nothing else.

## What is actually being referenced

Ricky, unprompted and worth quoting because it settles how to use this:

> I totally don't want a clone of this. It's the creative direction; the ambition of design.
> We may be small but we can create incredible sites that compete with London/NYC agencies
> for a fraction of the cost and a tiny fraction of the client effort.

So the reference is a **level of ambition**, not a layout to reproduce. The question every
direction should answer is "would this stand next to a London studio's work?" — not "does
this look like kota".

Note the reference is itself a London and New York agency, which is precisely why it was
chosen: it is the standard being matched, and DCS's own site is the proof of the claim.
That makes cloning it doubly wrong — copying the benchmark is the one move that proves you
could not meet it.

## What we take, and what we do not

DCS is a **competing UK web design agency**. Taking the register is normal practice; taking
the identity is not — and a near-copy would be both plagiarism and commercially foolish,
since the overlap in market would be obvious to anyone who knows both sites.

**Take (qualities):**

- Display type at 120–180px, single grotesk family, tight leading
- Per-character / per-word staggered reveals, and grey→ink resolve
- Stacking rounded panels that slide over one another
- Smooth scroll (Lenis is fine via CDN, with graceful degradation)
- Hard light↔dark section cuts
- Persistent floating CTA that inverts with the section
- Outlined pill tags, solid pill buttons
- Willingness to leave a viewport almost empty

**Do not take (identity):**

- Their signature asymmetric corner (`10px 100px 10px 10px` — one giant corner, three
  small). If you use asymmetric radii, invent your own relationship.
- Their exact palette: `#EFEFEF` ground with ice/lilac/cream pastels.
- **PP Neue Montreal** — it is a commercial Pangram Pangram licence we do not hold. Use a
  free equivalent: Switzer, General Sans, Satoshi or Clash Display (Fontshare), or Geist,
  Familjen Grotesk, Schibsted Grotesk, Archivo (Google).
- Their copy structure and headline phrasing ("Shaping how global brands are seen, trusted
  and remembered", "Making brands a damn sight better").
- Their square bracketed logo lockup.

## Where DCS should differ

Kota's colour is _soft_ — pastel and atmospheric. Ricky asked for **powerful** use of
colour. That is the opening: same assertive scale and motion, but a colour position that is
DCS's own rather than a wash of pastel iridescence. Round 3 varies exactly that.

Also worth remembering the audience gap. Kota sells to global brands with budgets; DCS sells
to small business owners, some of whom are nervous about the whole idea. The register can be
this assertive **provided the price, the phone number and the reassurance survive it.** A
page that is thrilling and unbookable is a failed page.
