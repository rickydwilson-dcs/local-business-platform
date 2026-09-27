# DCS blog — what to write next

**Date:** 2026-09-26
**Why now:** the `/blog` restructure removed the seven topic descriptions and the
"who it's for" band, so the index is now carried entirely by the posts themselves.
Thin topics have nowhere left to hide.

---

## The gaps, counted

### By topic — `category` frontmatter, all 21 posts

| Topic                | Posts |                             |
| -------------------- | ----- | --------------------------- |
| Local search         | 6     | healthy                     |
| Site content         | 3     |                             |
| Sector guides        | 3     |                             |
| Getting found        | 3     |                             |
| Costs and value      | 3     |                             |
| **Design and speed** | **2** | thin                        |
| **Tools and email**  | **1** | one post holds a whole chip |

### By sector — `sector` frontmatter

| Sector                        | Posts |
| ----------------------------- | ----- |
| Trades and contractors        | 20    |
| Motorsport and teams          | 1     |
| **Retail and eCommerce**      | **0** |
| **Studios and practitioners** | **0** |
| **Professional and property** | **0** |
| **Creative and B2B**          | **0** |

### By service sold — how many posts mention it

| Service                   | Posts   |
| ------------------------- | ------- |
| Local SEO                 | 6       |
| Website design            | several |
| Google Workspace          | 1       |
| **eCommerce**             | **0**   |
| **Analytics & reporting** | **0**   |
| **Ongoing management**    | **0**   |

**Half the service menu has no blog behind it.** `/services/ecommerce`,
`/services/analytics` and `/services/monthly-management` each sell something the
library never explains.

### The asset that is going unused

There are **13 case studies** in `content/projects/`, covering six sectors:

| Project                                                                     | Sector it evidences |
| --------------------------------------------------------------------------- | ------------------- |
| Cuddle Plush Fabrics — eCommerce growth over five years                     | Retail              |
| Luna Landings — made-to-order eCommerce                                     | Retail              |
| The Clothing Kings — custom apparel store                                   | Retail              |
| Sanctuary Ida — yoga school booking platform                                | Studios             |
| Nicola Noble Tuition — online learning platform                             | Studios             |
| Silvero Homes — luxury property agency                                      | Property            |
| Mad Graphics — marketing agency redesign                                    | Creative            |
| DJ Fox, Colossus, DCH, Bexhill Removals, plumber rebuild, painter/decorator | Trades              |

**The portfolio already proves work in six sectors. The blog speaks to one.** Every
post below is anchored to a real project or a real service — none of it needs to be
invented, and "proof of work does the selling instead of adjectives" is the library's
own stated position (`TOPIC_DESCRIPTIONS['website-content']`).

---

## The list — 14 posts

Ordered by how much each one closes. Topic slugs are real `category` values; sector
slugs are real `BLOG_SECTOR_KEYS` values, so each entry can be written straight into
frontmatter.

### Tier 1 — opens an empty sector, with a case study behind it

**1. What an online shop needs before it can sell anything**
`industry-guides` / `retail` — Evidence: Cuddle Plush Fabrics, Luna Landings, The
Clothing Kings. The retail equivalent of the plumber/electrician/scaffolder trio that
already exists. Opens the Retail chip and the eCommerce service in one post.

**2. Five years of one online shop: what actually moved the numbers**
`costs-and-value` / `retail` — Evidence: Cuddle Plush Fabrics, explicitly a
five-year engagement. The strongest long-run proof on the site and nothing points at
it. Also the natural home for the Analytics service.

**3. Taking bookings on your own site instead of through a platform**
`business-tools` / `studios` — Evidence: Sanctuary Ida. Doubles the thinnest topic
and opens the Studios chip. Genuine search demand — every practitioner paying a
platform percentage has asked this.

**4. What a practitioner's website has to do that a trade's doesn't**
`industry-guides` / `studios` — Evidence: Sanctuary Ida, Nicola Noble Tuition.
Directly answers the library's own claim that "a scaffolder's site and a fabric
shop's have more in common than either would guess" — which currently has no post
demonstrating it.

**5. Selling a high-value service without putting a price on it**
`website-content` / `property` — Evidence: Silvero Homes. Opens Property. The
counterweight to "How much does a tradesperson website cost?", which is the
library's most price-transparent post.

**6. When the website is the pitch: what agencies get wrong on their own site**
`industry-guides` / `creative` — Evidence: Mad Graphics redesign. Opens Creative.

### Tier 2 — covers a service that sells with nothing behind it

**7. Do you actually need an online shop, or just a website?**
`costs-and-value` / `retail` — the qualifying question for `/services/ecommerce`.
Honest-answer format, which is this library's voice.

**8. The four numbers worth watching on your website**
`business-tools` / `trades` — for `/services/analytics`. Third post into the
one-post topic.

**9. What you're actually paying for with ongoing website management**
`costs-and-value` / `trades` — for `/services/monthly-management`. Pairs with the
existing "Pay monthly vs upfront", which sets up the question and never answers
what the monthly buys.

### Tier 3 — fills the thin topics

**10. Getting off a @gmail address without breaking your email**
`business-tools` / `trades` — the practical companion to the existing Google
Workspace post, which explains the what and not the migration.

**11. Why your site feels slow even though it loads fast**
`website-design` / `trades` — Evidence: the lazy-video work on the DCS homepage
(10.5MB → ~700KB) and the NP Racing audit. Perceived vs measured performance.

**12. What a website redesign should keep**
`website-design` / `creative` — Evidence: Mad Graphics, the WordPress-to-platform
rebuild. What survives a rebuild, and what people throw away by accident.

**13. What a race team's website has to survive on a race weekend**
`industry-guides` / `motorsport` — Evidence: NP Racing. Takes Motorsport off one
post, so the existing case study stops being an orphan.

**14. Nobody is searching for your business name yet**
`getting-found-online` / `trades` — the zero-visibility starting position. The
topic's three existing posts all assume some traffic already exists.

---

## What this does to the numbers

**Topics** — 21 → 35 posts, and no chip left holding one post:

| Topic            | Now | After |
| ---------------- | --- | ----- |
| Local search     | 6   | 6     |
| Sector guides    | 3   | **7** |
| Costs and value  | 3   | **6** |
| Tools and email  | 1   | **4** |
| Site content     | 3   | **4** |
| Design and speed | 2   | **4** |
| Getting found    | 3   | **4** |

**Sectors** — all six populated for the first time:

| Sector                    | Now | After |
| ------------------------- | --- | ----- |
| Trades and contractors    | 20  | 26    |
| Retail and eCommerce      | 0   | **3** |
| Studios and practitioners | 0   | **2** |
| Motorsport and teams      | 1   | **2** |
| Professional and property | 0   | **1** |
| Creative and B2B          | 0   | **1** |

**Services** — every one of the six has at least one post pointing at it.

---

## Two things that follow from this

1. **The sector filter becomes worth re-opening.** It was declined on 2026-09-19
   (commit `84cc16f9`) for a good reason: 20 of 21 posts sat under one chip. At the
   distribution above, six chips all have posts and the axis starts doing work. Not
   a decision for now — a note that the reason it was declined expires once Tier 1
   lands. See `lib/blog-sectors.ts`'s own header, which is explicit that the file is
   "not an invitation to re-add one".

2. **Don't write location-led posts.** There are 8 location pages doing that job at
   `/locations/*`. Blog posts per town would compete with them for the same terms and
   read as filler. The library's strength is that it is problem-led, not place-led.

---

## Suggested order

Tier 1 posts 1, 3 and 5 first — one post each into Retail, Studios and Property
takes the sector axis from unusable to usable faster than anything else, and all
three have a finished case study to draw on. Then 2 and 7 (eCommerce service), then
Tier 2, then Tier 3.
