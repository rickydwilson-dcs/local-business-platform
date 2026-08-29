# Teardown — halcyon.works

**Captured:** 2026-08-26 · Playwright 1440×900 @2x + iPhone 13 · `research/screenshots/halcyon*/`
**Platform:** Wix (Thunderbolt / React) — confirmed, no other framework present
**Pages captured:** `/` (7 desktop frames), `/about`, `/cars`, `/newsroom`

Every number below is measured. Anything inferred is marked **[assumption]**.

---

## 1. Verdict in five lines

1. It is genuinely elegant, and the thing doing the work is **art direction and restraint, not craft** — one very good hero video, a disciplined near-monochrome palette with a single champagne accent, and enormous amounts of empty space.
2. The one piece of real design thinking is a **three-word sticky stack** (HANDCRAFTED → REMASTERED → BESPOKE accumulating in a pinned left rail); it is 3 lines of `position: sticky` and it carries the entire page.
3. Everything else that reads as "motion" is **six elements running two Wix stock presets** (`motion-floatIn` / `motion-fadeIn`, both 1.2s, both the same sinusoidal easing). No GSAP, no ScrollTrigger, no Lenis, no parallax, no scroll-scrubbing, no video scrub.
4. The elegance is **borrowed**: the typeface is Riviera Nights, Rolls-Royce's own corporate face, verified from the font binaries — used on a site whose footer explicitly disclaims affiliation with Rolls-Royce.
5. Underneath it is a **30.7 MB homepage** whose hero video alone is 26.9 MB at 119.88 fps with an audio track on a muted element, a **broken heading hierarchy** (H1 31.6px < H2 34px < H3 40px), an opaque header bar that decapitates a headline on scroll, **stale copy and a live typo on mobile that were fixed on desktop**, and **no individual car page anywhere on the site**.

It is the best-looking of the three references. It is not a high bar to beat, and the gap is mostly engineering and information architecture, not taste.

---

## 2. Homepage anatomy, in order (desktop 1440×900)

Document height **5,557px**. 2,709 DOM nodes. Six blocks.

### §1 — Hero (0–900px)

Full-bleed autoplay video, no overlay, no scrim, no scroll cue, no CTA.
Content: a Spirit of Ecstasy mascot, centred, backlit against a deep green ground.
Headline sits **left at x=60, y=400**, two lines:

> **TIMELESS ELEGANCE,**
> **REMASTERED**

Line 1 is an `<h2>`, 34px, Riviera Nights Regular. Line 2 is an `<h3>`, 40px, Riviera Nights **Medium**, line-height 56px. Both white. Nothing else in the viewport.
_(`halcyon/desktop-hero.png` was captured mid-reveal and shows line 1 only — the two-line resting state is `halcyon/desktop-00.png`.)_

### §2 — Positioning statement, white (#FFFFFF)

Centred, x=134, width 1173px. H2 34px, `#161616`, with the last word in the champagne accent:

> **REAWAKENING THE** <span>SPIRIT</span>

> Presenting the definitive remastering services for classic Rolls-Royce cars, Halcyon crafts enduring, bespoke, and uncompromising masterpieces that unite timeless automotive elegance with world leading technology.

Body 16.8px / 26.88px line-height, `rgb(0,0,0)`. Outline button: **DISCOVER THE COLLECTION**.

### §3 — Full-bleed image pair (Wix Pro Gallery, horizontal scroll + chevron)

Two images edge to edge: a Spirit of Ecstasy on a white Corniche bonnet; a purple-and-white cabin interior with a HALCYON dash plaque. A low-contrast `›` chevron at the right edge is the only affordance — no dots, no counter, no captions.

### §4 — Principles, white

> **PRINCIPLES** **IN MOTION** _("PRINCIPLES" in champagne, "IN MOTION" in #161616)_

> Uniting the craftsmanship and emotion of coach-built design with modern expectations of performance and refinement, we are redefining even the highest of standards.

Same **DISCOVER THE COLLECTION** button, second time in ~1,000px of scroll.

### §5 — The sticky word stack, dark (#161616) — the centrepiece

Three sub-sections. The left rail carries one `<h1>` each, `position: sticky` at **top: 144px / 180px / 216px** respectively, so each word pins under the header and the next one stacks 36px beneath it. By the third panel the rail reads `HANDCRAFTED / REMASTERED / BESPOKE` as an accumulated list. Middle column carries a two-line eyebrow (second line in champagne) plus body and a `Discover →` link. Right column carries a gallery that bleeds off the right edge and crosses the white/dark section boundary.

**5a — HANDCRAFTED · TAKING / THE BEST**

> In our pursuit of perfection, every detail is considered to bring each car back to, and beyond its original form.
>
> With a ground-up, hand built approach, our team of world-class coach builders dedicate over one thousand hours to the restoration of each body alone, providing a pristine platform for each bespoke commission.

**5b — REMASTERED · MAKING / IT BETTER**

> Celebrating the harmony of art and science, we seamlessly integrate the very best technology to deliver an uncompromising drive.
>
> Powered by what moves you most, effortless performance comes from both our next-generation electric powertrain and our re-engineered 6.75L V8. Active suspension and upgraded braking systems add dynamic composure, all while preserving the original icon's cloud-like ride.

**5c — BESPOKE · UNIQUE / TO YOU**

> Drawing from a curated library of the finest sustainable materials, our atelier allows each client to specify a car that perfectly suits their individual requirements and no request will remain unexplored.
>
> For artistry in its purest form, we collaborate with globally renowned talents, transforming each commission into something extraordinary.

### §6 — Footer, white

Four columns. Left-most and largest is the **legal disclaimer** — the most prominent block in the footer of a luxury site is trademark defence:

> Please note that the specifications outlined in this website are subject to change as we continue our commitment to innovation and excellence.
>
> Halcyon specialises in the restoration and modification of Rolls-Royce Corniches, Rolls-Royce Silver Shadows, and Bentley T-Series cars at the direction of its clients. Halcyon does not manufacture or sell cars.
>
> We operate independently and are not officially endorsed, supported, or affiliated with Rolls Royce Motor Cars Limited or Bentley Motors Limited, or any of their parent organisations. All mentioned trademarks, such as Rolls Royce®, Bentley®, Corniche®, Silver Shadow®, and T-Series®, are the sole property of their respective trademark holders. Any reference to these names or marks is solely for the purpose of identification.
>
> In acknowledgement of the trademark rights held by Rolls Royce and Bentley, these bespoke vehicles must not be described or marketed as a 'Halcyon Rolls-Royce,' 'Halcyon Bentley,' or by any name that implies an official affiliation with the original manufacturers.

Then **CONNECT TODAY** (`Halcyon, GU3 2DX, UK` · `enquire@halcyon.works` · a 6-field contact form: First Name, Last Name, Email, Phone, Subject, Message, Submit), **FIND US** (Instagram, LinkedIn, YouTube, map pin), **LEGAL** (Cookies Policy, Privacy Policy), **NEWS & PRESS** (Newsletter, Newsroom, plus press-kit line). Copyright: `© 2026 Halcyon Cars. All rights reserved. Halcyon and "Halcyon Cars" are trading name of Evice Ltd.`

There is **no work/portfolio section, no testimonial, no process, no team, no numbers, no location, no craft photography** on the homepage.

---

## 3. Type system

### Families — verified from the actual `.woff2` binaries (name table, nameID 1/8/16)

| Wix alias        | Real name                                                                                                                                  | Foundry              | Size    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- | ------- |
| `365dad_4c9dff…` | **Riviera Nights Light** v3.000                                                                                                            | Swiss Typefaces Sarl | 26.7 KB |
| `2f8183_3eba7f…` | **Riviera Nights Ultralight** v3.000                                                                                                       | Swiss Typefaces Sarl | 24.9 KB |
| `bc7763_8517cd…` | **Riviera Nights Regular** v3.000                                                                                                          | Swiss Typefaces Sarl | 26.1 KB |
| `853e10_f3ee04…` | **Riviera Nights Medium** v3.000                                                                                                           | Swiss Typefaces Sarl | 27.9 KB |
| `c9a712_376e2c…` | name table **stripped** — family blank, full name literally `"Font"`, trademark string `"Riviera is a trademark of Swiss Typefaces Sarl."` | Swiss Typefaces      | 21.3 KB |
| `106523_3fa58d…` | **Roboto Thin** v2.137 (Google, Apache 2.0)                                                                                                | Google               | 61.9 KB |

Six webfonts, 184.3 KB total.

**What Riviera Nights is.** Riviera is a Swiss Typefaces family, launched in a single style in 2016; **Riviera Nights** was released in six weights in November 2019 and was adopted as **Rolls-Royce Motor Cars' corporate typeface** in the Pentagram (Marina Willer) brand identity redesign announced in 2020, replacing the marque's previous Gill Sans Alt. Sources: [Pentagram – Rolls-Royce](https://www.pentagram.com/work/rolls-royce-3), [Rolls-Royce press release](https://www.press.rolls-roycemotorcars.com/rolls-royce-motor-cars-pressclub/article/detail/T0314766EN/rolls-royce-announces-new-brand-identity?language=en), [Swiss Typefaces – Riviera](https://www.swisstypefaces.com/fonts/riviera/), [Fonts In Use – Riviera Nights](https://fontsinuse.com/typefaces/41530/riviera-nights).

So the site's single strongest "expensive" signal is Rolls-Royce's own brand face, on a site that disclaims affiliation with Rolls-Royce four paragraphs down. Note also that the **most-used cut on the whole site — 40 elements, including every homepage H1 and H2 — is the one whose identity has been scrubbed to `"Font"`**. That is what a desktop OTF converted and uploaded through Wix's custom-font uploader looks like. **[assumption: I cannot verify from outside whether Halcyon holds a webfont licence; the stripped name table is consistent with a self-converted desktop file, not proof of anything.]** The Roboto Thin is a straightforward leftover default — it is shipped, unsubsetted, at 61.9 KB, to render exactly one heading on the mobile breakpoint.

### The ladder (computed, at 1440px)

| Role                | Size       | Weight            | Tracking | Leading | Colour                          |
| ------------------- | ---------- | ----------------- | -------- | ------- | ------------------------------- |
| Nav item            | 12px       | 700               | normal   | 55px    | `#FFFFFF`, active `#C8A486`     |
| Body (dark + light) | 16.8px     | 400               | normal   | 26.88px | `#000` on white, `#FFF` on dark |
| Eyebrow             | 16.8px     | 400               | normal   | 26.88px | `#000` / accent                 |
| Sticky word `<h1>`  | **31.6px** | 400               | normal   | normal  | `#FFFFFF`                       |
| Section `<h2>`      | **34px**   | 400               | normal   | 47.6px  | `#161616`                       |
| Hero line 2 `<h3>`  | **40px**   | 400 (Medium file) | normal   | 56px    | `#FFFFFF`                       |
| Newsletter `<h2>`   | 46px       | 400               | normal   | normal  | —                               |

**Letter-spacing is `normal` on every heading and every body run measured.** The widely tracked HALCYON wordmark is an image asset, not CSS — nothing in the type system actually uses tracking.

The tally over leaf text nodes returns **24 distinct size/weight/tracking/leading combinations**, including oddities like `12px / 700 / lh 55px`. That is not a scale, it is an accumulation.

**Type crimes, in order of severity**

1. **Heading hierarchy is inverted.** H1 = 31.6px, H2 = 34px, H3 = 40px. The `<h1>`s are the _smallest_ headings on the page.
2. **Three `<h1>`s on the homepage** (HANDCRAFTED, REMASTERED, BESPOKE) and the actual hero headline is an `<h2>`. There is no semantic top-level heading matching what the page is about.
3. **The two-line hero headline uses two sizes and two font files** — 34px Regular over 40px Medium. Visible in `desktop-00.png` as a slight weight/size mismatch between the lines.
4. **The largest type anywhere on a 1440×900 viewport is 46px.** For a full-bleed luxury hero, a 34px headline is timid, not restrained — it occupies 540px of a 1440px canvas and reads as a caption.
5. Two near-identical blacks in the same section: headings `rgb(22,22,22)`, body `rgb(0,0,0)`.
6. Mobile "PRINCIPLES IN MOTION" renders in **Roboto Thin** while the desktop twin renders in Riviera.

---

## 4. Palette (measured, with usage)

| Value              | Hex       | Where                                                                                                                                           |
| ------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `rgb(22,22,22)`    | `#161616` | Dark section ground; heading colour on white sections                                                                                           |
| `rgb(255,255,255)` | `#FFFFFF` | Light section ground; all type on dark                                                                                                          |
| `rgb(0,0,0)`       | `#000000` | Body copy on white sections (72 nodes)                                                                                                          |
| `rgb(233,233,233)` | `#E9E9E9` | Secondary light ground / hairlines                                                                                                              |
| `rgb(200,164,134)` | `#C8A486` | **The only accent.** 14 nodes total: active nav item, `SPIRIT`, `PRINCIPLES`, `THE BEST`, `IT BETTER`, `TO YOU` (+ their mobile duplicates)     |
| `rgb(135,153,159)` | `#87999F` | Slate; 2 nodes only (form chrome)                                                                                                               |
| `rgb(17,109,255)`  | `#116DFF` | **Wix default blue** — confined to the `Skip to Main Content` button, so visually harmless, but it is Wix's brand colour sitting in the palette |

Also present: `rgba(22,22,22,0.8)` and `rgba(22,22,22,0.6)` scrims.

This is the best thing about the site. Two grounds, one accent, used sparingly on the second word of a two-word phrase every time. It is a rule, and they keep it.

---

## 5. Motion inventory

| Device                                                                   | Trigger       | Count                | Duration / easing                     | Verdict                              |
| ------------------------------------------------------------------------ | ------------- | -------------------- | ------------------------------------- | ------------------------------------ |
| **Sticky word stack** — `position: sticky`, `top: 144px / 180px / 216px` | scroll        | 3                    | none (native pin)                     | **Real design.** Zero JS, zero cost. |
| `motion-floatIn`                                                         | on-enter      | 4                    | 1.2s `cubic-bezier(.445,.05,.55,.95)` | Wix stock preset                     |
| `motion-fadeIn`                                                          | on-enter      | 2                    | 1.2s `cubic-bezier(.445,.05,.55,.95)` | Wix stock preset                     |
| `hover-animation-fade-in` (filter + opacity)                             | hover         | 30                   | 0.4s ease                             | Gallery hover, not a reveal          |
| `opacity` transition                                                     | chrome        | 124 @0.2s + 94 @0.4s | ease                                  | Wix chrome                           |
| `color` / `background-color`                                             | hover         | 17                   | 0.3–0.4s ease                         | Buttons and links                    |
| `transform`                                                              | gallery slide | 1                    | 0.8s `cubic-bezier(.46,.1,.25,1)`     | Wix Pro Gallery                      |

**Correcting the first-pass capture:** the "30 animated elements" are `hover-animation-fade-in` gallery-hover classes, not scroll reveals. Only **six** elements carry an actual entrance animation, and both presets share the same 1.2s sinusoidal easing.

Keyframes present in the stylesheets are all Wix stock: `slide-horizontal-new/old`, `slide-vertical-new/old`, `out-in-new/old`, `motion-fadeIn`, `motion-floatIn`, `motion-revealIn`, `fadeIn`, `changing_background`.

**Libraries detected: React and Wix Thunderbolt. Nothing else.** No GSAP, no ScrollTrigger, no Lenis, no Locomotive, no Framer Motion, no Three.

**There is no parallax, no scroll-scrubbing, no video-scrub, no cursor work, no page transition, no split-text, no counter, no reduced-motion handling.** The perceived sophistication is entirely: dark ground + slow fade + one sticky trick.

Fixed/sticky elements: 6 total — a fixed header wrapper, two Wix "pinned-layer" divs (z-index 54 and 55), and the three sticky words.

---

## 6. Media strategy

### The hero video — the single worst thing on the site

`https://video.wixstatic.com/video/5c0dd8_317175044a0443f0a0b4f98d16501851/720p/mp4/file.mp4`

| Property           | Value                                                                              |
| ------------------ | ---------------------------------------------------------------------------------- |
| Transfer size      | **26,941,114 bytes (26.9 MB)**                                                     |
| Codec / dimensions | h264, **1392 × 782**                                                               |
| Frame rate         | **119.88 fps**                                                                     |
| Video bitrate      | 2,914,417 bps                                                                      |
| **Audio track**    | **AAC @ 199,692 bps — on a `muted` element** (~1.7 MB of pure waste)               |
| Duration           | 68.821 s                                                                           |
| Attributes         | `autoplay loop muted`, `preload="auto"`                                            |
| **Poster**         | **none** (`poster=""`)                                                             |
| Rendered into      | 1440.16 × 900.25 CSS px                                                            |
| Other renditions   | `480p` = 11,844,631 B; **`1080p` and `2160p` return HTTP 403 — they do not exist** |

So: a 1392×782 source is upscaled into a 1440×900 box (and cropped — 1.78 source aspect into a 1.60 container), at 120 fps, carrying inaudible audio, with no poster frame, fetched in full on load. It is not lazy-loaded and cannot be — it is the hero. On a 5 Mbps connection that is roughly 43 seconds of transfer before the loop is buffered, and until it paints there is nothing behind the headline. This is why the hero looks slightly soft in `desktop-hero.png` despite being shot beautifully.

### Images

- **42 image requests, 1,476 KB total.** 41 AVIF, 1 GIF. Wix's own delivery is doing good work here.
- Largest single image 139 KB (`fit/w_1920,h_927,q_90`).
- Hero still: 1440×900, rendered 1440px — correct.
- Gallery images: 969×646 natural, ~10 of them marked `loading="eager"`, so a below-fold carousel eagerly fetches its slides.
- One image is served 1328×2160 into a 1476px-wide box.

### Page weight

| Type                  | Requests | Bytes               |
| --------------------- | -------- | ------------------- |
| **media (the video)** | 1        | **26,310 KB (86%)** |
| script                | 104      | 1,223 KB            |
| image                 | 42       | 1,476 KB            |
| prefetch              | 6        | 941 KB              |
| fetch                 | 39       | 639 KB              |
| other                 | 18       | 419 KB              |
| document              | 1        | 223 KB              |
| font                  | 6        | 184 KB              |
| **Total**             | **240**  | **≈ 30.7 MB**       |

Note the **6 route prefetches (941 KB)** — Wix speculatively fetches `/about`, `/cars`, `/contact`, `/newsroom`, `/privacy-policy` and `/cookies-policy` on first paint, whether or not you go there. And 187 KB of that JS is GTM/GA4 (`G-2D7QVVK3H0`).

---

## 7. Navigation and information architecture

**Nav:** HOME · ABOUT · CARS · NEWSROOM · [CONNECT]. Five items, 12px bold, active state in champagne. A `More...` overflow item exists in the DOM at `visibility: hidden`.

**Real routes** (`pages-sitemap.xml`): `/`, `/about`, `/cars`, `/newsroom`, `/contact`, `/privacy-policy`, `/cookies-policy`, **`/gallery`**.
`/gallery` returns **HTTP 200 and is in the sitemap but is not linked from anywhere in the nav** — an orphan page.
`store-products-sitemap.xml` and `store-categories-sitemap.xml` are also served — a Wix Stores app is installed and unused.

**`/newsroom`** is a Wix Blog: 6 posts on `/post/<slug>`, dated Mar 2025 – Apr 2026, each labelled "5–8 min read". This is the only part of the site with depth.

### How an individual car is presented: **it isn't.**

This is the largest gap on the site and the clearest opening for DPM.

`/cars` — titled "Halcyon Cars | The Collection" — is a **single scroll page containing zero individual cars.** It opens:

> **HALCYON CARS**
> **STRIVING FOR PERFECTION**
>
> Introducing the Halcyon's two remastered series: The Genesis Series and The Great Eight Series - Offering two distinct collections of enduring, bespoke, and uncompromising automotive commissions. Dedicated to the Rolls-Royce Corniche and Silver Shadow, each remastering embodies a seamless harmony of artistry and innovation.

…and then delivers five thematic prose sections — **THE DESIGN**, **THE CRAFTSMANSHIP**, **THE EXPERIENCE**, **THE FUTURE**, **THE TECHNOLOGY** — each closing with the identical link `Connect →`.

There is **no per-car page, no gallery per commission, no specification table, no before/after, no build story, no pricing, no lead time, no configurator, no owner's account.** The two named series (Genesis, Great Eight) exist only as phrases in a paragraph. The one named commission — "Highland Heather", debuted at Hampton Court Concours — exists only inside a press release in the blog.

For a business selling six-figure-plus commissions, "The Collection" contains no collection.

---

## 8. What to steal

1. **The sticky word stack.** Three `position: sticky` headings at `top: 144 / 180 / 216px` so each pins under the header and the next accumulates 36px below. Native CSS, no JS, no scroll listener, and it is the only thing on the page that feels authored. For DPM this becomes `STRIPPED → METALWORK → PAINT → ASSEMBLED` — a restoration is _literally_ a sequence, so the device stops being decorative and becomes the argument. (Watch the leading: at 31.6px with `line-height: normal` (~41px) the 36px stagger has the stacked words nearly touching. Give it 1.1em of stagger, not 0.9em.)
2. **The two-word headline with the second word in the accent.** `REAWAKENING THE **SPIRIT**` · `**PRINCIPLES** IN MOTION` · `TAKING **THE BEST**` · `MAKING **IT BETTER**` · `UNIQUE **TO YOU**`. One accent colour, applied to exactly one clause, every single time, on 14 nodes across the whole site. That consistency is worth more than the colour choice.
3. **Two grounds, one accent, and the courage to run 60% of the page as empty ground.** `#161616` / `#FFFFFF` alternating full-bleed, `#C8A486` as the only chromatic event. No cards, no shadows, no borders, no gradients, no third colour. Also: **let the media bleed across the section boundary** — the right-hand image crossing the white→dark seam (`desktop-02.png`) is the one compositional move that stops the page reading as stacked bands.
4. **Editorial offset image pairs.** `/cars` (`halcyon-cars/desktop-02.png`) sets two portrait images at different vertical offsets with the type block on the opposite third. Cheap, and it looks like a magazine spread rather than a grid.
5. **The prose register.** "over one thousand hours to the restoration of each body alone" is a specific, checkable number in the middle of otherwise abstract copy, and it is the most persuasive sentence on the site. DPM has better versions of that sentence available and should use them.

---

## 9. Where it is beatable

**Performance — the headline failure**

- **30.7 MB homepage, 240 requests, of which one video is 26.9 MB (86%).** No amount of art direction survives that on a phone.
- The video is **119.88 fps** — nothing on the web needs more than 30 for a background loop. That alone is most of the file size.
- It carries a **199 kbps AAC audio track on a `muted` element**. ~1.7 MB of data that can never be heard.
- **No poster frame at all.** Until the video buffers, the hero is empty.
- **No 1080p rendition exists** (403). The 1392×782 source is upscaled into a 1440×900 box and cropped from 1.78 to 1.60 aspect. On a 2× display it is a 2.07× upscale. That is why the hero is soft.
- **No WebM/AV1 alternative, no HLS, no `prefers-reduced-motion` fallback.**
- **6 route prefetches (941 KB)** fired on load for pages the visitor may never open, plus 104 script requests / 1.22 MB of JS to render what is, structurally, six static blocks.

**Wix constraints they cannot engineer around**

- Wix ships **both breakpoint DOMs at every viewport**, so every page carries its body copy twice. That is a duplicate-content liability and it doubles the surface for the next problem.
- **The mobile site is shipping stale copy and a live typo that were fixed on desktop.** Verified visually side by side:
  - Desktop: _"…to deliver **an uncompromising** drive."_ → Mobile: _"…to deliver **uncompromising an** drive."_
  - Desktop: _"Powered by what moves you most, effortless performance comes from both our next-generation electric powertrain and our re-engineered 6.75L V8…"_ → Mobile still says: _"Smooth, silent, and powerful, our next-generation electric architecture delivers effortless performance…"_
  - Desktop: _"…with **modern** expectations of performance and refinement"_ → Mobile: _"…with **electric** expectations of performance, refinement, and sustainability"_
  - Mobile BESPOKE simply **drops** the desktop's second paragraph about collaborating with globally renowned talents.
    This is not cosmetic: **the entire Great Eight / V8 repositioning is invisible to mobile visitors.** It is the structural consequence of maintaining two DOMs by hand in a page builder, and it is the single most damaging thing on the site.
- **The sticky word stack does not exist on mobile.** The one bespoke device degrades to three plain headings with hairline rules (`mobile-full.png`). Most visitors never see the design.
- Leftover **Wix Stores** sitemaps, an orphan **`/gallery`** page (200 OK, in the sitemap, not in the nav), a hidden `More...` nav item, and Wix's `#116DFF` in the palette.

**Type**

- H1 (31.6px) **smaller than** H2 (34px) **smaller than** H3 (40px). Three `<h1>`s on the homepage. The hero headline is an `<h2>`.
- **Nothing on a 1440×900 viewport exceeds 46px.** The hero headline is 34px on a 900px-tall canvas.
- The two-line hero headline uses **two sizes and two separate font files** (34px Regular / 40px Medium).
- **24 distinct size/weight/tracking/leading combinations**, including `12px / 700 / line-height 55px`.
- **Zero letter-spacing anywhere** — the tracked wordmark is a bitmap, so the type system has no wide-tracked register at all.
- A 61.9 KB unsubsetted **Roboto Thin** ships to render one mobile heading.
- Two blacks (`#000000` body, `#161616` headings) in the same section.

**Header and contrast**

- The fixed header is **110px tall and renders as an opaque dark band over the light sections**. It does not invert. In `hdr-900.png` (scrolled to y=900) it **bisects the H2 "REAWAKENING THE SPIRIT" exactly through the middle of the letterforms** — a permanent state at that scroll offset, not a capture artefact. In `desktop-06.png` the same dark bar sits across the white footer carrying a stray sliver of car photograph.
- On `/about` and `/cars` the hero photographs are **bright** (sunlit foliage, sky, water) and the nav is white 12px with **no scrim, no backdrop-filter, no colour swap**. `HOME ABOUT CARS NEWSROOM` and the outlined CONNECT button are effectively illegible (`halcyon-about/desktop-hero.png`, `halcyon-cars/desktop-hero.png`).
- The `/newsroom` hero photograph has an **accidental hard black curtain edge occupying the left 22% of the frame**, and the page title sits on it. That is an unretouched studio frame, not a design decision.

**Composition and IA**

- Large stretches of the dark section are **literally empty**: in `desktop-03.png` and `desktop-04.png` the left 60% of the viewport is void `#161616` for ~600px of scroll, and the right-hand media is a ~460px-tall box floating in that void. Several gallery frames are so underexposed they render as near-black rectangles. There is a real difference between _air_ and _nothing_, and the site crosses it repeatedly.
- **Two identical "DISCOVER THE COLLECTION" buttons within ~1,000px** of each other; five identical "Connect →" links on `/cars`.
- The homepage has **no work section, no process, no team, no proof, no location, no numbers** — it goes positioning → positioning → three abstractions → footer.
- **No individual car page anywhere on the site.** "The Collection" contains no collection (§7).
- The **footer's most prominent block is a trademark disclaimer**, which is the least aspirational possible closing note.
- The gallery affordance is a single low-contrast `›` chevron — no dots, no counter, no captions on any image, no way to know how many slides exist.

**Strategic**

- The site's core visual asset is **Rolls-Royce's corporate typeface**, used by a company that spends four footer paragraphs explaining it is not Rolls-Royce. The elegance is rented. A competitor with its own type voice is not just differentiated — it is defensible.

---

## 10. How we go one better (DPM Autobody, Next.js)

**Kill the 27 MB video and win the performance argument outright.**
Target **≤ 2.5 MB above the fold**. AV1/WebM + h264 fallback, 24–30 fps, ~8s loop, 1920×1080 native, no audio track, a real AVIF poster painted first, `IntersectionObserver`-gated for anything below the fold — the exact `lazy-video.tsx` pattern already in `sites/dcs/components/home/lazy-video.tsx`, which took that page from 10.5 MB to ~700 KB. A DPM site that is _ten times lighter and visibly sharper_ than Halcyon is the easiest win available, and David will feel it on his phone in the workshop.

**Make the sticky stack say something.**
Halcyon's three words are adjectives. DPM's are **stages of an actual process**: `STRIPPED · METALWORK · PAINT · ASSEMBLED`. Same native `position: sticky` mechanism, staggered at 1.1em, but each pinned word is bound to a panel showing that stage on _one real car_. The device stops being decoration and becomes the sales argument. And unlike Halcyon's, **it must survive on mobile** — sticky works fine at 390px; there is no excuse for flattening it.

**Build the page Halcyon doesn't have: the individual restoration.**
This is the whole opportunity. One MDX-driven route — `/restorations/[slug]` — per car, each carrying: marque/model/year, months in the shop, hours by discipline, what was done in-house vs. outsourced (DPM's honesty about engine building and trimming is a _credibility asset_, not a gap), a before→after slider on a single fixed camera position, panel-level detail shots, paint code and finish notes, and the concours result if there is one. Ten of these and DPM has ten pages of unfakeable proof against Halcyon's zero. It also solves SEO, which Halcyon has effectively abandoned outside its blog.

**Name the paint capability explicitly — Halcyon can't.**
DPM does Halcyon's paintwork. A "Trusted by" or "Paint partner to" section, stated plainly, borrows Halcyon's positioning while being _true_, and it is the one claim no competitor can copy. **[assumption: subject to whatever Halcyon will permit being said publicly — worth asking David before designing around it.]**

**Fix every type failure by construction.**
One `<h1>` per page, on the hero. A real clamped scale — hero `clamp(56px, 7vw, 112px)`, section H2 `clamp(36px, 4vw, 64px)`, body 18/1.6 — so the hero is **2–3× larger than Halcyon's 34px** and the hierarchy runs the right way. Six sizes total, not 24. One display face plus one text face, both self-hosted, subsetted, `font-display: swap`, preloaded. And use tracking as a deliberate register (wide tracking on eyebrows and the wordmark) — an axis Halcyon leaves entirely on the table. Watch the `tabular-nums` / mono-face comma trap from `CLAUDE.md` on any hours or price figure.

**Make the header adapt.**
Invert nav colour per section via `IntersectionObserver` on section backgrounds, with a scrim only when a hero photograph is bright. Halcyon's opaque bar guillotining its own H2 at y=900 is the kind of defect that reads as _cheap_ the instant you notice it, and it is twenty lines of code to avoid.

**Replace void with texture.**
Halcyon's empty black is the fragile part of the aesthetic. DPM's equivalent should be _material_: full-bleed macro on filler, primer, flatted paint, masking lines, the reflection in a finished panel. Restoration photography is inherently more interesting than a studio-lit engine on black, and DPM has it. Keep Halcyon's ratio of air to content; fill the air with craft rather than nothing.

**Single source of content, one DOM.**
MDX frontmatter → one responsive render. Halcyon's typo is shipped because the copy lives twice; ours cannot diverge because it exists once. Ship a Playwright check that fails CI if desktop and mobile text content diverge on any route.

**Close on proof, not on legal.**
Footer leads with location (Berwick, East Sussex), the disciplines held in house, concours results, and a direct route to David. Legal goes last, small.

---

## 11. Evidence log

| Claim                                                              | Evidence                                                                                                                                           |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wix / Thunderbolt / React, no other framework                      | `halcyon/report.json` → `libs: ["React","wix"]`; `x-wix-request-id` response header; `_partials/wix-thunderbolt/dist/clientWorker.*.bundle.min.js` |
| Homepage section order, copy, composition                          | `halcyon/desktop-hero.png`, `desktop-00.png` … `desktop-06.png`, `desktop-full.png`; text extracted from live HTML                                 |
| Hero headline 34px + 40px, two font files                          | `probe-type.mts` output — H2 `TIMELESS ELEGANCE,` 34px `wfont_bc7763…`; H3 `REMASTERED` 40px `wfont_853e10…`                                       |
| Inverted hierarchy, three H1s                                      | `probe-type.mts`: H1 31.6px ×3, H2 34px, H3 40px; `probe-motion.mts` → `h1: ["HANDCRAFTED","REMASTERED","BESPOKE"]`                                |
| 24 distinct type combinations                                      | `halcyon/report.json` → `desktop.typeScale`                                                                                                        |
| Font identities (Riviera Nights / Roboto Thin / stripped `"Font"`) | `fontTools` name-table dump of all six `.woff2` from `static.wixstatic.com/ufonts/*`                                                               |
| Riviera Nights = Rolls-Royce corporate face                        | Pentagram, Rolls-Royce press release, Swiss Typefaces, Fonts In Use (§3)                                                                           |
| Palette values and usage counts                                    | `halcyon/report.json` → `textColors` / `bgColors`; `probe-type.mts` → `accentEls` (14 nodes), `wixBlue` (skip-link only)                           |
| Sticky word stack at `top: 144/180/216px`                          | `probe-motion.mts` → `stickies`; visible accumulating in `desktop-02/03/04.png`                                                                    |
| Only 6 elements animate; both presets Wix stock                    | `probe-motion.mts` → `animations: motion-floatIn ×4, motion-fadeIn ×2` @1.2s `cubic-bezier(.445,.05,.55,.95)`; `keyframes` list all Wix            |
| No GSAP/ScrollTrigger/Lenis/parallax                               | `probe-motion.mts` `libs`; no scroll-scrub or transform-on-scroll in transition tally                                                              |
| "30 animated elements" are hover states                            | `probe-motion.mts` → `hover-animation-fade-in: 30`, transition `filter, opacity 0.4s`                                                              |
| Video: 26.9 MB, 1392×782, 119.88 fps, AAC audio, 68.8s             | `ffprobe` on a 3 MB range request; `curl -I` content-length `26941114`                                                                             |
| No 1080p/2160p rendition                                           | `curl -I` → HTTP 403 on both; 480p = `11844631`                                                                                                    |
| No poster, `preload="auto"`, not lazy                              | `probe-motion.mts` → `dom.videos[0]`                                                                                                               |
| 30.7 MB / 240 requests / 86% video / 41 AVIF                       | `probe-motion.mts` `reqs` aggregate                                                                                                                |
| 6 route prefetches                                                 | `reqs` → `prefetch` ×6, 941.3 KB                                                                                                                   |
| Header opaque dark bar bisecting H2                                | `scratchpad/hdr-900.png` (scrollY=900, deliberate re-capture); also `desktop-01.png`, `desktop-06.png`                                             |
| Section at rest is clean (so it _is_ the header)                   | crop of `desktop-full.png` at y≈950–1120                                                                                                           |
| Nav illegible over bright hero photos                              | `halcyon-about/desktop-hero.png`, `halcyon-cars/desktop-hero.png`                                                                                  |
| Newsroom hero has a black curtain edge                             | `halcyon-newsroom/desktop-hero.png`                                                                                                                |
| Empty voids in dark sections                                       | `halcyon/desktop-03.png`, `desktop-04.png`                                                                                                         |
| Mobile flattens the sticky stack                                   | `halcyon/mobile-full.png`                                                                                                                          |
| Mobile typo `"uncompromising an drive"` + stale copy               | `scratchpad/mob-mib.png` (2× crop of `mobile-full.png`, y 6200–7500) vs. `halcyon/desktop-03.png`                                                  |
| Mobile BESPOKE drops a paragraph                                   | `scratchpad/mob-remastered.png` vs. `halcyon/desktop-04/05.png`                                                                                    |
| Mobile hero crop clips the mascot                                  | `halcyon/mobile-hero.png`                                                                                                                          |
| IA: 8 pages, 6 posts, orphan `/gallery`, Wix Stores leftovers      | `sitemap.xml`, `pages-sitemap.xml`, `blog-posts-sitemap.xml`; `curl -I /gallery` → 200                                                             |
| `/cars` has no individual car                                      | `halcyon-cars/desktop-00..07.png`; full text extraction of `/cars`                                                                                 |
| Footer leads with legal                                            | `halcyon/desktop-05.png`, `desktop-06.png`                                                                                                         |

**Tools written this session** (in `research/tools/`, alongside the existing `capture-site.mts`):
`probe-motion.mts` — motion/transition/sticky inventory + full network aggregate + DOM stats.
`probe-type.mts` — computed type ladder, header metrics, accent-colour and Wix-blue node census.
`probe-header.mts` — header background state sampled at three scroll offsets, with screenshots.

All three hit the documented `__name is not defined` trap; each carries the `addInitScript` shim. All three also need `waitUntil: 'domcontentloaded'` — `networkidle` never settles because the hero video loops forever.
