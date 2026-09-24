# DCS inner pages — the React port — handoff

**Status:** **ready-to-resume — the port is SHIPPED and fully promoted to `main`.** All 7 brief
phases executed, merged as PR #89 (2026-09-19) with follow-up fix PR #90 (2026-09-24). CI green
on `main`. **This handoff exists only for the residue and the traps** — the retrospective record
is already written (see "Chaining" below), so a fresh session should not re-do any of the port.
**Branch:** currently checked out on **`staging`**, not `develop`. `develop`, `staging` and
`main` are all level — `origin/main..origin/develop` is **0 commits**. Nothing unpushed.
**Working tree:** **dirty, but none of it is this work** — see "Traps" #1.

> `git status --porcelain` at 2026-09-24:
>
> ```
>  M output/sessions/.current-session
> ?? output/sessions/2026-09/2026-09-24_autcobel-redesign/
> ```

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

| SHA        | What it did                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `4130df12` | Stopped the three legal pages restamping their "last updated" date on every build — `new Date()` → authored `'23 August 2026'` |
| `d08243e6` | **Phase 1** — ported the r9 chrome to the `(site)` route group; solaris `PageShell`/`SiteHeader`/`SiteFooter` gone             |
| `2173e686` | **Phase 2** — the nine wave 1 pages                                                                                            |
| `64b9d4e0` | **Phase 3** — the six wave 2 pages, including the new `/blog/category/[slug]`                                                  |
| `48e0796f` | **Phase 4** — contact submission, duplicate blog h1, Brighton breadcrumb, location ordering                                    |
| `346af975` | **Phase 5** — per-page indexing opt-in                                                                                         |
| `225c94f3` | **Phase 6** — first-person singular across services, blog, locations, projects                                                 |
| `eb299959` | **Phase 7** — fidelity guards updated                                                                                          |
| `07e5c25d` | Kept the design-session `kit.css` read-only, allowlisting the CSS fix instead                                                  |
| `84cc16f9` | **Dropped the unwired blog sector filter axis** (see "What was NOT done" #1)                                                   |
| `7492232b` | Fixed the orphaned-CSS bug in the archived design-session `kit.css` — PR #90                                                   |

Merges: PR **#89** "Promote: DCS inner-pages port" (2026-09-19, 119 files, +15,038/−2,943),
PR **#90** "Fix: orphaned-CSS bug in the archived kit.css design record" (2026-09-24).

## Current state — verified 2026-09-24

**Verified by running the check, not recalled:**

- **`develop`, `staging`, `main` are level.** `git log origin/main..origin/develop` → **0**.
  Local `main` is stale at `a6cc38eb` against `origin/main` `ea3338db` — pull before using it.
- **The solaris chrome is gone.** `grep -c "PageShell\|SiteHeader\|SiteFooter"` on
  `app/(site)/layout.tsx` → **0**.
- **`/reviews` is deleted** — `app/(site)/reviews` does not exist.
- **The group-level default-deny survived**, exactly as `PRODUCT.md:53-56` requires:
  `robots: { index: false, follow: false }` is still in `app/(site)/layout.tsx`. The design
  session's handoff said to delete it; that advice was wrong and was **not** followed.
- **All 15 routes carry a per-page `robots` export** — services ×2, projects ×2, blog ×3,
  locations ×2, pricing, contact, about, and the three legal pages.
- **`logoAlt` no longer exists at all.** The old `logoAlt="DCS Gardening & Landscaping"` (two
  occurrences) is gone because the r9 bar uses an inline SVG marked `aria-hidden` and takes no
  `logoAlt` — a better outcome than correcting the string.
- **CI green on `main` after PR #90** — CI 3m47s, Production Quality Gate 2m11s, both success.
  (E2E Tests `skipped` on that run, which is its configured behaviour for this path, not a failure.)

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

1. **The dirty working tree is someone else's session, not this one.** `output/sessions/.current-session`
   now points at `2026-09/2026-09-24_autcobel-redesign`, and that untracked folder contains a live
   in-flight session (`content/`, `homepage-mockups/`, `prototype/`, `research/`, `session.md`).
   **Do not commit, stash, clean or revert it** as part of tidying up after the DCS port. It is
   unrelated work in progress.
2. **You are on `staging`.** Root `CLAUDE.md` mandates `develop → staging → main` and "ALWAYS
   start on `develop`". Any new work must `git checkout develop` first. Committing to `staging`
   directly violates the project's non-negotiable workflow.
3. **The orphaned-CSS bug was introduced by this work's own merge script, and every check missed
   it.** `git log -S` traces the bad line to `c0de8d0a` (the wave 2 `kit.css` merge): a
   `RECONCILED: …` note was appended as raw text _outside_ any `/* */` block — invalid CSS. It
   survived because **webpack's parser silently tolerates it and the browser's does too** (the
   design harness loaded `kit.css` via a `<link>` and reported 750 rules parsed, all green), while
   **Turbopack rejects it outright** — which is why it only surfaced later as a crashed `next dev`
   and a failing `test:e2e:smoke`. Brace-balance and comment-balance checks both passed, because it
   is neither. **Lesson for any future CSS merge: a clean browser render and a green webpack build
   do not prove the CSS is valid.** Parse it with the strict parser, or run `next dev`.
4. **The design session's `HANDOFF.md` contains two disproved claims.** It says the inner-page bar
   measures 74.5px (it is **81px** — the 74.5 figure predates Decision 5 and the burger becoming
   visible at desktop), and that the five wave-1 additions files are orphaned with no page linking
   them (**two pages still linked them**). Both are corrected in place in that folder, with the
   reasoning in `bar-height-correction.md`. Read the corrections, not just the original sentences.
5. **`prototype/*.html` still contains `<nav>` markup in every bar**, hidden by CSS. That was
   deliberate during review and was correctly **not** ported. If the prototypes are ever reused as
   a reference for another site, do not port that `<nav>`.
6. **Fidelity guards will fail on legitimate future changes, and that is correct.**
   `home-css-parity.test.ts` compares `home-r9.css` **by position** (a removed rule shifts every
   later one out of alignment); `home-data.test.ts` needs a changed string updated in **two**
   places or its independent recount re-flags it; `indexability.test.ts` boots a real
   `next start` and reads real HTTP responses. Update them; never weaken them. See
   `sites/dcs/PRODUCT.md:58-82`.

## Next step

Nothing is required — the port is shipped and green. Pick up whichever of these matters:

**1 — Decide the blog sector axis** (the real outstanding gap, see "What was NOT done" #1–2):

```bash
cd /Users/rickywilson/Sites/local-business-platform
git checkout develop && git pull
head -40 sites/dcs/lib/blog-sectors.ts          # the derivation rule, in its own header
grep -rn "blog-sectors" sites/dcs --include="*.ts" --include="*.tsx"   # currently: no hits
```

Then either delete the file, or promote `sector` to real frontmatter + Zod schema + rebuild the axis.

**2 — Verify the live site**, which nobody has done since the promotion:

```bash
cd /Users/rickywilson/Sites/local-business-platform/sites/dcs
pnpm run build && pnpm run start      # check the listening PID actually changed — a stale
                                      # server answers 200 while ignoring your rebuild
curl -s http://localhost:3000/blog | grep -o '<meta name="robots"[^>]*>'   # expect no noindex
```

**3 — Sync the stale local `main`** (cosmetic, but it will mislead):

```bash
git checkout main && git pull    # local a6cc38eb -> origin ea3338db
```

## Open questions

1. **Blog sector axis — delete, or make real?** D4 asked for it; production ships without it. This
   needs Ricky, because making it real means writing a derived value into 21 content files.
2. **Should the newly-indexable pages be submitted to Search Console?** They went live
   indexable on 2026-09-19 and nothing has told Google.
3. **The terms have never had solicitor review** (`terms-and-conditions/page.tsx:4`) and are now
   indexed. Is that acceptable as-is?
