# DCS inner pages — design session — handoff

**Status:** ready-to-resume — wave 1 design is complete and committed; Phase 4 review is
in front of Ricky. Nothing has been ported to React. Four content files in `sites/dcs/`
were corrected and committed (prices + voice); no site has been built, deployed or pushed.
**Branch:** `develop` (base `57b67756`) — **6 commits ahead of `origin/develop`, none pushed.**
**Commits:** 5 from this work (`5aad6720`…`fa778ec0`), plus one pre-existing unpushed
dpm-autobody commit (`b4e45908`) that is **not ours** — do not assume it is.
**Working tree:** one unrelated modified file, deliberately untouched throughout:
`output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/content-brief.md`

> Written from Agent C's seat (the `/pricing` agent in the Phase 3 fan-out). Claims about
> other agents' pages are from rendering and grepping them, not from their notes.

---

## What this is trying to resolve

The r9 brand is live on the DCS homepage and nowhere else. All 14 inner routes are still
old-brand and `noindex`. Two previous attempts to finish the site stalled — the first
because nine agents rebuilt from a _prose_ description of the tokens and produced generic
layouts ("not one thing has picked up any of the design cues other than colours"), the
second because it produced one round of prototypes and stopped.

This session runs the correct process to completion: design as static HTML first, against a
numeric spec derived from the shipped stylesheet, then port in a separate session.
Full plan and the five resolved decisions (D1–D5) are in `session.md`.

**Explicit user decisions made during this session — a fresh session must not re-litigate:**

| Decision                          | Ruling                                                                                                                                            | Where recorded                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Which price ladder is real**    | `home-data.ts` — £750/£45, and the page counts (5/20/100). NOT `web-design.mdx`'s £995/£59, NOT the old page's 20/50 counts.                      | `notes-c.md` §8, `index.html` Decision 1         |
| **Two-year totals on `/pricing`** | Remove. _"they can do the math - i dont want to do it for them."_ Breakeven reasoning removed from **both** sides, not just the unflattering one. | `notes-c.md` §4, §14                             |
| **Desktop header**                | **Burger at every width, no link row** — matching the shipped homepage. Contradicts the original D1.                                              | `session.md` D1 (amended), `kit.css` §26 comment |
| **Copy register**                 | Everything customer-facing and publish-ready. No editor/reviewer notes in rendered copy.                                                          | `notes-c.md` §14                                 |
| **Case**                          | Sentence case everywhere.                                                                                                                         | `notes-c.md` §15                                 |

---

## Actions taken

| SHA        | What it actually did                                                                                                                                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `5aad6720` | **Committed the whole design session for the first time** — 30 files, 972K, all text. It had never been committed. See "Traps" — it briefly vanished.                                                                                                      |
| `d6db9487` | Corrected £59→£45 and £995→£750 across **three** content MDX files. Also fixed two false claims: "spread over 12 months" (no such term exists; the site publishes a 24-month minimum) and the blog's "three or four years" crossover (really month 22–24). |
| `7e355c6f` | `notes-c.md` — recorded the source correction, flagged the remaining voice pass.                                                                                                                                                                           |
| `6f0e65e3` | `prototype/index.html` — Decision 1 still told the reviewer the MDX files were outstanding after they had been fixed.                                                                                                                                      |
| `fa778ec0` | First-person singular voice in `web-design.mdx` and `pay-monthly-vs-upfront-website.mdx`, plus sentence-case headings in `web-design.mdx` so the source matches the approved prototype.                                                                    |

---

## Current state — verified 2026-09-18

**Verified by running the check, not recalled:**

- **9 prototype pages** in `prototype/` (`404`, `about`, `contact`, `pricing`,
  `project-detail`, `projects-list`, `service-detail`, `services-list`, plus `index.html`
  as the Phase 4 review page and `_chrome.html` as the chrome specimen sheet).
- **`kit.css` = 189,896 bytes**, all five Phase 3 `kit-additions-*.css` merged in by the
  orchestrator. `kit.css.pre-phase4.bak` (93,312 bytes) is the pre-merge record. The five
  `kit-additions-*.css` files are now **orphaned** — merged, and no page links them.
- **Static server on `:4173` serves the session root and returns 200.** `index.html` is
  the review entry point.
- **All 8 real pages, checked at 1440×900 in an iframe harness:** `.bar nav` computes
  `display:none`, `.bar .burger` computes `display:grid`, the overlay opens at the **full
  1440×900 viewport** (so the `fixed inset-0` containing-block trap is not armed), and
  `documentElement.scrollWidth <= innerWidth` on every one.
- **All 8 pages carry a `<meta name="description">`** (141–151 chars). Seven of them had
  none before this session.
- **No `£995` or `£59` in any rendered content**, in the prototypes or in `sites/dcs/`.
  Remaining matches are explanatory HTML comments only.
- **No breakeven language on `/pricing`** — `month 22`, `month 24`, `long enough run`,
  `cheaper in total` all absent from rendered body text.
- **`web-design.mdx` and `service-detail.html` now agree character-for-character** on the
  page title and all five `##` headings, and neither contains plural first person.
- **Zod content validation passes** for `services` (6/6) and `blog`.
- **Comma trap clear:** every comma'd price on `/pricing` measured at both 1440 and 390 —
  comma-to-digit advance ratio **0.48–0.50** (a tabular or mono comma would be ~1.0), zero
  ancestors with non-`normal` `font-variant-numeric`, zero mono ancestors.

**Assumed / unverified — do not treat as done:**

- **Nothing has been built or type-checked.** `pnpm build`, `type-check` and lint have not
  been run this session. The MDX edits are content-only, but that is reasoning, not a gate.
- **The other four agents' pages were checked for chrome, prices, case and copy register —
  not for their own design decisions.** Their notes (`notes-a/b/d/e.md`) were not re-read
  after the recovery.
- `lvh`/`svh`, `prefers-reduced-motion`, `@media (hover:none)` and `env(safe-area-inset-*)`
  are **untestable** in this harness. Construction rules only.
- Contrast figures in `notes-c.md` are **calculated by hand, not tool-measured.**

**No live-data changes were made.** Nothing was deployed, pushed, or written to any
external system. The only writes outside the session folder are the four committed content
MDX edits on a local branch.

---

## What was NOT done

- **No React port. Nothing under `sites/dcs/` was ported.** Phase 5 is a separate session
  and carries its own cutover work: removing `robots: { index: false }` from
  `app/(site)/layout.tsx`, fixing `logoAlt="DCS Gardening & Landscaping"`, and reconciling
  the two pricing UIs into one `<Pricing/>` component.
- **Wave 2 was never started** — `/blog`, `/blog/[slug]`, blog categories, `/locations`,
  `/locations/[slug]` and the legal template ×3 have no designs. `session.md` §5 holds them
  back until wave 1 is approved.
- **Nothing is pushed.** All 6 commits are local.
- **The first-person-plural voice pass is ~90% undone.** Only the two files whose page is
  already designed were fixed. Remaining, counted 2026-09-18:

  | Content                                   | Files    | Lines |
  | ----------------------------------------- | -------- | ----- |
  | `content/services/*.mdx` (the other five) | 5        | 67    |
  | `content/blog/*.mdx`                      | 18 of 21 | 45    |
  | `content/locations/*.mdx`                 | 8 of 8   | 75    |
  | `content/projects/*.mdx`                  | 13 of 13 | 42    |

  This is a judgement-call pass, **not** find-and-replace — "DCS offers" is fine, "we fix
  it" is not. Natural time is alongside the wave 2 designs.

- **Blog heading case left Title Case deliberately.** `/blog` has no approved design, so
  restyling ahead of one would be guessing. Only `web-design.mdx` was case-corrected,
  because its page is designed and approved.
- **Five harness files were left in `prototype/`** and are committed:
  `_a_harness.html`, `_d_harness.html`, `_harness-b.html`, `_harness-b390.html`,
  `_harness-e.html`. Other agents' scaffolding, not deliverables. Safe to delete.
- **Redundant CSS left for a single tidy pass, not edited piecemeal:** `kit.css:931` and
  §34 both still hide `.bar nav` at a breakpoint, for a nav that is now hidden at all
  widths. `.panel--tight` (`kit.css:344`) duplicates `.mast`. `.detail{top:120px}`
  (`kit.css:732`) hardcodes an offset for an 81px bar; the inner-page bar measures
  **74.5px at 1440 and 65px at 390**.

---

## Traps

1. **The session folder was untracked and briefly disappeared.** Mid-session `ls` reported
   the whole folder gone while the repo was on `staging`; there are three stashes in play,
   one "On staging". There was **no Time Machine destination and no APFS snapshot.** It was
   recovered from Chrome's HTTP cache via a temporary receiver on port 9876 (since stopped),
   then reappeared on its own when the branch returned to `develop`. **It is now committed
   (`5aad6720`), which is the actual fix.** Do not let it go uncommitted again.
2. **Chrome's cache served _stale_ copies during that recovery.** Four files came back from
   an older cache entry because their most recent loads had used cache-busting query
   strings, so the bare-URL entry was older. Those edits were re-applied and re-verified.
   **If anything looks reverted, check against the markers in `notes-c.md` §13–15 rather
   than trusting the file.**
3. **`session.md` D1 says "the nav becomes real page links" — it is amended in place, not
   deleted.** Read the amendment block, not just the original sentence. A fresh agent that
   reads only the original will "fix" the burger back into a desktop link row.
4. **The `<nav>` markup is still in every prototype's bar**, hidden by CSS. That is
   deliberate (one declaration to flip while under review). **At port time it should be
   dropped, not hidden** — `site-bar.tsx` already renders no `<nav>`.
5. **`contact.html`'s demo rig is hidden, not deleted.** `contact.html?rig` shows a floating
   panel that drives the four form states. Delete the `.rig` block, its CSS (~line 51) and
   the `rig` variable in the submit handler at port time.
6. **`window.scrollTo({top})` silently does nothing in a backgrounded iframe** — smooth
   scrolling is rAF-driven and rAF does not fire there. Use `behavior:'instant'`. This is a
   _different_ failure from the `documentElement.scrollTop` no-op caused by
   `html{overflow-x:clip}`, and it looks identical. Also: `offsetTop` inside a `.sec` is
   relative to the `.sec`, not the document — use `getBoundingClientRect().top + scrollY`.
7. **`IntersectionObserver` never fires in the harness** (the tab is backgrounded when the
   JS tool runs), so `.res` headings stay in their muted rest colour and `.in` must be
   latched by hand for captures. Nothing about scroll behaviour can be inferred from a
   harness screenshot.
8. **`.slot`'s "Awaiting footage / Capture not yet taken" is not a defect.** It is the
   designed honesty mechanism for the ten case studies with no real video. Leave it.

---

## Next step

**1 — Make the work durable off this machine** (highest value, 6 commits exist only here):

```bash
cd /Users/rickywilson/Sites/local-business-platform
git log --oneline origin/develop..develop   # expect 6, incl. b4e45908 which is NOT this work
git push origin develop
```

**2 — Review wave 1** (the Phase 4 gate Ricky is at):

```bash
# server should already be up; if not:
cd output/sessions/2026-09/2026-09-15_dcs-inner-pages-design && python3 -m http.server 4173
open http://localhost:4173/prototype/index.html
```

`index.html` lists five open decisions; **Decisions 1 and 5 are already settled** (marked
SETTLED/CONFIRMED). Decisions 2, 3 and 4 still need Ricky:

- **D2** — the contact form cannot receive an enquiry (CSRF header 403, `request.json()` on
  a form-encoded body 400, mismatched honeypot names). Fix now or at port?
- **D3** — the three project videos are sector atmosphere, not website captures. Three
  screen recordings would settle it; all three sites are live.
- **D4** — "Est. 2019" is supported by `content-brief.md`; "20+ sites delivered" is
  unsourced. Confirm, correct or drop.

**3 — Then either** wave 2 (3 agents: blog ×3, locations ×2, legal ×3) **or** Phase 5 port.
Wave 2 first is what `session.md` §5 specifies — it gets the kit corrected once across
sixteen pages rather than twice.

---

## Open questions

1. **Push and promote?** `develop` → `staging` → `main` via `/deploy.changes` is the project
   workflow. Nothing has been pushed. The content price fix is a real correction to
   published-but-noindexed copy and arguably should not wait for the design review.
2. **The remaining ~229 lines of plural voice** (44 files) — do it as its own content pass,
   or fold it into wave 2 where the pages get designed?
3. **Decisions 2, 3, 4 on the review page** — all three need Ricky before Phase 5.
4. **The masthead is loud** — measured at 78% of viewport height by Phase 2 and 81% by
   Agent E, independently. A `max-height:1040px` compression on `.mast h1` would quieten it,
   matching how `.stack h2` and `.wpanel__n` are already handled. Flagged twice, never
   actioned.
