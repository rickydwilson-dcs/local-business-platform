# DCS inner pages — design-first plan

**Status:** **Waves 1 and 2 both designed, merged and verified — 2026-09-18.** All five
review-page decisions are settled (§4a). Wave 2's three agents have landed; their CSS is
merged into `kit.css` and all **15 pages** are in `prototype/index.html`. Every route in §3
now has a design except `/reviews`, which D3 dropped deliberately. **Nothing is ported** —
Phase 5 remains a separate session. Awaiting Ricky's review of the wave 2 pages.
**Date:** 2026-09-15
**Scope:** Design only. No React port in this session. See §7.

---

## 1. Why this session exists

The r9 brand is live on the homepage and nowhere else. Two previous attempts to
finish the rest of the site have stalled, and they stalled for two different
reasons that both have to be designed around:

- **2026-08-25 — `dcs-r9-rebrand-inner-pages`.** Nine sub-agents rebuilt all 14
  routes from a prose description of the r9 tokens. Verdict on review: _"utterly
  horrible — not one thing has picked up any of the design cues other than
  colours."_ Branch preserved unmerged as
  `archive/dcs-r9-inner-pages-v1-2026-08-25`. The finding — recorded in
  auto-memory as `feedback_visual_rebuild_needs_visual_reference` — is that a
  model given a text description of a palette applies the colours and defaults to
  generic spacing, type and card conventions for everything else. **Tokens are
  necessary and nowhere near sufficient.**
- **2026-08-26 — `dcs-projects-pages`.** The correct response: design `/projects`
  and `/projects/[slug]` as static HTML first, iterate, then port. Round 1 was
  produced (`prototype/project-list.html`, `project-post.html`, `shared.css`, 709
  lines total). There is no round 2 and no wrap-up in that folder — it stopped
  after the first pass.

So the process is already known to be right; it was just never run to completion,
and never run across the whole page set. This plan runs it properly.

---

## 2. Verified current state

Checked directly against the repo on `develop`, 2026-09-15 — not recalled.

| Fact                                           | Evidence                                                                                                                                                 |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 15 routes + a 404                              | `app/page.tsx` + 14 under `app/(site)/`, plus `app/not-found.tsx`                                                                                        |
| Homepage is r9; nothing else is                | `app/page.tsx` imports `styles/home-r9.css` and renders `HomeBody`; `app/(site)/layout.tsx` renders the old `PageShell`/`SiteHeader`/`SiteFooter`        |
| All 14 inner routes are `noindex`              | single `robots: { index: false, follow: false }` in `app/(site)/layout.tsx`, inherited by every child                                                    |
| **The homepage links to no inner page at all** | every href in `site-bar.tsx`, `mobile-menu.tsx`, `end-section.tsx` is an anchor (`#work`, `#services`, `#pricing`, `#faq`, `#end`) or a `mailto:`/`tel:` |
| Voice is inconsistent                          | homepage is first-person singular ("looked after by **me**"); `ContactPage.tsx` says "**We** usually respond within a few hours"                         |
| The shared chrome carries a wrong brand name   | `app/(site)/layout.tsx` passes `logoAlt="DCS Gardening & Landscaping"` to both header and footer                                                         |
| No blog category route                         | 8 categories in frontmatter, no `/blog/category/[slug]`                                                                                                  |
| No contact success/thank-you state             | no `thank`/`success`/`submitted` anywhere in `components/pages/ContactPage.tsx`                                                                          |

**Content already written and usable as-is:** 21 blog posts (1,000–1,300 words
each), 13 project case studies (challenge/solution/results + outcome bullets), 6
services, 8 locations, 3 testimonials.

**Media:** `lib/home-assets.ts` — 18 R2 URLs, real screen-recording video + poster
for 3 of the 13 projects. The other 10 use the `.slot` "awaiting footage"
placeholder already designed in `home-r9.css`.

**Design vocabulary available to reuse:** `styles/home-r9.css` is 721 lines and
already contains patterns that were designed for content the homepage doesn't
currently show — `.cards--2`, `.slot`, `.detail__l`, `.paytoggle`, `.panel`/`.p--*`,
`.quote`, `.bar`, `.menu`, `.end`. Inner pages should exhaust this before inventing.

---

## 3. The page list

Grouped by **design archetype**, because most routes share a template and designing
per-route would duplicate work. "Content" says what already exists to fill it.

### Tier 0 — Shared chrome (must be designed first; everything else depends on it)

| #   | Piece                        | Why it's first                                                                                                                                                                         |
| --- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1 | **Persistent header / nav**  | The homepage `.bar` is anchor-only. Inner pages need real page links, an active state, and a nav that survives leaving the homepage. Nothing else can be designed until this is fixed. |
| 0.2 | **Persistent footer**        | The `.end` navy section is the homepage's closing chapter, not a footer. Needs a page-level variant that still reads as the same closing move.                                         |
| 0.3 | **Page masthead pattern**    | The homepage hero is bespoke and full-height. Every inner page needs a repeatable, shorter opening block.                                                                              |
| 0.4 | **Breadcrumb / return path** | 13 projects, 21 posts, 8 locations — currently no way back up a level.                                                                                                                 |

This is the exact thing that made piecemeal reskinning impossible last time:
reskinning one route in isolation strands new-brand content inside old-brand chrome
shared by all 14.

### Tier 1 — Money pages (the ones that sell)

| #   | Route(s)                           | Content that exists                                           | Notes                                                                                                   |
| --- | ---------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1.1 | `/projects`                        | 13 case studies + sector taxonomy from the 2026-08-26 brief   | Round 1 prototype exists — start from it, don't restart                                                 |
| 1.2 | `/projects/[slug]`                 | full narrative bodies, 4–5 outcome bullets, 3 with real video | Round 1 prototype exists (Colossus)                                                                     |
| 1.3 | `/services`                        | 6 services                                                    |                                                                                                         |
| 1.4 | `/services/[slug]`                 | 6 service MDX bodies                                          |                                                                                                         |
| 1.5 | `/pricing`                         | live page, 497 lines, has its own upfront/monthly toggle      | Must reconcile with the homepage `Pricing` component — two toggles, one truth                           |
| 1.6 | `/contact`                         | form + API route already working                              | Needs the r9 treatment **and** a success state (1.7)                                                    |
| 1.7 | **`/contact` success state** (new) | —                                                             | Doesn't exist. Proposed as an in-page state, not a route, unless you want a URL for conversion tracking |

### Tier 2 — Trust and editorial

| #   | Route(s)                          | Content that exists                     | Notes                                                                                                                                |
| --- | --------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | `/about`                          | `content-brief.md` §1–3                 | The one-person-studio story. Honesty rule: **no photograph of Ricky exists** — no generated image may stand in for him or "our team" |
| 2.2 | `/blog`                           | 21 posts, **7** categories              | Index needs to handle 21 items without becoming a wall                                                                               |
| 2.3 | `/blog/[slug]`                    | **769–1,169** words each                | Long-form reading page — the one place where the r9 chapter-panel language has to yield to legibility                                |
| 2.4 | **`/blog/category/[slug]`** (new) | **7** categories already in frontmatter | Proposed: cheap to add, real SEO and navigation value                                                                                |
| 2.5 | `/reviews`                        | **only 3 testimonials**                 | See decision D3                                                                                                                      |

### Tier 3 — Local SEO

| #   | Route(s)            | Content that exists   | Notes           |
| --- | ------------------- | --------------------- | --------------- |
| 3.1 | `/locations`        | 8 locations           | See decision D2 |
| 3.2 | `/locations/[slug]` | 8 location MDX bodies |                 |

### Tier 4 — Legal and utility (one template, four uses)

| #   | Route(s)                                                     | Notes                                                                                      |
| --- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| 4.1 | Legal page template                                          | `components/legal/legal-hero.tsx` + `legal-toc.tsx` already exist — restyle, don't rebuild |
| 4.2 | `/privacy-policy`, `/cookie-policy`, `/terms-and-conditions` | 322 / 278 / 378 lines of real prose — content is fine, only the shell changes              |
| 4.3 | `/not-found` (404)                                           | Currently generic Tailwind + lucide icons, entirely off-brand                              |

**Total: 4 chrome pieces + 16 page designs across 4 tiers.**

---

## 4. Decisions — resolved 2026-09-15

Ricky delegated these ("whichever you think is going to be best"). Answers below,
with the reasoning, so they can be overturned knowingly rather than silently.

**D1 — The nav becomes real page links. Yes — but as a BURGER, not a link row.**

> **AMENDED 2026-09-17 by Ricky**, twice and explicitly: _"the header menu should match
> live site burger menu on desktop"_, _"on all pages"_. The routes below are still the
> answer — the **presentation** is not. The bar shows the logo lockup, the CTA pill and the
> burger at **every** width, and the six routes live in the `.menu` overlay.
>
> This is the shipped behaviour, verified in source rather than recalled: `site-bar.tsx:30-82`
> renders **no `<nav>` element at any width**, and none of `home-r9.css`'s three `.burger`
> rules (67-75, 562, 590) hides it. Phase 2's desktop link row was an invention, not a port.
> Implemented in `kit.css` §26 as two declarations — `.bar nav{display:none}` and
> `.bar .burger{display:grid}` — with the `<nav>` markup left in place so the decision is one
> line to flip while the set is under review. **At port time the markup should be dropped,
> not hidden.**
>
> **Do not "fix" the burger back to a link row.** The original wording of this decision is
> preserved below because the routing half of it still stands.

Header nav points at real routes (Work, Services, Pricing, Blog, About, Contact).
The homepage's own sections stay as previews that link onward — `#work` becomes a
teaser that ends at `/projects`, not the destination itself. Anchor scrolling
survives only where the target is genuinely on the page being viewed. Without this,
sixteen designed pages stay unreachable and the homepage stays a one-pager with a
site bolted behind it.

**D2 — Keep the 8 location pages, but demote them.**
They're written, they cost nothing to keep, and they earn local search. What they
must not do is pull the brand back toward "local trades" — so they go in the footer,
not the primary nav, and their design brief is explicitly the lowest-priority tier.
Deferred to wave 2 under D5.

**D3 — Drop the standalone `/reviews` route.**
A page holding three testimonials advertises that there are only three. Instead,
design a reusable **testimonial pattern** — the existing `.quote` panel — and place
those three where they do work: on `/projects` and against the relevant case
studies. Revisit a dedicated page at 8–10 reviews. The route is `noindex` today, so
removing it costs nothing in search. Reversible the moment there's more material.

**D4 — Keep the 21 posts as written; design the index for a library that grows.**
_Revised 2026-09-15 after Ricky's correction._ An earlier draft of this decision
argued the posts were worth keeping because they already earn search traffic. They
do not — the whole `(site)` group has been `noindex` since it was built, so **not
one of the 21 has ever been live anywhere.** There is no traffic to protect and no
sunk SEO equity in the current framing.

Ricky's call, which stands on better ground: these are exactly the _shape_ of page
the studio wants earning traffic, they simply haven't been given the chance.
So — keep all 21, don't rewrite them, and extend the library in due course.

The design consequence is the part that matters here. The existing 21 are written
for tradespeople ("best websites for plumbers", "why tradespeople need a website"),
but the portfolio already spans retail, eCommerce, studios, practitioners, tuition,
property and B2B, and the business wants to be visible to all of them. So the
`/blog` index must be designed for a library that **grows well past 21 and spans
sectors** — not one that silently assumes trades:

- Lead on **topic**, using the **7** categories already in frontmatter, labelled by the
  problem being solved rather than by who has it.
- Design in a **second axis for sector/audience** from the start, even though today
  it would only have one populated value. Retrofitting that once there are 40 posts
  is the expensive version.
- The layout must not degrade into a wall at 40–60 posts. Assume it will get there.
- Trades appear as worked examples inside topics, never as the frame.

New posts for non-trade sectors are follow-up content work, out of scope here, but
the index is designed to receive them.

**D5 — Tier 0 + Tier 1 first, plus `/about`.**
It's the half that sells, and it proves the kit before eleven more pages are built
on top of it. One promotion: **`/about` moves into wave 1**. This is the studio's
own shop window, the positioning rests on it being a named person rather than a
faceless agency, and the copy is already written in `content-brief.md` §1–3.

**Resulting waves**

| Wave | Pages                                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------- |
| 1    | chrome, `/projects`, `/projects/[slug]`, `/services`, `/services/[slug]`, `/pricing`, `/contact` + success, 404, `/about` |
| 2    | `/blog`, `/blog/[slug]`, blog categories, `/locations`, `/locations/[slug]`, legal template ×3                            |

### Correction, 2026-09-18 — the blog content facts above were wrong

Raised by Agent F in wave 2 and verified directly against the 21 files:

- **7 categories, not 8.** `local-seo` 6, `costs-and-value` 3, `website-content` 3,
  `industry-guides` 3, `getting-found-online` 3, `website-design` 2, `business-tools` 1 —
  which sums to 21. The "8" appears to have come from counting
  `getting-found-online` twice, since frontmatter quotes it inconsistently (`"local-seo"`
  quoted, `costs-and-value` bare, `getting-found-online` **both ways** across files).
  The quoting is harmless to parse; it is a tidy-up for the port, not a bug.
- **769–1,169 words, mean 948 — not "1,000–1,300".** Thirteen of the 21 are under 1,000.
  The reading page is designed for shorter pieces than the plan assumed.
- **16 of the 21 open with a `# ` h1 that duplicates the frontmatter title.** The port must
  strip it or every post ships two h1s. This is a Phase 5 item.
- **All 21 titles are Title Case**, against the settled sentence-case ruling. Converted in
  the wave 2 prototypes and listed in `notes-f.md` §5.2; **the MDX is untouched** — it
  belongs with the voice pass.
- **`sector` does not exist in frontmatter.** D4's second axis is a _proposed_ field; Agent F
  derived each value from the post's own text. The mapping is in `notes-f.md` §5.4.

## 4a. Phase 4 gate rulings — resolved 2026-09-18

These are the review-page decisions, numbered as `prototype/index.html` numbers them.
**They are not the same as D1–D5 above**, which are the original plan decisions. All five
are closed; a fresh session must not re-litigate any of them.

| #     | Ruling                                                                                              | Consequence                                                                                                                                                                        |
| ----- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | £750/£45 and the 5/20/100 page counts are real (`home-data.ts`).                                    | Settled 2026-09-17. Prototypes and three MDX sources already corrected in `d6db9487`.                                                                                              |
| **2** | **The contact form is fixed at port, not now.**                                                     | All three faults are server-side, so they land in the React handler in Phase 5 where they can be tested end-to-end. Phase 5 also deletes the `contact.html?rig` demo rig (trap 5). |
| **3** | **The atmosphere footage stays as-is**, with its current honest captions.                           | No screen recordings to obtain. The three clips are not captioned as website captures, so ground rule 6 is satisfied. The ten `.slot` placeholders also stay.                      |
| **4** | **"Est. 2019" and "20+ sites delivered" both ship unchanged** — Ricky confirmed the count directly. | It was unsourced, not wrong. Ricky is the source of record; no citation needed. `/about` needs no edit.                                                                            |
| **5** | Burger-only at every width, on every page.                                                          | Confirmed twice. **D1 below is amended in place** — read the amendment, not the original sentence.                                                                                 |

**Still open, deliberately, and not a gate item:** the masthead measures 78–81% of viewport
height. A `max-height:1040px` compression on `.mast h1` is the proposed quietening. Offered
to Ricky twice and not taken up either time; leaving it alone until asked.

## 4b. Wave 2 merge record — 2026-09-18

Agents F (`/blog` ×3), G (`/locations` ×2) and H (the legal template) ran in parallel against
`wave2-brief.md`. `kit.css` went from 189,896 to **250,292 bytes**; `kit.css.pre-wave2.bak`
is the pre-merge record, as `kit.css.pre-phase4.bak` is for wave 1.

**Reconcile found exactly one collision:** `.prose .cscroll`, claimed by F and H — who had
written the _identical_ declaration for the identical reason (re-basing `.cscroll`'s
30px/4.6vh/54px onto `.prose`'s block rhythm). F's copy survives; H's is replaced by a comment
recording the convergence. No agent selector shadowed an existing `kit.css` selector.

**Verified after merge**, against a force-refreshed stylesheet, all 14 real pages at 1440×900
and 390×844: bar 81px / 65px, burger `grid` at both, **zero** document overflow, **zero**
elements escaping a scroll wrapper, `<meta name="description">` present on every page
(141–156 chars), 750 style rules parsed. `index.html` rebuilt to 15 cards, every referenced
file returning 200.

**Two claims in the handoff turned out to be wrong**, both found by measuring rather than
reading — see `bar-height-correction.md` for the first:

1. The inner-page bar is **81px, not 74.5px**, so `.detail{top:120px}` is correct and the
   queued "fix" would have introduced a 6.5px error.
2. The five wave 1 `kit-additions-*.css` files were described as orphaned with no page
   linking them. **Two pages still linked them** — `contact.html` → `-d`, `project-detail.html`
   → `-a`. Deleting the files as "orphaned" would have broken both. Verified redundant before
   unlinking: every selector already present in merged `kit.css`, and disabling each sheet
   changed 0 of 294 / 246 elements across 34 computed properties. Now genuinely orphaned.

**A new harness trap was found and is recorded as trap 8 in `wave2-brief.md`:** cache-busting
the HTML does not cache-bust `../kit.css`, so measurements after a merge silently describe the
_old_ stylesheet. It briefly produced a convincing false positive — `blog-list` appearing to
overflow at 390 with `.filterset` missing from the CSSOM — whose "fix" would have been to undo
a correct rule Agent F had already written. The tell was the rule count: 649 parsed against
750 on disk.

## 5. The agent plan

Five phases. The fan-out is phase 3, and deliberately not before.

### Ground rules — every agent, every phase

Drawn from what actually went wrong last time. These go verbatim into each prompt.

1. **Look at the reference, don't read about it.** Every agent must render the live
   homepage (`pnpm --filter @platform/dcs dev`, then screenshot `/`) and open the
   2026-08-26 projects prototype before writing anything. A prose summary of the
   tokens is not acceptable input.
2. **Quote real values.** Any CSS value an agent uses must be copied from
   `styles/home-r9.css` or `theme.config.ts`, with the line it came from. No
   values invented from memory, no "roughly matching" spacing.
3. **Exhaust the existing pattern library first.** Before designing anything new,
   check `.cards--2`, `.slot`, `.detail__l`, `.paytoggle`, `.panel`/`.p--*`,
   `.quote`, `.step`, `.svccard`, `.wpanel`. Anything genuinely new must be listed
   and justified in the agent's own output.
4. **Render and verify your own file.** Open it in a browser at 1440px and 390px,
   confirm it renders, and report what you found. On the homepage round this is what
   surfaced 4–8 real bugs per direction that reading alone missed.
5. **No count-up animations.** Ruled out for DCS. Static authored figures only.
6. **Honesty rules.** No generated image captioned as a real named client's
   premises, van or team. Nothing presented as Ricky or "our team" — no photograph
   of him exists. Projects without real footage use the `.slot` placeholder; they do
   not get a stand-in screenshot.
7. **Prices with commas never get `tabular-nums` or a mono face.** `£1,995` renders
   as `£1 , 995`. Archivo only for comma'd figures.
8. **Voice is first-person singular.** "I", not "we" — matching the homepage.
9. **Static HTML only.** No React, no edits under `sites/dcs/`. Everything lands in
   this session folder.

### Phase 1 — Visual vocabulary spec (1 agent, runs alone)

One agent reads `home-r9.css` in full plus the shipped `components/home/*` and
writes `design-kit.md`: the concrete, numeric spec every later agent builds against
— type scale and weights, tracking and leading values, spacing rhythm, the `--pad`
and `--r` clamps, border-radius set, the `cubic-bezier(.16,1,.3,1)` motion language,
card treatments, the ink/white/magenta/aqua/navy panel sequence and what governs the
order, hover and focus states.

This exists because the previous attempt's failure was nine agents each
independently interpreting a prose brief. One spec, derived from the real
stylesheet, removes that.

**Output:** `design-kit.md` + `kit.css` (the shared stylesheet every prototype
links, extending the 2026-08-26 `shared.css` rather than replacing it).

### Phase 2 — Chrome + one reference page (1 agent, runs alone, **you review**)

Same agent or a fresh one designs Tier 0 (header, footer, masthead, breadcrumb) and
applies it to **one** full page — `/services/[slug]`, chosen because it's a simple
content page with a real MDX body, so the chrome is what you're actually judging.

**This is the approval gate.** Nothing fans out until you've seen the chrome and
said yes. If the chrome changes later, every page changes with it — which is
precisely the trap that made the last attempt unrecoverable.

**Output:** `prototype/_chrome.html`, `prototype/service-detail.html`, updated
`kit.css`.

### Phase 3 — Parallel fan-out (5 agents, after your approval)

Wave 1 only, per D5. Each agent owns a coherent group — list and detail together,
because they share patterns and splitting them across agents guarantees drift.

| Agent | Designs                                          | Starting material                                                                                                        |
| ----- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| A     | `/projects` + `/projects/[slug]`                 | **round 1 prototype exists** — iterate it against the approved kit, don't restart. Carries the three testimonials per D3 |
| B     | `/services` (list only — detail done in phase 2) | 6 service MDX files                                                                                                      |
| C     | `/pricing`                                       | live 497-line page + the homepage `Pricing` component                                                                    |
| D     | `/contact` + success state + 404                 | live form, API route already working                                                                                     |
| E     | `/about`                                         | `content-brief.md` §1–3. Honesty rule binds hardest here — no photograph of Ricky exists                                 |

Wave 2 (`/blog` + post + categories, `/locations` ×2, legal template ×3) runs as a
second fan-out of 3 agents once wave 1 is approved. Holding it back means the kit
gets corrected once, on nine pages, rather than twice on sixteen.

Each agent outputs: its HTML file(s), any additions it needed to make to `kit.css`
(flagged separately so they can be reconciled), and a short note listing what it
reused, what it had to invent, and what it found when it rendered the page.

### Phase 4 — Reconcile and review (me, then you)

The fan-out produces six independent additions to `kit.css`. I merge them into one
stylesheet, resolve conflicts, rebuild the library page (`prototype/index.html`,
live scaled iframes as before so it never goes stale), and put the whole set in
front of you as one review — every page in one place, in the same chrome.

**This is the step the 2026-08-26 round never got.** Expect a round 2.

### Phase 5 — Port (separate session, not this one)

Only after the designs are signed off. The port is its own YOLO brief, and it
carries the cutover work with it: promote the r9 tokens properly, remove the
`noindex` from `app/(site)/layout.tsx`, fix the
`logoAlt="DCS Gardening & Landscaping"` bug, reconcile the two pricing toggles,
and unify the voice to first-person.

---

## 6. Sequencing at a glance

```
Phase 1  design-kit.md              1 agent    ──┐
Phase 2  chrome + 1 reference page  1 agent      │ sequential — the kit is the
         ▼ YOUR APPROVAL GATE ▼                  │ dependency for everything
Phase 3  wave 1 — 5 page groups     5 agents   ──┘ parallel, all against one kit
Phase 4  reconcile + review         me + you
         ▼ YOUR APPROVAL GATE ▼
Phase 3b wave 2 — 3 page groups     3 agents      blog, locations, legal
Phase 4b reconcile + review         me + you
Phase 5  React port                 separate session
```

---

## 7. What this session is not

- **Not a build.** Nothing under `sites/dcs/` changes. The output is static HTML in
  this folder, reviewable in a browser.
- **Not a content-writing session.** It uses the 21 posts, 13 case studies, 6
  services and 8 locations that already exist. D4 may generate follow-up content
  work; that's separate.
- **Not a cutover.** The `noindex` stays on until the pages are actually built and
  approved.
