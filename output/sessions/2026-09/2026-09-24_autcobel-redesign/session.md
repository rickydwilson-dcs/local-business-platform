# Session: 2026-09-24_autcobel-redesign

**Start Date:** 2026-09-24
**Status:** Active
**Objective:** Rebuild autcobel.ltd (a thin, non-functional one-page
placeholder) into a full HTML prototype — design and content — that can be
iterated quickly and shared with the client (Gene) before the real
production build. The prototype's Vercel project must NOT be named
`autcobel` — that name is reserved for the eventual production site. Use
`autcobel-proto` per the platform's prototype-naming rule.

## Summary

Autcobel Ltd is a real, active UK company (Companies House no. 14044405,
incorporated April 2022) doing electrical + data infrastructure project work
for retail/coldchain/commercial/logistics sites nationwide. Its current
website is a single page with a non-functional nav promising pages that were
never built. Full research in `research/source-material.md`.

We are writing the site content ourselves (client has minimal input, trusts
the agency to lead). Copy is being drafted as if it will go live — not
bracket-placeholder stubs — with anything unverified tracked separately in
`CONTENT-STATUS.md` (never published) for the client to confirm or correct.

## Key Decisions

- **Cookie Policy is a standalone page**, not folded into Privacy Policy —
  the consent-mechanism banner needs to link directly to it.
- **Services are split into 3 dedicated pages** (Turnkey Electrical & Data /
  Project & Design Management / Temporary Plant Systems) rather than one
  combined page — each pillar has enough distinct technical territory to
  support its own page without thin/duplicate content. "Consultation &
  Collaboration" (named on the live site as a 4th pillar) was folded into
  **Our Approach** instead of getting its own page — it's about how Autcobel
  works with clients, which is what an Approach page already covers, so a
  separate page would have duplicated it.
- **No standalone "Our Work / case studies" page** — there is zero evidence
  of real past projects, named clients, or outcomes to put on one. Inventing
  case studies would be fabrication, not a draft. The proof points that do
  exist (50+ projects, 30+ years combined experience, nationwide, 24/7) live
  on Home and Who We Are instead.
- **No "Our Services" hub/landing page** — the services nav item is a
  dropdown straight to the 3 service pages; a 4th thin index page wasn't
  worth it.
- Net result: **11 pages**, one above the client's original 5–10 estimate.
  That's a direct consequence of keeping Cookie Policy separate and giving
  services real depth — flagged to the user rather than silently exceeded.

## Page List

1. Home
2. Who We Are
3. Our Approach
4. Turnkey Electrical & Data (service)
5. Project & Design Management (service)
6. Temporary Plant Systems (service)
7. Sectors We Serve
8. Contact Us
9. Privacy Policy
10. Terms & Conditions
11. Cookie Policy

## Files

- `research/source-material.md` — verified facts only (live site text,
  Companies House data, competitor scan)
- `content/*.md` — full draft copy per page, in the page list order above
- `CONTENT-STATUS.md` — client-facing tracker (Gene). Bulleted, short,
  humanized. **Never gets published to the live site or deployed prototype**
  — internal/repo only.
- `prototype/src/` — static HTML/CSS/JS build, all 11 pages, no build step.
  Design system: `assets/css/styles.css` (tokens + components), behaviour:
  `assets/js/main.js` (mobile nav, form intercept, cookie banner). Type
  pairing (Archivo/Inter) and landing pattern (hero → proof → solution →
  CTA) sourced from the `ui-ux-pro-max` skill. No photography — hero
  visuals are CSS-only abstract line/gradient treatment.

### Colour palette — revised

First pass used a generic "industrial B2B" slate + safety-orange palette
from the design-system skill. Ricky corrected this: the _existing_
autcobel.ltd site's blue/white reads as coldchain/refrigeration/HVAC, not
generic SaaS, and should be kept — with a dark navy added for contrast
between bands that were previously all one flat blue. Sampled the real
site's colours directly (`getComputedStyle` on the live page, not a guess):
brand blue `#004AAD`, background `#F9F9F9`. Current tokens in
`assets/css/styles.css`:

- `--color-accent: #004AAD` — the real Autcobel blue. Buttons, links, icons,
  eyebrows/labels on light backgrounds.
- `--color-ink: #0A2647` — new deep navy, darker/richer than the brand
  blue on purpose. Hero/footer/dark-band backgrounds, headings.
- `--color-accent-on-dark: #5EA1FF` — brighter blue for accent-coloured
  _text_ (eyebrows) and decorative borders (stat-card left border) when
  they sit on the navy background — the brand blue itself is too close in
  darkness to the navy to pass contrast there (checked: ~1.9:1, fails).
  Scoped via `.hero`/`.section--dark` selectors, not a global change.
- `--color-bg: #F9F9F9`, `--color-surface: #FFFFFF` — matches the real
  site's off-white/white almost exactly.

All colour lives in this one file as custom properties — no raw hex in any
of the 11 HTML pages except `#fff` on a couple of decorative SVG icon
strokes, which are correct at any accent colour. So a further palette
change is a token edit here, not a rebuild of the pages, per Ricky's
explicit ask for "a CSS switch."

Also fixed while verifying in-browser: `.hero .btn-secondary` and
`.hero .lede` were inheriting colours that made them near-invisible against
the dark hero — found and fixed by actually looking at a screenshot, not
just reading the CSS.

Unrelated but noted: Ricky observed the _existing_ autcobel.ltd site's
nav doesn't render at all in Safari (Chrome-only, apparently) — on top of
the nav being decorative/dead-linked even where it does render. Useful
extra evidence for why this rebuild is warranted. Nothing in our own
prototype's CSS/JS uses anything Safari-specific, but it hasn't been
checked in an actual Safari session — worth doing before this goes to
Gene, alongside the mobile-viewport check below.

## Next Steps

- [x] Draft full copy for all 11 pages (`content/`)
- [x] Write `CONTENT-STATUS.md`, run humanizer skill over it
- [x] Build HTML/CSS prototype in `prototype/` (all 11 pages, verified
      in-browser at desktop width; one real bug found and fixed — the hero's
      secondary button and subhead text were low/zero contrast against the
      dark hero background, missed because `.hero` wasn't covered by the
      `.section--dark` override rules)
- [x] Revise colour palette to match the real site's blue/white + add navy
      contrast layer (see above)
- [x] Publish to Vercel as `autcobel-proto` —
      **https://autcobel-proto.vercel.app** (public project alias, not
      auth-gated; per-deployment URL is gated, use the alias for sharing)
- [ ] Review in browser at mobile width before sending to client — this
      session's browser tool couldn't resize its own viewport to confirm
      visually, so the mobile nav/layout is verified by CSS review only,
      not a live narrow-viewport screenshot
- [ ] Check in actual Safari, given the existing site's nav doesn't render
      there at all (see note above) — nothing in our CSS/JS looks
      Safari-specific, but unconfirmed

### Folder layout note

Flattened `prototype/src/` up into `prototype/` directly, and moved
`assets/css/`+`assets/js/` to plain `css/`/`js/` at the prototype root —
`tools/upload-prototype-assets.ts` and `publish-prototype.ts` expect the
deployable directory to sit right at `<session>/prototype/` (its slug
detection strips a literal `prototype` basename, nothing else), and
`assets/` is specifically the R2-bound-binaries convention (images/video —
its `CONTENT_TYPES` map has no `.css`/`.js` entry, by design). Stylesheets
and scripts are lightweight text, meant to ship as part of the static
Vercel deploy directly, not round-trip through R2. `assets/` still exists
(empty) for whenever real photography/video gets added later.

## Design pass 2 — full v10-based rebuild (2026-09-24, later same session)

The navy/slate/orange "industrial" palette from the first build read as
"a bit boring." Explored 10 genuinely different homepage directions in
`homepage-mockups/` (one per design skill: ui-ux-pro-max, minimalist-ui,
industrial-brutalist-ui, high-end-visual-design, stitch-design-taste,
design-taste-frontend, redesign-existing-projects, impeccable, design,
ui-styling), each briefed on two hard constraints (lighter blue as the
dominant hero colour; some visual expression of "data-centricity +
solutions delivery," not necessarily the real site's node-globe graphic)
but otherwise free to interpret through their assigned skill's own
philosophy — the client explicitly did not want them converging on one
look. Reviewed all 10 live in-browser (not just read as code) and caught
two real issues while doing so: a text-collision bug in v5, and v8
inventing specific operational facts (an exact site number, a temp range,
an uptime %) with no disclaimer — flagged, not silently fixed, since that
call belongs to the client.

Client picked **v10** ("ui-styling" skill — shadcn/Tailwind-flavoured).
Iterated on it directly: dropped 24/7 from the hero's stat row (4 didn't
sit well, 3 does), tightened the hero's top padding by ~20px. Then
extracted v10's inline styles into a proper shared design system
(`prototype/css/styles.css`) and rebuilt all 11 pages against it,
replacing the first build entirely. New system keeps v10's real tokens
(brand blue `#2f6fed`, off-white `#f4f8ff`/white, navy `#0c2350`/`#0a1c40`
for dark bands, Inter + JetBrains Mono) and adds what a single homepage
mockup didn't need: a working mobile nav (v10 only hid the desktop nav
below 900px with no menu at all — CSS-only, added a proper hamburger +
panel, sibling of the header per the usual backdrop-filter/fixed trap),
an inner-page hero variant (`.hero--page` + breadcrumb), and the
checklist/process-list/contact-list/policy-table/note-box/form components
inner pages need that a homepage doesn't.

Footer corrected on request: matched the first build's fuller footer
shape but dropped the sector-tag pills from the brand column, and added a
"Built by Digital Consulting Services" credit line at the very bottom —
**linked to `digitalconsultingservices.co.uk`, which is an assumption
(matches the user's email domain) and not yet explicitly confirmed.**

One real bug caught by looking, not just reading the CSS: `.checklist`
(service-page "what's included" lists) sat inside `.prose`, so it
inherited `.prose li`'s decorative bullet dot on top of its own check
icon — fixed with a scoped `.checklist li::before{content:none}` override
in the stylesheet, applies to all 3 service pages from one change.

Same delegation pattern as before (build 2 exemplar pages myself — home +
one inner page — to establish the pattern, delegate the mechanical rest
to a fork with explicit self-verification demanded), and same
independent-verification discipline afterward (own `ls`/`wc -l`/`grep`
checks, not trusting the fork's report, plus live-browser spot checks).
This fork's self-report was accurate this time — included its own real
`ls`/`wc -l`/`grep` output rather than a bare claim, and it was correct
when independently re-checked.

**Not yet done:** redeploying this rebuild to `autcobel-proto.vercel.app`
— the live deployment still serves the first (navy/orange) build. Needs
running `tools/publish-prototype.ts` again once the client confirms this
direction. Mobile-width and Safari checks (flagged above) are still
outstanding on top of that.

## Design pass 3 — Higgsfield-generated hero imagery (2026-09-24, later same session)

Client disliked the inner-page hero motif (bordered white "card" with a line-art
icon inside) — "on a white square" was the specific complaint. Asked for
Higgsfield-generated alternatives. Higgsfield turned out to be a local CLI
(`higgsfield`, `~/.npm-global/bin`, already authenticated —
webmaster@digitalconsultingservices.co.uk, plus plan), not an MCP tool —
ToolSearch found nothing until the user pointed at the CLI directly.

Explored three directions before landing: Recraft V4.1 line-art icons (closest
to what was already there — client passed), FLUX.2 abstract atmosphere (client
liked this — read it as "cool airflow," which is a genuinely good fit for a
coldchain company), and a Recraft flat-illustration scene (a third real option,
not pursued further). `background_color: null` and `utility_vector` mode do
**not** produce true alpha transparency on Recraft despite what the param name
implies — tested directly by compositing on a hotpink canary background, both
came back opaque. Abandoned a background-removal pass (`image_background_remover`
model) that sat queued 5+ minutes with no result. Never needed it in the end:
the client chose the full-bleed-no-frame direction, which sidesteps the
transparency question entirely.

Generated a 5-image family in one consistent style (dark navy bg, glowing
cobalt light trails, soft particle grain — same prompt skeleton, varied
composition) via FLUX.2, ~1 credit each:

- `hero-visual-airflow-sweep` — diagonal sweep (the original "cool airflow" one)
- `hero-visual-vertical-current` — vertical rising streams
- `hero-visual-radial-converge` — radial swirl into a central glow
- `hero-visual-twin-ribbons` — two ribbons twisting together
- `hero-visual-calm-waves` — calm steady horizontal waves

Assigned 2 pages per image by thematic fit (e.g. vertical-current →
electrical service page, twin-ribbons → Contact Us / Cookie Policy — a
"two parties" reading). Full mapping is in every page's own `<img src>`.
Rebuilt `.hero-visual` CSS as a plain rounded/shadowed image container —
deleted `.motif-card`/`.motif-corner`/`.motif-grid`/`.motif-label` entirely,
including the sectors page's 2x2 icon-grid variant.

**Asset-pipeline trap hit and fixed:** the R2 upload tool
(`tools/upload-prototype-assets.ts`) routes any PNG sitting directly in
`assets/img/` to `_archive/` with a 1-year immutable cache — correct for
truly unreferenced master files, wrong here since these 5 are live and
referenced by 10 pages, and we've been iterating on visuals all session.
Moved them into `assets/img/hero/` (one directory deeper defeats the
archive-detection regex) before uploading, confirmed via dry-run that they
now classify as "Live" (5-min cache) before pushing to R2 — avoids baking
in a year of stale-image risk on assets that might well get iterated again.

Same fork discipline as every other multi-page rollout this session, with
one new failure mode: the first attempt at the 9-page rollout returned
`status: completed` with **zero tool calls** and a reply implying it thought
someone else's work was being echoed to it — it never actually did anything.
Caught immediately by independently grepping the target files (all zero
matches), corrected with an explicit "there is no one else, you are the
agent, do the edits now" message via SendMessage, and the resumed run did
it properly (real edits, real verification output, independently re-checked
by grep and a live browser look before deploying).

Redeployed to `autcobel-proto.vercel.app` — confirmed live, R2 URLs
resolving, images rendering as expected.

## Design pass 4 — full-width hero background images (2026-09-24, later same session)

Rebuilt the inner-page hero again: the boxed image panel (right-column,
rounded, shadowed) became the section's own full-width background image,
with the text left-aligned on top of a left-to-right dark scrim
(`linear-gradient(100deg, rgba(8,17,38,0.92)…0.12)`) for legibility. Text
palette flips to the light-on-dark treatment already used on `.stats-strip`/
`.cta-band` (white h1, `#cdd9f0` body, translucent white eyebrow pill) since
the hero background is now always one of the 5 dark generated images, never
the light gradient.

Deleted the now-fully-obsolete `.motif-stage`/`.hero-visual` box CSS and the
`.hero-page-inner` two-column grid — third design iteration on this same
element today (bordered icon card → boxed rounded image → full-bleed
background), each one responding directly to specific client feedback.
`.hero-grid-overlay` kept (still used by the home hero, which is unaffected
by any of this — only the 10 inner pages changed).

One mechanical trap hit while scripting the rollout across 9 files: 3 of
them (the legal pages) use `<section class="hero--page section--tight">`
rather than the bare `<section class="hero--page">` every other page uses,
so the first pass's exact-string match silently skipped them — caught by
verifying `background-image:url` count per file after the run (3 came back
0), not by trusting the script's blanket "OK" output for every file.

Did this rollout directly (Python string-replace across all 9 files, one
pass, self-verified) rather than delegating to a fork — mechanical enough,
and matched the exact per-page R2 URLs already assigned in the previous
pass, so no new judgment calls needed per file.

Redeployed to `autcobel-proto.vercel.app` — confirmed live.

## Design pass 5 — homepage hero unified with the inner-page treatment (2026-09-24, later same session)

Client: "these are much stronger" (re: the airflow image family) and asked
for the home hero to get the same full-width-background treatment. Also
asked for one more generated image specifically evoking data flow, for
Home specifically — generated (`hero-visual-data-stream.png`, FLUX.2, same
prompt skeleton as the other 5) and it came out genuinely distinct: denser
particulate texture along the light bands, reads much more literally as
"data packets in motion" than the other 5's smoother airflow feel. 6th
image in the set, used only on Home.

This retired the "Delivery Console" dashboard illustration entirely —
deleted ~65 lines of CSS (`.panel-stage`, `.glow`, `.dash-*`, `.float-chip`,
`.spark-svg`, three now-unused `@keyframes`) and the matching HTML block.
That dashboard was carrying the fabricated-stats problem flagged back in
the very first homepage-mockups review (v10: "Active sites: 12", "Avg
response: 2.4h", invented sector percentages) — replacing it with a
generated background image doesn't just look stronger, it removes that
open accuracy question rather than requiring an explicit fix.

Also unifies something that had been quietly inconsistent since the v10
choice: Home's hero was light-background/dark-text while every inner page
(after the earlier full-width rebuild) was dark-photo/light-text. Same
scrim formula, same light-on-dark palette now used everywhere a hero
exists. `.hero-grid-overlay` (the faint grid-pattern texture) removed too
— was designed to sit over the old light gradient and had no visible job
once every hero became a photo.

Caught the R2 archive-path trap again before it could bite (same regex
issue as the first 5 images) — put the new image straight into
`assets/img/hero/` from the start this time rather than needing a second
fix, confirmed "Live" classification (not archived) on the dry-run before
uploading.

Redeployed to `autcobel-proto.vercel.app` — confirmed live, verified both
the hero copy legibility and the stats-row divider render correctly
against the new image before calling it done.

## Design pass 6 — new logo mark + AUTCOBEL wordmark in caps (2026-09-24, later same session)

Replaced the placeholder bolt-in-a-box brand mark with a Higgsfield-
generated logomark in the same style as the hero art (navy square,
flowing cobalt strands), plus set the wordmark to caps site-wide.

Iterated properly rather than taking the first result: generated 3 initial
concepts (flowing "A", three parallel currents, flowing bolt/swirl),
showed the user direct CDN links (the AskUserQuestion options alone don't
render images — learned that when the user came back with "i cant see
them, give me links"), got feedback ("A would look better with thin
strands making up each leg" — combining the A concept with the multi-
strand texture from the currents concept), regenerated 2 refined versions,
and picked the more symmetric one myself once the direction was clearly
right, giving the alternate link in case of a different preference.

Implementation: `assets/img/brand/logo-mark.svg`, dropped into `.brand-mark`
in place of the old inline bolt SVG (mechanical: identical markup existed
in exactly 2 places per page — header + footer — across all 11 pages, so
one Python find/replace handled all 22 occurrences in one pass, verified
by grep before and after). `.brand-mark` CSS simplified from
gradient-background-plus-icon to just a rounded clip mask, since the new
mark carries its own navy background. `.brand`/`.footer-brand` got
`text-transform:uppercase` — deliberately scoped to just the logo lockup,
not every prose mention of "Autcobel" in body copy or the legal footer
line, which would read as shouting if capitalised throughout.

Redeployed to `autcobel-proto.vercel.app` — confirmed live at both header
and footer, and at both path depths (root pages and `services/`).

## Design pass 7 — unified card styling site-wide (2026-09-24, later same session)

`.info-card` (Who We Are's "four things" grid, Sectors' four sector cards)
was a plainer, flatter treatment than the homepage's `.pillar-card` — no
icon, no hover lift, white instead of the tinted surface-2 background.
Brought it into line: `.info-card` CSS now matches `.pillar-card` (same
background/hover-lift/border treatment), and added an icon box
(reusing the existing unscoped `.pillar-icon` class — no new CSS needed)
plus a small tag chip to all 8 cards across both pages. Sectors reused the
exact 4 icon paths already established in the homepage sector-pills
(retail/cold-chain/commercial/facilities), not new ones. `.form-card`
(the Contact Us form container) was left alone — a form wrapper, not a
content-summary card, so the pillar treatment doesn't apply there.

Redeployed to `autcobel-proto.vercel.app` — confirmed live on both pages,
including checking the hover-lift state actually fires.

## Notes

Client (Gene) has minimal bandwidth/interest in reviewing detail and is
ADHD — all comms and the content-status tracker need to be short, bulleted,
plain-worded. He'll flag only what's clearly wrong.
