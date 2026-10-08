# Platform Changelog

Notable platform-level changes to the Local Business Platform. Site-specific changes are tracked in each site's own CHANGELOG.md. Package-level changes are tracked via changesets in each package directory.

> For the full project development history (2025-10 through 2026-01), see [docs/project-history.md](docs/project-history.md).

---

## 2026-10-08

### Packages

- **Contact forms now stop bots at the handler, with nothing asked of clients.** A wave of
  machine-generated submissions hit Colossus Scaffolding (26 in three days, all random-letter
  name/subject with a ten-digit number as the message; each also fired a confirmation email to a
  random third-party address, so the site's sending domain was being used as a relay). The
  grammar-based spam scorer scores that kind of junk at zero, so tagging was never going to help.
  Two layers now run in `createContactHandler` (`lib/api/turnstile.ts`): a message containing no
  letters is answered with a normal success but sends nothing (no notification, no confirmation),
  on every site, no keys needed; and Cloudflare Turnstile verification, enforced only on a site
  whose `TURNSTILE_SECRET_KEY` is set. Verification fails open only when Cloudflare is unreachable
  or the secret itself is invalid. The shared `ContactForm` and the four custom forms (dcs,
  dch-automotive, delta-t-racing-cc, npracing-v1) render the widget when
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set; the shared form also now renders the `website` honeypot
  field the server was already checking. Every form site's CSP allows
  `https://challenges.cloudflare.com`. **Operator note:** enable per site by setting both env vars
  together in Production and redeploying; a secret on a site whose form lacks the widget rejects
  real enquiries. See `docs/standards/security.md`.

---

## 2026-09-30

### Packages

- **Contact-form submissions can now be scored and tagged as likely spam, per site and opt-in.**
  New `packages/core-components/src/lib/api/spam-score.ts`; `createContactHandler` takes an
  optional `spamTagging` and, when present, prefixes the business notification's subject with
  `[SPAM?]` and appends a short note naming the signals that fired. It never blocks: the message
  is delivered in full, keeps its `reply_to`, and the sender still receives a confirmation. That
  asymmetry is deliberate — a false positive on a lead-generation form costs a real enquiry, a
  missed spam costs five seconds — and it is what lets the term list be aggressive. Sites that do
  not pass `spamTagging` are byte-for-byte unaffected, which is asserted directly rather than
  assumed (`contact-route-spam-optin.test.ts`).

  The rules score **grammar, not topic**. Banning "SEO" or "web design" breaks on any site that
  sells them and needs a different list per site, which does not scale; what actually separates
  the two populations is direction — a customer asks, a spammer offers. So the baseline targets
  inbound-sales phrasing ("I would like to send you a proposal", "our placements include") plus
  outreach-trade jargon, sender local-part tells, links in the body, and non-UK dialling prefixes,
  scored additively across capped groups against a threshold of 5. Layering is baseline → preset
  keyed on the `businessType` each site already declares for schema.org → per-site delta, so a
  site needing no tuning configures nothing.

  Calibrated against a corpus of eight labelled submissions, seven of them real traffic recovered
  from Resend and anonymised. Two findings from it reshaped the rules: a genuine enquiry opened
  "I hope you're well" and offered to "send over some marked up photos", which a naive opener or
  "happy to send" rule would flag; and the two real spam samples shared almost no vocabulary, one
  carrying no link-building jargon at all. Current margins are 17 and 8 for spam against a
  threshold of 5, with every genuine enquiry at 0 or 1.

### Sites

- **DCS opts in to spam tagging; no client site does.** Client owners run their own mail filtering
  and read their own inbox, so tagging on their behalf would alter mail nobody asked us to touch.
  DCS uses the `ProfessionalService` preset, which exempts the SEO vocabulary from scoring because
  DCS sells those services — a customer writing "we'd like more organic traffic" is describing
  what they want to buy, where on a trades site the same words are a pitch. The offer-grammar
  signals stay active regardless.

---

## 2026-09-29

### Packages

- **Contact-form emails set a `Reply-To` header for the first time.** `sendContactEmail()` posts to
  the Resend REST API with raw `fetch`, and had been sending the SDK's camelCase `replyTo`. The REST
  endpoint documents `reply_to` and drops keys it does not recognise — without a 400, and still
  returning `200 OK` with a message id — so nothing anywhere indicated a problem. The practical
  effect on every site using the factory: replying to an enquiry notification addressed the `from`
  address (`RESEND_FROM_EMAIL`, an unattended noreply mailbox) rather than the person who filled in
  the form, and the reply had to be re-addressed by hand every time. Both emails now set it
  explicitly — the business notification replies to the enquirer, and the customer confirmation
  replies to the site's `BUSINESS_EMAIL`, which previously had no reply path at all. The
  confirmation's footnote said "Please do not reply directly to this message"; that contradicted
  the header it now carries, so it reads "This confirmation was sent automatically, but replying to
  it will reach us." That copy is shared by all ten sites.

### Sites

- **DCS: enquiry emails are branded in the r9 palette instead of the retired solaris teal.** The
  email template can't read the site's CSS custom properties, so it interpolates literal hex from a
  `themeColors` object that each site's own `app/api/contact/route.ts` supplies. DCS was supplying
  `themeConfig.colors.brand.*`, which still holds the pre-r9 solaris colours kept for the fourteen
  inner routes that haven't been reskinned — so every notification and confirmation went out in
  `#61A3BA` teal. It now reads the r9 `colors.custom` group: magenta `#D6006B` for headings and the
  rule, ink `#0E0E12` for subheads, paper `#ECEBE9` for the message panel, grey `#70707B` for the
  footnote. Only the colours changed; the template itself is shared and still generic (Arial, no
  logo). `sites/dcs/test/contact-email-branding.test.ts` drives the real route handler with a real
  CSRF token, stubs only `https://api.resend.com/emails`, and asserts the exact outbound payload —
  both `reply_to` fields and the palette — because every failure in this area is silent.

---

## 2026-09-27

### Sites

- **DCS: the contact page's confirmation panel now anchors below the header, and its opening hours
  describe the real arrangement.** On a successful submission the form is swapped for the `#done`
  panel, but the viewport was never moved — so the page kept the scroll position the visitor had
  when they pressed Send, which is the bottom of a long form, and the panel rendered with its
  "Thanks, …" heading above the fold. The part that confirms the message actually sent was the
  part being cropped. An effect keyed on `submitted` now scrolls it to just below the header,
  measuring `.bar`'s height at run time (it is `position: fixed`, so it overlays the document
  rather than occupying space, and its height changes with the breakpoint) and moving focus to the
  panel with `preventScroll: true` so a screen reader lands on the confirmation without fighting
  the positioning. Separately, the page published "Mon–Fri, 9:00–17:30" and "Saturday by
  appointment / Sunday closed", and `site.config.ts` published the same as LocalBusiness
  `openingHours`. Neither was true of a one-person business keeping irregular hours — the window
  was both inaccurate and narrower than reality. The page now says "Any day of the week", spells
  out that nobody is expected to answer an out-of-hours email outside their own working day, and
  the schema hours are removed rather than replaced with an invented window, so no page emits
  `openingHoursSpecification` at all.

- **DCS: corrected four published claims that contradicted the actual commercial terms.** Two sat
  in `/services/monthly-management`'s FAQ and two in the ongoing-management blog post, and all
  four also emit as FAQPage/article content rather than page text alone — the FAQ pair ships as
  JSON-LD, so they were being published as structured data to Google. "Do I own my domain?"
  answered "Yes. Your domain is registered in your name... I don't hold your domain hostage";
  domains are registered in DCS's name. The answer now leads with that, gives the reason (domain,
  DNS, email and SSL in one account, so nothing stalls waiting on a registrar login nobody can
  find) and states what is true — it transfers into the client's name on request, and transfers
  with them if they move their site. "What happens if I want to cancel?" claimed "There are no
  lock-in contracts", and the blog post had a "No lock-in" section plus an excerpt promising "no
  lock-in if you want out"; pay monthly runs a 24-month initial period then 30 days' notice, while
  upfront has no ongoing commitment beyond hosting. Both now say so and explain why the initial
  period exists. `/pricing` was already accurate throughout, which is what made the contradictions
  findable.

- **DCS: fixed two stale portfolio claims.** Bexhill Removals has closed and its site is offline,
  but the case study was present tense and claimed a live competitive presence; it now states the
  closure in its opening and reads as a record of the work. Cuddle Plush Fabrics was understated
  by seven years — a client since 2014, not five — across six places (case study description,
  outcome and body, card subtitle and meta line, the /projects masthead stat, and the About page
  stat and section label). All are anchored to "Since 2014" rather than a running total, for the
  same reason project counts derive from content: a year stays true unmaintained, and "5+ years"
  had already drifted seven years. The client's own testimonial is left verbatim — "over 5 years"
  was true when she said it — with a comment recording why the two numbers differ.

- **DCS: withdrew the Mad Graphics case study and corrected two project clips that showed the
  wrong trade.** The Mad Graphics write-up is being rewritten, so its content file, card copy,
  sector entry and video mapping are removed and `/projects/mad-graphics` 301s to `/projects`
  rather than 404ing — the MDX is recoverable from git, and the redirect has to come out again
  when the rewrite lands. It was the only project in "Creative & B2B", so that filter is empty
  meanwhile and the masthead now reads "Eleven builds across four sectors". Separately, two of the
  AI clips added by `3eb61882` depicted work their clients don't do: Luna Landings sells cloth
  products but the clip showed leather being stitched on an antique machine, and DCH Automotive
  fit vehicle security systems (dashcams and the like) but the clip showed an engine bay — with
  card `note` and `alt` text asserting the same thing in words. Both are regenerated (plain cotton
  on a modern machine; a dashcam being fitted to a windscreen) with the copy corrected to match.
  They were uploaded under new `-v2` keys rather than overwriting: R2 serves these with a one-year
  immutable cache, so replacing a key in place would never have reached anyone who had already
  loaded the page. Posters for the two are taken mid-clip rather than from the 4th frame, since
  `preload="none"` means the poster is all a visitor sees unless they hover.

- **DCS: removed fabricated portfolio content and replaced it with real work.** Two `/projects`
  case studies were invented — "Eastbourne Plumber" and "Brighton Decorator" — as were all three
  testimonials (Sarah T., Mark H., Dave C.), created by `cc678c1b` "from site config data" while
  three _real_ client quotes sat unrendered in `site.config.ts` beside them. All five are gone,
  with 301s from the two live case-study URLs to `/projects` so the removal doesn't publish
  404s, and the blog passage that retold the invented plumber rebuild as a real client (with its
  invented £80→£25, 3.2s→0.8s and page-one-ranking figures) is rewritten as the principle it was
  illustrating. The three real quotes are now content files, and a new Pippy's case study covers
  a period underwear brand rebranded in 2025 around a written art direction and tone of voice.
  Project-card media gained a still-image variant for it (`ProjectMedia` is now a union
  discriminated on `'video' in media`), using the client's own homepage hero cropped twice —
  16:10 for the card well, 2:1 for the case-study masthead, which centre-crops a 16:10 still into
  a decapitation. Counts across the site now derive from real content rather than literals, and
  the tests that were pinned to specific names and hard-coded counts derive from live content
  too, which also repairs the three left failing by `3eb61882`.

- **DCS: filled the eight "Awaiting footage" project cards with AI-generated sector b-roll.**
  Those eight cards previously carried no `media` entry at all, which the r9 port had documented
  as a deliberate honesty mechanism rather than a gap. At the user's explicit direction that
  decision was overridden and the placeholders were filled with generic sector clips (Higgsfield
  `seedance_2_0_mini`, matching the three real clips' 1280x720/~5s profile), uploaded to R2 by
  `tools/upload-dcs-project-videos-to-r2.ts` with provenance recorded in
  `sites/dcs/lib/project-video-assets.ts`. The `note` line on every card still reads "Sector
  footage — not a capture of the website", which remains true of both the stock and generated
  clips. The `.slot` placeholder logic stays in place for any future project added without media.

- **DCS: fixed the `.prose` rendering collision across all 67 long-form pages, and redesigned the
  Google Workspace tier section.** Reported as "strange bullet points and cheap underlined pink
  headings" on `/services/google-workspace`; the page design was fine, the body was rendering
  through two stylesheets at once. Three independent causes, all silent. (1) `/services/[slug]` and
  `/locations/[slug]` were the last two routes still using the shared `loadMdx()` factory, whose
  Tailwind/solaris component map renders every `<li>` as a `bg-surface-subtle` pill with its own dot
  `<div>` — stacking with `inner-pages.css` §31's own square bullet for three bullets per item — and,
  combined with `rehype-autolink-headings` `behavior:"wrap"`, rendered every `<h2>` as a magenta
  underlined link carrying `target="_blank"` on a same-page fragment. Both routes now have bare-tag
  renderers (`components/services/service-prose.tsx`, `components/locations/location-prose.tsx`),
  matching what the r9 port already did for `/blog` and `/projects` and never finished for these
  two. (2) `@tailwindcss/typography` emits a `.prose` class of the same name the ported kit
  hand-authors, and won every property the kit leaves to its own reset — grey body copy on an ink
  ground, stray block margins, a doubled list indent on the legal pages, and a 65ch cap that had
  been shrinking `/blog/[slug]` and the legal body inside their own 74ch columns. The plugin is
  unused on DCS (no `prose-*` utility anywhere, and DCS renders none of the shared components that
  use them — it was only emitted because the `content` glob scans `packages/core-components`), so it
  is removed from `sites/dcs/tailwind.config.ts` rather than overridden: 19.7KB less CSS, and
  `test/tailwind-typography-absent.test.ts` now guards it. Every other site keeps the plugin and
  genuinely uses it. (3) The "Three Tiers" section was three bold pseudo-headings over bullet lists
  whose last bullet was an editorial verdict rather than a feature; it is now a designed tier band
  (`styles/service-tiers.css`, `components/services/service-tiers.tsx`) reusing the kit's existing
  `.tier`/`.tcard` idiom, with the verdict given its own slot. Prices and facts are unchanged; the
  "most popular" style badge was written as "Start here" instead, since DCS cannot verify a
  popularity claim about Google's own plan mix. Found while fixing it and recorded in root
  `CLAUDE.md`: `next-mdx-remote` v6's `blockJS: true` default silently strips JSX expression props
  from MDX, which may mean colossus-scaffolding's `<Schema faqs={[…]}>` structured data is not
  emitting — unverified, worth checking.

- **DCS: added a 15th blog post on migrating old mail into a new business inbox** (business-tools,
  36 posts total, business-tools now 5). Requested directly rather than sourced from
  `content-plan.md`: it explains that a professional address on a client's own domain is a new
  Google Workspace account, not an upgrade of their existing free inbox, and that Google's own
  import tools can pull the old mail across rather than leaving it behind. Deliberately stops short
  of naming a specific migration path for every provider (Proton Mail's IMAP access depends on its
  paid-tier Bridge app, which wasn't independently verified) and instead tells the reader to check
  what their own provider allows before promising a full history transfer. Pairs with the existing
  `getting-off-gmail-without-breaking-your-email` post, which covers the DNS/MX side of the same
  move. `lib/blog-topics.ts`'s header and `test/page-parity.test.ts`'s hardcoded post count both
  updated from 35 to 36.

### Platform

- **Stopped `blockJS` silently corrupting numeric MDX props.** The `next-mdx-remote` v6 default
  strips _every_ JSX expression attribute, numeric literals included — not just the arrays and
  objects already documented. `ImageWithCaption`'s `width={1362}`/`height={N}` were being removed
  and the component fell back to its 800x500 default, rendering every npracing-v1 gallery image
  at the wrong aspect ratio with nothing in the build to indicate it. Those props are now
  authored as literal strings and coerced with `Number()` in the shared component. The same pass
  was stripping a redundant MDX-embedded `<Schema faqs={…} org={…}>` block on six
  colossus-scaffolding location pages, so it emitted nothing; the block was removed, and the real
  Service/FAQ/Breadcrumb JSON-LD comes from the page component's frontmatter and was never
  affected. Verified against real `next build --webpack` output before and after. Root
  `CLAUDE.md`'s MDX section is updated — the colossus case it flagged as unverified is now closed.

- **`TestimonialFrontmatterSchema`: `rating` is now optional.** It was required, inherited from a
  review-site model, which meant a testimonial a client simply _said_ had to be given a score they
  never awarded. Every consumer now handles its absence rather than defaulting to 5:
  `calculateAggregateRating` averages over rated entries only (on both sides of the division),
  `TestimonialCard` renders `StarRating` only when a rating exists, and the four sites with a
  `/reviews` page — base-template, colossus-scaffolding, dch-automotive, mad-graphics — skip or
  zero their star loops. Those sites' own testimonial files all still carry ratings, so nothing
  changed on them; this widened the schema without touching content. All 11 sites type-check clean.

### Platform

- **`BusinessConfig.openingHours` is now optional.** Both `getLocalBusinessSchema` implementations
  already guarded on it and omitted `openingHoursSpecification` when absent — the type was simply
  stricter than the code, so a site with no fixed hours could not express that. All 11 sites
  type-check clean and the other ten still supply hours, so nothing changed for them.
  `docs/standards/schema.md` records when to omit it.

## 2026-09-26

### Sites

- **New site: `sites/delta-t-racing-cc` — Delta T Racing, NPRacing's sister team** (UK club
  motorcycle racing, Bemsee/BMCRC, four riders). Built straight from `npracing-v1`'s approved
  "Grid Box" design rather than prototyped, re-keyed from red to the logo blue `#113A93`, with the
  content the team actually published on its old Wix site. Everything is suffixed `-cc` (after
  their `.cc` domain) so the bare `delta-t-racing` name stays free for a possible site for their
  separate sim-racing brand. Things that differ from its npracing parent and are worth knowing
  when copying either: a new `races` content type drives a season calendar whose "next up" state is
  computed in the browser (so it doesn't go stale between builds); JSON-LD is a local `SportsTeam`
  node because the shared LocalBusiness generator requires geo coordinates a club team doesn't
  have; the contact form is gated off by `features.contactForm` until Resend/CSRF env vars exist,
  rather than shipping a form that can't send. Images upload with
  `tools/upload-delta-t-racing-cc-to-r2.ts`. Found while building it, not fixed: `npracing-v1`
  has never actually loaded its Barlow / Barlow Condensed fonts (its theme comment says they are
  loaded via `<link>`, but no such link has ever existed), so it renders in system fonts.

- **Delta T Racing: completed rounds in the season calendar are no longer dimmed.** The cards
  carried `opacity-70`, which fades the text along with the card, so every label, date and
  "Race report" link on a finished round fell to 3.2–4.2:1 contrast (30 Lighthouse failures,
  accessibility 96). The "Complete" pill already marks finished rounds; accessibility is now 100.
  The hero image also moves from the deprecated `priority` prop to `preload` (Next 16 keeps the same
  behaviour) and adds `fetchPriority="high"`. Worth knowing: in Next 16 `priority` never set
  `fetchpriority` on its own, and adding it measured ~80ms slower simulated LCP locally, not faster.

- **DCS: deleted the retired solaris layer — 11 components (1,596 lines) and 27 authored CSS
  classes that had been shipping to every visitor since the r9 migration.** The homepage moved to
  r9 in August and the 15 inner routes in the September port; each phase recorded the superseded
  components as "out of scope" rather than deleting them, and **nothing ever failed** — type-check
  passes on an unimported file, lint does not flag it, no test imports it, and Tailwind's purge
  only removes utilities it generated, never hand-authored rules. Two of the eleven were worse than
  orphaned: `site-scroll-reveal.tsx` ran an `IntersectionObserver` on every page over elements
  nothing rendered, and `material-symbols-font.tsx` fetched a cross-origin Google Fonts icon-font
  stylesheet on every page for **zero** icons — they existed only inside the orphaned components.
  Reachability analysis cannot find those two; they were genuinely imported. `app/globals.css` went
  314 → 69 lines and the homepage's CSS 126,991 → 114,299 bytes (−10%), closely matching the 13,390
  bytes Lighthouse had flagged as unused. `globals.css` itself was deliberately **not** removed
  from any route: the root layout's consent banner is Tailwind-styled, and a shared cached base
  layer is correct architecture — Lighthouse's "unused CSS" measures one page, not a session.

- **DCS: rewrote the /about page's origin story and cut the /blog index from four editorial
  set-pieces to two.** The about-page's "there's no photograph of me here" argument (and the
  generic browser-mockup illustration next to it) is replaced with the real Cavendish Ironworkers
  / 1997 origin story and a LinkedIn link — DCS reads as unrelated to the day job, not anonymous.
  The blog index was measured at 1600px before touching it: 5,686px tall, 984 words, 26 post links
  for 21 posts, zero images, with the five newest posts listed twice across a masthead lead, a
  "Most recent first" band, a library intro, and a "Mostly trades" band. Cut to two set-pieces —
  3,846px, 464 words, 22 links, 0 overflowing elements at 1512px — by dropping the 566px "who it's
  for" band entirely, collapsing seven `.topic` blocks (each restarting the eye with its own h3 +
  description) down to chips whose descriptions already live on `/blog/category/[slug]`, and
  reflowing `.row` from a 700px dead gutter to a 1,080px measure with meta stacked under the title.
  The featured post stays IN the filtered list (excluding it broke "Design and speed" returning 1
  of 2 results), and the seven category pages' `.libr__topics` links are kept as real
  server-rendered anchors — they're `index:true` but absent from `sitemap.ts`, so that was their
  only discovery path. R2-specific rules live in their own `styles/blog-r2.css` rather than
  `inner-pages.css`, which `chrome-parity` asserts is a byte-for-byte copy of the design kit.
  Surfaced a stale test as a side effect, not a regression: the `/about` parity guard was comparing
  against the September prototype's now-deleted mockup figure (`.slot__well`/`.mock*`, 12 classes) —
  fixed by excluding that subtree the same way the guard already excludes `.bar`/`.menu`/`footer`,
  plus a premise test asserting the prototype still carries the figure the render no longer does, so
  the exclusion can't quietly rot into covering something else. Prototype, measurements, and full
  decision log in `output/sessions/2026-09/2026-09-26_dcs-blog-index-redesign/`.

- **DCS: published 14 new blog posts closing the gaps the index redesign's measurement surfaced** —
  every service now has a post behind it, all six sector chips carry real content (retail, studios,
  property, and creative sectors newly opened), and the thinnest topics (design-and-speed,
  tools-and-email) each gained entries. Every post is grounded in real DCS case studies, service
  pages, or documented engineering work from this changelog — no invented stats or testimonials.
  Content plan: `output/sessions/2026-09/2026-09-26_dcs-blog-index-redesign/content-plan.md`.

### Platform

- **Estate-wide dead-code sweep executed across the other 9 sites** (DCS itself was already
  cleaned above). Removed ~900 lines: `mad-graphics`' full solaris-era CSS block plus
  `lib/performance-tracker.ts` (327 unreachable lines), `dj-fox-electrical`'s `lib/locations.ts`
  (63 lines — closing the architecture-rule violation the Platform bullet below flagged) plus
  `lib/service-icons.ts` (88 lines), `dch-automotive`'s orphaned `components/pages/home-page.tsx`
  (167 lines, the same superseded-template pattern as DCS's solaris layer), and dead `lib/mdx.tsx`
  shims in `npracing-v1` and `dpm-autobody`. The dead `.text-balance` CSS class was removed from
  `base-template`, `colossus-scaffolding`, `dj-fox-electrical`, and `npracing-v1` (confirmed unused
  and unguarded by any snapshot test). **`lib/analytics/types.ts` turned out to be the opposite of
  the headline finding below**: deleting all 9 copies broke every site's `type-check` with
  `TS2307`, because each resolves the shim through its own `@/*` tsconfig alias into
  `core-components`'s Analytics/ConsentManager components — kept everywhere. The earlier
  "unreachable in 8 of 10 sites" read was a name-based-grep false positive: the same exported
  symbol names are also re-exported directly from `@platform/core-components/lib/analytics/types`,
  which is how every real consumer imports them, so a symbol-name search finds "usage" that isn't
  actually importing the shim's own path. `colossus-scaffolding` and `showcase` scanned clean —
  nothing removable once `components/ui/accreditation-section.tsx` (kept, pending content-owner
  sign-off) and the shim were excluded. `npracing-v3` (frozen design reference) was not touched.
  Surfaced, not fixed: 3 pre-existing e2e smoke-test failures (`mad-graphics` has no Playwright
  config at all; `npracing-v1` and `dch-automotive` test routes/slugs that don't exist on those
  sites) — flagged as follow-on testing-infra work in
  `output/sessions/2026-09/2026-09-26_estate-dead-code-sweep/`.

- **New: `tools/find-dead-code.ts`** — walks the import graph from what Next.js actually routes
  (plus every test file, wherever it lives) and reports unreachable modules and authored CSS
  classes no source references. It reports **candidates, not findings**, and buckets runtime-built
  class names (`` `svccard--${color}` ``) separately, that being the largest false-positive source
  in this kind of audit. Hardened twice against real false positives during the DCS work — treating
  co-located `*.test.ts` as entry points alone removed a phantom 1,104 "dead" lines from
  dch-automotive. Detection and prevention guidance in `docs/standards/quality.md`; the
  estate-wide sweep and per-site plan in
  `output/sessions/2026-09/2026-09-26_estate-dead-code-sweep/session.md`. Headline findings from the
  initial scan: `mad-graphics` carries the same solaris-era CSS block (26 classes), and
  `dj-fox-electrical`'s dead `lib/locations.ts` is also the centralised-data-file pattern root
  `CLAUDE.md` forbids by name. A third candidate, `lib/analytics/types.ts`, looked unreachable in
  8 of 10 sites on this initial symbol-name scan — see the sweep bullet above for what the actual
  import-path investigation found once the sweep ran.

### Prototypes

- **Autcobel: published the client-facing rationale document for Gene**, hosted at
  `docs.digitalconsultingservices.co.uk/autcobel/c83d2965/` per the same unlisted docs-site pattern
  used for DPM Autobody. Went through several rounds of direct client feedback: corrected the brief
  to match what was actually asked (mobile-friendly, agency-led, minimal client input) rather than
  a fabricated quote; replaced a "one page" framing with the real, verified problem (the live site
  doesn't render reliably across browsers — confirmed live: blank first paint, repeated framework
  console warnings, a sitemap listing exactly one URL); rewrote the proposition around
  findability rather than a "story"; retitled the disclosure section "Health warning" and rewrote
  it out of corporate hedge-speak; and changed the case-studies ask from a capped "two or three" to
  an open-ended outline of as many real projects as he can give. Also dropped the ICO-registration
  ask entirely — most small companies don't have one, and a privacy policy doesn't need one to be
  valid — removing it from both the content draft and the live prototype's Privacy Policy page,
  where it had been showing as a visible red placeholder bracket.

## 2026-09-25

### Sites

- **DCS: the homepage now links to the 15 inner pages — it never had, since they shipped.** The
  inner-pages port (2026-09-19) was scoped to the `(site)` route group, and `app/page.tsx` sits
  outside it, so every homepage link stayed an in-page anchor (`#work #services #pricing #faq
#end`): **0** internal route links against 66 URLs in the sitemap. The site was a one-pager with
  a full site bolted behind it, reachable only from search or by typing a URL. The homepage's
  burger now renders the same six-route `SiteMenu` the inner pages use (its homepage-only
  `mobile-menu.tsx` twin is deleted); the footer link map is extracted to a shared `FootMap`
  rendered by both, so the two footers are byte-identical apart from `aria-current`; the six
  service cards link to their own `/services/*` pages; and three work panels link to their case
  studies alongside a section-level `/projects` link. 0 → **27** internal route links, verified
  against a real production build. The homepage's `.end` deliberately stays a full-height closing
  _chapter_ rather than becoming a footer — only the link map is shared. Three service-card labels
  were reworded because they now open a service page rather than the contact section; notably "See
  a sample report" became "How I set up Google Analytics", since `/services/analytics` shows no
  sample report and the old label promised something the page does not deliver.

### Platform

- **Documented that jsdom applies no stylesheet, so a CSS-scoping bug passes the entire unit
  suite.** Found the hard way: DCS's shared `.footmap` is defined only in `inner-pages.css`, which
  the homepage route does not import, so when the homepage started rendering it the map arrived
  completely unstyled — and the markup, classes and structure all still asserted correctly through
  269 tests, type-check and lint. A screenshot even read as a plausible stacked list; only
  measuring it in a real browser exposed `display: block` where the rule gives four grid tracks.
  The rule now recorded in `docs/standards/testing.md` and `sites/dcs/PRODUCT.md`: when an existing
  shared component starts rendering on a route that did not render it before, confirm in a real
  browser that its CSS reaches that route. Where rules must be duplicated (both DCS stylesheets are
  verbatim-guarded against their own frozen sources and cannot absorb each other's rules), guard the
  duplication with a parity test — `sites/dcs/test/footmap-css-parity.test.ts` is the reference.

- **DCS: closed the inner-pages port's three remaining open items.** Search Console needs no
  submission — `robots.txt` advertises the sitemap index, all five sitemaps return 200 with counts
  matching content exactly, and the four section sitemaps derive from `listSlugs()` so they cannot
  go stale; the terms were reviewed and signed off as-is, retiring a `TODO` that read as pending
  work; and the eight orphaned `kit-additions-*.css` design records were deleted after confirming
  nothing linked them, no test read them, and all 366 of their class selectors are present in the
  shipped `inner-pages.css`.

## 2026-09-24

### Prototypes

- **New client prototype: Autcobel Ltd** (`output/sessions/2026-09/2026-09-24_autcobel-redesign/`) — an 11-page HTML/CSS prototype rebuilding autcobel.ltd, whose live site has a non-functional single-page nav. Researched the real company (Companies House no. 14044405) and competitors, drafted full agency-authored copy for every page (with an internal, never-published `CONTENT-STATUS.md` tracking facts still needed from the client), explored 10 homepage design directions across different design skills, then built and iterated the full site against direct client feedback — palette rework, a full-width photo-hero-with-scrim treatment on every page, generated hero imagery and a new logo mark via the `higgsfield` CLI, and unified card styling site-wide. Deployed to `autcobel-proto.vercel.app` (correctly suffixed `-proto`, per the prototype-naming rule below); hero/logo assets uploaded to Cloudflare R2 under `prototypes/2026-09-24_autcobel-redesign/assets/`, split into `hero/`/`brand/` subfolders to avoid the PNG archive-cache regex in `tools/upload-prototype-assets.ts`. Mobile and Safari visual QA were not completed this session — see the session's `HANDOFF.md`.

## 2026-09-17

### Sites

- **DPM Autobody: applied David's 2026-09-15 content and photo batch in full — 6 builds updated, a
  new Volvo 262C build added, and a workshop "atmosphere" photo section shipped**, closing out the
  content ask that had been open since 2026-09-12. Ran via a two-pass workflow: interactive text
  corrections first, then an autonomous `claude --dangerously-skip-permissions -p` run against a
  pre-written brief for the photo pipeline and page-building. Along the way, found a real bug in
  the shared `plate-redact/apply.py` tool (12-bit contact sheets no viewer could open) and, a day
  later, a live consequence of it: an unredacted plate had already been uploaded to R2 despite
  never being linked from any page, fixed by re-uploading under a new key per the platform's R2
  cache-busting rule rather than overwriting the exposed object. See `sites/dpm-autobody/CHANGELOG.md`
  for full detail.

## 2026-09-12

### Platform

- **Documented a `frame-src` CSP gap inherited by every site from `base-template`: no video-embed allowance, only `vercel.live *.vercel.live`.** Discovered building out `sites/dpm-autobody`'s remaining build pages — a confirmed YouTube video credit had a schema field and had been approved by the client, but the embed was silently dropped by CSP with no visible error once a render path for it was finally added. Add `https://www.youtube-nocookie.com` to `frame-src` the first time a site embeds a video by iframe (as opposed to serving `<video>` directly from R2, which is the pre-existing `media-src` gotcha). Added to root `CLAUDE.md`'s CSP notes and `docs/standards/security.md`.

### Sites

- **DPM Autobody: every library build now has a real page.** The 8 builds that previously 404'd (frontmatter only) now render via `BuildDetailPage`'s existing thin-content fallback, wired to real photos from the prior session's R2 upload, with a new `sourcingGaps` field surfacing any still-missing facts as a visible on-page notice instead of a silent gap. Two duplicate library entries were also found and merged/removed in the process (a split "Rare Volvo"/Pearl White pair, and a P1800 double-listed under both its own build and a separate "pair, one client" lot). See `sites/dpm-autobody/CHANGELOG.md` for full detail.

## 2026-09-11

### Platform

- **Documented a Tailwind arbitrary-breakpoint gotcha that silently hides content: `min-[Xrem]:`/`max-[Xrem]:` variants emit zero CSS against a `px`-based `screens` config.** Discovered building `sites/dpm-autobody`'s real pages — the primary nav was invisible on every page, with correct component code, correct data, and correct classes everywhere except this one. Tailwind treats a `rem` arbitrary value as "mixed units" against the platform's `px` screens and drops the variant with no build warning. Use a `px` arbitrary value or a named `screens` entry instead; verify by checking the compiled CSS for the expected `@media` rule, not just that the build succeeded. Added to root `CLAUDE.md`'s CSS Syntax section.

### Sites

- **DPM Autobody: shipped real pages** (header, footer, home, workshop, contact, library, and two individual build pages), replacing base-template's generic placeholders, on `develop`. A visual-fidelity gate against the approved static prototype took three rounds of fixes to clear — see `sites/dpm-autobody/CHANGELOG.md` for detail. The other 10 library builds, the homepage's featured-build rotation, the live contact form, and the workshop's video hero remain open, blocked on client-supplied content.

## 2026-08-27

### Platform

- **Fixed `turbo-ignore` silently building every push on `mad-graphics`, `colossus-scaffolding`, `dj-fox-electrical`, and `dch-automotive`, regardless of relevance.** `turbo-ignore` diffs against the SHA of each project's own last successful deployment, but Vercel's shallow git clone only reaches back ~10 commits; for these less-frequently-deployed sites that SHA routinely fell outside the shallow clone, producing "Previous deployment ... is unreachable" and a fail-open "build anyway" — confirmed live via build logs, and reproduced with a literal zero-file empty commit still triggering a full `mad-graphics` build. Added `--fallback=HEAD^1` (Vercel's documented pattern) to every site's `ignoreCommand`, including the three not currently exhibiting the symptom, since any site can hit the same wall after a quiet enough stretch. Verified with real historical commits in isolated worktrees: a DCS-only commit correctly reports "not affected" for `colossus-scaffolding`, while an earlier `packages/core-components` change correctly reports "affects" it.

## 2026-08-26

### Sites

- **DCS: replaced the SVG `og:image`/`twitter:image` with a real PNG share card, fixing broken link previews in Outlook and iMessage.** Both the root layout's default and the homepage's override pointed at `logo.svg`; SVG isn't reliably supported by link-preview crawlers, so unsupported-format fallback behaviour was pulling in an unrelated project photo from further down the page instead. Added a 1200×630 PNG (`sites/dcs/public/social-share.png`) matching the homepage hero's look — logo/wordmark lockup, magenta-plated headline — and pointed `app/layout.tsx` and `app/page.tsx` at it. `.gitignore`'s blanket raster-image rule (images normally go through R2) gained a named exception for this file, following the same pattern already used for NP Racing's favicons: a small, required, file-convention asset is simpler committed directly than routed through R2.
- **DCS: removed the hero headline's per-character reveal animation as a Core Web Vitals experiment.** PSI mobile reported LCP at 3.2s against a 1.7s FCP; the H1's per-character blur/translateY stagger (`h1 .ch` in `styles/home-r9.css`) held the last character in a blurred, offset state for up to ~1.35s after the animation started (delay formula `lineIndex*0.14 + i*0.028`, 0.9s duration each), with a further 0.78s scaleX reveal on the "Websites" plate — a span of time that lines up closely with the FCP-to-LCP gap. Removed both animations so the headline (likely the LCP element) renders in its final state immediately; a follow-up PSI run will confirm whether this was the actual cause.

## 2026-08-25

### Platform

- **Root-caused and fixed a CSP `eval`-blocked console warning on NP Racing, traced to Zod shipping in the client bundle for no reason.** `components/ui/gallery-lightbox.tsx` (`"use client"`) imported `useFocusTrap` from the bare `@platform/core-components` barrel instead of a subpath. `packages/core-components` has no `sideEffects: false`, so webpack couldn't tree-shake the barrel import — it pulled in the entire module graph behind `src/index.ts`, including the Zod-dependent `lib/content-schemas.ts`, and Zod's internal `allowsEval` CSP self-test then tripped the browser's eval-blocked warning on every page load. DCS never showed this warning because none of its client components import the barrel at all — only Server Components do there, which never reach the browser. Added a `./hooks/*` subpath export to `packages/core-components/package.json` and switched the import; verified by rebuilding and confirming Zod's fingerprint is gone from every file in `.next/static/chunks`. `packages/core-components/CLAUDE.md`'s import rule rewritten to explain _why_ (not just _that_) barrel imports are unsafe from `"use client"` files, and to fix a stale animation-import path in the same section (`/src/components/animation` doesn't match the real `package.json` export). See `packages/core-components/CHANGELOG.md`.

### Sites

- **NP Racing: fixed a site-wide low-contrast accessibility failure flagged by Lighthouse.** `surface.tertiaryForeground` (`theme.config.ts`) — the "faint eyebrow label" color used for the marquee ticker, footer headings, footer credit link, stat-strip labels, and contact-page labels — only reached 3.49:1 against the page's `#0A0A0A` background, below WCAG AA's 4.5:1 minimum for normal text. Brightened it from `#676765` to `#8A8985`, which clears 4.5:1 against every surface shade the token is used on (4.68–4.92:1 across background/card/subtle/muted) while staying visibly a step darker than `secondaryForeground`. One token change fixed every failing element, since they all trace back to it.

## 2026-08-24

### Platform

- **Image quality standard closed the gap between documentation and reality: `packages/core-components`'s shared UI components now set a live, consistent `quality` prop (45 thumbnail / 58 content / 72 hero) on every `<Image>`, and every site built from `sites/base-template` inherits it automatically at build time — no import or setup step required.** This follows directly from the NP Racing audit below, which surfaced that `docs/standards/images.md` documented one set of values (65/80/50) while the actual `image-config.ts` module it pointed to held a different set (58/72/45) and, worse, was never imported by any site — every site just hardcoded quality inline, same as NP Racing now does. Removed `image-config.ts` rather than keep reconciling two sources of truth; the shared components are now the only source. Five components had also independently drifted to their own ad-hoc values (65/70/75); all normalized. Every site's `next.config.ts` `images.qualities` allow-list was extended to include the new values, since Next.js throws a runtime error if an `<Image>` requests a `quality` not in that array — this touches all 8 sites' configs even though most of them don't directly consume the changed components today. See [docs/standards/images.md](docs/standards/images.md) and `packages/core-components/CHANGELOG.md`.

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
