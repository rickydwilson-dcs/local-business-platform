# Teardown — eaglegb.com (Eagle E-Types)

Captured 2026-08-26. Desktop 1440×900 @2x, mobile iPhone 13, Playwright headless.
Screenshots in `research/screenshots/eagle*/` (gitignored). Raw capture data in `report.json` per label.

---

## 1. Verdict in five lines

1. **The photography is world-class and the copy is disciplined; the website around them is a 2014-vintage CMS template with a 26px H1 and no motion of any kind.**
2. Eagle does not persuade you with design — it persuades you by **giving 41% of its homepage away to other people**: Top Gear, The Intercooler, Octane, Carfection, Harry's Garage, Clarkson, an awards jury, and five press mastheads.
3. The one genuinely elevated thing on the site is the **model page** (`/274/.../eagle-lightweight-gtr`): black canvas, 3×3 macro-detail grid, short titled prose blocks, and a testimonial from the man who paid for the car.
4. Technically it is soft: 90 requests / 6.70 MB, 2.57 MB of that a 14-slide hero carousel fetched in full on load, 100% JPEG (zero WebP/AVIF), no lazy-loading, no sticky nav, ~123 characters per line of body copy.
5. **We are not beating Eagle on taste in photography. We are beating it on typography, motion, page weight, and on making a service — not a product — the hero.**

---

## 2. Section-by-section homepage anatomy

Measured top offsets at 1440×900. Content column is **1168px** inside a 1200px wrapper; document height **7175px**.
Copy below is verbatim (from `#content` DOM text, cross-checked against the rendered frames).

| #   | y-range (px) | Height | Background | What it is                                    |
| --- | ------------ | ------ | ---------- | --------------------------------------------- |
| 0   | 0–193        | 193    | `#fff`     | Header — `position: absolute`, **not sticky** |
| 1   | 193–893      | 700    | image      | Hero carousel, 13 slides, autoplay            |
| 1b  | 893–973      | ~80    | `#fff`     | Thumbnail filmstrip, 13 × 110×64              |
| 2   | 973–1153     | 180    | `#E1E6ED`  | Intro band (full-bleed)                       |
| 3   | 1153–1440    | 287    | `#fff`     | **Proof** — Top Gear quote                    |
| 4   | 1440–2040    | 600    | —          | **Proof** — Hagerty YouTube embed             |
| 5   | 2040–2135    | 95     | `#000`     | Video caption bar                             |
| 6   | 2135–2412    | 277    | `#E7F0F8`  | **Proof** — The Intercooler                   |
| 7   | 2412–2689    | 277    | `#F4F8FD`  | **Proof** — Awards                            |
| 8   | 2689–3289    | 600    | —          | **Proof** — Harry's Garage YouTube embed      |
| 9   | 3289–3629    | 340    | `#F4F8FD`  | 4-tile section nav                            |
| 10  | 3651–3730    | 79     | `#fff`     | Section title + kerned eyebrow                |
| 11  | 3730–4545    | 815    | `#fff`     | 3×2 model grid (6 cars)                       |
| 12  | 4560–4672    | 112    | `#F1F7FD`  | **Proof** — Octane pull-quote band            |
| 13  | 4672–5272    | 600    | —          | **Proof** — Carfection YouTube embed          |
| 14  | 5272–5548    | 276    | `#F4F8FD`  | Eagle Tours                                   |
| 15  | 5565–6063    | 498    | `#fff`     | 2-up news grid                                |
| 16  | 6079–6191    | 112    | `#E7F0F8`  | **Proof** — Clarkson pull-quote band          |
| 17  | 6191–6891    | 700    | image      | Goodwood House owners' gallery                |
| 18  | footer       | —      | `#000`     | **Proof** — "AS FEATURED IN" masthead strip   |

**2,960px of 7,175px — 41% of the homepage — is third-party proof.** Eagle's own product occupies ~40%; the hero ~11%.

### Verbatim copy, in document order

**§1 Hero caption** (identical on all 13 slides, `<h4>`, 19px, white on a `rgba(0,0,0,.4)` bar):

> Discover the Eagle Lightweight GTR

**§2 Intro band** — eyebrow (`.minus .uc .kern`, 12.63px, `letter-spacing: .15em`), H1 26px, body 14px:

> THE HOME OF THE EAGLE E-TYPE
>
> **Welcome to Eagle E-Types**
>
> We offer original and restored Jaguar E-Types for sale, all prepared to our exacting standards, alongside the world famous 'zero miles' Eagle E-Type restorations and Special Editions - the Speedster, Low Drag GT, Spyder GT and the Lightweight GT.

_(In-line links on "Jaguar E-Types for sale", "Eagle E-Type", "Speedster", "Low Drag GT", "Spyder GT", "Lightweight GT" — the intro paragraph doubles as the site map.)_

**§3 Top Gear** — 379px image left, 773px text right, "Read More" button:

> **"The Lightweight GTR is, more than anything, a love letter to real, intense, interactive and joyous driving".**
>
> **Jethro Bovingdon from Top Gear is mightily impressed with the Lightweight GTR.**
>
> "I have always been fascinated with Eagle. Clearly, it has a deep, unbreakable love for Jaguar's icon and over the years its special models have taken the E-Type to new heights. They allow it to unleash all the learnings it's accrued since opening in 1984 and to express its creativity, craftsmanship and engineering skill. Of which it has a lot".

**§5 Video caption bar** (white on black, centred):

> The 1961 Briggs Cunningham E-type 875027 is the start of the Lightweight E-Type story and our Lightweight GTR is the latest. Watch Henry Catchpole drive and discuss both in this beautifully produced film…

**§6 The Intercooler:**

> **The Lightweight GTR goes head to head with Low Drag GT No.5**
>
> "Two Eagle E-Types on the same day. First time I've driven either of them or any Eagle E-Type. Huge, huge expectations. and they have both blown straight past those expectations. Wow."
>
> Dan Prosser from The Intercooler drives both our Low Drag GT and Lightweight GTR for a back to back comparison.
>
> You can watch the full video below: → `Watch on YouTube`

**§7 Awards:**

> **Lightweight GTR triumphs at the 2025 International Historic Motoring Awards**
>
> **We are delighted to announce that the Lightweight GTR has been awarded Bespoke Car of the Year at the International Historic Motoring Awards held at The Peninsula, London.** These awards are considered the most prestigious accolades in the world of classic and historic motoring and the judging panel consisted of leading figures across the industry and media.

**§9 Four-tile section nav** — image + centred title + one sentence each:

> **Eagle E-Type Special Editions** — Our globally famous developments of the Jaguar E-Type.
> **Jaguar E-Types for Sale** — The finest selection of Jaguar E-Types for sale in the world today.
> **The Company** — Expert craftsmen and engineers have made their home here at Eagle.
> **E-Type News** — An insight into what's happening at Eagle E-Types.

**§10–11 Model grid** — H1 + kerned eyebrow, then 6 cards (image 379×262, title, one-line description):

> **Jaguar E-Type Special Editions**
> BY EAGLE E-TYPES
>
> **Eagle E-Type** — The 'zero mile' restoration of an original Jaguar E-Type, carried out completely in-house here at Eagle.
> **Eagle Speedster** — Our acclaimed homage to the spirit of the Jaguar E-Type - again created from a period original.
> **Eagle Low Drag GT** — Both a hugely capable sports car and long range continental tourer, inspired by the design genius of Malcolm Sayer.
> **Eagle Spyder GT** — The poise and performance of the Low Drag GT combine with the exquisite styling of the Speedster to offer the best of both worlds.
> **Eagle Lightweight GT** — Developed in-house as the ultimate road-going evolution of one of the world's rarest and most beautiful racing cars.
> **Eagle Lightweight GTR** — Bringing the groundbreaking Lightweight GT even closer to it's uncompromising racing heritage.

**§12 Octane pull-quote band** (statement 19px/600 centred, attribution 12.63px uppercase `.kern`):

> It's a driving experience that lives up to the looks. And that's saying something.
>
> HENRY CATCHPOLE DRIVES THE LIGHTWEIGHT GT / OCTANE MAGAZINE / JUNE 2020

**§14 Eagle Tours:**

> EAGLE TOURS
>
> **American Eagle 2025**
>
> We drove through deserts, past mountains, along dramatic coastlines and though towering redwood forests as we made our way along the beautiful California coast on this 11 day Eagle tour.
>
> Once more in partnership with Tour de Force, this was a prime example of how Eagle ownership can offer up a world of excitement and adventure!

**§15 News, 2-up:**

> **Announcing the Eagle Lightweight GT** — We're delighted to announce that our fourth 'Special Edition' Jaguar E-Type has launched. The Eagle Lightweight GT is the ultimate road-going evolution of one of the world's rarest and most beautiful race cars, Jaguar's Lightweight E-Type.
>
> **Eagle Lightweight GT Reviews** — The reviews are arriving for our new Special Edition E-Type - including a brilliant short film from Henry Catchpole at Carfection a wonderful Andrew Frankel review and high praise from Forbes magazine.

**§16 Clarkson pull-quote band:**

> I think this, by a long way, is the most beautiful car I have ever seen. It might actually be the most beautiful thing I have ever seen.
>
> JEREMY CLARKSON / BBC TOP GEAR / JUNE 2011

_(Note: the double space after "seen." is in the source. The quote is 15 years old and still doing the heaviest lifting on the page.)_

**§17 Closing gallery alt text:**

> Eagle E-Types & Jaguar E-Type Special Editions at Goodwood House

**§18 Footer:**

> AS FEATURED IN — [BBC · The Sunday Times · The Sunday Telegraph · The Mail on Sunday · Top Gear]
>
> Eagle E-Types on Facebook / Instagram Feed / Privacy Policy / Work at Eagle
> +44 (0) 1825 830 966 · sales@eaglegb.com

---

## 3. The systems, with numbers

### Platform / stack

| Signal                                             | Evidence                                                                                                                                                                                                    |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bespoke CMS, not WordPress/Squarespace/Webflow** | Assets on `basethree.s3.eu-west-1.amazonaws.com`; images on `d13fy1xtnzm9jo.cloudfront.net`; HTML served by AWS API Gateway (`x-amz-apigw-id`, `x-amzn-requestid`) behind CloudFront. No `meta[generator]`. |
| **Content is a JSON blob rendered client-side**    | Page body carries nested arrays like `["h1 ac","Welcome to Eagle E-Types"]`; **0 `<img>` tags in the served HTML**, 14 after JS runs. Only 2 `<h1>` and 4 `<h2>` in source.                                 |
| **Zero JS frameworks, zero animation libraries**   | `report.json → libs: []`, `animated: []`. No `<script src>` in served HTML at all — GA/GTM are injected at runtime.                                                                                         |
| **All CSS inline**                                 | 4 `<style>` blocks, **8,417 bytes total** for the entire site's CSS.                                                                                                                                        |
| **On-the-fly image resizing exists**               | `/{key}/{w}x{h}` on the CDN 307s to `execute-api…/a/resize`. They have the tool and mostly don't use it (see media, below).                                                                                 |

**Ceiling this allows:** static-ish pages, a stock gallery widget, a modular type scale, coloured bands, and image grids. It cannot do scroll-linked motion, sticky sequences, video backgrounds, responsive `srcset`, or modern image formats. **Everything premium about Eagle happens in the photography and the copy, because the platform contributes nothing.** That is the gap we are walking through.

### Type system

Two Google families, one axis of weight each. Total webfont payload **55.3 KB** (Open Sans 42.9 KB + Assistant 12.3 KB).

- **Headings:** `Assistant`, weight **600 only**. No 300/400/700 loaded.
- **Body:** `Open Sans`, weight **400** (600 for bold runs). Loaded as `600,400,400i`.
- **Roboto 34.7 KB** also loads — that is the YouTube player, not Eagle's choice.

The ladder is a machine-generated modular scale at a ratio of **≈1.108** (a minor second — punishingly tight):

| Role                        | Desktop     | Line-height | Mobile   |
| --------------------------- | ----------- | ----------- | -------- |
| `.minus` (eyebrow, caption) | **12.63px** | 22.82       | 12.47    |
| `p`, `.field` (body)        | **14px**    | 23.56       | 14       |
| `h6`                        | 15.52       | 24.38       | 15.71    |
| `h5`                        | 17.21       | 25.29       | 17.64    |
| `h4` (hero caption)         | 19.08       | 26.30       | 19.80    |
| `h3`                        | 21.15       | 27.42       | 22.22    |
| `h2`                        | 23.45       | 28.66       | 24.95    |
| `h1`                        | **26px**    | 30.04       | **28px** |

**Eight sizes spanning 12.63px → 26px. A 2.06× range for a business selling million-pound cars.** For comparison, an editorial hero H1 at this brand tier is normally 64–120px. Eagle's mobile H1 (28px) is _larger_ than its desktop H1 (26px) — the scale is viewport-interpolated, not art-directed.

**Letter-spacing:** exactly one rule exists — `.kern { letter-spacing: 0.15em }`, applied only to uppercase eyebrows (`THE HOME OF THE EAGLE E-TYPE`, `BY EAGLE E-TYPES`, `EAGLE TOURS`, `AS FEATURED IN`, and every quote attribution). Everything else is `normal`. **This one device is doing all the "luxury" work in the typography, and it works.**

**Measure is broken.** Body text at 14px runs the full 1168px column: a 246-character paragraph sets in 2 lines — **~123 characters per line** against an optimal 60–75. The two-column proof blocks (773px) land at ~116 chars. Only the card grids (379px, ~40 chars) and the tighter tiles (280px) are readable at a comfortable measure.

### Palette

| Value                             | Role                                                                                          |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `#262626` / `#252526` / `#242526` | Body and heading text (three near-identical greys — CMS artefact, not intent)                 |
| `#FFFFFF` / `#FEFEFE`             | Page ground, reversed text                                                                    |
| `#000000`                         | Video caption bars, footer                                                                    |
| `#91A1B3`                         | Form fields, placeholders, secondary UI                                                       |
| **`#B74426`**                     | **The only chromatic accent on the site** — a 3px burnt-orange rule directly under the header |
| `#E1E6ED`                         | Intro band                                                                                    |
| `#E7F0F8`                         | Alternating band (Intercooler, Clarkson)                                                      |
| `#F4F8FD`                         | Alternating band (awards, tiles, tours)                                                       |
| `#F1F7FD`                         | Alternating band (Octane)                                                                     |
| `rgba(0,0,0,.4)`                  | Hero caption scrim (14 instances)                                                             |

**Four pale blue-greys separated by 3–5 points of luminance.** On screen the alternation reads as banding noise, not as rhythm — you cannot tell `#F4F8FD` from `#F1F7FD` (see `desktop-02.png`, `desktop-06.png`). The single orange rule is the only saturated colour above the fold and it fights the photography rather than supporting it.

### Motion inventory

The entire CSS carries **two transitions and zero keyframes**:

| Rule                                                  | Where                | Duration / easing      |
| ----------------------------------------------------- | -------------------- | ---------------------- |
| `transition: transform 200ms ease-out, opacity 300ms` | Gallery slide change | 200/300ms, `ease-out`  |
| `transition: background .2s`                          | Button hover         | 200ms, browser default |

- `@keyframes`: **0**
- `transform` used for layout/3D: 1 (`transform-style: preserve-3d` on the gallery)
- Scroll-reveal / parallax instrumented selectors: **0** (`report.json → animated: []`)
- GSAP / ScrollTrigger / Lenis / Locomotive / AOS / Framer Motion: **none detected**

**There is no bespoke motion. There is no stock preset library either. There is a slideshow.** The autoplaying 13-slide hero carousel is the only thing that moves on the page, and it is the least premium pattern in the whole document — a 2012 device with visible `1 / 13` counter, chevrons, a fullscreen icon and a pause button (`desktop-hero.png`).

### Media strategy

**Photography (the genuinely excellent part).** Two consistent registers:

1. **Rolling shots on empty upland roads at golden hour** — long lens, heavy background blur, car small-to-medium in a large landscape. Composition gives the car air. (`desktop-hero.png`, `desktop-00.png`, `desktop-04.png`.)
2. **Studio on seamless grey/black with a single soft top light** — pure profile, generous negative space, gradient floor. (`eagle-gtr/desktop-hero.png`, `eagle-gtr/desktop-04.png`.)
3. **Macro detail** — bonnet louvres, painted badge under lacquer, a lightning-bolt switch decal, a wheel centre cap. Nine of these in a 3×3 grid on the GTR page (`eagle-gtr/desktop-05.png`). **This is the strongest single page module on the site.**

**Crops and aspect ratios.** Card images are served at fixed ratios: `450×290` (1.55:1) for news, `450×312` (1.44:1) for the model grid, `700×428` (1.64:1) for the 2-up. Hero is 1440×700 (2.06:1). Rendered card size is 379×262. No art direction per breakpoint — the same crop is used everywhere.

**Delivery — the weak point.**

| Metric                          | Measured                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------- |
| Total requests                  | **90**                                                                           |
| Total transfer                  | **6.70 MB**                                                                      |
| Eagle's own CDN                 | 29 requests, **2.94 MB**                                                         |
| YouTube ecosystem               | 46 requests, **3.21 MB**                                                         |
| Image formats from Eagle        | **28 × JPEG, 0 WebP, 0 AVIF** (the 3 WebPs are YouTube's own poster frames)      |
| `loading="lazy"` on any `<img>` | **0 of 14** — all report `loading: "auto"`                                       |
| Hero carousel fetched on load   | **14 slides at `/1800x`, 2,635 KB** — before the visitor has scrolled or clicked |
| Largest single image            | 442.5 KB (`/1592468788468/1800x`)                                                |
| Fonts                           | 55.3 KB (Eagle) + 34.7 KB Roboto (YouTube)                                       |

**The most avoidable waste:** the 13 thumbnails in the filmstrip render at **110×64 CSS px** and are painted from the **same `/1800x` JPEG** as the hero (`eagle-net.json → bgs[]`). The CDN will happily serve `/110x64` — I confirmed the endpoint resolves — they just never ask for it. The hero and the filmstrip together account for **39% of the entire page weight**.

**Video.** Three YouTube iframes, all `600px` tall, all loaded eagerly at page load, all third-party journalist films (Hagerty, Harry's Garage, Carfection). One uses `youtube-nocookie`, two do not. There are **zero self-hosted `<video>` elements on the site** (`report.json → videos: []`). Eagle's moving image is entirely other people's.

---

## 4. The proof / credibility machine

This is what the client's director actually responded to, whether or not he could name it. It is not a testimonial section — it is a **structural commitment**: proof is interleaved _between_ every piece of Eagle's own content, so you never read two Eagle claims in a row without a third party vouching in between.

**The order of the homepage, stripped to who is speaking:**

1. Eagle (hero) → 2. Eagle (intro, 180px) → 3. **Top Gear** → 4. **Hagerty film** → 5. **The Intercooler** → 6. **Awards jury** → 7. **Harry's Garage film** → 8. Eagle (nav tiles) → 9. Eagle (model grid) → 10. **Octane** → 11. **Carfection film** → 12. Eagle (tours) → 13. Eagle (news) → 14. **Clarkson** → 15. Eagle (owners at Goodwood) → 16. **Five press mastheads**

**Eagle gets 180px of self-description before the first outside voice arrives.** The first thing below the fold is a journalist.

**The five distinct proof formats, and how much room each gets:**

| Format                    | Height    | Anatomy                                                                                                                                                                                                                                        |
| ------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Quote + context block** | 277–287px | 379px image left; 773px text right. Pull-quote as H2 (23px/600), one bold line naming the journalist and outlet, then 3–4 lines of their verbatim prose, then a button.                                                                        |
| **Full-width video**      | 600px     | Bare YouTube embed, edge to edge of the 1200px column, **no frame, no title, no chrome of Eagle's own**. The video's own title bar ("Harry's garage", "Carfection", "Hagerty") is left visible — the third-party branding _is_ the credential. |
| **Black caption bar**     | 95px      | White centred text under one video only, explaining why the film matters.                                                                                                                                                                      |
| **Pull-quote band**       | **112px** | Full-bleed pale band. Statement at 19px/600 centred, then attribution at 12.63px uppercase, `.15em` tracking, in the form `NAME / OUTLET / MONTH YEAR`. Nothing else. No photo, no link, no button.                                            |
| **Masthead strip**        | ~73px     | Footer, on black, under a kerned `AS FEATURED IN`. Five logos in their own typefaces.                                                                                                                                                          |

**Five things that make it work:**

1. **Attribution is always specific and always dated.** `HENRY CATCHPOLE DRIVES THE LIGHTWEIGHT GT / OCTANE MAGAZINE / JUNE 2020`. Never "a leading magazine". The date is confident, not defensive — Clarkson's quote is from **June 2011** and still leads the section above the footer.
2. **The quotes are hedged and specific, not superlative.** "and they have both blown straight past those expectations. Wow." reads like a person, not a marketing department. Even the punctuation errors are preserved verbatim.
3. **The pull-quote band is 112px tall.** It costs almost nothing and it appears twice. Proof does not have to be a section; it can be a divider.
4. **The award is written as news, not as a badge.** A headline, a bolded fact sentence, then a paragraph explaining _why the award is hard to win_ ("the judging panel consisted of leading figures across the industry and media"). No trophy graphic.
5. **The commissioning client speaks.** On the GTR page (`eagle-gtr/desktop-06.png`), in italic, over two paragraphs, attributed `THE LIGHTWEIGHT GTR COMMISSIONING CLIENT, OCTOBER 2025`:

   > "Today's performance cars are getting increasingly big and heavy, relying on advanced electronics to disguise the mass. I'm not sure those cars will age very well, so I commissioned Eagle to build me the antithesis: a car that is as light as possible without sacrificing comfort, devoid of screens or other electronics."
   >
   > "With incredible performance, long-distance comfort and timeless beauty, I couldn't be happier with the result."

   This is the single most valuable pattern on the site for DPM, and it is the one Eagle uses _least_.

---

## 5. What to steal — and what does not transfer

### Steal (specific, implementable)

**S1. The interleave rule.** Never let two DPM claims sit adjacent without a third party between them. On the homepage that means: hero → one short paragraph of who we are → **Halcyon** → work → **NEC Classic Motor Show** → work → **DB6 press** → work → masthead strip. Eagle's ratio is 41% proof; ours should be at least a third.

**S2. The 112px pull-quote band.** Full-bleed, one statement, one attribution line in the exact form `NAME / OUTLET / MONTH YEAR`, uppercase, `letter-spacing: .15em`. Cheap, repeatable, and it is where most of Eagle's perceived class comes from. Use it for the Halcyon relationship and for whichever DB6 coverage names DPM.

**S3. `.kern` as the only luxury device in the type system.** One uppercase, 0.15em-tracked micro-label per section, sitting _above_ the heading. Eagle proves you can run an entire premium brand on two fonts and one letter-spacing rule. We will use a much bigger scale than they do — but this device comes with us.

**S4. The GTR page structure, wholesale, as the DPM project page.** Black canvas → hero studio profile → two-up image + 40-word titled block (`Traditionally Radical`, `Born Ready`) → full-bleed studio shot → titled prose (`Form Follows Function`) → **3×3 macro-detail grid** → titled prose → owner testimonial → interior shot. For a paint and panel shop this is nearly perfect: the 3×3 macro grid is _exactly_ how you show reflection quality, panel gaps, badge lacquer, and shut-line consistency. Eagle uses it for a car; DPM uses it for a finish.

**S5. Dated, named, hedged attribution.** Copy the format literally. No "world-class", no "renowned". A name, an outlet, a month, a year.

**S6. The award written as news.** Headline → one bolded fact sentence → a paragraph explaining why the thing is hard to win. Applies directly to NEC Classic Motor Show placement.

**S7. The owner's voice.** Eagle's strongest single block is the commissioning client's two paragraphs. DPM's equivalent — the owner of the pink DB6, or a concours customer — should not be a starred card in a carousel. It should be two italic paragraphs, given a whole section, dated.

**S8. The four-tile section nav (§9) and the About page's 8-tile grid.** Eagle splits its company story into named chapters — `Why Choose Eagle?`, `Service & Support`, `Meet the Eagle Team`, `The History of Eagle`, `Building an Eagle E-Type`, `Questions We're Asked`. Each is one image, one title, one sentence. It scales, it is SEO-friendly, and it lets a director tell a long story without a wall of text.

**S9. The intro paragraph as a site map.** Eagle's 40-word welcome contains six inline links. It orients and routes in one move.

**S10. The closing owners' photograph.** ~25 cars and their owners in black tie on the lawn at Goodwood House (`desktop-07.png`). One image that says _there is a community of people who chose us_. DPM's equivalent is a show stand or a lineup of finished cars — worth commissioning if it does not exist.

### Does NOT transfer — because Eagle sells product and DPM sells service

**N1. The model grid.** Eagle's six named Special Editions are a **catalogue**: fixed, repeatable, purchasable objects with a page each. DPM has no catalogue. Every job is one-off. Ported naively, this becomes a "Our Services" grid — Paintwork / Panel / Fabrication / Assembly — which is the generic trade-site pattern the client is trying to escape. **The DPM equivalent of the model grid is a projects index, and its cards are cars belonging to other people, not products.** That changes the copy from "what you can buy" to "what we did, and to what".

**N2. "Jaguar E-Types For Sale."** Eagle can put stock on the site with a POA and a SOLD flag. DPM has no inventory. Do not build a stock page. **The nearest legitimate transfer is a _capacity_ signal** — "currently booking Q2", "three bays, two long-term restorations at a time" — which does the same scarcity work without pretending to be a dealer.

**N3. Eagle Tours.** A product-ownership community programme. It only exists because Eagle owns a marque and a customer base of people who own the same object. DPM's customers own unrelated cars. Do not invent a DPM tour.

**N4. The spec-sheet voice.** "At just 930kg… magnesium, inconel, titanium, carbon fibre, aluminium, and lithium… 430 bhp/ton… adjustable Öhlins… carbon-ceramic… AP Racing callipers." This is engineering-product copy and it lands because Eagle _built_ the object. **DPM's technical register is different and arguably richer: process, hours, materials, tolerance.** Paint system and number of coats, hours in flatting, panel gap tolerance in millimetres, how many coats of lacquer before cutting back, what "concours" means as a measurable standard. Same _density_, different nouns. Do not import Eagle's nouns.

**N5. "1 of 1" / edition scarcity.** Eagle's scarcity is manufactured and owned. DPM's scarcity is _time and bay space_, which is real but must be framed honestly.

**N6. The 1984 founding date as the whole heritage play.** Eagle leans on 40 years of building the same car. DPM's heritage claim will be different in kind — the Halcyon relationship, show record, and specific marques. **Do not fake a lineage; use the relationships.**

**N7. Journalist video, one-for-one.** Eagle gets three 600px films for free because press want to drive a £1M car. DPM will not get a Harry's Garage film. **The transferable substitute is process film DPM can shoot itself** — a panel being flatted, a colour being mixed, a reflection walking down a wing — which is _more_ persuasive for paintwork than a road test, and which we can lazy-load properly instead of paying YouTube's 3.21 MB.

---

## 6. Where it is beatable — precisely

Ordered by how visible the win is to a non-designer looking at both sites side by side.

**B1. Typographic scale. The single biggest, cheapest win.**
Eagle's largest type anywhere on the site is **26px**. Their ladder spans 12.63px→26px, a 2.06× range, on a minor-second ratio of 1.108. Nothing on the page has presence; every heading is the same size as every other heading. A hero statement at 72–110px with a real scale (1.33–1.5 ratio, four or five deliberate steps rather than eight machine-generated ones) will read as a different class of business in the first half second. _Evidence: `eagle.css` `h1{font-size:26px}`; `report.json → headings[]` all 21–26px._

**B2. Measure. A correctness failure, not a taste one.**
14px body copy running the full 1168px column at **~123 characters per line**. Cap measure at 65–72ch and the same words become readable. _Evidence: `_tmp-anat` measure output — `{w:1168, fs:14px, chars:246, lines:2}`._

**B3. No sticky navigation on a 7,175px page.**
`#top` is `position: absolute`, height 193px. Once you are 2,000px down, the only way to navigate is to scroll back to the top. On the GTR page (8,584px) it is worse. _Evidence: `_tmp-anat → header:{pos:"absolute"}`._

**B4. The hero carousel is the weakest thing on the site.**
13 autoplaying slides with a `1 / 13` counter, chevrons, a fullscreen button and a pause button. It is the first thing a visitor sees and it is a 2012 pattern. It also costs 2.57 MB. Replace with one held image (or one lazily-gated clip) and a single line of type, and the fold immediately reads more expensive. _Evidence: `desktop-hero.png`, `mobile-hero.png`, `eagle-net.json`._

**B5. 2.57 MB of hero JPEGs on load; the 110×64 thumbnails are painted from the 1800px file.**
Their own CDN serves arbitrary sizes (`/110x64` resolves) and they do not use it. Zero WebP/AVIF; zero `loading="lazy"` on 14 `<img>`. Serving AVIF at correct sizes and gating below-fold media behind an IntersectionObserver — the pattern already proven on DCS (10.5 MB → ~700 KB) — puts DPM an order of magnitude ahead on a metric the client can be shown. _Evidence: `eagle-net.json` — 28 JPEG / 0 WebP; `imgs[].loading == "auto"` for all 14._

**B6. YouTube is 3.21 MB across 46 requests — 48% of the page.**
Three eagerly-loaded iframes, only one on `youtube-nocookie`. A poster-image facade that swaps in the iframe on click costs ~40 KB and looks identical.

**B7. Motion: there is none.**
Two transitions, zero keyframes, zero scroll instrumentation. Restrained is defensible; _absent_ is not the same as restrained. Disciplined entrance reveals, a held sticky project panel, and a genuine crossfade will not read as "more animated" — they will read as _made_.

**B8. Four indistinguishable pale-blue bands.**
`#E1E6ED`, `#E7F0F8`, `#F4F8FD`, `#F1F7FD` — 3–5 points of luminance apart. The alternation reads as noise. A real light/dark rhythm (Eagle only goes dark on the GTR page, where it is markedly better) is a free upgrade. The `#B74426` orange rule under the header is the only saturated colour above the fold and it clashes with the photography.

**B9. Semantics and accessibility are weak under the surface.**
The GTR page carries **four `<h1>`s** — including one that just reads "1 of 1". The served HTML contains **zero `<img>` tags** (content is client-rendered from a JSON blob), so the 17 hero/filmstrip images are CSS backgrounds with **no alt text** — only non-semantic `data-alt` attributes. The "AS FEATURED IN" strip is **one flattened 1400×88 raster** of five press logos with a single alt string, rendered at 1168px — soft on any retina display, and none of the five is individually linkable or crawlable. _Evidence: `eagle-gtr/report.json → headings[]`; `eagle-net.json → bgs[].alt == null`; `imgs[12]`._

**B10. Photographic inconsistency between tiers.**
The Special Editions are shot to a commissioned art direction. The _E-Types For Sale_ cars are shot on a lawn in flat daylight with visible foreground grass and cluttered hedges (`eagle-forsale/desktop-01.png`). A visitor moving from one page to the other feels the drop. **For DPM this is the trap to avoid**: a project index is only as expensive as its worst photograph, so a shot discipline that applies to _every_ car — not just the flagship — is itself a differentiator.

**B11. Minor factual wobble.** The GTR page states "At just 930kg the Lightweight GTR is more than 30% lighter than an E-Type Roadster" and, three sections later, "a kerb weight of just 975kg with fluids". Both are probably true (dry vs wet) but nothing on the page says so. _Assumption, flagged as such._ Worth noting only because DPM's numeric claims — coats, hours, tolerances — must survive the same scrutiny.

---

## 7. Evidence log

| Claim                                                                                               | Evidence                                                                                                     |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Hero carousel: 13 slides, counter, chevrons, pause, fullscreen; 3px orange rule; centred nav        | `screenshots/eagle/desktop-hero.png`, `desktop-00.png`, `mobile-hero.png`                                    |
| Thumbnail filmstrip under hero                                                                      | `screenshots/eagle/desktop-01.png` (top edge), `mobile-hero.png`                                             |
| Intro band + first proof block (Top Gear) immediately below                                         | `screenshots/eagle/desktop-01.png`                                                                           |
| Hagerty embed + black caption bar + Intercooler + awards                                            | `screenshots/eagle/desktop-02.png`                                                                           |
| Harry's Garage embed + 4-tile section nav                                                           | `screenshots/eagle/desktop-03.png`                                                                           |
| Model grid (6 Special Editions)                                                                     | `screenshots/eagle/desktop-04.png`                                                                           |
| Octane pull-quote band + Carfection embed                                                           | `screenshots/eagle/desktop-05.png`                                                                           |
| 2-up news grid + Clarkson pull-quote band                                                           | `screenshots/eagle/desktop-06.png`                                                                           |
| Goodwood owners' photograph + "AS FEATURED IN" footer strip                                         | `screenshots/eagle/desktop-07.png`                                                                           |
| GTR page: studio hero, 14-slide gallery                                                             | `screenshots/eagle-gtr/desktop-hero.png`                                                                     |
| GTR page: Octane quote band, journalist embed                                                       | `screenshots/eagle-gtr/desktop-01.png`, `desktop-02.png`                                                     |
| GTR page: black canvas, "1 of 1", two-up titled blocks                                              | `screenshots/eagle-gtr/desktop-03.png`                                                                       |
| GTR page: full-bleed studio profile + "Form Follows Function"                                       | `screenshots/eagle-gtr/desktop-04.png`                                                                       |
| GTR page: **3×3 macro-detail grid**                                                                 | `screenshots/eagle-gtr/desktop-05.png`                                                                       |
| GTR page: **commissioning client testimonial**, verbatim + date                                     | `screenshots/eagle-gtr/desktop-06.png`                                                                       |
| About page: 8-tile company-story grid, Top Gear visit block                                         | `screenshots/eagle-about/desktop-01.png`, `desktop-02.png`                                                   |
| For-sale page: card grid, POA/SOLD, weaker photography tier                                         | `screenshots/eagle-forsale/desktop-01.png`                                                                   |
| Fonts, colours, type scale tally, headings, iframes, `libs: []`, `animated: []`                     | `screenshots/eagle/report.json` (+ `eagle-gtr`, `eagle-about`, `eagle-forsale`)                              |
| Four H1s on the GTR page, incl. "1 of 1"                                                            | `screenshots/eagle-gtr/report.json → headings[]`                                                             |
| Type ladder 12.63→26px, `.kern .15em`, families/weights                                             | Inline `<style>` blocks in served HTML (extracted, 8,417 bytes)                                              |
| Palette hex values                                                                                  | Same, colour tally                                                                                           |
| Motion: 2 transitions, 0 keyframes                                                                  | Same, `transition`/`@keyframes` grep                                                                         |
| Platform: AWS API Gateway + CloudFront, `basethree` S3, JSON-rendered content, 0 `<img>` in source  | `curl -D` response headers; grep of served HTML (`<script src>`: 0, `<img`: 0, `<h1`: 2)                     |
| 90 requests / 6.70 MB; 28 JPEG / 0 WebP; 0 lazy; hero 14×1800x = 2,635 KB; YouTube 46 req / 3.21 MB | Playwright network capture, full-page scroll (`eagle-net.json`)                                              |
| CDN supports on-demand resize but filmstrip requests `/1800x`                                       | `curl -I .../110x64` → 307 to `execute-api…/a/resize`; `eagle-net.json → bgs[]` all `/1800x` at `w:110,h:64` |
| Header `position: absolute`, 193px; content column 1168px; doc 7175px; section offsets              | Playwright measurement pass (§2 table)                                                                       |
| Measure ~123 chars/line                                                                             | Same pass: `{w:1168, fs:14px, chars:246, lines:2}`                                                           |
| Verbatim copy                                                                                       | `#content` DOM text extraction, cross-checked against every desktop frame                                    |

**Explicit assumptions (not measured):**

- That the CMS is Base Three's product is inferred from the `basethree.s3.eu-west-1.amazonaws.com` asset host and the JSON-array content format; there is no `meta[generator]` to confirm it.
- The 930kg / 975kg discrepancy is _assumed_ to be dry vs. wet weight; the page does not say.
- Transfer sizes are `content-length` header sums; they are compressed-over-the-wire figures and exclude any response that omitted the header (4 image responses, all 0-length redirects).
