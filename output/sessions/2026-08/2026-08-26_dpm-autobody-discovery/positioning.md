# Positioning — the governing principle

**Status:** Ricky's direction, 2026-08-26. This is the decision the whole design hangs off.

---

## The principle

> **Project the lifestyle of the people who drive these machines — not the personality of the shop.**

David's own framing invites this. He says he is "not the most elegant man" and asks for a site whose
appearance matches the level of the work rather than the level of the workshop. The social presence
reads a little quirky and workshop-floor; the clientele are people who own and commission concours
cars. Those are two different worlds and the site should live in the second one.

## Why this is right, and not just flattery

A concours restoration is not bought on price or convenience. It is bought on **trust that the owner's
car will come back better than it left, and that the person doing it understands what the car is.**
The buyer is imagining the car finished — on a lawn at a concours, in their garage, on a road at six
in the morning. The website's job is to make that image vivid and make DPM the obvious hands to
deliver it.

Selling the shop's personality does the opposite: it makes the buyer think about the workshop, the
banter and the risk, rather than about the car.

## What this rules IN

- Finished cars, photographed as objects of desire. Full-bleed, unhurried, given room.
- **Surface.** Reflection, depth, the way light travels over a panel. This is literally what DPM sells
  and no reference competitor can claim it — Eagle and Thornton are restoration houses, and DPM does
  Halcyon's paint.
- The car's world: the road, the lawn, the light, the drive. Restraint and quiet.
- Craft shown as _evidence_, not as personality: a hand, a panel, a gauge, a colour being mixed —
  close, deliberate, beautifully lit. The making is content, but it is composed content.
- Provenance language. Marque, model, year, chassis, what was done, how long it took. Precise and
  unembellished — the register of an auction catalogue, not of a sales page.

## What this rules OUT

- Group shots, thumbs-up, "team having a laugh", anything meme-adjacent.
- Phone snaps of a messy bay under fluorescent light.
- Exclamation marks, hype, "check this out", emoji.
- Stock imagery of any kind.
- Busy UI — badges, ribbons, gradients, drop shadows, carousel dots, "Get a Quote!" buttons.

## The tension to manage, honestly

Two things pull against each other and we should name it rather than pretend otherwise:

1. **In-house hand craft is a genuine selling point.** "Everything hand crafted in house" is David's own
   line and it is what justifies the price. That argues for showing the workshop.
2. **The workshop as it photographs today is off-brand.** See `research/asset-audit-dpm.md`.

The resolution is _art direction, not omission_: the workshop appears, but composed, close, and lit —
detail over environment, hands over faces, the panel rather than the room. A concours shop's workshop
photographed properly is aspirational. Photographed casually it is a garage.

**This is the single most important thing to get right in the photography brief**, and it is why the
shot list in the asset audit matters more than any layout decision we make.

## Where David himself belongs

Not nowhere — but not on the homepage hero. Craftspeople named and credited on an About/Workshop page,
properly photographed, reads as confidence. The named team on the current site (Dave, Ellis, Paul) is
an asset; it just needs the same art direction as everything else.

## The bar

Halcyon is the best of the three references and is built on Wix. Its homepage is **30.7 MB across 240
requests**, 86% of it a single **26.9 MB hero video** at 1392×782 upscaled to fill 1440px, running at
119.88 fps and carrying a 200 kbps audio track on a `muted` element, with no poster. Its motion is six
elements on Wix stock presets. Nothing on a 1440×900 viewport exceeds 46px. Its typeface is
**Riviera Nights (Swiss Typefaces)** — Rolls-Royce's own corporate face — on a site whose footer spends
four paragraphs disclaiming affiliation with Rolls-Royce. All verified 2026-08-26; see
`research/teardown-halcyon.md`.

We are building in Next.js with full control of typography, motion and media. **Matching Halcyon is
not the target. Clearing it is** — and the elegance we are actually chasing is its art direction, which
is a photography commission, not a code problem.
