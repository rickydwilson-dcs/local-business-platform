# Templates sweep — Batch A (fuel … agenciy, 32 slugs)

Assessed 2026-08-20, desktop only (1518×784), real wheel events via the `computer` scroll action,
paired before/after screenshots. No sign-ins, no "Use for Free", no cookie banners on any demo.

## Method note that saved the batch — read this first

**The `<slug>.framer.website` guess is wrong for roughly a third of Batch A.** `kirk` 404s at that
address (real demo is `kirk-sinner.framer.website`); `create`/`fabrica`/`vertical`/`folira`/`homy`
live on `framer.media`, `platform`/`constantine`/`fiber` on `framer.ai`. The reliable route is to
fetch the template page HTML and read the embedded `"previewUrl"` key out of the inlined JSON — every
template page carries `{"price": …, "paymentUrl": …, "remixUrl": …, "previewUrl": …}`. Full verified
URL + price map for all 32 slugs is at the bottom.

Also: the Chrome permission layer only grants **one new domain per `browser_batch`** — put the
`navigate` first and do all the work for that one site in the same batch.

---

## Shortlist (best 5, strongest first)

### 1. Oberon — https://oberon.framer.website/ — $129

Strongest in Batch A, and the only one whose subject matter is adjacent to DCS (an
operations/automation services firm, not a photo portfolio). Blueprint-engineering aesthetic rather
than fashion editorial, which suits "we build and maintain your systems" far better than a giant
serif does.

**Aesthetic:** A full-page dashed blueprint grid sits behind everything, with a single orange dashed
vertical axis running the height of the page and `+` crosshairs at intersections — every section is
visibly measured against the same rule. Two-face type system: mono uppercase for labels against a
humanist sans for headings and body. Section counters are a two-tone chip — solid orange `02` butted
against light-grey `AREAS` — a sharper version of Sylven's `[01] // BRAND EXCELLENCE` bar because it
reads as a tab, not decoration. A vertical `01–07` stack of page-index tiles sits at the far left of
the hero.

**Animation:**

- **Hero flow diagram.** Isometric node graph on the right: a hatched orange square (the system) with
  dashed connectors and travelling arrows out to a contact card, a document and a database tile. It
  literally draws the pipeline the copy is selling. Dashed-line travel =
  `stroke-dasharray`/`stroke-dashoffset` keyframe on inline SVG — **pure CSS**.
- **Process row.** `AUDIT YOUR WORKFLOW → DESIGN THE AUTOMATION SYSTEM → BUILD & INTEGRATE THE STACK
→ LAUNCH, TEST & OPTIMIZE`, with `DATA IN > / DECISION > / EXECUTION > / RESULT >` above four
  glyphs joined by dashed arrows. Reveals left-to-right so the sequence _reads_ as a sequence — the
  clearest example in the batch of motion carrying information. **IntersectionObserver + staggered
  delay.**
- **Hero intro stagger.** At 4s after load I caught it mid-flight rendering partial strings. Settled
  by ~6s. **IO + delay.**

**Components worth taking:**

- Two-tone section counter chip: `[02]` orange block + `AREAS` grey block, butted, no gap.
- Corner-bracket stat trio pinned to the hero's bottom edge: small orange `⌐` above each of
  `CUT ADMIN TIME BY UP TO 50%` · `30+ AUTOMATIONS LAUNCHED` · `FROM LEAD INTAKE TO REPORTING`. Same
  slot as Sylven's corner metadata, but the content is proof copy.
- Split-CTA bar: one white and one black button flush edge-to-edge, full column width.
- Nav: small `BOOK A CALL` pill that widens on scroll, plus a solid black square hamburger.
- Testimonial attribution as a tiny square avatar + `MIA CONNOR, CEO` in mono, dropped into the left
  gutter of a services grid rather than into a card.
- Service grid whose cells are divided by _dashed_ rules continuing the blueprint grid.

**Functional risk:** **Count-up confirmed** — the results row read `1X FASTER` in one frame and
`4X FASTER LEAD RESPONSE` two seconds later. Hard disqualifier; author `4X` statically. Beyond that,
most sections are `opacity: 0` until in view, but reveals fired reliably on every real-wheel pass and
the page never blocked scrolling. No preloader. Nothing needs Framer's scroll engine.

Screenshots: `shots/screenshot-1787258410727-183.jpg` (hero),
`shots/screenshot-1787258410725-180.jpg` (services grid + counter chip)

---

### 2. Create® — https://createstudio.framer.media/ — $129

Best _component_ craft in the batch by a distance, and it carries the single most useful device I
found — but it is also the batch's cleanest reproduction of the Sylven stat failure. Parts donor, not
a template to buy wholesale.

**Aesthetic:** Off-white/near-black with one hot coral accent; wide grotesk for display, mono for all
labels. `create®` wordmark with a real superscript ®. Case-study panels are full-bleed edge-to-edge
images with the client's own logo lock-up top-left and the project name optically centred — a
magazine spread rather than a card grid.

**Animation:**

- **Nav superscript counts.** `WORK⁵  STUDIO  WHISPERS⁷` — the superscripts are _live counts_ (5
  projects, 7 journal posts), not decorative indices. Sylven's `Home 01 / Projects 02` done properly:
  same look, now it tells you something before you click. Static markup, no motion needed.
- **Case-study metadata slide-in.** The mono tech-stack list and `YR/2025` marker rise into place as
  the panel enters. **IO + transform**; content present in markup.
- Typographic manifesto (`we listen / we imagine / we create`) colour-swapping the last line to
  coral — but it eats ~3 viewport heights, a cost not a feature.
- Giant `services` word with a blurred mirror reflection — CSS `scaleY(-1)` + mask, no library.

**Components worth taking (this is the section that matters):**

- **Nav links with live superscript counts** — `WORK⁵`, `WHISPERS⁷`.
- **Mono tech-stack column inside a case study.** Down the left edge of each project panel:
  `REACT / WEBGL / NODE.JS / AWS LAMBDA / OPENAI EMBEDDINGS`, with `YR/2025` bottom-right and a mono
  subtitle under the project name. For a firm that actually builds things this is far better proof
  than a testimonial — and DCS can populate it truthfully from MDX frontmatter.
- Project-index footer bar: `2017–2025 ———————— [→] More Projects⁵`.
- Section index right-aligned as `/01` on a hairline whose left end carries a short coral tick.
- Service bullet lists prefixed with a coral `+` instead of a disc.
- Stat sub-markers: a tiny hatched swatch + rule + `//001`, `//002` under each figure.

**Functional risk:** **Count-up, and the exact Sylven failure.** I caught the proof row rendering
`10+ / 10% / 10 / 10%` with the labels invisible; two seconds later it settled to
`86+ PROJECTS SHIPPED / 80% REPEAT COLLABORATIONS / 32 INDUSTRY AWARDS / 89% CLIENT RETENTION RATE`.
Anyone landing mid-animation, on a slow phone, or with the script dead reads a page claiming ten of
everything. Strip it. Also: three screens of manifesto before any substance, and a third-party author
badge pinned bottom-right.

Screenshots: `shots/screenshot-1787258520605-189.jpg` (tech-stack case study),
`shots/screenshot-1787258520605-190.jpg` (project-index bar),
`shots/screenshot-1787258520606-191.jpg` (**stats mid-count-up — the defect**),
`shots/screenshot-1787258520606-192.jpg` (stats settled), `shots/screenshot-1787258520606-194.jpg`

---

### 3. Constantine — https://constantine.framer.ai/ — $49

Cheapest on the shortlist and the one whose _word-reveal_ animation actually works properly — worth
studying precisely because three other templates here got the same effect wrong.

**Aesthetic:** Deep navy and bone, Swiss/fashion editorial. Nav is a **justified five-item row across
the full page width** — `ABOUT · WORK · ( CØNSTANTINE ANGEL ) · BLOG · CONTACT` — studio name in
parentheses at dead centre, slashed Ø in the wordmark. Body copy is set in genuinely **justified**
narrow columns (real `text-align: justify` with visible word-space stretching), which almost nothing
on the web does and which reads as expensive.

**Animation:**

- **Manifesto word reveal.** Words arrive in sequence and — critically — **the reveal completes and
  settles**, leaving keywords in a lighter tint as permanent emphasis. Contrast Agenciy/Platform
  below, where the same-looking effect leaves the headline's tail permanently ghosted. **IO +
  per-word span stagger**, trivially reproducible.
- **Rotating circular service badge** — `UI/UX, DEVELOPMENT, BRANDING, ILLUSTRATION` set around a
  circle, slowly turning. One CSS `rotate` keyframe.
- **Corner crop-arrows framing the hero image** — `↱ ↰ ↳ ↲` at the four corners. Static, but it's
  corner-metadata rendered as printer's registration marks.
- Hero wordmark set at literal viewport width, half-cropped by the fold.

**Components worth taking:** justified full-width nav row with brand in parens at centre; four-corner
directional arrows framing a hero image; justified multi-column body text; rotating circular
capability badge; keyword-tinted manifesto paragraph.

**Functional risk:** Content present at first paint (nav, hero image, wordmark all immediate — unlike
most of this batch). No preloader, no scroll-jack, **no count-ups**. Caveats: personal-portfolio voice
rather than firm voice, and the navy is so saturated it would need retuning. Lowest functional risk
on the shortlist.

Screenshot: `shots/screenshot-1787258842213-200.jpg`

---

### 4. Fuel — https://fuel.framer.website/ — **free**

Highest hit-rate on Sylven-style detail in the whole batch, and free — but its hero has a real,
reproducible timing problem that must be understood before anyone copies it.

**Aesthetic:** Burnt-orange/black, giant grotesk, dense corner instrumentation. `FUEL®` with
superscript ®. Nav is `Home⁰¹ Portfolio⁰² About⁰³ Contact⁰⁴` — the literal Sylven device. Hero
corners carry `© 2025` plus a **ruler tick-strip and a `19′` measurement** bottom-left, with
free-floating `+` crosshairs across the image. Section headers repeat as a three-slot hairline bar:
`◆ (01)` left · `(About Us)` centre · `© 2025` right — incrementing to `(02) (Portfolio)`,
`(03) (Premium Services)`, `(04) (Pricing)`.

**Animation:**

- **Sticky-stack portfolio.** Project cards stack under a pinned left column and a pinned right pill
  (avatar + `See all (07)`), each card carrying a blurred enlargement of its own image as backdrop.
  **`position: sticky` + transform** — one of the more reproducible good effects in the batch.
- **Angled section transitions.** Black→white boundaries cut on a diagonal — a `clip-path` polygon,
  not an image.
- Mono marquee of city names as the client strip.
- Standard in-view fade/rise on almost every block.

**Components worth taking:**

- Nav links with superscript numerals (`Home⁰¹`).
- Repeating three-slot section header bar on a hairline: `◆ (01)` / `(About Us)` / `© 2025`.
- **Price presentation:** a small superscript `$` raised above the cap-height of a very large
  numeral, `/ Month` in small roman beside it. Three tiers, only the top one inverted to black. Best
  price component in the batch.
- **Stat rows as a two-column table on hairlines**, not as a stat grid: `New clients ——— 15`,
  `Success rate ——— 100%`. Static, right-aligned, one rule per row. Because it's a table there's no
  temptation to animate it — a good pattern to steal _instead of_ a KPI band.
- Numbered services list: outline `01 / 02 / 03` at ~200px, small image, title + body, each on a
  hairline.
- Persistent top-right "Meet the CEO" card with real photo, name, role and an expand glyph.
- `Explore Now` link style: underline rule with a small `⌐` corner bracket at its top-right.

**Functional risk:** **The hero is timing-fragile.** Cold load rendered complete. On a warm reload,
five seconds in, the entire hero was gone — nav and CEO card only — and it did not finish arriving
until roughly **eleven seconds** after load. It does get there and never blocks scrolling, but a
visitor on a slow connection sees a blank orange rectangle for the first ten seconds of their first
impression. Take Fuel's _components_, not its reveal timing. The `15 / 100%` figures appeared
instantly in a table layout — no evidence of count-ups.

Screenshots: `shots/screenshot-1787258855122-201.jpg` (**hero at 5s — the failure**),
`shots/screenshot-1787258876533-202.jpg` (hero settled ~11s), `shots/screenshot-1787258876534-204.jpg`

---

### 5. Manner — https://manner.framer.website/ — $49

Quiet Swiss editorial. Fewer fireworks, least likely to embarrass itself.

**Aesthetic:** Pure white, black grotesk, one red accent used only on the buy badge. Nav is a
**justified five-item row spanning the full viewport** (`INDEX · STUDIO · WORK · CONTACT · NEWS`)
with a mono status line pinned above it: `● SELECTED WORK/2026`. The hero is not a headline — it's a
running paragraph of body copy at display size in which the client names are set in grey as inline
links. An unusually confident hero, and it would carry DCS's actual client roster.

**Animation:** Minimal by design. Project cards fade/rise into a two-up grid; the mono status line
above the nav swaps its label at section boundaries; alternating left/right project columns create a
pseudo-parallax purely through unequal column heights, no JS. All **IO + CSS transition**.

**Components worth taking:** the justified full-width nav row; the mono `● LABEL/YEAR` status line
above the nav; the running-paragraph hero with client names as inline links; and **project cards
captioned with a row of soft grey service-tag chips** — `Brand Identity · Visual Systems · Digital
Experience`. Those map straight onto DCS's service taxonomy.

**Functional risk:** Reveal-gated like everything else — cards render as empty space for about a
second after the wheel event — but the hero paragraph was present at first paint, no preloader, no
scroll-jack, **no count-ups**. Very large empty columns on desktop.

---

## Also-rans (one line + url)

- **Agenciy** — https://agenciy.framer.website/ — free — glassy dark 3D hero, `/01–/04` service cards
  with isometric glyph icons in one continuous rounded container, pill section labels with inline
  icons. Good component craft; disqualified by the headline treatment under Rejected.
- **Platform®** — https://plat-form.framer.ai/ — $129 — `plat—form™` em-dash wordmark, top-edge
  scroll-progress bar, `001 / plat—form` on a left hairline as section index, and a
  `Product Lineup ————————— 8/8` progress meter (a carousel counter that genuinely tells you where you
  are). Same headline flaw as Agenciy.
- **Das Studio** — https://dasstudio.framer.website/ — free — `PROJECTS ⁽⁶⁾` superscript count in
  parentheses, `WHO WE ARE` label left / `01` index right. Hero rendered blank white for five seconds.
- **Aurorix** — https://aurorix.framer.website/ — free — persistent left rail carrying avatar, nav,
  bio, socials and a `Resume` button; awards as a three-column table on hairlines. Hand-drawn
  scrapbook aesthetic — the opposite of "elevated agency".
- **Portavia** — https://portavia.framer.website/ — free — one genuinely good idea: the floating nav
  pill **morphs on scroll from a full menu into a compact "avatar + Available for work + green dot"
  status chip**. Everything else, including the count-ups, is a reject.

---

## Rejected for animation reasons (name + the specific sin)

- **Mondragon** — https://mondragon.framer.website/ — $59 — **the whole landing page renders blank.**
  It's a six-demo chooser; `document.body.innerText` returns the demo list, so content is in the DOM,
  but nothing is ever painted. Fifteen seconds, real wheel scrolling, an 886px body that won't move.
  The purest example of `opacity: 0` reveal-gating failing outright — on the page the buyer lands on
  first.
- **Fabrica®** — https://fabrica.framer.media/ — $129 — **permanent preloader lock.** Black screen,
  `fabrica®` centred, seventeen seconds, wheel scrolling does nothing. A $129 template whose demo
  cannot be viewed.
- **Mōno™ (`mono-x`)** — https://monod.framer.website/ — $99 — identical permanent preloader lock.
- **Nyro** — https://nyro.framer.website/ — free — **count-ups plus a blank hero.** Stat block caught
  mid-count reads `Projects 13 / Years Experience 2 / Happy Clients 16 / Awards 0`, settling at
  `64 / 10 / 80 / 10`. "Awards **0**" is Sylven's `$0` all over again.
- **Create®** — count-up on the proof row. Shortlisted anyway _as a parts donor_; the stat band must
  not be copied.
- **Oberon** — count-up on `4X FASTER LEAD RESPONSE` (caught at `1X`). Shortlisted; strip it.
- **Portavia** — count-up: `0 Years of Experience / 4 Completed Projects / 1+ Clients` → `12 / 270 /
50+`. "0 Years of Experience" on a freelancer's homepage.
- **Agenciy** — **the headline fill never completes.** Every project heading uses a
  scroll-progress-linked per-character colour fill, and at rest the tail stays ghosted:
  `Virtual Reality Encounte`**r**, `Theo Agency Re-bran`**ding**. Not a transient reveal — it is the
  permanent state at that scroll position, so a substantial fraction of every headline is unreadable
  while you are looking at it. Same effect, same failure, on **Platform®** and **Nyro**.
- **kirk** — https://kirk.framer.website/ returns "Site Not Found". Not a template fault; the slug
  list's URL convention is wrong for it. Real demo: `https://kirk-sinner.framer.website/`.

---

## What I did not cover

Opened live and assessed (15 of 32): `fuel`, `mondragon`, `kirk` (404), `agenciy`, `oberon`,
`fabrica`, `create`, `platform`, `das-studio`, `nyro`, `manner`, `mono-x`, `portavia`, `constantine`,
`aurorix`.

**Not opened** (17): `vertical`, `portfolite`, `miles`, `creatie`, `folira`, `palmer`, `mike-bennet`,
`viper`, `meeko`, `spartans`, `taylor`, `fiber`, `playback-studio`, `visual-frame`, `luzia`, `clipzy`,
`homy`. Verified demo URLs for all of them are in the table below, so a follow-up pass needs no
discovery step.

Mobile/responsive not assessed (desktop-only per brief). No hover-state pass on Manner or Constantine.

---

## Appendix — verified demo URLs and prices for all 32 Batch A slugs

Extracted from each template page's embedded `previewUrl` / `price` JSON, not guessed.

| slug            | price | demo URL                                | opened |
| --------------- | ----- | --------------------------------------- | ------ |
| fuel            | free  | https://fuel.framer.website/            | yes    |
| mondragon       | $59   | https://mondragon.framer.website/       | yes    |
| kirk            | free  | https://kirk-sinner.framer.website/     | no     |
| create          | $129  | https://createstudio.framer.media/      | yes    |
| fabrica         | $129  | https://fabrica.framer.media/           | yes    |
| vertical        | $129  | https://vertical.framer.media/          | —      |
| portavia        | free  | https://portavia.framer.website/        | yes    |
| portfolite      | free  | https://portfolite.framer.website/      | —      |
| platform        | $129  | https://plat-form.framer.ai/            | yes    |
| miles           | free  | https://noahmiles.framer.website/       | —      |
| mono-x          | $99   | https://monod.framer.website/           | yes    |
| creatie         | free  | https://creatiie.framer.website/        | —      |
| folira          | $99   | https://folira.framer.media/            | —      |
| constantine     | $49   | https://constantine.framer.ai/          | yes    |
| palmer          | free  | https://palmer-template.framer.website/ | —      |
| mike-bennet     | free  | https://mikebennet.framer.website/      | —      |
| viper           | free  | https://viper-template.framer.website/  | —      |
| oberon          | $129  | https://oberon.framer.website/          | yes    |
| meeko           | free  | https://meeko-template.framer.website/  | —      |
| spartans        | $129  | https://spartanai.framer.website/       | —      |
| taylor          | free  | https://taylordesigner.framer.website/  | —      |
| fiber           | free  | https://fiber.framer.ai/                | —      |
| das-studio      | free  | https://dasstudio.framer.website/       | yes    |
| playback-studio | $19   | https://playbackstudio.framer.website/  | —      |
| visual-frame    | $39   | https://visual-frame.framer.website/    | —      |
| nyro            | free  | https://nyro.framer.website/            | yes    |
| luzia           | free  | https://luzia.framer.website/           | —      |
| aurorix         | free  | https://aurorix.framer.website/         | yes    |
| manner          | $49   | https://manner.framer.website/          | yes    |
| clipzy          | $49   | https://clipzy.framer.website/          | —      |
| homy            | $49   | https://homy.framer.media/              | —      |
| agenciy         | free  | https://agenciy.framer.website/         | yes    |
