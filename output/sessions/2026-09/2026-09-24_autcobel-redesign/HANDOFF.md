# Autcobel redesign — handoff

**Status:** ready-to-resume, with one real risk — the live prototype is
finished, verified, and deployed, but **none of this session's local
files are committed to git**, and the working tree is currently on
`staging` instead of `develop`. See Traps below before touching git.

**Branch:** `staging` (checked out at session start via the environment's
git-status snapshot — this session never switched branches). This
violates the repo's mandatory `develop → staging → main` workflow
(root `CLAUDE.md`, "CRITICAL: Git Workflow" — "NEVER push directly to
staging or main... If you break this rule: Stop immediately, inform
user, ask how to proceed"). Nothing has been pushed anywhere — see below.

**Commits:** 0 for this session's work. Every file this session produced
is untracked; there is no commit history to cite SHAs from.

**Working tree:** dirty.

- Modified: `output/sessions/.current-session` (routine pointer update,
  now reads `2026-09/2026-09-24_autcobel-redesign` — not a risk, expected)
- Untracked: `output/sessions/2026-09/2026-09-24_autcobel-redesign/` — this
  session's entire body of work, 43 files that `git add` would pick up
  (verified via `git add -n`), 11MB on disk total including the
  gitignored binary/SVG assets (see Traps — those are gitignored on
  purpose, not missing).
- Untracked, not mine: `output/sessions/2026-09/2026-09-18_dcs-inner-pages-port/HANDOFF.md`
  — pre-existing from a different, unrelated session. Not touched, not
  described further here; don't let it get swept into a commit for
  this work by an unscoped `git add -A`.

## What this is trying to resolve

Client (Ricky's agency, Digital Consulting Services) is rebuilding
**autcobel.ltd** for their client Gene — the existing site is a thin,
JS-rendered single page with a non-functional nav (confirmed by DOM
inspection: every nav link has an empty `href`). Task: research the real
company (Companies House — Autcobel Ltd, no. 14044405, incorporated
2022, active), draft full site content (11 pages), and build/iterate an
HTML prototype the agency can review and evolve with the client before
committing to a real production build. Gene has minimal bandwidth and is
ADHD — the agency writes content on his behalf; he only reviews a short
bulleted status tracker (`CONTENT-STATUS.md`) and flags what's wrong.

The prototype is **not** the production site — it deploys to its own
Vercel project (`autcobel-proto`, deliberately not named `autcobel`,
which is reserved for the real build later, per the root `CLAUDE.md`
prototype-naming rule).

## Actions taken

No commits exist, so this is a file-level narrative, not a SHA list.
Full blow-by-blow reasoning for each of these lives in `session.md`
under "Design pass 1" through "Design pass 7" — this is the summary:

1. Researched the real site (browser DOM inspection, not just WebFetch —
   WebFetch alone only returned the page `<title>`) and Companies House;
   wrote `research/source-material.md`.
2. Drafted full copy for all 11 pages into `content/*.md`, plus
   `CONTENT-STATUS.md` (internal-only tracker for Gene, humanizer-passed,
   never linked from the live site).
3. Explored 10 different homepage design directions in
   `homepage-mockups/` (one per design skill) — client picked v10
   ("ui-styling" skill, shadcn/Tailwind-flavoured).
4. Built the full 11-page prototype in `prototype/` on that design
   system, deployed to `autcobel-proto.vercel.app`.
5. Iterated repeatedly per client feedback, each redeployed live:
   hero stat-row tweak, padding tweak, full palette rework (grounded in
   the _real_ autcobel.ltd's actual blue, sampled live via
   `getComputedStyle`, not guessed), inner-page hero redesigned twice
   (bordered icon card → boxed image → full-width background image with
   scrim), homepage hero unified with the same treatment (retiring a
   "Delivery Console" panel that had been carrying fabricated stats),
   a new logo mark generated and wired in site-wide, and card styling
   unified between the homepage and two inner pages that had drifted.
6. Generated imagery via the `higgsfield` CLI (local tool, already
   authenticated — not an MCP integration, ToolSearch won't find it).
   6 hero images + 1 logo mark, all uploaded to Cloudflare R2 under
   `prototypes/2026-09-24_autcobel-redesign/assets/...` (verified 200 on
   all 7 objects after upload).

## Current state — verified 2026-09-24

- **Live and correct:** `https://autcobel-proto.vercel.app` — checked in
  an actual browser after every change this session, most recently after
  the card-styling unification pass. All 11 pages resolve 200. All R2
  asset URLs resolve 200.
- **R2:** 7 objects uploaded and verified (6 `hero-visual-*.png`/logo
  under `assets/img/hero/` and `assets/img/brand/`), all classified
  "Live" cache tier (short TTL), not "Archived" (immutable) — this
  mattered because the archive-routing regex in
  `tools/upload-prototype-assets.ts` would have silently 1-year-cached
  these if they'd been left directly in `assets/img/` instead of a
  subfolder; checked via dry-run before every upload.
- **Not verified:** mobile-width rendering (this session's browser tool
  couldn't resize its own viewport — tried twice, gave up rather than
  loop) and Safari rendering (no Safari session available). Both still
  open from early in the session, never circled back to.
- **Not committed:** see Working tree above. This is the main risk in
  this handoff — everything above is real and live on Vercel/R2, but has
  no git record at all yet.

## What was NOT done

- **Nothing committed to git, on the wrong branch.** The repo's git
  workflow (`develop → staging → main`, no exceptions) was not followed
  this session — work happened directly on `staging`. This needs
  resolving before anything is pushed. Do not push to `staging` or
  `main` directly to "fix" this — branch to `develop` (or a feature
  branch off it) and follow the normal flow forward from there. The
  next step below hands this to `/deploy.changes`, which the user has
  already asked to run next and should handle the promotion path — but
  confirm it actually gets you onto `develop` first rather than
  committing in place on `staging`.
- **Mobile and Safari visual QA.** Reasoned about correctness (mobile nav
  CSS follows standard patterns, no Safari-specific APIs used) but never
  confirmed live, on either count.
- **4 outstanding content facts, tracked in `CONTENT-STATUS.md`,
  never chased with Gene:** phone/email (currently visible on-page as
  red `[PHONE NUMBER — needed from Gene]`-style flags, deliberately not
  invented), any accreditations (NICEIC/CHAS/SafeContractor/ISO — none
  currently claimed), whether "Temporary Plant Systems" covers
  refrigeration or power only (drafted power-only, flagged inline as a
  note-box on that page), and whether any client names can be used.
- **Legal pages are drafts, not legally reviewed.** Privacy Policy,
  Terms & Conditions, Cookie Policy all say so inline. ICO registration
  number is an unresolved placeholder.
- **"Built by Digital Consulting Services" footer link** points to
  `https://digitalconsultingservices.co.uk` — this is my own assumption
  (matches the user's email domain), stated as such in chat, never
  explicitly confirmed by the user.
- **`homepage-mockups/` (10 alternative directions) never cleaned up.**
  They're still sitting in the repo as-is from early in the session.
  Notably `v10-ui-styling-modern.html` — the one that became the
  starting point — is now **stale**: the real prototype (`prototype/`)
  has since diverged substantially (palette, hero layout, logo, cards).
  Don't mistake the mockup file for current design. Also: `v8-impeccable-bold.html`
  still contains fabricated specific stats with no "illustrative"
  disclaimer (flagged to the user in chat at the time, never fixed,
  moot only because v8 wasn't the direction chosen — but the file is
  still in the repo, unannotated, if anyone opens it later).

## Live-data changes already applied

- **Vercel:** project `autcobel-proto` (team `ricky-wilsons-projects`)
  created and deployed to repeatedly — current production deployment is
  live at the aliased URL above. Each redeploy was a full
  `vercel deploy --prod` via `tools/publish-prototype.ts`; no rollback
  command was recorded per-deploy, but re-running that script from any
  later working-tree state simply redeploys current `prototype/`
  content — there's nothing destructive to undo, just a further deploy.
- **Cloudflare R2:** 7 objects written under
  `prototypes/2026-09-24_autcobel-redesign/assets/` (bucket
  `local-business-platform`). All are prototype art (generated hero
  images + logo), not client data. No rollback needed; re-running
  `tools/upload-prototype-assets.ts` against the same local files is a
  no-op (`skip (unchanged)`) unless the local files themselves change.

## Traps

- **`assets/img/hero/*.png` and `assets/img/brand/*.svg` are gitignored
  on purpose.** A fresh `git status` after cloning will not show them,
  and they will not be in the repo — this is correct, expected behavior
  per `docs/guides/prototype-hosting.md` (binary/SVG prototype assets go
  to R2, never git). They're already uploaded and the live HTML already
  references the R2 URLs directly, not local paths — nothing is broken,
  don't try to "fix" this by un-gitignoring or re-adding them.
- **`prototype/.vercel/` and `.env.local` are also gitignored** (Vercel
  CLI project-link state, pulled fresh each `publish-prototype.ts` run).
  Also expected, also fine.
- **The Vercel project must stay named `autcobel-proto`, never
  `autcobel`.** That name is reserved for the real production site.
  See the root `CLAUDE.md` Vercel section for why this matters (a prior
  incident on a different client project, `dpm-autobody`, where a
  same-named prototype silently blocked the production project import).
- **`CONTENT-STATUS.md` must never be linked from any live page or
  deployed anywhere.** It's the internal Gene-facing tracker. Already
  correctly excluded from the prototype's own nav/footer — just don't
  introduce a link to it by accident in future work.
- **A previous fork this session reported `status: completed` having
  done zero actual work** (confused about whose instructions it was
  executing) — caught only by independently grepping the target files
  after the fact, not by trusting its own summary. If a future session
  delegates more page-edit work to a subagent, verify its claimed
  changes on disk before trusting them; this happened once already.

## Next step

The user has already asked, in the same message that produced this
handoff, for `/deploy.changes` to run immediately after. That is the
literal next action:

```
/deploy.changes
```

Before it runs, be aware (per Traps and "What was NOT done" above) that
the working tree is on `staging`, not `develop`, with 43 untracked files
and no commit history — `/deploy.changes` needs to get this onto
`develop` properly (or a feature branch off it) as part of its own flow,
not commit in place on `staging`. If it does not do that automatically,
stop and ask the user how they want the branch situation resolved before
committing anything, per the root `CLAUDE.md` rule on this exact
scenario.

## Open questions

- How should the `staging`-branch situation actually get resolved —
  does `/deploy.changes` handle moving this to `develop` cleanly, or
  does that need to happen by hand first?
- Is it worth cleaning up/archiving `homepage-mockups/` now that v10 (as
  evolved) is the shipped direction, or is it staying as a design-history
  record?
- When should the agency loop back to Gene for the 4 outstanding
  `CONTENT-STATUS.md` items (phone/email especially — Contact Us is
  currently unusable without them)?
