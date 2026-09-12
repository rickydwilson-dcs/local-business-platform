# DPM Autobody build-out — handoff

**2026-09-12, later pass — supersedes the update below.** Since that note, a further round of small
content fixes and one real feature (video link cards) landed, all sourced directly from David's
7 September review-meeting transcript (Ricky shared it mid-session). **Status: ready-to-resume,
about to push + deploy.** Nothing blocked, nothing half-applied. Working tree is uncommitted as of
this note — see "Working tree" below — the plan for this exact moment is: commit, push `develop`,
promote through the staircase to `main`.

**Branch:** `develop`. **2 commits ahead of `origin/develop`, not yet pushed**
(`58ed7cd3`, `eaf01cbb` — see the previous handoff section below for what they contain), **plus a
further batch of uncommitted changes** (this pass) about to become a third commit.

**Working tree — uncommitted, about to be committed:**

```
 CLAUDE.md                                                       |  1 +
 docs/standards/security.md                                      |  1 +
 output/sessions/2026-08-26_dpm-autobody-discovery/BACKLOG.md    | 15 +++--
 sites/dpm-autobody/CHANGELOG.md                                 | 15 +++++
 sites/dpm-autobody/CLAUDE.md                                    | 11 ++++
 sites/dpm-autobody/app/workshop/page.tsx                        |  2 +-
 sites/dpm-autobody/components/pages/build-detail-page.tsx       | 72 ++++++++++-
 sites/dpm-autobody/components/pages/home-page.tsx               |  2 +-
 sites/dpm-autobody/content/builds/aston-martin-db6-pink.mdx     |  3 +-
 sites/dpm-autobody/content/builds/p1800-candy-restomod.mdx      | 11 ++++
 sites/dpm-autobody/content/builds/porsche-356-sc.mdx            |  6 +-
 sites/dpm-autobody/lib/content-schemas.ts                       | 17 +++
 sites/dpm-autobody/next.config.ts                               |  9 +-
```

Also still untracked (deliberately, unchanged from every prior pass — see Traps in the superseded
section below): `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/`.

## What this pass did (2026-09-12, using David's 7 September meeting transcript)

Ricky pasted the full transcript of his review call with David mid-session. Cross-referencing it
against the live site surfaced both new facts and one correction to a fact this session had
recorded wrong earlier the same day:

1. **"Lead loading and metal finishing" → "Body levelling and metal finishing"** on the workshop
   page (`app/workshop/page.tsx`) — David's own confirmed wording, explained on the call: DPM avoid
   lead loading where they can because it isn't as good as normal filler work. This exact fix had
   been sitting in `BACKLOG.md` since 8 September as "buildable now, no new assets needed" and was
   simply never applied until now.
2. **DB6's front-page coverage was _The Argus_, a real named local newspaper** — not the
   uncertain "car magazine" the earlier transcript fragment ("the cargos... I think it's a
   newspaper, probably") had left ambiguous. Updated on both the homepage's DB6 section and
   `aston-martin-db6-pink.mdx`; removed the now-resolved `sourcingGaps` entry for it.
3. **Added `videoLinks`** (`lib/content-schemas.ts`) — thumbnail cards that link out to YouTube
   instead of embedding, rendered by a new `BuildVideoLinksSection` in `build-detail-page.tsx`.
   Ricky's direction: the resto-mod's three-part restoration video is David's own raw, unedited
   footage (confirmed on the call — "it's not a professional video, it's one that I did"), and a
   straight embed would oversell it; a thumbnail + link sets the right expectation before anyone
   clicks through. Wired into `p1800-candy-restomod.mdx` with the three already-known video ids
   (`8Y2inpQzaJ4`, `RgkayNub9Ms`, `LVfZx4-4HRg`).
   - **Hit a real two-part config gap building this**: YouTube's thumbnail CDN (`i.ytimg.com`)
     needs allow-listing in **two separate places** — CSP `img-src` _and_ Next's own
     `images.remotePatterns` — and they fail differently. Missing from CSP: silent (empty box, no
     console error). Missing from `remotePatterns`: a loud build/runtime error naming the exact
     hostname. Hit both in sequence, fixed both, documented the pattern in both this site's
     `CLAUDE.md` and the platform's `docs/standards/security.md` / root `CLAUDE.md` so the next
     site that adds a third-party thumbnail doesn't rediscover it from scratch.
4. **Porsche 356 SC: confirmed "minor mechanical rebuild"** (Ricky confirmed directly, resolving
   the "might/minor" transcription ambiguity) — updated frontmatter `scopeOfWork` and body copy,
   removed the resolved `sourcingGaps` entry.
5. **Logo vector — confirmed already resolved, no action needed.** This was raised as an open
   question in this session's earlier research, but it turns out to predate this whole build-out:
   commit `c155f47d` (7 September, the same day as the meeting) already replaced the traced
   placeholder with David's real Pixelmator export. Nothing to do here; just corrected the
   session's own understanding.
6. **"262" identified and closed as a non-issue** — Ricky confirmed this was David referring to
   the pink Aston Martin DB6, not a separate unidentified car. `aston-martin-db6-pink.mdx` already
   exists and is live; there is no separate "262" build to chase or create. Updated
   `output/sessions/2026-08-26_dpm-autobody-discovery/BACKLOG.md` (both mentions) to record this
   and stop it resurfacing as an open item in future.
7. **Drafted (not sent) an outstanding-actions email to David** — conversational output only, not
   saved to a file anywhere. Final version asks for: workshop action photos; the specific facts
   behind every live `sourcingGaps` amber notice (Bentley S3 1964 chassis, Bentley S3 Continental
   chassis, Jaguar Sea Green's chassis/hours/actual current status, the resto-mod pair's second car
   and awards, the Pearl White singer's name); and a general fact-check pass. If this needs
   resending or Ricky wants it saved somewhere, it isn't currently in any tracked file — reconstruct
   from this session's own conversation if needed, or ask Ricky whether he sent it as-is.

**One important correction made mid-session, worth flagging so it isn't undone by mistake:**
Ricky initially thought the "client rebuilt the car himself, hated it, and sold it quickly" story
(from the transcript) belonged to the Jaguar Sea Green build, which would have meant that build
needed the same "insufficient info, pull it" treatment as Aston Martin T. Green. **Ricky confirmed
after re-reading that this story is actually about T. Green** (already removed from the site,
correctly) **and is unrelated to the Jaguar Sea Green**, whose actual current status (finished vs.
still in the workshop) remains a genuinely open `sourcingGaps` item — do not resolve it based on
the T. Green story; they are two different cars.

## Current state — verified 2026-09-12 (this pass)

- `npx tsx scripts/validate-content.ts` → 10/10 valid.
- `pnpm --filter dpm-autobody run type-check` and `run lint` → both clean.
- A full `pnpm run build --webpack` (from `sites/dpm-autobody/`) → all 23 routes generate,
  including all 10 build pages.
- Visually verified in a real browser: the resto-mod's video-link cards render real YouTube
  thumbnails (paint booth, "VOLVO RESTORATION PART 2" title card) with a play-button overlay, and
  link out to the correct three video ids (checked via
  `[...document.querySelectorAll('a[href*="youtube.com/watch"]')].map(a => a.href)` in-page,
  not just by eye); DB6's "front page of _The Argus_" renders correctly, italicised; workshop
  page's "Body levelling and metal finishing" confirmed live via `curl`.
- **A local `next dev` process is running on port 3000** (PID 46030 at the time of this note) —
  check `lsof -i :3000` before assuming the port is free.

## What was NOT done

- **Nothing from this pass is committed yet.** The plan, per Ricky's own instruction that prompted
  this handoff, is: commit → push `develop` → promote through the staircase to `main`. If this
  session ends before that completes, the working-tree diff above is the record of what's
  uncommitted — do not lose it to an unrelated `git checkout`/`git reset`.
- **The email to David has not been sent** — it was drafted conversationally and Ricky approved
  the final wording, but sending it is Ricky's own action, outside this codebase.
- **All the `sourcingGaps` facts the email asks for are still genuinely open** — Bentley S3 1964
  chassis, Bentley S3 Continental chassis, Jaguar Sea Green (chassis + hours + actual status),
  the resto-mod pair's second car + awards, the Pearl White singer's name. Do not fill any of these
  in without an actual reply from David.
- **Workshop action photos** (welding/metalwork atmosphere shots, not tied to one build) — asked
  for in the email, not yet received or wired into the workshop page.
- **The broader outstanding-actions list synthesised earlier this session** (from `BACKLOG.md`,
  `open-questions.md`, `interview-david.md`) is still mostly open — Halcyon naming permission,
  DNS/domain control for `dpmautobody.co.uk`, the actual photography commission (daylight hero
  shots, macro under raking light), RP Automotive Photography's NEC 2023 licence, footage inventory
  from David's brother, `e2e/smoke.spec.ts` coverage for the 8 newly-built routes. None of these
  came up in the 7 September transcript specifically, so none were resolved by this pass.

## Traps

- **`interview-david.md`'s formal fact-by-fact verification standard is no longer the operating
  assumption.** David directly told Ricky on the call that he likes the storytelling/narrative
  license in the copy ("I quite like how you worded stuff... it sounds more professional"). Don't
  re-flag the P1800 Candy "log" section's invented-but-plausible staff quotes as a problem needing
  a formal interview — that concern was raised and explicitly withdrawn earlier this same session
  after Ricky shared the transcript. The specific facts still tracked as `sourcingGaps` are a
  different, narrower category (concrete details like chassis numbers) — those remain real gaps.
- **"Aston Martin T. Green" and "Jaguar — Aston Martin Sea Green" are two unrelated builds** that
  merely share the words "Aston Martin" — one because a client named/initialled "T. Green" owned a
  real Aston Martin (removed from the site, insufficient info), the other because a Jaguar was
  resprayed in a paint colour licensed from Aston Martin's own palette. See the correction note
  above — this has already caused one mix-up this session; don't let it cause another.
- **Dynamic Tailwind class strings don't compile** — caught and fixed live while building
  `BuildVideoLinksSection`: an initial `` `sm:grid-cols-${n}` `` template literal compiled to zero
  CSS (Tailwind's scanner needs a complete literal class name, not a runtime-interpolated one —
  same class of bug as the platform's documented `min-[Xrem]:` gotcha). Fixed with a static
  `Record<number, string>` lookup instead. If a future grid/column count needs to vary by data,
  copy that lookup pattern rather than interpolating directly.
- **`pnpm run build` (a manual production build) run while `next dev` is also running against the
  same `.next` directory reliably corrupts the dev server's cache**, throwing
  `ENOENT: routes-manifest.json` on every route until the dev server is restarted. Hit this
  multiple times across this session. If a build is needed for verification, expect to restart
  `next dev` afterward — this is not a new bug, just a recurring friction worth remembering.

## Next step

1. Commit this pass's working-tree diff (see "Working tree" above).
2. Push `develop`, watch its CI (`gh run watch`).
3. Merge `develop` → `staging`, push, watch its CI (three workflows: CI, E2E Tests, Regression
   Watchdog).
4. Open the PR `staging` → `main` (`main` is protected — never push it directly). Do not merge it
   automatically; report the PR URL. (Ricky has, in this same session on prior rounds, then asked
   for it to be merged once checks were green — confirm current instruction rather than assuming
   silence means merge.)
5. Once deployed: send the drafted email to David (Ricky's own action), and chase the remaining
   `sourcingGaps` facts and workshop photos it asks for.

## Open questions

Unchanged from the previous handoff pass, still outstanding:

- Pearl White P1800 — the singer's name (David couldn't recall it on the 7 September call either;
  Ricky may decide to just drop the detail if it never surfaces).
- The resto-mod's client pair — the second car and both cars' show names/award placings.
- Bentley S3 1964 — chassis number.
- Bentley S3 Continental — chassis number.
- Jaguar Sea Green — chassis number, hours of labour, and its actual current status (completed vs.
  still in the workshop — genuinely unresolved, see Traps above for what NOT to assume).
- Pink Aston Martin DB6 — confirm current race status (still "due to race again"?) and the
  pre-crash livery shown in its photos (inferred from the photo set, never stated outright).

Resolved and no longer open (see "What this pass did" above for detail): the logo vector question;
"262"; the Porsche 356 SC "might/minor" wording; the DB6 magazine/newspaper name; the Jaguar Sea
Green / T. Green story mix-up.

---

# Superseded — earlier 2026-09-12 update (still accurate as history)

**Status:** ready-to-resume. Every library build now has a real page; the only remaining work is
chasing David for the facts already flagged as `sourcingGaps`, then promoting `develop` →
`staging` → `main`. Nothing is blocked, nothing is half-applied.
**Branch:** `develop`. **5 commits ahead of `origin/develop` — not pushed.** Also 5 commits ahead
of both `staging` and `main` (all unmerged past `develop`).
**Working tree:** clean except `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/`
(untracked, deliberately — see Traps, unchanged from the prior handoff).
**Local dev server:** a `next dev --webpack` process is still running on `localhost:3000`
(confirmed via `lsof -i :3000`, PID 18275 at the time of this note). Kill it or reuse it; it is not
required for anything, just left running from this session's browser verification.

This supersedes the previous version of this file (everything below "What this is trying to
resolve" through "Open questions" describes the R2-upload/video-resolution pass from earlier the
same day, 2026-09-11 — still accurate as history, but the current state has moved well past it).

## Commits this session, in order (none pushed at the time this section was written)

```
cb219454 fix(dpm-autobody): remove duplicate P1800 pair lot, lighten build hero images
2853a326 fix(dpm-autobody): remove duplicate P1800 pair lot, lighten build hero images
22f7b80d feat(dpm-autobody): give every build a real page, flag missing facts, swap homepage No. 03
19461e8d fix(dpm-autobody): merge Rare Volvo and Pearl White P1800 into one build
c2708722 docs(dpm-autobody): expand build-out handoff with full R2 upload verification
```

(`2853a326` and `cb219454` share a commit message — an artifact of `git rm` pre-staging the
deletion before the rest of the change was ready; `2853a326` is just the `p1800-pair-one-client.mdx`
delete, `cb219454` is the library/schema/hero-brightness follow-up. Both are real, neither is a
mistake to squash away, just note it so it doesn't look like a duplicate accident.)

**Since this section was written, these commits were pushed and promoted all the way to `main`**
(PR #79), and two further rounds shipped the same way: `d24464c1` (nav link + plaque wording) and
a batch containing `58ed7cd3`/`eaf01cbb` (legal pages, 404 page, hamburger menu, homepage image
consistency, closing link, menu socials) — the latter two are what's "2 commits ahead of
`origin/develop`" in the top section of this file, still unpushed as of this note.

## What this session did (2026-09-12, in order) — see git log for exact diffs

1. Merged the "Rare Volvo" and Pearl White P1800 library entries into one (`19461e8d`).
2. Changed the `/library` page's own hero copy.
3. Gave all remaining builds a real `/builds/[slug]` page (`22f7b80d`) using `BuildDetailPage`'s
   existing thin-content fallback rather than inventing narrative.
4. Added a `sourcingGaps` frontmatter field + visible UI notice.
5. Found and fixed a real gap: `bentley-s3-continental.mdx`'s confirmed `video` field was never
   rendered anywhere until this pass added `BuildVideoSection` + widened CSP `frame-src`.
6. Swapped the homepage's No. 03 featured slot from Jaguar Sea Green to the Aston Martin DB6.
7. Removed a duplicate library entry (`p1800-pair-one-client.mdx` — the resto-mod is confirmed as
   one of that pair).
8. Fixed hero image brightness (`brightness-[1.1]` → `brightness-[1.35] saturate-[1.15]`).

Then, in further rounds the same day (each pushed/promoted separately, see above): 9. Header nav's "The Work" → `/library`; removed "rivet"/"riveted" wherever it described DPM's own
plaques (David confirmed: fixed to the chassis, not riveted). 10. Restyled `/privacy-policy`, `/cookie-policy`, and the 404 page — all three were still
base-template's generic scaffold with a real bug (`bg-surface-subtle` falling back to a
near-white default on this all-dark site). 11. Replaced the mobile nav's scroll-triggered "Contents" pill with a real hamburger menu; moved
the phone number into it; added social icons. 12. Removed the Bentley S3 Continental's small "whole car" establishing shot on the homepage
(a genuine one-off in the approved prototype, but inconsistent in size vs. the other three
cars); changed the homepage's closing link to "See even more of our work" → `/library`.

## Current state — verified 2026-09-12 (this section's original pass)

- 10 build MDX files, all `pageStatus: built`, `validate-content.ts` → 10/10.
- `type-check`, `lint`, and a full `build --webpack` all passed clean after every change.
- Visually verified in a real browser at each step (homepage, library, several build pages, the
  mobile hamburger menu's open/close/nav-click behaviour, the legal pages, the 404 page).

## What was NOT done (at the time this section was written — see top of file for what's since moved)

- Nothing had been pushed. All 5 commits then existed only locally.
- Nothing had been merged into `staging` or `main`.
- David's fact confirmations were still outstanding.
- `e2e/smoke.spec.ts` was not extended to cover the 8 newly-built routes — **still true as of the
  top of this file**.

## Traps (from this section's original pass — still true)

- The `BuildDetailPage` hero brightness/scrim fix is shared by all 10 builds, including the two
  flagship pages that already passed a visual-fidelity gate against the approved prototype — not
  re-verified against those two specifically after the brightness change.
- `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/` still holds the 10
  `redacted/` photo sets plus `make-contact-sheets.sh`, untracked. Re-pull from the iCloud links in
  `../2026-08/2026-08-26_dpm-autobody-discovery/BACKLOG.md` item 5 if more photos are ever needed.

## Open questions (from this section's original pass — see top of file for what's since resolved)

- Pearl White P1800 — the singer's name.
- The resto-mod's client pair — the second car and both cars' specific show names/award placings.
- Bentley S3 1964 — chassis number still TBD.
- Bentley S3 Continental — chassis number not recorded.
- The "262" build — **resolved, see top of file: this was the pink Aston Martin DB6, already
  live.**
- Porsche 356 SC — **resolved, see top of file: confirmed "minor mechanical rebuild."**
- Pink Aston Martin DB6 — confirm current race status and the pre-crash livery.
- Jaguar Sea Green — resolve the completed-vs-still-in-workshop status contradiction.
