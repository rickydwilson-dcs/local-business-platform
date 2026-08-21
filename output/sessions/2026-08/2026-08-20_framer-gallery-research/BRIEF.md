# Framer gallery sweep — shared brief

## Who this is for

Ricky runs **DCS** (Digital Consulting Services) — a small UK outfit that builds and maintains
websites for local businesses, plus related IT/support services. He is redesigning the DCS
homepage.

## The problem being solved

He has already been through ~56 in-house HTML prototypes and is dissatisfied. His own words:

> "I find that we are stuck on the correct design and whilst I liked the colours and fonts, the
> actual components weren't making it look elevated and the mobile responsiveness was dreadful."

**Two failure modes to fix, and they are the entire point of this research:**

1. **Components don't feel elevated.** The page-level composition was fine; the individual
   components (cards, pricing tables, feature blocks, nav, testimonials, CTAs) looked flat and
   generic. We need component-level craft, not another moodboard.
2. **Mobile was dreadful.** Layouts that only work at 1440px. We need patterns that are
   _designed_ for small screens, not desktop layouts that reflow badly.

## CRITICAL: keep an open mind

Ricky has explicitly said: **do not presume anything already prototyped is of any use.** Do NOT
filter candidates by whether they fit an existing palette, typeface or layout. Judge every site
on its own merit. If the best thing you find is a dark editorial site with serif type and DCS's
current direction is light and sans — say so. Breadth and honesty beat consistency here.

## The seed reference

`https://default-studio.com/` is the site that prompted this. Ricky said it "feels like something
we could build upon in terms of component design and behaviour." Characteristics observed:

- Floating pill nav, centred, pinned, white on off-white
- Small uppercase **mono** eyebrow chips with a leading icon ("● BOOKING FOR Q3 2026")
- Very large tight-tracked grotesk headline, centred
- Feature cards each containing an **abstract UI mock illustration** (fake browser chrome, fake
  notification toasts, fake progress dials) that **animates on scroll** — this is the single
  biggest thing the DCS prototypes lack
- Pricing: a raised inner "card head" floating on the card, huge price figure, full-width pill
  CTA, then a divided feature list; middle plan inverted to dark
- Soft large radii (~20–24px), gentle shadows, off-white ground / white cards

Treat this as _one_ good example, not the target. Better examples are welcome and wanted.

## What to look for (rank candidates on these)

**A. Component craft** — the reason for the whole exercise:

- Cards that contain something other than an icon + heading + paragraph
- Pricing / plan comparison components
- Testimonial and logo-wall treatments
- Nav and mobile-nav behaviour
- Process / timeline / "how it works" steps
- FAQ and accordion treatment
- Footers that aren't an afterthought
- CTA bands
- Form and contact treatments
- Micro-interaction: hover states, scroll-linked animation, sticky/stacking cards, marquees

**B. Mobile.** Anything that only impresses at desktop is worth much less to us.

**C. Applicability.** DCS sells to plumbers, salons, garages, trades and small professional firms.
Sites that are pure art-portfolio spectacle are interesting for craft but weak for structure — note
which of the two a candidate is good for.

## Method

- Use your OWN tab (`tabs_create_mcp`). **NEVER call `resize_window`** — the browser window is
  shared with other agents running concurrently and resizing will corrupt their screenshots. A
  separate mobile pass is handled later by the orchestrator.
- Cookie banners: click **Reject** / decline non-essential. Never Accept.
- Do not sign in, submit forms, post, comment or like anything on Framer. Read-only.
- The Framer gallery grid is a **virtualised infinite scroll** (`.virtual-grid...__item`) — offscreen
  tiles unmount, so scroll in modest increments and read as you go rather than jumping to the bottom.
  Each tile shows a title and the real live domain; go to the live domain directly.
- Budget your time: skim many thumbnails, open only promising ones. Aim to _look at_ 30–50 sites
  and open ~15–20 live, then shortlist.

## Deliverable

Write `findings-<yourslug>.md` into this same folder. Structure:

```
# <Category> sweep

## Shortlist  (your best 4–6, strongest first)

### 1. <Name> — <live url>
**Why it's here:** 1–2 sentences.
**Components worth taking:**
- <specific component> — what makes it good, concretely (not "nice cards")
**Reservations:** anything that would not survive contact with a plumber's website.

## Also-rans (one line each, with url)  — 6–10 near misses worth a second opinion

## What I did not cover
```

Be concrete and specific. "Clean modern design" is worthless. "Pricing card where the plan name
sits on a raised white sub-card that overlaps the card edge, price at ~64px, CTA full-width pill,
features divided by 1px rules with the inactive plan's text at 60% opacity" is useful.

Save screenshots of anything shortlisted with `save_to_disk: true` and put the returned paths in
your file next to the entry.

Your final response text should be a compressed version of the shortlist only — the file holds
the detail.
