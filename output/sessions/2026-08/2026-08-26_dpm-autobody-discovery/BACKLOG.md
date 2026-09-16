# Backlog

## 1. Write the client-facing rationale for the prototypes — **next up**

**Added:** 2026-08-27 (Ricky)
**Status:** Not started. Do this once the three prototypes are reviewed and a shortlist exists.
**Deliverable:** a short document David can read before or during the presentation — and that Ricky can
talk from. Not a design rationale for designers; a business argument for a client.

### What it has to explain

Why the positioning, the design and the direction of these prototypes should be considered, and why
each is relevant to _his_ business specifically. The evidence is already gathered — `synthesis.md` is
the argument, `positioning.md` is the principle, and the four teardowns in `research/` are the proof.
This document is the translation of all that into David's language.

### The three axes to frame it around — Ricky's, 2026-08-27

These are the shifts the whole design programme asks DPM to make. Each needs to be argued, not
asserted, and each has a cost attached that David should see clearly.

| Shift                                 | The argument                                                                                                                                                                                                                                                                                  | The cost to name honestly                                                                                                                                                                                                                                                                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **More hands, less faces**            | Hands are craft; faces are personality. A buyer commissioning a concours restoration is buying skill, not company. Hands photograph beautifully and age well; group shots do neither. It also sidesteps the problem David named himself — he is not selling _himself_, he is selling the work | It means fewer of the photos the team most enjoy posting. Say so                                                                                                                                                                                                                                            |
| **More paint, less mechanics**        | Paint is the one thing DPM does that none of the three reference shops can claim — **DPM does Halcyon's paintwork**. Engines and trim are subcontracted, so mechanics are somebody else's story. Surface, reflection and depth are the differentiator and nobody else photographs them well   | It narrows the apparent offer. If insurance and accident work is real revenue, that has to be handled deliberately rather than by omission                                                                                                                                                                  |
| **More finished items, less process** | The buyer wants to see the car they will get back. Every reference site leads with a finished car in good light                                                                                                                                                                               | **This is the expensive one.** ~80% of the current library is shells, primer and masking; finished cars are ~5%, and there is **not one photograph of a finished car in daylight away from the workshop**. So this shift cannot be made by choosing differently from what exists — it requires a commission |

### The tension the document must resolve, not dodge

Axis three ("more finished items, less process") pulls against `synthesis.md`'s conclusion that the
site should be **process-led**, because process is what DPM actually has 1,732 posts of, and because
documented restoration is the gap all three competitors leave open.

Both are right, and the resolution is the thing worth writing down:

> **Process is the proof; the finished car is the promise.** The finished car sells the commission —
> it goes at the top, and we have to shoot it. The documented process is what makes the promise
> credible once the buyer is interested — it goes deeper in, and DPM already owns it in a volume
> nobody else can match. The mistake is leading with process, not showing it.

That framing keeps the competitive advantage and still gives David the elevation he asked for. It also
converts axis three from an editing instruction into a **shopping list**, which is the honest version.

### Structure to write to

1. What David asked for, in his own words, and what we heard.
2. What we found when we took the three sites he admires apart — the one-line version: _superb
   photography inside ordinary websites_, so the bar is art direction, not web build.
3. The gap none of them fills: nobody proves documented restoration. The auction lot page does it
   properly and no restorer has borrowed it.
4. The three shifts above, with costs named.
5. The three directions, and what each asks of him.
6. What we need from him, in order — the shot list, the video brief, the camera files, the logo.

### Rules for writing it

- **Client-facing register.** No jargon, no cpl figures, no CSS. The competitor measurements are
  ammunition, not content — one or two land well, a table of them reads as showing off.
- **Do not disparage the sites David admires.** He named them, and he does Halcyon's paint. The line
  is "these are beautifully photographed businesses whose websites are holding them back", not "these
  are bad sites".
- **Name the money.** The photography commission is the real ask. Burying it is not kindness.
- Consider running `/ricky-voice` over the draft — this is a document Ricky will send and speak from.

---

## 2. Publish the prototypes for review — **done 2026-08-29**

The **client build only** is live at https://dpm-autobody.vercel.app, at Ricky's scope call: David
gets the two clean pages, and the annotated build, the rejected directions and the type study are
not deployed. Republish with `./prototype/publish.zsh` — never by hand, and never by pointing the
tools at `prototype/` itself, which would put the annotated notes on David's URL.

Only the 20 assets those two pages reference went to R2 (4.5 MB). The 137 MB art-direction folder
was **not** uploaded — it belongs to rejected directions and has no business on a public CDN.

Fixing the shared tooling was a prerequisite: both scripts scanned only top-level HTML and matched
only `"assets/`, never `"../assets/`, so this folder's real pages were skipped and the pre-flight
passed anyway. Recorded in `docs/guides/prototype-hosting.md`.

**Still to do:** send David the URL. Publishing it and sending it are separate acts. Do item 2b first.

---

## 2b. Interview David to replace the copy we invented — **next up**

**Added:** 2026-08-30 (Ricky). **Deliverable:** `interview-david.md`, written and ready to run.

Two sections of the project page — the four log entries and the nine stages with their durations —
are **our words in his staff's mouths**, and one of them (Ellis, the bumper coming back from the
platers with a shadow in it) describes **an incident we invented**. Six further claims on the
homepage and project page are ours and read as fact about his business.

Ricky's call, 2026-08-30: **leave the copy on the page for now** so David can see what the sections
do and understand they are being rewritten, rather than being shown two holes. The interview is what
makes that legible, and section A of the document is the disclosure to say out loud before showing
him anything.

The document is a conversation, not a form — twenty to forty minutes with the page open, recorded if
he is willing, because the whole point is to get his phrasing. Answers get logged back into the same
file under each question, so the record of what was ours and what became his stays in one place.

One thing in it needs doing regardless of what David says: the two Facebook quotes on the homepage
are **real words, silently edited**. Craig Mayhew's actually includes "and always a quick turnaround",
cut because it fights the positioning. Restore verbatim, mark the cut, or drop the quote.

---

## 3. Split the workshop and contact into their own pages — **direction, not yet specified**

**Added:** 2026-08-30 (Ricky). **Status:** a direction for the real build, not a prototype change.
Ricky's words: _"as we progress with this build we will move the workshop and contact into separate
pages"_.

Today both are homepage sections — §04 **The workshop** (what is in house, what goes out) and §06
**Enquiries**. The nav points at them with anchors (`#workshop`, `#contact`). Splitting them turns
those into real routes, which is what the monorepo build wants anyway: the platform is MDX-driven
with dynamic `[slug]` routes, and a workshop page and a contact page are ordinary content, not
homepage furniture.

### The workshop page

Ricky's proposal: **hero it with DPM's own film of the new unit**, and put the current homepage
workshop content below it.

That film exists and is theirs — **"DPM TV: NEW WORKSHOP OF DREAMS!", 8:09, 488 views**, listed in
`prototype/assets/dpm-instagram/DU2rgo5DXqC/README.md`. Ricky referred to it as the Instagram video;
there may be a cut on both channels, so check which is the better source before pulling anything.

**Two things to settle before this is buildable** (a third, rights, was cleared on 30 August):

1. **We do not hold it.** Nothing in `prototype/assets/` is workshop footage — the only video assets
   are the three AI art-direction clips, which are not going anywhere near a client page. It would
   need pulling with `yt-dlp` the same way the Jaguar film was (`web_safari`, format 96 — the other
   player clients silently drop to 640×360).
2. ~~**Rights are not cleared for it.**~~ **Cleared by Ricky, 2026-08-30** — all DPM Instagram and
   YouTube video is to be treated as DPM's to use however they wish. No longer a blocker for this
   film or the Lot 03 Jaguar frames.
3. **A film is not a hero.** An 8-minute walkthrough is a different object from a 6–10 second silent
   loop. Expect to cut a loop out of it, which means finding a passage that is steady, wide and free
   of people looking at camera. And `research/asset-audit-dpm.md` §5 already says the honest answer
   is to **shoot the unit properly** — _"bright, high, tidy. Almost nothing else does it justice.
   Shoot it empty of clutter, wide, with two or three cars in build."_ Treat the film as the
   stopgap that proves the layout, and keep the shoot on the video commission brief.

**Carry the lazy-video rule across when it is built.** A `<video autoPlay>` fetches regardless of
`preload="metadata"`, so a hero video plus anything below the fold downloads on load — see the root
`CLAUDE.md` performance note and `sites/dcs/components/home/lazy-video.tsx`. A hero video is above
the fold and should load eagerly; anything further down the page must not.

### The contact page

§06 lifts more or less as it stands, minus the invented characterisation of David flagged in
`interview-david.md` §D. What it gains as a page is the things that do not fit a homepage band:
opening hours, an address and map, what to bring or send, and whatever the enquiry form should ask —
`open-questions.md` item 10 is still unanswered on where submissions go.

### Open

Whether the homepage keeps a short version of each section with a link through, or drops them
entirely. Leaning: keep a trimmed workshop band on the homepage — the in-house/out-of-house table is
one of the few places DPM is concretely more honest than the reference sites — and let contact go
entirely, since the masthead already carries the phone number.

---

## 5. Content updates from David's review meeting — **2026-09-08, not started**

**Added:** 2026-09-08 (Ricky). David reviewed the prototype and was very happy with it. This is the
full action list from that meeting. Almost everything below is blocked on assets David is sending
(see "Next steps" at the bottom) — nothing here should be started before the corresponding email/photo
album lands, except the pure copy fixes noted inline.

### Content corrections (buildable now, no new assets needed)

- **"Lead loading and filling" → "body levelling"**, renamed throughout the site.
- **Plaque wording**: "riveted" is wrong — the plaques are adhered, not riveted. Find accurate wording.
- **Candy Red Volvo**: the YouTube video currently associated with it is for a _different_ Volvo — pull
  the wrong video, don't replace it with anything until the right one (if any) is confirmed.
- **Aston Martin T. Green: remove.** Insufficient build info to write the page. **Already done —
  removed, no trace left in the real site.**

### New/changed build pages (blocked on David's per-build emails + assets)

- **P1800 resto-mod ("Resto Mod Candy P1800") — the most well-known build, gets its own page.**
  Content received 2026-09-08. Three-part YouTube video exists (not professionally filmed — expect to
  need editing/trimming, not a straight embed). **Owned by Tonja, commissioned by Ahmet** (corrects
  the earlier meeting-note transcription of "Armor and Tonya" — the names are Tonja and Ahmet).
  **Chassis number: 23925.** DPM did full body and paint plus in-depth body and trim modifications,
  making this a total one-off example — worth stating explicitly as the positioning line for this
  build (it's the "resto-mod," distinct from the concours-correct restorations elsewhere on site).
  Photos: https://share.icloud.com/photos/005auHRyCY3Uwr52m5ceM3Zgg

  **CONFIRMED a different car from chassis 26282 — David, 2026-09-11: "Must be a different one.
  This is the Resto mod."** Resolves the discrepancy raised after his separate note about chassis
  26282 — DPM has **two distinct Candy Red P1800s**, not one car under two transcribed chassis
  numbers: this resto-mod (23925, Tonja/Ahmet, wire wheels, full body/paint/trim mods) and the
  already-live `volvo-p1800.html` car (26282, no video, main homepage photo, David's separate iCloud
  album at https://share.icloud.com/photos/067FIpe2yW62VqmZ8gK1TRk6w with a request for underside
  shots — unchanged, still pending). **Both need to read as clearly separate cars** — the earlier
  slug/naming-collision warning for the P1800s now applies with more force than "possible duplicate,"
  since these are two confirmed-real, confirmed-different Candy Red cars. `home.html`'s testimonials
  naming Ahmet Hussein and Tonja Hussein are simply this resto-mod's real owner/commissioner giving a
  testimonial — unrelated to which car is on the homepage hero, not evidence of a shared identity.

- **Pink Aston Martin DB6 race car — new build to feature.** Content received 2026-09-08. **Crashed
  at La Carrera Panamericana in 2022.** DPM carried out body repairs including a brand new door
  fabricated in-house, then finished the car in pink at the client's request, to stand out at the next
  race — **due to race again**, which makes this a live, ongoing story rather than a closed one (worth
  checking with David closer to publish whether the race has happened/result is known). Also got the
  front page of _Car Goes_ (car magazine — confirm exact title when writing copy, transcript name may
  be approximate) and a radio interview was done. Strong editorial story — good candidate for a
  longer-form build page rather than a grid entry.
  Photos: https://share.icloud.com/photos/0764SxxA2rtd4-DCsAev4bMNA
- **Red P1800 restoration — new build page, video-mismatch bug now RESOLVED and FIXED.** Content
  received 2026-09-08, then corrected twice by David in the same exchange — capturing the corrected
  version: distinct from the Candy resto-mod P1800 above and from the "two P1800s for same client"
  pair below — **DPM now has at least three separate P1800 builds to track**, keep them clearly
  distinguished in copy/URLs (colour or client name in the slug, not just "p1800"). Full body
  restoration done by DPM; mechanical and trim work done by another firm (so, unlike the resto-mod,
  this one is not a full in-house build — say so accurately). **Over 1,300 hours of labour in body
  and paint.**
  **The video bug — confirmed and fixed, 2026-09-08.** David confirmed directly: chassis 26282 (the
  Candy Red P1800 already live on the homepage and its own page) has no film. The "37:32 minute film"
  claim on that car was wrong, appeared in 6 places across `home.html` and `volvo-p1800.html`, and has
  been **removed from all of them** (see the `data-note` correction markers left in place at each
  spot). It likely belongs to this Red P1800 instead, but that is not confirmed — don't embed it on
  this build's page until David says so explicitly.
  Photos: https://share.icloud.com/photos/0c2iKjXCZYDtWkw5ZaXymVV1w
- **Pearl White P1800 — new build, content received 2026-09-08.** A fourth distinct P1800 build (see
  the naming/slug warning on the Red P1800 above — this makes it more pressing). Ongoing restoration,
  now in the reassembly stage after an in-depth restoration. Every single part refurbished, all new
  body panels. **1,300 hours to date** (David used the same "1,300 hours" figure as the Red P1800 —
  worth double-checking these are two genuinely separate figures and not one carried over by mistake
  before publishing both). Custom pearl white colour commissioned by the client. Single-piece bumper
  conversion and power-steering conversion — both worth naming as bespoke engineering work, not just
  paint. In-progress build, same framing note as the Bentley S3 and rare Volvo: show it as "restoration
  in progress," not a finished-car showcase.
  Photos: https://share.icloud.com/photos/0aeBzHWh8jSVh6Kd7wcH8f8Mg
- **Rare Volvo currently in the workshop** — near-complete full restoration, unique (no other example
  restored to this level), "hideous but rare," once owned by a famous singer (name not given in the
  meeting — ask David). Not yet finished, so this may need to sit as "in progress" rather than a
  completed build page.
- **Two P1800s built for the same client** — both won show awards. Owner is sending over the show
  names and awards; don't write copy claiming specific awards until that arrives.
- **Bentley (already on site, finished build)** — professionally filmed YouTube video exists, needs
  linking in. Confirmed by David, 2026-09-08: this is the finished-car video —
  https://youtu.be/JpztIam_ARE?si=d3p1GH2pm4_KISQr
- **Bentley S3 1964 — new build, ongoing restoration, content received 2026-09-08.** Same model as
  the finished Bentley above but a distinct, separate build — currently in the shop, not complete.
  Over 1,000 hours of hand-crafted metalwork so far; all new panels made by hand in-house. Chassis is
  currently being rebuilt ahead of mating body and chassis back together for final prep and paint.
  Chassis number to follow from David. Two iCloud photo sets supplied:
  - Metalwork and body prep: https://share.icloud.com/photos/0b3yDJOCfdAsJO7DXYn_eelSQ
  - Chassis rebuild: https://share.icloud.com/photos/056tY5Hd4D_sVvigD2nsnkbhQ

  David's request for how to present it: **show before images alongside the raw metalwork** so the
  page communicates the depth of work involved — this is an in-progress build, so the page should be
  framed as "restoration in progress," not a finished-car showcase (same caveat as the rare Volvo
  below).

- ~~**262** — likely the T. Green replacement. Chassis number to be sent over by David.~~
  **RESOLVED 2026-09-12 (Ricky): "262" was David referring to the pink Aston Martin DB6** — not a
  separate, unidentified car. That build already exists and is live (`aston-martin-db6-pink.mdx`).
  No separate "262" page or chassis-number ask needed; dropped from the outstanding-actions email
  to David accordingly.
- **Porsche 356 SC restoration — new build, content received 2026-09-08.** Not mentioned in the
  original review meeting; came in as a standalone email. DPM did a full body restoration and
  ~~mechanical rebuild (David's wording was "might mechanical rebuild" — likely "minor," confirm
  before writing copy)~~ **CONFIRMED 2026-09-12 (Ricky): "minor mechanical rebuild."** Copy updated
  accordingly. Customer refitted the engine and trim themselves to complete the build. Finished
  with some subtle modifications (unspecified — ask David what, if it's worth naming on the page).
  Photos: https://share.icloud.com/photos/05b8-dNtrNEZxOfi10y81Tmgg

### Site architecture / IA changes

- **Build library page** — a browse-all view sitting _above_ individual build pages in the hierarchy.
  This is new: the current prototype doesn't have this level (`open-questions.md` item 6 was "which
  6–10 builds to feature," this answers the container they'd sit in). Maps onto the platform's
  `[slug]` dynamic-route pattern — one collection page, N individual build pages under it.
  **Design directive, Ricky 2026-09-08: it must not read as a shop/product grid.** A flat card grid of
  photos + names is the e-commerce default and is explicitly what David/Ricky want to avoid here — the
  clientele are buying craft and provenance, not browsing a catalogue to purchase. Needs inspiration
  research before designing — the existing `research/` folder in this session already has the teardown
  method (eaglegb.com, thorntonrestorations.com, halcyon.works were all pulled apart this way); worth
  widening that search specifically for library/archive/index pages rather than homepages, since none
  of the three original references were audited for how they present a multi-build collection.
  Ties directly to `synthesis.md`'s auction-lot-page framing already in this session — a lot list
  (RM Sotheby's, Bonhams, Gooding & Co.) is a closer visual model than a shop grid and is already the
  chosen reference point for individual build pages; the library page should probably extend that
  same language rather than invent a second one.
- **Homepage: rotating featured-build selection**, client-editable so David can swap which builds are
  featured to keep the homepage fresh. This is new scope beyond the current two-page prototype — needs
  a real CMS/content mechanism, not a static homepage section. Worth scoping as part of the "real
  build" phase (see item 3 above, workshop/contact page split) rather than bolting onto the prototype.
- **In-house vs. outsourced work**: confirmed — no need to be specific about which parts are
  outsourced (trim, etc.). Shop's message stays "full restoration," doesn't advertise standalone
  servicing.
- **Insurance/accident work stays off the site entirely** — this resolves `open-questions.md` item 3.
  David's own reasoning: other big firms in this space don't advertise it either, so it's a category
  convention, not just a DPM preference.

### Workshop page

- Wants **workshop action photos**: welding, metalwork, general in-progress shots. Explicitly _not_
  build-specific — atmosphere and craft, not "here's car X being welded." Feeds directly into the
  workshop-page direction already logged in item 3 above (hero'd with the new-unit film, this content
  sits below it).
- **Ricky to send camera photos** for this — action on us, not David.

### Next steps (who owes what)

- David: **separate email per build**, with that build's content/photos.
- David: **iCloud photo album for the P1800 resto-mod** specifically (richest single build, gets its
  own page — see above).
- David: **workshop action photos** — wait, this one is Ricky's action (see above), listed here for
  visibility since it's in the same "next steps" batch as David's items.
- David: **vector/high-res logo file** — this is the same ask already open in `open-questions.md`
  item 2 ("does an original AI/EPS exist?"); nothing new here, just confirmed as still outstanding.
- Ricky: **invoice to follow once pages are near complete.**

---

## 5a. David's per-build content reply, received 2026-09-15

David's answer to the "separate email per build" ask above landed 2026-09-15. Five items were pure
corrections with no new assets needed and are **already applied to the live MDX/code** (see
`sites/dpm-autobody/CLAUDE.md`'s "Still not done" section for the detail):

- Removed the "well-known singer" previous-owner claim from `p1800-pearl-white.mdx` entirely —
  David: never happened, probably confused with a Rolls-Royce DPM restored for Julie Andrews.
- Removed the "one of two P1800s, one client" pairing claim from `p1800-candy-restomod.mdx` —
  David: that story belongs to a different client's two cars entirely, unrelated to the resto-mod.
  (That other client's pair is still real and still open — see item 5 above, "still waiting on his
  information on the shows they won.")
- Deleted `jaguar-sea-green.mdx` and its `LIBRARY_ORDER` entry — David's own call, "an old not
  particularly well documented restoration." Library is 9 builds now, not 10.
- Porsche 356 SC "minor mechanical rebuild" wording re-confirmed (already correct in the copy
  since 2026-09-12; no change needed).

**Everything else in David's reply was new content or new photo albums.** Held per Ricky's call,
2026-09-15, to keep photo-dependent build-out as one pass per car rather than partial updates — that
pass ran 2026-09-16 and applied all of it (see commit SHAs on each bullet below). Only four things
remain genuinely open: the Volvo 262C and Red P1800 chassis numbers (both still TBC), the DB6
photo-batch discrepancy (needs David's confirmation, not resolved), and the redaction gap noted at
the end of the Photo pipeline section below.

- **Bentley S3 1964 ("current restoration") — chassis now known: BC60 XC.** Full description
  received (arrival condition, wheel-tub/quarter-panel/valance fabrication, soda blasting, epoxy
  primer, body levelling, underside/cockpit paint — "now awaits reuniting with the freshly
  restored chassis before final prep for paint"). Matches the in-progress build already live as
  `bentley-s3-1964.mdx`. Photos: https://share.icloud.com/photos/003FP2ea7NN0LkE9kzVfSOsTg
  **DONE 2026-09-16 — commit `2808e624`.** `chassisNumber` set to BC60 XC, `sourcingGaps` entry
  removed, scopeOfWork/body rewritten, 18 new gallery photos added (11 from this album + 7 from
  the chassis-rebuild album below).
- **Bentley S3 chassis rebuild** — companion photo set for the same car above, no separate
  description. Photos: https://share.icloud.com/photos/0c6GM0eUPUwESLnR0HY0k_d5g
  **DONE 2026-09-16 — commit `2808e624`** (folded into the Bentley S3 1964 update above; 7 of its
  photos are among the 18 added).
- **Bentley S3 Continental ("finished, the one with video") — chassis now known: BC66 XA.**
  Restored 2021. Full description received (bare-metal repaint, hand-crafted lower-body panels —
  coachbuilt, no replacement panels exist — 4mm gaps, 5 coats of lacquer, 6-grade block sand,
  chrome re-done, interior recolonised, hood by SM Trimming). Matches the finished build already
  live as `bentley-s3-continental.mdx` (video already linked). Adds: showcased at the NEC in 2023.
  Photos: https://share.icloud.com/photos/0e2Jsfk8iM1w2VShB-q38cIqg
  **DONE 2026-09-16 — commit `8f3488d4`.** `chassisNumber` set to BC66 XA, `sourcingGaps` entry
  removed, scopeOfWork/body expanded (coachbuilt panels, paint process, chrome, interior, NEC 2023
  fact), 11 new gallery photos added (9 from this album + 2 from the NEC exhibition album).
- **Pearl White P1800 ("current restoration")** — full, much richer description received
  ("drive in drive out" package, pre-purchase compression check found low compression → engine
  rebuild required, new wheel tubs/inner wings/floor pans/chassis rails/jacking points/bulkhead,
  soda blasting, 4mm panel gaps, custom pearl-effect colour, poly bush + new bearings,
  power-steering conversion). Substantially expands the current thin copy on
  `p1800-pearl-white.mdx` — rewrite the body when the photos land rather than patching piecemeal.
  Photos: https://share.icloud.com/photos/0813neGTO0yZN8-gnF89wnvXQ
  **DONE 2026-09-16 — commit `1a1af03a`.** Full scopeOfWork/body rewrite (compression check, engine
  rebuild, chassis fabrication, pearl colour, power steering), 8 new gallery photos added.
- **Volvo 262C — new build, not previously in the library.** Chassis left blank by David, still
  TBC. Full description received: repeat client, rare model (donor vehicle sourced from the USA
  for parts/roof — original roof had vinyl-roof moisture-trap damage), in-house engine rebuild,
  zinc-plated components, injection unit refurbished off-site, "fully rebuilt and now going
  through shakedown tests." Names Simon specifically for the finessing work — worth keeping in the
  copy as a craft-attribution detail, matching how Mark Antwis's E-type page credits people by
  name. Needs a new slug/MDX file, not an edit to an existing one.
  Photos: https://share.icloud.com/photos/04fC6ytFAK7czhcH87m71yEbw
  **DONE 2026-09-16 — commit `e9b43f08`.** New build created (`volvo-262c.mdx`), added to
  `LIBRARY_ORDER` (library is now 10 builds, not 9), 8 gallery photos + heroImage set. **Chassis
  number stays OPEN** — left TBC with a `sourcingGaps` entry, per David.
- **Pink Aston Martin DB6 — correction only, no new photos.** Confirms: **has
  not raced since** the 2022 crash (still due to — resolves the open status question) and the
  livery shown in the crashed photos is the car's **original** livery, not yet replaced with the
  new pink-request design (previously only inferred from the photo set). Both `sourcingGaps`
  entries removed from `aston-martin-db6-pink.mdx` and its copy updated to state both facts
  directly. **DONE — commit `57f65d24` (2026-09-16; corrects this bullet's earlier "Applied,
  2026-09-15" note, which predated the actual code change).**
- **DB6 photo-batch discrepancy — OPEN, needs David's confirmation, NOT resolved.** David's email
  said "no new photos" for the DB6, but a 15-photo album arrived in the same 2026-09-15 batch
  regardless. Checked 2026-09-16: 6 of the 15 filenames matched existing gallery photos exactly and
  the other 9 showed no new content, so **zero photos from that album were added** to
  `aston-martin-db6-pink.mdx`. A new `sourcingGaps` entry was added instead, asking David to confirm
  nothing was missed — flagged, not resolved. Commit `57f65d24`.
- **Red P1800 — chassis still TBC (David left it blank again).** Full description received: sent
  as a stripped shell, one of the worst DPM has seen, full inner-panel fabrication (floors, chassis
  rails, inner wings, scuttle, boot floor), body sent for blasting with exterior panels off,
  factory black stone-chip underside paint, engine/interior refit done by another shop after DPM's
  work. Confirms the whole restoration was documented by **JPM Productions** (film production
  company name, not previously confirmed). Matches the build already live as `p1800-red.mdx`.
  Photos: https://share.icloud.com/photos/00eKK7Hd_OkFdfYVtpPXTRaS
  **DONE 2026-09-16 — commit `784d3c86`.** scopeOfWork/body expanded (stripped-shell arrival,
  inner-panel fabrication, JPM Productions credited), 22 new gallery photos added. **Chassis
  number stays OPEN** — still TBC, a `sourcingGaps` entry was added for it.
- **Tonja/Ahmet resto-mod Candy P1800 — expanded description for the already-live build.** Much
  richer copy than currently on `p1800-candy-restomod.mdx`: panel-seam/side-trim removal for a
  smooth body, bumpers modified/shortened and converted to a single piece from the factory 3-piece
  setup, window-scraper trim fitment matched to the door-handle trim gap, custom 3-stage Candy Red
  mix. Mechanical rebuild by **Wilde Classics** (name now confirmed), custom interior by another
  (unnamed) firm. **Showcased at the NEC in both 2023 and 2024** (previously only 2023 was noted
  elsewhere). No new photos given for this one — reuse existing.
  **DONE 2026-09-16 — commit `9faa77ab`.** scopeOfWork/body expanded (trim/bumper/paint mix, Wilde
  Classics confirmed, NEC 2023+2024), `sourcingGaps` entry for the "second car in pair" removed
  (David confirmed 2026-09-15 that story belongs to a different client), 8 of 23 new album photos
  added (1 of 24 was a confirmed byte-identical duplicate, correctly excluded).
- **Workshop action shots** — general welding/metalwork atmosphere shots, not build-specific.
  David specifically asks for one of the dog if there's a usable shot. Feeds the workshop-page
  direction (item 3 above). Photos: https://share.icloud.com/photos/047nVPG5fj8IiPCHCUgr5FwMw
  **DONE 2026-09-16 — commit `52990124`.** New "Workshop atmosphere" section added to
  `app/workshop/page.tsx` with 8 photos, including the requested dog photo (found within this
  album itself).
- **NEC exhibition photos** — no description, presumably usable across whichever builds were
  actually shown at the NEC (Bentley S3 Continental 2023, Tonja/Ahmet resto-mod 2023+2024 — confirm
  which cars appear in the album itself before attributing individual photos).
  Photos: https://share.icloud.com/photos/018BalSR5CeG-FS-1MKE-Qf7Q
  **DONE 2026-09-16 — commits `57f65d24` and `8f3488d4`.** 2 photos went to the Bentley S3
  Continental gallery; the DB6 got 2 new facts from this album (exhibited at the NEC, added to
  body prose) but no photos, since none were new.
- **"Porsche SC" — ambiguous, needs checking before use.** No description given. Ricky's read,
  2026-09-15: likely the same car as the already-live `porsche-356-sc.mdx` (David/Ricky only ever
  discussed one Porsche), not a second, different model (e.g. a 911 SC) — but not confirmed, since
  David didn't repeat "356" here. **Check the photos against the existing `porsche-356-sc.mdx`
  gallery before deciding** whether this is a replacement/addition to that build or a genuinely new
  one; ask David directly if the photos don't settle it.
  Photos: https://share.icloud.com/photos/0f1Nvynt2rno7ganz4EwGU_OA
  **RESOLVED and DONE — commit `65a654f7` (2026-09-16).** Confirmed the same car (matching
  `IMG_0304.jpg` heroImage filename) and confirmed by David 2026-09-16 — the same-car question is
  now closed. 11 new gallery photos added (10 plain + 1 with a caption clarifying it's the same
  restoration at an earlier stage); the duplicate heroImage file was correctly excluded.

### Photo pipeline — complete for all 11 albums, 2026-09-16

All 11 iCloud albums from this email were pulled (Ricky, via Safari — the iCloud web client's
bulk-download blocked Chrome automation with a server error and repeated retries didn't clear it;
Safari worked first try), converted HEIC→JPEG at full resolution (`sips`), run through
`plate-redact`'s detector, then reviewed image-by-image at full native resolution — not just the
detector's top candidates, which were false positives on every album (rust, weld splatter, chrome
trim) and never once caught a real plate. All redaction was auto-applied without the tool's normal
interactive browser confirm step, per Ricky's explicit instruction for this batch — every image
was still individually eyeballed by Claude first. Results, folders under
`../../2026-09/2026-09-08_dpm-autobody-build-out/inbox/`:

| Album                                                  | Folder                            | Photos | Plates found & redacted                                                                                                                                  |
| ------------------------------------------------------ | --------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bentley S3 1964, current restoration (chassis BC60 XC) | `bentley-s3-1964-current`         | 11     | 2 (background van)                                                                                                                                       |
| Bentley S3 1964, chassis rebuild                       | `bentley-s3-1964-chassis-rebuild` | 7      | 0                                                                                                                                                        |
| Pink DB6                                               | `db6-pink-2026-09`                | 15     | 1 (background car)                                                                                                                                       |
| Bentley S3 Continental, finished                       | `bentley-s3-continental-finished` | 16     | 4 (2 photos, 2 plates each — Honda + van, two vans)                                                                                                      |
| Tonja/Ahmet resto-mod Candy P1800                      | `p1800-candy-restomod-2026-09`    | 24     | 1 (background van)                                                                                                                                       |
| "Porsche SC"                                           | `porsche-sc`                      | 12     | 0                                                                                                                                                        |
| Volvo 262C                                             | `volvo-262c`                      | 17     | 0 (no plates fitted to the car at all)                                                                                                                   |
| NEC exhibition                                         | `nec-exhibition`                  | 7      | 2 (same DB6 plate, "OH OH 7", in two photos — a real personalised plate, not a DPM show plate)                                                           |
| Pearl White P1800, current restoration                 | `p1800-pearl-white-current`       | 18     | 2 (background cars)                                                                                                                                      |
| Workshop action shots                                  | `workshop-action`                 | 19     | 0                                                                                                                                                        |
| Red P1800                                              | `p1800-red-2026-09`               | 24     | 2 (the car's own plate, "723 HYK", in two photos — first pass under-sized one box and left a sliver of the plate exposed, caught on re-verify and fixed) |

**"Porsche SC" resolved by photo evidence, not just inference — CLOSED 2026-09-16, commit
`65a654f7`.** The album contains `IMG_0304.jpg`
— the exact filename already used as `porsche-356-sc.mdx`'s live `heroImage` — confirming it's the
same car, not a second model. It also contains a **second, distinct white bare-shell 356** not
otherwise documented anywhere on the site. Decision taken: the white shell was folded in as more
photos of the same in-progress story (11 new gallery photos, 1 with a caption clarifying it's the
same restoration at an earlier stage), not treated as a second Porsche build. David confirmed
2026-09-16 this is the same car — the same-car question is resolved.

**Fixed along the way:** `plate-redact/apply.py`'s contact-sheet montage was emitting 12-bit
JPEGs that standard viewers (including Claude's own image reader) can't open — silently defeating
the tool's own "check the contact sheet by eye before publishing" step. One-line fix
(`-depth 8` added to the `montage` call).

**Folder mix-up caught before it mattered:** the Red P1800 and NEC exhibition tokens were
transposed during the initial batch-convert (a transcription slip, not a tooling bug); caught by
content-checking the first survey grid against David's descriptions before any redaction work
started, not after.

**DONE 2026-09-16:** all 170 photos across all 11 albums were uploaded to R2 and wired into
MDX/new pages — the chassis numbers David supplied (BC60 XC, BC66 XA), the new Volvo 262C page, the
Pearl White/Bentley description rewrites, and the Porsche SC decision above are all applied and
committed (see the per-build bullets above for individual commit SHAs). Upload script/manifest
change: commit `a23c67fb`. Real manifest path:
`output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/photos-manifest.json`.

**Also note:** David's line "please feel free to expand or change some wording where you seem fit"
is a general licence to tighten his prose for the site's voice — it isn't an invitation to invent
facts, so keep expansions to phrasing, not new claims.

**OPEN — redaction gap found 2026-09-16, not yet fixed:** a sub-agent spotted that
`output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/inbox/p1800-red-2026-09/redacted/IMG_1601.jpg`
still has an unredacted, fully legible plate ("723 HYK", on a shelf, not on the car) that the
plate-redact pass missed. This photo was **not** used in any gallery in this run, so nothing live
is affected, but it needs a redaction-pass fix before that specific photo is ever used anywhere.

---

## 4. Deferred / smaller

- **Directory sweep at cutover.** The NEC exhibitor listing still carries DPM's old address and phone
  number. Check Yell, Google Business Profile, Cylex and the classic-car directories at the same time.
- **Google Business Profile photos** were never verified — bot-blocked during the audit. Needs a manual
  look; GBP is often the largest uncurated image set a business has.
- **Harvest client voice** — 24 Facebook recommendations plus years of owner comments, with permission.
  The only proof source available today. See `synthesis.md` §8 item 6.
- **Sussex Express DB6 article** returns 403 to automated fetch; grab the text manually if we cite it.
- **PistonHeads' 15 professional images of the DB6 in original green** (photographer Steph Ewen)
  pre-date DPM's respray and would make a properly-shot "before". Licensing question.
