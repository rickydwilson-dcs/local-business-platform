# Session Wrap-Up: DCS Contact-Form Hardening

**Date:** 2026-09-29 → 2026-09-30
**Session folder:** output/sessions/2026-09/2026-09-29_dcs-contact-form-hardening/
**Branch:** develop → staging → main (PRs #103, #104, both merged)
**Status:** Completed

## Goal

Make replies to a contact-form notification reach the person who filled in the form, then brand
those emails correctly, then reduce the nuisance of sales pitches arriving through the form.

## What Was Done

- **Fixed `reply_to` on both contact emails.** `sendContactEmail()` posts to the Resend REST API with
  raw `fetch` and had been sending the SDK's camelCase `replyTo`. Resend drops unrecognised keys
  without a 400 and still returns `200 OK` with a message id, so no `Reply-To` header was ever set
  and replying to an enquiry addressed `RESEND_FROM_EMAIL` — an unattended noreply mailbox. The
  business notification now replies to the enquirer, the customer confirmation to `BUSINESS_EMAIL`
  (it had no reply path at all before), and the confirmation's "please do not reply" footnote was
  rewritten because it contradicted the header the email now carries.
- **Rebranded DCS's emails to the r9 palette.** The template interpolates literal hex from a
  `themeColors` object each site supplies; DCS was passing `colors.brand.*`, still the pre-r9 solaris
  teal kept for the fourteen un-reskinned inner routes. Now reads `colors.custom`
  (magenta/ink/paper/grey).
- **Added opt-in spam tagging** (`packages/core-components/src/lib/api/spam-score.ts`). Prefixes the
  business notification's subject with `[SPAM?]` and names the signals in the footer. Never blocks.
  DCS is the only site opted in; the other nine are provably unaffected.
- **Verified everything against live production, not just tests.** Resend's API (`GET /emails`,
  `GET /emails/{id}`) was used to prove the pre-fix bug on a real 11:36 enquiry, confirm the fix, and
  confirm the `[SPAM?]` prefix on two live submissions. Rate limiting was also confirmed live (5
  through, then `429`).
- **Set up the downstream half at the mailbox** — a SiteGround Site Tools user-level filter on
  `Subject contains [SPAM?]` delivering to a folder, confirmed working end to end by the user.

## Key Decisions

- **Score grammar, not topic.** Banning "SEO"/"web design" breaks on any site that sells them and
  needs a different list per site, which does not scale to 100 sites. What separates the populations
  is direction — a customer _asks_, a spammer _offers_ — so the baseline targets inbound-sales
  phrasing and is portable, leaving the per-site layer near-empty. Layering reuses the `businessType`
  each site already declares for schema.org rather than inventing a taxonomy.
- **Tag, never block, with asymmetric test thresholds.** A false positive on a lead-gen form costs a
  real enquiry; a missed spam costs five seconds. A flagged ham fails the suite outright; a missed
  spam is only reported. The documented fix for a miss is a new signal, never a lower threshold.
- **Opt-in, DCS only.** Client owners run their own mail filtering, so tagging their mail would change
  something nobody asked for. Colossus stays off **despite taking one of the two spam hits** — the
  user's call, made with that fact in hand.
- **No CAPTCHA.** The pitch that got through came from a consumer mobile IP with a valid CSRF token,
  an empty honeypot, and a service picked from the dropdown — a human or a real browser session.
  Turnstile would not have stopped it and would tax every genuine lead. Volume is ~1/month across ten
  sites.
- **Ruled out SiteGround's spam protection and Apple Mail rules.** SiteGround's own filter is
  sender-only (no keyword rules) _and_ self-trains on Junk moves, so junking a pitch would teach it to
  distrust `noreply@digitalconsultingservices.co.uk` — the sender of every genuine lead. Apple Mail
  rules are local to one Mac, only run while Mail is open, and do not exist on iOS.
- **Corpus is real traffic, anonymised.** Hand-authored fixtures only encode the author's assumptions
  about spam, which is what needs testing. But the entries are enquiries from members of the public to
  a client's business, so names, numbers and addresses are not committed — only the three fields the
  scorer reads, with signal-bearing tokens and number shapes preserved.

## Commits

- `cba97021` — fix(core-components): set Resend reply_to on both contact emails
- `0039f310` — feat(core-components): opt-in contact-form spam tagging, scored on grammar

Promoted via PR #103 (`e8052bc8`) and PR #104 (`27216d17`).

## Files Changed

- `packages/core-components/src/lib/api/contact-route.ts` — `reply_to`, `spamTagging` hook, subject prefix
- `packages/core-components/src/lib/api/spam-score.ts` — new: scorer, baseline signals, `SPAM_PRESETS`
- `packages/core-components/src/lib/__tests__/fixtures/contact-submissions.ts` — new: 8-entry anonymised corpus
- `packages/core-components/src/lib/__tests__/spam-score.test.ts` — new: 22 calibration tests
- `packages/core-components/src/lib/__tests__/contact-route-spam-optin.test.ts` — new: proves the nine other sites are untouched
- `sites/dcs/app/api/contact/route.ts` — r9 palette, opts in to tagging
- `sites/dcs/test/contact-email-branding.test.ts` — new: asserts the real outbound Resend payload
- `sites/dcs/test/contact-spam-tagging.test.ts` — new: end-to-end tagging on the real handler
- `docs/standards/security.md` — new Transactional Email section; opt-in rationale; anonymisation rule
- `CLAUDE.md`, `CHANGELOG.md`, `packages/core-components/CHANGELOG.md`

## What Was Learned / Why It Matters

The Resend REST API takes **snake_case** field names and silently ignores anything else — no 400,
still a `200 OK` with a message id. That failure mode is invisible from the code, the response, and
every test that stops at "did it send", which is why this sat unnoticed since the factory was written.
The generalisable lesson is to assert the **outbound payload**, not the status code, for any raw-fetch
integration; and that Resend's own API is the cheapest source of truth for what a site actually sent.

The corpus paid for itself on day one. A _genuine_ scaffolding enquiry opened "I hope you're well" and
offered to "send over some marked up photos" — the first draft of the rules flagged a paying customer,
which no amount of reasoning about spam would have surfaced. And the two real pitches shared almost no
vocabulary, one carrying no link-building jargon at all, which is why scoring is additive across
independent groups rather than a keyword match. Both findings are recorded in `spam-score.ts` so a
future tuner does not undo them.

Also worth keeping in view: the contact form is a **spam-filter bypass**. A pitch emailed direct gets
scored by the mail host; the same pitch through the form arrives as first-party mail from the site's own
verified domain to itself, so SPF/DKIM/DMARC all pass and it lands in Primary. Hardening the form is
not about volume, it is about not laundering spam past your own filter — which is also why the filing
rule belongs at the mailbox rather than in the app.

## Follow-On Tasks

- **Flagged submissions still trigger a customer confirmation**, so a spammer with a fake address can
  bounce mail off the domain. Two-line suppression; left alone because a false positive would cost a
  real customer their receipt.
- **The other nine sites have the `reply_to` fix but have not redeployed** — they pick it up on their
  next push.
- **Colossus opt-in** remains a five-line block if the rate climbs. Do not re-raise unasked; the user
  has declined twice.
- `output/sessions/.current-session` was stale (pointing at `2026-09-24_autcobel-redesign`) when this
  session ended. Updated to this folder.
