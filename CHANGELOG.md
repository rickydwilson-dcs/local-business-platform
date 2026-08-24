# Platform Changelog

Notable platform-level changes to the Local Business Platform. Site-specific changes are tracked in each site's own CHANGELOG.md. Package-level changes are tracked via changesets in each package directory.

> For the full project development history (2025-10 through 2026-01), see [docs/project-history.md](docs/project-history.md).

---

## 2026-08-24

### Sites

- **NP Racing: fixed missing favicon and audited image compression across every page.**
  `sites/npracing-v1` had `app/icon.png`/`app/apple-icon.png` (Next's metadata-icon convention)
  but no `favicon.ico` — Chrome always requests `/favicon.ico` directly regardless of the
  generated `<link>` tags, so that request 404'd on every load. Added `app/favicon.ico`
  (16/32/48/64px, generated from the existing `icon.png`), matching the favicon-in-Git exception
  already carved out in [docs/standards/images.md](docs/standards/images.md). Separately, a
  Lighthouse pass flagged two homepage images for insufficient compression; every `<Image>` on the
  site was audited and an explicit `quality` prop applied by role — `65` for photographic content
  (hero, team/rider/product photos, gallery tiles, article hero images) and `50` for the small
  repeating sponsor-marquee logos — while brand-logo assets (header/footer/mobile-nav, the
  single-logo sponsor showcase page) and the gallery lightbox's full-screen view were left at
  Next's default so text/edges and zoomed detail stay sharp. A CSP console warning reported
  alongside these (`script-src` blocking `eval`) turned out to be harmless: traced to Zod
  4.1.12's `allowsEval` feature probe (`node_modules/zod/v4/core/util.js`), a try/caught
  `new Function("")` call Zod uses to decide whether it can use its JIT-compiled fast validator
  before falling back gracefully — the site's CSP correctly omits `unsafe-eval` in production, so
  no code change was needed. Note for future work: `next.config.ts`'s quality comment says hero
  images should use `80` (copied verbatim from `base-template` at bootstrap, never actually
  applied anywhere), but the home hero was set to `65` here per the Lighthouse finding — these are
  in tension if that comment reflects real policy rather than template boilerplate.

- **DCS homepage work panels: pill chips replaced with outbound links to every client site.**
  Previously only NP Racing and SM Commercial linked out from the "You do you" work stack; the
  other three panels (The Clothing Kings, Cuddle Plush Fabrics, Colossus Scaffolding) showed a
  pill-shaped chip label (e.g. "Specialist fabric") instead. All five panels now link to the live
  client site, and the chip UI (`WorkItem.chip`, the `.wchip` CSS rule) was removed rather than
  left dormant. `sites/dcs/test/home-data.test.ts`'s prototype-fidelity check was narrowed to only
  verify the two links the r9 prototype already had (NP Racing, SM Commercial) verbatim against the
  frozen prototype file — the three new links postdate that freeze and are sanity-checked instead.

- **DCS Lighthouse mobile performance raised from 85 to 93 (desktop 94 to 100); accessibility to
  100 on both.** Measured against a real production build — the dev server had been giving a false
  SEO reading, since `robots.ts` intentionally blocks crawling outside production. The real issues:
  7 background videos on the homepage carried `autoPlay`, which forces a real fetch even with
  `preload="metadata"`, so all 9.7MB downloaded immediately regardless of scroll position — now
  gated behind an `IntersectionObserver` (`components/home/lazy-video.tsx`), cutting the page to
  ~700KB. The Material Symbols Google Fonts stylesheet was a render-blocking `<link>` in the root
  layout, loaded on every page including ones that use none of its icons — now loaded after mount
  (`components/material-symbols-font.tsx`). The site header/footer logo was a 189KB PNG wrapped in
  an SVG tag; swapped for the real vector already sitting in `public/`. Several WCAG AA color-contrast
  failures on the magenta/aqua service cards and on scroll-reveal headings caught at their too-dim
  rest state were also fixed, plus the logo link's accessible name, which didn't match its visible
  text. See `CLAUDE.md`'s new Performance subsection for the two reusable gotchas (eager video
  fetch, render-blocking third-party stylesheets) and `sites/dcs/PRODUCT.md` for how the homepage's
  prototype-fidelity tests handle a legitimate post-port style change.

- **DCS business phone number updated, twice, to a final value of +44 7748 148082** (briefly
  +44 7383 666268 earlier the same day), and a pre-existing bug fixed alongside the first change:
  the four live page templates that render `tel:` links from `siteConfig.phone`
  (`components/pages/{Contact,LocationDetail,ServiceDetail,Services}Page.tsx`, wired from
  `app/(site)/{contact,locations/[slug],services/[slug],services}/page.tsx`) built the href directly
  from the space-formatted display string instead of stripping whitespace first, producing an
  invalid `tel:` URI — `site-header.tsx`/`site-footer.tsx` already did this correctly, and the page
  templates now match. `components/pages/HomePage.tsx` had the same bug but is dead code (no route
  imports it — the live homepage is `components/home/*`); fixed for consistency while touching the
  file, not because it was user-facing.

## 2026-08-23

### Sites

- **DCS homepage ported from HTML prototype to Next.js/React, with a route group split to carry it.**
  The round-9 hand-built prototype (`r9-kota-level.html`, refined over two long art-direction
  sessions) is now `sites/dcs/app/page.tsx`, measured against the prototype at 1440x900 and 390x844
  for pixel parity. To let the homepage carry its own bar/menu/end-section chrome instead of the
  site's standard header/footer, the 14 existing inner routes (about, blog, contact, cookie-policy,
  locations, pricing, privacy-policy, projects, reviews, services and their dynamic children) moved
  into an `app/(site)` route group — a code-organisation change only, no URLs changed. Until those
  inner pages are rebuilt to the new homepage's standard, only `/` is indexable: `app/(site)/layout.tsx`
  sets `noindex` once for the whole group rather than per page, `robots.txt` stays permissive on
  purpose (a `Disallow` would stop crawlers reading the `noindex` tag at all), and re-enabling a
  section is a one-line `robots` override on that page plus uncommenting its sitemap entry. Also
  added: an unlinked Terms & Conditions page. See
  `output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/` and `sites/dcs/PRODUCT.md`.

- **Cookie consent banner redesigned as a floating ink/fuchsia card, scoped to DCS only.** The
  shared `ConsentManager` in `packages/core-components` renders as a full-width footer bar on all 6
  sites that use it; DCS's brand direction (ink background, fuchsia keyline, pill buttons matching
  the homepage "Hire me" CTA) needed a different look without touching the other 5 sites'
  banners. `sites/dcs/components/dcs-consent-manager.tsx` forks the presentation only — same
  consent state machine, storage and focus-trap hook — and `layout.tsx` swaps the import; the
  shared component itself is untouched. Along the way, initial keyboard/screen-reader focus moved
  off both action buttons and onto a non-interactive heading instead: parking focus on Accept or
  Reject means a stray Enter right when the banner appears fires a real consent decision with no
  deliberate choice, in either direction. See "Site-Specific Presentation Forks" in
  [docs/standards/analytics.md](docs/standards/analytics.md).
- **WordPress cutover redirect map added to `sites/dcs/next.config.ts`.** Maps old WordPress URLs
  (project pages under `/our-work`, blog/news, orphaned category pages) to their `/projects`
  equivalents or home, ahead of the real domain cutover. `skipTrailingSlashRedirect` is set because
  Next's automatic trailing-slash redirect runs _before_ custom `redirects()` and would intercept
  every old WordPress URL (all trailing-slash) before the redirect map ever saw them. See
  `output/sessions/2026-08/2026-08-23_dcs-site-cutover/cutover-plan.md`.
- **DCS's GA4 Realtime showed nothing after go-live, with zero errors anywhere — root cause was a missing pair of `NEXT_PUBLIC_` env vars, not a code bug.**
  `FEATURE_ANALYTICS_ENABLED` and `FEATURE_GA4_ENABLED` were set in Vercel, but their
  `NEXT_PUBLIC_` client-side counterparts were never created — `Analytics.tsx` reads the
  `NEXT_PUBLIC_` variant directly in the browser, so the whole component silently returned
  `null` before ever loading `gtag.js`. Confirmed by inspecting the live deployment's
  serialized client props directly (no Vercel dashboard access needed): `gaId` was a real,
  correctly-configured measurement ID the entire time, which is what ruled out every other
  explanation first. Along the way, a live CSP audit turned up three more blocked domains —
  GA4's regional collect endpoint (`region1.analytics.google.com`), the doubleclick
  conversion-linking beacon (`stats.g.doubleclick.net`), and the Google Ads remarketing pixel
  (`www.google.co.uk/ads/ga-audiences`) — none of which are covered by `*.google-analytics.com`
  alone.
- **Added a build-time guard so this class of mismatch fails the deploy instead of shipping silently.**
  `validateAnalyticsEnv()` (`packages/core-components/src/lib/analytics/validate-env.ts`) checks
  that every server/`NEXT_PUBLIC_` feature-flag pair agrees, and that a flag-gated companion
  value (GA measurement ID, GA4 API secret, Facebook Pixel ID/token, Google Ads customer ID) is
  a real value rather than a leftover `.env.example` placeholder. Throws in production builds,
  warns in dev. Wired into all 6 sites using this pattern (`dcs`, `base-template`,
  `colossus-scaffolding`, `dch-automotive`, `mad-graphics`, `npracing-v1`, `npracing-v3`) — while
  testing the rollout, it also caught the same `FEATURE_CONSENT_BANNER` mismatch already sitting
  in three other sites' local `.env.local` files (harmless there since `.env.local` never reaches
  Vercel, but the same drift worth tidying up). See "Build-Time Validation" in
  [docs/standards/analytics.md](docs/standards/analytics.md).

### Documentation

- **A sticky section makes in-page anchor links do nothing, and neither the DOM nor the console
  says so.** Found on the DCS homepage prototype, where every burger-menu and footer link left the
  scroll exactly where it was. Both `getBoundingClientRect()` and `offsetTop` report a sticky
  element's _pinned_ position rather than its layout position, so once the reader is past an
  unbounded `position: sticky` section the browser still sees the target at `top: 0` and scrolls
  nowhere — measured at 14392 for all nine links, with `offsetTop` returning 14391 for every
  section on the page. The trap is that the hrefs are correct, nothing throws, and it **only
  reproduces from below the target**: an earlier check of the same menu passed because it happened
  to run from the top of the page. [CLAUDE.md](CLAUDE.md) now records the symptom, why the obvious
  measurements lie, and the fix — neutralise `position` for one synchronous read to get the layout
  offset, then scroll there manually.

---

## 2026-08-22

### Documentation

- **`position: sticky` takes its room to pin only from in-flow content after the element — a bottom
  margin and container padding both give it nothing.** Found while building the DCS work-section
  stack, where the last of five sticky panels never pinned. The two obvious fixes were tried and
  both measured **0px of pin** against 840–3940px for the sibling panels: a `margin-bottom` on the
  panel fails because the spec clamps the element's _margin box_ against the containing block, so
  its own margin is part of what is being constrained; `padding-bottom` on the container fails
  because padding sits outside the content box, and the content box is what the containing block
  resolves to. Earlier panels only appear to work because they get their room from the panels that
  follow them, which means **the last item in any sticky stack is the one that silently fails** —
  and it fails by looking almost right, scrolling away a little early rather than visibly breaking.
  The rule in [CLAUDE.md](CLAUDE.md) now records the mechanism, the `::after` fix, and the way to
  verify it: sample `getBoundingClientRect().top` across the scroll range, since a pinned element
  holds `top: 0` and an unpinned one moves 1:1 with scroll.
- **`svh` is the wrong unit for a section that must always cover the viewport; `lvh` is the right
  one.** `svh` is the _smallest_ viewport height — browser chrome expanded — so a `100svh` section
  becomes shorter than the screen the instant a mobile URL bar retracts, leaking a strip of the next
  section exactly when it is meant to be full-bleed. The trap is that this is **untestable in a
  desktop browser or an iframe harness**, where `vh`, `svh`, `lvh` and `dvh` all resolve to the same
  number, so it cannot be caught by looking and has to be applied by construction. Recorded in
  CLAUDE.md's CSS Syntax rules alongside the sticky finding.

---

## 2026-08-21

### Infrastructure

- **A docs-only commit could reach staging but could never be promoted to `main`.** Two
  individually-correct policies deadlocked. `e2e-tests.yml` carried
  `paths-ignore: output/**, docs/**, **/*.md` on its `push` trigger, so a
  documentation-or-prototypes-only commit produced **no workflow run at all**. The promotion gate
  (`scripts/verify-staging-e2e.ts`) requires a push-triggered `e2e-tests.yml` run concluding
  `success` for the exact commit being promoted, and it fails closed by design — "I could not prove
  it is green" is treated as "it is not green". With no run to find, the required check
  `Verify promoted commit passed staging E2E` failed and branch protection blocked the merge, with
  no override flag anywhere (the gate was deliberately built without one, having closed three
  earlier bypass holes). Hit while promoting the round-7 prototypes.
- **Fixed by removing `paths-ignore` from the `push` trigger only.** The jobs already scope
  themselves by branch with `if:` conditions, so the cost is one smoke run on a docs push, and the
  promoted commit is now genuinely E2E-tested rather than merely unblocked. `pull_request` keeps its
  filter — the verifier already ignores PR-triggered runs, so it was never the problem. The
  alternative (teaching the gate to accept a legitimately-skipped run) was rejected because it
  weakens the guarantee the gate exists to provide. A comment on the trigger records why, so the
  filter is not re-added without changing the gate to match.

### Documentation

- **A monospaced body face corrupts a comma'd price on its own — `tabular-nums` is not the only
  way in.** The CSS Syntax rule in [CLAUDE.md](CLAUDE.md) warned only about
  `font-variant-numeric: tabular-nums`. Setting prices in DM Mono reproduced the identical
  `£1 , 995` failure with no `tnum` anywhere in the stylesheet: every glyph in a mono face occupies
  one cell, so the comma takes a full digit advance regardless. This matters because DM Mono is the
  chosen DCS body face, making it a live risk rather than a hypothetical. The rule now says to
  resolve **both** `font-variant-numeric` and `font-family` up the ancestor chain, and to keep
  comma'd figures on the grotesk. Found by rendering, not by review — the markup looks correct
  either way. (Direction 52 had already anticipated this in a code comment; the house rule had not.)

### Research

- **Two sweeps of the Framer ecosystem, distilled into a prototype brief**
  (`output/sessions/2026-08/2026-08-20_framer-gallery-research/prototype-brief.md`). Round one
  covered the community gallery (~450 tiles skimmed, 78 sites opened) and answered "the components
  weren't elevated"; round two covered all 159 agency marketplace templates (85 demos opened) and
  answered "engaging yet functional animation". The brief carries a motion policy, a component
  vocabulary, mobile rules and three paste-ready direction briefs.
- **The dominant defect in that whole design world is content held at `opacity: 0` until an
  IntersectionObserver fires.** Nine of twenty-seven demos in one batch showed a blank screen on
  arrival; paid templates at $49–$129 render nothing at all. It is a content-visibility bug, not a
  layout bug, and it degrades worst on slow connections and small screens — so it is a plausible
  contributor to the "dreadful mobile" complaint against the earlier DCS prototypes. The house
  acceptance test that came out of it: **screenshot the page with JavaScript disabled; if that is
  not a complete document, the build is wrong.**
- **Animated count-ups are ruled out for DCS**, not merely handled carefully. Twelve were caught
  mid-flight publishing false figures (`0+ years of experience`, `Awards 0`, one frozen permanently
  at `01+ projects delivered`). Every figure is authored static text from here on.

### Sites

- **DCS gains twelve research-led homepage prototypes** (`home-57` … `home-68`) in
  `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/`, built to
  `build-spec-round7.md` and registered in that folder's `index.html`. Twelve deliberately divergent
  directions — spec sheet, poster, quiet, trade blocks, editorial masthead, workbench, index rail,
  Swiss grid, warm local, chamfer, dock, selector — each shaped by a different design skill so they
  diverge by construction. The binding constraint this round was that **no section may be text and
  colour alone**: every section carries an abstract div-built UI mock, an inline SVG diagram, a
  hatched wireframe placeholder or a duotone photo plate. `home-64` is the only one using real R2
  photography; the other eleven are self-contained and work offline.

---

## 2026-08-19

### Documentation

- **`.svg` in a session folder is gitignored, and the guide now says so.** `output/.gitignore`'s
  August 2026 binary deny-list includes `sessions/**/*.svg`. SVG is a text format, so it does not
  read as part of an image rule — a vector written under `output/sessions/**/` is silently absent
  from a commit that looks like it included it, with `git status` saying nothing either way. Hit
  while building the DCS mark. Correct behaviour for prototype artwork, which belongs on R2, but
  brand assets should go in the site's tracked `public/` instead. Recorded in
  [docs/guides/prototype-hosting.md](docs/guides/prototype-hosting.md) with
  `git check-ignore -v` as the way to confirm.

### Sites

- **DCS gains a real vector logo and a new favicon** (`sites/dcs/public/dcs-mark.svg`,
  `favicon.svg`). Every prior logo file was a 530×254 raster PNG inside an SVG wrapper — including
  the black and white variants, which are pixel-identical in shape to the colour original and so
  added no resolution. The mark draws in `currentColor`, so one file covers black on light grounds
  and white knocked out of dark or colour grounds. The favicon uses the D alone, clipped from the
  real monogram: all three letters turn to mush at 16px. The previous Arial-text favicon is parked
  as `favicon-old.svg`. `sites/dcs/app/layout.tsx` still points `logoSrc` at the old raster
  `/logo.svg` — the new mark is not wired in yet, pending the homepage rebuild.

---

## 2026-08-18

### Infrastructure

- **Prototype assets now live in Cloudflare R2, and prototypes deploy to a URL.** Design sessions were accumulating serious weight in git: `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/` held 142MB, 117MB of it 2048px PNG masters that nothing referenced. All 67 assets (14.2MB live + 116.9MB masters) moved to `prototypes/<session-slug>/…` in the existing bucket, the 54 prototypes' 311 asset references were rewritten to absolute R2 URLs, and the folder dropped to 19MB. The prototypes now deploy as a static Vercel project — https://dcs-prototypes.vercel.app — so they can be reviewed on a phone or sent to a client instead of only opening from a `file://` path on the machine that built them. Trade-off accepted deliberately: prototypes now require an internet connection to render.
- **Root cause fixed, not just the symptom.** The root `.gitignore` has excluded images since it was written (_"These go to Cloudflare R2, not Git"_), but `output/.gitignore`'s `!sessions/**` line un-ignored everything beneath `output/sessions/`, binaries included — verified with `git check-ignore --no-index -v`. That is why 78 image files became stageable without anyone forcing them, and it had been true for every session folder, not just this one. `**/*.mp4`, `**/*.mov`, `**/*.webm` and `**/*.svg` were never in the root list at all. `output/.gitignore` now carries an explicit binary deny-list below the allow rules.
- Two new tools: `tools/upload-prototype-assets.ts` (upload, verify, rewrite, manifest) and `tools/publish-prototype.ts` (pre-flight, static Vercel deploy). `R2Client` gained an additive `headFile()` so callers can skip re-uploading unchanged objects — `fileExists()` only answers presence, not whether the bytes match. New guide: [docs/guides/prototype-hosting.md](docs/guides/prototype-hosting.md).
- Three traps found while building this, all encoded in the tools and the guide: `R2Client`'s default `immutable, 1 year` Cache-Control is wrong for assets that get regenerated (overwriting a key does not bust the CDN cache), so live prototype assets get `max-age=300` and only `_archive/` keeps the long TTL; `R2Client.getContentType()` has no video entry, so content types are mapped explicitly and fail loudly on an unknown extension; and the Vercel CLI resolves `vercel.json` against the process working directory, so running it from the repo root pulled in the monorepo's root config and the first deploy served the root placeholder page instead of the prototypes.

- **Regression Watchdog no longer runs on commits that cannot change a deployed site.** Its trigger previously ignored `output/**`, `docs/**` and `**/*.md`, so a docs-and-prototypes commit still ran a full cross-site smoke suite because it touched `tools/*.ts`. Now expressed as a `paths` filter rather than `paths-ignore`: GitHub supports `!` negation only in `paths` and forbids using both filters for the same event, and one re-inclusion is essential — `tools/watchdog/**` _is_ the watchdog (`gate.ts` decides its pass/fail), so a blanket `tools/**` exclusion would have stopped the watchdog running on changes to its own gating logic. That is the same class of self-blinding that left it a silent no-op from April to July 2026. Filter verified against 17 representative paths before merge.
- `output/sessions/.DS_Store` was tracked in git despite `.DS_Store` being in the root `.gitignore` since forever — a gitignore rule cannot untrack an already-tracked file, so it resurfaced as a dirty working tree on every branch switch. Removed from the index with `git rm --cached`; it is now covered by both the root rule and `output/.gitignore`'s new `sessions/**/.DS_Store`.

### Documentation

- Two new CSS gotchas documented in root `CLAUDE.md` (CSS Syntax section), both surfaced repeatedly while building the DCS homepage design prototypes and both invisible in markup:
  - The existing `backdrop-filter` containing-block rule already noted `transform` in passing; the trap bites **independently** and catches floating navs in particular. A centred floating nav built with `transform: translateX(-50%)` establishes a containing block with no `backdrop-filter` present at all, so a nav carrying both has two separate triggers and fixing only the blur leaves the overlay trapped. Centre with `left`/`right`/`margin-inline` instead. Verified by measurement: a `position:fixed` probe nested inside such a nav reports the nav's own box (277×58) where a correct sibling overlay reports the viewport (390×844).
  - `font-variant-numeric: tabular-nums` on a figure containing a thousands comma gives the comma a full digit advance, rendering **`£1,995` as `£1 , 995`**. It corrupts a price, is invisible in source, and only shows on screen. It inherits, so an ancestor carrying the property breaks a figure that looks clean itself — resolve it up the ancestor chain when checking, and scope `tnum` to comma-free numerals rather than setting it on `body`. Hit independently in six prototypes across two typefaces (Schibsted Grotesk, Newsreader).

### Design

- `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/` — 54 static HTML homepage prototypes for the DCS site redesign, across five brief iterations, with `prototype/index.html` as a live-iframe library. Design exploration only: nothing in `sites/dcs` was touched and no platform or site code changed. The brief evolved twice on client feedback (positioning broadened from trades-only to all small businesses; register moved from under-construction to elevated design studio), leaving six directions off-brief and retained as record only. `HANDOFF.md` in that folder carries the traps and next steps.

## 2026-08-04

### Fixes

- Documented a new CSS gotcha in root `CLAUDE.md` (CSS Syntax section): a `fixed inset-0` mobile-nav dialog nested inside a header with `backdrop-blur-*` gets confined to that header's own box instead of the viewport, because `backdrop-filter` establishes a containing block for `position: fixed` descendants (same as `transform`). Found via `npracing-v1`'s mobile burger menu, which rendered correctly on an actual phone but broke in a resized desktop browser — fixed by portaling the dialog to `document.body` via `createPortal` (`sites/npracing-v1/components/site-nav-mobile.tsx`).
- Every site's `next.config.ts` had a CSP `script-src` with `unsafe-eval` dropped in all environments ("not needed, security risk" per `docs/standards/security.md`). That's true in production, but `next dev`'s webpack HMR/React Refresh runtime evaluates code as strings and needs it — without it, the runtime throws an `EvalError` on load that silently breaks all client-side interactivity (every button, every form) in `next dev`, while the page still renders and looks correct. `dj-fox-electrical` already had the fix (gate `unsafe-eval` behind `process.env.NODE_ENV === 'development'`); applied the same pattern to the other 8 sites (`npracing-v1`, `dch-automotive`, `base-template`, `mad-graphics`, `npracing-v3`, `colossus-scaffolding`, `dcs`, `showcase`) and corrected `docs/standards/security.md` and root `CLAUDE.md`'s Build & CI notes to match.

### Infrastructure

- `RESEND_FROM_EMAIL` added to `turbo.json`'s `build.env` array, matching the platform's own rule that every env var affecting build output must be listed there (missing entries cause stale cache hits). Discovered while wiring up `npracing-v1`'s contact form: the var was already read by `createContactHandler` (`packages/core-components/src/lib/api/contact-route.ts`), but never listed in `turbo.json`, and never set for that site — sending fell back to Resend's sandbox domain (`noreply@resend.dev`), which silently restricts delivery to the Resend account's own email regardless of the configured recipient, even when the site's own sending domain is separately verified in Resend. Same gap likely affects other sites that never set this var (confirmed also missing for `dj-fox-electrical`).
- `docs/guides/adding-new-site.md`, `docs/guides/end-to-end-workflow.md`, and `docs/standards/security.md` corrected to require `RESEND_FROM_EMAIL` in the required-env-vars checklist and drop `BUSINESS_EMAIL`, which is not read anywhere in the codebase (the contact form's destination address comes from `site.config.ts`'s `business.email` field, not an env var) — both docs had listed the unused var and omitted the required one.

---

## 2026-08-03

### Sites

- `npracing-v1` and `npracing-v3` each gained a dedicated `/team` page — a photo grid of all 10 crew members (name + role, sourced from the team's own photo gallery and two directly-supplied portraits) replacing the previous "just a homepage section" teaser. Implemented independently in both sites per the self-containment rule: a new `team` MDX content type (`content/team/*.mdx`, `lib/schemas/team.ts`, a self-contained loader mirroring the existing `merch` pattern) and a `TeamPage` component styled to each site's own design language. Both sites' nav and homepage/about CTAs now link to the new page instead of (or alongside) the old in-page anchor.
- One team member's supplied photo was a Canon `.cr2` RAW file with no usable web format — converted to JPEG and orientation-corrected with macOS `sips` rather than asking for a re-export, since the RAW data already contained everything needed.
- Fixed two accidental duplicate images in `npracing-v1`'s homepage gallery (both images had been used twice in the same grid): one paddock-team photo slot now shows a different team photo, and the duplicated on-track cornering shot was swapped for an already-hosted race-report photo instead of the repeated one.
- `npracing-v1` and `npracing-v3`'s homepage "merch" CTA band was redesigned: the cap product photo is now a genuine product shot (cropped tight to its own bounding box instead of the source photo's mostly-empty square frame, composited onto the red band via `mix-blend-multiply` so its white background drops out), shown before the heading on mobile since it's the actual subject of the CTA, and vertically centred on the right side of the band on desktop — inset from the edges rather than bleeding into the corner, which had been clipping the crown and brim against the card's rounded corners. It also straightens and grows on hover as a deliberately obvious sign of life (skipped under `prefers-reduced-motion`). Both sites also gained a favicon — the joined "NP" cropped from the team's oval logo mark, since the full mark's fine detail (the ring, "RACING", the bike silhouette) doesn't survive down to 16–32px. Committing `app/icon.png` / `app/apple-icon.png` directly (rather than routing through R2) required a new `.gitignore` exception, since the platform's blanket "images go to R2" rule doesn't have one for the Next.js file-based favicon convention — see [docs/standards/images.md](docs/standards/images.md#core-principles) for the documented exceptions list.
- `npracing-v1` and `npracing-v3` gained a homepage sponsor strip, positioned above the gallery section: a single auto-scrolling marquee of partner logos (Berkshire Cycles, GBRacing, HEL Performance, Emerson Cranes, Lowe Rental, GPS Photography, The Clothing Kings), each linking out to the sponsor's own site or social page. Every logo was sourced from the sponsor's own site (or Instagram profile picture for GPS Photography, which has no separate site) and recoloured to solid white-on-transparent regardless of its original brand colours, so the strip reads as one calm monochrome row rather than mismatched coloured logos on white cards — the first version used per-logo white cards on a grid, which didn't match the intended "quiet department-store brand strip" feel. Both sites now reuse (v1) or newly define (v3) a `.marquee`/`.marquee-track` CSS pattern — track rendered twice for a seamless `translateX(-50%)` loop, animation gated behind `@media (prefers-reduced-motion: no-preference)`, and paused on hover/focus so the real links inside it are actually clickable (also satisfies WCAG 2.2.2 for auto-moving content).
- Matt's team bio updated on both sites: role changed from "Mechanic" to "No. 1 Mechanic", plus a job description. Required adding an optional `description` field to the `team` content schema (`lib/schemas/team.ts`) and rendering it conditionally in both `TeamPage` components — most crew still only have a role on file.

---

## 2026-08-02

### Sites

- Privacy Policy and Cookie Policy pages across `base-template` and every site scaffolded from it (`dch-automotive`, `mad-graphics`, `dcs`, `colossus-scaffolding`, `npracing-v1`, `npracing-v3`) replaced their rainbow blue/green/purple/amber/red/yellow legal-basis callout boxes — each carrying an `eslint-disable platform/no-hardcoded-tailwind-colors` escape hatch — with the site's own brand palette (`bg-surface-subtle` / `border-brand-primary`). The pattern originated in `base-template` and was copied into every derived site verbatim, so fixing the template stops new sites from inheriting it. Genuinely semantic non-brand colors (form error-state tints, real third-party accreditation-badge branding) were left as-is — they aren't the same issue.

---

## 2026-07-12

### Infrastructure

- Fixed the Regression Watchdog GitHub Action (`.github/workflows/watchdog.yml`) silently never triaging failures since its April 2026 launch: the smoke-test step piped `npx playwright test` through `tee` without `pipefail`, so the shell's exit code always reflected `tee` (success) rather than Playwright, and `smoke_failed` was never set — every prod/staging push showed the smoke step as green and skipped auto-triage even when tests failed. Added `set -o pipefail` to the step.
- Fixed `packages/playwright-shared/sites.json`'s prod smoke targets, which the pipefail bug above had been masking: colossus pointed at `colossusscaffolding.com`, an unrelated `.com` domain with no DNS records configured (not colossus-scaffolding's real domain, `colossus-scaffolding.co.uk`), so all 10 colossus smoke checks failed on `ERR_NAME_NOT_RESOLVED` on every run; and a `dcs` entry targeted `digitalconsultingservices.co.uk`, which is not an LBP platform site at all but the platform owner's own WordPress consultancy site, and was removed.
- Fixed a second, deeper cause of the same silent-failure problem, found while verifying the pipefail fix live on staging: the smoke-test step's `--reporter=json,github` CLI flag overrides `smoke.config.ts`'s reporter array wholesale (including its `outputFile` option), so the JSON reporter fell back to writing to stdout instead of a file. The next step's `cp packages/playwright-shared/smoke-results.json /tmp/smoke-results.json` then silently failed and fell back to a hardcoded `{"stats":{"ok":true},"suites":[]}` stub, which is what the triage script actually read — so even with `smoke_failed` now correctly set, triage logged "All smoke tests passed" on a real 10-failure run. Fixed by setting `PLAYWRIGHT_JSON_OUTPUT_FILE` explicitly so the JSON reporter writes to the real path regardless of the CLI reporter override.
- Fixed a third, still deeper bug found once the JSON was finally being read correctly: `tools/watchdog/lib/types.ts` and `index.ts`'s `collectFailures()` assumed the wrong Playwright JSON schema (`suite.tests[].status` directly), when the real shape nests a `specs[]` layer with the per-attempt outcome under `spec.tests[].results[]` and the aggregate outcome under `spec.tests[].status` ("expected"/"unexpected"/"flaky"/"skipped"). The parser always walked past real failures silently. Rewrote the walk to match the actual schema and verified against a captured artifact — triage now correctly identifies and diagnoses all 9 failures via Claude instead of reporting "0 failure(s) to triage." Also removed a dead `report.stats?.ok` early-return in `index.ts`'s `main()`: real Playwright JSON never sets a `stats.ok` field (only the workflow's hardcoded fallback stub did), so this check was a no-op against real data and `collectFailures()` already handles the genuine zero-failures case correctly on its own.
- Fixed `packages/playwright-shared/sites.json`'s staging colossus target too, once triage was verified actually working: `colossus-scaffolding.vercel.app` is a dead Vercel alias (`DEPLOYMENT_NOT_FOUND`). Repointed at `local-business-platform-colossus-reference.vercel.app`, a stable alias on the same Vercel project that's publicly reachable (the project's other stable aliases sit behind Vercel SSO and would 401/redirect-to-login in CI).

---

## 2026-07-11

### Sites

- `sites/dch-automotive`'s Car Remaps feature rebuilt around DCH-owned data: the embedded Viezu iframe is replaced by an interactive ready reckoner, ~144 crawlable per-make AEO pages with `Product`/`Service` JSON-LD, a progressive public JSON API, and an MCP endpoint (`lookup_vehicle_tuning` tool) — all reading through one shared repository. See `sites/dch-automotive/CHANGELOG.md` and `sites/dch-automotive/docs/car-remaps-runbook.md` for the full build and its scope-matching mechanism (Viezu's own live AJAX vehicle-finder cascade, not WooCommerce categories, which were tried and found unreliable).
- `sites/dch-automotive`'s Savings Calculator made vehicle-aware and gained a live UK fuel price source. First platform site to fetch third-party open data live at request time (Next.js `fetch()` with a 7-day `revalidate`, no cron or committed-JSON pipeline involved) rather than via the usual sync-and-commit pattern — see `sites/dch-automotive/CHANGELOG.md` for details.
- `sites/dch-automotive`'s Car Remaps scope extended from cars/vans to cars/vans/HGV (61 new lorry/truck makes) to back the Savings Calculator's van/lorry use case. Surfaced and fixed two real bugs in the sync pipeline along the way — a marque-matching fallback that could misattribute products across an unrelated marque sharing a leading word, and a complete absence of request timeouts that let a single unresponsive page hang the entire live sync — both now covered by tests/timeouts. See `sites/dch-automotive/docs/car-remaps-runbook.md` §5.

---

## 2026-07-09

### Sites

- `sites/dch-automotive` built out and prepared for its first Vercel deployment: dark/orange self-contained theme, bespoke `ContactForm`, real Car Remaps catalogue with embedded Viezu dealer widget, real Eastbourne/Polegate/Hailsham location content, and a site-specific `vercel.json` pointing the Turborepo build filter at the site
- `.env.example` for `dch-automotive` documents which variables are shared across LBP sites (NewRelic license key, Supabase URL, Resend API key) versus which must be unique per site (`CSRF_SECRET`); initial deploy targets the Vercel-assigned URL rather than the live `dchautomotive.co.uk` domain, pending domain cutover
- Known gaps carried into this deploy (tracked in `tasks/clients/dch-automotive.md`): `/reviews` still serves generic base-template placeholder testimonials, flagged for a follow-up content pass before the real domain is cut over
- Post-launch fixes on `dch-automotive`: `-webkit-autofill` override so browser-autofilled contact form fields keep their white text legible against the dark theme; real hero imagery added to all three location pages (previously showing a placeholder icon); dead `<button>` elements on the homepage and Car Remaps hero wired to real destinations (`/services`, `/contact`, and an in-page anchor to the fleet enquiry form); homepage hero heading/subtext/buttons resized down from an oversized all-caps treatment
- `sites/dch-automotive/CLAUDE.md` rewritten — was still the verbatim `base-template` guide since the site was scaffolded, describing components/routes/schemas that don't match this site's bespoke homepage/Car Remaps pages and dark theme
- All `dch-automotive` images migrated to Cloudflare R2 (shared platform bucket, `dch-automotive/` key prefix) via new `tools/upload-dch-automotive-to-r2.ts`, matching the platform's `docs/standards/images.md` rule; `public/stitch-images/`, `public/viezu/`, `public/logo/` removed from the repo, all render call sites now resolve via `getImageUrl()`
- `/car-remaps` expanded with substantive educational content: a "What Is ECU Remapping?" explainer, a benefits section (fuel economy, throttle response, towing torque, gearbox smoothness), and a 12-question FAQ (legality, insurance, warranty, reversibility, Stage 1-3 differences, emissions/MOT compliance) with `FAQPage` JSON-LD

### Architecture

- Fixed a pre-existing bug in `@platform/core-components`'s shared `Schema` component: the `FAQPage`/`BreadcrumbList` JSON-LD `@id` fields double-prefixed the site URL whenever `webpage.url` (conventionally passed already-absolute) was used to build them, producing malformed `@id`s like `https://site.com/https://site.com/page#faq`. Affected every page across the platform combining `webpage` + `faqs`/`breadcrumbs` props, not just `dch-automotive` — found while adding the Car Remaps FAQ schema above
- Content-accuracy pass: removed lingering **Tow Bars** and **Alarms** references (homepage credential badges, `site.config.ts` certifications list, and all three location pages' hero copy/FAQs/service lists) — both services were confirmed deleted during the WordPress migration (see `tasks/clients/dch-automotive.md`) but survived into location-page copy; trade-certification count corrected from 7 to 6 to match

---

## 2026-02-08

### Architecture

- Completed content-schemas deduplication — deleted site-specific copies, all sites now import from `@platform/core-components`
- Unified `LocationFrontmatterSchema` — resolved structural divergence between colossus and base-template/smiths hero fields
- Fixed location MDX frontmatter to use canonical field names (`title`/`description` instead of `heading`/`subheading`)

---

## 2026-02-07

### Architecture

- Moved location data (coordinates, region, isCounty) into MDX frontmatter — deleted hardcoded TS data files
- Migrated `brand-blue` to `brand-primary` theme tokens across all shared components
- Added `useFocusTrap` hook to `@platform/core-components` for mobile-menu and ConsentManager

### Platform

- Centralised Supabase rate limiter in `@platform/core-components` — replaces per-site stub implementations
- CSRF hardening: timing-safe comparison, single-use tokens
- Input validation: length limits on all API fields
- Accessibility: `lang="en-GB"`, skip navigation, SVG `aria-hidden`, proper page titles

### Infrastructure

- Security headers: `font-src` in CSP, HSTS, CORP, Permissions-Policy
- API info disclosure fixes — error responses no longer leak internals

### Documentation

- Rewrote all docs from reference lists to instructional teaching approach
- Added four "How It Works" architecture docs: dynamic routing, theme system, build pipeline, site creation
- Restructured CLAUDE.md as architectural briefing

---

## 2026-01-27

### Platform

- Site registry system with Supabase backend (7-table schema)
- Management CLI (`tools/manage-sites.ts`): list, show, sync, set-status commands
- Registry API client with Vercel and NewRelic integration

---

## 2026-01-25

### Platform

- Blog system: MDX-based with RSS feed, categories, Schema.org BlogPosting
- Projects portfolio: case studies with image galleries and client testimonials
- Testimonials and reviews system with aggregate ratings and Schema.org Review markup

### Packages

- `@platform/core-components`: extended content.ts with blog, projects, testimonials helpers
- Added 3 new Zod content schemas (BlogFrontmatter, ProjectFrontmatter, TestimonialFrontmatter)

---

## 2025-12-21

### Platform

- Theme system: `@platform/theme-system` package with CSS variable generation, Tailwind plugin, WCAG validation
- Base template (`sites/base-template`): gold-standard copy-and-customize template for new sites
- Migrated 32+ UI components from hardcoded colours to CSS variables

### Infrastructure

- Next.js 16.0.7 upgrade with Turbopack as default bundler
- Modern ESLint 9 flat config across all sites and packages

---

## 2025-12-07

### Tooling

- AI image generation pipeline: Gemini 3 Pro for card images, batch API, R2 CDN upload
- Service and location page generators (Claude + Gemini providers)
- Content quality validators: readability, SEO, uniqueness scoring

### Platform

- Dynamic location discovery — filesystem-based slug detection replaces hardcoded patterns

### Infrastructure

- Security audit remediation: HTML escaping, secure IP extraction, CSP hardening, HSTS
- React 19.1.2 (CVE-2025-55182 patch)

---

## 2025-10-10

### Infrastructure

- Tiered E2E testing: smoke-only on develop, full suite on staging/main
- Performance tracking with historical trend analysis and degradation alerts
- CI pipeline consolidation: 3 jobs to 1, saving 4-6 minutes per run
