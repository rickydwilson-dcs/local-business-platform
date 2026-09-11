# DPM Autobody build-out — handoff

**Status:** ready-to-resume, but the next content phase is blocked on media/fact collection, not code.
**Branch:** `develop` (merged from `feature/dpm-autobody-real-pages` at `33eab0dd`, on top of `origin/develop` at `2b095df5`)
**Commits:** 11 unpushed on `develop` (the merge commit + all 10 of this brief's commits) — **`develop` has not been pushed to origin.** `feature/dpm-autobody-real-pages` still exists locally, already merged, safe to delete once you're happy.
**Working tree:** clean.

## What this is trying to resolve

Turn DPM Autobody's two-page static prototype (approved by David Pearce-Martin and Ricky) into a real MDX-driven Next.js site. The full build plan lives in `session.md`; the port-and-verify work for the first slice (chrome + home/workshop/contact/library + 2 fully-content-complete build pages) is `yolo-brief.md`. This file is the forward-looking pointer — read `yolo-brief.md`'s `## Completed` section for the detailed history of what was built and the 3 rounds of visual-fidelity fixes it took to get there; not repeated here.

**User decision this session (2026-09-11), overriding an earlier framing in `session.md` Phase 4:** the homepage's rotating-featured-build section does **not** need a client-editable admin capability. Ricky and Claude will make homepage changes directly (editing config/frontmatter, redeploying) — David never touches it. Drop any assumption of a CMS/admin UI for this; it can be as simple as a config value or a small set of MDX frontmatter flags that Ricky+Claude edit by hand.

## Actions taken

- `b4c15184` → `1076dbe6` — content schema, all 12 builds' MDX (2 with full body content: P1800 Candy, E-type 941 PVO), header/footer, home/workshop/contact, library + `/builds/[slug]` routes.
- `fb56e211`, `1bdb0a0d`, `ee3bb5b0` — three rounds of visual-fidelity remediation after Phase 7's gate found the rebuild reading as "a different design system" on first pass. Root causes and full detail in `yolo-brief.md`.
- `d25df472` — extended `e2e/smoke.spec.ts` to cover the new routes.
- `a62f6f59`, `318e2bd8` — session docs + wrap-up.
- `33eab0dd` — merged `feature/dpm-autobody-real-pages` into `develop` (no conflicts).

## Current state — verified 2026-09-11 18:34 BST

- `pnpm --filter dpm-autobody run type-check` — clean, just re-run on `develop` at `33eab0dd`.
- Full gate suite (type-check, build, lint, vitest 84/84, e2e smoke 6/6) was green on this exact tree immediately before the merge (Phase 9 of `yolo-brief.md`) — the merge itself was a clean fast-ish merge with no conflicts and no file changes beyond the two branches' own commits, so this should still hold, but re-run the full suite before pushing if you want it re-verified rather than inferred.
- Live routes on `develop`: `/`, `/workshop`, `/contact`, `/library`, `/builds/p1800-candy`, `/builds/etype-941pvo` — all real, ported from the approved prototype.
- `develop` is 11 commits ahead of `origin/develop`. **Nothing has been pushed yet** — this was a deliberate pause, not an oversight, while we confirmed next steps with Ricky.

## What was NOT done

- **The other 10 library builds have frontmatter only** — no real body content, most with no photo. Per this project's "never fabricate" rule, they cannot get real pages until the source material below exists.
- **No iCloud photo album has been pulled or reviewed.** Zero albums have been downloaded, and zero have been run through the plate-redaction tool (`../2026-08_dpm-autobody-discovery/tools/plate-redact/`).
- **No YouTube video work has happened.** The known video issues (see BACKLOG.md item 5) are still open: the Candy Red Volvo currently has the _wrong_ car's video associated with it; the finished Bentley's professionally-filmed video is not yet linked anywhere; a three-part unedited YouTube video exists for one build and hasn't been reviewed/placed.
- **Several facts are still unconfirmed by David** — see Open Questions below. None of these were guessed at or filled in.
- **Homepage rotating-featured-build mechanism** — not built. Per this session's new decision (above), this no longer needs to wait on any admin/CMS work, just a design/implementation pass.
- **Contact form is not live** — `site.config.ts`'s `features.contactForm` flag is still `false`, unchanged from earlier phases. The form itself is real and functional; the flag is a deliberate "not yet confirmed ready to go live" marker, not a bug.
- **Workshop video hero is not built** — the real film hasn't been delivered yet (separate video commission, tracked in the discovery session, not this one).
- **`develop` has not been pushed to origin, and nothing has been promoted to `staging` or `main`.** This project's git workflow is `develop → staging → main`; only the first hop has happened, locally.
- A handful of known MEDIUM/LOW visual-fidelity polish items were deliberately left open after 3 fix rounds — listed in `sites/dpm-autobody/CLAUDE.md`'s "Still not done" section and `yolo-brief.md`'s `## Completed`. Not re-listed here; nothing there blocks anything above.

## Traps

- **Don't start writing pages for the other 10 builds from BACKLOG.md item 5's text alone.** That document has the _content_ (chassis numbers, iCloud links, owner names) but not the _photos_ — a "documented car" page without a real photo is exactly the kind of page this project's Phase 3 checklist explicitly calls incomplete (a library row needs a real thumbnail, not just a text-only entry, once its content phase starts).
- **Don't assume `feature/dpm-autobody-real-pages` needs to stay around** — it's fully merged into `develop` at `33eab0dd`; it's just not deleted yet.
- **The chassis-number discrepancy (26282 vs 23925) is NOT resolved.** `p1800-candy.mdx` (the real, shipped page) uses 26282, sourced from the physical plaque per the original discovery session. `p1800-candy-restomod.mdx` (frontmatter only, Tonja/Ahmet's car) uses 23925. These read as possibly the same car with two different numbers recorded at different points — confirm with David which is which before either the resto-mod page goes live or before treating them as confirmed-separate cars.

## Next step

**In order — do not skip ahead to page-building:**

1. Open `../2026-08_dpm-autobody-discovery/BACKLOG.md`, item 5. It has every build's iCloud photo link and every YouTube video mention. Go through it build by build.
2. For each iCloud album: pull it locally, review for usable/hero shots (this is real curatorial work, not a mechanical download).
3. Run every pulled album through the plate-redaction tool: `../2026-08_dpm-autobody-discovery/tools/plate-redact/` (propose → confirm → apply — check that tool's own README for the exact invocation).
4. Go through the YouTube video mentions specifically:
   - Find which live page currently has the Candy Red Volvo's video misattributed (it belongs to a _different_ Volvo) and fix or remove it.
   - Locate and link the finished Bentley's professionally-filmed video.
   - Review the three-part unedited YouTube video mentioned in BACKLOG.md item 5 and decide where (if anywhere) it belongs.
5. Only once a build has a real reviewed/redacted photo (and, where relevant, its video sorted) is it ready for a real MDX page + library thumbnail — resume Phase 3 of `session.md` per-build from there.
6. Separately, whenever you're ready: `git push origin develop`, then follow this project's normal promotion path (`develop → staging → main`, per root `CLAUDE.md`'s git workflow) when you want this live.

No exact CLI command exists yet for steps 1-4 (no plate-redact invocation confirmed in this session) — read that tool's own docs before running it for the first time.

## Open questions

Needs David's input before the corresponding build can get a real page — not blocking anything else:

- Chassis number: 26282 (plaque, on the shipped P1800 Candy page) vs. 23925 (Tonja/Ahmet's resto-mod, per the 2026-09-08 meeting) — same car, two numbers, or two different cars?
- "Rare Volvo" build — singer's name still needed.
- The two-P1800s-same-client build — show names/awards still needed.
- Bentley S3 1964 (in-progress) — chassis number still TBD.
- The "262" build — chassis number still pending; may replace the T. Green Aston Martin content in the featured set.
- Porsche 356 SC — confirm the "might/minor mechanical rebuild" wording before publishing.
- Pearl White P1800's "1,300 hours" figure — double-check it wasn't accidentally copied from the Red P1800's figure.
- Pink Aston Martin DB6 — currently "due to race again"; confirm current status before publishing.
