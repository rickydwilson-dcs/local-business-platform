# Autcobel redesign — handoff

**Status:** done, verified live. PR #91 (the previous session's `staging` →
`main` promotion) is **merged** — confirmed via `gh pr view 91`, now at
`main` commit `8786cc3b`. This session found and closed a real content gap:
the live autcobel.ltd site has 6 services and real contact details, and the
prototype only had 3 services and placeholder contact info. Fixed, committed,
pushed to `develop`, and redeployed — `https://autcobel-proto.vercel.app`
now serves all 6 services and the real contact details, spot-checked live
via `curl`.

**Branch:** `develop`. **Commits:** 2 this turn — `94a9c2c2` (services +
contact info fix) and `767e2b8b` (this handoff's own prior update), both
pushed, `develop` level with `origin/develop`. **Working tree:** clean.

**Supersedes:** the "ready-to-resume... awaiting the last required check"
handoff. That's resolved (PR #91 merged). This turn's own work is also
resolved — nothing is blocked for the next session, only the open items
listed at the bottom.

## What this is trying to resolve

Client (Ricky's agency, Digital Consulting Services) is rebuilding
**autcobel.ltd** for their client Gene. Task: research the real company,
draft full site content, and build/iterate an HTML prototype the agency can
review and evolve with the client before committing to a real production
build. See prior session history (`session.md`, git log for this folder) for
the full design-pass narrative — this handoff covers only this turn's work.

The prototype is **not** the production site — it deploys to its own Vercel
project (`autcobel-proto`).

## What changed this turn (2026-09-24, later session)

Trigger: Ricky pointed at `https://autcobel.ltd/#our-services` and said the
live site shows more services than the prototype has.

1. **Corrected a wrong research finding.** The original
   `research/source-material.md` claimed the live site's nav was
   non-functional ("every link has an empty `href`... nothing behind it
   actually exists yet") based on a raw DOM `href` check. That was wrong —
   the nav is wired up via JS (`location.hash` + scroll), and clicking each
   link (or loading the `#hash` URL directly) lands on a real, detailed
   section. Verified live in a browser this turn. See the "Correction"
   note and new verbatim sections added to `research/source-material.md`.

2. **Found 3 missing services.** The live site's `#our-services` section
   lists six services; the prototype only had pages for three. Added:
   - `prototype/services/design-feasibility-consultancy.html`
   - `prototype/services/control-monitoring-systems.html`
   - `prototype/services/gas-leak-detection-systems.html`
   - `prototype/services/index.html` — new "Our Services" overview page
     (the live site has no direct prototype-page equivalent to model, so
     this was newly composed from the live site's own section copy)

   Matching content drafts added: `content/12-services-overview.md`,
   `content/13-15-service-*.md`.

3. **Updated nav, mobile nav and footer "Services" list on all 11
   pre-existing pages** to include all 6 services plus a link to the new
   overview page (done via a script, see
   `/tmp/.../update_services_nav.py` referenced in this turn's tool
   history — not saved in the repo, it was a scratch file). Verified every
   internal `href` in the 15-page prototype resolves to a real file.

4. **Rewired the homepage's services teaser** (`prototype/index.html`) from
   a 4-card grid (3 services + "Our Approach") to a 6-card grid (all
   services) plus a "View all services" button to the new overview page.

5. **Rewired the service-page CTA chain** to the live site's own 6-service
   order: Design & Feasibility Consultancy → Project & Design Management →
   Turnkey Electrical & Data → Control & Monitoring Systems → Gas Leak
   Detection Systems → Temporary Plant Systems → Contact Us.

6. **Resolved CONTENT-STATUS.md item #3** ("temporary plant" — power only,
   or also refrigeration?). The live site itself names this service
   "Temporary Plant Systems & Power" — confirms power-only, matching what
   was already drafted. Removed the in-page "Flagged for Gene" note box and
   tightened the copy in `prototype/services/temporary-plant-systems.html`
   and `content/06-service-temporary-plant-systems.md` accordingly.

7. **Resolved CONTENT-STATUS.md item #1** (phone/email), with explicit
   sign-off from Ricky first (this was outside the literal "add the missing
   services" ask, flagged and confirmed before doing it). The live site's
   `#contact-us` section has real contact details that were never surfaced
   before: `020 3051 4331`, `info@autcobel.ltd`,
   `projects@autcobel.com` (documents), hours Mon–Fri 08:00–17:00. Pulled
   into `prototype/contact-us.html` and the email reference in
   `privacy-policy.html`, `terms-and-conditions.html`, `cookie-policy.html`,
   and the matching `content/*.md` files.

8. **Rewrote `CONTENT-STATUS.md`** — items #1 and #3 marked resolved (2 of
   4 outstanding items now closed, down to accreditations and named
   clients), page table extended to 15 pages, "what we made up vs what's
   real" section updated.

9. **Verified locally**: ran a link-integrity check (every internal `href`
   across all 15 HTML files resolves to a real file) and browser-checked
   the homepage, services overview page, nav dropdown, and Contact Us page
   via a local `python3 -m http.server` + Claude-in-Chrome. All rendered
   correctly.

## Deploy — 2026-09-24, and a mistake caught mid-deploy

`tools/publish-prototype.ts` derives its Vercel project name from the
session slug unless `--project` is passed explicitly, and `.vercel/` is
gitignored everywhere in this repo (root `.gitignore`) — so a fresh
checkout has no local record of which project a prototype was previously
linked to. Running it without `--project` created a **new**, wrong project
(`2026-09-24-autcobel-redesign`) instead of updating the existing
`autcobel-proto`. Caught immediately by listing Vercel projects
(`vercel projects ls | grep autcobel` showed both), fixed by re-running
with `--project autcobel-proto` (the correct deploy went out within a
minute of the wrong one — no meaningful window where a stale/duplicate URL
was live), and the stray project was deleted after confirming with Ricky.

**For next time:** always pass `--project autcobel-proto` explicitly when
redeploying this prototype — don't rely on an implicit `.vercel/` link
existing.

## What was NOT done

- **Who We Are, Our Approach, Sectors We Serve content is richer on the
  live site than the prototype currently has** — found while checking
  other nav sections for the same "is the nav actually broken" question,
  but this was outside the "services" ask and not raised as its own
  decision point this turn. Full verbatim text captured in
  `research/source-material.md` under `#who-we-are` / `#our-approach` for
  a future pass, if wanted.
- **Icon reuse, not new assets.** The 3 new service pages reuse the 3
  already-uploaded hero images not used by the original 3 services
  (`hero-visual-calm-waves.png`, `hero-visual-data-stream.png`,
  `hero-visual-twin-ribbons.png` — all already reused elsewhere in the
  site too, so this isn't a new pattern). No new R2 uploads needed.
- **Mobile and Safari visual QA** — still never done (carried over,
  unrelated to this turn's changes).
- **Accreditations and named clients** (CONTENT-STATUS.md items #2 and #4)
  — still genuinely unresolved, nothing found on the live site to close
  these.

## Traps

- **The original research doc was wrong on a load-bearing fact** — see
  point 1 above. If a future session sees "nav is non-functional" claimed
  anywhere about autcobel.ltd, don't trust it without re-checking live;
  the correction is now in `research/source-material.md` but other docs
  (old commit messages, `session.md`, `CONTENT-STATUS.md`'s original
  wording) may still carry the stale claim in prose, even though the
  factual sections have been corrected.
- **This repo's working directory is shared by concurrent sessions** (see
  prior handoff's Traps section — still applies).

## Next step

Nothing blocking. The explicit next action, flagged by Ricky when this
handoff was written: **write richer copy across all 6 service pages.**

Context for whoever picks this up: all 6 service pages currently share one
thin template — hero, a 4-6 item "What's included" checklist, exactly 2
short body paragraphs (~60-80 words each), and a CTA to the next service.
That was fine as a placeholder to close the "3 services missing" gap fast,
but it means the 3 new pages (Design & Feasibility Consultancy, Control &
Monitoring Systems, Gas Leak Detection Systems) and the 3 original ones
(Turnkey Electrical & Data, Project & Design Management, Temporary Plant
Systems) all read as near-identical in depth and structure — nothing
differentiates one service's page from another's beyond swapped-in nouns.

Concrete starting points for a richer pass, per page in
`prototype/services/*.html` (and the matching `content/*.md` draft):

- A "who this is for" or "when you'd need this" section — ties the service
  to a concrete site scenario (the checklist items are the _what_, this
  would be the _why now_)
- More specific process/step detail than the current single "how we
  deliver it"-style paragraph — what actually happens between enquiry and
  handover for that specific service
- A short FAQ block (2-3 questions) — several services touch on things a
  buyer would obviously ask (F-Gas compliance scope for Gas Leak Detection,
  what "certified partners" means concretely, whether Design & Feasibility
  is chargeable/free at enquiry stage) that aren't answered anywhere
- Cross-links to the specific sectors each service is most relevant to
  (`sectors-we-serve.html` already exists and isn't referenced from any
  service page today)

Source material to draw from: the live site's own one-line description per
service (`research/source-material.md`, `#our-services` section) is the
only agency-verified real content for the 3 new services — everything
beyond that one line, on all 6 pages, is agency-drafted and not yet
reviewed by Gene (see `CONTENT-STATUS.md`). A richer pass should stay
inside that same "we wrote it, you haven't confirmed it" bucket, not
introduce new unverified factual claims (named clients, accreditations,
specific certifications) — those are still open items, not free to invent
just because the copy is getting deeper.

## Open questions

- Should the richer-copy pass (Next step, above) also fold in the fuller
  Who We Are / Our Approach / Sectors We Serve copy found on the live site
  this turn (verbatim in `research/source-material.md`), or stay scoped to
  the 6 service pages only, as asked?
- Same carried-over items as before: mobile/Safari QA, whether to archive
  `homepage-mockups/`, and chasing Gene for accreditations/named clients.
