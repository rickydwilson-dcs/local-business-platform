# Session: DPM Autobody — build-out from David's review meeting

**Status:** In progress — Phase 0 done, Phase 1 scaffold done (2026-09-11), Vercel project + real
page components not yet built
**Opened:** 2026-09-08
**Client:** DPM Autobody (David Pearce-Martin), Berwick, East Sussex
**Predecessor:** `output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/` — read `synthesis.md`,
`positioning.md` and `BACKLOG.md` item 5 before starting. This session does not repeat the research;
it turns the discovery phase's decisions plus David's 2026-09-08 review-meeting content into a build.
**Goal:** Turn the two-page static prototype into a real, MDX-driven site with individual build pages
for the restorations David has now sent content for, plus a build-library index page above them.

---

## Why this is a new session folder, not more of discovery

Discovery produced a design direction and a two-page prototype (`prototype/direction-d-register.html`

- homepage) published at dpm-autobody.vercel.app for review. That review happened 2026-09-08 — David
  is happy — and in the same conversation sent enough real build content (8 restorations, chassis
  numbers, photo albums) that hand-authoring more static HTML pages stops being the right approach.

The platform's own architecture rule is explicit: **never hand-author individual static pages** —
`app/services/specific-service/page.tsx` is called out by name in the root `CLAUDE.md` as the thing
not to do. Eight build pages plus a library index is exactly the shape `[slug]` dynamic routes and MDX
content exist for. That's the real decision this session opens with — see Phase 0.

---

## Source material

| Path                                                                    | Holds                                                                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `../2026-08_dpm-autobody-discovery/synthesis.md`                        | The design argument — auction-lot-page framing, the three original directions                                       |
| `../2026-08_dpm-autobody-discovery/positioning.md`                      | Governing principle: project the customer's world, not the shop's                                                   |
| `../2026-08_dpm-autobody-discovery/BACKLOG.md` item 5                   | **The full content dump from the 2026-09-08 review meeting** — every build, every correction, verbatim iCloud links |
| `../2026-08_dpm-autobody-discovery/open-questions.md`                   | Still-open blockers (logo vector, chassis number 26282 vs 23925 discrepancy — see below)                            |
| `../2026-08_dpm-autobody-discovery/prototype/direction-d-register.html` | The chosen design language — near-black ground, scroll-moved highlight, paint-code accent, bylined log entries      |
| `../2026-08_dpm-autobody-discovery/session.md` line 116                 | The original Candy P1800 worked example: chassis **26282**, from the physical plaque                                |

---

## Flagged discrepancy — resolve before publishing

The discovery-phase prototype's worked example is a "Candy Red" P1800 with chassis **26282**, sourced
from the plaque on the physical car. The 2026-09-08 meeting content for the "Resto Mod Candy P1800"
(owned by Tonja, commissioned by Ahmet — matching wire-wheel/power-steering/smoothed-bumper detail)
gives chassis **23925**. These read as the same car with two different chassis numbers. Ask David
which is correct before either number goes on a live page — get it wrong and it's the kind of error a
concours buyer will actually check.

---

## Phase 0 — Prototype the library page design (static, iterate before scaffolding)

**Sequencing decision, Ricky 2026-09-08: design the library page as a prototype iteration first, then
scaffold.** Reasoning: it's the one page in this build with a real open design question ("must not
look like a shop" — no existing reference in this project has been audited for how it presents a
_collection_ of builds, only single builds and homepages). Get that right cheaply in static HTML,
inside the existing `prototype/` folder alongside `direction-d-register.html`, before committing to
real content and routing. The 8 individual build pages don't carry the same design risk — they extend
a language (auction-lot-page framing) that's already chosen and approved.

- [ ] Reference research specifically for archive/index/library pages — the discovery session's three
      teardowns (Eagle, Thornton, Halcyon) were all audited as homepages, none for how they present a
      multi-build collection; that gap needs filling before designing this page
- [ ] Design 1-2 library-page directions as static HTML in `../2026-08_dpm-autobody-discovery/prototype/`,
      extending Direction D's language (near-black ground, auction-lot-page structure) rather than
      inventing a new one
- [ ] Populate with placeholder/real thumbnails from whichever build photo albums have already been
      pulled, so it reads as a real collection rather than lorem-ipsum cards
- [ ] Review with Ricky, iterate
- [ ] Once approved: this becomes the reference for building the real library route in Phase 2

## Phase 1 — Scaffold the real site (once the library design is approved)

The content volume (8 builds + a library page) and the platform's MDX-only rule both point toward a
real site rather than more static prototype HTML — see the architecture-rule note above. This is the
point where DPM moves from "prototype for review" to "real site under active build," gated on Phase 0
landing first so the library route is built against an approved design, not a guess.

**Status: scaffold done, 2026-09-11.** `sites/dpm-autobody` exists, builds/type-checks/lints/tests
clean, `cs-vercel-config-auditor` ran clean. Manual copy from `base-template` (Ricky's call — no
intake-system project file exists for DPM, and step 2 rebuilds the pages wholesale anyway so the
`create-site-from-project.ts` path wouldn't have saved anything). Real business facts from
`client-brief.md` are in `site.config.ts`; genuinely unconfirmed facts (street address, postcode,
hours, certifications) are marked `TBC` or omitted rather than invented — see that file's header
comment and `sites/dpm-autobody/CLAUDE.md`. base-template's services/locations/blog/projects/reviews
routes, content dirs, and page components were **deleted** at scaffold time (Ricky's call) rather than
left dormant with generic placeholder content — DPM's approved design doesn't use any of them.

- [x] Manual copy from `base-template` (not `create-site-from-project.ts` — no project file exists,
      and it wouldn't have helped for a site this structurally different from the tradesperson
      default anyway)
- [x] Colors and fonts in `theme.config.ts` sourced from the approved prototype's real CSS custom
      properties (`prototype/src/library.html`) — **not yet done:** the actual header/footer/home/
      workshop/library/build-page components themselves, still base-template's generic placeholders.
      That's the step-2 "recreate the HTML artefacts in Next.js" work, tracked below in Phase 2/3.
- [x] `vercel.json` `ignoreCommand` present (`turbo-ignore dpm-autobody --fallback=HEAD^1`, matches
      `dch-automotive`'s known-good pattern) — confirmed by `cs-vercel-config-auditor`, 0 findings
- [x] CSP `media-src` added for the planned video hero
- [x] `pnpm install` run, lockfile updated and committed-ready (workspace member registered)
- [x] New Vercel project **"dpm"** (`prj_A6RWtH01VGD9Yfmi1H2Ybmhpqzyf`), live at
      `dpm-ecru.vercel.app` — separate from the `dpm-autobody.vercel.app` static-prototype project,
      which is confirmed untouched (verified via the Vercel API: its production deployment is still
      its own last publish, unrelated commit). **Naming note:** the obvious name `dpm-autobody` is
      already taken by that prototype project, and Vercel project names are unique per team — the
      first import attempt silently failed for this reason before the name was changed to `dpm`.
- [x] First deploy — READY, root directory `sites/dpm-autobody`, tracks `develop`.
- [ ] `NEXT_PUBLIC_SITE_URL` env var — attempted to set it to `https://dpm-ecru.vercel.app` via the
      Vercel dashboard so metadata/canonical URLs aren't stuck on the `localhost` fallback in
      production; the edit did not visibly persist (row still showed "Added" not "Updated" after
      several save attempts) and this was not worth further turns to chase. Low priority — it only
      affects `metadataBase`/OG/canonical URLs, not functionality. Revisit next session, or set via
      `vercel env add` CLI instead of the dashboard.

## Phase 2 — Content model

Design the MDX frontmatter schema for a "build" content type before writing any build pages, so all 8
share one shape. Needs at minimum: car make/model/year, chassis number, owner/commissioner names
(optional — not every build has them), status (`completed` | `in-progress`), hours of labour, scope of
work (body/paint/mechanical/trim, and who did which), a `heroImage` field, video reference (YouTube ID

- type: professional/amateur/none), and a flag for whether the build is "concours restoration" vs.
  "resto-mod" vs. "race car" — the positioning differs per type (see `positioning.md`).

**The library page is a generated view over this same collection, never a separately maintained
list.** Ricky confirmed this, 2026-09-08: every ledger row's thumbnail is that build's own
`heroImage` frontmatter field, read the same way its individual page reads it — so a build's photo
only ever needs setting once, on its own MDX file, and the library page picks it up automatically.
This is the direct application of the platform's MDX-only rule (root `CLAUDE.md`: "frontmatter IS the
data") to this specific page — get the schema right here and the Phase 0 prototype's per-row image
slot becomes real with zero duplicated content.

- [ ] Define the Zod schema for the `builds` content type (or whatever collection name fits the
      existing `lib/content.ts` generic loader pattern), `heroImage` required once a build's status
      allows it to appear with a photo
- [ ] Decide the slug convention now, given the P1800 collision risk flagged in `BACKLOG.md`: likely
      `p1800-candy-restomod`, `p1800-red`, `p1800-pearl-white`, `p1800-[client-name]-pair` rather than
      anything that could resolve to the same slug twice

## Phase 3 — Individual build pages + library route (content ready, blocked on photo review)

Build the library route now too, against the design approved in Phase 0 — it's a container for these
same 8 builds, so it lands naturally alongside them rather than as a separate pass.

All 8 builds and their iCloud links are in `BACKLOG.md` item 5. None of the photo albums have been
downloaded, reviewed, or plate-redacted yet — that's real work per build, not just a content pull.
Number-plate redaction tooling exists (`../2026-08_dpm-autobody-discovery/tools/plate-redact/`) and
should run on every album before anything goes on a public page.

**Every library-page row gets a real photo — this is a requirement, not a nice-to-have.** Ricky's
call, 2026-09-08, reviewing the Phase 0 prototype: he's fine that the 7 not-yet-sourced builds show
as text-only rows _in the prototype_, but that's accepted as a temporary content gap, not the design's
final state — the design itself already reserves an image slot on every row (`.ledger__item--photo`
vs `.ledger__item`), so this is a content task, not a further design change. **Definition of done for
each build in this phase includes pulling its photo, running it through plate-redact, and giving its
library row a real thumbnail** — a build page shipping without its library row also getting an image
is incomplete, even if the individual page itself is finished.

- [ ] Pull each iCloud album locally, review for usable/hero shots
- [ ] Run plate-redact on every album (propose → confirm → apply)
- [ ] P1800 resto-mod (Candy, Tonja/Ahmet) — chassis TBD, see discrepancy above
- [ ] Pink Aston Martin DB6 — race car, "due to race again," check status before publish
- [ ] Rare Volvo — singer's name still needed from David; in-progress, frame accordingly
- [ ] Two P1800s, same client — show names/awards still needed from David
- [ ] Bentley S3 1964 — in-progress, chassis TBD
- [ ] Red P1800 — **resolve the video-mismatch bug first** (see `BACKLOG.md` item 5): find which live
      site page currently has this video misattributed, before this page goes up
- [ ] Porsche 356 SC — confirm "might/minor mechanical rebuild" wording with David
- [ ] Pearl White P1800 — double-check the "1,300 hours" figure isn't accidentally copied from Red
      P1800's figure
- [ ] Fold in the already-planned corrections: rename "lead loading and filling" → "body levelling"
      site-wide; fix plaque wording ("riveted" → accurate); remove Aston Martin T. Green; pull the
      wrong Candy Red Volvo video; link the finished-Bentley video
- [ ] 262 — chassis number still pending from David; may replace T. Green in the featured set
- [ ] Build the library route itself, against the Phase 0 design (card/list treatment, filtering if
      any — status, make, era), sitting above the individual `[slug]` build pages

## Phase 4 — Homepage rotation + workshop/contact split

Carried over from the discovery session's `BACKLOG.md` items 3 and 5:

- [ ] Homepage rotating featured-build selection — needs a real content mechanism (client-editable),
      not a static section; scope this properly rather than bolting onto the current homepage
- [ ] Split workshop into its own page, hero'd with the new-unit film (see discovery `BACKLOG.md` item
      3 for the sourcing/rights detail, already cleared)
- [ ] Workshop action photos (welding, metalwork, general atmosphere) — Ricky's action, not David's
- [ ] Split contact into its own page

## Phase 5 — Wrap-up

- [ ] Update `BACKLOG.md` item 5 — move each completed sub-item from open to done
- [ ] Update `../MEMORY.md` → `project_dpm_autobody.md` with the outcome
- [ ] `/wrap-up-session`

---

## Explicitly not in scope for this session

- Logo vector/EPS — separate ask to David, tracked in discovery `open-questions.md` item 2, not
  blocking any of the above
- Video commission (daylight hero shoot, macro paint work) — separate from the existing-footage work
  above; tracked in discovery session
- Testimonials — no new content came in this meeting; discovery `open-questions.md` item 4b still owns
  this
