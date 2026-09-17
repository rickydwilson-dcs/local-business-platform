# DCS r9 — design kit

**Phase 1 output.** The numeric specification every later design agent builds against.

**Status:** derived 2026-09-15 from the shipped homepage, read in full and rendered live.

---

## 0. How to read this document

Every value below carries the file and line it came from. **A value without a
citation is not in this document**, because a value without a source is exactly
how the 2026-08-25 attempt failed — nine agents each reinventing spacing, type
and card conventions from a prose summary of the palette.

Sources, in order of authority:

| Rank | Source                                                                       | Why                                                                                                                                     |
| ---- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `sites/dcs/components/home/*.tsx`                                            | it is what actually ships; where CSS and component disagree, the component wins                                                         |
| 2    | `sites/dcs/styles/home-r9.css` (721 lines)                                   | the stylesheet, a verbatim port of the r9 prototype, asserted rule-for-rule by `test/home-css-parity.test.ts` (`home-r9-reset.css:5-6`) |
| 3    | `sites/dcs/styles/home-r9-reset.css` (88 lines)                              | homepage-only neutraliser for Tailwind Preflight + solaris base                                                                         |
| 4    | `sites/dcs/theme.config.ts`                                                  | the `colors.custom` tokens the CSS variables resolve to                                                                                 |
| 5    | `sites/dcs/app/layout.tsx`                                                   | the registered fonts and weights                                                                                                        |
| 6    | `output/sessions/2026-08/2026-08-26_dcs-projects-pages/prototype/shared.css` | round 1's first attempt at this same kit; reused where right, diverged from with reasons recorded in §12                                |

Citations are written `home-r9.css:142` — file, colon, line.

**Verification performed.** The homepage was rendered live at
`http://localhost:3002/` in Chrome at a 1380×757 viewport and read at seven
scroll positions across the full 15,783px document. The 2026-08-26 prototype
(`project-list.html`, `project-post.html`) was rendered too. Computed values
quoted below as "measured" came from that session, not from reading the CSS.
See §14 for what could **not** be verified.

---

## 1. Colour

### 1.1 The tokens

Seven colours. Declared in `theme.config.ts:40-48` as `colors.custom`, emitted by
the theme system as `--color-{key}`, then aliased to short names in
`home-r9.css:16-18`.

| Token       | Hex       | Source               | Role                                                                                                                                                                                                                                                                                             |
| ----------- | --------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--ink`     | `#0E0E12` | `theme.config.ts:41` | the dark ground. Hero, half the panels, `.menu`, `.detail`, selected `.tier`. Near-black, very slightly blue.                                                                                                                                                                                    |
| `--paper`   | `#ECEBE9` | `theme.config.ts:42` | `<body>` ground (`home-r9.css:30`). Warm off-white. Visible only where nothing covers it — on the homepage, essentially never.                                                                                                                                                                   |
| `--white`   | `#ffffff` | `theme.config.ts:43` | the _light panel_ ground. Distinct from `--paper`: panels use `--white`, the body uses `--paper`.                                                                                                                                                                                                |
| `--magenta` | `#D6006B` | `theme.config.ts:44` | the action colour. Every `.btn`, the `.plate` on the hero headline, panel top-rules, card hover rules, `::selection`, `:focus-visible`.                                                                                                                                                          |
| `--aqua`    | `#00D2D8` | `theme.config.ts:45` | the _counter-accent_. It appears only **on dark or magenta grounds**, where magenta would not read — the bar's accent on ink/magenta/navy (`home-r9.css:52,53,55`), check icons in `.detail__l` (`426`), `.step__k` and `.step__r` (`374,380`), the FAQ chevron (`440`), `.slot__i` (`209-210`). |
| `--navy`    | `#17265E` | `theme.config.ts:46` | the closing ground (`.end`) and the default `.card__well` / `.mock` backdrop (`home-r9.css:224,236`).                                                                                                                                                                                            |
| `--grey`    | `#70707B` | `theme.config.ts:47` | **not a surface colour.** It is the pre-reveal state of `.res` headings only (`home-r9.css:159`).                                                                                                                                                                                                |

Note there is no separate "muted text" token: muted text is done with `opacity`
on `currentColor`, never with a grey hex. The one exception is `.row__m`, which
hardcodes `#5E5E68` (`home-r9.css:322`), and `.res`'s mobile fallback `#5A5A66`
(`home-r9.css:633`).

Off-token hexes that exist in the stylesheet and are legitimate:

- `#F4F3F1` — card ground on white panels (`home-r9.css:171`, `218`)
- `#F7F6F4` — mobile pricing card ground (`home-r9.css:670`)
- `#171A24` / `#1E222E` — `.slot` diagonal stripe (`home-r9.css:208`)
- `rgba(8,8,12,.82)` — `.cards--2` hover scrim (`home-r9.css:189`)
- `rgba(6,6,10,…)` — `.wpanel` video scrims (`home-r9.css:287-288`, `292-293`)

### 1.2 The ground sequence — what actually governs the order

Verified live by walking the rendered DOM (`.stack > *`, document order):

```
hero            ink       (hero.tsx:64  data-ground="ink")
  cornerfill    cf--ink
#work           p--white  (work-stack.tsx:24)
.wstack         [ink]     five .wpanel, each data-ground="ink" (work-stack.tsx:36-40)
  cornerfill    cf--ink
#services       p--magenta(services-stack.tsx:30)
.svcstack       [magenta ground shows between cards]
  cornerfill    cf--magenta
(process)       p--ink    (steps-section.tsx:31 — carries NO id, deliberately)
  cornerfill    cf--ink
#pricing        p--white  (home-body.tsx:54)
  cornerfill    cf--white
#faq            p--magenta(home-body.tsx:63)
  cornerfill    cf--magenta
(quote)         p--aqua   (home-body.tsx:72 — no id)
  cornerfill    cf--aqua
#end            p--navy   (home-body.tsx:76-82, + class "end")
```

**The rule governing the order is contrast, not rotation.** No two adjacent
panels share a ground, and the sequence alternates dark→light→dark so each
boundary is a hard cut. `--aqua` appears exactly once, immediately before
`--navy`, as the brightest moment on the page right before it closes. `--navy`
appears exactly once, as the last panel. The thesis line in the stylesheet
header states the intent: _"colour as a wall you hit"_ (`home-r9.css:6-7`).

For an inner page, the practical instruction is: **pick a short sequence that
alternates dark and light and never repeats adjacent, and put aqua at most once,
late.** Do not cycle all five on a short page.

### 1.3 `.cornerfill` / `.cf--*` — the boundary mechanism, and the trap in it

`.panel` has `border-radius: var(--r) var(--r) 0 0` (`home-r9.css:143`) and is
`position: sticky; top: 0` (`142`). As a panel scrolls up over the one before
it, its two rounded top corners are cut out of its own background — so whatever
paints _behind_ those corners shows through.

`.cornerfill` is a strip sized exactly to the corner radius, pinned in the same
place, painting that revealed colour:

```css
.cornerfill {
  position: sticky;
  top: 0;
  height: var(--r);
  margin-bottom: calc(var(--r) * -1);
}
```

— `home-r9.css:137`. The negative bottom margin cancels its own height so it
occupies no layout space. Modifiers `cf--ink` / `cf--white` / `cf--magenta` /
`cf--aqua` at `home-r9.css:138-141`.

**The trap: the cornerfill's colour is the colour of the pane ABOVE the
boundary, not the colour of the panel being opened.** Verified in
`chapter-panel.tsx:15-27`, which documents the full boundary table, and enforced
in `chapter-panel.tsx:70-87` — the component never infers the colour from
`panelBg`, the caller must pass `cornerfillColor` explicitly, "because (see the
services boundary above) the two are frequently different"
(`chapter-panel.tsx:30-31`).

The pairings, read off the live DOM:

| Pane above            | cornerfill    | panel opened           |
| --------------------- | ------------- | ---------------------- |
| hero (ink)            | `cf--ink`     | `p--white #work`       |
| `.wstack` (ink)       | `cf--ink`     | `p--magenta #services` |
| `.svcstack` (magenta) | `cf--magenta` | `p--ink` (process)     |
| process (ink)         | `cf--ink`     | `p--white #pricing`    |
| pricing (white)       | `cf--white`   | `p--magenta #faq`      |
| faq (magenta)         | `cf--magenta` | `p--aqua` (quote)      |
| quote (aqua)          | `cf--aqua`    | `p--navy .end #end`    |

Note `cf--navy` and `cf--paper` **do not exist** (`home-r9.css:138-141` defines
four modifiers only; `chapter-panel.tsx:43` types the union as
`'ink' | 'white' | 'magenta' | 'aqua'`). A page that needs to open a panel below
a navy or paper pane has to add the modifier. Flagged in §13.

There is one more piece: `.stack{position:relative;background:var(--ink)}`
(`home-r9.css:136`), so the _first_ panel's corners reveal the hero's ink rather
than the body's paper — explained in the comment at `home-r9.css:132-135`.

### 1.4 The `.bar` ground system

One attribute, `data-ground`, drives six things at once — background, foreground,
rule colour, accent, CTA foreground (`home-r9.css:50-55`):

| `data-ground` | `--bar-bg`  | `--bar-fg` | `--bar-rule`            | `--bar-acc` | `--bar-cta-fg` | line |
| ------------- | ----------- | ---------- | ----------------------- | ----------- | -------------- | ---- |
| `paper`       | `--paper`   | `--ink`    | `rgba(14,14,18,.16)`    | magenta     | `#fff`         | 50   |
| `white`       | `--white`   | `--ink`    | `rgba(14,14,18,.14)`    | magenta     | `#fff`         | 51   |
| `ink`         | `--ink`     | `#fff`     | `rgba(255,255,255,.22)` | **aqua**    | `--ink`        | 52   |
| `magenta`     | `--magenta` | `#fff`     | `rgba(255,255,255,.34)` | **aqua**    | `--ink`        | 53   |
| `aqua`        | `--aqua`    | `--ink`    | `rgba(14,14,18,.28)`    | magenta     | `#fff`         | 54   |
| `navy`        | `--navy`    | `#fff`     | `rgba(255,255,255,.28)` | **aqua**    | `--ink`        | 55   |

**The accent-swap rule generalises beyond the bar:** on ink, magenta and navy
grounds the accent is aqua; on paper, white and aqua grounds it is magenta. Apply
this anywhere an accent is needed on an unusual ground.

On the homepage the value is written by a rAF-driven probe
(`home-behaviour.tsx:224-247`): a point `bar.height * 0.62` down from the top —
measured at **50.22px** against a **81px** bar — is tested against every
`main [data-ground]` rect, and **the last match in document order wins**
(`home-behaviour.tsx:109-115`), because sticky panels overlap constantly and the
last one is the one painting on top (`home-behaviour.tsx:101-107`).

Inner pages are not a sticky stack, so they can set `data-ground` statically —
but if a page _does_ stack panels, this probe logic is the one that works.

---

## 2. Type

### 2.1 The faces

**One family at every size.** The stylesheet's own thesis: _"One grotesk family
at every size, no second face"_ (`home-r9.css:5`).

| Variable   | Value                                                       | Source           |
| ---------- | ----------------------------------------------------------- | ---------------- |
| `--f`      | `var(--font-archivo), system-ui, -apple-system, sans-serif` | `home-r9.css:19` |
| `--f-logo` | `var(--font-poppins), var(--f)`                             | `home-r9.css:20` |

Registered in `app/layout.tsx:11-23`:

- **Archivo** — `weight: ['400','500','600','700','800','900']`, `display:'swap'`,
  `subsets:['latin']` (`layout.tsx:11-16`). Six discrete weights, not `'variable'`.
- **Poppins** — `weight: ['300']` only (`layout.tsx:18-23`).

**Poppins 300 is logo-only.** Its single use is `.mark__type`, the two-line
"digital consulting / services" lockup beside the logo mark
(`home-r9.css:60-63`). Nothing else on the site may use it. Adding a second
Poppins weight would be a brand change, not a styling choice.

Weights actually used in `home-r9.css`: **400** (body, `line 30`), **500**
(`.bar nav a` 89, `.row__m` 322, `.tier__f small` 392), **600** (`.hire` 98,
`.btn` 123, `.cards--2 .card__t` 179, `.svccard__l` 353, `.wpanel__l` 304,
`.quote__a` 450, `.paytoggle button` 387), **700** (`.card__t` 229, `.row__n`
321, `.step__t` 381, `.tier__n` 402, `.qa summary` 435, `.quote` 449, `.svc__n`
366, `.eyeless` 156, `.slot__t` 213, `.card__tag` 231, `.wpanel__ix` 310,
`.svccard__ix` 348), **800** (every display heading — `h1` 112, `h2` 154,
`.menu__nav a` 81, `.wpanel__n` 299, `.svccard__t` 349, `.detail__h` 422,
`.step__k` 380, `.big` 463), **900** never. Poppins **300** logo only.

**Archivo 900 is registered but unused** in `home-r9.css`. Do not reach for it —
the display weight of this design is 800.

### 2.2 The scale

Every display size is a `clamp()`. Real values, with what they compute to at the
measured 1380px-wide viewport:

| Element              | Declaration                                                                    | line    | measured @1380                                                                                  |
| -------------------- | ------------------------------------------------------------------------------ | ------- | ----------------------------------------------------------------------------------------------- |
| `h1`                 | `clamp(2.3rem, 8.9vw, 8.8rem)` / `800` / `-.038em` / `1.02`                    | 112-113 | **122.82px**, ls `-4.667px`, lh `125.276px`                                                     |
| `h2`                 | `clamp(2.2rem, 6.6vw, 6.2rem)` / `800` / `-.034em` / `.9` / `max-width:17ch`   | 154     | **56px** (see §7 — the `max-height` query is capping it), ls `-1.904px`, lh `50.4px`            |
| `.menu__nav a`       | `clamp(2.1rem, 7vw, 5.4rem)` / `800` / `-.04em` / `1.02`                       | 81-82   | —                                                                                               |
| `.wpanel__n`         | `clamp(2.2rem, 6.6vw, 6.2rem)` / `800` / `-.034em` / `.9` / `max-width:14ch`   | 299-300 | **h2's spec verbatim** — the comment at 297-298 says mirror _every_ h2 breakpoint or they drift |
| `.quote`             | `clamp(1.8rem, 5.4vw, 4.6rem)` / `700` / `-.036em` / `1.02` / `max-width:19ch` | 449     | —                                                                                               |
| `.svccard__t`        | `clamp(1.9rem, 4.4vw, 4rem)` / `800` / `-.038em` / `.94`                       | 349-350 | —                                                                                               |
| `.big`               | `clamp(1.3rem, 3.6vw, 3rem)` / `800` / `-.04em`                                | 463     | —                                                                                               |
| `.row__n`            | `clamp(1.4rem, 3.4vw, 2.9rem)` / `700` / `-.032em`                             | 321     | —                                                                                               |
| `.svc__n`            | `clamp(1.3rem, 3.1vw, 2.6rem)` / `700` / `-.03em`                              | 366     | —                                                                                               |
| `.step__t`           | `clamp(1.25rem, 2.9vw, 2.3rem)` / `700` / `-.028em`                            | 381     | —                                                                                               |
| `.detail__h`         | `clamp(1.5rem, 3vw, 2.4rem)` / `800` / `-.032em` / `1`                         | 422     | —                                                                                               |
| `.step__k`           | `clamp(1.1rem, 2vw, 1.9rem)` / `800` / `-.03em` / aqua                         | 380     | —                                                                                               |
| `.tier__n`           | `clamp(1.15rem, 2.3vw, 1.75rem)` / `700` / `-.028em`                           | 402     | —                                                                                               |
| `.tier__f`           | `clamp(1.05rem, 2vw, 1.5rem)` / `700` / `-.02em` / `text-align:right`          | 408-409 | —                                                                                               |
| `.qa summary`        | `clamp(1.02rem, 1.75vw, 1.42rem)` / `700` / `-.022em`                          | 436     | —                                                                                               |
| `.card__t`           | `clamp(1rem, 1.42vw, 1.28rem)` / `700` / `-.022em`                             | 229     | —                                                                                               |
| `.cards--2 .card__t` | `clamp(1.12rem, 1.62vw, 1.45rem)` / `600` / `-.02em` / `1.24`                  | 182     | —                                                                                               |

**The tracking rule.** Letter-spacing is negative and gets _more_ negative as
size increases: `-.022em` at ~1.2rem → `-.034em` at h2 → `-.038em` at h1 →
`-.04em` at `.menu__nav a` and `.big`. Anything at display size without negative
tracking is off-language.

**The leading rule.** Display type is set tight: `.9` (h2, `.wpanel__n`), `.94`
(`.svccard__t`), `1` (`.detail__h`), `1.02` (h1, `.quote`, `.menu__nav a`).
Reading type opens up: `1.4` (`.card__s` 230), `1.42` (`.svc__d` 367), `1.45`,
`1.5` (`.lead` 155, `.detail__p` 423, `.step__b` 382, `.wpanel__d` 301), `1.52`
(`.hero__sub` 120), `1.55` (`.qa__a p` 446).

### 2.3 Body and supporting type

| Element                        | Declaration                                                                                                                | line      |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | --------- |
| `body`                         | `font-weight:400`, `-webkit-font-smoothing:antialiased`, colour `--ink` on `--paper`                                       | 30-31     |
| `.lead`                        | `margin-top:22px`, `max-width:52ch`, `clamp(1rem,1.28vw,1.2rem)`, `lh 1.5`, `opacity:.94`                                  | 155       |
| `.hero__sub`                   | `max-width:38ch`, `clamp(1rem,1.16vw,1.16rem)`, `lh 1.52`, `rgba(255,255,255,.74)`, `justify-self:end`, `text-align:right` | 119-120   |
| `.eyeless`                     | `12.5px`, `ls .11em`, `uppercase`, `700`, `opacity:.55`, `margin-bottom:26px`                                              | 156       |
| `.wpanel__ix` / `.svccard__ix` | `12.5px`, `700`, `ls .13em`                                                                                                | 310 / 348 |
| `.slot__t`                     | `12px`, `700`, `ls .11em`, `uppercase`                                                                                     | 213       |
| `.card__tag`                   | `10.5px`, `700`, `ls .1em`, `uppercase`                                                                                    | 231-232   |
| `.bar nav a`                   | `14px`, `500`, `opacity:.72`                                                                                               | 89        |
| `.hire`                        | `14.5px`, `600`                                                                                                            | 98        |
| `.btn`                         | `16px`, `600`                                                                                                              | 123       |
| `.end__foot`                   | `13.5px`, `opacity:.66`                                                                                                    | 461       |

**The small-caps label idiom.** Every micro-label in this design is the same
move: 10.5–12.5px, weight 700, uppercase, positive letter-spacing `.07em`–`.13em`,
reduced opacity. That is the _only_ uppercase in the design — nothing else is
uppercased.

### 2.4 `.res` — the scroll-resolve heading treatment

This is the signature typographic behaviour and it is easy to miss.

```css
.res {
  color: var(--grey);
  transition: color 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.p--ink .res,
.p--magenta .res,
.p--navy .res {
  color: rgba(255, 255, 255, 0.72);
}
.p--aqua .res {
  color: rgba(14, 14, 18, 0.66);
}
.in .res {
  color: currentColor;
}
```

— `home-r9.css:159-162`.

A heading carrying `.res` renders in a **muted rest colour** and resolves to full
`currentColor` over **1s** when its panel gets the `.in` class. `.in` is latched
once by an IntersectionObserver at `threshold: 0.16` and the element is
unobserved immediately, so it never flickers back (`home-behaviour.tsx:276-289`).

Rest colour depends on the ground: `--grey` `#70707B` on light, `rgba(255,255,255,.72)`
on ink/magenta/navy, `rgba(14,14,18,.66)` on aqua. Confirmed visually at every
panel during the live walk-through.

Mobile/headless fallback is `#5A5A66` (`home-r9.css:633`) — and the comment at
`628-632` records why: a headless render (Lighthouse included) catches the
heading _before_ the observer fires, at any width, so the rest colour has to be
legible on its own. **Any new `.res` use inherits this obligation.**

Used on the homepage by `h2` in every chapter opener and by `.quote`
(`quote.tsx:12`) — measured: 7 `.res` elements live.

---

## 3. Space

### 3.1 The two global clamps

```css
--pad: clamp(20px, 4.4vw, 76px);
--r: clamp(20px, 3vw, 44px);
```

— `home-r9.css:21-22`. Measured `padding` on `.bar` at 1380px: `17px 60.72px`,
i.e. `--pad` = **60.72px** there (4.4vw), not yet at its 76px cap.

`--pad` is the **only** horizontal gutter in the design. It is used on `.bar`
(44), `.menu` (78), `.hero` (109), `.panel` (142), `.worksec` (170), `.wpanel`
(275), `.wpanel__ix` (309), `.svcstack` (336), `.end` inherits from `.panel`.
Nothing else sets a left/right page margin. **Never introduce a second gutter
value.**

On mobile it is redefined to clear the notch:
`--pad: max(20px, env(safe-area-inset-left), env(safe-area-inset-right))`
(`home-r9.css:585`).

`--r` is the panel corner radius, and it is also the cornerfill's height (137),
so the two are locked together by construction.

### 3.2 Section rhythm

| Context                        | Padding                                                                                                                                                                                         | line |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| `.hero`                        | `clamp(148px,20vh,232px) var(--pad) clamp(44px,6vh,78px)`                                                                                                                                       | 109  |
| `.panel`                       | `clamp(84px,10vh,140px) var(--pad) clamp(40px,6vh,80px)`                                                                                                                                        | 142  |
| `.panel` @ `max-height:1040px` | top `clamp(70px,8vh,96px)`, bottom `clamp(28px,4vh,48px)`                                                                                                                                       | 474  |
| `.worksec`                     | `clamp(74px,9vh,120px) var(--pad) clamp(56px,8vh,96px)`                                                                                                                                         | 170  |
| `.wpanel`                      | `clamp(60px,8vh,110px) var(--pad)` — **equal block padding, deliberately** (comment 272-274: `align-content` centres within the content box, so unequal padding leaves copy visibly off-centre) | 275  |
| `.svcstack`                    | `0 var(--pad) 12vh`                                                                                                                                                                             | 336  |
| `.svccard__body`               | `clamp(24px,3.4vw,58px)`                                                                                                                                                                        | 347  |
| `.end`                         | top `clamp(170px,22vh,260px)`, bottom `clamp(24px,3vh,38px)`                                                                                                                                    | 455  |
| `.detail`                      | `clamp(15px,2.2vh,24px) clamp(22px,3vw,40px) clamp(22px,3vw,40px)` — top matches `.tier`'s so headings align (comment 411-412)                                                                  | 414  |
| `.bar`                         | `clamp(11px,1.5vw,17px) var(--pad)`                                                                                                                                                             | 44   |
| `.btn`                         | `19px 30px`                                                                                                                                                                                     | 122  |
| `.hire`                        | `12px 19px 12px 22px` — asymmetric, the 3px extra on the left balances the trailing arrow                                                                                                       | 97   |
| `.card__body`                  | `14px 16px 17px`                                                                                                                                                                                | 228  |

### 3.3 The "distance to the next thing" rhythm

Every block-level gap in this design is a `clamp` with roughly a 1 : 1.8 ratio
between floor and cap:

| Rule                              | Value                                           | line |
| --------------------------------- | ----------------------------------------------- | ---- |
| `.lead` top                       | `22px` fixed                                    | 155  |
| `.cards` top                      | `clamp(28px,4.4vh,54px)`                        | 165  |
| `.cards--2` top                   | `clamp(40px,6vh,72px)`                          | 168  |
| `.work` top                       | `clamp(34px,5vh,58px)`                          | 313  |
| `.svcs` top                       | `clamp(30px,5vh,54px)`                          | 362  |
| `.steps` top                      | `clamp(34px,5vh,60px)`                          | 370  |
| `.payhead` top                    | `clamp(20px,3vh,34px)`                          | 385  |
| `.price` top                      | `clamp(30px,4.6vh,54px)`                        | 393  |
| `.qa` top                         | `clamp(26px,4vh,48px)`                          | 432  |
| `.quote__a` top                   | `clamp(22px,3vw,38px)`                          | 450  |
| `.end__foot` top margin / padding | `clamp(28px,4vh,48px)` / `clamp(20px,3vh,32px)` | 460  |

All of these collapse to `clamp(18px,2.6vh,30px)` under `max-height:1040px`
(`home-r9.css:482`) — which, as §7 shows, is **the common case on a laptop**.

### 3.4 Grid gaps

| Rule                     | Gap                                                                     | line       |
| ------------------------ | ----------------------------------------------------------------------- | ---------- |
| `.cards`                 | `clamp(12px,1.4vw,20px)`                                                | 165        |
| `.cards--2`              | `clamp(18px,2.1vw,34px)`                                                | 167-168    |
| `.price` (two-column)    | `clamp(22px,3.4vw,58px)`, columns `minmax(0,1fr) minmax(0,1.05fr)`      | 393-394    |
| `.hero__head` column gap | `clamp(28px,4vw,68px)`                                                  | 111        |
| `.step` columns          | `clamp(46px,6vw,96px) 1fr`, gap `clamp(16px,3vw,44px)`                  | 371        |
| `.svccard` columns       | `minmax(0,1fr) minmax(0,1.02fr)`                                        | 339        |
| `.detail__l`             | `9px`                                                                   | 424        |
| `.menu`                  | `clamp(20px,3vh,36px)`                                                  | 78         |
| `.bar`                   | `22px`; `.bar__r` `clamp(8px,1vw,13px)`; `.mark` `clamp(10px,1vw,14px)` | 43, 66, 58 |

Note the `1.05fr` and `1.02fr` — the second column is _deliberately slightly
wider_ than the first in both two-column layouts. Not 50/50.

---

## 4. Shape

Every radius in the stylesheet:

| Value                                                     | Applied to                                                                            | line                            |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------- |
| `var(--r)` = `clamp(20px,3vw,44px)`, **top corners only** | `.panel`, `.worksec`, `.wpanel`                                                       | 143, 170, 272                   |
| `calc(var(--r)*.7)`                                       | `.detail` (the pricing detail pane)                                                   | 413                             |
| `26px`                                                    | `.svccard`                                                                            | 338                             |
| `clamp(16px,1.7vw,24px)`                                  | `.cards--2 .card`                                                                     | 176                             |
| `18px`                                                    | `.card` (base), `.tcard` (mobile pricing)                                             | 215, 669                        |
| `100px` (pill)                                            | `.btn`, `.hire`, `.paytoggle` + its buttons, `.card__tag`, `.mock__live`, `.tcard__b` | 122, 97, 386/388, 232, 241, 674 |
| `50%` (circle)                                            | `.burger`, `.slot__i`, `.mock__dot`, `.mock__live i`                                  | 67, 209, 246, 243               |
| `6px`                                                     | `.row::after` hover fill                                                              | 317                             |
| `4px`                                                     | `.mock__cell`                                                                         | 248                             |
| `3px`                                                     | `.mock__bar`, `:focus-visible`                                                        | 238, 33                         |
| `0`                                                       | `.cards--2 .card__well` — explicitly squared off inside its rounded parent            | 185                             |

**The shape rule:** page-scale surfaces get `--r` on their _top two corners
only_; component-scale cards get 18–26px on all four; anything interactive and
inline is a full 100px pill; icon affordances are circles.

---

## 5. Motion

### 5.1 The easing curves

**There are two, and they have distinct jobs.**

`cubic-bezier(.16,1,.3,1)` — the design's primary curve, a strong ease-out. Used
for every transform, every reveal, every layout-ish motion. Appears at lines 72,
83, 93, 101, 102, 124, 125, 146, 159, 178 (via 217), 192, 217, 221, 306, 317,
354, 358, 364, 376, 389, 399, 429, 436, 441, 443, 540.

`cubic-bezier(.4,0,.2,1)` — an ease-in-out, used **only for colour crossfades on
the persistent bar**: `.bar` background/colour/border (47-49), `.mark__type`
border (63), `.bar nav a::after` background-color (93), `.hire`
background/colour (99-100).

Plain `ease` is used for opacity and simple colour fades: 70, 90, 124, 183, 190,
319, 389, 464, 540.

### 5.2 Durations

| Duration | What                                                                                                                   | line                             |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `.25s`   | burger bar opacity                                                                                                     | 72                               |
| `.3s`    | link opacity, card title colour, toggle colour                                                                         | 90, 183, 389                     |
| `.35s`   | burger hover, `.hire` transform, `.svccard__l`/`.wpanel__l` gap, `.tier` padding, `.qa summary` padding, `.big` border | 70, 101, 354, 306, 399, 436, 464 |
| `.4s`    | `.btn` transform/shadow, burger rotate, `.cards--2 .card__s` opacity, nav underline, `.qa` chevron, row colour         | 124-125, 72, 190, 93, 441, 319   |
| `.45s`   | `.qa__a` grid-rows, `.svc` padding-left, `.swap` keyframe                                                              | 443, 540, 428                    |
| `.5s`    | `.card` transform/shadow, `.menu__nav a span`, `.cards--2 .card__s span`, `.row::after`                                | 217, 83, 192, 317                |
| `.55s`   | bar colour crossfade, `.card::before` rule                                                                             | 47-49, 221                       |
| `.8s`    | `.card__well` media scale, `.row/.svc/.step` reveal transform                                                          | 226, 540                         |
| `1s`     | `.res` colour resolve, `.step__r` rule draw                                                                            | 159, 376                         |
| `1.1s`   | `.panel::before` top-rule draw (with `.1s` delay), `.svccard__well` media scale                                        | 146, 358                         |
| `4.6s`   | `[data-anim="in"]` / `[data-anim="cell"]` infinite loops in `.mock`                                                    | 536, 538                         |

### 5.3 What animates

- **Panel arrival:** a 3px magenta top-rule scales in from the left over 1.1s
  with a .1s delay (`.panel::before` 144-146). On magenta panels the rule is aqua
  (150); on aqua panels it is ink (152).
- **Heading resolve:** `.res`, §2.4.
- **Staggered card reveal:** `.card` starts `translateY(20px)`, `.in .card`
  returns to 0, with `.08s` increments per nth-child up to the 6th
  (`home-r9.css:529-535`). Same idea for `.row/.svc/.step` at `translateY(18px)`
  (540-541), and `.step__r` rules draw with `.14s` increments (376-379).
- **Hover lift:** `.btn` `translateY(-3px)` + a _coloured_ shadow
  `0 16px 34px -16px rgba(214,0,107,.8)` (126); `.card` `translateY(-5px)` +
  `0 22px 44px -26px rgba(14,14,18,.55)` (222); `.cards--2 .card`
  `translateY(-4px)` + `0 28px 54px -30px rgba(14,14,18,.55)` (178);
  `.hire` `translateY(-2px)` (103).
- **Arrow nudge:** every arrow-bearing control moves its SVG `translateX(4-5px)`
  on hover (104, 127).
- **Gap-open links:** `.svccard__l` / `.wpanel__l` animate `gap` from `9px` to
  `15px` on hover (352-355, 304-307) — a border-bottom link whose arrow slides
  away from the word.
- **Padding-shift rows:** `.svc` (365), `.tier` (400), `.qa summary` (438) all
  shift `padding-left` by 12–14px on hover.
- **Media zoom:** `scale(1.05)` on `.card__well` over `.8s` (227),
  `scale(1.045)` on `.svccard__well` over `1.1s` (359).
- **Accordion:** `grid-template-rows: 0fr → 1fr` over `.45s` (443-444) — the
  height-animation trick, with `overflow:hidden` on the inner div (445).

### 5.4 What does NOT animate — the hard rules

1. **Count-up number animations are BANNED on this site.** Session ground rule 5:
   _"No count-up animations. Ruled out for DCS. Static authored figures only."_
   (`session.md:218`). The reason is in auto-memory
   (`feedback_animated_counters_show_false_figures`): a frozen count-up publishes
   a wrong figure, and on a page carrying prices that is a commercial error, not
   a visual one. Author the true value in the markup.
2. **Nothing fades in from `opacity: 0` on scroll.** Headings resolve _colour_,
   cards translate _position_. The content is always present and readable — see
   the stylesheet's own thesis, which explicitly refuses the reference site's
   "hero that renders empty until script fires" (`home-r9.css:3-4`), and
   `hero.tsx:5-9`, which splits the headline characters during _server_ render
   precisely so they exist with zero JS.
3. **No entrance animation on the hero.** Lines 528 contain a mangled/no-op
   fragment (see §11) — in practice nothing animates the hero in.
4. **`prefers-reduced-motion`** turns off smooth scrolling (526) and gates the
   entire reveal layer (527-542). The `.swap` pricing animation is gated in JS
   (`pricing.tsx:145`).
5. **Touch devices get all latching hover effects neutralised** — 21 rules under
   `@media (hover:none)` (`home-r9.css:560-580`), because "hover effects fire on
   tap and then latch until you tap elsewhere" (comment 557-559). Any new hover
   effect must be added to that block.

---

## 6. Component catalogue

"Live" = present in the rendered homepage DOM; counts measured directly in the
browser. "Spare" = fully defined in the stylesheet but not used on the homepage —
these were designed for content the homepage doesn't show, and inner pages should
exhaust them before inventing anything.

### 6.1 Live on the homepage

| Pattern                                | Count     | What it is / real values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | lines   |
| -------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `.bar`                                 | 1         | Fixed top bar, `z-index:70`, flex, `padding clamp(11px,1.5vw,17px) var(--pad)`, 1px bottom rule, `.55s` colour crossfade. Six `data-ground` states (§1.4). Measured height **81px**.                                                                                                                                                                                                                                                                                                                                                    | 42-56   |
| `.mark` / `.mark__svg` / `.mark__type` | 1         | Logo lockup. SVG `height:clamp(26px,2.4vw,33px)`; type block is Poppins 300, `clamp(11.5px,1.02vw,13.5px)`, `lh 1.18`, `ls .004em`, lowercase, `opacity:.92`, with a 1px `currentColor` left rule and `padding-left:clamp(10px,1vw,14px)`. Hidden below 620px (498).                                                                                                                                                                                                                                                                    | 58-64   |
| `.burger`                              | 1         | Circular button, `clamp(40px,3.4vw,46px)`, `1.4px` current-colour border, two 16×1.6px bars, `gap:5px`. `aria-expanded="true"` rotates them ±45° into an X. Hover fills with `--bar-acc`. 44px floor on mobile (591).                                                                                                                                                                                                                                                                                                                   | 67-75   |
| `.hire`                                | 1         | The persistent CTA pill. `14.5px/600`, `border-radius:100px`, background `--bar-acc` — so it is magenta on light grounds and **aqua on dark ones**.                                                                                                                                                                                                                                                                                                                                                                                     | 97-104  |
| `.menu`                                | 1         | Fullscreen ink overlay, `position:fixed;inset:0;z-index:65`, `align-content:center`, `padding:clamp(90px,12vh,140px) var(--pad) clamp(30px,5vh,60px)`. Links at `clamp(2.1rem,7vw,5.4rem)/800`, sliding `translateX(clamp(10px,1.6vw,26px))` and turning aqua on hover. Footer row with a 1px `rgba(255,255,255,.2)` rule.                                                                                                                                                                                                              | 77-88   |
| `.hero`                                | 1         | `min-height:100svh`, ink, `align-content:center`. `.hero__head` is a two-column grid `minmax(0,auto) minmax(0,1fr)` with `align-items:last baseline` — the sub-line hangs off the last baseline of the headline, right-aligned.                                                                                                                                                                                                                                                                                                         | 107-120 |
| `.plate`                               | 1         | The magenta highlight block behind one hero word. `display:inline-block`, `padding:0 .1em .04em`, `margin-right:.06em`, `transform-origin:0 50%`. Em-based, so it scales with the type.                                                                                                                                                                                                                                                                                                                                                 | 117-118 |
| `.btn`                                 | 7         | Primary pill. `padding:19px 30px`, `100px`, magenta on `#fff`, `16px/600`, `gap:11px`, 16px SVG. Hover: lift 3px + magenta-tinted shadow.                                                                                                                                                                                                                                                                                                                                                                                               | 122-127 |
| `.cornerfill` / `.cf--*`               | 7         | §1.3.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 137-141 |
| `.panel` / `.p--*`                     | 7         | `position:sticky;top:0`, `min-height:100svh`, `border-radius:var(--r) var(--r) 0 0`, `display:grid;align-content:center`, `overflow:hidden`, plus the animated top-rule. Five grounds: `p--ink`, `p--white`, `p--magenta`, `p--aqua`, `p--navy`. **Becomes `position:relative;min-height:auto` below 901px** (522).                                                                                                                                                                                                                     | 142-153 |
| `.res`                                 | 7         | §2.4.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 159-162 |
| `.lead`                                | 3         | §2.3.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 155     |
| `.wstack` / `.wpanel`                  | 1 / 5     | Full-bleed video case-study panels. `.wpanel` is `sticky;top:0;height:100lvh;margin-bottom:26vh`, video absolutely positioned at `z-index:0`, a gradient scrim at `z-index:1`, content at `z-index:2`. **Desktop (≥901px) scrim is horizontal**, `rgba(6,6,10,.86)`→`.14` left-to-right (292-293); mobile is vertical and strongest through the middle (287-288) — sized so white text clears 4.5:1 even on a white frame (comment 281-285). `.wstack::after{height:100lvh}` is the in-flow tail that lets the last panel pin (see §9). | 256-310 |
| `.svcstack` / `.svccard`               | 1 / 6     | Sticky card stack. `top:calc(clamp(76px,10vh,94px) + var(--i) * 10px)` — each card pins 10px lower than the last, so the stack fans. `height:min(80vh,720px)`, `radius 26px`, `margin-bottom:16vh`, `box-shadow:0 -26px 70px -46px rgba(14,14,18,.62)` (an _upward_ shadow). Two columns `minmax(0,1fr) minmax(0,1.02fr)`. Colour modifiers `--ink/--magenta/--white/--navy/--aqua`. Live sequence: ink, magenta, white, navy, aqua, white. `--i` must be an inline custom property (`services-stack.tsx:44`).                          | 336-359 |
| `.steps` / `.step`                     | 1 / 4     | Numbered process list. Two columns `clamp(46px,6vw,96px) 1fr`. 1px `rgba(255,255,255,.24)` rules top and (last child) bottom. `.step__r` is an aqua 1px rule that draws left-to-right over 1s with 0.14s stagger when `.in` latches. `.step__k` is the aqua 800-weight number.                                                                                                                                                                                                                                                          | 370-382 |
| `.qa`                                  | 1         | Native `<details>`/`<summary>` accordion — deliberately native so the CSS can hook `[open]` (`questions.tsx:1-7`). Rules `rgba(255,255,255,.22)`. Chevron is a 13×13 box with 2px aqua right+bottom borders rotated 45°, flipping to −135° when open. Body animates `grid-template-rows 0fr→1fr`. `max-width:62ch` on the answer.                                                                                                                                                                                                       | 432-446 |
| `.payhead` / `.paytoggle`              | 1         | Segmented pill toggle on a `rgba(14,14,18,.075)` track, `padding:4px`, `gap:4px`. Buttons `14.5px/600`, `padding:10px 20px`, `opacity:.6`, selected state `background:var(--ink);color:#fff;opacity:1` via `[aria-pressed="true"]`.                                                                                                                                                                                                                                                                                                     | 385-391 |
| `.price` / `.tiers` / `.tier`          | 1 / 1 / 4 | Desktop pricing = a `role="tablist"` column of rows plus a sticky detail pane. `.tier` rows are borderless buttons with 1px `rgba(14,14,18,.16)` rules; hover tints `rgba(14,14,18,.045)` and shifts 12px; `[aria-selected="true"]` goes solid ink and shifts 14px. `.tier__f` is **`text-align:right` explicitly** — the comment at 404-407 records that left alignment only lined up when figure and sub-label happened to be the same width.                                                                                         | 393-409 |
| `.detail` / `.detail__l`               | 1         | Ink pane, `radius calc(var(--r)*.7)`, `position:sticky;top:120px`, `grid-template-rows:auto auto 1fr auto` so the CTA always lands in the same place. `.detail__h{min-height:2em}` and `.detail__p{min-height:3em}` reserve lines so every tier's panel is the same height without hard-coding one (comment 417-419). `.detail__l` is the aqua-check list: `gap:9px`, `15px` text at `opacity:.9`, 15px aqua SVG with `margin-top:4px`.                                                                                                 | 413-427 |
| `.swap`                                | —         | `translateY(8px)→0` over `.45s`, replayed by remounting via a changing React key (`pricing.tsx:19-24,142`).                                                                                                                                                                                                                                                                                                                                                                                                                             | 428-429 |
| `.tiercards` / `.tcard`                | 1 / 4     | **Mobile-only** (hidden by `home-r9.css:555`, shown at 665). Whole cards instead of the tablist, because in one column the detail pane lands off-screen and a tap reads as nothing happening (comment 660-662). `.tcard--rec` inverts to ink with an aqua CTA and a magenta "Most popular" badge.                                                                                                                                                                                                                                       | 665-687 |
| `.quote`                               | 1         | §2.2. `.quote__a` is `15px/600`, `ls .03em`, with a `opacity:.66;font-weight:400` span for the attribution context.                                                                                                                                                                                                                                                                                                                                                                                                                     | 449-451 |
| `.end` / `.big`                        | 1 / 2     | The closing navy panel. `.end` overrides `.panel`'s centring: `align-content:stretch`, `grid-template-rows:1fr auto`, `gap:0`, top padding `clamp(170px,22vh,260px)`. `.big` is the oversized contact link: `clamp(1.3rem,3.6vw,3rem)/800`, `ls -.04em`, 2px `rgba(255,255,255,.3)` bottom border going aqua on hover. On mobile it becomes a full-width row with a chevron and `overflow-wrap:anywhere` (703-711) — the email is one 36-character unbreakable token.                                                                   | 454-465 |

### 6.2 Spare patterns — defined, tested by the stylesheet, unused on the homepage

Measured: `.card` 0, `.cards` 0, `.cards--2` 0, `.cards--3` 0, `.slot` 0,
`.mock` 0, `.row` 0, `.work` 0, `.svc` 0, `.svcs` 0, `.worksec` 0,
`.btn--ghost` 0, `.eyeless` 0 elements on the live homepage.

| Pattern          | What it is / real values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | lines            | Designed for                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `.card`          | The base card. `flex column`, `radius 18px`, `overflow:hidden`, ground `--paper` (or `#F4F3F1` on white panels, 218). A 2px magenta rule at the top scales in on hover (`::before`, 219-221). Hover lifts 5px with a 26px-blur shadow. `.card__well` is `aspect-ratio:16/11` on a navy ground; its media scales 1.05 over `.8s`. `.card__body` `14px 16px 17px`, `gap:5px`. `.card__tag` is an absolute pill at `top:10px;left:10px`, `rgba(255,255,255,.92)`, 10.5px uppercase 700.                                                                                                              | 215-233          | index grids — services, blog, locations                                                                                                       |
| `.cards`         | `display:grid`, `gap:clamp(12px,1.4vw,20px)`, `margin-top:clamp(28px,4.4vh,54px)`. Collapses to `clamp(18px,2.6vh,30px)` top under `max-height:1040px`.                                                                                                                                                                                                                                                                                                                                                                                                                                           | 165              | —                                                                                                                                             |
| `.cards--3`      | `repeat(3,minmax(0,1fr))`; 1 column below 900px (501, 514).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 166              | 3-up grids (6 services, 8 locations)                                                                                                          |
| `.cards--2`      | `repeat(2,minmax(0,1fr))`, gap `clamp(18px,2.1vw,34px)`, top `clamp(40px,6vh,72px)`. **A different card entirely**: `display:block`, white ground, **1px solid ink border**, `radius clamp(16px,1.7vw,24px)`, title bar _above_ the media separated by a 1px ink rule, `.card__well` `aspect-ratio:16/10` with square corners. The supporting line `.card__s` is a full-bleed `rgba(8,8,12,.82)` scrim revealed on hover **or `:focus-visible`**, its text rising 8px. Under `@media (hover:none)` it becomes a permanent bottom gradient (199-204) — because on touch there is no hover to give. | 167-204          | the portfolio grid. Round 1 used it for `/projects`.                                                                                          |
| `.slot`          | The "awaiting footage" placeholder — **a designed box, never blank space** (comment 206). `repeating-linear-gradient(45deg,#171A24 0 11px,#1E222E 11px 22px)`, a 34px aqua-ringed circle with a CSS-triangle play glyph, a 12px uppercase title and an 11.5px sub-line at `opacity:.62`.                                                                                                                                                                                                                                                                                                          | 207-214          | the 10 of 13 projects with no real video. **This is the honesty mechanism** — projects without footage get this, never a stand-in screenshot. |
| `.mock`          | A drawn browser mock: navy canvas, `padding:11% 9%`, skeleton bars at 45/60/70/80% width, a 3×3 cell grid, and **exactly one live element** — a magenta (or aqua) pill that pulses on a 4.6s `pop` keyframe while one grid cell steps on/off.                                                                                                                                                                                                                                                                                                                                                     | 236-249, 536-539 | representing a site where no real capture exists                                                                                              |
| `.row` / `.work` | A full-width list row: two columns `1fr auto`, 1px `rgba(14,14,18,.14)` rules, and a magenta fill that **wipes up from the bottom** (`transform-origin:50% 100%`, `scaleY(0)→1` over `.5s`, inset `-14px` horizontally so it bleeds past the text) turning both texts white. `.row__m` is `14.5px` `#5E5E68` right-aligned with a 12px uppercase `<em>` sub-line.                                                                                                                                                                                                                                 | 313-323          | a dense index — blog post list, location list                                                                                                 |
| `.svc` / `.svcs` | The dark-ground sibling of `.row`: 1px `rgba(255,255,255,.28)` rules, two columns, hover shifts `padding-left:14px`. `.svc__d` is right-aligned `14.5px`, `max-width:38ch`.                                                                                                                                                                                                                                                                                                                                                                                                                       | 362-367          | a services list on an ink/magenta panel                                                                                                       |
| `.worksec`       | A non-sticky white section with the same top-corner `--r` treatment. `padding:clamp(74px,9vh,120px) var(--pad) clamp(56px,8vh,96px)`. Its `.card`s sit on `#F4F3F1`.                                                                                                                                                                                                                                                                                                                                                                                                                              | 169-171          | **the closest thing to an inner-page section shell that already exists**                                                                      |
| `.btn--ghost`    | `background:transparent`, `color:var(--ink)`, `1.5px solid rgba(14,14,18,.24)`, hover darkens the border to solid ink and removes the shadow. **Light-ground only as written.**                                                                                                                                                                                                                                                                                                                                                                                                                   | 128-129          | secondary actions                                                                                                                             |
| `.eyeless`       | The section eyebrow: `12.5px`, `ls .11em`, uppercase, 700, `opacity:.55`, `margin-bottom:26px`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 156              | section labels on inner pages                                                                                                                 |

### 6.3 Incomplete / dead

- **`.cards--6` has no base rule.** It is referenced only at `home-r9.css:509`
  (2 columns ≤1080px) and `514` (1 column ≤900px). There is no rule setting its
  desktop column count, so above 1080px it falls back to `.cards`'s bare
  `display:grid` and renders as a single column. **Do not use it without
  defining a base rule** — flagged in §13.
- **`.bar nav a` is styled but the bar has no `<nav>`.** `home-r9.css:89-95`
  fully specifies nav links (14px/500, `opacity:.72`, an accent underline that
  scales in from the left over `.4s`), but `site-bar.tsx:29-82` renders only
  `.mark`, `.hire` and `.burger` — no `<nav>` element, and there is no
  `.bar nav{}` container rule anywhere in `home-r9.css`. So the link styling is
  dead code on the homepage. `shared.css:46` supplies the missing container
  (`display:flex;gap:clamp(16px,1.8vw,28px)`) and `shared.css:52` adds the
  `[aria-current]` active state. **This is why Tier 0 exists.**
- **`home-r9.css:528` is a mangled rule.** It reads
  `.hero__sub,.hero__act,  .hero__sub{animation-delay:.5s}.hero__act{animation-delay:.6s}  @keyframes up{...}` —
  a selector list with no declaration block, two `animation-delay` rules for
  animations never assigned, and a `@keyframes up` that nothing references.
  Harmless (no element animates), but do not copy it forward.

---

## 7. Responsive

The real breakpoints in `home-r9.css`, in source order. Note that **two are
height queries, and one of those is the one that governs a normal laptop.**

| Query                                           | Line    | What changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@media (min-width:901px)`                      | 291-294 | `.wpanel` scrim becomes horizontal (copy is a narrow left column, so weighting horizontally keeps more of the footage readable)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `@media (min-width:901px)`                      | 331-333 | `#services .res` and `.lead` take `opacity:var(--intro,1)` — the services intro fades out as the card stack rises, because `.svcstack` is transparent with ~94px between cards and the heading kept showing through (comment 325-330)                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **`@media (max-height:1040px)`**                | 471-496 | **The compressed desktop scale.** `h2` and `.wpanel__n` drop to `clamp(1.9rem,4.4vw,3.5rem)`; `.panel` padding drops to `clamp(70px,8vh,96px)`/`clamp(28px,4vh,48px)`; `.svc`, `.step`, `.row` padding halves; every `margin-top` rhythm collapses to `clamp(18px,2.6vh,30px)`; `.svccard` becomes `min(84vh,640px)` with `13vh` margin; `.card__well` becomes 16/9; `.quote` drops to `clamp(1.6rem,4vw,3.4rem)`. The comment (467-470) explains 1040 not 900: the process section runs ~891px of content, which doesn't fit a 901–1030px viewport, and a sticky full-viewport panel hides anything below the fold — so that content was _unreachable_, not merely cramped.              |
| `@media (max-width:620px)`                      | 497-499 | `.mark__type` hidden                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `@media (max-width:900px)`                      | 500-502 | `.cards--3`, `.cards--2` → 1 column                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `@media (max-width:820px)`                      | 503-507 | `.svccard` → single column, `height:auto`, `min-height:70vh`, `margin-bottom:9vh`, well `min-height:230px`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `@media (max-width:1080px)`                     | 508-510 | `.cards--6` → 2 columns                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `@media (max-width:900px)`                      | 511-523 | `.hero__head` → 1 column, sub-line left-aligned; `.row`, `.svc`, `.price` → 1 column; `.detail` `position:static`; `.hero` `padding-top:96px`, `min-height:auto`; **`.panel` becomes `position:relative;min-height:auto`** — the sticky stack is a large-screen affordance only                                                                                                                                                                                                                                                                                                                                                                                                           |
| `@media (prefers-reduced-motion:reduce)`        | 526     | `scroll-behavior:auto`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `@media (prefers-reduced-motion:no-preference)` | 527-542 | the entire reveal layer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `@media (hover:none)`                           | 560-580 | 21 rules neutralising every latching hover effect                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `@media (max-width:900px)`                      | 582-714 | **The authored mobile layer** — 133 lines, explicitly _authored, not reflowed_ (comment 544-551). Doctrine: 16px prose floor, 44px touch targets, display type sized from the longest unbreakable word, no eyebrow outweighing its heading. Safe-area `--pad` (585); `.hero` `min-height:100lvh` (601); `h1` `clamp(2.6rem,14.3vw,3.9rem)` (604); `.panel` `min-height:calc(100lvh + 110px)` — the +110px is dwell, because at exactly 100lvh the single-colour state lasts one frame at flick speed (comment 618-621); `h2` `clamp(2rem,8.6vw,2.4rem)` (623); `.svccard` `calc(100svh - 118px)` (644); pricing swaps to `.tiercards` (663-687); `.end` becomes full-width rows (700-713) |
| `@media (max-width:360px)`                      | 716-720 | `.big` `font-size:4.4vw`, chevron dropped, `.hero__m` gap 14px                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

**The finding that matters most here:** on a 1440×900 laptop — after browser
chrome, a **757px** viewport height — `max-height:1040px` **matches**. Measured
live: `matchMedia('(max-height:1040px)').matches === true`, and `h2` computed to
**56px** (= `3.5rem`, the compressed cap) not the 95px that `6.6vw` would give.
The `6.2rem` h2 maximum is effectively unreachable on ordinary hardware. **Design
and verify against the compressed scale**, and treat the uncompressed clamps as
the large-display case.

---

## 8. Interaction states

| State                           | Treatment                                                             | line    |
| ------------------------------- | --------------------------------------------------------------------- | ------- |
| `:focus-visible` (global)       | `3px solid var(--magenta)`, `outline-offset:4px`, `border-radius:2px` | 33      |
| `:focus-visible` inside `.bar`  | outline colour becomes `var(--bar-acc)` — so aqua on dark grounds     | 56      |
| `::selection`                   | magenta ground, white text                                            | 32      |
| Scrollbar                       | 9px, `--paper` track, **solid ink thumb**                             | 35-37   |
| Tap highlight (touch)           | `rgba(214,0,107,.16)` + `touch-action:manipulation`                   | 561     |
| `.cards--2 .card:focus-visible` | reveals `.card__s` identically to hover — keyboard parity is explicit | 193-196 |

---

## 9. Known traps

These are non-negotiable for any page built in this language. The first six come
from root `CLAUDE.md`; the rest are specific to this stylesheet.

1. **Never put `font-variant-numeric: tabular-nums` — or a monospaced face — on a
   figure containing a thousands comma.** `£1,995` renders as `£1 , 995`: the
   comma gets a full digit advance. It is invisible in markup, obvious on screen,
   and it corrupts a _price_. It **inherits**, so an ancestor breaks a figure that
   looks clean itself — resolve **both** `font-variant-numeric` and `font-family`
   up the ancestor chain when checking. `pricing.tsx:21-25` records this as Trap
   10 and states that `.tier__f`/`.tcard__f` deliberately carry no numeric
   font-variant styling. **Archivo only for comma'd figures.** Verified visually:
   `£1,495` and `£2,995` render correctly on the live pricing panel.
2. **Use `lvh`, not `svh`, for anything that must always cover the viewport.**
   `svh` is the _smallest_ viewport height (chrome expanded), so a `100svh`
   section becomes shorter than the screen the moment the URL bar retracts,
   leaking a strip of the next colour. The stylesheet does exactly this
   correctly at `271` (`.wpanel{height:100lvh}`), `269` (`.wstack::after`),
   `601` and `622`. Note `.panel` still uses `100svh` at `142` — acceptable
   only because below 901px it is overridden to `100lvh + 110px` (622).
   **Untestable in a desktop browser or iframe**, where all four units resolve
   identically. Apply by construction.
3. **A sticky element with no bound reports its _pinned_ position, not its
   layout position — which silently kills in-page anchor links.** Both
   `getBoundingClientRect()` and `offsetTop` return where it currently sits. On
   this very page, before the fix, every nav and footer link left the scroll at
   14392 and `offsetTop` returned 14391 for every section
   (`home-behaviour.tsx:53-62`). Nothing errors, the href is correct, and **it
   only reproduces when you are below the target** — testing from the top of the
   page passes. The fix is `layoutTop()` (`home-behaviour.tsx:132-138`):
   neutralise `position` to `static` for one synchronous measurement, read, and
   restore, then scroll yourself with `preventDefault()`. Any inner page that
   uses sticky sections **plus** in-page anchors inherits this obligation.
4. **`position: sticky` gets its room to pin only from in-flow content _after_
   the element.** A `margin-bottom` on the sticky element gives none (the spec
   clamps its _margin box_), and `padding-bottom` on the container gives none
   (padding is outside the content box). Both were tried here and both measured
   **0px of pin** for the last panel against 840–3940px for its siblings. The
   fix is real in-flow content: `.wstack::after{content:"";display:block;
height:100lvh}` (`home-r9.css:266-269`). **The last item in any sticky stack
   is the one that silently fails to pin.** Verify by sampling
   `getBoundingClientRect().top` across the scroll range.
5. **Never nest a `fixed inset-0` overlay inside an ancestor carrying
   `backdrop-filter` or `transform`.** Either makes that ancestor the containing
   block for `position:fixed` descendants, so the "fullscreen" overlay is confined
   to the ancestor's box. `.menu` must be a **sibling** of `.bar`, never a
   descendant of `<header>` — `mobile-menu.tsx:9-32` documents this as Trap 11
   and `home-body.tsx:43-44` composes them as siblings. The `transform` half
   bites independently: a nav centred with `translateX(-50%)` establishes a
   containing block with no `backdrop-filter` present at all. Centre with
   `left`/`right`/`margin-inline`. Verify by measuring the opened panel — a
   trapped overlay reports the nav's own box, a correct one reports the viewport.
6. **An arbitrary Tailwind breakpoint variant in `rem` emits zero CSS.**
   `min-[56rem]:flex` compiles to 0 rules against this platform's `px`-based
   `screens`; `min-[896px]:flex` compiles to 1. No warning. This hid an entire
   primary nav site-wide on `dpm-autobody`. Use `px` arbitrary values or a named
   `screens` entry. (Relevant at port time, Phase 5 — the prototypes are plain
   CSS.)
7. **A `<video autoPlay>` fetches real data on mount regardless of
   `preload="metadata"`** — autoplay forces the browser past metadata-only, so
   `preload` only controls behaviour when autoplay is absent. Seven background
   videos totalling 9.7MB were all fetched on load here, which is what inflated
   a throttled-4G Lighthouse LCP to 4.3s even though the LCP element was
   server-rendered text. Gate behind an `IntersectionObserver` — render the
   poster only, set `src` and call `.play()` when the panel nears the viewport:
   `lazy-video.tsx:38-76`, `rootMargin:'200px'`. **Gate `poster` too, not just
   `src`** — a `<video poster>` has no `loading="lazy"` equivalent and is fetched
   eagerly the instant the element is parsed (`lazy-video.tsx:14-21`). This cut
   the page from 10.5MB to ~700KB.
8. **Never use Tailwind's `theme()` function in plain CSS** — CSS parser panic.
   Use `var(--color-brand-primary)`.
9. **`body{overflow-x:hidden}` breaks every sticky panel on the page.**
   `overflow-x` anything but `visible`/`clip` makes the element a scroll
   container, and `position:sticky` sticks to its nearest scrollport — so the
   panels stuck to `<body>`, which never scrolls. Measured: all five work panels
   pinned for **0px** where the prototype pins them for 5200/4080/2960/1800/920px
   (`home-r9-reset.css:34-46`). **The page still rendered correctly at rest**,
   which is why it survived to Phase 10. The design uses `html{overflow-x:clip}`
   (`home-r9.css:29`) instead — `clip` does not create a scroll container.
10. **Preflight's `html{line-height:1.5}` inflates this design by ~150 elements'
    worth.** The port was authored against browser defaults and sets
    `line-height` only where it means to; inherited 1.5 inflated `.tiers` by
    66px, `.steps` by 46px and `.tier__f` by 15px and pushed everything below
    down by the accumulated difference (`home-r9-reset.css:16-21`). Any prototype
    HTML must reproduce the bare `*{box-sizing:border-box;margin:0;padding:0}`
    reset (`home-r9.css:24`) and **not** a Preflight-style normalise.
11. **`scroll-padding-top` must be `0`, not the bar height.** 84px landed a
    jumped-to section's top _below_ the nav's ground probe (~50px), so the bar
    kept the previous section's colour and the page stopped reading as one block
    (`home-r9.css:25-29`).
12. **The `.res` rest colour must be legible unaided.** Any headless render —
    Lighthouse included — catches the heading before the IntersectionObserver
    fires, at any viewport width (`home-r9.css:628-632`). A 1.5:1 rest state is a
    real accessibility failure, not a transient one.
13. **A new hover effect must be added to the `@media (hover:none)` block.** 21
    rules already live there because on touch a hover fires on tap and latches
    until you tap elsewhere (`home-r9.css:557-580`).
14. **Count-ups are banned.** §5.4.1.

---

## 10. Voice and honesty rules (they constrain the design)

- **First-person singular.** "I", not "we" — the homepage hero says "looked after
  by **me**" (`hero.tsx:32`), and `session.md:222` makes it a ground rule. A
  design that needs an "our team" block is the wrong design.
- **No photograph of Ricky exists.** Nothing may be presented as him or as a
  team (`session.md:216-219`). `/about` is the page where this binds hardest.
- **No fabricated client media.** Projects without real footage get `.slot`, not
  a stand-in screenshot (`session.md:217-219`, `brief.md:37-44`).
- **Static authored figures.** §5.4.1.

---

## 11. `kit.css` — what it contains and what it changed

`kit.css` sits beside this document. It is the stylesheet every Phase 2/3
prototype `<link>`s.

**It builds on `shared.css` rather than replacing it.** `shared.css` was round
1's first attempt at exactly this job and most of it was right. What `kit.css`
does differently is recorded here, and every change is deliberate.

### 11.1 Carried forward from `shared.css` unchanged

- The token block, with hardcoded hexes instead of `var(--color-*)` — correct for
  a static prototype with no theme system (`shared.css:8-15`).
- `img,video{max-width:100%;display:block}` (`shared.css:23`) — a real omission
  in `home-r9.css`, which never needed it because it never has a bare image.
- `.bar nav{display:flex;gap:clamp(16px,1.8vw,28px)}` (`shared.css:46`) — the
  container `home-r9.css` never defines (§6.3).
- `.bar nav a[aria-current]::after{transform:scaleX(1)}` (`shared.css:52`) — the
  active state, likewise absent from `home-r9.css`.
- `.cards--2 .card__tag{z-index:4}` (`shared.css:111`) — a genuine fix. In
  `home-r9.css` the base `.card__tag` is `z-index:2` (231) while `.card__s` is
  `z-index:3` (186), so on `.cards--2` the hover scrim covers the sector tag.
- `.cards--2 .card__t` as `display:flex` with a `<small>` slot
  (`shared.css:94-99`) — an extension of the title bar, not a new component.
- `.paytoggle{flex-wrap:wrap}` and `.count` (`shared.css:134,140`) — needed once
  the pill group carries five sector filters rather than two payment modes.
- `.empty` (`shared.css:141-144`) — the no-results state for a filter.
- The non-sticky `.panel` idea (`shared.css:78-79`) — see 11.2.

### 11.2 Deliberate divergences, and why

| Thing                        | `home-r9.css`                                                            | `shared.css`                                                              | `kit.css` does                                                                                                                                                                                                | Why                                                                                                                                                                                                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.panel` position            | `sticky;top:0;min-height:100svh` (142)                                   | non-sticky, `padding:clamp(110px,16vh,180px) …` (78)                      | keeps `shared.css`'s non-sticky `.panel` as the default **and** carries the homepage's sticky behaviour scoped to `.stack .panel`                                                                             | inner pages are not a chapter stack; but a page that _does_ want one needs the real rules, not an approximation. Scoping to `.stack` is the only change — `.stack` is a real existing class (`home-r9.css:136`, `home-body.tsx:49`) and on the live page `.panel` is only ever sticky inside it. |
| `h1`                         | `clamp(2.3rem,8.9vw,8.8rem)` (112)                                       | `clamp(2.3rem,7vw,6.4rem)` (71)                                           | keeps both — `h1` at `shared.css`'s inner-page size, `.stack h1`/`.hero h1` at the homepage size                                                                                                              | an inner-page masthead at 8.8rem would out-shout the homepage. Round 1 already made this call and it rendered well.                                                                                                                                                                              |
| `h2`                         | `clamp(2.2rem,6.6vw,6.2rem)`, `lh .9`, `max-width:17ch` (154)            | `clamp(2rem,5vw,4.2rem)`, `lh .94`, no max-width (72)                     | keeps `shared.css`'s                                                                                                                                                                                          | same reason                                                                                                                                                                                                                                                                                      |
| `h3`                         | **no rule at all**                                                       | `clamp(1.5rem,2.6vw,2.2rem)/800/-.03em/1.02` (73)                         | keeps `shared.css`'s                                                                                                                                                                                          | `home-r9.css` styles `h3` only through component classes (`.wpanel__n`, `.svccard__t`). Inner pages need a default. The values sit correctly inside the tracking/leading progression in §2.2.                                                                                                    |
| `.lead`                      | `mt 22px`, `52ch`, `clamp(1rem,1.28vw,1.2rem)`, `lh 1.5`, `op .94` (155) | `mt 18px`, `56ch`, `clamp(1rem,1.22vw,1.16rem)`, `lh 1.55`, `op .92` (75) | keeps `shared.css`'s                                                                                                                                                                                          | slightly longer measure and looser leading for pages that are read rather than scrolled past                                                                                                                                                                                                     |
| `.eyeless`                   | `op .55`, `mb 26px` (156)                                                | `op .6`, `mb 16px` (74)                                                   | keeps `shared.css`'s                                                                                                                                                                                          | 26px below an eyebrow is homepage-panel spacing; 16px is right above a masthead h1                                                                                                                                                                                                               |
| `.quote`                     | `clamp(1.8rem,5.4vw,4.6rem)`, `lh 1.02`, `19ch` (449)                    | `clamp(1.6rem,3.6vw,2.6rem)`, `lh 1.05`, `34ch` (152)                     | keeps **both**, `shared.css`'s as default and the homepage's as `.quote--hero`                                                                                                                                | per D3 the three testimonials go _inside_ pages, where the 4.6rem version would dominate. Two sizes of one pattern, not two patterns.                                                                                                                                                            |
| `.paytoggle`                 | `14.5px`, `padding 10px 20px`, track `.075` (386-388)                    | `13.5px`, `padding 9px 16px`, track `.06` (134-137)                       | keeps `shared.css`'s                                                                                                                                                                                          | five filter chips need to fit; the homepage's two payment modes do not                                                                                                                                                                                                                           |
| `.detail__l`                 | `gap 9px`, `15px`, svg 15px, `op .9` (424-426)                           | `gap 12px`, `16px`, svg 16px, no opacity (147-149)                        | keeps `shared.css`'s                                                                                                                                                                                          | on the homepage it is inside a compact ink pane; on a content page it is body copy and takes the 16px prose floor                                                                                                                                                                                |
| `.btn--ghost`                | `color:var(--ink)`, border `rgba(14,14,18,.24)` (128)                    | `color:inherit`, border `rgba(255,255,255,.4)` (67)                       | **carries both, explicitly** — `.btn--ghost` for light grounds (verbatim from `home-r9.css`) and `.p--ink .btn--ghost`/`.p--navy .btn--ghost`/`.p--magenta .btn--ghost` for dark, using `shared.css`'s values | this is a straight conflict between the two files. Neither is wrong; they are the same button on opposite grounds. Grounding the selector resolves it without inventing a value. **Flag for Phase 2 to confirm.**                                                                                |
| `html`                       | `scroll-padding-top:0` (29)                                              | omitted                                                                   | carries `home-r9.css`'s explicitly, with the comment                                                                                                                                                          | it is load-bearing (§9.11) and `shared.css` dropping it is a latent bug                                                                                                                                                                                                                          |
| `.cards--6`                  | media queries only, no base (509, 514)                                   | absent                                                                    | **omitted entirely**                                                                                                                                                                                          | an incomplete pattern is worse than no pattern. Listed as a gap.                                                                                                                                                                                                                                 |
| `@media (hover:none)`        | 21 rules (560-580)                                                       | absent                                                                    | carried across for every pattern the kit includes                                                                                                                                                             | round 1 dropped it; on touch every hover in the kit latches on tap                                                                                                                                                                                                                               |
| `@media (max-height:1040px)` | 26 rules (471-496)                                                       | absent                                                                    | carried for the patterns the kit includes                                                                                                                                                                     | this is the _normal laptop_ case (§7), not an edge case                                                                                                                                                                                                                                          |
| `--f`                        | `var(--font-archivo), …` (19)                                            | `'Archivo', …` (11)                                                       | keeps `shared.css`'s literal                                                                                                                                                                                  | a static prototype has no `next/font` variable. The prototype HTML must load Archivo 400–900 + Poppins 300 with a real `<link>` (as `project-list.html:7-9` does) — **never a CSS `@import`**, which Tailwind's expansion buries mid-file and the browser silently ignores per spec.             |

### 11.3 What `kit.css` does NOT contain

No component that does not already exist in `home-r9.css` or `shared.css`. In
particular it contains **no breadcrumb, no page masthead, no page-level footer
and no active-nav treatment beyond `shared.css:52`** — those are Tier 0 and
belong to Phase 2. See §13.

---

## 12. Discrepancies found between CSS and components

Per ground rule 4, the component wins. These are the places they disagree.

1. **`.bar` has no `<nav>`.** `home-r9.css:89-95` styles `.bar nav a`;
   `site-bar.tsx:29-82` renders no `<nav>`. Dead code on the homepage, and the
   reason inner-page nav has no shipped reference. **Component wins: there is
   currently no nav.** Phase 2 designs it; the CSS for the link treatment is
   already there and should be used.
2. **`.burger` renders two bars, and the CSS styles a three-bar burger by
   implication.** `home-r9.css:74-75` transforms `span:first-child` and
   `span:last-child` only; `site-bar.tsx:78-79` renders exactly two spans. These
   agree — but note that adding a middle bar would need a new rule to hide it.
   Recording it because it reads like an omission and is not one.
3. **`.wpanel` background is set inline in the component, not in the CSS.**
   `work-stack.tsx:40` sets `style={{backgroundColor:'var(--ink)'}}` on every
   panel. The CSS gives `.wpanel` `color:#fff` (271) but no background. The
   reason is in `lazy-video.tsx:22-26`: until the observer fires there is no
   video, and `.wstack` is white, so the panel would flash white. **Any
   full-bleed lazy-video panel must carry its own dark background.**
4. **`.hero` uses `min-height:100svh` (142/107) where the mobile layer correctly
   uses `100lvh` (601).** Not a bug at the desktop breakpoint, but the desktop
   rule is the `svh` one and it is the pattern an inner-page hero would copy.
   Use `lvh`.
5. **`home-r9.css:528` is syntactically broken** (§6.3). No component references
   it.
6. **`.plate` is described in `hero.tsx:23-28` as carrying no `data-t` and never
   being split**, which the CSS cannot express. Anyone reusing `.plate` must
   keep it out of any per-character splitting.
7. **`.end`'s nav is anchors-only by explicit instruction**
   (`end-section.tsx:8-11`: "Do not add links to /services, /pricing, /blog or
   any other route"). That instruction is scoped to the homepage as it stands
   today and is superseded by decision D1 (`session.md:129-135`). Phase 2 should
   note that the comment will need updating at port time.
8. **`.detail` is `position:sticky;top:120px`** (416) — a hardcoded offset that
   assumes the 81px bar plus clearance. Any inner page reusing `.detail` at a
   different bar height inherits a wrong number.

---

## 13. Gaps — for Phase 2 to design

Listed, not designed. Each says what exists today so Phase 2 starts from
material rather than from nothing.

| #   | Gap                                                                 | What already exists                                                                                                                                                                                                                                                                                                                                                                      |
| --- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | **Persistent header nav with real page links and an active state.** | Link treatment at `home-r9.css:89-95`; container and `[aria-current]` at `shared.css:46,52`; the round-1 bar renders correctly (verified in `project-list.html`). No mobile behaviour for it — `.menu` (77-88) is anchor-only in `mobile-menu.tsx:52-68`.                                                                                                                                |
| G2  | **Page-level footer.**                                              | `.end` (454-465) is the homepage's closing _chapter_, full-height and centred, not a footer. `.end__nav` + `.end__foot` (457-461) are reusable. `project-list.html:13-14` shows a shortened non-sticky `.end` at `clamp(90px,12vh,140px)` top padding. Per D2 the 8 location links belong here, not in the primary nav.                                                                  |
| G3  | **Page masthead.**                                                  | `project-list.html:3-6` overrides `.hero` to `clamp(150px,20vh,220px) var(--pad) clamp(48px,7vh,80px)` on ink, plus a `.credentials` rule (a bordered stats row). `shared.css:79` has `.panel--tight`. Neither is promoted.                                                                                                                                                              |
| G4  | **Breadcrumb / return path.**                                       | `project-post.html:2-5` defines `.crumb`: `padding:clamp(90px,12vh,124px) var(--pad) 0`, `13.5px`, links at `opacity:.6` going aqua on hover, separator span at `opacity:.35` with `margin:0 8px`. **Page-local only — deliberately not promoted into `kit.css`.** Phase 2 should decide whether to adopt it as-is.                                                                      |
| G5  | **Long-form prose / article body.**                                 | `project-post.html:15-18` `.body`: `max-width:74ch`, `padding:clamp(56px,8vh,88px) var(--pad)`, `p` at `16.5px/1.7/opacity:.86`, `h2` at `clamp(1.7rem,3vw,2.4rem)` with `margin-top:clamp(40px,6vh,60px)`. Nothing for lists, blockquotes, inline links, code or images in flow. `/blog/[slug]` is where "the r9 chapter-panel language has to yield to legibility" (`session.md:101`). |
| G6  | **Form controls.**                                                  | **Nothing at all.** No input, textarea, select, label, error or success styling anywhere in `home-r9.css` or `shared.css`. `home-r9-reset.css:80-88` deliberately `revert`s controls to the UA. `/contact` needs the whole set, plus the success state (`session.md:93`).                                                                                                                |
| G7  | **`cf--navy` and `cf--paper`.**                                     | `home-r9.css:138-141` defines four modifiers; `chapter-panel.tsx:43` types four. Any sequence opening a panel below a navy or paper pane needs a fifth/sixth.                                                                                                                                                                                                                            |
| G8  | **`.cards--6` base rule.**                                          | `home-r9.css:509,514` only (§6.3).                                                                                                                                                                                                                                                                                                                                                       |
| G9  | **A second filter axis.**                                           | D4 (`session.md:167-172`) requires topic **and** sector on `/blog`. `.paytoggle` gives one axis; two stacked pill groups is untested.                                                                                                                                                                                                                                                    |
| G10 | **Pagination / "load more".**                                       | Nothing. `/blog` must not degrade into a wall at 40–60 posts (`session.md:173`).                                                                                                                                                                                                                                                                                                         |
| G11 | **404 treatment.**                                                  | Nothing. Currently generic Tailwind + lucide (`session.md:118`).                                                                                                                                                                                                                                                                                                                         |
| G12 | **Related-items grid.**                                             | `project-post.html:24-32` `.related-grid` exists page-locally: 2 columns, `18px` radius, 1px ink border, `16/10` well. Close to `.cards--2` but not the same. Phase 2 should reconcile them rather than keep both.                                                                                                                                                                       |
| G13 | **Dark-ground `.btn--ghost`.**                                      | Conflict between `home-r9.css:128` and `shared.css:67`, resolved provisionally in `kit.css` by grounding the selector (§11.2). Needs a decision.                                                                                                                                                                                                                                         |
| G14 | **Non-selectable tag/chip.**                                        | `.card__tag` (231-233) is a positioned overlay pill; there is no in-flow tag for a post's categories.                                                                                                                                                                                                                                                                                    |

---

## 14. What could not be verified

Stated plainly rather than glossed.

- **No mobile render.** `resize_window` reported success but the viewport stayed
  at 1380×757 (`innerWidth` re-read after each attempt at 390×844 and 520×900;
  `matchMedia('(max-width:900px)').matches === false` throughout). So the entire
  133-line authored mobile layer (`home-r9.css:582-720`) is specified here from
  the source and its comments, **not from a rendered view**. Phase 2 must render
  at 390px itself before trusting any mobile value in §7.
- **`lvh` vs `svh` is untestable here anyway** — in a desktop browser all four
  viewport units resolve identically (§9.2). It remains a construction rule.
- **`prefers-reduced-motion` and `hover:none` branches were not exercised.**
- **Real R2 video/poster loading was not profiled**; the `LazyVideo` behaviour is
  taken from `lazy-video.tsx` and its comments.
- **The `.bar` ground value lags a jump-scroll by a few hundred milliseconds.**
  After an instant `scrollTo`, `data-ground` read the _previous_ section's value
  for ~1s at three different positions before settling correctly. This is the
  0.55s CSS crossfade plus the rAF+React commit, not a bug — but it means
  `data-ground` cannot be asserted immediately after a programmatic scroll.
- **`test/home-css-parity.test.ts` was not run.** Its existence and claim are
  cited from `home-r9-reset.css:5-6`.

### What _was_ verified about `kit.css`

`kit.css` was loaded into a real browser and rendered, not just written.

- **Parsed clean:** 60,903 bytes, 269 top-level rules, **2,554 declarations
  retained by the CSS parser, and zero rules with all declarations dropped**.
  A syntax error would show up as an empty rule; there are none.
- **Rendered:** a smoke page exercising `.bar` + `.bar nav [aria-current]` +
  `.hire` + `.burger`, `.eyeless`, `h1`, `.lead`, `.btn`, `.btn--ghost`,
  `.svcs`/`.svc`, `.p--ink`/`.p--white`/`.p--navy`, `.filterbar` + `.paytoggle`
  - `.count`, `.cards--2` + `.card__t--row` + `.card__tag`, `.slot`, `.mock`,
    `.tiers`/`.tier[aria-selected]`/`.tier__f`, `.quote`/`.quote__a`,
    `.detail__l` and `.end__foot` all rendered correctly at 1481px.
- **The accent-swap rule works as specified:** on `data-ground="ink"` the
  `.hire` pill rendered **aqua** and the active-nav underline rendered aqua,
  with no per-component override needed.
- **The `.btn--ghost` ground resolution works:** the ghost button rendered with
  a white border on the ink panel and would render ink-bordered on a light one.
- **The comma trap was re-verified in the kit itself:** `£1,495` and `£2,995`
  rendered with correct comma spacing in `.tier__f`.
