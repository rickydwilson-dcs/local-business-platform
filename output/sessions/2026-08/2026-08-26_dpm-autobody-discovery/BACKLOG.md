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

## 2. Publish the prototypes for review

Not done — deliberately. Deploying to Vercel puts these in front of people, so it waits for Ricky.
Order matters: `tools/upload-prototype-assets.ts` (pushes `prototype/assets/**` to R2 and rewrites the
HTML to absolute URLs), then `tools/publish-prototype.ts`. See `docs/guides/prototype-hosting.md`.
The art-direction folder is **137 MB** of PNG at full resolution; only `web/` (11 MB) is referenced by
the pages, so check what the upload tool sweeps before running it.

---

## 3. Deferred / smaller

- **Directory sweep at cutover.** The NEC exhibitor listing still carries DPM's old address and phone
  number. Check Yell, Google Business Profile, Cylex and the classic-car directories at the same time.
- **Google Business Profile photos** were never verified — bot-blocked during the audit. Needs a manual
  look; GBP is often the largest uncurated image set a business has.
- **Harvest client voice** — 24 Facebook recommendations plus years of owner comments, with permission.
  The only proof source available today. See `synthesis.md` §8 item 6.
- **Sussex Express DB6 article** returns 403 to automated fetch; grab the text manually if we cite it.
- **PistonHeads' 15 professional images of the DB6 in original green** (photographer Steph Ewen)
  pre-date DPM's respray and would make a properly-shot "before". Licensing question.
