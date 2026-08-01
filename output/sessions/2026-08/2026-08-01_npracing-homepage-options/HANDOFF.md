# NPRacing homepage options — handoff

**Status:** ready-to-resume, but the _next_ phase (real site + Vercel deploy) has **not started at all** — everything so far is static HTML mockups published as Claude Artifacts, not a Next.js site.
**Branch:** `develop` (no feature branch created for this work)
**Commits:** 0 — none of this work is committed. See "What was NOT done" #1, this is the single biggest risk.
**Working tree:** dirty — untracked (`git status --porcelain`):

```
?? output/briefs/npracing/
?? output/sessions/2026-08/
```

## What this is trying to resolve

NPRacing is a British Superbike (BSB) team (owner Neil Pearson / NP Motorcycles, Taunton,
Somerset) that needs a brand-building website — not a local-service business, so the
platform's usual services/locations MDX model doesn't apply (see `output/briefs/npracing/brief.md`).
No existing site or design system to reference (greenfield).

Round 1 (this session): built 4 distinct homepage design directions as self-contained static
HTML prototypes (`output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/`),
plus a click-through gallery `index.html`, and published all of them as private Claude
Artifacts so the client could review without any hosting setup.

The client picked two directions to keep iterating on: **v1 "Grid Box"** (cinematic full-bleed
hero) and **v3 "Number 51"** (bold poster style built around the race number). v2 "Pit Lane
Editorial" and v4 "Paddock Minimal" were dropped from further work at that point — they still
exist as prototype files but were never extended with Merch/News/Contact pages.

Round 2 (this session, same conversation): fixed layout bugs on v1/v3 (viewport-fit hero,
gallery-grid overlap bug, v3 team-section restructure, creds-bar margin), removed Sponsors
(no content), enlarged the footer logo, then built out **Merchandise**, **News**, and
**Contact** pages for v1 and v3 — 8 pages total, all cross-linked via nav/footer, all
published as separate Claude Artifacts.

The user's latest ask (this message): publish v1 and v3 to **Vercel** so the client can
compare live, real-URL versions rather than Artifact links. That work has not begun.

## Actions taken

No git commits exist for any of this — everything below is local file state plus Claude
Artifact publish events (not part of this repo's history).

- Built `prototype/tokens.css` — shared design tokens (colour, type, spacing) used by all
  variants. **This is the best source of truth for the final palette/typography decisions**
  if/when building real `theme.config.ts` files.
- Built 4 homepage variants (`design-01-gridbox.html` … `design-04-paddockminimal.html`) +
  `index.html` gallery.
- Iterated v1 + v3 per client feedback (viewport-fit hero, gallery-grid CSS rewrite, headline
  line-break, footer logo, sponsors removed).
- Built and published, for v1 and v3 only:
  - `merch-01-gridbox.html` / `merch-03-number51.html` — 8 real products from
    [The Clothing Kings](https://www.theclothingkings.co.uk/category/partnerships/npracing/),
    each card deep-linking to that product's own page on the retailer.
  - `news-01-gridbox.html` / `news-03-number51.html` — real BSB press coverage (sourced via
    WebSearch/WebFetch, not client-authored): Brayden Elliott's Knockhill return (9 Jun 2026,
    britishsuperbike.com) and Connor Thomson's rookie signing (26 Feb 2026,
    britishsuperbike.com), plus a verified Race 2 result (P16, sourced to Crash.net).
  - `contact-01-gridbox.html` / `contact-03-number51.html` — email `npracingbsb@hotmail.com`,
    Instagram link, a decorative enquiry form (`onsubmit="return false"`, not wired to
    anything), and a Facebook slot marked "Link coming soon".
  - Added a "Merch" link to the main nav on all 8 pages (was previously only a "Shop" CTA
    button).
- Updated `output/briefs/npracing/brief.md` and `content/contact.md` to reflect current status.

## Current state — verified 2026-08-01

- **Local files exist** — verified via `ls`:
  `output/sessions/2026-08/2026-08-01_npracing-homepage-options/prototype/` contains
  `tokens.css`, `index.html`, 4 `design-*.html`, 2 `merch-*.html`, 2 `news-*.html`,
  2 `contact-*.html`, and an `assets/` folder (logo, 3 team/action photos, 8 merch product
  photos, 4 gallery thumbnails).
- **8 pages are live as private Claude Artifacts** — verified via successful `Artifact`
  publish tool calls and one in-browser check of the gallery index this session:
  | Page | v1 Grid Box | v3 Number 51 |
  |---|---|---|
  | Home | `claude.ai/code/artifact/f59678f3-eee2-4f85-914d-22a71928763f` | `claude.ai/code/artifact/8d7859e1-2e47-47ed-980c-526988b9f2eb` |
  | Merch | `claude.ai/code/artifact/0cf346bb-e18c-4603-a184-0e5d98894150` | `claude.ai/code/artifact/9bfb5ad5-650c-42a4-98e9-4b0dfbf1ee29` |
  | News | `claude.ai/code/artifact/dbf83416-994f-4c5a-a50a-0efead739304` | `claude.ai/code/artifact/47fbb460-ed8e-45e7-8cf7-9dddf7af323f` |
  | Contact | `claude.ai/code/artifact/63bb3710-c353-4762-b6c7-6dba7f81132f` | `claude.ai/code/artifact/a455ad34-5ef7-4ed7-8cef-79370be389bc` |
  | Gallery index (all 4 original directions) | `claude.ai/code/artifact/1ccdd994-aaf2-4fa9-b910-9dad7f3542e3` | — |

  These are **private** — only visible to the user unless shared from the page's share menu.

- **No `sites/npracing-*` directory exists** — verified via `ls sites/`. `sites/base-template`
  exists and is the copy source for a new site per `docs/guides/adding-new-site.md`.
- **Nothing is committed** — verified via `git status --porcelain` (both
  `output/briefs/npracing/` and `output/sessions/2026-08/` are untracked) and
  `git log --oneline -15` (no npracing-related commits).
- Assumed, not verified: no Vercel project for npracing exists yet (inferred from no site
  directory existing — not checked directly via Vercel CLI/dashboard).

## What was NOT done

1. **Nothing from this session is committed to git.** It's all sitting as untracked files.
   The very first thing a fresh session must do is decide what to commit (and to what
   branch — currently on `develop`, per the platform's git workflow this is correct to
   start on, but nothing has been pushed).
2. **No real Next.js site exists.** Every page built so far is a self-contained static HTML
   file with inlined CSS and base64-embedded fonts/images — built specifically to satisfy the
   Claude Artifact sandbox's CSP (no external font/image loading allowed). None of it uses
   this platform's actual architecture: no `theme.config.ts`, no Tailwind, no
   `packages/core-components`, no MDX content, no `packages/theme-system` token pipeline. It
   is not deployable to Vercel as-is via the platform's normal `sites/<name>` → Vercel-project
   flow.
3. **Vercel publish has not started.** To do it properly per this repo's conventions
   (`docs/guides/adding-new-site.md`, root `CLAUDE.md` → "Vercel Monorepo Configuration"),
   someone needs to: scaffold two site directories, port the v1/v3 visual designs into
   `theme.config.ts` + component code, convert the merch product list and news articles into
   MDX/frontmatter content (root `CLAUDE.md` explicitly bans centralized TS data files —
   "frontmatter IS the data"), move images to R2 per `docs/standards/images.md`, then create
   **two separate Vercel projects** (one per site directory) so the client can compare two
   live URLs. None of that has begun.
4. **Facebook profile link never arrived.** Asked twice this session; user said they'd send
   it but it never came through in the message. Contact pages currently show "Link coming
   soon" for Facebook — needs the URL, and the user said images could be pulled from that
   profile too.
5. **v2 and v4 have no Merch/News/Contact pages.** Only v1 and v3 got the full page set — v2
   "Pit Lane Editorial" and v4 "Paddock Minimal" are homepage-only prototypes, dropped from
   scope when the client narrowed to v1/v3.
6. **Contact form is decorative only.** `onsubmit="return false"`, no backend, no Resend
   wiring anywhere in the repo yet — that integration doesn't exist even as scaffolding.
7. **The Artifact publish pipeline was never saved as a script.** Every publish this session
   ran inline Python (via Bash) to base64-embed fonts/images and inline the CSS before
   calling the `Artifact` tool — that script lives only in this conversation's tool-call
   history, not as a file. A fresh session cannot "just re-run the last publish."

## Traps

- **Don't reuse the Artifact HTML files as the real site's source.** They're intentionally
  hacky (base64-embedded Google Fonts, base64-embedded images, everything inlined into 3
  giant `<style>` blocks) to survive the Artifact sandbox's CSP. The real Next.js build
  should load fonts normally (`next/font` or a `<link>` tag) and serve images from R2 —
  carrying the embedding approach over would be actively wrong for a real site.
- **`prototype/tokens.css` is the useful part**, not the HTML — it's the actual final
  colour/type/spacing system for both variants and is the right starting point for the two
  `theme.config.ts` files.
- **Merch and news content currently only exists as hardcoded HTML**, not MDX. The product
  list (name/price/URL/image) was fetched from the retailer's category page on 2026-08-01 —
  re-verify prices and URLs haven't changed before reusing them as content. Same for the two
  news articles (dates, quotes, source URLs) — re-check against `britishsuperbike.com` if
  much time has passed.
- **The `.current-session` pointer file is stale** — it points at
  `2026-07/2026-07-18_deploy-hardening`, an unrelated older session. Don't trust it for this
  work; use `output/sessions/2026-08/2026-08-01_npracing-homepage-options/` directly.

## Next step

This forks on an open question below before a next step can be chosen with confidence. If
the answer is "build the real platform site":

```bash
git status                                    # confirm what's still uncommitted
git add output/briefs/npracing/ output/sessions/2026-08/
git commit -m "docs(npracing): design mockups + brief for homepage v1/v3 (round 1-2)"
# then, per docs/guides/adding-new-site.md:
cp -r sites/base-template sites/npracing-v1
cp -r sites/base-template sites/npracing-v3
# port tokens.css → theme.config.ts for each; convert merch/news copy to MDX content;
# upload images to R2 per docs/standards/images.md; then follow the normal
# develop → staging → main flow (/deploy.changes) with two Vercel projects.
```

If the answer is "just get something clickable on a real URL fast" (much smaller scope —
deploy the existing static HTML as-is, not the full platform build), that's a different and
much shorter path and should be scoped explicitly before starting, since it produces a
throwaway comparison tool rather than the production site.

## Open questions

- **Full platform site vs. quick static deploy?** The user asked to "publish both versions to
  vercel as v1 and v3 so the client can choose" — this could mean (a) do the full
  MDX/theme-system build now and deploy two real platform sites, or (b) just get the existing
  static HTML prototypes onto two Vercel URLs quickly as a comparison tool, with the real
  build happening later once a direction is chosen. These are very different amounts of work
  and should be confirmed before starting.
- **Facebook profile URL** — still needed for the Contact page link and as an image source.
- **Once v1 or v3 is chosen**, what happens to the other one, and to v2/v4? (Delete the
  losing directions' artifacts/prototypes, or keep them archived in the session folder?)
