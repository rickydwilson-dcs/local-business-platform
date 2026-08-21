# Framer **templates** sweep — agency category

Second tranche. The first sweep covered the community **gallery** (real published sites). This one
covers the **templates marketplace**, which is a different corpus: purchasable/free templates with
live demo sites. Read this brief in full before starting.

## Who this is for

Ricky runs **DCS** — a small UK firm building and maintaining websites for local businesses plus
related IT support. He is redesigning the DCS homepage.

## What he asked for this time, in his words

> "Looking for **engaging yet functional** animation, as well as providing an **elevated agency-like
> aesthetic**."

He pointed at **Sylven** (`https://sylven.framer.website/`, template page
`https://www.framer.com/community/marketplace/templates/sylven/`) as the thing that prompted it.

## "Engaging yet functional" — how to judge it

This is the crux. Motion is the primary criterion this round, and the bar is that it must **do a job**,
not merely decorate. Rank animation on:

- **Does it carry information?** A hover that reveals the next step, a scroll that advances a
  process, a state change that confirms a click. Good.
- **Does it survive failure?** If the script dies or the user is on a slow phone, is the content
  still there? Framer's house style is `opacity: 0` until scrolled into view — a page that renders
  blank white when the reveal doesn't fire is **functionally broken**, and that flaw was the single
  most common problem in the first sweep. Mark it down hard.
- **Does it cost the user time?** Preloaders, wheel-jacked carousels, scroll-hijacked sections and
  long intro sequences all put the animation ahead of the visitor. Sylven itself opens with a
  typewriter preloader — note whether a candidate does this.
- **Is it reproducible outside Framer?** DCS builds in Next.js + Tailwind. An effect that needs
  Framer's proprietary scroll engine is worth less than one that is CSS transitions, a keyframe, an
  IntersectionObserver or a small Framer Motion component. Say which category each effect falls in.

### Hard disqualifier — count-up numbers

**Ricky has explicitly said he does not like numbers that count up.** If a template uses animated
count-ups for stats, prices or KPIs, that is a **mark against it** — do not present it as a feature to
copy. Note it as a defect to strip. (Sylven's own demo rendered its stat row as `0% / 0% / $0`
because the count-ups had not fired — a live example of exactly why.) Do not recommend "use a
count-up but make it safe"; the answer is a static authored figure.

## "Elevated agency aesthetic" — what that means here

The first sweep found DCS's problem was **components that look flat and generic**, not page
composition. Look for craft at component level: what is inside a card, how a section is labelled, how
a price is presented, how a nav behaves. Specific devices already spotted on Sylven, as a calibration
of the level of detail wanted:

- Nav links with **superscript numerals** (`Home 01`, `Projects 02`)
- A **"Book a Call" pill containing a real avatar** plus a `+` badge
- Corner metadata framing the hero — `(©2018 – ©2026)` left, `Based in Australia` right
- A repeating **section header bar**: `[01]` left · `// BRAND EXCELLENCE` centre · `© 2026` right, on a hairline
- Giant grotesk headline with a **® superscript**
- Avatar stack + `4.9/5 BASED ON 230 REVIEWS`
- A black mono uppercase **marquee strip** of service names
- Ruler / tick-mark measurements along the top edge

That is the granularity to report at. "Nice animations" is worthless.

## Method

- Load the Chrome MCP tools in ONE ToolSearch call. Create your **own** tab with `tabs_create_mcp`.
- **Never call `resize_window`.** The window is shared with other agents running concurrently, and it
  does not work anyway — the screenshot tool pins a fixed viewport override, so it reports success
  while `innerWidth` stays at desktop. Do not waste time on it. Desktop assessment only.
- **Motion needs REAL wheel events.** Framer's scroll-reveal animations **do not fire on programmatic
  scroll** (`window.scrollTo`) — the page stays blank. Use the `computer` tool's `scroll` action, in
  modest increments (5–8 ticks), with a 1–2s wait, and take **paired before/after screenshots** to
  infer motion. Also use `hover` on cards, buttons and nav items to catch hover states.
- Getting from a template to its demo: open
  `https://www.framer.com/community/marketplace/templates/<slug>/` and read the outbound link — it is
  almost always `https://<slug>.framer.website/`, but confirm rather than assume.
- Cookie banners: **Reject** / decline non-essential. Never Accept.
- Read-only. No sign-ins, no "Use for Free", no likes, comments or purchases. Do not click
  **Use for Free** on anything — that writes to Ricky's Framer account.
- The listing grid is a **virtualised infinite scroll**; offscreen tiles unmount.
- Budget: open ~15–20 demos live from your assigned slugs, go deep on the best 5–6.

## Deliverable

Write `findings-tpl-<yourslug>.md` into this folder. If the file write is blocked, **put the full
document in your final response instead** — this happened to two agents last time and one agent's
detail was lost because it reported success without checking.

Structure:

```
# Templates sweep — <your batch>

## Shortlist (best 4–6, strongest first)

### 1. <Name> — <demo url> — <free / $price>
**Aesthetic:** what makes it feel elevated, concretely.
**Animation:** each effect, what job it does, and whether it is CSS / IO / Framer-proprietary.
**Components worth taking:** specific, at the granularity of the Sylven list above.
**Functional risk:** reveal-gating, preloader, scroll-jacking, count-ups, mobile-hostile construction.

## Also-rans (one line + url)

## Rejected for animation reasons (name + the specific sin) — this list is as useful as the shortlist

## What I did not cover
```

Save screenshots of shortlisted items with `save_to_disk: true` and include the paths.
Your final response should compress the shortlist; the file holds the detail.
