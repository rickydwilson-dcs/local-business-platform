# DCS inner pages — the React port — handoff

**Status:** **the port is shipped and every item it TRACKED is closed — but the work is not
finished, because the homepage was never wired to it.** See "The gap this handoff did not
track" immediately below. PR #91 merged to `main` on 2026-09-24 (`8786cc3b`).
The port merged as PR #89 (2026-09-19) with fix PR #90 (2026-09-24). Blog `sector` became real
frontmatter on 2026-09-25 (`b1363f7c`). On 2026-09-25 Ricky also closed the last three open
questions: Search Console (no submission needed — verified live), solicitor review (signed off
as-is), and the `kit-additions-*.css` records (deleted). See "Open questions" and
"Tidy-up closed 2026-09-25" below.

**PR #91 is merged** — `8786cc3b`, 2026-09-24 23:49, all checks green (9 Vercel deployments,
Standard E2E, Cross-Site Smoke, "Verify promoted commit passed staging E2E"; Full E2E `skipping`,
its configured behaviour on this path). `staging` was **not** deleted — the repo has
`delete_branch_on_merge: false`. `origin/main` now contains `b1363f7c`.

**Branch:** `develop` at `c5499a1b` (the 2026-09-25 closure commit), one commit ahead of
`staging` and `main`, **committed but not pushed**. **Local `main`** is synced to `8786cc3b`,
fast-forwarded with `git fetch origin main:main` rather than a checkout — deliberately, because
the working tree held staged changes and Trap #2 makes a branch switch unsafe in that state.

## The gap this handoff did not track — found 2026-09-25

**Nothing on the homepage links to any of the 15 inner pages.** Production is a one-page site
with a full site bolted behind it; the inner pages are reachable only from Google or by typing a
URL. Verified live: the homepage's only links are `#top #work #services #pricing #faq #end` plus
`mailto:`/`tel:` — **zero route links** — while `/pricing`, `/about` and `/blog` each carry the
full six-route nav and four-column footer.

The cause is scope: Phases 1–7 covered the `(site)` route group, and `app/page.tsx` sits outside
it. The bar (`home/site-bar.tsx`) is already shared between homepage and inner pages; the **menu**
and the **footer** are not.

This was predicted. `design-kit.md` §12 item 7 says `end-section.tsx`'s anchors-only instruction
"is **superseded by decision D1** … Phase 2 should note that the comment will need updating at
port time." It was not, and that comment still reads _"the 14 existing inner routes are not linked
from the homepage yet."_ D1's own words: _"Without this, sixteen designed pages stay unreachable
and the homepage stays a one-pager with a site bolted behind it."_

**Why every gate missed it:** no test asserts the homepage's link set. 258 tests, CI and the
Production Quality Gate were all green throughout.

**Ricky's rulings, 2026-09-25:** menu links go to the inner pages, not anchors; the footer is
consistent across all pages unless there is a good reason to diverge (per-service location links,
as on `colossus-scaffolding`, are _not_ needed on DCS yet).

**Spec:** `output/sessions/2026-09/2026-09-25_dcs-homepage-nav-wiring/session.md`.

## Chaining — read these first, they are not repeated here

- `session-wrap-up.md` (this folder) — the retrospective: what was built, phase by phase.
- `yolo-brief.md` §`## Completed` (line 627) — the executing session's own completion record,
  with its commit list and deviations.
- `session.md` (this folder) — the Phase 5 spec the brief was generated from.
- `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/` — the design session: 15
  prototypes, `kit.css`, `notes-{a..h}.md`, and `HANDOFF.md`, **two of whose claims were
  disproved** (see that folder's `bar-height-correction.md`).

## What this was trying to resolve

The r9 brand was live on the DCS homepage and nowhere else: 15 inner routes still rendered the
old **solaris** chrome and every one was `noindex`. Two earlier attempts failed by designing
while porting. The fix was to design as static HTML against a numeric spec first (2026-09-15
session, approved by Ricky 2026-09-18), then port in a separate session with no design
decisions in it. That is what shipped.

**Explicit user decisions that constrain any follow-up — do not re-litigate:**

| Decision                            | Ruling                                                                                                                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prices                              | £750 / £45, counts 5/20/100. Never £995/£59                                                                                                                                 |
| Header                              | Burger at every width, no desktop link row                                                                                                                                  |
| Case / voice                        | Sentence case; first-person singular — **except the three legal bodies**                                                                                                    |
| Legal voice                         | The 91 `we/us/our` **stay plural** — in Terms §1 and Privacy §1 they are _defined terms_ naming the contracting party, so changing them alters the contract, not the design |
| `/reviews`                          | Dropped as a route — three testimonials advertise that there are only three                                                                                                 |
| Contact form                        | Fixed at port, not during design                                                                                                                                            |
| Atmosphere footage                  | Stays as-is, with its honest captions                                                                                                                                       |
| "Est. 2019" / "20+ sites delivered" | Both ship unchanged; Ricky is the source of record for the count                                                                                                            |

## Actions taken

Port commits on `develop` (all now on `main`), oldest last:

| SHA        | What it did                                                                                                                                                                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `4130df12` | Stopped the three legal pages restamping their "last updated" date on every build — `new Date()` → authored `'23 August 2026'`                                                                                                                                              |
| `d08243e6` | **Phase 1** — ported the r9 chrome to the `(site)` route group; solaris `PageShell`/`SiteHeader`/`SiteFooter` gone                                                                                                                                                          |
| `2173e686` | **Phase 2** — the nine wave 1 pages                                                                                                                                                                                                                                         |
| `64b9d4e0` | **Phase 3** — the six wave 2 pages, including the new `/blog/category/[slug]`                                                                                                                                                                                               |
| `48e0796f` | **Phase 4** — contact submission, duplicate blog h1, Brighton breadcrumb, location ordering                                                                                                                                                                                 |
| `346af975` | **Phase 5** — per-page indexing opt-in                                                                                                                                                                                                                                      |
| `225c94f3` | **Phase 6** — first-person singular across services, blog, locations, projects                                                                                                                                                                                              |
| `eb299959` | **Phase 7** — fidelity guards updated                                                                                                                                                                                                                                       |
| `07e5c25d` | Kept the design-session `kit.css` read-only, allowlisting the CSS fix instead                                                                                                                                                                                               |
| `84cc16f9` | **Dropped the unwired blog sector filter axis** (see "What was NOT done" #1)                                                                                                                                                                                                |
| `7492232b` | Fixed the orphaned-CSS bug in the archived design-session `kit.css` — PR #90                                                                                                                                                                                                |
| `b1363f7c` | **Promoted blog `sector` to real frontmatter** on all 21 posts; deleted the derived `BLOG_SECTOR_BY_SLUG` map; added the field to the shared schema as **optional**; added a `toBlogSector()` narrowing helper. Also corrected this file's wrong "orphaned dead code" claim |

Merges: PR **#89** "Promote: DCS inner-pages port" (2026-09-19, 119 files, +15,038/−2,943),
PR **#90** "Fix: orphaned-CSS bug in the archived kit.css design record" (2026-09-24).

## Current state — verified 2026-09-25 (port facts re-checked 2026-09-24)

**Verified by running the check, not recalled:**

- **`develop`, `staging`, `main` are level.** `git log origin/main..origin/develop` → **0**.
  Local `main` is stale at `a6cc38eb` against `origin/main` `ea3338db` — pull before using it.
- **The solaris chrome is gone.** `grep -c "PageShell\|SiteHeader\|SiteFooter"` on
  `app/(site)/layout.tsx` → **0**.
- **`/reviews` is deleted** — `app/(site)/reviews` does not exist.
- **The group-level default-deny survived**, exactly as `PRODUCT.md:53-56` requires:
  `robots: { index: false, follow: false }` is still in `app/(site)/layout.tsx`. The design
  session's handoff said to delete it; that advice was wrong and was **not** followed.
- **All 15 routes opt into indexing** — services ×2, projects ×2, blog ×3, locations ×2,
  pricing, contact, about, and the three legal pages. **Grep for `robots`, not for
  `export const robots`:** each sets `robots: { index: true, follow: true }` _inside_ its
  `metadata` object or its `generateMetadata` return, so `grep 'export const robots'` returns
  **zero** and looks alarmingly like the opt-in never shipped. It did — confirmed live, every
  route serving `<meta name="robots" content="index, follow">` (see Open questions #1).
  The two dynamic blog routes also carry a `robots: { index: false }` branch for their
  not-found case, which is correct.
- **`logoAlt` no longer exists at all.** The old `logoAlt="DCS Gardening & Landscaping"` (two
  occurrences) is gone because the r9 bar uses an inline SVG marked `aria-hidden` and takes no
  `logoAlt` — a better outcome than correcting the string.
- **CI green on `main` after PR #90** — CI 3m47s, Production Quality Gate 2m11s, both success.
  (E2E Tests `skipped` on that run, which is its configured behaviour for this path, not a failure.)

- **Blog `sector` is now real frontmatter on all 21 posts** — `grep -c '^sector:' content/blog/*.mdx`
  → 21/21, distribution **20 `trades` + 1 `motorsport`**. The derived `BLOG_SECTOR_BY_SLUG` map is
  gone: `grep -rn BLOG_SECTOR_BY_SLUG` → no hits.
- **The field is OPTIONAL in the shared `BlogFrontmatterSchema`** (`packages/core-components`), and
  must stay so — six sites carry blog content and only DCS authors it. Verified by running blog
  validation on **all six** sites (base-template, colossus-scaffolding, dch-automotive,
  dj-fox-electrical, mad-graphics, dcs): all pass.
- **Behaviour unchanged, checked in the build output not assumed:** `/blog` renders "Trades and
  contractors — 20 guides, across all 7 topics", "Motorsport and teams — 1 guide, on speed under
  load", the four empty sectors, and the featured post's badge. 20 + 1 = 21.
- **Gates green on the `b1363f7c` base:** type-check (core-components + dcs), lint, build,
  **258 tests across 13 files**, `validate:all` 0 errors.

**Unverified — do not treat as checked:**

- **Nothing was inspected in a browser this session.** No page was rendered, screenshotted or
  measured on 2026-09-24. Every claim above is from git, grep and the GitHub API.
- **The live deployed site was not fetched.** Whether Vercel has served the newly-indexable pages,
  and whether Google has picked them up, is unknown here.
- **The e2e smoke suite was not re-run locally.** It passed in the executing session's Phase 7
  and in `staging` CI; it has not been run since PR #90.

**No live-data changes were made in this session.** This session only read state and wrote this
file. The port itself wrote code, which is now deployed via the normal branch promotion.

## What was NOT done

1. ~~**`sites/dcs/lib/blog-sectors.ts` is now orphaned dead code.**~~ **WRONG — CORRECTED
   2026-09-25.** The file was never orphaned: it is imported by **four** components
   (`blog-list-page`, `blog-post-page`, `blog-category-page`, `blog-filter-section`) and drives
   live user-visible copy — the featured badge, the aqua "who it's for" band, and the per-post and
   per-category badges. The original claim came from a `grep` that **errored under zsh**
   (`--include=*.ts: no matches found`) whose `||` fallback then printed "referenced nowhere"; that
   output was taken at face value instead of being checked. **Resolved 2026-09-25:** `sector` was
   promoted to real authored frontmatter on all 21 posts, the derived `BLOG_SECTOR_BY_SLUG` map is
   gone, and the file now holds only the vocabulary plus a narrowing helper.
2. **`/blog` ships with ONE filter axis, not two — and that is a settled decision, not a gap.**
   `84cc16f9`'s own commit message records it: _"Ricky declined the 'who it's for' filter chips on
   /blog — most posts will stay generic across standards/technique rather than sector-specific, so
   a filter showing ~20/21 posts under one chip isn't useful yet."_ D4 asked for the axis; Ricky
   ruled against the interactive chips once he could see the real distribution (20 of 21 under one
   chip). **Do not re-add the filter chips.** The sector data still drives the non-interactive copy.
3. **The 21 blog titles' sentence-case conversion** — Phase 6 covered the voice pass; confirm
   whether the Title Case titles were converted in the MDX, as it was bundled into the same phase.
4. **No Search Console submission.** The pages became indexable; nobody told Google. No sitemap
   ping, no URL inspection, no indexing request.
5. **`terms-and-conditions/page.tsx` still carries its TODO** saying the terms have never had
   solicitor review — and the port made them considerably more findable by indexing them.
6. **The design session's five wave-1 `kit-additions-*.css` files** remain in the design folder as
   per-agent records. Harmless, but they are not inputs to anything.

## Traps

1. **ANOTHER SESSION IS WORKING IN THIS SAME CHECKOUT, and it moves your `HEAD` and pushes your
   commits.** Both happened on 2026-09-25 and neither gave any warning:
   - **It switches your branch underneath you.** A `git checkout develop` succeeded, ~40 minutes of
     work followed, and by staging time the tree was silently back on `staging` — 28 files staged on
     the wrong branch, caught only because Ricky spotted it at the commit prompt. **Re-check
     `git branch --show-current` in the same command block as `git add`/`git commit`**, never once
     at the start. A tell: the branch tip has advanced since you last looked (`develop` went
     `7492232b` → `a7262c19` mid-session).
   - **It pushes and promotes work you were told to leave alone.** Ricky explicitly said "leave it"
     about `b1363f7c`; within the hour that commit was on `origin/develop`, `origin/staging`, and in
     **open PR #91** to `main`. **Do not assume an instruction to hold still holds** — re-check the
     remote before acting on it.
   - **Never `git add -A` here.** Stage explicit paths, or you sweep the other session's work into
     your commit. (`output/sessions/.current-session` points at **their** folder,
     `2026-09/2026-09-24_autcobel-redesign` — not this one.)
2. **Switching branches with a staged index is safe ONLY if the touched paths are identical between
   the two branches.** Verify with `git diff --name-only <a> <b> -- <paths>` (empty = safe) before
   switching, then **re-run the gates on the new base**, because the base may have moved. That is
   what was done to recover the mis-staged commit above.
3. **Root `CLAUDE.md` mandates `develop → staging → main` and "ALWAYS start on `develop`".**
   Committing to `staging` directly violates the project's non-negotiable workflow. At the time of
   writing the tree **is** on `develop` — but see Trap #1: that is not a fact you can rely on for
   the length of a task.
4. **The orphaned-CSS bug was introduced by this work's own merge script, and every check missed
   it.** `git log -S` traces the bad line to `c0de8d0a` (the wave 2 `kit.css` merge): a
   `RECONCILED: …` note was appended as raw text _outside_ any `/* */` block — invalid CSS. It
   survived because **webpack's parser silently tolerates it and the browser's does too** (the
   design harness loaded `kit.css` via a `<link>` and reported 750 rules parsed, all green), while
   **Turbopack rejects it outright** — which is why it only surfaced later as a crashed `next dev`
   and a failing `test:e2e:smoke`. Brace-balance and comment-balance checks both passed, because it
   is neither. **Lesson for any future CSS merge: a clean browser render and a green webpack build
   do not prove the CSS is valid.** Parse it with the strict parser, or run `next dev`.
5. **The design session's `HANDOFF.md` contains two disproved claims.** It says the inner-page bar
   measures 74.5px (it is **81px** — the 74.5 figure predates Decision 5 and the burger becoming
   visible at desktop), and that the five wave-1 additions files are orphaned with no page linking
   them (**two pages still linked them**). Both are corrected in place in that folder, with the
   reasoning in `bar-height-correction.md`. Read the corrections, not just the original sentences.
6. **`prototype/*.html` still contains `<nav>` markup in every bar**, hidden by CSS. That was
   deliberate during review and was correctly **not** ported. If the prototypes are ever reused as
   a reference for another site, do not port that `<nav>`.
7. **Fidelity guards will fail on legitimate future changes, and that is correct.**
   `home-css-parity.test.ts` compares `home-r9.css` **by position** (a removed rule shifts every
   later one out of alignment); `home-data.test.ts` needs a changed string updated in **two**
   places or its independent recount re-flags it; `indexability.test.ts` boots a real
   `next start` and reads real HTTP responses. Update them; never weaken them. See
   `sites/dcs/PRODUCT.md:58-82`.

## Next step

**Nothing is required of this work — it is shipped, and its last loose end is closed and already
promoted to `staging`.** The one thing worth watching is not yours to merge:

**1 — Watch PR #91, which carries this work to `main`.** It was opened by the other session, not
this one, and CI was still running at the time of writing:

```bash
cd /Users/rickywilson/Sites/local-business-platform
gh pr checks 91
gh pr view 91
```

If it has merged since, confirm the sector work landed:

```bash
git fetch && git branch -r --contains b1363f7c    # expect origin/main to appear
```

**2 — Sync the stale local `main`** (cosmetic, but it will mislead a fresh session):

```bash
git checkout main && git pull    # local a6cc38eb -> origin ea3338db (or later, once #91 merges)
```

**3 — If a genuinely new DCS task starts**, begin from `develop` and re-read Trap #1 first:

```bash
git checkout develop && git pull
git branch --show-current        # and again, immediately before you stage anything
```

## Open questions

**All three are closed as of 2026-09-25 — by Ricky's ruling, and each verified before closing.**

1. ~~**Search Console has never been told the inner pages became indexable.**~~ **CLOSED — no
   submission needed; discovery is automatic and was verified live.** Checked against the
   deployed site, not the source:
   - `robots.txt` serves `Sitemap: https://www.digitalconsultingservices.co.uk/sitemap-index.xml`
     and `Allow: /`. Google follows that without anyone submitting anything.
   - `/sitemap-index.xml` returns all five section sitemaps, all HTTP 200:
     core **16** URLs, services **7**, locations **9**, blog **22**, projects **14** —
     66 unique URLs, matching content exactly (6 services, 8 locations, 21 posts, 13 projects,
     each section sitemap carrying its own index entry, plus 7 `/blog/category/*` in core).
   - The four section sitemaps derive from `listSlugs()`, so new MDX appears with **no code
     change** — the sitemap cannot go stale as content is added.
   - The other half of "will they be found": every one of the 14 routes spot-checked live returns
     HTTP 200 with `<meta name="robots" content="index, follow">`. `/` correctly has no robots
     meta (it sits outside the `(site)` group and is indexable by default).
   - Note: the apex domain 308-redirects to `www.` — fetch the `www.` host when checking.

2. ~~**The terms have never had solicitor review.**~~ **CLOSED — reviewed and signed off by
   Ricky on 2026-09-25, accepted as-is; no solicitor review sought and none considered
   necessary.** The `TODO` at `terms-and-conditions/page.tsx:4` has been replaced with that
   ruling, so it no longer reads as pending work. It is the only TODO across the three legal pages.

3. ~~**A memory of the concurrent-session branch hazard (Trap #1) was drafted and declined.**~~
   Still true and still unrecorded outside this file. Left as-is.

## Tidy-up closed 2026-09-25

- **The `kit-additions-*.css` files are deleted.** There were **eight** (a–h), not the five that
  both this file and the design folder claimed — wave 2's f, g, h were never counted. Verified
  safe first: nothing linked them (all 15 prototypes load only `../kit.css`), no test read them,
  and all **366** class selectors across the eight are present in the shipped
  `sites/dcs/styles/inner-pages.css`. Full record and the reasoning:
  `2026-09-15_dcs-inner-pages-design/kit-additions-removed.md`.
- **`inner-pages.css` was deliberately NOT edited** to fix the three now-stale
  `Source: kit-additions-*.css (kept unmerged...)` comments — `chrome-parity.test.ts` asserts it
  is a verbatim copy of the design folder's `kit.css`, so a comment-only edit there fails the
  guard. The correction lives in `kit-additions-removed.md` instead.
- **Trap #5 of this file is itself wrong about these files.** It says the design handoff's
  "orphaned, no page links them" claim was disproved by two pages still linking them.
  `bar-height-correction.md` lists that claim under **"What still stands"**, and a link audit
  finds zero references. The two-pages disproof applies to the stray `_*harness*` files.
- **Gates re-run green on this change:** dcs type-check clean, lint clean,
  **258 tests across 13 files** passing.

## Still on the design folder's tidy-up list — NOT done, nobody has ruled on these

From `bar-height-correction.md` §"What still stands". Raised here so they are visible, not acted on:

- `kit.css:931` and §34 both hide `.bar nav` at a breakpoint, for a nav hidden at all widths.
- `.panel--tight` (`kit.css:344`) duplicates `.mast`.
- Eight stray harness files in `prototype/` (`_a_harness`, `_d_harness`, `_harness-b`,
  `_harness-b390`, `_harness-e`, plus wave 2's three).

Note that `kit.css` is **guarded** — `chrome-parity.test.ts` compares it against
`sites/dcs/styles/inner-pages.css` verbatim, so the first two cannot be fixed in one file alone.
