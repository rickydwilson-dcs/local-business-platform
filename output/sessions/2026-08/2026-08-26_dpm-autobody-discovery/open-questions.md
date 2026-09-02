# Open questions

## RESOLVED by David's email, 2026-08-28 — three blockers cleared

- ~~Do the car owners mind their cars appearing?~~ **Cleared.** _"Yes the owners will be fine with
  their cars being used now problem."_ Number plates still to be redacted properly — see below.
- ~~Do the original camera files exist above 1080px?~~ **Cleared, with a caveat.** David is sending an
  iCloud link to the project photos: _"some will be taken from my camera but majority are phone
  images (still good quality hopefully!)"_. **The 1080px ceiling was Instagram's, not the source's.**
  A recent phone shoots ~12MP (≈4032×3024), which is more than enough for full-bleed web.
  **The caveat that still matters:** resolution was never the real constraint — _light and
  composition_ were. A 12MP phone photograph of a car under flat workshop fluorescent is still a flat
  photograph. So the resolution problem is solved and **the shot list is not**: the commissioned
  hero work (finished car in daylight off-site at low sun; paint macro under raking light; matched
  before/afters from a fixed mark) is still needed. Say this plainly to David rather than letting the
  iCloud link read as "job done".
- ~~Who owns any DPM video?~~ **Settled 2026-08-30 (Ricky): all Instagram and YouTube video is
  DPM's to use as they wish.** The email below cleared the P1800 film specifically; the standing
  instruction now covers the rest.
- ~~Who owns the P1800 film?~~ **Cleared, and better than expected.** _"my brother was the production
  firm that produced the p1800 video. He also has quite a lot of other footage we could probably use"_.
  So the rights are effectively in the family, **and there is an unseen footage library**.
  → **New action:** get an inventory of the brother's footage. If it includes usable b-roll, some of
  the planned video commission may already be shot. Ask for the raw/graded masters, not YouTube rips.

## Still open on assets

- ~~Number-plate redaction.~~ **SOLVED 2026-08-28 — tooling built.** `tools/plate-redact/`:
  propose (OpenCV, both plate polarities) → confirm in a review UI → apply. House treatment is a
  **clean blank plate in the plate's own sampled colour**, not a blur — a blur says "something is
  hidden here", a blank reads as deliberate. Metadata including GPS is stripped by default.
  Verified on the real library: the plate came back rank-1 at 0.87 on the P1800 whole-car shot.
  See that folder's README.
- **The 2,000-photo P1800 portfolio** — confirm it is included in the iCloud link. It is the single
  richest source for a real lot page.

## Blocking — need answers from David before Phase 3 prototypes

1. **THE BIG ONE — do the original camera files exist?** Everything we can reach is capped at 1080px
   (Instagram's ceiling). If David or his photographer/videographer still hold the original raws or
   full-res JPEGs from 1,732 posts' worth of work, the usable library changes completely. If not, the
   entire back catalogue is 1080px and can only ever be used small or as a mosaic. **Ask this first;
   the answer changes the design.**
   ~~Which Instagram handle?~~ **RESOLVED:** `@dpm_autobody`, confirmed from their own site footer and
   publicly reachable — 4,777 followers, 1,732 posts.
2. **Logo.** ~~Do we have a true vector?~~ **RESOLVED — and the answer is no:** the logo is a raster
   PNG (1955×849, on their Wix site, and it does at least carry a clean alpha channel).
   **Partly mitigated 2026-08-29:** `tools/trace-logo.mjs` traces that alpha to closed polygons and
   the resulting SVG is in the masthead and footer of both prototype builds. It measures **1.9%
   different from the source raster** — invisible on a screen at any size, and _not_ a redraw:
   the curves are short straight segments rather than Béziers, so it is wrong to hand to a
   signwriter, an embroiderer, or anyone making a physical plaque.
   **Still to ask David:** does an original AI/EPS exist from whoever drew it? Also worth asking
   what the two faces are — "DPM" is a wide geometric sans and "AUTOBODY" a thin rounded techno
   face; naming them would let us set the wordmark as live text instead of artwork. If no original
   exists, budget a proper redraw.
   2b. **`@rpautomotivephotography` already shot three DPM cars at NEC 2023.** Who are they, what's the
   relationship, and do they still hold those files? Cheapest possible route to hero-grade imagery.
3. **Insurance & accident repair** — keep it, demote it to a quiet secondary page, or drop it? It
   dilutes the concours message but may be real income.
4. **Naming Halcyon.** DPM does their paintwork. Are Halcyon happy to be named publicly? Same question
   for any other trade clients — a named client list would be the single strongest proof on the site.
   4b. **Customer testimonials — now the biggest content gap, and the cheapest to close.**
   The homepage's proof section was rebuilt on 29 August as a testimonial section at Ricky's
   direction. It carries **two real, attributable quotes and no invented ones**:
   - Kylie Stevens, verbatim Facebook recommendation, 6 September 2020.
   - Chris Bulmer, real comment on DPM's "final paint" post of 19 August 2026, following his own
     car through the shop. Two emoji and an opening "Well done" trimmed; nothing else changed.

   **Six of the 24 Facebook recommendations were recovered on 29 August** — Ricky read them out of
   his own logged-in session, because Facebook serves the review cards to an automated context as
   33 unhydrated "Facebook" placeholders and obfuscates the one that does render. All six are
   transcribed verbatim in `research/facebook-reviews.md`.

   **The finding that matters is not the count.** Every visible review is a **repair or
   modification customer**, and **the newest is September 2020** — the whole corpus predates the
   concours work the site is built around. The recurring praise is speed and service: "quick turn
   around", "short notice", "went out of his way". That is the register of a good local bodyshop
   and the opposite of what a concours buyer wants to hear, so most of them would work _against_
   the positioning if quoted.

   The two on the page are the only two that talk about **standard** rather than speed — Liam Hunt's
   "to a standard better than out of the factory" (which is a customer independently saying what
   DPM say about themselves) and Craig Mayhew's "I'm very fussy and they are spot on".
   → **The action is unchanged and now better evidenced.** David asks three or four **restoration**
   clients for a short written line. Mining Facebook further will not help; the eighteen unrecovered
   reviews are from the same era and the same kind of customer. Nobody quoted has been asked, and
   quoting a customer on their restorer's site is a permission question that is DPM's to ask.

5. **Video — TIME-CRITICAL.** David's new shoot is imminent and we must brief it _before_ it happens,
   not after. We need: silent b-roll, slow reflection-travelling moves across panels, at least one
   **exterior daylight** scene, shot 4K, delivered as a 10–15s seamless loop with a clean poster frame.
   Their existing 57s hero film is 1920×1080 / 24fps, colour-graded and properly shot — so the
   capability is there; it just needs directing at what the website needs.
   ~~Also: **rights to the YouTube "DPM TV" films sit with the production company, not DPM.**~~
   **Resolved by Ricky, 2026-08-30:** treat **every DPM Instagram and YouTube video as DPM's to use
   however they wish**. That covers all 29 DPM TV films and the Instagram cuts, not just the P1800
   film David cleared by email on 28 August. It does **not** extend to third-party photography —
   the `@rpautomotivephotography` NEC files are still a separate licence question.
   **This is now live, not hypothetical:** the Lot 03 plates in the prototype are frames from
   `3bcai_euCy4`, "Full Custom Classic Jaguar Prep and Paint". It looks like in-house action-camera
   footage rather than a production-company piece, but that is an inference from the footage, not
   something anyone has confirmed. **Ask before those frames go anywhere public.**

## Non-blocking — useful, can follow

6. Projects to feature: which 6–10 restorations, and do we have before/during/after coverage for each?
   The pink DB6 (Carrera Panamericana) is an obvious one.
7. Founding date / years in trade — every reference site leads with heritage; DPM's site doesn't say.
8. Team: Dave, Ellis and Paul are named on the current site. Still current? Photographs available?
9. Awards, show placings, concours results — anything judged is worth stating precisely.
10. Enquiry handling: what should the contact form ask, and where do submissions go?
11. Domain and hosting — who controls dpmautobody.co.uk DNS, and is the Wix subscription to be
    cancelled or left running through the cutover?

## For Ricky

- Screenshot pass over eaglegb.com, thorntonrestorations.com and halcyon.works. The teardown is from
  text extraction; the visual judgments in it are inferred and should not be designed against until
  they're confirmed by eye.
- Sussex Express DB6 article returns 403 to automated fetch — grab the text manually if we want to
  cite it.
