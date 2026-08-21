# Agency sweep

Segment: `framer.com/community/gallery/categories/agency/` + `featured/?category=agency`.
The Agency category is **not** an infinite feed — it is a finite set of 33 posts (12 in the
Featured carousel, 21 in Trending). I enumerated all 33 slugs, resolved 25 live domains from the
tile text, and opened 13 of them. `default-studio.com` (the seed reference) sits in this category,
which is a good sign the segment is the right hunting ground.

Screenshots live in
`/var/folders/0q/45_vy13x57731v52n3nc56100000gn/T/claude-chrome-screenshots-Qrhs3g/`.

---

## Shortlist

### 1. Luna UI — https://lunaui.co/

**Why it's here:** It is the same business as DCS (a founder-led studio selling websites plus a
monthly care retainer) and every single section is a _component_, not a text block. Crucially it
has the one thing the brief says the DCS prototypes lack — abstract UI-mock illustrations that
carry meaning — and it has them three times over, each doing a different persuasive job.

**Components worth taking:**

- **Fake product-workspace mock** (`…-98.jpg`) — a full-width dark card rendered as a design tool:
  left rail with Pages/Layers/Content tabs and a real-looking layer tree (Home page > Desktop >
  Main > Hero > Features > Cards > Contact > Footer, plus collapsed Tablet/Mobile), centre canvas
  with a "▶ Desktop 1200 … Breakpoint +" bar and a miniature website inside it, right panel with
  Size/Width `1 fr`/Height/Align/Content/Title/Color/Size fields and a live slider. Two coloured
  multiplayer cursors labelled **"You"** and **"Liana"** drift over a wireframe globe. It sells
  "we work with you, in the open" without a word of copy. This is the single best idea I found.
- **Services bento with live artefacts** (`…-105.jpg`) — three unequal cards; card 1 "No
  code-Websites" holds a real site screenshot in a tilted device frame; card 2 "Redesign" is a
  **draggable before/after slider** with `Before`/`After` pills and a circular `<>` handle sitting
  on the split; card 3 is text-only. Each card has a ~36px dark circular icon chip above the
  heading. Directly reusable: DCS's "we rebuild tired websites" pitch _is_ a before/after.
- **Pricing: retainer card + range card, not three fake tiers** (`…-121.jpg`) — left narrow card
  "Site Growth · $1,400/mo" with a feature list using small circled `+` glyphs, outlined pill CTA
  "Start partnership", and a grey micro-line beneath the button: "Cancel anytime • 7-day notice".
  Right wide card "Design & Build · From $2,200" splits internally: "What's included" checklist on
  the left, **"Common projects"** price list on the right (Landing Page — from $2,200 / Full
  Website (6–8 pages) — from $3,800 / Brand & Website — from $5,500). CTA row is a solid white
  pill "Go with Luna UI" plus a secondary text link "Prefer email? →", with its own micro-line
  "No hidden fees • You approve everything first". Two cards beat three columns on mobile, and the
  from-price list solves "we can't publish one number".
- **Process as sticky-left / scroll-right** (`…-117.jpg`) — left column pins (eyebrow pill +
  two-line headline + sub + CTA); right column runs steps `01`–`04` past it, each fading up to
  full opacity as it enters, against a vertical hairline with a travelling filled dot at the
  active step. Stacks cleanly on mobile because the left column is just a normal block above.
- **Testimonial paired with the work** (`…-113.jpg`) — one card, not a 3-up: quote at ~26px left,
  attribution below, "See project" pill with a two-dot motif; right half is the project image with
  ←/→ arrows _inside_ the image and an `01` counter beneath. Far more credible than a wall of
  avatars.
- **Section eyebrow as a soft pill** — every section opens with a centred low-contrast pill
  ("Partnership", "Services", "Projects", "Testimonials", "Process", "Pricing") above a
  ~64px light-weight headline. Cheap to build, gives the page a spine.
- Nav is a floating dark pill ("Start a project" + two dots) plus a separate 3-dot menu button —
  the mobile pattern is the desktop pattern, which is exactly the discipline DCS needs.

**Reservations:** It is black with an animated starfield and very low-contrast body copy — that
reads "AI startup", not "plumber in Bristol". Take the components, invert the palette. The
starfield is also a real mobile perf risk.

**Screenshots:** `…-87.jpg` (nav/hero) `…-98.jpg` (workspace mock) `…-105.jpg` (services bento)
`…-107.jpg` (projects) `…-113.jpg` (testimonial) `…-117.jpg` (process) `…-121.jpg` (pricing)

---

### 2. Bureau Dimanche — https://www.bureaudimanche.com/

**Why it's here:** A one-woman studio selling to French SMEs, in light off-white with a floating
pill nav — i.e. the seed reference's clothing on DCS's business. Its pricing section is the best
_plain_ pricing component in the whole sweep, and the whole page is built for a buyer who is
nervous about cost.

**Components worth taking:**

- **Pricing cards led by the customer's own objection** (`…-145.jpg`) — three white cards on
  off-white, ~20px radii. Title is numbered ("1. Identité visuelle", ~34px). Directly beneath, in
  italic and inside guillemets, is _the sentence the client says_: « Il nous faut une charte
  graphique. » / « Il nous faut une marque mémorable. » / « On veut avoir l'air de ce qu'on
  vaut. » That is a transferable trick — DCS's would be «We just need something that shows up on
  Google.» Then body copy, a hairline, a small "À partir de" label, the price at ~46px with a
  superscript "HT", a "Durée : 1 mois" meta line, then a grey-tick feature list.
- **Featured plan raised, not inverted** — the middle card is taller, wider and carries a 1.5px
  black border while the outer two stay borderless; the badge is a filled green dot + green text
  "Offre la plus choisie". Much lighter-touch than flipping a card to dark, and it survives being
  stacked on mobile (the border still reads).
- **Non-repeating feature lists** — tier 2's first bullet is literally "Toute l'offre 1", tier 3's
  is "Toute l'offre 2 (sans site vitrine)". Kills the usual wall of duplicated ticks.
- **Persistent floating contact bar** (`…-147.jpg`) — a white pill fixed bottom-centre: two lines
  of text ("Parlons de votre projet" / "Email ou appel de 30 min.") beside a solid black circular
  mail button and an outlined circular calendar button. Always-visible, thumb-height, and it
  doubles as the mobile CTA.
- **Two-tone headline** — first line at ~40% grey, second line black ("Des prix clairs. / Des
  marques qui le sont aussi."). One rule, instant hierarchy, no extra components.
- **Founder-credibility block** — a condensed CV as rows of `Company | Role | 2023-2021`, plus a
  first-person "I've been in your seat" essay. DCS could run the same play.
- Numbered FAQ (`01`–`05`) with real, specific answers rather than filler.

**Reservations:** French-only, and the copy voice is confessional in a way that suits a solo
designer more than an IT/web company. The pricing is publicly numbered, which DCS may not want.

**Screenshots:** `…-142.jpg` (pill nav + hero) `…-145.jpg` (pricing row) `…-147.jpg` (floating
contact bar + two-tone headline)

---

### 3. Onmoon — https://www.onmoon.fr/

**Why it's here:** It contains the answer to "pricing tables die on mobile". Instead of three
columns that squash, it uses a **vertical selector list driving one detail panel** — a layout that
is _born_ mobile and merely gets wider on desktop. Productised service agency, same shape as DCS.

**Components worth taking:**

- **Selector-list pricing** (`…-170.jpg`) — left column is three rounded-16px outlined rows
  (Orbite / 30 Secondes · Lunaire / 60 Secondes · Nova / 90 Secondes). The active row gets a pale
  tint fill, an orange 1px border and a **filled black circular tick** at its right edge; inactive
  rows show a grey outlined circular `→`. The middle row carries a small orange "Best seller" pill.
  Under the list: an overlapping avatar stack + five orange stars + "50+ clients satisfaits".
  Right column is a single panel: preview media in a rounded card, a small square orange icon chip
  beside the plan name, price at ~56px ("1 490€ HT"), a **full-width solid orange CTA**, a centred
  one-line description, then "Ce qui est inclus :" as a two-column checklist with orange circled
  ticks. On mobile the list stacks above one panel — nothing shrinks.
- **Add-on chips above the selector** — "+450 € Autre Format (9:16 ou 1:1)" / "+450 € Version
  Anglaise". Neat way to show optional extras without a fourth tier.
- **Scroll-linked method timeline** (`…-171.jpg`, `…-173.jpg`) — a vertical rail down the left
  that _fills orange_ as you scroll, with a dot per step that switches from grey to solid white
  when its step is active. Each step is a large heading + one-line body on the left, an outlined
  `SEMAINE 1` chip on the right, then a full-width media card below. Stacks natively.
- Floating WhatsApp button (green circle) and floating phone button (orange circle) bottom-right —
  crude but exactly right for a trades audience who want to call.

**Reservations:** The booking widget (`…-172.jpg`) pairs "Il ne reste que quelques places" with a
**countdown timer** — fake scarcity, a dark pattern. Do not copy that. Also very orange/black and
the media cards are heavy AI-nebula stock; the layout is the value here, not the art direction.

**Screenshots:** `…-169.jpg`/`…-170.jpg` (selector pricing) `…-171.jpg`/`…-173.jpg` (method
timeline) `…-172.jpg` (booking widget — cautionary)

---

### 4. Reiseservice Jeremias / "Honeymoon Agency" — https://www.hochzeitsreisen-hannover.de/

**Why it's here:** This is the only site in the segment that _is_ a DCS-type client — a solo
travel consultant in Lehrte, near Hannover, selling a considered purchase to nervous couples. It
is therefore the best evidence of what an elevated small-local-business page looks like, and its
contact section is the most directly liftable component in the sweep.

**Components worth taking:**

- **Contact block: channel tiles + form + reassurance** (`…-163.jpg`) — left column has eyebrow,
  a two-line serif headline, an italic sub, then four rows each with a soft-tinted rounded-square
  icon (phone / WhatsApp / mail / pin), a small grey label above and the actual value in bold
  below. Right column is a tinted rounded card holding the form: labelled fields, a **select of
  destinations** (i.e. pre-qualify the enquiry), a textarea with a human placeholder ("Erzählt mir
  kurz, wovon ihr träumt…"), a full-width solid CTA, and beneath it the line that does the real
  work: "Kostenlos & unverbindlich · Antwort innerhalb von 24 h". DCS should ship this almost
  verbatim.
- **Service card where the price _is_ the button** (`…-159.jpg`) — 3:4 full-bleed photo tile with
  a dark bottom gradient; a translucent glass pill top-left with a pin icon + category ("Ruhe &
  Luxus", "Abenteuer & Wildnis"); serif name at ~34px bottom-left; one-line sub; then a
  **full-width solid brand-pink pill button reading "10 Nächte · Ab 3.490 €"**. The commercial fact
  and the click target are the same object. Trivially adapted: "Website care · from £49/mo".
- **Trust bar directly under the hero** — three stats with a bold figure line and a small grey
  qualifier below ("Über 800 glückliche Paare / seit 2001").
- **Testimonials with place and year** — five stars, quote, then "Julia & Markus / Hannover · 2024".
  The town name is what makes it believable for a local business.
- Twelve-item FAQ answering actual money and logistics questions, not brand fluff.

**Reservations:** The palette is wedding-pink and the type is a high-contrast didone serif — wrong
register for DCS as-is. Also the destination cards all share an identical duplicated paragraph in
the DOM (copy-paste bug), so read the structure, not the content.

**Screenshots:** `…-158.jpg` (service blocks + section head) `…-159.jpg`/`…-160.jpg` (price-button
cards) `…-163.jpg`/`…-164.jpg` (contact block)

---

### 5. Huehaus — https://huehaus.design/

**Why it's here:** The most _elevated-feeling_ components in the sweep. Its service and pricing
blocks are information-dense in a way that reads as confident rather than sparse, and it proves
you can make a plain feature list feel designed without illustration.

**Components worth taking:**

- **Service panel with a chamfered corner** (`…-66.jpg`/`…-67.jpg`) — a large hairline-bordered
  panel whose **top-left corner is cut on a 45° diagonal**, with the mono label "SERVICES 01"
  living inside the notch. Right cell carries a mono eyebrow ("YOUR 24/7 SALESPERSON"), a huge
  serif headline, and body copy. Beneath, a three-cell spec strip divided by 1px rules:
  `01 SERVICES -> No-code design & development in Framer` · `02 TIME -> 3 - 6 weeks delivery` ·
  `03 STARTING @ 4K -> See pricing ↗`. Each cell has a tiny geometric line-glyph in its top-right
  (nested squares / two circles / three bars). That strip answers _what, how long, how much_ in
  one glance — precisely the DCS objection set.
- **Colour-coded pricing tiles** (`…-70.jpg`/`…-71.jpg`) — each plan is a _full-bleed solid colour_
  tile (blue / black / yellow / red) rather than a white card. Top-left carries a small pixel
  tetromino glyph; below it one or more **outlined uppercase mono category chips** ("BRANDING",
  "WEBSITE", or both for combined plans); then the plan name, a plain-language promise
  ("Fast-track your brand foundation."), a hairline, a square-bulleted feature list in mono,
  another hairline, a "Revision: 1x" spec row, the price at ~40px, and a **chamfered outlined
  "CONTACT US ↗" button** (same 45° cut as the panels). Colour-coding is a genuinely fresh
  alternative to "invert the middle plan".
- **Full-screen menu overlay** — two columns of large chamfered slab panels (Home / Studio / Works
  / Pricing / Store / Career / Contact), each with an offset drop shadow; the active item is filled
  brand-blue with white type. It is the same component at desktop and mobile.
- Section-to-section transitions are a **pixel-mosaic wipe** rather than a fade.

**Reservations:** The homepage opens with a long pixel-mosaic scroll intro spelling "HUE — THE
EMOTION / HAUS — THE STRUCTURE". It is beautiful and completely wrong for a plumber, and it is
heavy. Take the panels and the pricing tiles; leave the intro. The mono/pixel type also skews
"design studio", so it would need retuning.

**Screenshots:** `…-66.jpg`/`…-67.jpg` (service panel + spec strip) `…-68.jpg`/`…-70.jpg`/`…-71.jpg`
(colour-coded pricing)

---

### 6. SubOne Studio — https://www.subone.studio/

**Why it's here:** Editorial structure done properly. Its section-header and credentials-table
components are the kind of thing that makes a small studio look established, and both are cheap.

**Components worth taking:**

- **Section header bar** (`…-83.jpg`) — sits on a hairline rule: `◆ [ 05 ]` hard left, a centred
  mono caption with a trailing ↓ ("RESULTS PEOPLE PAY TO LEARN FROM ↓"), and `©2026` hard right.
  Repeated for `[ 01 ]`…`[ 06 ]`. One component, six uses, instantly gives the page structure.
- **Credentials table** (`…-83.jpg`) — rows divided by 1px rules: `2024 | New York | **Hot Sauce**
| [three small thumbnails]`. Year and place in small mono, event name at ~44px, image strip
  right-aligned. Reskin for DCS as "2025 | Chippenham | **Colossus Scaffolding** | [screenshots]" —
  a portfolio that reads as a track record instead of a gallery.
- **Two-tier service copy** (`…-81.jpg`) — `[ 01 ]` marker in mono to the left of a ~40px heading,
  then a **bold promise line** ("Increase your website conversion with strategic UI/UX Design"),
  then a **lighter detail line** in grey below it. Two weights of body copy is a small move that
  makes a card stop looking flat.
- **Persistent founder card in the nav** — top-right, a rounded card with the founder's photo,
  "MEET THE FOUNDER", name and role, and an arrow. Permanent trust signal, zero page real estate.
- **FAQ with a portrait** (`…-85.jpg`) — left column is a photo of the founder, right column is the
  accordion (hairline dividers, `+` icons). Stops the FAQ reading as a support page.
- Underlined text links terminate in a small corner-bracket mark instead of an arrow.

**Reservations:** Black, video-heavy, and the tone ("Logos are overrated", "Hot Problems Only")
is creator-economy swagger that would repel a garage owner. Structure yes, voice no.

**Screenshots:** `…-81.jpg` (services) `…-83.jpg` (credentials table + section header)
`…-85.jpg` (FAQ)

---

## Also-rans

- **Moah Studio** — https://www.moah.studio/ — "Ways of working" cards are strong: tall bordered
  cards with a filled circular `+` button top-right and a two-line uppercase title bottom-left;
  service cards list sub-services prefixed with `+`; full-viewport background colour changes per
  section (red -> near-black -> sage); stat figures at ~130px with a caption below. Let down by
  reveal animations so slow the page reads as empty on first paint.
- **Sidekick** — https://side-kick.se/ — hero wordmark built from black slab blocks with hairline
  cuts, with the nav sitting _underneath_ it; small grey label ("Vad" / "Varför" / "Hur") in a
  left gutter beside each body paragraph. Sparse but the label-gutter pattern is worth stealing.
- **Heretic** — https://www.heretic.wtf/ — blackletter display type, 3D rally-car hero, and an
  entry gate ("Confirm your intentions — Deny / Agree"). Case studies are an accordion with a
  `Service:` meta row. Pure spectacle; useful only as a reminder that a distinct display face
  carries a whole identity.
- **ReadyToLaunch** — https://go-readytolaunch.com/ — template shop. Product card is a full-bleed
  screenshot with name + coloured badge pill ("Bestseller"/"Popular"/"New") on the left and price
  right-aligned. Note the stat row renders as "0+ Years of design experience / 0 Featured by
  Framer" — a frozen animated counter publishing a false figure, the exact trap already in the
  DCS notes.
- **Resolve Healthware** — https://www.resolvehealthware.com/ — worth one look as a _negative_:
  same frozen-counter bug ("+0.01 M Lab Tests completed", "+1 years Industry experience"), and a
  pricing card with ~25 undifferentiated feature rows that no one will read.
- **Digital Icon Agency (DIA)** — https://www.digitaliconagency.com/ — near-empty dark page with a
  live clock and two words of navigation. Atmosphere only.
- **RabenRifaie** — https://www.rabenrifaie.com/ — 173 likes but a heavy custom loader and almost
  no DOM text; couldn't evaluate components in reasonable time.
- **Jemini** — https://jemini.co/ — big change consultancy; giant stacked-word typography and
  triplicated nav labels (a marquee), but no pricing, process or FAQ to learn from.
- **Superlocal** — https://www.superlocaldesign.com/ — a "coming soon" holding page for a Uruguayan
  design festival. Nothing to evaluate.

---

## What I did not cover

- **Seven of the twelve Featured-carousel entries** — `strange-family`, `fler-studio`,
  `artone-studio`, `apresentforce-com`, `one-of-one`, `floc`, `typografische`. The carousel tiles
  only expose the live domain for the first three, the detail pages are client-rendered so the
  live URL isn't in the served HTML, and horizontally scrolling a virtualised carousel to reveal
  the rest wasn't worth the budget. If someone wants them, open each
  `framer.com/community/gallery/<slug>/` and read the link off the rendered page.
- **Domains the browser refused** — `twoplusone.co`, `metasense.dev`: navigation was blocked by the
  extension's per-domain permission on second and subsequent hops within a batch. Neither was ever
  successfully loaded.
- **Not opened for time** — `dirtverse.co`, `creatorzone.in`, `figurefilm.co.uk`,
  `sarahzaheer.site`, `newgenre.studio`.
- **`default-studio.com`** — deliberately skipped; it's the seed reference and already documented
  in the brief.
- **Mobile verification** — per the brief I did not resize the shared window, so every mobile claim
  above is inferred from layout structure (does it stack? does it depend on three equal columns?
  is the CTA thumb-reachable?), not measured. Onmoon's selector-pricing, Luna UI's process, and
  Bureau Dimanche's floating contact bar are the three I'd most want the orchestrator's mobile pass
  to confirm.
