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
   PNG. A vector redraw is needed before any hero use. Ask whether an original AI/EPS exists from
   whoever drew it; if not, we redraw.
   2b. **`@rpautomotivephotography` already shot three DPM cars at NEC 2023.** Who are they, what's the
   relationship, and do they still hold those files? Cheapest possible route to hero-grade imagery.
3. **Insurance & accident repair** — keep it, demote it to a quiet secondary page, or drop it? It
   dilutes the concours message but may be real income.
4. **Naming Halcyon.** DPM does their paintwork. Are Halcyon happy to be named publicly? Same question
   for any other trade clients — a named client list would be the single strongest proof on the site.
5. **Video — TIME-CRITICAL.** David's new shoot is imminent and we must brief it _before_ it happens,
   not after. We need: silent b-roll, slow reflection-travelling moves across panels, at least one
   **exterior daylight** scene, shot 4K, delivered as a 10–15s seamless loop with a clean poster frame.
   Their existing 57s hero film is 1920×1080 / 24fps, colour-graded and properly shot — so the
   capability is there; it just needs directing at what the website needs.
   Also: **rights to the YouTube "DPM TV" films sit with the production company, not DPM.** Confirm
   who owns what before we plan to use any of it.

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
