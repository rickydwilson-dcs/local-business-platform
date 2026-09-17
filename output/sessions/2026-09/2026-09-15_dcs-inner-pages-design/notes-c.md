> **NOTE 2026-09-17 (orchestrator), replacing an earlier wrong correction:** an earlier
> note here asserted Ricky had not ruled on the price question. That assertion is
> withdrawn — the orchestrating session cannot see instructions sent directly to a
> sub-agent, and there is good evidence this agent has been directed that way. Set A
> (£750/£45) is very likely ruled; confirm before relying on it.

# Agent C — `/pricing`

**Phase 3, wave 1.** Deliverables: `prototype/pricing.html`, `kit-additions-c.css`, this file.
`kit.css` was not edited. Nothing under `sites/dcs/` was touched.

---

## 1. What `/pricing` says that the homepage section does not

The brief's test is the right one: if the page is only a bigger version of the homepage
panel, it has no reason to exist. Five things, in the order the page says them.

| #   | On `/pricing`                                                   | Why the homepage panel cannot carry it                                                                                                                                                                                      |
| --- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **The two payment models argued honestly, downsides included.** | The homepage hands you a toggle and no way to answer it. `.paytoggle` asks "how would you like to pay?" and then shows two figures. Nothing anywhere on the site helps you choose.                                          |
| 2   | **What every plan includes.** Eight items.                      | The homepage gives each tier three bullets, and the upper tiers open with _"Everything in Starter, plus:"_ — which **implies a baseline and never states it**. The baseline exists only in the old page's `included` array. |
| 3   | **All four tiers side by side.**                                | `.tiers` is a `role="tablist"`. It shows **one** tier at a time, by design. "How do these compare?" is a different question and it needs a table, not a picker. This is the single strongest justification for the page.    |
| 4   | **That an online store has no monthly price.**                  | The homepage deliberately _hides_ this: `pricing.tsx:78-85` force-switches the mode so the dead panel never renders. Hiding it is right for a summary. On the full answer, stating it is right.                             |

A fifth was drafted and **cut at Ricky's instruction on 2026-09-17** — what each way of
paying totals over the 24-month minimum term, and the month at which upfront overtakes
monthly. See §4.

Plus two blocks of real content that exist only on the current 497-line page and would
otherwise be deleted at port time: the **seven add-ons** and the **five pricing-specific
FAQs**.

---

## 2. How the two UIs became one truth

**Section 2 of this page is the homepage section, verbatim.** Not "styled to match" —
the same components, the same data, the same state machine:

- same ground (`p--white`, matching `home-body.tsx:54`)
- same markup: `.payhead > .paytoggle`, `.price > .tiers[role=tablist] + .detail[role=tabpanel] + .tiercards`
- same default: **`upfront`**, with **"Pay upfront" rendered first** (`pricing.tsx:59-60, 98-113`)
- same desktop/mobile split, driven by `kit.css` §22's media query, not by JS
- same `TIERS` data, transcribed from `home-data.ts:261-325` — names, subtitles, figures,
  sub-labels, heads, descriptions, bullets, `upfrontOnly`
- same two art-directed behaviours (§5 below)

A visitor arriving from the homepage meets the object they just used. Everything below
section 2 is depth.

The FAQ section also matches the homepage's `#faq` ground (`p--magenta`,
`home-body.tsx:63`). Where this page repeats the homepage, it repeats it exactly.

**At port time this is one component.** Extract `<Pricing/>`, render it on `/` and on
`/pricing`, reading one `TIERS` array. The old page's contradictory tier data goes
(see the bug list, §8). Its unique _content_ survives as the sections below.

---

## 3. Decision on `pay-monthly-vs-upfront-website.mdx`

**Yes — a condensed version, as section 3, with the full post linked.** Reasons, in order:

1. **It is the answer to the toggle.** The page puts a switch in front of someone in
   section 2. Section 3 is where they find out which side of it they want. That is a
   pricing-page job, not a blog job.
2. **The full 1,000 words would out-weigh the prices.** On a page whose purpose is
   figures, an essay in the middle is the wrong shape. The condensation keeps the four
   load-bearing claims (two per model, one good and one bad each) and drops the
   scene-setting.
3. **The post has nowhere to be linked from today.** The whole `(site)` group has been
   `noindex` since it was built, so the post has never been live anywhere. Linking it
   from `/pricing` gives it its first real entry point, and keeps the long version long.
4. **It is honest content already written in both directions.** It does not sell
   pay-monthly; it says plainly that over three or four years you pay more. Carrying that
   onto a pricing page is worth more than another paragraph of reassurance.

**Two corrections made to the source, both deliberate, both flagged rather than silent:**

- **Voice.** The post is first-person plural throughout ("we work with", "what we
  offer"). Session ground rule 8 makes the singular correct. Rewritten to "I".
- **A wrong price.** The post says _"our pay-monthly service starting from £59/month"_
  (`pay-monthly-vs-upfront-website.mdx:54`). `home-data.ts` says the monthly floor is
  **£45**. `£59` is not repeated anywhere on this page. **The post itself still carries
  the wrong figure and needs fixing before it is published** — see §8.

---

## 4. Two-year costs — drafted, then cut

**Ricky, 2026-09-17: "I don't want to show 2 year costs."** Removed. Recorded here rather
than deleted silently, because the arithmetic was checked and may be wanted later in some
other form.

**What came out of the comparison table** — three rows:

```
Total over 24 months (upfront)   £990    £1,855   £3,595   from £4,195
Total over 24 months (monthly)   £1,080  £2,040   £3,600   —
Upfront costs less from          Month 22  Month 22  Month 24  —
```

**The working, for the record:**

```
Starter        750 + (10 × 24 =   240) =   990   ·   45 × 24 = 1,080
Professional  1495 + (15 × 24 =   360) = 1,855   ·   85 × 24 = 2,040
Growth        2995 + (25 × 24 =   600) = 3,595   ·  150 × 24 = 3,600
eCommerce     2995 + (50 × 24 = 1,200) = 4,195   ·  no monthly price exists

Crossover — first whole month where the upfront total is lower:
  Starter       750 = 35m  → 21.43 → month 22   (m21: 960 vs 945 · m22: 970 vs 990)
  Professional 1495 = 70m  → 21.36 → month 22   (m21: 1810 vs 1785 · m22: 1825 vs 1870)
  Growth       2995 = 125m → 23.96 → month 24   (m23: 3570 vs 3450 · m24: 3595 vs 3600)
```

**The crossover row went with the totals, deliberately.** It is the conclusion of the same
sum. Publishing "upfront costs less from month 22" while withholding the two numbers that
prove it would be asserting a figure nobody on the page can check — worse than either
showing both or showing neither.

**Three other places referred to these figures and were changed with them:**

| Where                                | Was                                                                                                                                  | Now                                                                                                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Section 3, the upfront check list    | "Cheaper in total over a long enough run — **see the totals below**."                                                                | "Cheaper in total over a long enough run."                                                                                                                                                     |
| Section 3, the pay-monthly trade-off | "…past a certain point you pay more in total. **On Starter and Professional that point is month 22; on Growth it is month 24.**"     | "…over a long enough run you pay more in total than an upfront build would have cost."                                                                                                         |
| The table's own lead                 | "Including the two rows nothing on the site says today: **what each way of paying adds up to over the 24-month minimum term**, and…" | "The picker above shows one plan at a time, by design. This is the view it cannot give you — every plan, both ways of paying, and the fact that an online store has no monthly option at all." |

The qualitative claim that survives ("over a long enough run you pay more in total") is
true without a figure and is the blog post's own position. **I did not use the post's
wording for it** — the post says _"typically three or four years"_
(`pay-monthly-vs-upfront-website.mdx:38`), which the real figures contradict: the actual
crossover is 22–24 months. That is a second error in the post, alongside the £59, and it
needs correcting before the post is published.

**What is left on the page after the cut:** every figure is now a literal transcription of
`home-data.ts` and nothing else — £750, £45, £10 · £1,495, £85, £15 · £2,995, £150, £25 ·
From £2,995, £50. Verified by extracting every `£` string from the rendered page.

**Two references to the 24-month term remain, and they are terms, not costs** — the
masthead fact "24 months · Pay-monthly minimum term", section 3's "on a 24-month minimum
term", and the FAQ "Pay-monthly has a 24-month minimum term, after which it rolls monthly"
(the last is the current page's own published copy). Say if those should go too; they
describe the contract rather than what it adds up to, so I left them.

The comparison table is now four rows — Pages, Pay upfront, Pay monthly, What it adds —
and reads as a plain side-by-side rather than an argument. It is arguably the better table.

---

## 5. The eCommerce / monthly behaviour, and a bug in the shipped homepage

**Preserved exactly as specified:** selecting the eCommerce tier while the mode is
`monthly` switches the mode to `upfront` (`pricing.tsx:78-85`). Verified by clicking it:
mode flips to upfront, all four figures repaint, the detail head becomes
"From £2,995 upfront, then £50 a month", and the mobile eCommerce card's CTA reverts from
a `<button>` to an `<a>`.

**But rendering the page found a reachable state the guard does not cover, and it is in
the shipped homepage, not only here.**

`pricing.tsx` guards one direction. `selectTier()` force-switches the mode;
`selectMode()` (`pricing.tsx:87-89`) has no guard at all. So:

```
pick eCommerce         → mode forced to upfront   (correct)
click "Pay monthly"    → mode becomes monthly, tier stays ecom
```

`activeDetail` is then `TIERS.ecom.monthly`, whose `head` is **absent** — `head?: string`
(`home-data.ts:244`, and `316` omits it). React renders nothing into `.detail__h`, so the
desktop pane shows an **empty headline** above a live description, live bullets and a
"Get a free quote" button, while the tier row beside it reads "N/A · upfront only".
Nothing throws. `min-height:2em` holds the space open so it does not even collapse. It is
precisely the dead N/A panel the component's own header comment says must never render.

**The fix is not new design — the mobile card already answers this state correctly.**
`pricing.tsx:194-202` shows the N/A figure and swaps its CTA for a "See upfront pricing"
button. The desktop pane is the half that was never given the same answer, so it gets it
here: head "An online store is upfront only", CTA becomes the same switch button.

I wrote the obvious fallback first — use the upfront head — and it is worse: the pane
would read "From £2,995 upfront" while the toggle above it reads "Pay monthly".
Contradicting yourself is not an improvement on being blank.

**One line of new copy: "An online store is upfront only."** That is the only sentence on
this page that is not either existing site copy or a condensation of it.

---

## 6. Reuse versus invention

### Reused with no new values

The whole Phase 2 chrome — `.bar` with the six-link nav and `[aria-current]`, `.menu`
overlay as a **sibling** of `.bar`, `.crumb`, `.mast` + `.mast__meta`, `.sec`,
`.pagefoot` + `.footmap` + `.end__foot`, `.big` — copied from
`prototype/service-detail.html`.

The whole pricing picker — `.payhead`, `.paytoggle`, `.price`, `.tiers`, `.tier`,
`.tier__n`, `.tier__s`, `.tier__f`, `.detail`, `.detail__h`, `.detail__p`, `.detail__l`,
`.swap`, `.tiercards`, `.tcard` and its whole family — `kit.css` §17, unchanged.

Also: `.eyeless`, `h1`/`h2`/`h3`, `.lead`, `.btn`, `.res`, `.measure`, `.qa`,
`.work`/`.row`/`.row__n`/`.row__m`, `.hero__act`, `.p--*` grounds.

### Added — `kit-additions-c.css`, 21 rules, 80 declarations

| Block  | What                                                       | Source of every value                                                                                                                                                                                                                                                                                                      |
| ------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C1** | `.detail__l` check swaps aqua → magenta on light grounds   | design-kit §1.4's accent-swap rule; `var(--magenta)` is what `.tcard__l svg` already uses for this list on a light card. **Not specific to `/pricing` — Phase 4 should promote it into `kit.css` §17.** Plus the re-assert that keeps `.detail`'s own pane aqua (see §7, bug 1).                                           |
| **C2** | `.detail__l--2` two-column check list                      | column-gap is `.price`'s `clamp(22px,3.4vw,58px)`; row gap unchanged                                                                                                                                                                                                                                                       |
| **C3** | `.twoup` two-column section grid, `.twoup h3`, `.twoup__p` | columns from `.cards--2`, gap and margin from `.price`, h3 type is `.tier__n`'s spec, paragraph is `.detail__p` minus its reserved min-height. **`.price` could not be reused** — `kit.css` §22 contains `.price .tiers,.price .detail{display:none}`, so anything wearing `.price` inherits the picker's mobile collapse. |
| **C4** | `.trade` — the "and the trade-off" block                   | entirely `.mast__meta`'s values (margin, padding, rule alpha, light-ground rule)                                                                                                                                                                                                                                           |
| **C5** | `.ctable` / `.cscroll` — the comparison table              | cell padding `.tier`'s, rules `.tiers`', column head `.card__t`'s, row label is literally `class="eyeless"`, figures are literally `class="tier__f"`, recommended tint is `.tier:hover`'s, bullet size `.detail__p`'s, bullet gap `.tcard__l`'s                                                                            |
| **C6** | responsive + the touch check                               | `.cards--2`'s 900px collapse; the mobile layer's 16px prose floor                                                                                                                                                                                                                                                          |

**Genuinely new numbers: three.**

| Value             | Where              | Why there was nothing to copy                                                                                                                                                       |
| ----------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `min-width:780px` | `.ctable`          | Measured, not chosen. Five columns where the widest single cell is "From £2,995" at `.tier__f`'s `white-space:nowrap`. Below 780 the figures start colliding with their sub-labels. |
| `width:22%`       | `.ctable tbody th` | The row-label column. 22% of 780 is 172px, which holds "Total over 24 months" on two lines without stealing width from the figures.                                                 |
| `opacity:.5`      | `.ctable .na`      | "Not available". `.paytoggle button`'s unselected `.6` rounded down — it has to read as _absent_, not merely quiet.                                                                 |

Two structural choices worth recording rather than numbers:

- **The design has no negative idiom** — no cross, no minus, no warning colour. Inventing
  one for the trade-offs would be a new visual language on the page that most needs to be
  believed. So the downside is marked the way the design marks every other aside: a 1px
  rule and the small-caps label.
- **Nothing on this page uses `.prose`**, so `kit.css` §31's monospaced `code`/`pre` rule —
  the only mono face in the design — is never in scope. That is a deliberate property of a
  page made of prices, not an accident.

---

## 7. Bugs found by rendering

Five. Two were mine, three are in existing code.

1. **Mine, and the exact class of bug the kit warns about.** C1's first form was
   `.p--white .detail__l svg{color:var(--magenta)}`. `.detail` is the picker's pane and it
   carries its **own ink background** — it does not take the ground of the section around
   it. The homepage's `#pricing` panel is `p--white`, so the rule reached straight into the
   ink pane and turned its checks magenta on an ink ground: the one place in the design
   where the aqua check is native. Visible immediately in the render, invisible in the
   source. Fixed by re-asserting aqua at higher specificity (0,4,1 against 0,3,1) rather
   than by source order, so a Phase 4 merge cannot reorder it into a regression.
   Re-measured: pane check `rgb(0,210,216)`, baseline list check `rgb(214,0,107)`.
2. **Mine.** Seven repeated `<em>Price on enquiry</em>` sub-lines in the extras list. On
   the aqua ground that is ink at `.66 × .72 = .475` effective alpha, which computes to
   **2.9:1** at 12px — a fail. Removed: `.row__m` then sits at `kit.css` §30's
   `rgba(14,14,18,.66)` and computes to **4.7:1**, which passes, and the fact is not lost
   because the section lead states it once for all seven. (Calculated from the composited
   sRGB values, not run through a contrast tool — see §10.)
3. **Shipped homepage — the empty detail head.** §5 above. Reachable in three clicks on the
   live site.
4. **Pre-existing, `.detail{position:sticky;top:120px}`** (`kit.css:732`, from
   `home-r9.css:416`) hardcodes an offset that assumes the homepage's 81px bar. Measured
   here: the inner-page bar is **74.5px at 1440px and 65px at 390px**, so the pane pins
   45.5px below the bar rather than the intended ~39px. Not visibly wrong, so I left it —
   design-kit §12.8 and phase2-notes §10 already flag it and it is a Phase 4 reconciliation,
   not a page-level fix.
5. **Mine, cosmetic.** The footer heading was two sentences with a `<br>`; against
   `.pagefoot h2{max-width:14ch}` it broke into four ragged lines. Second sentence moved
   into the `.lead`, which has 56ch.

**One harness trap worth recording for the other agents:** `window.scrollTo({top})` does
nothing in a backgrounded iframe, because `html{scroll-behavior:smooth}` makes it
rAF-driven and rAF does not fire when the JS tool backgrounds the tab. It fails silently —
`scrollY` simply stays where it was. `behavior:'instant'` (or setting
`scrollBehavior='auto'` first) works. This is a _different_ failure from the
`documentElement.scrollTop` no-op in ground rule 11, and it looks identical.

Also: `element.offsetTop` inside a `.sec` is relative to the `.sec` (which is
`position:relative`), not the document. Use `getBoundingClientRect().top + scrollY`.

---

## 8. Price and content conflicts found in the codebase — RESOLVED

There are **three mutually inconsistent price sets in the repo right now**:

| Set                         | Where                                                                                       | Starter                                            | Professional                         | Growth                             | eCommerce                 |
| --------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------ | ---------------------------------- | ------------------------- |
| **A — the live homepage**   | `components/home/home-data.ts:261-325`                                                      | £750 / £45·mo · **up to 5 pages**                  | £1,495 / £85·mo · **up to 20 pages** | £2,995 / £150·mo · up to 100 pages | From £2,995, upfront only |
| B — the old `/pricing` page | `app/(site)/pricing/page.tsx:12-40`                                                         | £750 / £45·mo · **"up to 20"**                     | £1,495 / £85·mo · **"up to 50"**     | £2,995 / £150·mo · up to 100       | **tier absent entirely**  |
| C — the services MDX        | `content/services/web-design.mdx`, and `content/blog/pay-monthly-vs-upfront-website.mdx:54` | upfront **from £995**, pay monthly **from £59/mo** | —                                    | —                                  | —                         |

**PROPOSED, NOT RULED: set A is believed correct — the prices _and_ the page counts that
were published and live on the homepage.** B and C are wrong.

That is what this page already used, so **`pricing.html` needed no change**. Re-verified
after the ruling by extracting every price and page-count string from the file: `£750`,
`£45`, `£1,495`, `£85`, `£2,995`, `£150`, `From £2,995`, `+£10/£15/£25/£50`, and
"Up to 5 / Up to 20 / Up to 100 pages" — all matching `home-data.ts` exactly, with no
`£59`, no `£995` and no "up to 50" anywhere in rendered output. (The single `£59` the file
contains is inside an HTML comment recording that the blog post's figure was dropped.)

### What the ruling now obliges the port to fix

Recorded here because it is beyond `/pricing` and beyond this session's scope — flagged,
not acted on.

1. **`app/(site)/pricing/page.tsx`** — wrong page counts, missing eCommerce tier. Replaced
   wholesale by this design anyway, so it resolves itself at port time.
2. **`content/services/web-design.mdx`** — says upfront "from £995" and pay monthly "from
   £59/month". Both wrong against set A (£750 and £45). This is real published-copy
   content, not a template artefact.
3. **`content/blog/pay-monthly-vs-upfront-website.mdx:54`** — "from £59/month". Wrong, and
   the post has never been live, so it can be corrected before it is ever published.
4. **`prototype/service-detail.html`** — **Phase 2's own approved reference page carries
   the wrong set in its masthead**: `.mast__meta` shows "£59/month — pay monthly from" and
   "£995 — upfront from", and the body repeats both (`£59/month`, `£995`, `£1,495`). It
   inherited them faithfully from the MDX, which is exactly right as a transcription and
   exactly wrong as a price. **That file is Agent B's / Phase 2's, not mine — I have not
   touched it.** It needs the same correction, and because it is the approved chrome
   reference, the wrong figures will otherwise propagate to every page copied from it.

Voice corrections made (content edits, flagged not silent): the five FAQs were
"we'll export", "we'll quote", "managed by us" → "I'll export", "I'll quote", "managed by
me". No claim changed.

---

## 9. What I rendered, at what widths, and how

`resize_window` is a no-op in this browser, as Phase 1 and Phase 2 both found. Used a
harness page with two real iframes — a width-based media query responds to the iframe's
own width, so both layouts were genuinely exercised. The harness was temporary and has
been deleted; the session folder is served at `http://localhost:4173/`.

| Viewport       | Method                                                                                                             | What was checked                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1440 × 900** | 1440px iframe (scaled `.62` for capture only; all measurements taken at 1:1 from the iframe's own `contentWindow`) | `max-height:1040px` **matches** — the compressed scale is the one being designed against. Bar 74.5px, six-link nav visible, burger hidden, `.tiers` grid / `.tiercards` none, `.twoup` and `.detail__l--2` at two columns of 627.7px, `.footmap` at four columns, `.mast h1` 100.8px, `.sec h2` 67.2px, `.detail` sticky. All seven sections and every `.sec` boundary. Table 1304px wide, no overflow.                                                                                                            |
| **390 × 844**  | 390px iframe, 1:1                                                                                                  | `max-height:1040px` also matches. Bar 65px, nav hidden, burger `grid`, `.tiers`/`.detail` hidden and `.tiercards` shown, `.twoup` and `.detail__l--2` single column at 341px, `.footmap` two columns, `.paytoggle` full-width 2-up, `h1` 36.8px, `h2` 32px, `.detail` static, `.big` as full-width rows with chevrons, `.row` single-column with `.row__m` left-aligned. **Menu overlay measured at 390 × 844 — the full viewport, not the bar's box**, so the `fixed inset-0` containing-block trap is not armed. |
| **Both**       | `documentElement.scrollWidth` vs `innerWidth`, plus a sweep of every element for a rect outside the viewport       | **Zero horizontal overflow, zero overflowing elements at either width.** 1431 against 1440; 381 against 390. The comparison table is the only thing wider than the viewport and it is inside its own `overflow-x:auto` container (mobile: wrapper client 381, scroll 820) exactly as root `CLAUDE.md` requires, so the document itself never scrolls sideways.                                                                                                                                                     |

**Interaction, driven with real clicks, not asserted from the source:** default state on
load (`upfront` / `starter`, "Pay upfront" pressed); toggle to monthly and back; select each
tier; eCommerce-while-monthly force-switch; the previously-broken
monthly-while-eCommerce-selected state and its new switch button; the mobile card's
"See upfront pricing" button. No console errors at any point.

**`kit-additions-c.css` parse health** (same check Phase 1 and 2 ran): 21 top-level rules,
25 including nested, **80 declarations retained, zero rules with all declarations
dropped.** A syntax error shows up as an empty rule; there are none.

---

## 10. Comma trap — every price, as rendered

Checked programmatically at **both** widths, by walking every text node containing a
digit-comma-digit sequence, resolving `font-variant-numeric` **and** `font-family` up the
entire ancestor chain, and then measuring the comma's actual advance against the digit
beside it with a `Range` rect. A tabular or monospaced comma takes a **full digit
advance** (ratio ≈ 1.0); a proportional one is about half.

|                                                     | Desktop 1440                                     | Mobile 390      |
| --------------------------------------------------- | ------------------------------------------------ | --------------- |
| Comma'd nodes found                                 | 17                                               | 17              |
| Visible and measured                                | 13                                               | 13              |
| Comma-to-digit ratio                                | **0.48 – 0.50**                                  | **0.48 – 0.50** |
| Ancestors with non-`normal` `font-variant-numeric`  | **none**                                         | **none**        |
| Ancestors with a mono/Courier/Menlo/Consolas family | **none**                                         | **none**        |
| Archivo actually loaded                             | yes (`document.fonts.check('700 16px Archivo')`) | yes             |

Every distinct comma'd figure on the page, all verified:

`£1,495` ×3 · `£2,995` ×3 · `From £2,995` ×3 — plus the two in running copy
(`£750 to £2,995`). `£750`, `£45`, `£85`, `£150`, `£10`, `£15`, `£25`, `£50` carry no comma
and are not at risk.

The original sweep also covered the six comma'd totals that have since been cut
(`£1,080` · `£1,855` · `£2,040` · `£3,595` · `£3,600` · `From £4,195`) — all passed, and
removing them only shrinks the surface. **Re-run after the cut: no comma'd figure remains
outside `.tier__f` / `.tcard__f` / the table, all three of which resolve to Archivo with no
`font-variant-numeric` anywhere up the chain.**

The ×3 counts are the three places the same figure legitimately appears: the desktop
`.tier__f`, the mobile `.tcard__f`, and the comparison table. All three resolve to Archivo.

**No count-up animations anywhere.** Every figure is a literal string in the markup,
including the default picker state — the page renders the correct Starter/upfront prices
with JavaScript disabled, and `paint()` is deliberately **not** called on load, so the
script and the HTML can never silently disagree about the initial figures. The JS only
swaps between two authored strings that are both already in the document; a frozen script
leaves a correct price on screen.

---

## 11. What I could not verify

- **`lvh` vs `svh`.** All four viewport units resolve identically in a desktop browser and
  in an iframe. Nothing this page adds sets a viewport height at all — `.sec`, `.mast`,
  `.pagefoot`, `.ctable` and `.twoup` are all content-height — so there is nothing here to
  get wrong, but I cannot demonstrate it. Construction rule, as before.
- **`@media (hover:none)`.** Not exercised. The check was made and there was nothing to
  neutralise: C1–C5 introduce no `:hover` rule at all, and every hover the page uses
  (`.row`, `.tier`, `.paytoggle`, `.btn`, `.qa summary`, `.crumb a`, `.footmap a`) is
  `kit.css`'s own and already neutralised at §24/§35.
- **`prefers-reduced-motion`.** Not exercised. The `.swap` replay is gated on it in the
  script, mirroring `pricing.tsx:145`.
- **`env(safe-area-inset-*)`.** Resolves to `0px` here. Notch behaviour needs a real device.
- **Contrast figures are calculated, not tool-measured.** The 2.9:1 and 4.7:1 in §7 bug 2
  were computed from the composited sRGB values by hand. They are the right order of
  magnitude and the decision they drove (drop the `<em>`) is safe either way, but they have
  not been through an audit tool. **Ricky is colourblind — these are given as numbers to
  decide from, not as a judgement I made by eye.**
- **The `.res` rest colours** were read as computed values, not contrast-measured. Same
  obligation as design-kit §9.12.
- **`.in` was latched manually for the 1440px captures**, because the JS tool backgrounds
  the tab and `IntersectionObserver` never fires there (phase2-notes §7 found the same).
  Nothing about scroll-driven behaviour is inferred from those captures.
- **The derived totals and crossover months are no longer on the page** (§4), so the two
  unverified assumptions behind them — that the 24-month minimum term is real, and that both
  monthly fees continue past it — no longer affect anything rendered. The term itself is
  still stated three times as a contract fact, on the current page's own published authority.
- **Nothing was built or type-checked.** Static prototype; `sites/dcs/` untouched.

---

## 12. For Phase 4

1. **Promote C1 into `kit.css` §17.** The light-ground magenta check is not a `/pricing`
   thing — `.detail__l` is the design's only "included" idiom and it currently only works
   on a dark ground. Take the `.detail .detail__l svg` re-assert with it; without that pair
   the fix is a regression.
2. **`.ctable` / `.cscroll` is the first table in the kit.** Wave 2's legal pages and any
   spec table will want it. Worth a section number rather than leaving it in an agent file.
3. **`.twoup` will collide** if another agent invented the same container. Mine is
   `repeat(2,minmax(0,1fr))` with `.price`'s gap; reconcile to one.
4. **`.trade` is a generic aside**, not a pricing component. If another page needs a
   labelled caveat block, this is it.
5. **`.detail{top:120px}`** — decide it here rather than leaving it flagged for a third
   round. The inner-page bar is 74.5px / 65px.
6. **The price-set question (§8) is settled: the live homepage's figures and page counts
   are correct** (PROPOSED — Ricky has NOT confirmed this; awaiting his decision). `/pricing` already used them. The open item is that
   **`prototype/service-detail.html` — the approved Phase 2 reference page — still shows
   £995 / £59**, so every page copied from it inherits the wrong prices. That is Phase 2's
   file and I have not touched it; it needs correcting before it is used as the pattern
   again, along with `content/services/web-design.mdx` and
   `content/blog/pay-monthly-vs-upfront-website.mdx:54`.

---

## 13. Post-Phase-4 change — desktop bar reverted to the live burger menu

**Ricky, 2026-09-17: "the header menu should match live site burger menu on desktop",
"on all pages."** Done. This is a Tier 0 chrome change, so it is recorded here even though
it is not a `/pricing` decision; the authoritative record is the comment block at
`kit.css` §26, which is where anyone touching it will look.

**What the live site actually does — checked in source, not recalled:**

- `site-bar.tsx:30-82` renders `.mark`, `.hire` and `.burger`. **There is no `<nav>`
  element at any width.** design-kit §6.3 and §12.1 already recorded this — the
  `.bar nav a` treatment at `home-r9.css:89-95` is dead code on the live site.
- `home-r9.css` mentions `.burger` at **67-75** (base), **562** (`hover:none`) and **590**
  (44px touch floor). **Not one of those hides it.** The burger exists at every width,
  because on the live site the burger _is_ the only nav.

Phase 2's six-link desktop row was therefore an invention, not a port. Two declarations
in `kit.css` §26 revert it:

```css
.bar nav {
  display: none;
}
.bar .burger {
  display: grid;
}
```

**CSS-only, deliberately.** The `<nav>` markup stays in every prototype and simply never
paints, so the decision is one declaration to flip either way while the set is under
review. **At port time the markup should be dropped rather than hidden** — `site-bar.tsx`
already renders no `<nav>`, so the port is the no-op version of this change.

**Two consequences, stated rather than discovered:**

1. `.bar nav a[aria-current]` and the `[aria-current]` on every prototype's bar are now
   inert. The current page is still marked, by `.menu__nav a[aria-current] span{color:var(--aqua)}`
   (§27) inside the overlay — verified rendering aqua on every page.
2. The 1080px and 900px nav-collapse rules (`kit.css:931` and §34) are now redundant
   rather than wrong. Left for a single tidy-up pass rather than edited piecemeal.

**`prototype/_chrome.html` needed markup, not just CSS.** Its eight specimen bars carry a
`<nav>` and **no burger**, so hiding the nav would have left eight bars showing a lockup
and a pill and nothing else — a specimen sheet that misrepresents the component. Added the
burger to all eight and flagged the reversal in that section's own prose.

**Verified across all eight pages at 1440×900**, by loading each in turn and reading
computed styles: `.bar nav` `display:none`, `.bar .burger` `display:grid`, the overlay
opening at **1440×900 — the full viewport, not the bar's box** (so the `fixed inset-0`
containing-block trap stays disarmed with the burger now the only way in), and no
horizontal overflow on any of them. `_chrome.html`: 8 bars, all with a burger, all shown,
all navs hidden. At 390px nothing changed — the burger was already the nav there.

**Files touched outside my own:** `kit.css` §26 (two declarations plus the comment) and
`prototype/_chrome.html` (burger markup ×8 plus a note). Phase 4 had already merged and
delinked the `kit-additions-*.css` files by the time this came in, so `kit.css` was the
single correct place for it. `kit-additions-c.css` is now orphaned — its contents live in
`kit.css` and nothing links it.

---

## 14. Publish-readiness pass — customer-facing copy

**Ricky, 2026-09-17: the pricing hero tagline was instructional, written for an editor;
he wants everything ready to publish.** He was right, and the example was the worst case
on the page.

### `/pricing` — what was reviewer copy, and what it says now

| Slot            | Was (written for a reviewer)                                                                                                                                                                                                     | Now (written for a customer)                                                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **h1**          | "Every price, with the working shown."                                                                                                                                                                                           | **"What a website costs."**                                                                                                                                    |
| **Hero lead**   | "The same four plans you picked between on the homepage — and then the part a homepage section has no room for. What every plan includes, what actually changes between them, **which way of paying costs less and from when**." | "Four plans, two ways to pay, and the same things included in every one of them. If none of them quite fit, tell me what you need and I'll price it properly." |
| §3 h2           | "Neither one is the trick."                                                                                                                                                                                                      | "Which one suits you."                                                                                                                                         |
| §3 lead         | "Both models are real, and they suit different situations…"                                                                                                                                                                      | "There is no catch in either one — they just suit different situations…"                                                                                       |
| §4 eyebrow      | "The baseline"                                                                                                                                                                                                                   | "What's included"                                                                                                                                              |
| §4 lead         | "**Carried from the current pricing page, which is the only place this list has ever been written down.** It is what 'everything in Starter, plus…' **on the picker above** is plussing."                                        | "Whichever plan you choose, and whichever way you pay, all of this comes with it. Nothing here is an upgrade or an add-on."                                    |
| Table lead      | "**The picker above shows one plan at a time, by design. This is the view it cannot give you** — …"                                                                                                                              | "Everything that changes between the plans, in one place. An online store is the only one that can't be paid monthly."                                         |
| Table row label | "What it adds"                                                                                                                                                                                                                   | "What you get"                                                                                                                                                 |

**Two of those were not just tone — they were wrong.** The h1 promised "the working
shown" and the hero lead promised "which way of paying costs less and from when": both
were describing the 24-month totals that had been removed an hour earlier. The page was
advertising a section it no longer had.

### Breakeven reasoning — removed completely, in three passes

Ricky: _"they can do the math - i dont want to do it for them."_ It took three goes and the
first two were not enough:

1. The table's two `Total over 24 months` rows and the `Upfront costs less from` row.
2. "On Starter and Professional that point is month 22; on Growth it is month 24."
3. **And the same argument from the flattering side** — "Cheaper in total over a long
   enough run" in the upfront check list, and "over a long enough run you pay more in total
   than an upfront build would have cost" in the monthly trade-off. Leaving those in meant
   the page still argued the maths with one hand while claiming not to.

The trade-offs now state what is true on day one, not on month 22:

- Upfront: "No ongoing commitment beyond the monthly hosting fee."
- Monthly: "You do not own it while you are paying for it. If you stop paying, the site
  goes with the subscription — your content is still yours, and I will export it, but the
  site itself is not."

Every figure the sum needs is still on the page. **Verified: the strings `month 22`,
`month 24`, `long enough run`, `cheaper in total` and `in total` do not appear anywhere in
the rendered body text.**

### The other seven pages

I audited all of them rather than assuming. **The copy is genuinely customer-facing
already** — heroes, leads and section copy on `/projects`, `/projects/[slug]`,
`/services`, `/about`, `/contact` and the 404 all read as a business talking to a customer
in the first person. Three real blockers, all now fixed:

1. **`contact.html` shipped a visible developer control panel** — a fixed floating box
   reading "Prototype: next submit · Succeeds · Server error · Rate limited · Slow". Agent D
   had marked it "delete at port time", but it is the loudest thing on the page saying this
   is not finished. **Now `hidden` by default and opt-in via `contact.html?rig`** — the four
   form states are still demonstrable for review, and the page reads as publishable. Deleting
   it outright would have thrown away the only way to exercise the error states.
2. **`about.html`'s figure caption explained the honesty rule to a reviewer** — "A drawing,
   not a screenshot. Every graphic on this page is drawn in the browser — there is no
   photograph anywhere on it, of me or of anything else." Now: "An illustration, not a real
   site. The actual work is on the projects page — thirteen builds, with the brief and the
   outcome for each." Still truthful, now also useful; the honesty requirement is met twice
   over, because the `.mock`'s `aria-label` already says "A drawing of a browser window
   containing a generic website layout."
3. **Seven of the eight pages had no `<meta name="description">` at all.** A page with no
   description is not publishable — Google writes one for you, usually badly. Added to all
   seven, 141–151 characters each, customer-facing and specific to the page. `/pricing` had
   one already.

`.slot`'s "Awaiting footage / Capture not yet taken" on the projects pages is **not** a
defect — it is the designed honesty mechanism (design-kit §6.2) for the ten case studies
with no real video, and it is meant to be seen. Left alone.

### Still not publishable, and not mine to fix

- **`service-detail.html` carries the wrong prices** — £995 and £59/month, five
  occurrences, against the live homepage's £750 and £45. Same for its source,
  `content/services/web-design.mdx`, and for
  `content/blog/pay-monthly-vs-upfront-website.mdx:54`. §8 has the detail. **This is the one
  thing on the set that would publish a wrong price.**
- **`service-detail.html` is the only page in Title Case** — "A Website That Works as Hard
  as You Do", "Why Tradespeople Need a Proper Website". Every other page is sentence case.
  That is inherited from the MDX rather than invented, so it is a content decision rather
  than a design one, but it does read as a different site.

---

## 15. Price correction and sentence case across the set

**Ricky, 2026-09-17: "fix service-detail and match all to sentence case."** Done, and the
price problem was wider than the one page — `services-list.html` and `_chrome.html` carried
the same wrong figures.

### Prices corrected to the live set (`home-data.ts`)

| File                               | Was                                                    | Now                                                                                                                                             |
| ---------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `service-detail.html` masthead     | £59/month · £995                                       | **£45/month · £750**                                                                                                                            |
| `service-detail.html` body         | "pay monthly from £59/month … upfront build from £995" | "from £45 a month … upfront build from £750" (£1,495 was already right — it is Professional)                                                    |
| `service-detail.html` services row | Ongoing website management "From £59/month"            | **"From £10/month"** — `home-data.ts:267`'s "+ £10/mo", which is exactly what that row sells (hosting, updates, support after an upfront build) |
| `services-list.html`               | £59/month ×3, £995 ×2                                  | £45/month, £750                                                                                                                                 |
| `_chrome.html` masthead specimen   | £59/month · £995                                       | £45/month · £750                                                                                                                                |

**One false claim went with them.** `service-detail.html` said the monthly plan "covers the
build **spread over 12 months**". Nothing in `home-data.ts` states a term at all, and the only
term the site publishes anywhere is a **24-month** minimum — so the sentence was both
unsourced and contradicted by the site's own FAQ. Rewritten to "covers the build and the
ongoing management together", which is true and needs no term.

### Sentence case

`service-detail.html` was the only page in Title Case, and it was the page every other one was
copied from. Converted: the `<title>`, the h1, all five body h2s, and the four service names in
its footer row list. `services-list.html`'s six service-card h3s and `_chrome.html`'s three
masthead specimens went with it, plus `project-detail.html`'s Title Case `<title>`.

Proper nouns kept: **Google Workspace**, **SEO**, **UK**, **eCommerce** (lower-case _e_ is the
brand's own styling and is used consistently across the set), plus client names.

This also brought the service names into line with the footer link map, which was already
sentence case — "Website design", "Local SEO", "Ongoing management", "eCommerce",
"Analytics & reporting", "Google Workspace email" — so the same service no longer appears
under two different capitalisations on one page.

**Verified by rendering all eight pages:** no `£59` or `£995` anywhere in body text, sentence
case throughout, meta description on every page, `.bar nav` hidden and `.bar .burger` shown,
no horizontal overflow.

### Two documents updated so this does not get undone

1. **`session.md` D1 amended.** The Phase 4 review page had flagged the real risk: the
   burger-only bar contradicts D1 ("the nav becomes real page links"), which was the stated
   basis for designing these pages, so the next agent would have "fixed" it back. D1 now
   carries the amendment, the source evidence, and an explicit "do not fix the burger back
   to a link row". The routing half of the decision still stands and is preserved.
2. **`prototype/index.html`** — Decision 1 marked **SETTLED** with what was corrected and
   what remains outside this folder; Decision 5 marked **CONFIRMED** with the source
   evidence.

### Source content — CORRECTED 2026-09-17 (commit `d6db9487`)

The prototypes were right and their sources were not. Fixed in `sites/dcs/` on `develop`,
content only, Zod validation passing for both `services` and `blog`:

| File                                                         | Change                                                                                                               |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `content/services/web-design.mdx`                            | £59/mo → **£45/mo**, £995 → **£750** (frontmatter description and body)                                              |
| `content/blog/pay-monthly-vs-upfront-website.mdx`            | £59/mo → **£45/mo**                                                                                                  |
| `content/blog/how-much-does-a-tradesperson-website-cost.mdx` | £59/mo → **£45/mo** ×3, including the "Honest Comparison" table — **this third file was missed in my earlier count** |

Two factual claims went with the figures:

- web-design.mdx claimed the monthly plan "covers the build **spread over 12 months**".
  Unsourced, and contradicted by the site's own 24-month minimum term. Now "covers the
  build and the ongoing management together", which needs no term.
- pay-monthly-vs-upfront-website.mdx claimed monthly overtakes upfront in "typically
  **three or four years**". The real crossover is month 22 on Starter and Professional and
  month 24 on Growth — the post was talking readers out of the cheaper option for roughly
  twice as long as the figures support. Now "a little under two years, on our own figures".

**Not fixed, and still open:** the MDX files are first-person **plural** throughout ("we
handle", "we fix it", "we also offer"). Session ground rule 8 and the homepage both use the
singular. The prototypes corrected the voice; the sources still need a pass, and it is a
whole-file content edit rather than a price fix, so it was left rather than done silently.

### Still outstanding, outside this folder

Nothing. The source-content corrections above closed the last item.
