# Round 3 — Assertive (26–30)

Addendum to `build-spec.md` and `build-spec-round2.md`. Content rules from
`content-brief.md` (v2) still hold in full: broader positioning, accurate prices, real
clients, verbatim testimonials, honesty rules on imagery.

**Read `reference-kota.md` before anything else.** It is the measured read of the reference
Ricky supplied, and it defines this round.

---

## 1. The correction

Round 2 delivered elevated design-studio work. Ricky's response, on sending kota.co.uk:

> This was more what I was looking for. In your face; possibly overly animated and powerful
> use of colour and typography.

So round 2's _register_ was right and its **volume was too low.** Round 3 keeps the elevated
positioning and turns everything up: scale, motion, colour.

This is not a return to the under-construction feel. Hi-vis, hazard tape, dockets, road
signs and site notices remain ruled out. Assertive and elevated at once is the target — the
reference proves the two are compatible.

## 2. The register, concretely

From the measured reference. Hit these, in your own visual language:

- **Display type at 120–180px** at 1440. Fluid down to mobile, but big enough that a
  headline owns the viewport rather than sitting on it.
- **One family, largely one weight.** Confidence from scale, not from pairing a serif
  against a sans. (A direction may break this if it has a real reason — say so.)
- **Per-character or per-word staggered reveals**, and/or copy resolving grey → ink on
  scroll so it develops rather than fades.
- **Stacking panels** — sections as large rounded panels sliding over one another.
- **Smooth scroll.** Lenis via CDN is allowed; the page must work perfectly without it.
- **Hard light ↔ dark cuts** between sections, no easing between.
- **A persistent floating CTA** that stays on screen and inverts with the section under it.
- **Confidence to leave space almost empty** — at least one moment carrying very little.

## 3. Colour is where you differentiate — and it goes in the furniture

**The governing principle, from Ricky directly:**

> The colour is in the animations/content. The furnishings rather than the walls, ceilings
> and floors.

This is the most important line in the round, and it overrides any earlier instruction that
conflicts with it.

**Walls, ceilings, floors — stay neutral.** Grounds, panels, section backgrounds, the shell:
greys, blacks, whites, off-whites. The architecture of the page is disciplined and quiet.

**Furniture — carries the colour.** Gradient blooms and atmospheres · work, imagery and
portfolio mocks · moving elements · type fills at moments of emphasis · hover and focus
states · chips, tiles, inserts, marquee bands · video.

This is exactly why the reference reads as expensive rather than garish. Its base is grey,
black and white; every bit of colour is something _in_ the room. A page that drenches its
sections looks louder but cheaper, and it is not what was asked for.

Ricky asked for **powerful** colour where the reference is soft and pastel. Powerful applies
to the furniture, not to the walls: saturated, confident, memorable objects standing in a
plain room. Each direction below answers "what does powerful furniture look like" differently.

Do **not** reproduce the reference's `#EFEFEF` ground with ice/lilac/cream pastels.

## 4. Do not clone

`reference-kota.md` section "What we take, and what we do not" is binding. In particular:
their signature asymmetric corner, their exact palette, their copy phrasing, their logo
lockup, and **PP Neue Montreal** (a commercial licence we do not hold) are all off limits.

Free faces that carry the same confidence: **Switzer, General Sans, Satoshi, Clash Display**
(Fontshare CDN) or **Geist, Familjen Grotesk, Schibsted Grotesk, Archivo, Anybody** (Google).
If you use Fontshare, the page must still be readable if the CDN fails.

## 5. The five directions

| #   | File                     | Colour strategy                                                                                                                                                                                    |
| --- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 26  | `home-26-spectrum.html`  | **Atmospheric.** Huge grainy gradient blooms as furniture at architectural scale — DCS's own chord, drifting across a neutral shell, never tinting the panels themselves.                          |
| 27  | `home-27-poster.html`    | **Flat blocks.** Hard-edged saturated colour as _objects_ on a neutral shell — work tiles, cards, marquee bands, inserts. Poster-scale furniture in a plain room. No gradients anywhere.           |
| 28  | `home-28-blackout.html`  | **One accent, maximum contrast.** Near-black shell (black is a neutral — it is the walls), largest type in the round, and a single electric colour confined to the moving parts and the furniture. |
| 29  | `home-29-chromatic.html` | **Colour lives in the type.** Gradient-filled and colour-shifting headlines, variable axes animating. The letterforms carry the colour, the grounds stay quiet.                                    |
| 30  | `home-30-momentum.html`  | **Motion-maximal.** Continuous marquees, per-character scramble, velocity-reactive type. Colour arrives through movement.                                                                          |

## 6. The constraint that keeps it bookable

The reference sells to global brands. DCS sells to small business owners, some nervous about
the whole idea. The volume can be this high **only if the price, the phone number and the
reassurance survive it.**

Concretely, on every direction:

- The phone number and a primary CTA must be reachable within the first viewport.
- Real prices must appear in full, legibly, not buried under an effect.
- Nothing may block or delay a visitor who just wants to call.
- Motion must never gate access to content.

A page that is thrilling and unbookable has failed.

## 7. Non-negotiables carried forward

- Full page, working header and mobile nav, real footer. Responsive at 1440/1024/768/390.
- Semantic landmarks, one `h1`, AA body contrast, visible focus.
- **All motion neutralised under `prefers-reduced-motion`, and no content ever gated on JS
  alone.** At this motion volume this is the single highest risk in the round — a round 1
  direction shipped a hero headline that stayed permanently invisible when its script failed.
- **Never animate a number.** Author the true value in markup. Four round 1 directions
  shipped counters that could display a false price or stat; one published "0 Sites
  delivered".
- Images: `assets/img/web/*.jpg` only, per `MANIFEST-round2.md`. Show sector range, trades
  never as the frame. Never caption a generated image as a real named client, and no image
  may be presented as Ricky or "our team" — `sector-office` is safe as a sector tile and
  unsafe beside process step 1 or first-person copy.

## 8. Verify by rendering

Chrome headless on macOS clamps windows to ~500px — use a 390-wide iframe harness and
measure `scrollWidth`. Check the reduced-motion and no-JS paths explicitly; at this volume
they are where it will break.

Impeccable's detector is installed and its deps are present, so it evaluates computed
contrast: `node ~/.claude/skills/impeccable/scripts/detect.mjs <file>`. **It writes findings
to stderr** — `2>/dev/null` shows a false zero. Treat it as signal, not verdict; roughly a
third of its contrast findings are static-pairing artifacts.

## 9. Report back

Filename · direction name · pitch · palette hex · fonts · display size at 1440 · the motion
inventory · which images and why · what you cut to keep the page bookable · which skill
guidance changed a decision and which changed nothing.
