# Wave 2 brief — DCS inner pages, second fan-out

**Created:** 2026-09-18, immediately after wave 1 was approved at the Phase 4 gate.
**Agents:** 3 (F, G, H), running in parallel. **Output:** 6 page designs + 3 CSS addition
files + 3 notes files, all inside this session folder.

Wave 1 (nine pages) is approved and is the reference for what "correct" looks like here.
Wave 2 is the remaining sixteen-route tail. It was deliberately held back so `kit.css`
would be corrected once across wave 1 rather than twice across both waves — which means
**the kit you are handed is the corrected one, and your job is to extend it, not re-litigate it.**

---

## Ground rules — verbatim from `session.md` §5, binding on every agent

These exist because two previous attempts failed. Rules 1–3 are why the first attempt
produced "not one thing has picked up any of the design cues other than colours."

1. **Look at the reference, don't read about it.** Render the approved wave 1 pages before
   writing anything. `design-kit.md` is a numeric spec, not a substitute for looking.
2. **Quote real values.** Every CSS value you use is copied from `kit.css`,
   `styles/home-r9.css` or `theme.config.ts`, with the line it came from. Nothing from
   memory, nothing "roughly matching".
3. **Exhaust the existing pattern library first.** The inventory is in §"What already
   exists" below. Anything genuinely new must be listed and justified in your notes.
4. **Render and verify your own file** at 1440px and 390px. Report what you found. On the
   wave 1 round this surfaced 4–8 real bugs per page that reading alone missed.
5. **No count-up animations.** Static authored figures only. A frozen count-up publishes
   a wrong number.
6. **Honesty rules.** No generated image captioned as a real named client's premises, van
   or team. Nothing presented as Ricky — **no photograph of him exists.** Anything without
   real media takes the `.slot` placeholder; it does not get a stand-in.
7. **Prices with commas never get `tabular-nums` or a mono face.** `£1,995` renders as
   `£1 , 995`. Archivo only for comma'd figures. This is a live trap, not a hypothetical.
8. **Voice is first-person singular.** "I", not "we" — matching the homepage. Note that the
   _source MDX_ is still largely plural; see "The voice trap" below before you copy any of it.
9. **Static HTML only.** No React. **No edits under `sites/dcs/`** — that includes the MDX
   content files, which you read but never write. Everything lands in this session folder.

## Settled decisions — do not re-open any of these

| Decision      | Ruling                                                                                                                                               | Source              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| Header        | **Burger at every width, no desktop link row.** `session.md` D1's original sentence says otherwise and is **amended in place** — read the amendment. | `session.md` §4a #5 |
| Prices        | £750 / £45, page counts 5/20/100. Never £995/£59, never 20/50.                                                                                       | `session.md` §4a #1 |
| Copy register | Everything customer-facing and publish-ready. **No editor or reviewer notes in rendered copy.**                                                      | `notes-c.md` §14    |
| Case          | **Sentence case everywhere.**                                                                                                                        | `notes-c.md` §15    |
| Locations     | Kept but **demoted** — footer, not primary nav, lowest-priority tier. They must not pull the brand back toward "local trades".                       | `session.md` D2     |
| `/reviews`    | **Dropped as a route.** Three testimonials are placed via the `.quote` pattern instead. Do not design or link a `/reviews` page.                     | `session.md` D3     |
| Blog posts    | Keep all 21 as written. **Do not rewrite them.**                                                                                                     | `session.md` D4     |

## What already exists in `kit.css` — reuse before inventing

`kit.css` is 189,896 bytes and heavily commented with its own reasoning; the comments cite
`design-kit.md` sections and `home-r9.css` lines. Read the comments, not just the rules.

Directly relevant to wave 2, already built and approved:

- **`.prose`, `.measure`, `.w45`/`.w60`/`.w70`/`.w80`** — long-form body text and its measure.
- **`.crumb`** — breadcrumb, part of approved Tier 0 chrome.
- **`.mast`, `.mast__meta`, `.mast__media`** — the page masthead. **Known issue:** it measures
  78–81% of viewport height. A `max-height:1040px` compression on `.mast h1` is the proposed
  quietening; it has been offered twice and not taken up. **Do not apply it unilaterally** —
  match wave 1's masthead so the set stays coherent, and flag it in your notes if it hurts.
- **`.cards`, `.cards--2/--3/--6`, `.card__t/__s/__meta/__tag/__well/__link/__note`** — the card grid.
- **`.filterbar`** — already exists. Blog and locations should both look here first.
- **`.footmap`** — already exists, and is where demoted locations plausibly live.
- **`.detail`, `.detail__h`, `.detail__l`, `.detail__l--2`, `.detail__p`, `.detail--flow`** —
  the list/detail shell. **CORRECTED 2026-09-18 — the earlier version of this brief was wrong
  here.** It said the inner-page bar measures 74.5px against `.detail{top:120px}`'s 81px
  assumption. **The bar measures 81px at 1440 on every approved page**, so `top:120px` is
  correct and must not be "fixed". Full reasoning in `bar-height-correction.md`. Agent G
  caught this and was right; agents F and H were briefed from the stale figure.
- **`.sec`, `.panel`, `.p--ink/--white/--paper/--magenta/--aqua/--navy`** — the panel sequence.
  The ink/white/magenta/aqua/navy order is governed; navy closes. See `design-kit.md` §1.2.
- **`.quote`, `.quote--sm`, `.quote--hero`, `.quote__a`, `.quotes`** — the testimonial pattern.
- **`.qa`, `.qa__a`** — FAQ/accordion.
- **`.slot`, `.slot__well/__i/__s/__t`** — the honesty placeholder for absent media.
- **`.step`, `.steps`, `.tcard`, `.svccard`, `.wpanel`, `.tier`, `.paytoggle`** — wave 1 patterns;
  check them before building anything that resembles them.

Motion language is `cubic-bezier(.16,1,.3,1)`. The accent swaps on dark and on magenta grounds
(`design-kit.md` §1.4) — aqua, not magenta. `kit.css` §24 neutralises hover on touch; any new
hover effect you add must be added to that rule too, because on touch a hover fires on tap and sticks.

## Harness traps — these cost wave 1 real time

1. **`IntersectionObserver` never fires in the harness** (the tab is backgrounded when the JS
   tool runs), so `.res` headings stay in their muted rest colour and `.in` must be latched by
   hand for captures. **Nothing about scroll behaviour can be inferred from a harness screenshot.**
2. **`window.scrollTo({top})` silently does nothing in a backgrounded iframe** — smooth scroll is
   rAF-driven and rAF does not fire there. Use `behavior:'instant'`. This looks identical to the
   separate `documentElement.scrollTop` no-op caused by `html{overflow-x:clip}`.
3. **`offsetTop` inside a `.sec` is relative to the `.sec`, not the document.** Use
   `getBoundingClientRect().top + scrollY`.
4. **A sticky element reports its _pinned_ position, not its layout position** — so both
   `getBoundingClientRect()` and `offsetTop` read `top: 0` once you have scrolled past an
   unbounded sticky section, and in-page anchor links then silently do nothing. This matters to
   any TOC you build (agent H especially). Neutralise sticky for one synchronous measurement
   (`el.style.position='static'`, read, restore) and scroll yourself with `e.preventDefault()`.
5. **`position: sticky` gets its room only from in-flow content _after_ the element.** A
   `margin-bottom` on the sticky element gives none (the spec clamps its margin box); a
   `padding-bottom` on the container gives none either (padding is outside the content box).
   Both were tried on the DCS work stack and both measured **0px of pin**. The last item in any
   sticky stack is the one that silently fails. Fix with real in-flow content
   (`.stack::after{content:"";display:block;height:100lvh}`).
6. **`lvh`/`svh`, `prefers-reduced-motion`, `@media (hover:none)` and `env(safe-area-inset-*)`
   are untestable in this harness** — all four viewport units resolve identically in an iframe.
   Construction rules only. Use `lvh`, never `svh`, for anything that must cover the viewport.
7. **Never nest a `fixed inset-0` overlay inside an ancestor with `backdrop-filter` or
   `transform`** — either one makes that ancestor the containing block, trapping the "fullscreen"
   overlay in the header's own box. Verify by measuring an opened panel: it must report the
   viewport (390×844), not the bar's box (~277×58).

## The voice trap

`session.md` ground rule 8 says first-person singular. The **source MDX is not there yet** —
roughly 229 lines across 44 files are still first-person plural, and the wave 2 content is the
bulk of it:

| Content                   | Files    | Plural lines |
| ------------------------- | -------- | ------------ |
| `content/blog/*.mdx`      | 18 of 21 | 45           |
| `content/locations/*.mdx` | 8 of 8   | 75           |

So: **when you lift copy out of an MDX file into your prototype, convert it to singular as you
go.** "DCS offers" is fine; "we fix it" is not. This is a judgement call, never find-and-replace.
Do **not** edit the MDX files themselves — that is a separate content pass. Record in your notes
any line you converted, so the later content pass can be checked against your prototypes.

## Per-agent assignments

### Agent F — `/blog`, `/blog/[slug]`, `/blog/category/[slug]`

**The hardest brief in wave 2, and the reason is in `session.md` D4.** Read that decision in full.

Content: 21 posts, 1,000–1,300 words each, **8 categories** already in frontmatter:
`local-seo` (6), `costs-and-value` (3), `website-content` (3), `industry-guides` (3),
`getting-found-online` (3), `website-design` (2), `business-tools` (1).
_(Note: frontmatter quoting is inconsistent — `"local-seo"` quoted, `costs-and-value` not, and
`getting-found-online` appears both ways. Harmless to parse; flag it in notes, don't fix it.)_

Binding design constraints from D4:

- **Lead on topic**, using the 8 categories, labelled by the _problem being solved_ rather than
  by who has it.
- **Design in a second axis for sector/audience from the start**, even though today it has only
  one populated value. Retrofitting at 40 posts is the expensive version.
- **The layout must not degrade into a wall at 40–60 posts.** Assume it gets there. Show this —
  your notes must say what the index looks like at 21, 40 and 60 items.
- **Trades appear as worked examples inside topics, never as the frame.** The existing 21 are
  written for tradespeople but the portfolio spans retail, eCommerce, studios, practitioners,
  tuition, property and B2B, and the business wants to be visible to all of them.
- **None of the 21 has ever been live** — the whole `(site)` group has been `noindex` since it
  was built. There is no traffic to protect and no sunk SEO equity. Design for the library the
  studio wants, not the one the current titles imply.

`/blog/[slug]` is the long-form reading page and is **the one place where the r9 chapter-panel
language has to yield to legibility** (`session.md` §3, 2.3). Respect that — it is an explicit
licence to be quieter, not an invitation to go generic. `.prose` and the `.measure`/`.w*` scale
are your friends. A TOC is in scope if the posts warrant it; if you build one, read harness
traps 4 and 5 first.

### Agent G — `/locations`, `/locations/[slug]`

8 locations, all with real MDX bodies: brighton, eastbourne, hailsham, hove, lewes, polegate,
seaford, uckfield.

**This tier is explicitly demoted (`session.md` D2) and that is a design instruction, not a
lower quality bar.** The pages are kept because they cost nothing and earn local search. What
they must not do is pull the brand back toward "local trades" — the studio's positioning spans
retail, eCommerce, studios, practitioners, tuition, property and B2B. So:

- Entry is via the **footer**, not the primary nav. `.footmap` already exists — look there first.
- Design restraint is the brief. These should read as competent and quiet, not as a
  local-SEO doorway page. Eight near-identical pages are a genuine design problem: say in your
  notes how yours avoids looking machine-generated without inventing facts per town.
- **All 8 location files are first-person plural** (75 lines — the largest block of the voice
  debt). Convert as you lift. See "The voice trap".
- Honesty rule binds here: no generated image captioned as a real named place or premises.

### Agent H — the legal template, three uses

Routes: `/privacy-policy` (322 lines), `/cookie-policy` (278), `/terms-and-conditions` (378).
**One template, three uses** — design the template once and show it carrying all three bodies.

- `components/legal/legal-hero.tsx` and `components/legal/legal-toc.tsx` **already exist —
  restyle, don't rebuild.** Read them first; your design has to be portable onto them.
- The content is fine. **Only the shell changes.** Do not rewrite or summarise legal prose, and
  do not invent clauses. If a body seems to have a gap, note it; never fill it.
- This is the longest sustained reading on the site. Legibility and a working TOC are the whole
  job. **Read harness traps 4 and 5 before you build the TOC** — a sticky TOC with in-page
  anchors is precisely the combination that silently breaks, and it breaks only when you test
  from _below_ the target, so testing from the top of the page passes and proves nothing.
- `/not-found` (404) is **already designed** in wave 1. Do not redo it.

## What each agent outputs

Into this session folder, named exactly:

| Agent | HTML                                                                                   | CSS additions         | Notes        |
| ----- | -------------------------------------------------------------------------------------- | --------------------- | ------------ |
| F     | `prototype/blog-list.html`, `prototype/blog-post.html`, `prototype/blog-category.html` | `kit-additions-f.css` | `notes-f.md` |
| G     | `prototype/locations-list.html`, `prototype/location-detail.html`                      | `kit-additions-g.css` | `notes-g.md` |
| H     | `prototype/legal.html` (showing all three bodies, switchable)                          | `kit-additions-h.css` | `notes-h.md` |

**CSS additions go in your own `kit-additions-*.css` file, not into `kit.css`.** Three agents
writing one file concurrently corrupts it. The orchestrator merges them in Phase 4, exactly as
the five wave 1 files were merged. Link both `kit.css` and your own additions file from your pages.

Your notes file must contain, at minimum:

1. **What you reused** from the existing library, by class name.
2. **What you had to invent**, each item with its justification.
3. **What you found when you rendered it** — the real bugs, at both 1440 and 390.
4. **Every CSS value you introduced, with the source line it was copied from.**
5. **Any MDX line you converted from plural to singular voice.**
6. **Anything you could not verify** in the harness, marked as a construction rule.

Be honest in the notes about what you did not check. Wave 1's value came substantially from
its notes being trustworthy about their own gaps.
