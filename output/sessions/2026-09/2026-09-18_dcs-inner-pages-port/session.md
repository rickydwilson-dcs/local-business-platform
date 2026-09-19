# DCS inner pages — Phase 5, the React port

**Status:** Spec — not started. Written 2026-09-18, immediately after wave 2 was merged.
**Depends on:** Ricky's review of the wave 2 pages at `prototype/index.html`. Wave 1 is
already approved; wave 2 is not, so the nine wave 1 pages can port before the six wave 2 ones.
**Design session:** `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/` — 15 designs,
one merged `kit.css` (250,292 bytes), `design-kit.md`, and `notes-{a..h}.md`.
**Scope:** Port the designs to React, and carry the cutover. No new design decisions.

---

## 1. What this is

The r9 brand is live on the DCS homepage and nowhere else. The other 15 routes still render
the **old solaris chrome** and are `noindex`. The design work is finished and verified; this
session turns it into shipped Next.js and makes the site indexable.

Two previous attempts at the inner pages failed, both for reasons this session must not repeat:

- **2026-08-25** — nine agents rebuilt from a prose description of the tokens. "Utterly
  horrible — not one thing has picked up any of the design cues other than colours."
- **2026-09-15's first attempt** — produced one round of prototypes and stopped.

The fix in both cases was to design as static HTML against a numeric spec first. **That is
done.** This session is a port, not a design exercise: when a question is "what should this
look like", the answer is already in `prototype/` and `kit.css`, and the agent reads it rather
than deciding.

---

## 2. The architectural crux — read before planning anything

`app/(site)/layout.tsx` wraps all 15 inner routes in `PageShell` / `SiteHeader` / `SiteFooter`
from `@platform/core-components` — the **solaris** chrome. The homepage (`app/page.tsx`, which
sits outside the group and inherits none of it) uses the **r9** chrome: `components/home/site-bar.tsx`,
`mobile-menu.tsx`, `end-section.tsx`, with `home-behaviour.tsx` owning the open/closed state.

**The port's central move is replacing the `(site)` group's chrome with the r9 chrome.**
`prototype/_chrome.html` is the approved design for exactly this. Everything else in this
session is downstream of that one change, which is why it happens first and alone.

### The stylesheet question — decide this before writing any component

`styles/home-r9.css` is imported **inside `app/page.tsx`** (lines 5–6), not in the root layout,
so today it loads only on `/`. The inner pages need the r9 tokens plus the ~60KB of inner-page
rules that `kit.css` adds. Three options, to be settled in planning rather than discovered:

1. **Import the shared sheet in `app/(site)/layout.tsx`**, mirroring how `app/page.tsx` does it.
   Simplest, keeps the homepage bundle untouched, duplicates the token block across two sheets.
2. **Hoist the tokens to the root layout** and keep page-specific rules split. Cleanest
   conceptually; touches the homepage, which is live and guarded by parity tests (see §5).
3. **Tailwind-ify the kit.** Rejected up front — `kit.css` is 250KB of authored CSS with 124
   source citations, and re-expressing it as utilities would discard the provenance that makes
   it reviewable. The platform's MDX/token rules do not require it for a site-specific sheet.

**Recommendation: option 1.** It is the only one that cannot regress the live homepage, and the
token duplication is a known, contained cost. Option 2 is a follow-up refactor if wanted.

---

## 3. The page map

15 designs → routes. Every prototype is in
`output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/`.

| Prototype              | Route                                                        | Exists today                        | Wave         |
| ---------------------- | ------------------------------------------------------------ | ----------------------------------- | ------------ |
| `_chrome.html`         | `app/(site)/layout.tsx`                                      | yes — solaris chrome to be replaced | 1 (approved) |
| `service-detail.html`  | `/services/[slug]`                                           | yes                                 | 1            |
| `services-list.html`   | `/services`                                                  | yes                                 | 1            |
| `projects-list.html`   | `/projects`                                                  | yes                                 | 1            |
| `project-detail.html`  | `/projects/[slug]`                                           | yes                                 | 1            |
| `pricing.html`         | `/pricing`                                                   | yes                                 | 1            |
| `contact.html`         | `/contact`                                                   | yes                                 | 1            |
| `about.html`           | `/about`                                                     | yes                                 | 1            |
| `404.html`             | `app/not-found.tsx`                                          | yes                                 | 1            |
| `blog-list.html`       | `/blog`                                                      | yes                                 | 2            |
| `blog-post.html`       | `/blog/[slug]`                                               | yes                                 | 2            |
| `blog-category.html`   | `/blog/category/[slug]`                                      | **NO — new route**                  | 2            |
| `locations-list.html`  | `/locations`                                                 | yes                                 | 2            |
| `location-detail.html` | `/locations/[slug]`                                          | yes                                 | 2            |
| `legal.html`           | `/privacy-policy`, `/cookie-policy`, `/terms-and-conditions` | yes ×3                              | 2            |

**`/reviews` is deleted, not ported.** D3 dropped the route: a page holding three testimonials
advertises that there are only three. The three testimonials are placed via the `.quote` pattern
on `/projects` and the relevant case studies instead. `app/(site)/reviews/page.tsx` still exists
and must go, along with any nav/footer link to it. Revisit at 8–10 reviews.

---

## 4. The cutover — every item verified 2026-09-18, not inherited from the handoff

### 4.1 Indexability — the handoff is WRONG here, do not follow it

The design session's handoff says to remove `robots: { index: false }` from
`app/(site)/layout.tsx`. **`PRODUCT.md:53-56` explicitly says not to:**

> Do not remove the group-level `robots` declaration in the layout — that would re-index all 14
> routes at once, including the ones still not ready.

The supported mechanism is a **per-page `robots` override**, which Next.js merges field-by-field
down the segment tree, plus uncommenting that page's entry in `app/sitemap.ts` (the entries are
already written and commented out, `sitemap.ts:19-40+`). So indexing is opted into per section as
it ships, and the group-level declaration stays as the default-deny.

`test/indexability.test.ts` enforces the current state against the **real built site** — it boots
`next start`, reads `.next/routes-manifest.json`, fetches every route over HTTP and parses the
actual `<meta name="robots">`, then follows the real sitemap XML. It asserts `/` is the only
indexable URL. **It will fail the moment a page is opted in, and that is correct** — update the
test alongside, do not weaken it.

### 4.2 Confirmed defects to fix during the port

| #   | Item                                                                                            | Evidence                                                                                                                                                                                                                                                                     |
| --- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `logoAlt="DCS Gardening & Landscaping"` — this is a **web design studio**, not a gardening firm | `app/(site)/layout.tsx:36` **and `:48`** — two occurrences, the handoff recorded one                                                                                                                                                                                         |
| 2   | Contact form cannot receive an enquiry                                                          | Handler calls `validateCsrfToken` (`packages/core-components/src/lib/api/contact-route.ts:55`) then `request.json()` (`:88`). A native form POST is form-encoded with no CSRF header → 403, then 400. Honeypot field names also mismatch. Deferred here by Ricky's D2 ruling |
| 3   | 16 of 21 blog posts open with a `# ` h1 duplicating the frontmatter title                       | Counted directly; the port must strip it or every post ships two h1s                                                                                                                                                                                                         |
| 4   | `brighton.mdx:21-25` lists "Locations" twice → duplicate breadcrumb                             | `LocationDetailPage.tsx:20` maps it straight through                                                                                                                                                                                                                         |
| 5   | Two pricing UIs need reconciling into one `<Pricing/>`                                          | Homepage panel vs the `/pricing` page's own                                                                                                                                                                                                                                  |
| 6   | All 21 blog titles are Title Case                                                               | Against the settled sentence-case ruling. Prototypes already converted; **MDX not touched**                                                                                                                                                                                  |

### 4.3 Data that the designs assume but the content does not have

- **`sector` does not exist in blog frontmatter.** D4's second filter axis on `/blog` is a
  _proposed_ field; Agent F derived each value from the post's own text (mapping in
  `notes-f.md` §5.4). Either add the field to all 21 posts and the Zod schema, or ship the
  index with one axis. **This needs Ricky's eye before it becomes real data.**
- **Location `coordinates` are present in frontmatter but nothing consumes them.** Agent G's
  nearest-first ordering on `/locations` is computed by haversine from Polegate. Wiring that up
  is a small, self-contained task.

### 4.4 Prototype scaffolding that must not be ported

- **The `<nav>` markup is still in every prototype's bar**, hidden by CSS so Decision 5 was one
  declaration to flip while under review. **Drop it at port time** — `site-bar.tsx` already
  renders no `<nav>` at any width.
- **`contact.html`'s demo rig is hidden, not deleted.** `contact.html?rig` drives the four form
  states. Delete the `.rig` block, its CSS (~line 51) and the `rig` variable in the submit handler.
- **`legal.html`'s `?doc=` switcher** is a prototype device for showing three bodies in one file.
  The real routes are three pages.
- **`.slot`'s "Awaiting footage / Capture not yet taken" is NOT scaffolding.** It is the designed
  honesty mechanism for the ten case studies with no real video. Keep it.

---

## 5. Tests that will break, and why that is correct

`sites/dcs/test/` contains deliberate fidelity guards. `PRODUCT.md:58-82` documents them:

- **`test/home-css-parity.test.ts`** asserts `styles/home-r9.css` is a byte-for-byte
  transcription of the frozen prototype. It has an `ALLOWLIST` (changed declarations) and a
  `REMOVED_RULES` list (deleted rules, compared **by position**, so an omission shifts every
  later rule out of alignment). If the port touches `home-r9.css` at all, add entries with the
  old and new values and a reason. Both allow-lists are self-verifying — a stale or invented
  entry fails loudly.
- **`test/home-data.test.ts`** does the same for `components/home/home-data.ts`. A changed
  string needs updating in **two** places: the per-block `describe` and the independent
  `allStrings` recount, or the recount re-flags it.
- **`test/indexability.test.ts`** — see §4.1.
- **`test/csp.test.ts`** imports the real `headers()` array from `next.config.ts` and asserts the
  emitted CSP in both `development` and `production`. If the inner pages introduce a video, an
  embed or a remote image host, the CSP needs `media-src` / `frame-src` / `img-src` **and**
  `next/image`'s `images.remotePatterns` — see root `CLAUDE.md`, they fail in opposite ways
  (CSP silently, `remotePatterns` loudly).

**These are not obstacles to route around.** They exist because this homepage was ported once
already and the guards caught transcription errors.

---

## 6. Sequencing

Chrome first, alone, because everything else inherits it — the same reason Phase 2 of the design
session was a solo gate.

| Phase  | Work                                                                                                                                                                             | Parallel?        |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| **P1** | Settle the stylesheet decision (§2), then port the chrome: `(site)/layout.tsx` to the r9 bar/menu/footer, `_chrome.html` as the reference. Fix `logoAlt` ×2. Delete `/reviews`.  | No — solo gate   |
| **P2** | **Ricky reviews the chrome on one real route** before anything fans out. If the chrome changes later, all 15 pages change with it.                                               | Gate             |
| **P3** | Port the nine **wave 1** pages. Natural split: list+detail pairs stay with one agent (services, projects), then pricing, contact+404, about.                                     | Yes — 4–5 agents |
| **P4** | Port the six **wave 2** pages — blog ×3, locations ×2, legal ×3-in-1. Requires Ricky's wave 2 approval first.                                                                    | Yes — 3 agents   |
| **P5** | The cutover: contact form fix, blog h1 strip, brighton crumb, coordinates wiring, sector decision, per-page `robots` opt-in + sitemap uncomment + `indexability.test.ts` update. | Partly           |
| **P6** | The voice pass — ~229 first-person-plural lines across 44 files, plus 21 Title Case titles. **Legal bodies are excluded** (see below).                                           | Yes              |

**P6's exclusion, ruled by Ricky 2026-09-18:** the 91 `we/us/our` in the three legal bodies stay
plural. In Terms §1 and Privacy §1 they are _defined terms_ naming the contracting party, so
changing them alters the contract rather than the design. The site therefore ships singular nav
copy beside plural legal prose — deliberate, documented, confined to three pages.

---

## 7. Ground rules for every agent

Carried from the design session, where they were what made it work:

1. **Look at the prototype, don't read about it.** Render it at 1440 and 390 before writing.
2. **The design is settled.** Class names, values and structure come from `prototype/` and
   `kit.css`. Anything you cannot find there is a question for Ricky, not a decision for you.
3. **Verify your own page renders**, at both widths, against the real built output.
4. **No count-up animations.** A frozen count-up publishes a wrong number.
5. **Honesty rules.** No generated image standing in for a real client's premises or for Ricky —
   no photograph of him exists. Missing media takes `.slot`.
6. **Prices with commas never get `tabular-nums` or a mono face.** `£1,995` renders `£1 , 995`.
7. **£750 / £45 and 5/20/100.** Never £995/£59.
8. **Sentence case. First-person singular** — except the legal bodies (§6).

## 8. Traps

From the design session's own hard-won list — the full set is in `wave2-brief.md` §"Harness
traps". The ones that bite a _port_ specifically:

1. **Never nest a `fixed inset-0` overlay inside an ancestor with `backdrop-filter` or
   `transform`.** Either makes that ancestor the containing block and traps the "fullscreen"
   menu in the bar's own box. Verify by measuring the opened panel: it must report the viewport
   (390×844), not the bar (~277×58). A centred floating nav using `translateX(-50%)` has **both**
   triggers, so fixing only the blur leaves it trapped.
2. **`position: sticky` gets its room only from in-flow content _after_ the element.** A
   `margin-bottom` on the sticky element gives none; `padding-bottom` on the container gives none.
   The last item in any sticky stack silently fails to pin. Relevant to the legal TOC and the work stack.
3. **A sticky element reports its _pinned_ position, not its layout position** — so in-page anchor
   links silently do nothing once you have scrolled past it, and **it only reproduces when tested
   from below the target.** Agent H verified the legal TOC this way; a port must too.
4. **An arbitrary Tailwind breakpoint in `rem` emits zero CSS** against this project's `px`-based
   `screens` — `min-[56rem]:flex` compiles to nothing, `min-[896px]:flex` works. This hid an entire
   primary nav site-wide on `dpm-autobody`. Grep the compiled `.next/static/css/*.css` for the
   expected `@media`, don't trust a successful build.
5. **Cache-busting the HTML does not cache-bust the stylesheet.** After any CSS change,
   `fetch(url,{cache:'reload'})` before measuring, and sanity-check parsed rule count against the
   file. This produced a convincing false positive during the wave 2 merge whose "fix" would have
   been to undo a correct rule.
6. **A stale dev/prod server answers 200 while ignoring your rebuild.** If `pnpm start` hits
   `EADDRINUSE` it exits while the old build keeps serving. `curl` won't catch it — check the
   listening PID changed. This invalidated every verification screenshot on `dpm-autobody`.

## 9. What this session is NOT

- **Not a redesign.** No new layouts, no "improvements" to approved pages.
- **Not the homepage.** `app/page.tsx` is live and guarded; touch it only if the stylesheet
  decision (§2) requires it, and then with the parity allow-lists updated.
- **Not a Tailwind migration** of `kit.css`.
- **Not a content rewrite.** The voice pass converts person; it does not reword.
