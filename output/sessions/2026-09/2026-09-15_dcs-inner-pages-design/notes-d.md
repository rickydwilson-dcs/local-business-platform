# Phase 3 — Agent D: `/contact` (+ success) and the 404

**Deliverables**

| File                        | What                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| `prototype/contact.html`    | `/contact`, carrying the success state in the same page                                       |
| `prototype/404.html`        | the 404                                                                                       |
| `kit-additions-d.css`       | the form-control family (G6), the success panel, and four fixes to things the kit already had |
| `prototype/_d_harness.html` | 390 × 844 iframe harness — three frames, used for every mobile measurement below              |

`kit.css` was **not edited**. `kit-additions-d.css` is linked after it in both pages.

---

## 1. How the form language was derived

There is no form styling anywhere in this design — `home-r9.css`, `shared.css` and
`kit.css` contain no input, textarea, select, label, error or success rule, and
`home-r9-reset.css:80-88` deliberately `revert`s `button`, `input`, `optgroup`, `select`
and `textarea` back to the browser default. So the question was not "what should this
look like" but "what does this design already believe about interactive surfaces".

It turns out to believe five things, and they agree with each other:

| The design already does this                                                                                                                      | Where                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| An **empty interactive surface** is a 1.5px border that goes **solid `currentColor`** on engagement                                               | `.btn--ghost` / `:hover` — `home-r9.css:128-129` + `shared.css:67-68`                                            |
| A **thing you act on** is a full-width row on a 1px rule, label left, value right                                                                 | `.tier` (a real `<button>`), `.row`, `.svc`, `.qa summary` — four separate implementations                       |
| **Engagement is announced by a rule that draws in from the left** — `transform-origin:0 50%`, `scaleX(0)→1`, the `cubic-bezier(.16,1,.3,1)` curve | `.bar nav a::after` 1.5px/.4s · `.panel::before` 3px/1.1s · `.step__r` 1px/1s — the same gesture at three scales |
| **Confirmed / included** is an aqua check on a dark ground                                                                                        | `.detail__l` — kit.css §17 calls it "the design's one included/confirmed idiom"                                  |
| An **accent swaps by ground**: aqua on ink/magenta/navy, magenta on paper/white/aqua                                                              | design-kit.md §1.4                                                                                               |

The whole field set falls out of that:

- **The field is a `.tier`-anatomy row.** Rest state is a 1px rule. Hover takes the rule
  solid `currentColor` — one declaration that reproduces both of `.btn--ghost`'s
  ground-specific hover rules, because `currentColor` is ink on a light panel and `#fff`
  on a dark one, which is exactly what those two rules spell out separately.
- **Focus is the rule drawing in from the left**, at 2px (`.card::before`'s weight — the
  nav's 1.5px sits under 14px text, a panel's 3px spans the viewport, a field is between).
  Absolutely positioned over the rest rule, so the control does not change height.
- **The label is `.eyeless`**, verbatim. design-kit.md §2.3: the 10.5–12.5px / 700 /
  uppercase / positive-tracking micro-cap is "the only uppercase in the design" and it is
  the label idiom. A form label is a label. Nothing to invent.
- **The select's chevron is `.qa summary::after`'s construction** (a square with 2px
  right + bottom borders, rotated 45°) at `.big::after`'s 9px size.
- **The success state is `.detail`** — the ink pane the homepage uses to say "here is the
  thing, resolved, and here is what it includes" — with `.detail__l`'s aqua checks. A
  confirmation is that sentence. The form is light and open and being worked on; it
  resolves into a solid ink panel. Its arrival is `.swap` (`translateY(8px)→0`, which
  exists precisely for "this content just replaced that content", `pricing.tsx:19-24`)
  plus `.panel::before`'s 3px accent rule drawing in over 1.1s.
- **Pending is a rule sweeping across the button**, not a spinner. This design has no
  spinner and should not acquire one: its idiom for "something is happening" is a rule
  drawing across a surface. Same 1.5px, same 1.1s as `.panel::before`.

**What was deliberately refused**, because it would have been imported rather than
derived: rounded input boxes, a red error colour, a green success tick, floating labels,
a spinner, and a submit button disabled until the form validates.

Two of those are worth spelling out.

- **No red.** The palette is seven tokens and none is red. Adding one would be a brand
  change, not a styling choice. Magenta is already "the action colour" (design-kit §1.1)
  and is the only attention colour this design has, so the error state is a 2px magenta
  rule plus a glyph plus a sentence — never colour alone.
- **The submit is never disabled as a validation gate.** A button disabled until the form
  is valid never says why, cannot be focused to find out, and is a well-known
  accessibility failure. The button is always live; pressing it with an invalid form runs
  validation, flags the fields, announces a summary and moves focus to the first bad one.
  The disabled treatment is still specified (`opacity:.45`) and is used for exactly one
  thing — the fields and the button while a request is in flight.

---

## 2. Reuse versus invention

### Reused, no new value

`.bar`, `.mark`, `.burger`, `.hire`, `.menu`, `.crumb`, `.mast`, `.mast__meta`, `.sec`,
`.pagefoot`, `.footmap`, `.end__main`, `.end__foot`, `.big`, `.eyeless`, `h1`, `h2`,
`.lead`, `.btn`, `.btn--ghost`, `.hero__act`, `.res`, `.detail`, `.detail__l`, `.count`,
`.plate`, `.work`/`.row`, `.swap`, and the `.panel::before` arrival rule.

**The 404 needed no new CSS at all.** Masthead, `.plate` on one word, a `.sec`, six
`.row`s and the footer. `.row`/`.work` is a _spare_ pattern — design-kit.md §6.2 records
0 uses on the live homepage and "designed for a dense index" — so this is its first real
outing, which is what ground rule 3 asks for before anything gets invented.

### Borrowed for a new component (cited, not new numbers)

| Value                                                         | From                                                                                               |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| field gap `clamp(18px,2.6vh,30px)`                            | home-r9.css:482 — the compressed rhythm, which design-kit §7 establishes is the normal laptop case |
| label→control gap `8px`                                       | `.tcard__l`'s gap, home-r9.css:680                                                                 |
| control `16px / 1.5`                                          | `.detail__l div`, kit.css:742 — also the 16px floor below which iOS zooms on focus                 |
| control block padding `12px`                                  | `.hire`, home-r9.css:97 → a 49px control, clear of 44px with no mobile rule                        |
| helper `13.5px / opacity .66`                                 | `.end__foot`, home-r9.css:461; leading 1.45 is `.tcard__p`'s                                       |
| inline error `14.5px / 600`                                   | `.hire`, home-r9.css:98                                                                            |
| error glyph `15px`, `margin-top:3px`, `gap:10px`              | `.tcard__l svg`, home-r9.css:682                                                                   |
| invalid rule `2px`                                            | `.card::before` / `.big`, home-r9.css:219                                                          |
| `.formerr` surface `1px` border / `18px` radius / `22px 20px` | `.tcard`, home-r9.css:669-670                                                                      |
| `.formerr` border alpha `.5`                                  | `.prose a`'s resting underline alpha (from home-r9.css:305)                                        |
| `.formerr` fill alpha `.06`                                   | `.paytoggle`'s track, home-r9.css:386                                                              |
| `.formerr` type `15.5px / 1.5`                                | `.detail__p`, home-r9.css:423                                                                      |
| `.done` padding `clamp(24px,3.4vw,58px)`                      | `.svccard__body`, home-r9.css:347                                                                  |
| `.done h2` type                                               | `.detail__h` without its `min-height`, home-r9.css:422                                             |
| `.done__next` rule `.22` + `clamp(20px,3vh,32px)`             | `.qa`'s dark rule + `.end__foot`'s padding                                                         |
| `.cols` `1.05fr` ratio, `clamp(22px,3.4vw,58px)` gap          | `.price`, home-r9.css:393                                                                          |
| `.detail--flow a.line` size `clamp(1.15rem,2.3vw,1.75rem)`    | `.tier__n`, home-r9.css:402                                                                        |
| `.detail--flow a.line::after` chevron                         | `.big::after`, home-r9.css:709                                                                     |
| select chevron construction                                   | `.qa summary::after`, home-r9.css:441                                                              |
| textarea `min-height:168px`                                   | six of the control's own 24px line boxes + its 24px padding — derived from the control, not chosen |
| pending sweep `1.5px / 1.1s`                                  | `.bar nav a::after`'s weight, `.panel::before`'s duration                                          |

### Invented — the full list

| Value                                                              | Where                              | Why there was nothing to copy                                                                                                                                                                                                                                                    | Status         |
| ------------------------------------------------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `--frule` alphas: `.46` light, `.5` aqua, `.4` dark, `.75` magenta | D1                                 | **The only measured requirement that overrode a kit value.** See §3.                                                                                                                                                                                                             | measured       |
| `opacity:.45` disabled                                             | `.f__c:disabled`, `.btn[disabled]` | `.paytoggle button` is `.6` for "available but unselected", so disabled has to read clearly weaker. WCAG 1.4.3 exempts inactive components, which is why a value this low is defensible here and nowhere else.                                                                   | reasoned       |
| `translateY(-68%)` on the select chevron                           | D3                                 | A 45°-rotated square's optical centre sits below its box centre. `.qa summary::after` corrects the same thing with `translate(-3px,-3px)` on a 13px glyph; at 9px that is proportionally ~2.1px, i.e. −68% of the box off the 50% line. Optical, checked by eye at 1440 and 390. | optical        |
| sweep bar `width:40%`, travel `-100% → 350%`                       | D6                                 | Geometry for an indeterminate bar. No possible source.                                                                                                                                                                                                                           | geometry       |
| `[hidden]{display:none!important}` and `.vh`                       | D0                                 | Infrastructure, not design values — see §3.                                                                                                                                                                                                                                      | infrastructure |
| `rgba(255,255,255,.06)` was **considered and not used**            | —                                  | I wanted a dark-ground equivalent of `.tier:hover`'s `rgba(14,14,18,.045)` tint for the focused field. There is no dark sibling in the kit, and the 2px accent rule turned out to be sufficient on its own, so the tint was dropped rather than invented.                        | dropped        |

Everything else in `kit-additions-d.css` carries the rule it came from, inline.

---

## 3. The four things I changed that were not my components

These are in my file because my page hit them, but they are kit-level and Phase 4 should
consider folding them in.

**(a) `[hidden]` does not work in this kit.** `kit.css`'s reset (`home-r9.css:24`) has no
`[hidden]` rule, and the UA default `[hidden]{display:none}` _loses_ to any author
`display:` declaration. Every component here that is revealed by script — `.f__e`,
`.formerr`, `.done` — sets `display:grid` or `display:flex`, so all three rendered on
page load in the first draft. **Found by rendering.** Fixed with
`[hidden]{display:none!important}`; it belongs in kit.css §02.

**(b) `.detail` is an ink ground with no ground _class_.** `.detail` (`home-r9.css:413`)
hardcodes `background:var(--ink);color:#fff` but carries no `.p--ink`, so every selector
in this kit that resolves by ground class silently misses inside it. The one that bites is
`.btn--ghost`: §06 gives the base rule `color:var(--ink)` and only `.p--ink .btn--ghost`
flips it to white, so a ghost button inside an ink `.detail` renders **ink on ink**.
Measured at `rgb(14,14,18)` on `#0E0E12` — **1.02:1, invisible**. **Found by rendering**,
in the success panel's "Back to the top" button.

Phase 2 had already found the other half of this and written the principle down
(`phase2-notes.md` §4): `.mast` and `.pagefoot` carry no ground of their own _precisely_
so they compose with `.p--*` "rather than hardcoding a background inline the way round 1
did". `.detail` predates that decision. Rather than ask every agent to remember to put
`.p--ink` next to `.detail`, the tokens and the one grounded rule are attached to
`.detail` itself, using kit.css §06's own dark-ground values.

**(c) There is no ground accent _token_.** design-kit.md §1.4 states the accent-swap rule
and kit.css §04 implements it for the bar only (`--bar-acc`, driven by `[data-ground]`).
Panels carry `.p--*`, not `[data-ground]`, so there is no token available inside a
section — which is why Phase 2 had to write four-selector ground lists by hand for
`.prose a`, `.prose ul li::before`, `.prose ol li::before`, `.prose blockquote` and
`.prose hr`. `--acc` is that rule as a token. **Phase 4: those five Phase 2 rules collapse
to `var(--acc)` once this lands.**

**(d) `--frule` is darker than `.tier`'s rule, on purpose.** The obvious choice for a
field's rest rule was `.tier`'s own `rgba(14,14,18,.16)` — `.tier` is a `<button>`, it is
the design's "row you can act on", and the field is derived from it. Measured, that rule
is **1.42:1** against white and **2.44:1** (at `.svc`'s `.28`) against ink. WCAG 1.4.11
wants 3:1 for the visual information that identifies a UI component, and for an _empty_
text field the rule is the only thing identifying it. `.tier` gets away with `.16` because
a tier row is full of text at rest; a blank field is not.

Measured ladder, computed in the browser against the real hexes:

| ground  | kit's alpha | ratio | used  | ratio                   |
| ------- | ----------- | ----- | ----- | ----------------------- |
| white   | `.16`       | 1.42  | `.46` | **3.19**                |
| paper   | `.16`       | 1.41  | `.46` | **3.09**                |
| aqua    | `.28`       | 1.81  | `.5`  | **3.13**                |
| ink     | `.28`       | 2.44  | `.4`  | **3.79**                |
| navy    | `.28`       | 2.42  | `.4`  | **3.50**                |
| magenta | `.34`       | 1.51  | `.75` | ~3.0 — marginal, see §9 |

**Known consequence:** a field rule is visibly darker than a `.tier` or `.row` rule. On
this page nothing else on the white ground carries a rule, so there is no clash — but a
page that puts a form beside a `.tiers` list will show two rule weights. That is the
correct trade; one of them has an accessibility requirement the other does not. Phase 4
should decide whether it wants that visible or wants `.tier` raised to match.

---

## 4. The fields, and why these five

`packages/core-components/src/lib/api/contact-route.ts` reads `name`, `email`, `phone`,
`subject`, `service`, `location`, `message` and the honeypot `website`, with maxlengths
100 / 254 / 30 / 200 / 100 / 100 / 2000. The prototype shows five plus the honeypot, and
every `maxlength` matches the handler's own limit so the client never allows something the
server will reject.

- **`subject` omitted** — the handler derives it itself when absent
  (`contact-route.ts:211`: `New enquiry from {name} - {service} ({location})`). Asking for
  it would be asking someone to write a worse subject line than the code already writes.
- **`location` omitted as a field**, asked for in the message helper instead ("What the
  business does, **where you are**, and what you want the site to do"). Six fields on a
  studio's contact page is a form; five is a conversation.
- **`service` kept, as the `<select>`** — it is the one field that justifies designing a
  select at all, and the handler puts it in the subject line. The options are the six real
  MDX files in `sites/dcs/content/services/`, plus "I'm not sure yet" as the default and
  "Something else".

---

## 5. In-page success, not a route — and the argument

**Decision: in-page.** Four reasons, in order of weight:

1. **The endpoint is not redirect-shaped.** It returns `{success:true, message}` as JSON
   (`contact-route.ts:160-163`). A `/contact/thank-you` route would need either a redirect
   the handler does not issue, or a client-side `router.push` — which is the same
   JavaScript dependency as an in-page swap, with a navigation on top.
2. **Context is worth keeping.** The panel names the person and restates the address the
   reply is going to — _"I'll reply to ricky@example.co.uk"_ — so a typo is catchable at
   the one moment it can still be fixed. A separate route can only do that through query
   parameters, which puts an email address in a URL, a referrer header and every analytics
   hit. Root `CLAUDE.md`'s privacy rule says not to.
3. **Conversion tracking does not need a URL.** GA4 is event-based; a `generate_lead`
   event fires from the success handler. The plan flagged a URL "only if conversion
   tracking needs one" (`session.md:93`) — it doesn't. _If_ a Google Ads destination-URL
   conversion rule is ever wanted, adding `history.replaceState` to `/contact/sent` on
   success is a one-line addition that keeps everything above.
4. It is one fewer route to build, `noindex`, and keep consistent with the rest.

**What happens on success**, exactly:

- The form is hidden, the panel is revealed and `.in` is added on the next frame so the
  3px aqua arrival rule has a 0-state to run from.
- A separate visually-hidden `role="status" aria-live="polite"` element is set to
  _"Message sent."_ — terse, and separate from the panel so the panel can take focus
  without being read twice. Revealing a live region _and_ focusing it double-announces in
  several screen readers.
- Focus moves to the panel (`tabindex="-1"`), and the page scrolls to it with the bar
  height subtracted by hand.
- The panel sits **before** the form in the DOM, so revealing it moves focus forward
  through the document rather than backwards past a hidden region.

---

## 6. Findings in the shipped code — the contact form does not work

Three separate faults, all verified by reading the shipped source rather than inferred.
These are Phase 5 work, not prototype work, but they change what the port has to do.

1. **The shipped form cannot reach its own endpoint.**
   `ContactPage.tsx:28` posts natively: `<form action="/api/contact" method="POST">`. The
   handler's first statement is `validateCsrfToken(request)` (`contact-route.ts:52`),
   which requires an `x-csrf-token` header (`csrf.ts:256-269`) obtained from
   `/api/csrf-token`. A native form POST sends no such header, so **every submission gets
   a 403 before the handler parses anything**. Even past that, the body would be
   `application/x-www-form-urlencoded` and the handler calls `request.json()`
   (`contact-route.ts:84`) → 400.
2. **The honeypot is wired to the wrong name.** The handler checks `body.website`
   (`contact-route.ts:95`); the page renders `name="_gotcha"` (`ContactPage.tsx:32`). The
   handler never reads `_gotcha`, so the live honeypot does nothing. The prototype's field
   is named `website`.
3. **The page's own copy contradicts the API's.** The page says "We usually respond within
   a few hours"; the auto-reply the API sends says "We will get back to you within 24
   hours" (`contact-route.ts:162`). The prototype uses _one working day_ throughout, which
   matches the API's claim and is the safer one.

Consequence for **ground rule 13** ("never gate content visibility on JS alone"), stated
plainly: the _page_ is not gated — the form is fully visible and fully usable with no
script, the success panel is `hidden` in the markup so a dead script can never hide
content, and `novalidate` is added _by script_ so the browser's own validation stays in
place when the script dies. But with this endpoint, **submission genuinely requires
JavaScript**, and no amount of markup fixes that. So the page carries a `<noscript>` block
that says so in the first person and gives the email and phone. At port time either the
route learns to accept a form-encoded same-origin POST, or that `<noscript>` is the honest
answer and stays.

Two smaller notes for Phase 5:

- `site.config.ts` gives `+44 7748 148082`; `content-brief.md` §1 still lists the old
  `07395 063764`. `home-data.ts:348-354` records the number changed on 2026-08-24. The
  prototypes use `07748 148082` / `tel:+447748148082`, matching the shipped config and the
  Phase 2 chrome. **The content brief is stale.**
- `.detail{position:sticky;top:120px}` assumes the 81px homepage bar. The inner-page bar
  measures **74.5px at 1680px and 65px at 390px**. `.detail--flow` sets `position:static`
  rather than inheriting a wrong offset — the pane is shorter than the form beside it, so
  stickiness bought nothing and the trap is removed rather than guessed at.

---

## 7. Focus treatment across all six grounds

Ratios computed in the browser from the real token hexes, not estimated.

| ground  | accent by the kit's rule | ratio      | ring actually used | ratio     |
| ------- | ------------------------ | ---------- | ------------------ | --------- |
| ink     | aqua                     | 10.28      | aqua               | **10.28** |
| navy    | aqua                     | 7.60       | aqua               | **7.60**  |
| white   | magenta                  | 5.16       | magenta            | **5.16**  |
| paper   | magenta                  | 4.33       | magenta            | **4.33**  |
| aqua    | magenta                  | **2.75** ✗ | **ink**            | **10.28** |
| magenta | aqua                     | **2.75** ✗ | **`#fff`**         | **5.16**  |

The kit's accent rule fails 1.4.11's 3:1 on two of its own six grounds. Both swaps land on
the ground's **own foreground colour** — `.p--aqua` is `color:var(--ink)`, `.p--magenta`
is `color:#fff` — so the fallback is not a new colour, it is the maximum-contrast colour
the ground already declares. And the aqua case has a precedent in the kit already:
`.stack .p--aqua::before{background:var(--ink)}` puts the panel's arrival rule in ink on
aqua for exactly this reason ("so it never disappears", kit.css §07).

`--acc` (the design accent, used for the select chevron and the error marker) still
follows the kit's rule; `--ring` (the focus indicator) follows the measured one. They are
separate variables because they answer different questions.

### The one real design argument in this file

**On text controls only, the kit's global focus ring is replaced rather than recoloured.**

`kit.css:99` is `outline:3px solid var(--magenta); outline-offset:4px`. That is right for
a pill or an inline link — an offset ring around a compact shape reads as a halo. Around a
**750 × 49 borderless field** it draws a magenta _rectangle_, which is both the most
generic-looking object on the page and the same colour as the rule drawing inside it, so
the two merge and the design's own gesture disappears entirely. **Captured at 1680px
before the change** — that screenshot is what made the decision.

The replacement is a deliberate custom indicator, not a removal: a **2px accent rule at
5.2:1** appearing where there was a 1px rule at `.46` alpha, animated in from the left.
That satisfies 2.4.7 (visible) and 1.4.11 (3:1 non-text contrast). A **transparent 2px
outline is retained on purpose** so Windows High Contrast Mode has something to paint —
forced-colors overrides an outline's colour but not its width, so a control with
`outline:none` would have no indicator there at all; `@media (forced-colors:active)` sets
it to `Highlight`.

Every other focusable thing on both pages keeps the global ring, recoloured per ground.

---

## 8. State inventory — what I exercised versus what I only wrote

| State                                | How it was checked                                                                                                                                                                                                                             |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| text / email / tel input, rest       | **rendered**, 1680 and 390; control measures **49px** at both                                                                                                                                                                                  |
| textarea, rest                       | **rendered**; 169px (168 min-height + 1px rule)                                                                                                                                                                                                |
| select, rest, with the drawn chevron | **rendered**, both widths                                                                                                                                                                                                                      |
| label, helper text                   | **rendered**; contrast computed (5.08:1 and 6.27:1 on white)                                                                                                                                                                                   |
| hover                                | **rendered** — captured with the pointer over the name field; rule goes solid `currentColor`                                                                                                                                                   |
| focus, mouse                         | **exercised** — real click, then typed into the field. `:focus-visible` matched, outline read back as `2px transparent @ 2px`, draw read back as `matrix(1,0,0,1,0,0)` / `2px` / `rgb(214,0,107)`                                              |
| focus, keyboard                      | **not exercised as keystrokes** — see §9. Verified by computed style instead; per spec and per Chrome's implementation a text input matches `:focus-visible` on mouse focus too, and it did, which is the same selector a keyboard focus fires |
| disabled (control + label + button)  | **exercised** — the pending path disables all five controls and the button; read back `disabled:true` on all five and `opacity:.45` on both control and label                                                                                  |
| invalid, single field                | **exercised** — submitted with a malformed email; got `aria-invalid="true"`, `data-invalid` on the field, and the right message                                                                                                                |
| invalid, whole form                  | **exercised** — submitted empty; 3 fields flagged, summary read _"3 things need a look before I can send this."_, focus landed on the first bad field                                                                                          |
| **no layout shift when flagging**    | **measured** — control heights `[49,49,49,49,169]` before and after flagging, on every field                                                                                                                                                   |
| error clears as you fix it           | **exercised** — corrected the email by `input` event; `data-invalid` removed, `aria-invalid` removed, message hidden                                                                                                                           |
| form-level error, server 500         | **exercised** via the prototype rig; `role="alert"`, correct copy, button and fields re-enabled                                                                                                                                                |
| form-level error, 429                | **wired and reachable from the rig**; copy written, not screenshotted                                                                                                                                                                          |
| submit pending                       | **exercised** — label `Sending…`, `disabled`, `aria-busy="true"`, `cursor:progress`, sweep animating (`d-sweep`, `1.1s`), `opacity:1` (a pending button must not also read as disabled-grey)                                                   |
| success                              | **exercised end to end** — form hidden, panel revealed, `.in` latched, arrival rule `scaleX(1)` in `rgb(0,210,216)`, live region read _"Message sent."_, name and email interpolated, focus on the panel                                       |
| success under reduced motion         | **not exercised** — see §9                                                                                                                                                                                                                     |
| mobile overlay                       | **measured at 390 × 844 with the overlay open: reports 390 × 844**, the full viewport, not the bar's box (design-kit §9.5's own test)                                                                                                          |
| `hover:none`                         | **not exercised** — written for every hover this file adds, checked by reading                                                                                                                                                                 |

---

## 9. What I rendered, where, and what I could not verify

### Rendered

| Viewport       | Method                                                                                                            | What                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1680 × 714** | the real top-level tab                                                                                            | Both pages end to end. `matchMedia('(max-height:1040px)')` **matches** — `.mast h1` computes to **102.4px**, the compressed scale, exactly as design-kit §7 says it will on ordinary hardware. Bar **74.5px**. `.cols` resolves `750.9px / 715.1px`. Zero horizontally-overflowing elements; `scrollWidth` 1671 against `innerWidth` 1680. Contact page 2656px tall, 404 2209px.                                 |
| **390 × 844**  | `prototype/_d_harness.html`, three iframes — `resize_window` is a no-op here exactly as it was for Phases 1 and 2 | Both pages plus the open overlay. `matchMedia('(max-width:900px)')` true inside the frame, so the whole authored mobile layer is genuinely exercised. `scrollWidth` **381** against **390** — no overflow, nothing clipped by `html{overflow-x:clip}`. Bar 65px. `.cols` → one 341px column. `.footmap` → two 155.5px columns. h1 36.8px. Controls still **49px** and still **16px** type, so no iOS focus-zoom. |

`kit-additions-d.css` parse health, the same check Phases 1 and 2 ran: **40,623 bytes, 88
top-level rules, 106 including nested, 574 declarations retained, 0 rules with all
declarations dropped.** A syntax error shows up as an empty rule; there are none.

### Not verified — stated plainly

- **Keyboard `Tab` traversal could not be driven.** The automation tab is not
  OS-focused while the scripting tool runs, so `Tab` keystrokes fell through to browser
  chrome and focus wrapped back to `<body>`; twelve presses moved focus one element. The
  focus _styling_ was verified by real mouse focus and computed style, which exercises the
  same `:focus-visible` selector, and the DOM tab order was read directly (honeypot
  excluded by `tabindex="-1"`, then name → email → phone → service → message → submit).
  **But I did not watch a keyboard user move through this form**, and that is the thing I
  would most want checked by hand.
- **`prefers-reduced-motion` was not exercised.** Both motions this file adds (the pending
  sweep and the success arrival rule) are gated the way kit.css §23 gates the reveal
  layer, and `.swap` is gated here because `home-r9.css:428-429` leaves it ungated. Read,
  not run.
- **`@media (hover:none)` was not exercised.** Every hover added here is neutralised in
  D11, checked by reading. On touch a hover fires on tap and latches, so this is the
  difference between a working phone form and one covered in stuck states.
- **`:-webkit-autofill` was not exercised** — no saved profile in this browser. Without
  the rule in D3 a transparent field turns pale blue with invisible text on an ink ground
  the moment Chrome fills it; the fix is the standard 1000px inset box-shadow plus a
  9999s transition, but I have not seen it work here.
- **`<option>` colours on a dark ground are platform-dependent.** D3 forces them to the
  design's own pair, but the failure it guards against (white-on-white option list) can
  only be reproduced on the platforms that have it.
- **`lvh` vs `svh`** — nothing added here sets a viewport height, so there is nothing to
  get wrong; and all four units resolve identically in a desktop browser anyway.
- **`env(safe-area-inset-*)`** resolves to `0px` here (`--pad` computes as
  `max(20px,0px,0px)`), so notch behaviour is unverifiable without a device.
- **The magenta ground's `--frule` at `.75` is marginal** (~3.0:1) and untested. No white
  alpha below `.75` clears 3:1 on magenta, and solid ink only reaches 3.73. A long form
  does not belong on the magenta ground; the value exists so the token set is complete,
  not because it is recommended.
- **`.formerr`'s dark-ground variants are specified, not exercised.** The form in this
  prototype is on white.
- **Nothing was built or type-checked.** `sites/dcs/` is untouched.

---

## 10. Bugs found by rendering

Six. Four are mine; two are pre-existing and belong to the kit.

1. **`[hidden]` did not work** — the inline error, the form-level error and the whole
   success panel all rendered on page load, because the UA's `[hidden]{display:none}`
   loses to an author `display:grid`. §3(a). _Mine, and the one that would have shipped a
   contact page showing "Thanks, —. That's with me." above an empty form._
2. **The ghost button inside the success panel was ink on ink**, 1.02:1, invisible.
   `.detail` hardcodes an ink background but carries no `.p--ink`, so `.p--ink
.btn--ghost` never matched. §3(b). _Pre-existing in the kit; my page is just the first
   to put a ghost button in a `.detail`._
3. **The keyboard focus ring drew a magenta rectangle** around the field and swallowed the
   drawn rule inside it. §7. _Mine — and it is the reason the field's focus treatment is
   what it is rather than what I first wrote._
4. **A failed submit hid its own summary under the fixed bar.** Scrolling to the first bad
   _field_ put the "3 things need a look" sentence above the viewport — the page announced
   a problem and then hid the announcement. Fixed by separating the scroll target (the
   summary) from the focus target (the field). _Mine._
5. **A broken comment killed the entire form script**, silently: an edit left prose
   outside a `/* */` and Chrome threw `SyntaxError: Unexpected identifier 'BY'` at load.
   The page still rendered perfectly, the form still looked right, and native validation
   still ran — so nothing looked wrong until the character counter failed to appear and
   `form.hasAttribute('novalidate')` came back `false`. _Mine. Worth recording because the
   symptom was two layers away from the cause._
6. **`window.scrollTo(x, y)` and `behavior:'auto'` are no-ops in a backgrounded tab.**
   `html{scroll-behavior:smooth}` (`home-r9.css:29`) makes the default behaviour smooth,
   smooth scrolling is rAF-driven, and rAF does not run in a backgrounded tab — measured
   `scrollY` 0 after `scrollTo(0,700)`, then 700 after `scrollTo({top:700,
behavior:'instant'})`. This sits alongside phase2-notes §6.6's finding that
   `documentElement.scrollTop` is a no-op for a different reason. The page's own code now
   uses `'instant'` explicitly in its reduced-motion branch rather than `'auto'`, which
   would have been correct only by a two-file coincidence. _Harness finding, with a
   consequence for the page's code._

---

## 11. Things I did not do, and why

- **No aqua section on `/contact`.** The ground sequence is ink → white → navy. Three
  grounds, alternating, navy closing. design-kit §1.2 says to pick a _short_ sequence and
  "do not cycle all five on a short page", and puts aqua at "most once, late" — so zero
  is correct here, and it keeps the site's one aqua moment special.
- **The homepage's `.end` directness is kept, not replaced.** The brief's constraint was
  that the page has to beat a mailto without abandoning that section's directness. The
  answer is the ink pane _beside_ the form rather than underneath it: the two big contact
  links are visible on the first screen of the form, so choosing the phone over the form
  never requires scrolling past the form to find out it is an option.
- **The `.pagefoot` still repeats the email and phone** below the form. That is approved
  Phase 2 chrome carried by all five wave-1 pages, and consistency beats a bespoke footer
  here — but on `/contact` specifically it is the third appearance of the same two links.
  Flagging rather than acting.
- **No placeholder text.** The live page uses placeholders ("Your full name",
  "you@example.com"). With real labels they are redundant, they vanish the moment someone
  types, and they are a well-known low-vision problem. Helper text does the job better and
  is linked by `aria-describedby`.
- **The character counter is not a live region.** Announcing on every keystroke makes a
  textarea unusable with a screen reader. The limit is stated once in the helper text; the
  counter is visual, silent until 80% of the limit, then flagged past it.
- **`.done` does not use `.detail`'s `grid-template-rows` or its `min-height`s.** Those
  reserve two and three lines so four pricing panes come out the same height
  (`home-r9.css:417-419`); there is one panel here.
- **`.cols` does not reuse `.price`.** `kit.css:1002-1004` hides `.price .tiers` and
  `.price .detail` outright below 901px, because the homepage swaps its whole pricing
  tablist for `.tiercards` there. A contact page borrowing that class would lose its
  entire right-hand column on every phone, silently. Same grid, same gap, restated under
  its own name — with the `1.05fr` moved to the _first_ column, because the ratio belongs
  to whichever column carries the work.
- **No count-ups, no fabricated media, no photograph of anyone.** Every figure on both
  pages is authored in the markup. The only interpolated values are the visitor's own name
  and email address, echoed back to them.

---

## 12. For Phase 4

Ordered by how much of the kit they touch.

1. **`[hidden]{display:none!important}` into kit.css §02.** One line, and without it every
   script-revealed component in the kit is broken by default.
2. **`--acc` / `--ring` into kit.css §07**, beside the `.p--*` definitions. Then Phase 2's
   five hand-written four-selector ground lists in §31 collapse to `var(--acc)`, and the
   `--ring` table is the answer to "what colour is the focus ring on this ground" for
   every future page.
3. **The `.detail` ground-class fix into §17** — or, better, give `.detail` a `.p--ink`
   in every prototype that uses it and treat the hardcoded background as the bug it is.
4. **Decide about `--frule` versus `.tier`'s `.16`.** Either accept two rule weights (a
   form rule is darker than a list rule) or raise `.tier`, `.row` and `.svc` to clear 3:1
   too. The second is a bigger change than I should make from a contact page, but the
   measurement applies to them as much as to a field — `.tier` is a `<button>`.
5. **The form set is the largest single addition in wave 1** and it is now shared
   vocabulary: `.form`, `.f`, `.f__l`, `.f__w`, `.f__c`, `.f__foot`, `.f__h`, `.f__e`,
   `.f--sel`, `.f--area`, `.formerr`, `.done`, `.cols`, `.detail--flow`, `.hp`, `.vh`.
   Wave 2's `/blog` filter UI and any future quote calculator should build on it rather
   than beside it.
6. **`.rig` in `contact.html` is showcase scaffolding**, in its own `<style>` block,
   touching no kit class. Delete at port time. `_d_harness.html` is likewise a harness,
   not a deliverable.
