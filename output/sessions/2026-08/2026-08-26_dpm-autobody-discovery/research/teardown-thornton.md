# Teardown — P&K Thornton Restorations (thorntonrestorations.com)

**Captured:** 2026-08-26. Desktop 1440×900 @2x, mobile iPhone 13, via
`research/tools/capture-site.mts`. Pages captured: `/` (12 frames), `/restore`, `/coachwork`,
`/projects`, `/projects-feed/xk120-complete-bodywork-restoration`.
Screenshots in `research/screenshots/thornton*` — **gitignored, local only**.

---

## 1. Verdict in five lines

1. **It is not the light one.** The body ground is a flat mid-grey `#636363` with white type;
   the only white surface is the header bar. Our first read had this backwards.
2. **The photography is the best thing on the domain** — real workshop process shots, macro
   detail, one genuinely expensive exploded-view hero — and the grey ground actively fights it.
3. **The IA is the most useful thing here for DPM**: nine service pages, a 35-entry project
   archive with model taxonomy, a news feed, and a separate sub-brand. This is a service business
   modelled properly.
4. **The restoration-story pattern is the prize.** A project article is a chronological workshop
   log: stage → prose → 3-up image row, technically specific, honest about problems. Nobody else
   in the reference set does this.
5. **Execution is a Squarespace template with the volume down.** Zero bespoke motion, body copy
   at 94–151 characters per line, a broken link in the homepage service grid, and the loudest
   colour on the page belongs to a motor-oil brand.

---

## 2. Homepage anatomy, section by section

Squarespace **Index page** — six stacked sections, DOM-named `#home`, `#home-welcome`,
`#home-quote`, `#home-services`, `#home-quotation`, `#home-image`, `#home-millers`.
Document height **9,186px** at 1440 wide.

### 2.1 Header (sticky, white `#FFFFFF`, full width)

Centred wordmark logo (P&K in red above THORNTON in black). Nav split around it —
left: `WELCOME · ABOUT US · SERVICES · 4TIPO`; right: `SHOP · PROJECTS · UPDATES · CONTACT`.
15px / 600 / letter-spacing 1.5px, all-caps. Site tagline **"Because everything matters."**
is set in Squarespace but the theme hides it on desktop (`ancillary-header-tagline-position-hide`)
— it surfaces only inside the mobile menu overlay.

> **Correction to our first read:** the hero does _not_ carry the "Because everything matters"
> tagline, and it is not an illustration. It is a photograph, wordless.

### 2.2 Hero — photograph, no headline, no CTA

Full-bleed 1440×960 studio photograph: a dark-blue Series 1 E-Type shot **exploded** — bonnet
tipped forward on the floor, engine floating in position, wheels, clutch pack and gearbox laid
out in the foreground, on polished concrete in a black studio. It is the single strongest image
on any of the three reference sites. There is **no headline, no sub-line and no CTA over it**.
Below it, a "Scroll" cue.
→ `thornton/desktop-hero.png`

### 2.3 Welcome (`#home-welcome`) — grey `#636363`

H2, 32px / 700 / white, centred:

> **"CLASSIC JAGUAR SERVICE, TUNING AND RESTORATION SPECIALISTS, FAMILY BUSINESS SINCE 1967"**

H3, 20px / 400:

> "Welcome to P&K Thornton Restorations Ltd, classic Jaguar service, tuning and restoration
> specialists and family business since 1967."

Body, 18px / 400, centred, 1028px wide (**~104–115 characters per line**):

> "We are a classic Jaguar restoration specialists, for street, fast road and race use. Over our
> 5 decades of existence, we have built a local and international reputation in _classic car
> restoration_, rolling road dyno tuning and servicing and have amassed an archive of hundreds of
> unique and interesting projects."
>
> "We invite you to contact us about your own classic car - from a basic _classic Jaguar service_,
> a carburettors or fuel injection tuning session, to a full nut and bolt classic car restoration,
> we would be delighted to hear from you."

CTA: outlined ghost button, **"ENQUIRE NOW"** → `/contact`.
Then a full-width **white line-drawing of an E-Type** in profile on the grey, with a solid red
bar beneath it. → `thornton/desktop-01.png`

### 2.4 Partner banner — "FUELLED BY SUSTAIN"

Full-width off-white panel carrying a third-party logo (SUSTAIN, navy). Not Thornton's brand.
→ `thornton/desktop-02.png`

### 2.5 Founders' quote (`#home-quote`) — full-bleed photograph

Macro shot of a tan leather E-Type interior. White type over it, no scrim:

> **" EVERY PART, EVERY MINUTE OF EVERY HOUR WE DEDICATE OUR ENERGY TO JAGUAR - TO MAKE
> SOMETHING PERFECT "**
> — Peter and Keith Thornton, co-founders

Attribution set at 12px / 600 / letter-spacing 1.8px. → `thornton/desktop-02.png`

### 2.6 Services (`#home-services`)

**H1 of the page** — the only `<h1>` — is `Our services.` at **90px / 700 / futura-pt-bold**,
sentence case with a full stop. Below it a six-line linked list, 20px H3s, centred:

> "Home of the Jaguar E-Type, classic XK and _historic saloons restoration_, servicing and tuning."
> "Metalwork restoration by artisans coach builders using vintage techniques."
> "_Engine building_, complete or partial cylinder heads and carburettors."
> "_Rolling road chassis dyno_ development and tuning. Carburettors and Fuel Injection specialists."
> "_Pre purchase inspection_ and consultancy."
> "_Race and rally_ classic build, preparation and support. One stop shop for all classic race cars."

Then a **2-column, 3-row card grid**. Each card: photograph (3:2) → double red rule → centred
all-caps H2 (32px / 700) → centred paragraph (18px, 603px wide, ~58–75 cpl) → outlined `MORE`
button. Verbatim, in DOM order:

| #   | Heading               | Copy                                                                                                                                                                                                                               | Link                  |
| --- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 1   | **RESTORE**           | "FROM A RUSTING SHELL TO A MASTERPIECE; we transform heartbreaking no-hopers into head-turning showstoppers through a combination of traditional skills and modern techniques."                                                    | `/restore`            |
| 2   | **SERVICING**         | "FROM MECHANICAL TWEAKS TO TRIM, bodywork and chassis repairs - we'll return your Jaguar in peak condition for a prime performance."                                                                                               | `/servicing`          |
| 3   | **ROLLING ROAD DYNO** | "A SIMPLE CARBURETTORS OR FUEL INJECTION TUNING SESSION; We are masters of SU, Weber, Solex, DellOrto carburettors, modern and spacious fully sound proof chassis dyno facility. Synthetic fuel tuning for all classic race cars." | `/rollingroad`        |
| 4   | **BODYSHOP**          | "FROM BODYWORK REPAIRS, TO A GROUND-UP COACHBUILD; P&K Thornton have a world-class metal-working team to transform your rusting and fatigued classic into a stunning concours example."                                            | `/bodyshop` — **404** |
| 5   | **CONSULT**           | "WITH OUR DECADES OF KNOWLEDGE AND EXPERTISE, we ensure that you receive a fully _independent inspection_, whether you are reviving a declining big cat, or making a significant financial investment."                            | `/inspections`        |
| 6   | **RACE**              | "JAGUAR'S RICH RACING HISTORY and P&K Thornton's own track record place us in pole position to deliver unrivalled preparation and support services."                                                                               | `/race`               |

Verified: our first read of the six categories was **correct**, and the "RESTORE: FROM A RUSTING
SHELL TO A MASTERPIECE" line is verbatim. → `thornton/desktop-04.png`, `desktop-05.png`, `desktop-06.png`

### 2.7 MD quote (`#home-quotation`) — full-bleed photograph

Macro of a polished XK cam cover with the red "JAGUAR" script. White type, no scrim:

> **" THE PURSUIT OF PERFECTION IS ALL IN THE DETAIL, BECAUSE EVERYTHING MATTERS... "**
> — Ciprian Nistorica, Managing Director

This is where the brand line finally lands — 8,000px down the page. → `thornton/desktop-06.png`

### 2.8 Image (`#home-image`)

Full-bleed cam-cover photograph, then a second white line-drawing (XK150 profile) with a red
bar. → `thornton/desktop-07.png`

### 2.9 Partner banner (`#home-millers`) — ROWE MOTOR OIL

Full-bleed cream panel, giant red-and-blue **ROWE MOTOR OIL** logo, with the word ROWE ghosted
huge behind it. Natural asset 1600×400 rendered at 2448×612 — **upscaled 1.53×**, visibly soft.
→ `thornton/desktop-08.png`

### 2.10 Footer — oxblood `rgb(107,36,31)` / `#6B241F`

`T&CS · POLICIES · CONTACT`, then a **Subscribe** block (30px H2, email field + SIGN UP),
then NAP, opening hours, company/VAT numbers, "Group Companies", "HCVA Member",
`© 2026 P&K Thornton Restorations Limited. All Rights Reserved.`

### 2.11 Mobile

Hero is the same photograph, cropped tall — the exploded composition survives but the reading
of it is lost. **No headline and no CTA above the fold on mobile**; the bottom third is occupied
by a full-width cookie notice ("By using this website, you agree to our use of cookies…") with a
white `OK` box. → `thornton/mobile-hero.png`

---

## 3. Type, palette, motion, media — the numbers

### 3.1 Type system

**One family: `futura-pt`** (Adobe Typekit), plus `futura-pt-bold` used only for the 90px H1 and
one stray `hypatia-sans-pro`. 145 of 154 measured text nodes are futura-pt. No serif anywhere.
`Arial, Helvetica, sans-serif` appears 7× (form controls).

**21 distinct size/weight/tracking combinations on one page.** The working ladder:

| Role              | Spec                              | Uses                |
| ----------------- | --------------------------------- | ------------------- |
| Page H1           | 90 / 700 / ls normal / lh 99      | 1 (`Our services.`) |
| Section + card H2 | 32 / 700 / ls normal / lh 38.4    | 7                   |
| Quote             | 33 / 500 / ls 0.66 / lh 39.6      | 8                   |
| Footer H2         | 30 / 700                          | 1                   |
| Sub-head H3       | 20 / 400 / ls 0.6 / lh 26         | 7                   |
| Body              | 18 / 400 / ls 0.54 / lh 28.8      | 31                  |
| Eyebrow / label   | 16 / 700 / ls 3.2 / lh 19.2       | 31                  |
| Nav               | 15 / 600 / ls 1.5                 | 28                  |
| Button            | 12 / 600 / ls 1.8                 | 7                   |
| Quote attribution | 11 / 700 / **ls 6.05** / lh 72.71 | 2                   |
| Caption           | 10 / 700 / **ls 8**               | 1                   |

The 8px and 6.05px tracking at 10–11px is a 2014-era treatment and it is what the project-article
H1 inherits at display size — `X K 1 2 0   C O M P L E T E   B O D Y W O R K…` wrapping mid-word
with a dangling hyphen (`thornton-project-xk120/desktop-hero.png`).

**Measure is the real failure.** Characters per line at 1440px, measured:

| Page            | Element           | Width  | Align      | **cpl**     |
| --------------- | ----------------- | ------ | ---------- | ----------- |
| `/`             | Welcome body      | 1028px | center     | 104–115     |
| `/`             | Services list     | 1240px | center     | 94–95       |
| `/`             | Service-card copy | 603px  | center     | 58–75 ✅    |
| `/restore`      | Body prose        | 1240px | **center** | 113–**139** |
| project article | Body prose        | 1240px | start      | 127–**151** |

Target is 45–75. The service cards are the only text on the site that hits it.

### 3.2 Palette

| Role                    | Value                                         | Where                       |
| ----------------------- | --------------------------------------------- | --------------------------- |
| Page ground             | `rgb(99,99,99)` `#636363`                     | body, every content section |
| Parallax section ground | `rgb(97,97,97)` `#616161`                     | 3 index sections            |
| Header / partner panels | `#FFFFFF` / `#FAFAFA`                         | header, SUSTAIN, ROWE       |
| Primary text            | `#FFFFFF` (68 nodes), `#F2F2F2` (49)          | everything on grey          |
| Muted text              | `rgba(255,255,255,.72)`, `#C4C4C4`, `#CCCCCC` | captions, attributions      |
| Dark text               | `rgb(54,54,54)` `#363636`                     | header nav                  |
| **Footer / accent**     | `rgb(107,36,31)` `#6B241F` (hover `#702923`)  | footer only                 |
| Logo red                | bright red, in the SVG/PNG wordmark           | header                      |

**The red rules are baked into the JPEGs, not CSS.** The service-card banner filenames are
literally `PK_Thornton_restore_banner_web+stripe.jpg`, `…race_banner_web+stripe…`. No CSS
element on the page carries a red background. That means the accent cannot be re-themed, does
not scale cleanly, and its weight varies with image scaling.

Net: **three greys, white, and an oxblood footer.** The most saturated colour on the page is
somebody else's — the ROWE logo's fire-engine red and cobalt blue.

### 3.3 Motion — entirely stock, zero bespoke

`libs: ['squarespace']`. **No GSAP, no ScrollTrigger, no Lenis, no Locomotive, no Framer Motion.**

Keyframe animations, both Squarespace built-ins:

- `anim-opacity-99` — 0.525s linear (×1)
- `anim-opacity-full` — 0.48s ease-out (×7)

Transitions are all template chrome: `opacity 0.2s ease-out` (×11), `color, background-color
0.17s ease-in-out` (×28), `border-color, color 0.15s ease-out` (×9), `transform 0.35s
cubic-bezier(.55,0,.1,1)` (×5, mobile drawer), `opacity 1s ease` (×6, image load-in).

One `Parallax-item` mechanism (`tweak-overlay-parallax-enabled`) on 3 index sections; 9
sticky/fixed elements (header + Squarespace UI). **Nothing is scroll-linked to the story.** The
page has no motion argument at all — every reveal is a stock fade.

### 3.4 Media strategy

- **Photography-led, illustration as punctuation.** Two white line-drawings (E-Type, XK150) used
  as full-width dividers, each with a red bar. Everything else is photography.
- **Photography is process, not glamour.** Wood-rim wheel and gauges, an opened differential
  with red gear-marking compound, an original blue logbook and Jaguar identification manual,
  triple Webers, a bare-metal XK120 on the shop floor, a bearded panel beater at work. It is
  honest and it is the site's best asset. Competitor branding (Pirelli, Snap-on, Alfa Romeo
  banners) is visible in several workshop shots.
- **Formats:** WebP throughout via Squarespace's CDN, `srcset` on 12 of 22 images,
  `loading="lazy"` on 12 of 22. Cache `max-age=31536000`.
- **Crops:** 3:2 for service cards, 3:2 for project-index cards, full-bleed 1440×960 for heroes.
- **Resolution ceiling:** the homepage hero master is **1500×1000** — requesting `?format=2500w`
  or `?format=original` returns the identical 252,576-byte file. Rendered into a 1440px slot that
  is DPR ≈ 1.04, i.e. **soft on any retina display.** Same for the two other 1500w heroes.
- **Weights (content-length):** service-card banners 352–454KB each as WebP; hero 141KB;
  illustrations 140–160KB as WebP-from-PNG.

### 3.5 Performance reality (1440×900, full-page scroll, networkidle)

|                |                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------- |
| Requests       | **86**                                                                                            |
| Total transfer | **4.97 MB**                                                                                       |
| Images         | 21 requests / **3.39 MB** (68%)                                                                   |
| JavaScript     | 29 requests / **1.14 MB**                                                                         |
| Fonts          | **11 woff2 / 424 KB** — eleven Typekit files for essentially one family                           |
| CSS            | 9 / 93 KB                                                                                         |
| HTML           | 32.5 KB                                                                                           |
| Third-party    | Google Analytics (`analytics.js` + `gtag` G-6LS3Z10LFM), Typekit, 4 Squarespace component bundles |

**Stack:** Squarespace (7.1 Index/Brine-family template, `groundhog-rhubarb-c2jp`), Adobe
Typekit for fonts, **Shopify on `24d55e-ef.myshopify.com` for the shop** (every SHOP nav item
leaves the domain). The ceiling: no control over markup, no bespoke motion layer, image masters
capped at whatever was uploaded, and a split checkout brand.

---

## 4. Service IA and the restoration-story pattern — the transferable part

### 4.1 Sitemap (155 URLs in `sitemap.xml`)

```
/                                   Index page, 6 stacked sections
│
├── About Us            (/about → folder, no landing page of its own)
│   ├── /our-story                  1967 → present narrative + 3 testimonials
│   ├── /meet-the-team
│   ├── /vacancies
│   ├── /inwardprocessing           customs/import handling
│   ├── /collection-delivery
│   └── /press-articles
│
├── Services            (/Services → 302 redirect to /rollingroad — no hub page)
│   ├── /restore                    481 words
│   ├── /servicing                  1,189 words
│   ├── /rollingroad                688 words
│   ├── /engines                    507 words
│   ├── /coachwork                  364 words
│   ├── /race                       761 words
│   ├── /inspections                804 words
│   ├── /insurance-accident-repair  480 words
│   └── /dry-ice-blasting           426 words
│   (orphans not in nav: /brakes, /sustain, /rowe-motor-oil,
│    /servicingav12e-type, /servicing-a-6-cylinder-jaguar-etype)
│
├── 4Tipo               /4tipo — sub-brand microsite
│   ├── /4tipo-bodywork-1  "AESTHETIC"
│   ├── /4tipo-interior    "SOUL"
│   ├── /4tipo-engine      "HEART"
│   └── /4tipo-chassis     "CONNECTION"
│
├── SHOP                → 24d55e-ef.myshopify.com (Engine, Gearbox, Merchandise,
│                          Vehicle Sales, Electrical) — leaves the domain
│
├── /projects           landing + /projects-feed/* — 35 project articles
│   ├── categories: E-Type, XK120, XK140, XK150, MK II, C-Type, XJ-S,
│   │               Allard, Austin, 250 V8
│   └── tags: e-type, jaguar, rebuild, gearbox
│
├── /updates            → /news-feed/* — 50 news posts (events, races, cars for sale)
│
├── /parts-feed         5 parts listings, own categories/tags
│
├── Buying guides (orphaned from nav — SEO landing pages)
│   ├── /jaguar-etype-buying-guide
│   ├── /jaguar-mark-1-mark-2-buying-guide-1
│   └── /xk-120-xk-140-and-xk-150-buying-guide
│
└── /contact · /tcs · /policies · /newslatter [sic] · /search
```

### 4.2 The card-label ↔ URL mismatch (a real IA fault)

The homepage grid shows **six** categories; the nav shows **nine** service pages; the labels do
not agree:

| Homepage card     | Nav item                                   | URL            | Result                                  |
| ----------------- | ------------------------------------------ | -------------- | --------------------------------------- |
| BODYSHOP          | Coachwork                                  | `/bodyshop`    | **404** — `/coachwork` is the live page |
| CONSULT           | Inspections                                | `/inspections` | ok                                      |
| ROLLING ROAD DYNO | Rolling Road                               | `/rollingroad` | ok                                      |
| —                 | Engines, Accident Repair, Dry Ice Blasting |                | not on homepage                         |

Plus `/Services` (the nav folder title) **302-redirects to `/rollingroad`** — there is no service
hub page at all. A visitor who clicks the folder title lands on a dyno page.

**Lesson for DPM:** curate the homepage grid down from the full service list — that is right —
but keep one label per service, and give the set a real hub page.

### 4.3 The service-page template

Constant across all nine: full-bleed hero photo → centred white all-caps H2 over it → ghost
`ENQUIRE NOW` → 90px sentence-case H1 (`Restore.`, `Coachwork.`) → long centred prose → a 2×2 or
2×3 uncaptioned image grid (lightbox `View fullsize`) → more prose → `Contact` button → footer.

`/restore` hero headline verbatim:

> **"FIVE DECADES OF CLASSIC CAR EXPERIENCE ACROSS HUNDREDS OF JAGUAR RESTORATIONS"**

Depth varies 3.3× (364 → 1,189 words) with no structural difference — the longer ones are just
more paragraphs. **No page has: a process breakdown, a price band, a lead time, a "what's
included", a named case study, or a testimonial.** `/restore`'s prose repeats "five decades of
experience across hundreds of Jaguar restorations" three times on one page. This is SEO padding
wearing a service page's clothes.

The one line on `/restore` that matters most to DPM:

> **"Each project is digitally documented at every stage, painting a picture of the process for
> future owners and enthusiasts."**

They **claim** documentation in prose. They **prove** it only in the project feed, which the
service page does not link to.

### 4.4 How a restoration story is told — the pattern worth stealing

Anatomy of `/projects-feed/xk120-complete-bodywork-restoration` ("XK120 Complete Bodywork
Restoration- January 2026"):

1. **Letter-spaced all-caps title on grey**, then a left-aligned framing paragraph that states
   the car, the condition it arrived in, and where it is now:

   > "Last year, this Jaguar XK120 came to us for a full bodywork restoration. The XK 120 came to
   > us as a partially completed project that had been in a garage for some time and was never
   > finished… until now. After completing the project in December, the Jaguar is currently being
   > painted… This article breaks down the complete metalwork restoration process conducted by our
   > Bodyshop team at P&K Thornton."

2. **Then it alternates: prose paragraph → 3-up or 4-up image row → prose → image row**, once per
   stage. The stages, in order, are named in the prose itself:
   - initial inspection (strip trim/fittings/paint, label and store every part, panel-by-panel
     repair-or-refabricate decision)
   - the inherited-project problem (aftermarket door skins, pre-edged to the wrong jig)
   - sub-panel breakdown and aluminium fabrication (new doors, rear wings, wheel spats)
   - the rear tub — **the discovery beat**
   - chassis repair and mounting-point prep
   - test-fitting, shut lines, panel-gap alignment — **the difficulty beat**
   - paint prep, seams and joints
3. **It admits problems.** This is what makes it read as true:
   > "When we removed the outer skin, we discovered a lot of rust under the rear squab."
   > "Because this project was inherited, there weren't any location holes anywhere on the back
   > end, which had previously been repaired or welded up."
4. **It teaches.** A digression on why the factory work was rough ("in the factory, the XK120s
   were roughly put together to meet production numbers because the workers were paid by the
   quantity they produced"), and on why new hinges go in during the rebuild.
5. **Video:** "Check out our 3 part breakdown of this project on YouTube."
6. **Standing CTA block** closing every article, with phone and email inline.
7. **Prev/next** links to the adjacent project.

**What it does NOT do:** no before/after pair, no date-stamped chronology, no hours or duration,
no spec table, no client voice, no captions on any image, no named author (the byline reads
"Guest User" on several articles).

**Projects index:** 2-column grid, 3:2 photo → centred sentence-case title → centred 2–4-line
excerpt → `Read more →`. Filtered by model (E-Type, XK120, XK140, XK150, MK II, C-Type, XJ-S,
Allard, Austin). Framing copy:

> "AT P&K THORNTON RESTORATIONS, we hold an extensive archive with information and pictures of
> all cars we've worked on over the years. Take a look at some of our previous projects - all
> unique and special in their own way."

### 4.5 Heritage and credibility

- **The date is everywhere.** "FAMILY BUSINESS SINCE 1967" is the homepage H2 and repeats in the
  H3 beneath it; "five decades" / "5 decades" / "nearly 6 decades" recur across pages
  (inconsistently — 1967 is 59 years ago).
- **`/our-story` is a real chronology**, and it is good: 1967 founding by two brothers who
  "both served formal apprenticeships at Jaguar Cars Ltd" → home garage → early-1970s move to a
  former petrol station (12-car workshop + bodyshop) → 1982 Colwick → late-1990s Lambley →
  2018 Ciprian Nistorica joins → sister company **Alficina** (Alfa Romeo specialist).
- **The archive is the real credential** and it is stated, never shown:
  > "…the business consolidated its continuous record of all vehicles worked on, resulting in an
  > extensive and unparalleled archive of technical information, specifications and reference
  > images used on their restorations today."
- **Third-party proof:** "recommended by the Jaguar Drivers' Club for over 2 decades"; HCVA
  member mark in the footer; SUSTAIN and ROWE partner banners on the homepage;
  `/press-articles` exists.
- **Testimonials: three, first-name-only, at the very bottom of `/our-story` only.** None on the
  homepage, none on any service page, none dated later than 2015. One is missing its opening
  quotation mark. Verbatim:
  > "Thank you for your efforts on the car and as always it's a pleasure dealing with you." — Charlie
  > "The car looks magnificent and has been much admired - it should attract a lot of attention on
  > it's 2015 XK Club outings! Many thanks for bringing this project to a successful conclusion -
  > your attention to detail has made all the difference." — John
  > Thank you to you and all the engineers that worked on JPM....and for the safe return today.
  > Please pass on my thanks and appreciation. My Father took the car for a 'spin'...and on return
  > had a big smile on his face....!" — James

### 4.6 4Tipo — the strategic tell

`/4tipo` is a **separate sub-brand** for restomod work, sitting behind one nav item, and it is
the best-written thing on the domain. It opens on a four-word manifesto —
**AESTHETIC. HEART. SOUL. CONNECTION.** — and structures the whole offer around those four
pillars mapped to four disciplines:

| Pillar     | Disciplines                            | Page                |
| ---------- | -------------------------------------- | ------------------- |
| AESTHETIC  | Bodywork, Paint                        | `/4tipo-bodywork-1` |
| SOUL       | Interior Trim, AC, ICE                 | `/4tipo-interior`   |
| HEART      | Engine, Electronics, Drivetrain        | `/4tipo-engine`     |
| CONNECTION | Chassis, Suspension, Braking, Steering | `/4tipo-chassis`    |

Copy verbatim:

> "4tipo, the power of four." … "Inspired by Formula 1 race teams, we constantly test and
> experiment, refining our approach to make sure all parts of a vehicle work together in complete
> harmony and that each component enhances the others."
> "4tipo, made by humans." … "our vehicles, are made by humans, for humans, where team
> collaboration and shared expertise drive success."
> "The cars we create connect with all of the senses...as any great restomod should." — Ciprian Nistorica

**Read:** rather than lift the parent brand, they built a second one to reach upmarket. DPM does
not need to do that — DPM's whole site can be at 4Tipo's level.

---

## 5. What to steal

1. **The project archive as a first-class section, with a model taxonomy.** 35 articles filtered
   by marque/model, framed as an archive rather than a gallery. DPM has more documented
   restorations than this; the taxonomy should be by marque and by service (paint, panel,
   fabrication, full restoration).
2. **The stage-by-stage workshop-log format, verbatim as a template:** framing paragraph (car,
   arrival condition, current status) → per-stage prose → image row → per-stage prose → image
   row → CTA. Named stages. That structure is a document DPM's team can actually fill in.
3. **The discovery and difficulty beats.** "We discovered a lot of rust under the rear squab" and
   "there weren't any location holes anywhere on the back end" are the two most credible
   sentences on the site. A restoration story with no problem in it reads as marketing. Build
   these into the template as required fields.
4. **Teaching digressions.** The paragraph explaining why factory XK120 assembly was rough
   converts a photo caption into expertise. DPM's paint knowledge is a deep well of this.
5. **The curated six-card homepage grid over a nine-item nav.** Right instinct: show the six that
   sell, keep the long tail in the nav. Fix the labels.
6. **The service-card copy pattern** — an all-caps promise clause followed by lower-case
   substance ("FROM A RUSTING SHELL TO A MASTERPIECE; we transform heartbreaking no-hopers into
   head-turning showstoppers"). It gives a scanner the hook and a reader the detail in one
   paragraph, and at 58–75 cpl it is the only well-set text on the site.
7. **The founding-date chronology page.** `/our-story` earns its heritage claim by narrating
   moves, premises and people rather than asserting a number.
8. **Process photography over glamour photography.** An opened differential and a bare-metal tub
   sell a restoration shop better than a finished car in a field.
9. **Per-project video series.** A 3-part YouTube breakdown per project is a real content asset;
   embed it in the story rather than link out.
10. **The four-pillar structure from 4Tipo** — AESTHETIC / HEART / SOUL / CONNECTION mapped to
    disciplines. DPM's equivalent, given everything is in-house except engines and trim, writes
    itself.

---

## 6. Where it is beatable

**Visual**

1. **The grey.** `#636363` is the single worst decision on the site. It is not a designed neutral
   — it is the default mid-grey, it flattens every photograph placed on it, it makes white type
   sit at ~5.7:1 rather than snapping, and it makes the whole page read as a template with the
   colour picked once and never revisited. DPM's answer is a near-black ground so paintwork
   reads as reflection and depth.
2. **The accent is baked into JPEGs.** The red double-rule is pixels inside
   `PK_Thornton_restore_banner_web+stripe.jpg`, not CSS. It cannot re-theme, it scales with the
   image, and it means the brand's only accent colour is unmaintainable.
3. **The loudest colour on the page is a supplier's.** The ROWE MOTOR OIL banner — full-bleed,
   fire-engine red on cream, upscaled 1.53× from a 1600×400 master — is the highest-chroma,
   highest-contrast object on a page otherwise made of greys. Partner logos belong in a quiet
   credentials strip, not as a full-width section.
4. **Everything is centred.** Headlines, body, buttons, captions — six sections of centred text
   with no left rag anywhere. There is no eye path down the page, only a column of symmetrical
   blocks.
5. **The hero throws away its best asset.** A studio exploded-view E-Type, and there is no
   headline, no line, no CTA on it — and on mobile the space is given to a cookie banner. The
   positioning line arrives 900px later as an H2 on grey.
6. **The H1 is spent on "Our services."** at 90px — the largest type on the page is a filing
   label, not a proposition.
7. **White type straight onto photographs with no scrim.** On `/restore` the hero headline crosses
   a chrome steering-wheel boss and is genuinely unreadable across the highlights.
   (`thornton-restore/desktop-hero.png`)

**Typographic**

8. **Body copy at 94–151 characters per line**, against a 45–75 target, and centred on
   `/restore` at 139 cpl. This is the site's most damaging craft failure and it is free to fix.
9. **21 distinct type styles from one family**, including 6.05px and 8px letter-spacing at
   10–11px. One family with no serif or contrast partner, stretched across 21 combinations, is
   why it reads as competent-template rather than designed.

**Structural / content**

10. **A 404 in the homepage service grid.** The BODYSHOP card — one of six — links to
    `/bodyshop`, which returns **404**. `/coachwork` is the live page.
11. **No services hub.** `/Services` 302-redirects to `/rollingroad`.
12. **Documentation is claimed, not shown, where it is sold.** `/restore` says every project is
    "digitally documented at every stage" and then links to nothing. The project archive that
    proves it lives in a different top-level section. **This is DPM's opening**: put the
    documented restorations _inside_ the service page.
13. **Three testimonials, first names only, buried at the bottom of `/our-story`, newest dated 2015.** Zero social proof on the homepage or on any service page.
14. **No before/after anywhere.** For a business whose own headline is "FROM A RUSTING SHELL TO A
    MASTERPIECE", there is not a single paired arrival/finished image on the site.
15. **No captions on any image**, in a stage-by-stage metalwork article where the reader cannot
    tell one aluminium panel from another.
16. **Service pages have no shape** — no process steps, no lead times, no price bands, no
    "what's included", no case-study link. Depth varies 3.3× with no structural difference, and
    `/restore` repeats its key claim three times in 481 words.
17. **The shop leaves the domain** to `24d55e-ef.myshopify.com` — an unbranded myshopify
    subdomain, from five different nav items.
18. **Byline hygiene:** several project articles are authored by "Guest User"; the XK120 title
    reads "Restoration- January 2026" with the space on the wrong side of the dash;
    `/newslatter` is a live misspelled URL.

**Technical**

19. **Zero bespoke motion.** Two stock Squarespace opacity keyframes and template hover
    transitions. No scroll-linked storytelling of any kind on a site whose subject is a process
    that unfolds over time.
20. **The image masters are capped at 1500px.** `?format=2500w` and `?format=original` both
    return the same 252KB file. Every full-bleed hero renders at ~1.04× DPR — soft on every
    retina screen the target buyer owns.
21. **4.97MB / 86 requests**, 3.39MB of it images, plus **11 Typekit woff2 files (424KB) for one
    family**. Squarespace + Typekit + Shopify + GA is four vendors for a nine-page service site.
22. **Platform ceiling.** Squarespace 7.1 means no control over markup or motion, no image
    pipeline beyond what was uploaded, and no route to the kind of scroll-composed, video-capable
    page DPM needs. Our own Next.js/Tailwind stack beats this on every axis without effort.

---

## 7. Evidence log

| Claim                                                 | Evidence                                                                                                                          |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Squarespace 7.1, template `groundhog-rhubarb-c2jp`    | homepage HTML `<!-- This is Squarespace. -->`; `report.json → desktop.libs = ['squarespace']`                                     |
| Shop is Shopify off-domain                            | nav hrefs → `https://24d55e-ef.myshopify.com`                                                                                     |
| Body ground `#636363`, sections `#616161`             | `thornton/report.json → desktop.bodyBg`, `bgColors`; `Parallax-item` computed bg                                                  |
| Footer `#6B241F`                                      | `report.json → desktop.bgColors` `rgb(107,36,31)`                                                                                 |
| Single family futura-pt, 145/154 nodes                | `report.json → desktop.fonts`                                                                                                     |
| 21 distinct type styles; 90px H1; ls 6.05/8px         | `report.json → desktop.typeScale`, `desktop.headings`                                                                             |
| Doc height 9,186px                                    | `report.json → desktop.docHeight`                                                                                                 |
| Body copy 94–151 cpl                                  | live Playwright measurement of every `<p>` at 1440px, three pages                                                                 |
| Hero has no headline/CTA; exploded E-Type             | `thornton/desktop-hero.png`                                                                                                       |
| Illustration + red bar dividers                       | `thornton/desktop-01.png`, `desktop-07.png`                                                                                       |
| SUSTAIN banner                                        | `thornton/desktop-02.png`                                                                                                         |
| Founders' quote over interior macro                   | `thornton/desktop-02.png`                                                                                                         |
| "Our services." H1 at 90px                            | `thornton/desktop-03.png`; `report.json → headings`                                                                               |
| Six service cards, verbatim copy, double red rule     | `thornton/desktop-04/05/06.png`; homepage DOM extraction                                                                          |
| BODYSHOP → `/bodyshop` → **404**                      | `curl -sI https://www.thorntonrestorations.com/bodyshop` → `status=404`                                                           |
| `/Services` → 302 → `/rollingroad`                    | `curl -sI https://www.thorntonrestorations.com/Services`                                                                          |
| MD quote = brand line, 8,000px down                   | `thornton/desktop-06.png`                                                                                                         |
| ROWE banner full-bleed, upscaled 1.53×                | `thornton/desktop-08.png`; perf run `natural 1600×400 → displayed 2448×612`                                                       |
| Mobile: no headline, cookie banner over fold          | `thornton/mobile-hero.png`                                                                                                        |
| Red rules baked into image files                      | asset filenames `…_banner_web+stripe.jpg`; no red CSS background on any element                                                   |
| Motion is stock only                                  | live computed-style sweep: `anim-opacity-99`, `anim-opacity-full`; no GSAP/Lenis/Framer                                           |
| 86 requests, 4.97MB, 3.39MB images, 11 fonts/424KB    | Playwright network capture, full-page scroll to networkidle                                                                       |
| Image masters capped at 1500px                        | `curl -sI …?format=2500w` and `?format=original` both `content-length: 252576`                                                    |
| WebP + srcset 12/22 + lazy 12/22                      | perf run `document.images` inspection                                                                                             |
| Sitemap = 155 URLs                                    | `curl https://www.thorntonrestorations.com/sitemap.xml`                                                                           |
| 9 service pages, 364–1,189 words                      | text extraction per URL, footer-stripped word counts                                                                              |
| 35 project articles, model taxonomy                   | `sitemap.xml` `/projects-feed/*` + `/projects-feed/category/*`                                                                    |
| Project-article stage structure, verbatim quotes      | `/projects-feed/xk120-complete-bodywork-restoration` text extraction; `thornton-project-xk120/desktop-hero.png`, `desktop-02.png` |
| `/restore` claims digital documentation               | `/restore` text extraction                                                                                                        |
| 3 testimonials, first names, 2015, `/our-story` only  | `/our-story` text extraction; `grep -i testimonial` across 6 URLs returns a hit only on `/our-story`                              |
| `/our-story` chronology 1967→2018, Alficina           | `/our-story` text extraction                                                                                                      |
| 4Tipo four-pillar sub-brand                           | `/4tipo` text extraction; sitemap `/4tipo-*`                                                                                      |
| "Guest User" bylines, `- January 2026`, `/newslatter` | project-article extraction; sitemap                                                                                               |
| `/restore` hero headline illegible over chrome        | `thornton-restore/desktop-hero.png`                                                                                               |
| `/restore` centred prose at 1240px                    | `thornton-restore/desktop-02.png` + measurement                                                                                   |
| `/projects` grid layout                               | `thornton-projects/desktop-hero.png`, `desktop-02.png`                                                                            |
