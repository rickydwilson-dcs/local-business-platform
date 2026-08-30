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
