# Round 4 — Poster variations (31–42)

Twelve iterations on **direction 27 "Poster"**, which Ricky has chosen to develop.

Read first, in order:

- `prototype/home-27-poster.html` — **the parent.** Read it properly; you are iterating on it.
- `reference-kota.md` — the ambition and the anti-clone boundary
- `build-spec-round3.md` — the assertive register (still applies)
- `content-brief.md` — v2 content, positioning, honesty rules
- `build-spec.md` — base build rules

---

## 1. What carries over from Poster (do not lose these)

- **Neutral shell, chromatic contents.** _"A plain room hung with loud objects."_ Grounds,
  panels and section backgrounds stay grey / black / off-white. Every saturated colour is a
  _thing_: a work tile, a marquee band, a price chip, a pull-quote card, a letter arriving.
- **No gradients, no box-shadows, no blurs** on structural surfaces. Poster ships zero of all
  three and that discipline is why it reads as print rather than as a template. (One
  exception is now allowed — see the glass nav in §3.)
- Display type **120–180px** at 1440, one grotesk family, hard section seams.
- Per-character hero reveal where letters **arrive in colour and resolve to ink**.
- Phone number and a primary CTA reachable in the first viewport; real prices legible and in
  full; nothing important arriving late.

## 2. NEW — every section fits the viewport

**Each section must fit within one viewport at ≥1024px without scrolling to read it.**

This is the biggest structural change and it is an editing problem before it is a layout
problem. The content does not shrink to fit by itself — you will have to decide what each
section is _for_ and cut the rest.

- Use `100svh` (not `vh` — mobile browser chrome makes `vh` wrong).
- `scroll-snap-type: y proximity` on the scroller with `scroll-snap-align: start` per section
  is the natural fit. **Use `proximity`, not `mandatory`** — mandatory snapping fights the
  user on trackpads and is a genuine accessibility problem. If you use snap at all, verify it
  does not trap keyboard or screen-reader navigation.
- Where content genuinely will not fit — the six services, three pricing tiers × two payment
  options, nine clients — solve it by **design**: a horizontal track, a tabbed or stepped
  panel, a condensed table, an index rather than cards. Do not shrink type below the floor
  or delete real content.
- **Mobile is the hard case.** At 390×844 with a fixed header, a strict one-section-per-
  viewport rule will break legibility. Relax it below 768px: sections may flow naturally,
  but keep them tight and self-contained. Say in your report what you did at mobile.
- The prices, the phone number, and every real client name must still be present in full.

## 3. NEW — two nav treatments, one per direction

Ricky likes both of these and wants to compare them properly:

- **Nav A — colour-adaptive bar.** As in direction 23 "Colour Field": a full-width bar that
  detects the section beneath it and repaints, so scrolling the page plays the palette.
  Note direction 26 found the trap: panels _stack_, so the section that intersects an
  observer is not necessarily the one visually **behind** the bar. Use a geometric hit-test
  and verify against `elementFromPoint`.
- **Nav B — floating glass island.** A detached, rounded, accent-tinted navigation element
  floating over the content with a genuine `backdrop-filter` blur and saturation. This is the
  one sanctioned exception to Poster's no-blur rule.
  **The trap, documented in this repo's CLAUDE.md:** never nest a `position: fixed`
  full-screen mobile-nav overlay inside a `backdrop-filter` ancestor — per spec that ancestor
  becomes the containing block and the overlay is trapped in the nav's own box. Render the
  mobile panel as a sibling of the nav or portal it to `body`.

Six colour chords × two nav treatments = twelve, so each chord is seen both ways.

## 4. NEW — colour chords

Ricky's note: _"I find myself liking the pink but I am not a pink guy... I'm torn. My fave
colours are bright orange and bright purple but don't make them all those colours."_

So: orange and purple feature strongly, pink gets a proper showing, and a third of the set
deliberately goes elsewhere. Each chord is **furniture only** — the shell stays neutral.

| Chord       | Primary          | Secondary         | Notes                                          |
| ----------- | ---------------- | ----------------- | ---------------------------------------------- |
| **Solar**   | bright orange    | deep violet       | both of his favourites in one page             |
| **Ultra**   | bright purple    | acid yellow-green | purple-led, high voltage                       |
| **Flare**   | bright orange    | cobalt blue       | orange-led, cooler counterweight               |
| **Rose**    | hot pink         | ink + bone        | the pink question answered properly, not girly |
| **Verdant** | emerald green    | coral             | avoids orange, purple and pink entirely        |
| **Tide**    | deep teal / cyan | crimson           | avoids orange, purple and pink entirely        |

Exact hex is yours — pick values that clear AA on your shell and stay poster-saturated, not
pastel. Nothing may read as industrial safety signage (no hi-vis yellow on black, no hazard
combinations). The parent's riso magenta/cyan/violet is taken; do not simply reproduce it.

## 5. NEW — furnish the rooms

Ricky wants to see the rooms furnished, not empty. There is now a larger media library:

- **Images:** `assets/img/web/*.jpg` — the round 1, 2 and 4 sets. See `MANIFEST-round2.md`
  and `MANIFEST-round4.md`. 1600px JPEGs; never use the root PNGs (3–7MB, one froze a
  renderer for 45 seconds under a filter).
- **Video:** `assets/video/*.mp4` — short silent loops. Use `muted playsinline loop autoplay`
  with a `poster` frame, `preload="metadata"`, and **pause them under
  `prefers-reduced-motion`** (autoplaying video is a real accessibility failure). Give every
  video a text alternative nearby. If a video fails to load the layout must not collapse.

Run `ls assets/img/web/ assets/video/` before referencing anything and use only what exists.

**Honesty rules, unchanged and binding.** Never caption a generated image or video as a real
named client's premises, shop, van or team — that fabricates a record about a real business.
No media may be presented as Ricky, "our team", or "the person who builds your site";
`sector-office.jpg` is safe as a professional-services sector tile and unsafe beside process
step 1 or first-person copy. Portfolio entries stay CSS-drawn mocks, outcome text, or type.

## 6. The twelve

| #   | File                            | Chord   | Nav                       |
| --- | ------------------------------- | ------- | ------------------------- |
| 31  | `home-31-solar-adaptive.html`   | Solar   | A — colour-adaptive bar   |
| 32  | `home-32-solar-glass.html`      | Solar   | B — floating glass island |
| 33  | `home-33-ultra-adaptive.html`   | Ultra   | A                         |
| 34  | `home-34-ultra-glass.html`      | Ultra   | B                         |
| 35  | `home-35-flare-adaptive.html`   | Flare   | A                         |
| 36  | `home-36-flare-glass.html`      | Flare   | B                         |
| 37  | `home-37-rose-adaptive.html`    | Rose    | A                         |
| 38  | `home-38-rose-glass.html`       | Rose    | B                         |
| 39  | `home-39-verdant-adaptive.html` | Verdant | A                         |
| 40  | `home-40-verdant-glass.html`    | Verdant | B                         |
| 41  | `home-41-tide-adaptive.html`    | Tide    | A                         |
| 42  | `home-42-tide-glass.html`       | Tide    | B                         |

These are **variations, not twelve new concepts.** Keep the parent's structural DNA so the
comparison is fair — the variables under test are chord, nav and the viewport-fit layout.
Within that, you may improve the parent's section design; if you find something better, say
so, because it may fold back into all twelve.

## 7. Verify by rendering

- Chrome headless on macOS clamps windows to ~500px; use a 390-wide iframe harness and
  measure `scrollWidth`.
- **Prove the viewport-fit claim**: measure each section's `scrollHeight` against the
  viewport at 1440×900 and 1280×800 and report any that overflow.
- Check the no-JS and reduced-motion paths explicitly. Reduced-motion must also pause video.
- Never animate a number — author true values in markup.
- Detector: `node ~/.claude/skills/impeccable/scripts/detect.mjs <file>` — it writes findings
  to **stderr**, so `2>/dev/null` shows a false zero. Roughly a third of its contrast
  findings are static-pairing artifacts; treat it as signal, not verdict.

## 8. Report back

Filename · chord with hex · nav treatment and how you solved its trap · fonts · display size
at 1440 · **which sections fit the viewport and how you made them fit, plus what you cut** ·
what you did at mobile · media used (images and video) · anything you'd fold back into all
twelve · what rendering caught.
