# Synthesis — what the research actually tells us to build

**Written:** 2026-08-26, from five parallel research agents (~2,600 lines in `research/`).
**Read this first.** The teardowns are the evidence; this is the argument.

---

## 1. The finding that reframes the job

David sent three sites he admires. All three turn out to be **superb photography inside an ordinary
website**:

|              | Platform        | The tell                                                                                                                                                                                                                                                                              |
| ------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Halcyon**  | Wix             | 30.7 MB / 240 requests. 86% is one **26.9 MB** hero video — 1392×782 upscaled to 1440, 119.88 fps, a 200 kbps audio track on a `muted` element, no poster. Nothing on screen exceeds 46px. Motion is six elements on Wix stock presets. Typeface is Rolls-Royce's own corporate face. |
| **Eagle**    | Bespoke AWS CMS | Largest type **on the entire site is 26px**. 6.70 MB, 28 JPEG / 0 WebP, nothing lazy-loaded, no sticky nav on a 7,175px page, heroes are CSS backgrounds so no alt text.                                                                                                              |
| **Thornton** | Squarespace 7.1 | Body copy at **94–151 characters per line** (139 cpl _centred_), 21 type styles from one family, image masters capped at 1500px, accent colour baked into JPEGs, a **live 404** in the homepage service grid.                                                                         |

**So the thing David is responding to is art direction, not web craft.** That splits the job cleanly:

- **The art direction we must commission.** It is a photography and film problem and it costs money.
- **The web craft we can simply outbuild.** It is free to us and none of the three has it.

Chasing "a better hero video than Halcyon's" would be answering the wrong question. Their video is
26.9 MB of upscaled 720p. Beating it is trivial and wins nothing.

## 2. The gap all three leave open

Every one of them gestures at documented restoration. **None of them proves it.**

- Thornton's `/restore` says _"Each project is digitally documented at every stage"_ — **and links to
  nothing.** The archive that would prove it sits in a separate top-level section.
- Halcyon's "The Collection" **has no individual car page at all** — five abstractions, each ending in
  the same `Connect →`.
- Eagle has **no before/after anywhere**, and neither does Thornton, despite _"FROM A RUSTING SHELL TO
  A MASTERPIECE"_.

Meanwhile the most elevated presentation of a single classic car that exists anywhere is the **auction
lot page** — RM, Bonhams, Gooding — and _nobody in the restoration trade builds project pages that
way_: identity block, provenance ladder, itemised originality, named hands, 50–100 photographs, and an
explicit statement of what cannot be proven.

> **The unit of this site is the documented car, not the service.**

That is the whole opportunity, and it is unoccupied.

## 3. The asset reality points the same way

From `research/asset-audit-dpm.md` — every claim there was verified by opening files, not inferred.

**The good news, and it overturns our working assumption:** the tone is _not_ a problem. No memes, no
banter. The captions are genuine craft writing — _"Nothing over looked. Nothing left untouched"_;
_"All lines and gaps refined far beyond the standard they left the factory."_ **DPM can already write.**

**The problem is subject, not voice:**

- ~80% of the library is bare shells, primer, masking and booth work. Finished cars are **~5%**, nearly
  all in a spray booth or on show-hall carpet.
- **There is not one photograph of a finished car in daylight, away from the workshop.** Every
  reference site leads with exactly that.
- Everything reachable is **capped at 1080px** (Instagram's ceiling).
- The website has **four content images**; "Our Work" is a POWR widget streaming the Facebook feed.
  There is no curated portfolio in existence.
- The logo is a **raster PNG**, not a vector.
- Independent third-party imagery of their work **essentially does not exist** — every press photo is
  DPM-supplied. But Facebook carries **"100% recommend (24 reviews)"** and years of owner comments,
  entirely unmined.

**So: process-rich, finished-car-poor.** Which is the same shape as the competitive gap. The direction
the evidence supports is not the one that flatters best — it is the one that is _true_: build the site
DPM can actually fill, which is also the site nobody else has built.

## 4. The tension, named honestly

`positioning.md` says project the customer's world, not the shop's. A process-led site sounds like the
opposite. It isn't, but only if we hold one line:

> **Process appears as evidence, art-directed and composed. Never as the shop's self-image.**

Detail over environment, hands over faces, the panel rather than the room. And the archive must be
_bookended_ by commissioned finished-car photography that hands the customer their world back. The
archive is the body; the commissioned hero is the frame. **We do not yet own the frame.** That is the
photography brief, and it is the single highest-value thing we can give David this week.

The press photo of David draped over the pink DB6 in a fluffy pink cowboy hat and heart sunglasses is
the whole argument in one image — it is one of only two press images that exist, and it is not the
business he is describing to us.

## 5. Three directions to prototype

Full specs — palettes, type, motion, technical routes — in `research/elevated-references.md` §7.

|                                 | **A — The Catalogue**                               | **B — Wet Coat**                    | **C — The Green Room**                                |
| ------------------------------- | --------------------------------------------------- | ----------------------------------- | ----------------------------------------------------- |
| Ground                          | Paper `#F4F1EA`                                     | Near-black `#0B0B0C`                | Deep olive-green `#32412E`                            |
| Lead content                    | The document                                        | The surface                         | The people                                            |
| Motion                          | Near-zero                                           | Scroll-scrubbed light               | Slow, few, deliberate                                 |
| Hero                            | **No hero image at all** — opens on a contents page | Full-bleed macro of one panel       | **No photograph above the fold** — one serif sentence |
| Buildable from today's library? | **Yes**                                             | **No — gated on raws or the shoot** | **Yes**                                               |

- **A — The Catalogue.** The auction lot page, built properly, for the first time in this trade. Every
  restoration is a lot: identity block as a labelled table, intervention ladder in dated rungs,
  itemised originality, named hands with their towns, a documentation index. Homepage is an index of
  lots and nothing else. Project pages run 50–100 images and are unashamedly long.
- **B — Wet Coat.** The site _is_ a painted surface. The only light in the design is a single specular
  highlight the visitor moves by scrolling. The accent is inherited per project **from the car's actual
  paint code**, so the site re-skins itself car by car. This is the one that sells what DPM actually
  sells — and the one that fails hardest if executed as stock parallax.
- **C — The Green Room.** A maker's journal. Dave, Ellis and Paul byline their own posts in first
  person; a numbered stage-set names the stages in DPM's own language; a materials index swatches every
  paint and finish; tool portraits. The direction that most directly answers _"everything hand crafted
  in house"_ — and their captions prove they can already write it.

**The evidence-driven observation:** A and C both work **without a hero photograph**, which is precisely
what we lack. B is the only direction that _requires_ imagery we do not have. That is not an argument
against B — it is the strongest of the three — but B is gated on whether the original camera files
exist, or on the shoot.

**Recommendation:** prototype all three. Lead the presentation with **A**, because it is the widest
competitive gap and the best fit to the library; show **C** as the warm, human alternative; show **B**
as the brave one, and be explicit with David that it is contingent on imagery.

## 6. The video problem — handle this carefully

The research conclusion is that **restraint is the flex**: the most expensive-looking hero in the
entire reference set (Roger W. Smith's) is one sentence of serif type on a field of green, with no
photograph at all. Two of our three directions therefore open with no hero image.

**David is about to spend money shooting video.** We must not tell him his shoot is pointless. It
isn't — it just belongs somewhere other than a 26.9 MB autoplay hero:

- as a **workshop film** on the About page, watched deliberately rather than played at people;
- as **short silent loops inside project pages**, at the stage each clip depicts;
- as a **poster-first section** partway down the homepage, gated by `IntersectionObserver`.

**Brief the shoot before it happens.** Silent b-roll, slow reflection-travelling moves across panels,
at least one exterior daylight scene, 4K, delivered as a 10–15s seamless loop with a clean poster
frame. Their existing 57s film is 1920×1080 / 24fps and properly graded, so the capability is there —
it just needs pointing at what a website needs. This is time-critical in a way nothing else here is.

## 7. Non-negotiables for the build, from our own scar tissue

Already documented in `CLAUDE.md`; all of them bite in exactly this kind of site.

- **Sticky stacks:** the last item never pins — margin and container padding both give it zero room.
  It needs real in-flow content after it (`.stack::after{content:"";display:block;height:100lvh}`).
  And an unbounded sticky section **breaks in-page anchor links**, because the element reports its
  pinned position, not its layout position. Both directly relevant if we borrow Halcyon's sticky word
  stack (which is the best single idea on that site).
- **Video:** `<video autoPlay>` fetches regardless of `preload`. Gate every below-fold clip behind
  `IntersectionObserver` — `lazy-video.tsx` took a DCS page from 10.5 MB to 700 KB.
- **CSP:** `base-template` ships with **no `media-src`**, so the first `<video>` is silently blocked.
- **Prices and figures:** never `tabular-nums` or a mono face on a comma'd figure — `£1,995` renders
  as `£1 , 995`. Relevant if we ever show restoration costs.
- **`lvh`, not `svh`,** for any full-viewport section.
- **`vercel.json`** must carry the `ignoreCommand` turbo-ignore line.
- **Next.js:** the repo docs say 15; npm `latest` is **16.3.3** and this repo already references it.
  Next 16 no longer overrides `scroll-behavior` during navigation, which interacts with the sticky
  anchor bug above. Build against 16. _(Platform-wide note — out of scope for this session to change.)_

## 8. What has to happen before Phase 3

Ordered by leverage. The first two are time-critical.

1. **Brief David's video shoot — before it happens.** §6.
2. **Ask whether the original camera files exist.** Everything reachable is 1080px. If the raws are on
   a drive, the usable library multiplies overnight and Direction B comes onto the table. This single
   answer changes the design.
3. **Chase `@rpautomotivephotography`** — already shot three DPM cars at NEC 2023. Cheapest route to
   hero-grade imagery that exists.
4. **Commission the shot list** (`research/asset-audit-dpm.md` §6): finished car in daylight off-site;
   paint-surface macro under raking light; matched before/after pairs from a fixed mark; the clean
   workshop, decluttered.
5. **Halcyon's permission to be named.** Their paintwork credential is the strongest proof DPM has.
6. **Harvest the existing client voice** — 24 Facebook recommendations and years of owner comments,
   with permission. This is the only proof source available _today_, and Eagle's homepage shows what
   proof is worth: 41% of it is other people's voices, against 180px of self-description.
7. **Redraw the logo as a true vector.**
8. **Decide on insurance/accident repair** — keep, demote, or drop.
