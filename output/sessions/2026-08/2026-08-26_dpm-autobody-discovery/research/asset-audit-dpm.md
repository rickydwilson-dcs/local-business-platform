# Asset audit — DPM Autobody

**Date:** 2026-08-26
**Scope:** what visual material exists today, and whether it can carry a high-end site.
**Method:** every image described below was downloaded and opened. Nothing here is inferred from a
filename, a caption or a thumbnail alone unless explicitly labelled as such.
**Samples:** `research/screenshots/dpm-assets/` (gitignored — local reference only).

---

## 1. Verdict in five lines

1. **Yes — but not as a photo library. As a _process_ library.** There are thousands of images and
   ~6 hours of video, and they are far better than "workshop banter": the tone is craft, not matey.
2. **The fatal gap is the finished car.** Near-everything shows bare shells, primer, masking and
   spray booths. There is essentially no image of a completed car in a setting the owner of a
   concours Bentley would recognise as their own world.
3. **Resolution caps the whole social library at 1080px.** Confirmed, not assumed. That is fine for a
   portfolio tile and useless for a full-bleed hero, which needs 2400px+.
4. **One genuinely professional hero asset exists and it has a man in a pink cowboy hat in it.**
   The paint is stunning; the framing is the exact problem the brief describes.
5. **Build the site now around process, craft and the 57-second film — and commission the finished-car
   photography as a hard dependency, not a nice-to-have.** Without it the site will look like a very
   good bodyshop, not like Eagle.

---

## 2. Access log

| Source                          | Status                            | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dpmautobody.co.uk (Wix)         | **Full access**                   | Playwright + direct `static.wixstatic.com` fetch. Wix serves originals with no transform segment — got 3840×2160 and 4032×3024.                                                                                                                                                                                                                                                                                                               |
| Site hero video                 | **Full access**                   | `video.wixstatic.com/.../1080p/mp4/file.mp4`, 37MB, 57s, 1920×1080, **24fps**, 5.2 Mbps. Downloaded and frame-sampled.                                                                                                                                                                                                                                                                                                                        |
| **Instagram `@dpm_autobody`**   | **ACCESSED — publicly, no login** | Handle confirmed authoritatively from the site's own footer link, not guessed. curl returned an empty JS shell; `r.jina.ai` returned the login wall; **headless Playwright rendered the real logged-out profile**, and the unauthenticated public endpoint `i.instagram.com/api/v1/users/web_profile_info/` returned full profile JSON, 6 pages of posts, full captions and image dimensions. **No login, no credentials, no wall bypassed.** |
| Instagram back catalogue        | **Partial**                       | Pagination stopped at 72 posts with `more_available: true`. ~1,660 older posts unread. The 1,732 post count is API-reported, not counted by hand.                                                                                                                                                                                                                                                                                             |
| Instagram Story highlights      | **Not opened**                    | 8 highlights exist (NEC 2023, DB6, P1800, Bentley pt2, Bentley Resto, Jag XK120, Porsche 356, MK7 Jag). Contents unknown.                                                                                                                                                                                                                                                                                                                     |
| Facebook `/dpmautobody`         | **Accessed**                      | Cookie-consent redirect had to be cleared ("Only allow essential cookies") before the page renders. Logged-out view gives ~9 recent posts at 585px on-page; the **POWR widget embedded on their own site serves the same posts at 1080px** — that's the better route.                                                                                                                                                                         |
| Facebook older posts            | **Blocked**                       | Logged-out view truncates with "There's more to see… Log in". Not attempted further.                                                                                                                                                                                                                                                                                                                                                          |
| YouTube "DPM TV"                | **Full access**                   | RSS feed + `yt-dlp --flat-playlist`, cross-agreeing. 30 videos, thumbnails at maxres.                                                                                                                                                                                                                                                                                                                                                         |
| YouTube _footage_               | **Not inspected**                 | Only thumbnails were opened. Claims about the content of the videos themselves are inference from production quality and are flagged as such.                                                                                                                                                                                                                                                                                                 |
| Sussex Express article          | **ACCESSED**                      | WebFetch 403'd; `r.jina.ai` returned the full text. Both article images downloaded and opened.                                                                                                                                                                                                                                                                                                                                                |
| BBC News coverage               | **Accessed**                      | Not in the original scope — found during the sweep. Same two photos, extra quotes.                                                                                                                                                                                                                                                                                                                                                            |
| NEC exhibitor listing           | **Accessed**                      | Live, but it is the **2026** listing carrying the **old address and old phone number**.                                                                                                                                                                                                                                                                                                                                                       |
| Halcyon Cars site               | **Accessed**                      | Photography is reference-grade (Canon 5DS R per EXIF). **DPM credited nowhere** — grepped every page, zero hits for "DPM" or "Pearce-Martin".                                                                                                                                                                                                                                                                                                 |
| Google Business Profile photos  | **UNKNOWN**                       | Google/Bing/DDG all bot-blocked. Photo count unverified. Worth a manual look.                                                                                                                                                                                                                                                                                                                                                                 |
| Forums / club sites / magazines | **Nothing found**                 | PistonHeads searched directly — returns only unrelated US "DTM Autobody" threads. No magazine feature found. Yell 403s to automated access; Nicelocal 301s. Note this is "searched and found nothing", not "proven absent".                                                                                                                                                                                                                   |
| PistonHeads DB6 gallery         | **Accessed, not usable**          | 15 professional Steph Ewen images of the same DB6 — but green, 2021, **pre-crash and pre-DPM**. Not their work.                                                                                                                                                                                                                                                                                                                               |

---

## 3. Inventory by source

| Source               | Volume                                                                                                                                                                                                                                                                     | Max resolution                                                                                                           | Usable as-is?                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Instagram**        | **1,732 posts** reported. Sampled 72 (2023-04 → 2026-08): 49 carousels, 19 videos, 4 singles. The 12 newest posts alone carry **93 individual slides** (avg 7.8/post). Extrapolating the sampled rate, the account plausibly holds **several thousand individual images**. | **1080px** — verified from the API's own `dimensions` (1080×1350, 1080×719, 1080×1920). This is a hard platform ceiling. | Portfolio tiles and detail crops: yes. Hero: no.                                                           |
| **Facebook**         | Mirrors Instagram. ~9 posts reachable logged-out; carousels of +4 to +15.                                                                                                                                                                                                  | **1080×720** confirmed from the POWR feed originals.                                                                     | Same as Instagram. Redundant — Instagram is the better copy.                                               |
| **YouTube "DPM TV"** | **30 videos**, 3,320 subs, ~503k views, roughly **6 hours** of footage. Cadence collapsed: 15 videos in 2020 → 1 in 2024 → 1 in 2025 (last upload 2025-10-28).                                                                                                             | 1920×1080 source.                                                                                                        | 4 titles are cinematic-tier and are the single largest reservoir of gradable footage. Rights are the gate. |
| **Own website**      | **4 content images** + 1 hero video. That is the entire library the site exposes — the "OUR WORK" heading has **no gallery of its own**; it is a POWR widget streaming the live Facebook feed.                                                                             | 3840×2160 (video poster), 4032×3024 (a phone shot)                                                                       | The video is genuinely good. The rest is thin.                                                             |
| **Hero video**       | 57s, 1920×1080, **24fps**, h.264 @5.2Mbps. Sampled every 4s.                                                                                                                                                                                                               | 1920×1080                                                                                                                | **Yes.** See §4.                                                                                           |
| **Press**            | **2 images total.**                                                                                                                                                                                                                                                        | 1600×1068 and 1200×800                                                                                                   | One is the best third-party photograph that exists.                                                        |
| **NEC listing**      | 1 logo PNG, 750×1334 — an iPhone-screenshot-shaped raster of a white wordmark on black.                                                                                                                                                                                    | —                                                                                                                        | No.                                                                                                        |
| **Logo**             | Site wordmark is a **1955×849 PNG raster**. No vector found anywhere.                                                                                                                                                                                                      | —                                                                                                                        | **No — flag it.** Same trap as the DCS logo: this will not scale. Ask for AI/EPS/true SVG.                 |

---

## 4. Quality and tone

### The hero video is the best asset they own, and it is better than expected

Downloaded and frame-sampled at 4-second intervals. **24fps, shallow depth of field, colour-graded,
desaturated cool palette.** This was shot on a real camera by someone who knows what they are doing —
it is not phone footage. Content across the 57 seconds: a painter suiting up, respirator going on,
paint being measured into a graduated cup, spray gun close-ups, panels being laid, a dark bodyshell
in the booth.

- **The poster frame** (a gloved hand holding a gravity-fed gun, "…Paint Shop" signwriting soft in
  the background, 3M suit, blue nitrile) is genuinely hero-grade. It reads as craft and precision.
- **Frame 12** is the paintwork money shot: a near-black shell in the booth with the booth strip-light
  running as a single unbroken highlight down the entire flank, and the DPM banner legible as a
  reflection _in the panel_. That is exactly what is hardest to photograph and they already have it.
- **Frame 14 is the tonal warning.** The painter, gun raised, hose in the other hand, in a gunslinger
  pose. Charming on Instagram, wrong for this site. There is a version of this edit that is entirely
  craft and a version that is matey; the cut matters.

**Caveat:** it is 100% workshop. Not one finished car, not one frame of daylight.

### The still photography is much better than "phone in a busy workshop"

Opened a spread across Facebook, the Instagram grid and the current feed:

- **Real cameras, shallow depth of field, competent framing.** A torque wrench on a differential
  (visible focal falloff, ACDelco display legible), a technician flatting a purple bonnet with the
  DPM tee readable, a bare P1800 shell in the new unit lit softly enough that the _form_ of the
  body reads. These are properly taken photographs.
- **The backgrounds are the problem, consistently.** In the frames I opened: shipping containers, a
  rusted donor shell parked behind the subject, a wheelie bin, a Henry hoover, a dog bed, plastic
  sheeting, yellow masking tape, cracked tarmac. The subject is good; what is behind it is not.
- **Harsh midday sun** on the outdoor shots — blown highlights on white primer, hard shadows.
- **The one finished-car image I found** — a candy-red P1800 restomod on chrome wire wheels at the
  NEC — has genuine mirror gloss and depth, and also has a show-hall ceiling, black-and-white carpet
  and members of the public wandering through the frame. Croppable to a flank detail. Not a hero.

### Subject mix

From the 12 most recent Instagram tiles and the six Facebook posts I opened, a fair rough split:

| Category                                                        | Share    | Notes                                                                              |
| --------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------- |
| Work-in-progress (shells, primer, metalwork, masking, flatting) | **~65%** | The overwhelming bulk. Genuinely good material.                                    |
| Workshop / tools / components / detail                          | **~15%** | Engines on stands, hardware, torque wrenches. Strong.                              |
| People at work                                                  | **~10%** | Technicians mid-task. Mostly dignified, occasionally posed.                        |
| Finished cars                                                   | **~5%**  | Almost all at shows or in the booth.                                               |
| Personality / family / banter                                   | **~5%**  | David with his daughter at the NEC, thumbs-up beside a shell, the pink cowboy hat. |
| Memes                                                           | **~0%**  | **None found.** The client's own worry is overstated.                              |

### Tone — verbatim captions

The written voice is the pleasant surprise. It is confident craft language, not banter:

> "All those hours of meticulous preparation finally get a chance to shine. This P1800 example
> commissioned in a beautiful 3 stage pearl white. From a distance looks close to original colour and
> then the sun hits and the pearl pops." — 2026-08-19

> "Nothing over looked. Nothing left untouched." — 2026-08-26

> "All lines and gaps refined far beyond the standard they left the factory. When we restore cars we
> aren't just returning them to a factory standard we are improving all the areas that are substandard
> in our eyes." — 2026-07-08

> "5 grades all by hand and finished with 3000 & 6000 via sander, when the best is the goal this is
> the only way and the results speak for themselves." — 2026-06-24

> "We had to make bits from scratch, because you can't buy parts off the shelf. It's a hand-made car.
> So having to make a door from just bits of sheet metal is hugely satisfying." — David, Sussex Express

> "Many of our classic cars are museum pieces. We carry out the whole restoration process using
> traditional methods." — David, BBC

And the warmer register that needs editing out, not eliminating:

> "The Volvo 262 unfortunately has been badly behaved… Simon isn't best pleased!"
> "We can't change his height but at least he's cute" (welcoming Kallum)
> "Now for a cold shower after the joys of the heat today!"

**Read:** this is a workshop that writes about its own work with real precision and occasional
affectionate humour. It is _not_ the liability the brief feared. The banter is a light seasoning on
top of substance, and it lives mostly in the asides. Lift the substance, drop the asides.

### The single most instructive asset

`press/sussexexpress-01-david-pearce-martin-pink-db6.jpg` (1600×1068, credited Michael Martin, also
run by BBC). A properly shot, sharp, well-lit photograph of the pink DB6 — reg **"OH OH 7"** — under
the DPM sign on dark green cladding. The paint has real depth; you can follow the highlight down the
wing. And David is draped over the bonnet in a pink fluffy cowboy hat and pink heart sunglasses,
one leg kicked up, throwing a peace sign.

**This one frame is the entire brief in a single image.** The work is world-class; the presentation
is a laugh. Cropped tight to the car it is a strong asset. As shot, it is unusable on the site David
says he wants.

### One non-visual asset worth flagging: social proof exists and is unused

Not strictly imagery, but it turned up in the same sweep and the reference sites all lean on client
trust. **The Facebook page carries "100% recommend (24 reviews)"** — nothing on the current website
mentions it. And clients comment publicly on their own builds under the work-in-progress posts:

> "Well done 👏. Sigh of relief that its this far now! Next after polish is to rebuild it without
> scratching it 😅" — Chris Bulmer, on the 2026-08-19 "Final paint" post

That reads like the owner of the pearl-white P1800 following his own restoration in public. There is
a seam of real client voice sitting in the comment threads of both platforms that nobody has mined.
**Add to the questions for David: can we approach past clients for a short written testimonial, and
can we quote the existing Facebook reviews?** Cheap, and the reference sites all do it.

### Bio and positioning already exist

Instagram bio, verbatim: _"Artists of Automotive Restoration / 📍 East Sussex / YouTube channel ⬇️"_ —
the same line as the website. It is good and it is already theirs.

---

## 5. Candidate projects (10)

Coverage columns: **B**efore / **P**rogress / **A**fter.

| #   | Project                                        |  B  |   P    |  A  | Coverage detail                                                                                                                                                                                                                                                                                                         |
| --- | ---------------------------------------------- | :-: | :----: | :-: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Volvo P1800 (current, 3-stage pearl white)** | ✅  | ✅✅✅ | ⚠️  | The best-documented job they have. Live on Instagram right now through metalwork → spray filler → epoxy primer → body levelling → final paint. Multiple 8–16 slide carousels. Not yet flatted/polished, so **no final image exists yet** — which makes it the obvious car to shoot properly when it finishes.           |
| 2   | **Volvo P1800 restomod (red, NEC 2023)**       | ⚠️  |  ✅✅  | ✅  | 5 YouTube episodes (parts 1–3 + the 37-min 2024 documentary, 57k views). Finished car shot at the NEC on chrome wires — deep candy red, real gloss. **Professionally photographed by `@rpautomotivephotography`** — chase these files.                                                                                  |
| 3   | **1963 Bentley S3 Continental (Drophead)**     | ✅  |  ✅✅  | ✅  | 16-min YouTube feature + a 57-sec teaser. Thumbnail is a properly lit low-key hero frame — headlamps on, in darkness. A finished dark-navy car photographed outdoors sits on their own website at 4032×3024 (phone, but big). A **second** S3 chassis rebuild is underway now. Strong before/after potential.           |
| 4   | **1967 Aston Martin DB6 — "OH OH 7"**          | ✅  |   ⚠️   | ✅  | The press story. Crashed upside-down at the 2022 Carrera Panamericana; 900 hours; every panel damaged **except the fuel flaps**; aluminium-bodied, doors made from flat sheet. Before _and_ after images both exist and both are third-party. Dedicated Instagram highlight. **The single best narrative on the site.** |
| 5   | **Porsche 356 SC**                             | ✅  |  ✅✅  | ⚠️  | Two YouTube parts; part 2 is their most-watched video at **149,334 views**. Bare-metal and masked-shell stills. Finished-car coverage thin. Dedicated Instagram highlight.                                                                                                                                              |
| 6   | **Aston Martin V8 DBS**                        | ❔  |   ❔   | ✅  | One of the three cars taken to NEC 2023 and shot by `@rpautomotivephotography`. Build coverage not located — ask David whether DPM built it or only painted it.                                                                                                                                                         |
| 7   | **Volvo 262**                                  | ⚠️  |  ✅✅  | ⚠️  | Current. David's own words: _"totally restored. Totally factory. Best example in the world… we think so!"_ Electrical work, trim sourced abroad, approaching road test. A finished shoot is imminent and schedulable.                                                                                                   |
| 8   | **Jaguar XK120 / "Custom Classic Jaguar"**     | ⚠️  |   ✅   | ⚠️  | XK120 flat-and-polish video (2020) and a custom Jaguar sprayed in **Aston Martin Sea Green** — the thumbnail shows the colour going down over a curved wing, which is a good paint-depth frame. Also a D-Type repaint. Mostly early phone-tier footage.                                                                 |
| 9   | **1962 Corvette C1 colour change**             | ✅  |   ✅   | ⚠️  | 10-min YouTube feature, cinematic tier. A white C1 shell shot top-down at high res on Instagram. Colour-change story is a clean way to talk about paint.                                                                                                                                                                |
| 10  | **Hillman Imp (David's own car)**              | ✅  |   ✅   | ❌  | In build now. Charming, personal, and **explicitly off-positioning** — a concours audience does not care. Recommend keeping it off the site or burying it in a journal.                                                                                                                                                 |

**Deliberately excluded:** R35 GTR colour change, Golf R32/Rallye, Porsche Cayenne ceramic coating,
Integra Type R, VW T5 mods (99,727 views — their second-most-watched video), drift car. These are
real revenue and real audience, and they are the wrong signal entirely for a concours site. Ask David
before dropping them; do not put them on the homepage.

**Paintwork specifically** — the differentiator, and the hardest thing to photograph. What exists:

- Video frame 12 (booth light as an unbroken highlight down a dark flank) — **the best one they own**.
- The NEC candy-red P1800 flank — real gloss, croppable.
- The pink DB6 wing from the press shot — real depth, croppable.
- The purple bonnet being flatted — shows surface _being made_, which is arguably better than gloss.
- The Aston Sea Green Jaguar wing mid-spray.

That is roughly **five** genuinely paint-about-paint images across the entire library. For a shop whose
whole argument is paint, that is not enough.

---

## 6. Shot list — what to commission

Ordered by importance. Items 1–3 are the difference between a good site and the Eagle/Thornton tier.

### Tier 1 — the site does not work without these

**1. One finished car, in daylight, away from the workshop. The hero.**
The single biggest gap in the entire library. Every finished-car image they own is in a spray booth or
a show hall. The reference sites all lead with a completed car in landscape, in low sun, on a road or
gravel — the world of the _customer_, not the world of the shop. Sussex Downs, an estate driveway,
Beachy Head at golden hour. **Requirement: 3-4 setups minimum (front three-quarter, rear
three-quarter, side flank, one wide environmental), shot 4K+ / 24MP+, both landscape and a
portrait-crop-safe framing for mobile.** The Volvo 262 or the pearl-white P1800 are the schedulable
candidates.

**2. Paint surface macro — the actual differentiator.**
Reflection, depth, the flake turning in the light. Shoot against a controlled reflection source (a
white scrim or a soft strip, not the booth's yellow-taped plastic sheeting). Slow rotation of a
polished panel under a moving light. **The pearl white P1800 is perfect for this because the whole
selling point of the colour is that it changes when the sun hits it — and no existing image proves
that claim.** Get: a raking-light flank; a macro of flake in direct sun; a reflection of a clean
straight edge (a horizon or a light bar) running unbroken across a panel to prove the bodywork is
straight. This last one is the concours argument made visually.

**3. Hero video — direction for the shoot David is about to do.**
They already have a strong 57-second craft film. **Do not remake it — extend it.** What it lacks:

- A finished car moving, or at rest in daylight. At least one exterior scene.
- Slow, locked-off or gimbal-glide moves _along_ a panel, so the reflection travels. 4–6 seconds
  each, no cuts, no music sting.
- Zero talking head, zero pieces to camera, zero gunslinger poses. Silent b-roll.
- Shoot in **4K** even if the site serves 1080 — it gives crop room.
- Deliver a **10–15 second silent loop** with a clean first frame that works as a poster image,
  plus the longer film separately. The hero must be designed to work poster-only first.

### Tier 2 — needed for the portfolio to look complete

**4. Before/after pairs for 4–6 projects, framed identically.**
The single most persuasive device a restoration shop has, and DPM currently has _no_ deliberately
matched pair. Going forward: every car gets an arrival shot from a fixed mark, and the finished shot
is taken from the same mark. Retroactively, the DB6 (crashed in Mexico → finished pink) is the one
pair that already exists.

**5. Clean workshop environmental — the new unit.**
The 2025 "New Workshop of Dreams" premises look genuinely good in the thumbnail: bright, high, tidy.
Almost nothing else does it justice. Shoot it **empty of clutter**, wide, with two or three cars in
build. This is the "brand new workshop provides the perfect facility" claim their own copy makes and
never evidences.

**6. Hands and craft details, deliberately lit.**
They have these in abundance but ambiently lit. Re-shoot a small set properly: lead-loading, panel
beating, a hand running down a flatted panel, spray gun set-up, a chalk line on primer. **Backgrounds
must be dark and dropped-off, not the container yard.**

**7. Team portraits.**
Named craftsmen — Dave, Paul, Simon, Kallum, Ellis — are already a stated asset in their copy. Shoot
them in the workshop, at work, in available light. Restrained, not corporate. This is how the
personality gets in _without_ the pink cowboy hat.

### Tier 3 — chase, don't shoot

**8. `@rpautomotivephotography`'s NEC 2023 files.** Professional automotive photographer, already shot
three of their cars (P1800 restomod, Aston V8 DBS, Bentley Continental Drophead). Highest-value
existing imagery not yet in hand. Ask David for the files and the licence.

**9. The Sussex Express / BBC DB6 frame.** Credited to **Michael Martin**. Licensable. Crop out the
cowboy hat.

**10. The YouTube back catalogue, as stills and clips.** The 37-minute 2024 P1800 documentary is
almost certainly the largest reservoir of graded, well-lit footage they have — **noting I inspected
thumbnails only, not the footage itself.** Rights sit with the production company (JPM Productions),
not DPM. Clear this early; it is a phone call, and it could halve the shoot list.

---

## 7. Questions for David

**Assets and rights**

1. **Vector logo?** The wordmark everywhere is a raster PNG (1955×849) and the NEC listing carries a
   750×1334 phone screenshot. We need AI/EPS/true SVG. A raster inside an SVG wrapper is not a vector.
2. **Who shot the 57-second paint film, and can we use it on the site?** It looks like the same hand
   as the cinematic YouTube episodes. If that is JPM Productions, we need written permission.
3. **Can you get the `@rpautomotivephotography` files from NEC 2023** — full-resolution, with licence?
4. **Do you have original camera files** for the workshop photography? Everything we can reach is
   capped at 1080px by Instagram and Facebook. If the originals are 24MP on a card or a hard drive,
   the usable library multiplies overnight. **This is the highest-leverage question on the list.**
5. **Are there Story highlights, a Drive folder, or an unpublished archive** we have not seen? 1,660
   older Instagram posts are beyond what we could page through.
6. **Can we use the client voice you already have?** Facebook shows "100% recommend (24 reviews)" and
   your clients comment on their own builds under your posts. Can we quote the reviews, and would you
   approach two or three past clients for a short written testimonial?

**The shoot** 7. **Which car is finished first and can we shoot it properly?** The pearl white P1800 or the Volvo 262
look closest. We need one finished car, in daylight, off-site. 8. **For the video you are about to make — can we brief the shooter before it happens?** There is a
short list of shots (silent, slow, reflection-travelling, one exterior scene) that would change what
the site can do. Cheap to include now, expensive to go back for. 9. **Do you have access to finished cars you have already delivered?** Owners of concours cars are
often delighted to have them photographed. This is the fastest route to a portfolio of _finished_
work without waiting for a build to complete.

**Positioning** 10. **Halcyon** — will they let us name them? DPM appears nowhere on halcyon.works; they credit no
suppliers at all. Get it in writing before it goes in a prototype anyone shares. 11. **The modern/performance work** — GTR colour changes, Golf Rallye, Cayenne ceramic, the T5 (99,727
views, one of your two most-watched videos). Real revenue and a real audience, wrong signal for
concours. Keep as a quiet secondary page, or drop entirely? 12. **Insurance and accident repair** — same question. Currently given equal billing with restoration
on the homepage. 13. **The Aston V8 DBS** at NEC 2023 — full DPM build, or paint only? Affects how we can caption it.

**Housekeeping** 14. **Your NEC exhibitor listing is wrong.** necclassicmotorshow.com/exhibitors/dpm-autobody (stand
4-615) still shows Causeway Yard, Bodle Street BN27 4UA and 01323 833434. Your site says Berwick
and 01323 552827. Worth fixing — it is a live inbound link. 15. **YouTube has gone quiet** — one upload in 2024, one in 2025. 3,320 subscribers and half a million
views is a real audience. Is the channel dormant deliberately?

---

## CORRECTION — 2026-08-27

**The claim above that there is "not one photograph of a finished car in daylight away from the
workshop" is wrong.** Ricky supplied a post the audit had not reached
(`instagram.com/p/DU2rgo5DXqC/`, dated 17 February 2026) and its first slide is exactly that: a
finished maroon Volvo P1800 on a road beside water, bare trees, flat winter daylight, whole car in
frame. Retrieved publicly at 1280×853 and saved to
`prototype/assets/dpm-instagram/DU2rgo5DXqC/slide-01.jpg`.

**What survives of the finding.** The _scarcity_ claim stands and so does the shot list — this is a
competent owner-style snapshot, not a commissioned photograph:

- Flat overcast light, no modelling on the panels, so the paint does nothing.
- The number plate has been crudely painted out with a white scribble, which is visible and would have
  to be handled.
- Kerb markings, railings and a telegraph pole in frame; the car sits square to the camera on a public
  road.
- 1280×853 — usable at half-width on a page, not as a full-bleed hero.

Slide 2 is a wire wheel and spinner detail, and is genuinely good — it drops straight into an
Eagle-style 3×3 detail grid.

**Method note for whoever audits socials next:** the profile-level sweep missed this post. Individual
public post URLs render fine headless, but **only the first two carousel slides load logged-out** —
the rest sit behind a login wall and we do not go round it. So carousel-heavy accounts will always
under-report from an anonymous crawl. Ask the client for the originals; that remains open question 1.
