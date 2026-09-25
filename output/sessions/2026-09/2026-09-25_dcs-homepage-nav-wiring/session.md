# DCS — wire the homepage into the inner pages

**Status:** **Implemented, gates green, verified in a real build. Uncommitted.**
**Date:** 2026-09-25
**Branch:** from `develop` (currently `c5499a1b`)

## The problem, in one line

The 15 inner pages are live, styled and indexable, but **nothing on the homepage links to
any of them**. Production is a one-page site with a full site bolted behind it, reachable
only from Google or by typing a URL.

Verified against production (`https://www.digitalconsultingservices.co.uk`), not localhost:

- Homepage internal links: `#top #work #services #pricing #faq #end` + `mailto:` + `tel:`.
  **Zero route links.**
- `/pricing`, `/about`, `/blog`: full six-route nav and a four-column footer, 24+ internal
  links each, all HTTP 200, all `<meta name="robots" content="index, follow">`.

So the wiring is entirely one-directional: inside → inside works, outside → inside does not.

## Why it shipped this way

The port's Phases 1–7 were scoped to the `(site)` route group. `app/page.tsx` sits **outside**
that group and was never in scope. Two chromes run in parallel:

|             | Bar                       | Menu                                     | Footer                     |
| ----------- | ------------------------- | ---------------------------------------- | -------------------------- |
| Homepage    | `home/site-bar.tsx`       | `home/mobile-menu.tsx` — **5 anchors**   | none (`.end` chapter only) |
| Inner pages | _the same_ `site-bar.tsx` | `site/site-menu.tsx` — **6 real routes** | `site/page-footer.tsx`     |

The bar is already shared. Only the menu and the footer diverged.

**This was predicted and missed.** `design-kit.md` §12 item 7 records that
`end-section.tsx`'s anchors-only instruction "is **superseded by decision D1** … Phase 2
should note that the comment will need updating at port time." It never was — the comment is
still in the file and still reads _"the 14 existing inner routes are not linked from the
homepage yet."_ D1's routing half, which the 2026-09-17 amendment explicitly preserved, ends:

> "Without this, sixteen designed pages stay unreachable and the homepage stays a one-pager
> with a site bolted behind it."

That is a verbatim description of production today.

## Ricky's rulings (2026-09-25) — the basis for this work

1. **Menu links go to the inner pages, not anchors.** The homepage burger carries the six
   real routes, the same as every other page.
2. **The footer is consistent across all pages** unless there is a good reason to diverge.
   Named precedent for a _legitimate_ divergence: on `colossus-scaffolding` the service pages
   carry more specific location links — **that is not required on DCS yet.**

## Scope

### Phase 1 — The homepage menu carries the six routes

`home/mobile-menu.tsx` and `site/site-menu.tsx` are structurally identical: same `.menu` root,
same `hidden={!menuOpen}` from `useHomeBehaviour()`, same click-to-close, same `.menu__foot`
email/phone. The only difference is the `<nav>` children — 5 `<a href="#…">` versus 6
`NavLink` routes from `PRIMARY_LINKS`.

- Render `<SiteMenu />` on the homepage in place of `<MobileMenu />` (`home/home-body.tsx:44`).
- **Delete `home/mobile-menu.tsx`.** It has no other consumer.
- Update `site-menu.tsx`'s own header comment: its stated reason for existing as a separate
  component ("the link _kinds_ differ … the homepage's are `#`-anchors") dissolves once the
  homepage uses routes. It becomes the single menu for the whole site.
- Keep `<SiteBar />` and the menu as **siblings** — Trap 11. `site-bar.tsx` has
  `backdrop-filter`, so nesting the `fixed inset-0` overlay inside it traps it in the bar's
  own box. Both components' headers document this; do not "tidy" them into a wrapper.

**Risk to check, not assume:** `home-behaviour.tsx` does document-level interception of
in-page anchor clicks (the sticky-position workaround — a sticky section reports its _pinned_
position, so native anchor nav silently does nothing). With routes in the menu there are no
`#` hrefs left there to intercept, but confirm the interception does not swallow or
`preventDefault()` a `next/link` navigation.

### Phase 2 — One footer everywhere

The two are already 2/3 shared. Both render `EndMain` then `.end__foot` (© + address). The
difference is the middle block:

- inner `.pagefoot`: `.footmap` — four columns (Pages / Services / Areas I cover / Get in
  touch + the three legal links), all from `site-chrome-data.ts`
- homepage `.end`: `.end__nav` — four in-page anchors

Work:

- **Extract `.footmap` into its own component** (e.g. `site/foot-map.tsx`) consumed by both
  `PageFooter` and the homepage's `EndSection`. One source of truth, so they cannot drift
  again. All link data already lives in `site-chrome-data.ts`.
- **Homepage `.end` gains `.footmap`** and loses `.end__nav`'s four anchors.
- This is what closes decision **D2** for homepage visitors: the eight location links live
  only in the footer, so today a homepage-only visitor never sees them at all.

**The one divergence I recommend keeping, and why.** The homepage's `.end` stays a
`<section class="panel p--navy end" id="end" data-ground="navy">` — a full-height closing
_chapter_ in the homepage's chapter-panel narrative — while inner pages keep the compact
`<footer class="pagefoot">`. Two reasons: the design deliberately distinguishes "closing
chapter" from "page footer" (`design-kit.md` G2 says `.end` "is the homepage's closing
_chapter_, full-height and centred, **not** a footer"), and
`home-markup-parity.test.ts:115` asserts the homepage's section id set is exactly
`{top, work, work-1..5, services, pricing, faq, end}`, so `#end` must remain a section.
**The link map becomes identical; the wrapper and the "Start a project" kicker stay
different.** If Ricky wants them literally identical instead, say so — it is a one-line
change to pass `eyebrow` and swap the wrapper, but it costs the homepage its closing beat.

Explicitly **not** in scope, per Ricky: per-service-page location links (the
colossus-scaffolding pattern). Not needed on DCS yet.

### Phase 3 — Retire the superseded instruction

`end-section.tsx:8-11` carries the now-void "Do not add links to /services, /pricing, /blog or
any other route" note. Delete it and replace with a line recording that D1 superseded it and
when. Leaving it invites a future session to revert Phases 1–2.

### Phase 4 — Homepage sections link onward (D1, separable)

D1 also rules that the homepage's own sections become previews that link onward: _"`#work`
becomes a teaser that ends at `/projects`, not the destination itself."_ Ricky has not
re-confirmed this half in the 2026-09-25 rulings, and it is genuinely separable from
Phases 1–3 — those alone fix reachability. Treat as **confirm before building**.

The sections themselves must stay: `home-markup-parity.test.ts:115` asserts the exact id set.
This phase adds an onward link _within_ each section, it does not remove sections.

### Phase 5 — The guard that was missing

**No test asserts the homepage's link set.** That is precisely why this shipped silently past
258 tests, a green CI and a Production Quality Gate. Add one, in the spirit of the existing
fidelity guards (`PRODUCT.md:58-82`):

- The homepage renders a link to each of the six `PRIMARY_LINKS` hrefs.
- The homepage renders the `.footmap` link set (or at least one `/locations/*` and the three
  legal links), so a footer regression is caught too.
- Derive expectations from `site-chrome-data.ts`, never a hardcoded copy — that is what keeps
  the guard true as the link sets change.

Per Trap #7: existing guards may legitimately fail on these changes. **Update them, never
weaken them.** `home-markup-parity.test.ts:187` ("every class the prototype applies to a live
element … is applied by some component") is the likely one, since `.end__nav` disappears from
the render while `r9-kota-level.html` still has it.

### Phase 6 — Ship and verify against production

`develop → staging → main` per root `CLAUDE.md`; `/deploy.changes` runs it.

**Verify on the live URL, not localhost.** Two traps make a local pass meaningless here: a
background `pnpm start` that failed with `EADDRINUSE` keeps serving the _old_ build while
`curl` still returns 200 (root `CLAUDE.md`, Dev Server Management), and the apex domain
308-redirects to `www.` so an un-followed fetch reports nothing useful. The acceptance check:

```bash
curl -sL https://www.digitalconsultingservices.co.uk/ \
  | grep -oE '<a [^>]*href="/[^"#]*"' | sort -u
```

Today this returns **nothing**. It must return the six routes plus the footer's link map.

## Acceptance criteria

1. Live homepage links to all six primary routes from the burger menu.
2. Live homepage footer carries the same link map as every inner page, including the eight
   locations and three legal pages.
3. No anchors-only menu or `.end__nav` remains; `mobile-menu.tsx` is deleted.
4. A test fails if the homepage stops linking to the six routes.
5. Gates green: type-check, lint, full test suite, `validate:all`.
6. The `end-section.tsx` instruction comment no longer contradicts the shipped behaviour.

## Files expected to change

| File                                  | Change                                     |
| ------------------------------------- | ------------------------------------------ |
| `components/home/home-body.tsx`       | `MobileMenu` → `SiteMenu`                  |
| `components/home/mobile-menu.tsx`     | **deleted**                                |
| `components/site/site-menu.tsx`       | comment: now the whole site's menu         |
| `components/site/foot-map.tsx`        | **new** — extracted `.footmap`             |
| `components/site/page-footer.tsx`     | consume `FootMap`                          |
| `components/home/end-section.tsx`     | `.end__nav` → `FootMap`; retire the note   |
| `test/home-*.test.ts` (+ a new guard) | update per Trap #7; add the link-set guard |

## Open question for Ricky

Phase 4 only: do the homepage's `#work` / `#services` / `#pricing` sections become teasers
that link onward to `/projects` / `/services` / `/pricing`, per D1? Phases 1–3 fix
reachability without it.

---

# Outcome — 2026-09-25

**Done.** The homepage went from **0** internal route links to **27**, verified against a real
production build (`next build` + `next start`), not jsdom:

| Group                   | Count | Example                                                        |
| ----------------------- | ----- | -------------------------------------------------------------- |
| Primary routes (menu)   | 6     | `/projects` `/services` `/pricing` `/blog` `/about` `/contact` |
| Service pages (cards)   | 6     | `/services/web-design`                                         |
| Location pages (footer) | 8     | `/locations/brighton`                                          |
| Legal pages (footer)    | 3     | `/privacy-policy`                                              |
| Case studies (work)     | 3     | `/projects/the-clothing-kings`                                 |
| Section link            | 1     | `/projects` ("See all work")                                   |

The homepage and inner-page footers are now **byte-identical apart from `aria-current="page"`**,
confirmed by diffing the rendered `.footmap` block from `/` against `/about`.

## Ricky's decisions as implemented

| Decision                                      | Outcome                                                                                                                       |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Menu → routes, not anchors                    | `mobile-menu.tsx` deleted; homepage renders the shared `SiteMenu`                                                             |
| One footer everywhere                         | `.footmap` extracted to `components/site/foot-map.tsx`, rendered by both                                                      |
| Keep `.end`'s design integrity                | `.end` stays a full-height `<section id="end">` chapter with the no-kicker `EndMain`; only the link map is shared             |
| Work panels: case study **and** all-work link | 3 of 5 panels link to `/projects/<slug>`; section links to `/projects`                                                        |
| CTAs keep `#end`                              | hero, bar pill and pricing CTA unchanged; asserted by a test so a future pass has to change the decision, not just the markup |
| Reword the card labels                        | 3 changed, 3 kept — see below                                                                                                 |

### The three reworded service-card labels

| Card                  | Was                     | Now                               |
| --------------------- | ----------------------- | --------------------------------- |
| Website design        | "Start a project →"     | "See how I build them →"          |
| Analytics & reporting | "See a sample report →" | "How I set up Google Analytics →" |
| Business email        | "Sort my email →"       | "How business email works →"      |

"See a sample report" was a promise the page does not keep — `/services/analytics` shows no sample
report. Its new label is grounded in that page's own "What I Set Up" section, which names GA4 and
Search Console. First-person singular throughout, per the port's Phase 6 voice decision.

## The bug this caught — worth reading before the next change of this shape

**`.footmap` rendered completely unstyled on the homepage at first**, and it looked plausible.
`.footmap`'s CSS lives only in `styles/inner-pages.css`, which `app/(site)/layout.tsx` imports and
`app/page.tsx` does not — the homepage loads `home-r9-reset.css` + `home-r9.css`. So the markup
arrived with no grid, no gaps, no border and no link sizing, and still read as a believable stacked
list in a screenshot. Only measuring it exposed it: `display: block`, `gridTemplateColumns: "none"`,
a 596px single column where the real rule gives four tracks.

**None of the gates would have caught it** — the tests render in jsdom, which applies no stylesheet
at all.

The fix is `styles/footmap.css`, a deliberate copy imported by the homepage. A copy, because all
three alternatives are closed: the homepage cannot import 4,474 lines of `inner-pages.css`; the
rules cannot move out of it (`chrome-parity.test.ts` asserts it is verbatim `kit.css`); and they
cannot go in `home-r9.css` (`home-css-parity.test.ts` asserts it is a verbatim port of the
prototype). The duplication is guarded by `test/footmap-css-parity.test.ts`, which compares
declaration-by-declaration after canonicalising Prettier's formatting — and was itself verified by
perturbing the copy (4 columns → 3) and confirming it fails.

## Guards added or updated

| File                              | Change                                                                                                                                                                                                                                                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `test/home-nav-links.test.ts`     | **New, 6 tests.** The missing guard: asserts the homepage links to all six primary routes, every service page, all locations and legal pages, `/projects` and each case study; that the anchor-only nav has not returned; and that `#end` survives. All expectations derive from `site-chrome-data.ts` / `home-data.ts`, never a hardcoded list. |
| `test/footmap-css-parity.test.ts` | **New, 3 tests.** Guards the CSS duplication above, and that the homepage still imports it.                                                                                                                                                                                                                                                      |
| `test/home-markup-parity.test.ts` | `.end__nav` is gone from the render but still in the prototype, so it is recorded in a documented `DELIBERATELY_NOT_RENDERED` allow-list — plus a new test asserting each entry is _still_ in the prototype and _still_ absent from the render, so the allow-list cannot rot.                                                                    |
| `test/home-data.test.ts`          | The three reworded labels cannot be verbatim-checked against the prototype. Recorded in `POST_PROTOTYPE_LINK_LABELS` and asserted by **exact value** instead of skipped, so a silent reword still fails. Updated in **both** places Trap #7 warns about (the per-block check and the independent recount).                                       |

**Gates:** 269 tests across 15 files (was 258/13), type-check clean, lint clean, `validate:all`
0 errors (23 pre-existing content warnings, untouched).

## Not done

- **Phase 4's section teasers beyond `/projects`.** `#services` and `#pricing` got no
  section-level onward link. `/services` would need a `.btn--ghost` on a **magenta** ground, and
  that is design-kit gap **G13** — an explicitly open decision, not one to settle inside a wiring
  change. All six service cards link out anyway, and `/services` is in both the menu and the footer.
- **Case studies for NP Racing and SM Commercial.** They have no `content/projects/*.mdx`, so 2 of
  5 work panels read differently from their neighbours. Ricky accepted this knowingly; writing the
  two pages is separate content work.
- **Not deployed.** Still on `develop`, uncommitted.
