# DCS blog index redesign

**Status:** In progress
**Date:** 2026-09-26
**Branch:** `develop`
**Page:** `/blog` — https://www.digitalconsultingservices.co.uk/blog

---

## Goal

The blog index reads as a wall of text. Restructure it from four editorial
set-pieces wrapped around a link list into **two zones: one featured post, then
one filterable index** — and give the rows enough room to be scanned.

---

## Diagnosis (measured on the live page, 1600px viewport)

| Metric             | Value                     |
| ------------------ | ------------------------- |
| Page height        | 5,686px (~7 screens)      |
| Body words         | 984                       |
| Rendered images    | 0                         |
| Post links         | 26 — for 21 posts         |
| Library section    | 2,777px (49% of the page) |
| First post link at | y = 730                   |

Four causes:

1. **The page says it three times.** Masthead lead → "Most recent first" band →
   library intro → "Mostly trades" band. Four editorial set-pieces, **368 words**
   of headings, leads and topic descriptions, around 21 links. The five newest
   posts are listed twice (magenta band, then again in their topic block) — which
   is where 26 links for 21 posts comes from.

2. **Crowded vertically, empty horizontally.** `.topic .row` is a two-column grid
   whose title cell measures **1,337px wide holding ~500px of text**, with `.row__m`
   pinned to the far right — a ~700px dead gutter through every row. Row padding is
   **13.2px top and bottom**. Tight where it should breathe, empty where nothing
   happens. That combination is what reads as "no white space".

3. **Seven false starts.** Seven `.topic` blocks, each a 35.2px `h3` plus a 62ch
   description — ~120 words explaining categories the titles already explain, and
   the eye restarts seven times before picking anything.

4. **No visual anchor.** 15 of 21 posts carry `heroImage: "placeholder/blog-*.webp"`
   in frontmatter, **but no such files exist under `public/`** and nothing in
   `lib/content.ts` or `components/blog/` reads the field. It is dead frontmatter.
   So the page is one uniform typographic texture end to end.

### Not a careless design

`2026-09-15_dcs-inner-pages-design/notes-f.md` §0 records the intent: the library's
height is a function of **topic count, not post count** — measured identical at 40
and 60 posts (3,634px), against 6,034px for a flat uncapped list. That goal was met.
It optimised for a 60-post future and charged the cost to the 21-post present.

**Constraint carried forward:** whatever replaces it must not reintroduce linear
growth. The chip filter plus a cap is how that is kept.

---

## Direction

Two zones, not four.

### 1. Masthead (ink) — trim

- Lead cut to one line.
- `.mast__meta` 4 stats → 2 (guides, latest). The "7 topics / grouped by problem"
  stat duplicates what the chips show.

### 2. Featured (magenta) — deduplicate

- Keep the `.svccard--wide` featured card.
- **Delete the `.svcs` "four behind it" list.** Every one of those posts reappears
  below. Removes 5 redundant links and ~400px.

### 3. The index (white) — the page

- Keep the topic chips (`.paytoggle`). They work and they are the scale answer.
- **Drop the seven `h3` headings and `.topic__d` descriptions from the index.**
  Move each description to its own `/blog/category/[slug]` page, where it earns
  its place and is not competing with 20 other things.
- One list, newest-first, that the chips filter — instead of seven headed sections.
- Rebuild `.row`:
  - cap the row at ~1,100px rather than full-bleed;
  - move `.row__m` out of the far-right column to sit under or immediately after
    the title;
  - roughly treble vertical padding (13px → ~36–40px).
- Keep a cap at rest (`CAP`, currently 4/topic) re-expressed against the flat list
  so height stays bounded — see "Open question 1".

### 4. Who it's for (aqua) — cut or move

- 566px explaining what has _not_ been written yet, immediately before the footer.
- Trim to two lines, or move to `/about`. Decision with Ricky.

### Texture without artwork

Each topic gets a palette token carried as a small marker on its row. **Paired with
the topic label text that is already on the row — never colour alone** (see
`memory/user_colourblind.md`).

---

## Open questions

1. **What is the cap at rest on a flat list?** Per-topic capping is meaningless once
   the headings go. Options: show newest N (20?) with a "show all" control, or keep
   grouping in the DOM but make the headings eyebrow-scale rather than 35px.
2. ~~**Aqua band — trim or move to `/about`?**~~ **RESOLVED 2026-09-26: cut it.**
   Ricky's call. Removed from the prototype; page is now ink > magenta > white >
   navy. Consequence to carry into the port: `blog-list-page.tsx` no longer reads
   `BLOG_SECTOR_KEYS`/`sectorCounts` — that band was the sector axis's only surface
   on the index. It still backs the featured badge, `blog-post-page.tsx` and
   `blog-category-page.tsx`.
3. **Do the category pages want the topic descriptions**, or do they already have
   their own intro copy? Check `components/blog/blog-category-page.tsx`.

---

## Plan

1. ~~Diagnose on the live page~~ — done, numbers above.
2. **Prototype in HTML** — fork
   `2026-09-15_dcs-inner-pages-design/prototype/blog-list.html` into this session's
   `prototype/blog-list.html`, against the same `kit.css`. Real content from
   `content/blog/*.mdx`. Nothing under `sites/dcs/` is touched at this stage.
3. Measure the prototype against the numbers in the table above; check 390px.
4. Review with Ricky.
5. Port to `components/blog/blog-list-page.tsx` + `blog-filter-section.tsx` +
   `styles/inner-pages.css`.
6. `pnpm --filter @platform/dcs run lint`, type-check, tests.
7. `/deploy.changes`.
8. `/wrap-up-session`.

---

## Files in scope (port stage)

- `sites/dcs/components/blog/blog-list-page.tsx`
- `sites/dcs/components/blog/blog-filter-section.tsx`
- `sites/dcs/components/blog/blog-category-page.tsx` (receives the topic descriptions)
- `sites/dcs/styles/inner-pages.css` (`.filterset` / `.topic` / `.row` block,
  lines ~3493–3653)
- `sites/dcs/lib/blog-topics.ts` (descriptions move, not delete)

---

## What was learned

_(to be filled at wrap-up)_

---

## Prototype results (2026-09-26)

`prototype/blog-list.html`, generated by `build-prototype.ts` (real frontmatter in,
chrome spliced from the Phase 3b prototype by line range). CSS additions in
`kit-additions-blog-r2.css` — four rules, loaded after `kit.css`, kit unedited.

Both measured through the same iframe harness, so this is like-for-like. "Before"
is the Phase 3b prototype, which carries the two-axis filter the port later dropped
— so it runs slightly taller than the live page (6,202px vs 5,686px measured live).

### Desktop, 1600 x 900

|                       | Before  | After       |                  |
| --------------------- | ------- | ----------- | ---------------- |
| Page height           | 6,202px | **4,573px** | −26%             |
| Screens               | 6.9     | **5.1**     |                  |
| Body words            | 1,012   | **512**     | −49%             |
| Post links (21 posts) | 26      | **22**      | 5 duplicates → 1 |
| Row width             | 1,450px | **1,080px** | a real measure   |
| Row padding-block     | 15.3px  | **30.6px**  | 2x               |
| Masthead              | 453px   | **396px**   |                  |
| Latest band           | 945px   | **540px**   |                  |
| Library               | 3,014px | **2,034px** |                  |
| Who it's for          | 589px   | **403px**   |                  |

### Narrow, 390 x 844

|                     | Before         | After             |                        |
| ------------------- | -------------- | ----------------- | ---------------------- |
| Page height         | 8,822px        | **5,122px**       | −42%                   |
| Screens             | 10.5           | **6.1**           |                        |
| Meta block per row  | 32px (2 lines) | **16px** (1 line) |                        |
| Horizontal overflow | none           | **none**          | `scrollWidth` 381 both |

### Behaviour, verified in the rendered page

| Action                 | Result                                         |
| ---------------------- | ---------------------------------------------- |
| At rest                | 12 rows, "Showing 12 of 21 guides"             |
| "Show all 21 guides"   | 21 rows, "Showing all 21 guides", button hides |
| Chip: Local search     | 6 rows, "Showing 6 of 21 — Local search"       |
| Chip: Design and speed | 2 rows, "Showing 2 of 21 — Design and speed"   |
| Chip: Tools and email  | 1 row                                          |
| Back to All            | 12 rows, cap reapplied                         |

---

## Decisions taken during the prototype

1. **The featured post stays in the list.** The first cut excluded it so the band
   and the index were disjoint. That broke the filter — "Design and speed" returned
   1 of the library's 2, with the other in a band 900px above. The model is now:
   **the magenta band is a spotlight, the list is the complete library.** One post
   duplicated instead of five, and it is the one being pointed at.

2. **No seven-colour topic system.** Considered as the texture fix; dropped. The kit
   has four hues total (ink, magenta, aqua, navy), so seven meant inventing three —
   and colour would then be carrying category on its own. The topic label is set in
   the single accent (magenta) and read as text. See `memory/user_colourblind.md`.

3. **Cap is 12 flat + "show all"**, replacing four-per-topic across seven blocks.
   Keeps notes-f.md §0's constraint (height is a function of the cap, not the
   library) with one control instead of seven headings. Answers "Open question 1".

4. **Aqua band removed entirely** (2026-09-26, Ricky). Trimmed to 403px first, then
   cut. Desktop 4,573px → **4,214px** (4.7 screens), words 512 → **445**; mobile
   5,122px → **4,719px** (5.6 screens). Ground sequence ink > magenta > white >
   navy, no adjacent repeat, 0 overflowing elements at 390px and 1600px.

---

## Still to do

- Review with Ricky.
- Decide Open question 2 (aqua band) and 3 (topic descriptions → category pages).
- Port to the three components + `inner-pages.css`, per "Files in scope".
- **Mobile chip group**: `.paytoggle` wraps to 196px over ~5 rows inside one pill at
  390px. Not a regression — the shipped page does the same — but a horizontal scroll
  strip would be better. Flagged, not done.

---

## Content plan

`content-plan.md` — 14 proposed posts, written 2026-09-26 off the measured gaps:
two of six services sell with zero posts behind them, four of six sectors are empty,
and 13 case studies covering six sectors go uncited. Each proposal carries a real
`category` + `sector` value and names the project or service it draws on.
