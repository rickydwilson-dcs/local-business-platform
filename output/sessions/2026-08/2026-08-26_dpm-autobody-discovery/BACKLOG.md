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
