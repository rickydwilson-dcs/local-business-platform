# Auction House & Commission-Brand References — Expansion Research

**Purpose:** Pressure-test and enrich the design thesis for DPM Autobody: _"The most elevated presentation of a single classic car anywhere is the auction lot page, and no restorer builds project pages that way. The unit of the site is the documented car, not the service."_ This document does not re-cover eaglegb.com, thorntonrestorations.com, or halcyon.works (already torn down separately).

**Method note:** All findings below come from real fetched pages (WebFetch and, where WebFetch was blocked, live browser navigation), not from memory or training data. Every verbatim quote is marked in quotation marks. Anywhere a claim could not be directly verified from a fetched page (third-party press, search-snippet-only access, a blocked site), it is explicitly flagged as such — treat those as lower-confidence or as assumptions, not facts.

---

## PART A — Auction House Lot Pages

Five lot pages were fetched directly across four houses plus one modern online-auction platform. Two sources (Bring a Trailer, Artcurial) could not be retrieved — see "Sources Not Obtained" at the end of this part; do not treat any BaT-specific claim elsewhere as verified.

Retrieval method matters here: RM Sotheby's and Bonhams Cars were retrieved via an AI-extraction fetch tool (the quotes below are what that tool reported as verbatim from the page, one layer removed from raw HTML). Broad Arrow, Gooding & Company, and Collecting Cars were captured first-hand via a live browser reading the rendered page directly — those three are true first-hand verbatim.

### A1. RM Sotheby's — 1957 Jaguar XKSS (chassis XKSS 707)

**URL:** rmsothebys.com/auctions/mo23/lots/r0172-1957-jaguar-xkss/ — Monterey 2023, Lot 351

**Identity/spec block — exact field labels, in order:**

> "Chassis No." → "Engine No." → "Gearbox No." → "Body No." → "Cylinder Head No." → "Registration" → "Location"

**Provenance structure:** Narrative prose (not a table), under a sub-heading "XKSS 707: JAG 1." A full chain of roughly 8 named owners with dates: Lou Brero, Sr. (pre-delivery) → Sammy Weiss/Oxford Motors (1960) → Sidney Colberg (1960–1973) → Anthony Bamford (1973–1975) → Geoffrey E. Marsh (1975) → Chris Stewart → I.G. Campbell McLaren (1976 on) → Allen Lloyd (1992–2011) → present owner (2011–present).

**Restoration work and documentation, by named actor:**

- Geoffrey E. Marsh: "removed the body from the chassis, replaced the bulkhead behind the seats… applied new paint and upholstery"
- I.G. Campbell McLaren: "bonnet… was replaced using a new unit ordered from RS Panels," "refinished from its previous black repaint to… metallic blue"
- Allen Lloyd period, work by named specialist Chris Keith-Lucas: "servicing," "new radiator and aluminum header tank… new fuel tank; the cylinder head was overhauled and new valves and springs fitted"
- Present owner, work by CKL Developments, cost disclosed: "at a documented cost exceeding £57,000," including "removing and cleaning the cylinder head, rebuilding the carburetors, complete reconditioning of the brakes… fabrication and fitment of new wiring looms… repairs to the upholstery and paintwork as necessary"
- Documentation named explicitly: "Invoices on file" and "A report compiled for the owner by Chris Keith-Lucas"

**Photos:** ~60+ images across sequential "View More" galleries — exterior, engine bay, interior, underside/chassis, detail shots. No individual captions reported by the extraction.

**Hedging / what cannot be proven:**

> "the present 25,535 miles are likely authentic"
> "retains its numbers-matching engine block and head, gearbox, rear axle"
> "the block itself had been replaced, probably during its early years"
> "two of the three correct carburetors are the originals, with the front only having been replaced, the latter a change that Keith-Lucas ascribes as possibly having been done before the car left the factory"
> "Addendum: Please note that the service handbook and maintenance instructions which accompany this lot are digital copies."

**Essay/documentation:** Full narrative essay titled "THE XKSS: AMERICAN DREAM" plus the dedicated "XKSS 707: JAG 1" ownership-history section. Documents referenced: "history file, including numerous magazine articles, photographs… invoices and partial registrations… copies of a D-type service handbook and XKSS maintenance instructions."

**Price display:** "$13,205,000 USD | Sold" — shown prominently, sold status directly beside the figure. Lot reference: "Monterey 2023, Lot 351."

---

### A2. Bonhams Cars — 1959 Bentley S1 Continental, ex-Peter Sellers (chassis BC50FM)

**URL:** cars.bonhams.com/auction/10533/lot/223/...

**Identity/spec block — exact field labels:** "Registration no." → "Chassis no." → "Engine no." — only three structured fields; no separate colour/interior/mileage row. Coachwork is folded into the title itself: "...Coachwork by H J Mulliner & Co Ltd".

**Provenance structure:** Narrative prose within the description, not a table. Two named points of ownership: original owner Peter Sellers (actor), and the current vendor ("acquired in 2002"). Dates are soft: "in recent ownership," "since acquisition by the vendor in 2002" — no full dated chain.

**Restoration language:** "In excess of £67,000 lavished upon it, including a body-off restoration…by Bentley specialists Brunts of Silverdale." Further work "by Hoffmans of Henley" in 2002, "more than £9,000 being spent." Documentation cited: "records of restoration work, copy factory build sheets, road fund licence to March 2004, MoT to 18th July 2003 and Swansea V5."

**Photos:** Only one full-screen image visible to the extraction pass; no stated count.

**Hedging:** Minimal — confident rather than hedged tone; the car is described as a "concours winning Continental" with no caveats surfaced.

**Downloadable documents/essay/video:** None found.

**Price display:** "Estimate: £39,000 - £42,000" at the top; auction's finished/completed status noted separately below, not as a "sold for" figure.

---

### A3. Broad Arrow Auctions — 1968 Porsche 907 K

**URL:** broadarrowauctions.com/vehicles/am23_064/1968-porsche-907-k — The Amelia Auction 2023, Lot 155 (captured first-hand, confirmed against the literal page footer — nothing beyond what's quoted here exists on the page)

This page's structure differs materially from RM Sotheby's/Bonhams: **no chassis/engine identity block at all**, no owner-by-owner table or narrative history section, and no long-form essay. The entire body is a bullet list of "highlights" plus a specialist's contact card.

**Identity/spec block:** None present. Only structured metadata: lot header ("1968 Porsche 907 K," "Lot 155 | The Amelia Auction 2023") and a currency-switchable "Estimate: $4,500,000 - $5,500,000."

**Provenance:** Not a narrative or table — folded into a bullet: "Once part of the world-class Porsche collection of Dr. Julio Palmaz." No dated ownership chain.

**Restoration language — this bullet list is the entire body copy of the page (full, verbatim):**

> "Outright winner of the 1968 Targa Florio – a legendary performance by Vic Elford"
> "Factory entry by Porsche System Engineering during the 1968 World Endurance Championship season at the Sebring 12 Hours and the Targa Florio"
> "Raced by Porsche factory drivers Vic Elford, Umberto Maglioli, Ludovico Scarfiotti, Joe Buzzetta, and Rolf Stommelen"
> "Still powered by its original Typ 771/1 magnesium case 2.2-liter air-cooled 270 hp flat-eight engine rebuilt by Gustav Nitsche"
> "Restored by Patrick Scalli of Porsche Prototype Racing Cars of Gloucester, Massachusetts under the direction of Dale Miller"
> "Once part of the world-class Porsche collection of Dr. Julio Palmaz"
> "2007 and 2012 Class Winner at the Amelia Island Concours d'Elegance and part of the Porsche Heritage Display at Rennsport VI in 2018"
> "A highly authentic works factory prototype eligible for the world's most prestigious collector car events"

No invoices, photos, or judging-sheet documentation mentioned anywhere — race pedigree and driver names carry the entire credibility burden instead.

**Photos:** Explicitly numbered gallery, "1 / 132" through "132 / 132" — 132 photographs. No visible captions; no stated category order.

**Hedging:** None found — the only qualifier present, "highly authentic works factory prototype," asserts rather than hedges.

**Downloads/essay/video:** None. Just the bullet list plus a named specialist contact ("David Swig, Senior Car Specialist, +1-415-302-2247, dswig@hagerty.com").

**Price display:** "Estimate: $4,500,000 - $5,500,000" shown at page top and repeated above the photo gallery. No "sold for" figure appears even though this is a completed 2023 sale — the page appears to retain its pre-sale estimate indefinitely rather than update to a result.

---

### A4. Gooding & Company (Gooding Christie's) — 1961 Ferrari 250 GT SWB Berlinetta Competizione (chassis 2701 GT)

**URL:** goodingco.com/lot/1961-ferrari-250-gt-swb-berlinetta-competizione — Pebble Beach Auctions 2026, Lot 135 (captured first-hand — the richest page of the five)

**Identity/spec block — exact order as rendered:**

> "Lot 135" → "2026 | PEBBLE BEACH AUCTIONS" → title "1961 FERRARI 250 GT SWB BERLINETTA COMPETIZIONE" → "Coachwork by Scaglietti" → "SOLD $8,090,000" → "Estimate / $8,000,000 - $10,000,000" → "Chassis / 2701 GT" → "Engine / 4039"

Note the labels are literally "**Chassis**" and "**Engine**" (not "Chassis No." as at RM Sotheby's/Bonhams). No separate colour/interior/mileage row — those details live in the narrative essay instead.

**Provenance structure:** Explicit tabbed/sectioned headings: "PROVENANCE," "RACE HIGHLIGHTS," "EXHIBITION HIGHLIGHTS," "FEATURED MEDIA." Provenance itself is ~10 paragraphs of pure narrative prose naming a full chain: SEFAC Ferrari (factory-retained) → Carlo and Massimo Leto di Priolo of Milan (from summer 1961, "registered in Milan as 'MI 928367'") → Hans Günter Perle-Lex (1964) → Egon Hofer of Salzburg (1967) → Anatoly Arutunoff (post-Targa Florio, imported to the US) → "several knowledgeable enthusiasts during the 1970s" (unnamed) → Brian Brunkhorst (1981) → Michael Leventhal (~15 years) → Ned Spieker (current-through-recent).

**Restoration language:** "Brunkhorst commissioned respected marque specialist Wayne Obry to undertake a comprehensive restoration, with the mechanical components expertly rebuilt by Rick Bunkfeldt. Completed in 1983, the project returned the Berlinetta to correct Comp/61 specification using a period 250 GTE engine, no. 4039, which remains installed today." Documentation named explicitly on a "Car Highlights" list: "Accompanied by FIA Historic Technical Passport and Marcel Massini Report" — the Massini report being the de facto Ferrari authentication/history standard, named rather than paraphrased.

**Photos:** "View More Photos" link; no numeric count stated (unlike Broad Arrow's explicit counter).

**Hedging/disclosure — the single most important disclosure found across all five houses.** Under an explicit heading **"Saleroom Addendum"**:

> "Please note that, further to the published catalogue's reference to the sale of this vehicle's original engine to Tom Meade following the 1967 Targa Florio, the consignor and Gooding Christie's have been advised that Tom Meade's family claims to possess the original engine and other components associated with this vehicle. Recent correspondence concerning this matter is on file and available for review. Please contact a specialist for further information."

This is a live, dated, post-catalogue correction disclosing an active dispute over the whereabouts of the car's numbers-matching original engine — the car currently runs "a period 250 GTE engine, no. 4039" rather than its original unit. The essay also states plainly: at one point the car "even receiv[ed] an American V-8 engine" during the 1970s, adding: "Such modifications reflected an era when yesterday's racing cars were valued primarily for their performance rather than their historical significance." A closing note flags a titling discrepancy: "Please note that this vehicle is titled as 250GT2701."

**Downloadable documents/essay/video:** Full first-person prose essay (~10 paragraphs) covering both model history and this specific chassis's history. A "FEATURED MEDIA" tab exists (not opened) suggesting embedded video/photo features beyond the still gallery. The page also carries an inline lead-generation module unrelated to this specific car: **"Have Something Similar? Consign With Us,"** a short form ("Name _," "Email_," "Confirm Email\*," "Subject," button "Submit Your Interest"), plus "Sell Your Car Today" and a "RELATED VEHICLES" module filterable by "ALL / SAME ERA / SAME BRAND / SAME PRICE."

**Price display:** "SOLD $8,090,000" shown first, directly under the title — the pre-sale "Estimate" is shown second, as secondary context. (Contrast Bonhams and Broad Arrow, both estimate-only with no visible sold price.)

---

### A5. Collecting Cars — 1982 Porsche 911 (930) Turbo

**URL:** collectingcars.com/for-sale/1982-porsche-911-930-turbo-8 — sold, ended 12/11/2023 (captured first-hand)

**Identity/spec block — a distinct "SPECIFICATION" module, exact labels and order:**

> "MAKE" → "Porsche" / "MODEL" → "930" / "MILEAGE" → "72,900 Miles (Approx.)" / "ENGINE SIZE" → "3.3L Flat-Six" / "EXTERIOR" → "Guards Red" / "INTERIOR" → "White / Red" / "FUEL TYPE" → "Petrol"

No chassis/VIN field in this structured block — the VIN appears only in prose (see hedging, below). Shown separately near the top: "72,900 Miles (Approx.)" / "RHD" / "Manual" / "Kent, United Kingdom," plus view/comment counters ("11,219" views, "408" comments).

**Provenance structure:** No dedicated "Provenance" heading — folded into generic "Key facts"/"Service history" prose. Only one clear ownership marker: "the seller's ownership, which began in March 2016"; earlier history is vague: "believed to have been exported to Singapore in 1990 and repatriated back to the UK in 1995." This is structurally the thinnest provenance treatment of all five — no named prior owners, no dated chain.

**Restoration/mechanical work language:** "The engine received a full rebuild from RPM Technik who also installed an extensive suite of performance upgrades including Fabspeed Motorsport performance accessories (exhaust, headers, intercooler), a custom hybrid turbocharger, as well as a full EFI conversion." Documentation: "A dynamometer report on file (screenshot) shows a proven 395.2bhp (just over 400PS) and 287lb-ft of torque," plus "a binder of service records dating back to 1998." A distinct labeled "Service history" section lists three dated events by named specialists (RPM Technik September 2021, RPM Technik January 2017, SB Race Engineering December 2015), each with exact mileage.

**Photos:** "View all photos (144)" — 144 photographs, explicitly stated. No visible category breakdown or captions in the text pass (captions may exist as image overlay not captured).

**Hedging — extensive, and structurally different from the auction-house pages** (appears to be platform boilerplate, not bespoke to this car):

> "This 1982 'C16' UK-market car is **believed to have been exported** to Singapore in 1990..."
> "The total mileage is **understood to be** approximately 72,900 miles."
> "**Please note:** the VIN is wrongly recorded with the DVLA as WP0ZZZ932C5000393 (the ninth digit should be a Z). This administrative error should be straightforward for the next keeper to resolve."
> "The seller is **not aware of** any mechanical or electrical faults."
> "The description of this consignment is, **to the best of the seller's knowledge**, accurate and not misleading... **However, potential buyers must independently satisfy themselves** as to the accuracy of the description."
> "Please note that it is **not uncommon** for classic or collectible vehicles to have received cosmetic repairs in the past... **this work may be undetectable even upon visual inspection**. Unless there is an explicit statement by the seller to the contrary, **please assume that any vehicle could have had bodywork or paintwork** during its life..."
> "All UK-registered cars... are run through an online **HPI check**. On the HPI report, this vehicle shows **no insurance database markers for damage or theft**. It is currently covered by a finance agreement."
> "Please note: this car is being **relisted for auction** as the previous winning bidder was unable to follow through on the purchase." — a disclosure type with no equivalent on any auction-house page.

**Downloadable documents/video/commentary:** None downloadable — documentation is described as physically accompanying the car, not attached to the listing. Explicit invitation to use the platform's own comments section: "including by raising enquiries with the seller in the comments section." A "Condition" section defers to photos: "Please refer to the photo gallery to assess the exterior and interior condition," followed by seller-authored condition notes (e.g. "some bubbling under the windscreen, around the sunroof and on the rear wheel arches..."). Distinct from every auction house, the platform adds its own **editorial verdict** under a "Summary" heading: **"Reported to be in very good mechanical order and a fantastic driving car, but now requiring some sympathetic cosmetic refurbishment, it would make an exciting addition to any marque enthusiast's collection, and an engaging weekend toy."** Sidebar CTAs reinforce a two-way marketplace, not just a listing: "Make an offer," "I want one similar," "WhatsApp us," "Receive alerts on similar listings," "Own a similar Porsche? / Sell now."

**Price display:** "SOLD" badge, then title, then **"Login to view price"** — the final sold price is gated behind a login wall even though everything else (description, spec, photo count, condition notes) is fully public. Unique among the five pages — none of the traditional auction houses hide the sold price.

---

### Sources Not Obtained

**Bring a Trailer** — no content retrieved. WebFetch hard-blocked the entire domain ("Claude Code is unable to fetch from bringatrailer.com," including the bare homepage). A live-browser attempt at a specific listing URL redirected to `bringatrailer.com/account/login/` and showed only a sign-in form — BaT appears to require an authenticated session for listing pages in this environment. **No BaT-specific claim in this document is based on a fetched BaT page** — treat BaT's comment-driven Q&A model, which is well known by reputation, as an assumption, not a verified finding here.

**Artcurial Motorcars** — no lot page retrieved. One candidate lot (a 1973 Ferrari 365 GTB/4 Daytona at Rétromobile 2024) returned HTTP 410 Gone. A second candidate (a 1964 Ferrari 250 LM on the `auctions.artcurial.com` subdomain) failed on a TLS certificate mismatch (the certificate only covers `www.artcurial.com`/`artcurial.com`, not the `auctions.` subdomain) — an infrastructure failure, not a content gate.

**Infrastructure note:** Gooding's and Broad Arrow's live-bidding subdomains (`bid.goodingco.com`, `bid.broadarrowauctions.com`) are Angular single-page apps that WebFetch cannot render (only unrendered `{{ }}` template markup returned). Both houses maintain **two parallel systems** — a static/SEO-indexable marketing lot page and a separate JS bidding app — rather than one canonical URL, unlike RM Sotheby's, Bonhams, and Collecting Cars.

---

## PART B — Restomod & Coachbuild Brands

Seven brands researched in depth (Singer, Theon Design, Tolman Engineering, Alfaholics, Everrati, Guntherwerks, Ares Design/Atelier), plus lighter search-derived notes on Kimera, Lunaz, and Kalmar. Alfaholics blocked all direct fetch attempts (HTTP 403 on every URL, including via `http://`) — its findings below are paraphrased from search snippets only and are flagged as lower-confidence throughout.

### B1. Singer Vehicle Design (singervehicledesign.com) — studied in depth as directed

**Positioning:** Hero line: **"Restored. Reimagined. Reborn."** Core philosophy: **"A Relentless Pursuit of Excellence"** — described on-site as "a philosophy, captured in these five words." Repeated mantra: **"Everything is Important."** Two named pillars: **"Luxury Through Choice"** and **"Designing to Delight."** Summary line: **"Restored, reimagined and reborn at the request of each owner, with a focus on beauty, craftsmanship and innovation."**

**Content types:** Automotive, Timepieces (a branded watch line), Ownership, In The World, Willow Springs (Singer's stake in "America's oldest permanent road course," plus a forthcoming private members' club — "Membership will be open to Singer's clients as well as other like-minded enthusiasts upon application"), Cinema, Careers, Partners, Press. No blog/journal — content is delivered as dated formal press releases, not informal storytelling.

**How a commission is sold:** No configurator, no published pricing, no visible waitlist mechanic. The thin "Ownership" page offers only: **"Ownership Starts with Your Vision"** and **"Our unique perspectives, and mastery of design, engineering and execution are applied in pursuit of your vision."** Scarcity is stated as hard commission caps inside model pages instead: the Carrera Coupe service is **"limited to 100 commissions,"** the Carrera Cabriolet **"limited to just 75 commissions."** Pricing is never stated on-site (third-party press reports $600,000–$650,000 for recent commissions — **unverified assumption**, not Singer's own copy). Buying mechanic is an implicit "contact us."

**Build process presentation:** Describes the _what_, not the _how_ — no step-by-step build diary, no workshop-floor photography in fetched text, no named craftspeople below founder level, no build-hours claim. Scale is the one operational fact volunteered: Singer **"now employs over 600 people across world-class teams in California and the UK."** Engineering partners are named instead of individual craftspeople: Cosworth (engine), Red Bull Advanced Technologies (chassis), Williams Advanced Engineering (DLS powertrain), Bosch.

**Photography/surface style (inferred from copy, not directly observed — WebFetch strips imagery):** Copy foregrounds finish/material naming over engineering-diagram language — "carbon fiber bodywork in Resistance Blue with ghosted side stripes," "Bespoke interior trimmed in Orange leather with black stitching," "Lightweight carbon fiber track seats with woven leather centers and nickel grommets."

**Specific commission page — the "300th restoration":** `/press/singer-celebrates-300th-restoration-in-california/` documents Singer's 300th Porsche 911 restoration, a 1990 964 Targa nicknamed **"Sotto"** by its owner, completed February 14, 2024. Framing: **"The 300th Porsche 911 reimagined through the Classic restoration services has been completed in California."** Notably, the page does **not** quote the owner or narrate their motivation — the "story" is told entirely through spec-sheet material/colour naming plus the corporate-milestone framing, not first-person testimony. (Earlier-era named geographic commission pages referenced in third-party enthusiast coverage — e.g. an "Indy Commission," "Portland Commission" — could not be located as live URLs on the current site; **flagged as unverifiable**, possibly retired in a prior site architecture.)

---

### B2. Theon Design (theondesign.com)

**Positioning:** **"Captivating the true essence of the Porsche 911."** Repeated approach term: **"OEM+"** — "combining OEM-level robustness with small-team craftsmanship." For the Theon R: **"Ultimate Air-Cooled Analogue Driving Experience."** Also: **"Purity of Purpose."**

**Content types:** Model Range (Coupe, Targa, Theon R), About, News. Notably built substantially from **third-party press reprints and journalist quotes** as primary content (dedicated pages per outlet — Carscoops, PistonHeads, Goodwood) rather than in-house storytelling — letting outside media do the credibility-building. A distinct configurator tool exists, gated behind a "CONFIGURE" button (its content was not reachable by fetch).

**How a commission is sold:** No pricing, deposit, or waitlist language found in fetched copy. Interior is framed as collaborative: **"Every detail of the interior is design-led, devised in close collaboration with the owner"** using **"highest quality materials."** (Third-party press, not site copy, reports pricing "from £430,000 excluding donor car" and output capped at "a maximum output of six cars a year," each taking "around 6,000 hours" — **unverified assumption**.)

**Build process:** Framed around digital precision, not hand-craft diary: **"State-of-the-art digital design techniques are blended with traditional hand-craftsmanship"** and **"Each component is digitised and modelled in 3D design software"** to "maximise precision and panel fit." No named craftspeople beyond founder Adam Hawley, no build-hours claim in the site's own copy.

**Photography/surface style (inferred):** Copy repeatedly foregrounds fit/tolerance language ("the tightest tolerances," "maximises precision and panel fit") rather than colour/material language — suggesting a photographic argument built on panel-gap precision rather than paint depth.

**Specific commission page:** None found — site organizes by model variant and by press outlet, not by individual customer car.

---

### B3. Tolman Engineering (tolmanengineering.co.uk) — most process-transparent site of any brand studied

**Positioning:** **"A MASTERPIECE. IMPROVED."** Balancing statement: **"Here at Tolman we attach great value to our traditional craftsmanship however that does not mean that we don't embrace cutting edge technology,"** and: **"The key is in improving the integrity, drivability and functionality of the end product without diluting its character."**

**Content types:** Tolman 205 GTI, Store (e-commerce — the most retail-adjacent of any brand studied), Projects, Restoration (Services / Traditional Craftsmanship / Contemporary Engineering), Motorsport, Blog, Contact (including a dedicated "Meet the Team" page).

**How a commission is sold:** No pricing/deposit language found directly; the model is direct-contact and relationship-based rather than a published slot system.

**Build process — the standout finding of this whole research pass.** The individual project page for a Ford Escort XR3i reads like a genuine restoration diary, not marketing copy:

> "extensive cataloguing during the strip down" that "revealed a big list of missing and damaged parts"
> corrosion described plainly: the car was "suffering many British winters"
> since there were **"no perfect correct spec roof skins available,"** the team **"fitted a non sunroof one and adapted it to fit the sunroof cassette"** using **"a custom made laser-cut jig and forming tool to recreate the factory edges"**
> the original 1600cc CVH engine was **"completely rebuilt (lightened, balanced, strengthened)"** with **"a 16 valve Zetec cylinder head,"** and an **"RS1600i cam cover was modified to dress the noughties head in eighties clothing"** — explicitly narrating a deliberate period-correct visual disguise over a modern part
> wheels: **"the centre section cut from the original wheels, machined down to create a cap that retains the factory casting marks"**

Founder Chris Tolman is directly quoted on philosophy: **"we've applied our knowledge to make it drive the way you think you remember the original driving, while looking essentially like the one that you yearned for."** On process: **"Engineering is at the very heart of our business, every project undertaken is approached following strict procedures"**; in-house capabilities span **"design, machining, fabrication, bodywork, engine and transmission build, suspension set up, and electrical."** On blending old and new: **"Modern electrical functionality and reliability can be discreetely fitted within period components,"** and specifically on the ECU: they can **"build a modern ECU into the casing of the original system to bring up to date driveability while retaining an original equipment look."** (Third-party coverage — Fast Car, Garage Matters, Magneto, not site copy — independently reports this exact build at 1,600 hours; **flagged as unverified for the site itself**.)

**Photography/surface style (inferred):** Copy's emphasis on "casting marks," jig-made panel edges, and disguised modern parts suggests the visual argument leans toward forensic before/after and in-progress process documentation, not glamour photography.

**Specific commission narration:** The XR3i project page functions exactly this way — a single, specific car's restoration narrated in first-person workshop detail. **This is the closest thing found in this entire research pass to what a small restoration shop could realistically produce itself.**

---

### B4. Alfaholics (alfaholics.com) — ACCESS BLOCKED, findings from search snippets only

All direct fetches (homepage, workshop page, two individual build pages) returned HTTP 403, including via `http://`. Everything below is **paraphrased from search-engine snippets, not verbatim page text** — flag accordingly.

- **Positioning (paraphrased):** Materials-science and validation-rigor framing — producing "the very best components possible, using the highest grade raw materials," backed by "an extensive research programme."
- **Content types (from search index):** A "completed builds" gallery organized by individual build number (e.g. "Build 003," "GTA-R 024 Widebody," "GTA-R 029"), plus year-stamped "update" pages for previously delivered cars (e.g. "GTA-R 005 • 2026 Update") — an ongoing published record of how a specific customer's car evolves _after_ delivery, distinctive among all brands studied.
- **Commissioning (paraphrased):** An options menu — "Owners are given the opportunity to select from a range of options relating to engines, gear ratios, suspension packages & damper valving, power steering, seat styles, upholstery, interior lighting, roll cages, dashboard styles and in car entertainment." No pricing/waitlist information surfaced.
- **Build process (paraphrased):** New components are validated on the shop's own demonstrator car — "installed on their workshop GTA-R 290, track tested at Nurburgring for optimisation and undergoing thousands of road miles before sign off" — before being offered to customers.
- Photography style and individual-commission narration could not be assessed — no page content was retrievable.

---

### B5. Everrati (everrati.com) — most explicit published sales funnel of any brand studied

**Positioning:** **"Electrifying Icons."** Core line: **"Everrati™ redefines the world's most iconic cars with innovation and sustainability, delivering a unique, modern driving experience."** Explicit differentiation from generic EV converters: **"Everrati is not a converter"** — it performs **"painstaking redefinition."** Restomod defined in-house: **"a restomod is a classic vehicle that has been carefully restored to maintain its original styling and character, while also being upgraded with modern parts and systems."**

**Content types:** Models (Porsche 993/964/RSR/ST, Mercedes W113 "Pagoda," Classic Mini, Land Rover Series IIA, GT40, Bespoke Build, Configurator), plus a dedicated top-level **"Commissioning"** menu (Client Commissions, The Process, Artisan, Why Everrati). Also a B2B arm, "Powered by Everrati."

**How a commission is sold — the clearest funnel found in this research.** Pricing is stated but gated: on the Porsche 993 page, **"from £POA\*"** (Price on Application), excluding "applicable taxes, plus a straight, rust free and clean title donor." Everrati is the only brand studied with an explicit, **named seven-stage commissioning process** published as its own page:

1. **Consultation** — "The journey begins with a client consultation – often several, where a shared passion for creating something truly special starts to take shape."
2. **Commission** — triggered by "a signed order and down payment"
3. **The Chosen Classic** — donor-car sourcing ("Many of our clients don't already own the classic car they wish to redefine")
4. **The Creation Atelier** — bespoke spec/material/colour selection with an in-house designer
5. **Strip & Rebuild** — "complete disassembly of the chosen classic car, taking it back to its bare chassis"
6. **Electrification** — "the result of thousands of hours of meticulous engineering"
7. **Delivery** — "meticulous pre-delivery testing to guarantee perfection," followed by enrollment in **"Everrati Life,"** an owners' community.

Bespoke personalization is separately branded **"Artisan by Everrati"** — "A bespoke commissioning experience where timeless craftsmanship meets modern innovation." Value-retention argument: the EV conversion is **"reversable to ensure value retention,"** with the original engine "provided in presentation cases" to the owner.

**Build process presentation:** The seven-stage page above is the process presentation. Company-level claim: **"Each new model we release takes up to 6,000 hours to develop and then test to exacting standards."** No named individual craftspeople.

**Photography/surface style (inferred):** Heavily technical-spec-sheet in tone ("Peak Available Power 567 kW," "0-60 mph 3.3 s") — closer to an EV product datasheet than a coachbuilder mood board.

**Specific commission page:** A `/client-commissions/` URL is implied by the nav but 404'd on the guessed path — not located.

---

### B6. Guntherwerks (guntherwerks.com)

**Positioning:** **"A Modern Interpretation of a Classic Analog Masterpiece."** Also: "The future of analog power," "Modern engineering meets analog soul," "Born From Legacy. Driven By Precision."

**Content types:** Programs, News & Press, Ownership, Our Story, **Provenance Succession** (a section implying documented chain-of-ownership/authentication content — its actual text was not retrievable, JS-thin), Find a Dealer/Become a Dealer (the only brand studied with an explicit dealer network), Merchandise.

**How a commission is sold:** A small portfolio of **named, numerically-limited programs** rather than one model line: **F-26** ("Twin Turbo 1,067 HP... Limited to 26"), **Turbo** ("850 HP Twin-Turbo. Limited to 75"), **GWR** ("The definitive 993"), and **GWX**, described as **"By invitation only"** and **"A true one-of-one masterpiece"** — the only overtly invitation-gated tier found across all brands studied. No pricing published. The Ownership page skips transactional detail for **hospitality/ritual copy**: **"When the special day to collect your car comes, you will have a meal specifically prepared for you by one of the finest chefs. Hosted at our Huntington Beach Facility, you will experience the finest cuisine with the idyllic setting of your bespoke car behind you."** Post-purchase reassurance: **"Every Gunther Werks commission is supported by a 5-year or 100,000-mile warranty, whichever comes first, including access to future upgrades."**

**Build process:** Told almost entirely through **founder mythology**, not workshop step-by-step detail. Founder Peter Nam: "met with skepticism from investors and industry veterans who said it couldn't be done." The company name is explained as tribute: **"The company's name pays tribute to Gunther Wendt, the NASA engineer known for his exacting standards during the Apollo program."** No named rank-and-file craftspeople, no build-hours claim on-site (third-party press states "more than 45 employees... assemble each Gunther Werks 400R by hand" — **unverified assumption**).

**Photography/surface style:** The `/programs/*` sub-pages that likely carry product photography returned as near-empty of text — a finding in itself: Guntherwerks' product pages appear designed to be **seen, not read**, while text/story is reserved for the "Our Story"/"Ownership" pages.

**Specific commission page:** None — programs are named by tier, not by customer.

---

### B7. Ares Design / Ares Atelier (aresdesign.com → 301-redirects to aresatelier.com)

**Positioning:** **"ARES is on a mission. A mission to take luxury vehicles to the next level through a fusion of artisanal craftsmanship and cutting-edge technology."** Distinctive customer framing, not found on any other brand studied: **"With you, becoming co-creators in the most bespoke and stunning one-off vehicles in the world."**

**Content types:** Organized entirely by named vehicle programs (S1 Project, Bentley Mulsanne Coupé, Panther ProgettoUno, Defender V8 Hardtop, Motorbikes) rather than by a single donor platform — spans hypercar, luxury coachbuilding, retro-revival, and off-road luxury.

**How a commission is sold:** No pricing/waitlist/deposit copy found. The Bentley Coupé is sold on process pedigree: "handcrafted bespoke coachbuilding." (Press coverage, not site copy, describes their Modena facility as able to "produce up to 300 bespoke cars a year" — **unverified assumption**.)

**Build process:** Framed at the facility level (design, prototyping, 3D printing, paintshop, leatherwork under one roof per press coverage) rather than the individual-build level; no named craftspeople on the fetched homepage.

**Specific commission page:** None — organized by model program, not customer.

---

### B8. Lightly-covered candidates (search-derived, not deep-fetched)

- **Kimera Automobili** (`/evo37-2` fetched directly): heritage/motorsport-lineage-driven positioning — **"Kimera EVO37, embracing the Restomod philosophy, brings it to the next level by virtue of combining the style and charm which belong to one of the most legendary racing 'Beast' from Eighties."** Distinctive emphasis on continuity with the _original team_: **"The deep respect for the past... immediately involving the work group that gave life to the cars that inspired the EVO37."** Livery/heritage storytelling is central — dedicated editions tied to specific historic race results.
- **Lunaz** (not directly fetched — search-derived only): reported "sympathetic design ethos" and per-commission colour/material/finish approach; pricing reported by press (unverified) at ~$322,000 for a 50-unit Range Rover run.
- **Kalmar Automotive** (not directly fetched — thin/unrelated search results): self-describes (per indexed meta-title) as **"Automotive haute couture."**

---

### Cross-brand pattern summary (factual, not opinion)

- Only **Everrati** and **Tolman** publish an explicit, replicable process narrative in their own copy (Everrati's seven named stages; Tolman's blow-by-blow project diary). Singer, Theon, Guntherwerks, and Ares all keep "how it's built" implicit or delegate it to press coverage.
- Pricing disclosure ranges from fully opaque (Singer, Theon, Guntherwerks, Ares) to partially gated (Everrati's "from £POA\*") to third-party-only everywhere else.
- Scarcity language is universal but phrased differently: hard commission caps (Singer), per-program caps plus an invitation-only top tier (Guntherwerks), low annual output via press only (Theon), facility throughput as a selling point instead of scarcity (Ares).
- Named-individual craftsperson attribution is rare: only founders are named (Tolman's Chris Tolman, Theon's Adam Hawley, Guntherwerks' Peter Nam as origin myth). None of the seven deep-fetched brands names rank-and-file painters, trimmers, or machinists.
- "Customer-as-co-creator" framing is most explicit at Ares and Everrati; Singer and Guntherwerks instead frame the relationship as brand-delivers-a-masterpiece-to-owner.

---

## PART C — Luxury Craft References (non-automotive)

### C1. Roger W. Smith Watches (rwsmithwatches.com — note: the commonly-assumed domain rogersmithwatches.co.uk/.com does not resolve)

**Making process:** Quantified by **component count and total years, not hours-per-stage**: "may include over 400 components," most "made in-house from raw materials" (only balance spring, mainspring, jewels, sapphire crystals, seals, and straps bought in); **"Roger's watches can take up to two years to make."** Finishing vocabulary is specific: "frosted and gilded plates, black polished steelwork, flame-blued screws and hand engine turned dials," claimed to achieve "a depth and feel that mass production cannot match." Only Roger Smith himself is individually named. The workshop is framed as one continuous act: **"raw materials entering one end of the workshop and a finished watch exiting the other."**

**Commission/waitlist relationship:** No public price or wait time stated on-site. Entry is gated by relationship/fit, not by a queue number — prospects fall into three bands: existing owners of a Smith or Daniels piece, referrals from current collectors, or **"new enquiries from those who share our passion for bespoke British watchmaking."** Each commission is **"the result of a deeply personal process of creation,"** approached **"with care and consideration so that it aligns with our values of craftsmanship, integrity, and long-term stewardship."** (Third-party sources cite a ~3-year wait and $150k+ price — **unverified assumption**, not stated by Smith's own site.)

**Work-in-progress documentation:** Not present as an owned content feature — no mid-build photo/video series. The closest analogue is third-party: a Netflix documentary, _The Watchmaker's Apprentice_, chronicled "his five-year quest" to build a specific pocket watch — that's outside content, not site-owned WIP photography.

**Provenance/heritage of the maker:** Central to the pitch. Smith is positioned as George Daniels' protégé and steward — on Daniels' 2011 death, Smith received "the contents of the Daniels workshop collection," and Daniels' training is called "the finest finishing school I could have wished for." Auction results are used as external validation: Phillips called a recent pocket watch "the cornerstone of modern British Watchmaking," and Smith connects his own sale to the discipline's status: **"I also hope it is a meaningful statement for British watchmaking, too."** Identity-as-purism is stated directly: **"I make no apology for being a purist. Ours is the purest of mechanical arts."**

**What's genuinely borrowable here that the car sites don't already teach:** The gatekept-commission language ("share our passion," "aligns with our values… long-term stewardship") is a real structural idea — instead of publishing a price or queue, client selection itself is framed as part of the craft's integrity. A restoration shop could plausibly borrow the posture "we choose projects that fit the work, not just the calendar" more directly from here than from any auction lot page, since lot pages sell finished objects, not the _relationship of taking on a commission_. The honest caveat: the component-count/years-not-hours approach and finishing-technique vocabulary map closely onto what restomod sites already do (paint, panel, hand-finishing hours); the real differentiator is the gatekeeping language and the heritage-stewardship framing, not the process description itself.

---

### C2. Anderson & Sheppard, Savile Row (est. 1906)

**Making process:** One concrete, memorable figure: **"it takes upwards of 60 hours to produce a suit, with perhaps only 20 minutes of this time involving a sewing machine."** Roles are named as functions on the process page (Coat Cutter, Trouser Cutter, Coat Tailor, Trouser Tailor, Finisher, Trimmer); the team page names individuals with tenure — e.g. Danny Hall (Head Cutter, joined 1986, "followed his uncle into the trade," trained "under Alan Pitt"), John Malone (Head Trouser Cutter, joined 1975) — plus a collective claim: **"collectively dedicated over a century and a half of experience,"** and a workroom of **"over 30 specialist coat makers, trouser makers, alteration tailors, finishers and apprentices."** Gallery photography, however, is finished-garment-only — no construction/fitting-in-progress shots found.

**Commission/waitlist relationship:** No public wait time or price stated on the pages fetched. Continuity is the pitch instead: **"each customer is assigned two Cutters"** for all future orders; measurements are **"permanently recorded in measure books and assigned an exclusive pattern number belonging to the client,"** with paper patterns "hang[ing] in the cutting room" ready to be pulled for the next order.

**Work-in-progress documentation:** Not present in what was fetched — gallery captions describe finished garments in flat technical-spec language ("Single-breasted jacket in 12-13 oz green Shetland Tweed with three-button roll-through and notch lapel with swelled edge"), not a build narrated in progress. A "360 degree tour" of the workrooms is referenced in navigation but was not fetched — unverified whether it shows in-progress work.

**Provenance/heritage:** Front and centre — "Est 1906" and a royal warrant, "By Appointment to His Majesty The King, Tailors, London." Training is explicitly generational: apprentices "learn the art of tailoring as practised at Anderson & Sheppard under the one-to-one supervision of a master craftsman," which "ensur[es] the nuances, cut and quality that have defined Anderson & Sheppard for over 100 years are upheld and passed down." Stated hiring philosophy: **"we tend to train and grow our team from within, ensuring a continuity of tradition, precision and pride."**

**What's genuinely borrowable here:** Two ideas beat what auction/restomod sites teach. First, the "pattern belongs to the client, kept forever, pulled from the wall next time" idea is a concrete way to talk about an _ongoing custodial relationship_ rather than a one-off transaction — directly transferable to a shop doing recurring maintenance/rebuilds for the same client or the same car. Second, the precise 60-hours/20-minutes-machine-time ratio is a sharper, more credible way to quantify "handmade" than a vague adjective — a single memorable number instead of "lovingly restored." Honest caveat: A&S's own public pages are thinner on process storytelling and WIP photography than expected — the format itself (captions, reveal structure) doesn't beat what the car sites already do visually; the value here is in the _language_, not a presentation pattern to copy.

---

## PART D — Specification for a Restorer's Project Page

An ordered, borrowable structure assembled from the strongest element found in each category above. Each row names its source and flags feasibility for a small paint-and-body shop like DPM.

| #   | Section / Field                                                                                                                                                                                                                                                                                                                                                       | Verbatim source & why it was chosen                                                                                                                                                                                                                              | DPM feasibility                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Identity block** — Make, Model, Year, and (only if truly known) **Chassis** / **Engine** — using Gooding's plain labels ("Chassis / 2701 GT," "Engine / 4039"), not RM Sotheby's more clinical "Chassis No."                                                                                                                                                        | Gooding & Company (A4) — the cleanest, least jargon-heavy identity format of the five                                                                                                                                                                            | **Easy.** DPM knows every car's identity by definition of taking it in.                                                                                                                                                                                                                                                                                                                                           |
| 2   | **Coachwork / Colour / Interior** folded into the identity line or subtitle, not a separate table — e.g. "Coachwork by Scaglietti"                                                                                                                                                                                                                                    | Gooding (A4), Bonhams (A2) — both fold this into title/subtitle rather than a spec table                                                                                                                                                                         | **Easy** — DPM chooses/knows the paint colour and interior trim on every job.                                                                                                                                                                                                                                                                                                                                     |
| 3   | **The car's status today** — a one-line badge equivalent to "SOLD $8,090,000" or Broad Arrow's estimate — repurposed for a restorer as **"In the workshop" / "Delivered [date]" / "Owner-retained"**                                                                                                                                                                  | Gooding's prominent status-first placement (A4); Collecting Cars' "SOLD" badge (A5)                                                                                                                                                                              | **Easy** — status is simply true/known at all times.                                                                                                                                                                                                                                                                                                                                                              |
| 4   | **Provenance / ownership narrative** — short prose, not a table, naming as many owners and dates as are actually known, written in the RM Sotheby's/Gooding style                                                                                                                                                                                                     | RM Sotheby's (A1), Gooding (A4) — both use narrative prose with named owners and dates, not bullet lists                                                                                                                                                         | **Partial.** DPM will usually know only the current owner + how the car arrived (barn find, inherited, bought at auction). A restorer cannot fabricate a full ownership chain — write what's known and stop; do not pad.                                                                                                                                                                                          |
| 5   | **The restoration itself, narrated stage-by-stage with named specific findings** — e.g. Tolman's "no perfect correct spec roof skins available... fitted a non sunroof one and adapted it... using a custom made laser-cut jig," or RM Sotheby's "removing and cleaning the cylinder head, rebuilding the carburetors... fabrication and fitment of new wiring looms" | **Tolman Engineering (B3) is the primary model** — its blow-by-blow diary of specific problems found and specific fixes made is the single most replicable format in this whole research pass; RM Sotheby's restoration-history paragraph is the secondary model | **This is DPM's strongest and most native content.** A paint-and-body shop _lives_ this stage daily — strip-down discoveries, fabrication workarounds, panel/paint decisions. This is where DPM should invest the most, because it is real, present-tense process knowledge no auction house or restomod brand can match for immediacy.                                                                           |
| 6   | **Named specialists/subcontractors credited by name and trade**, not just "our team" — e.g. "rebuilt by Rick Bunkfeldt," "restored by Chris Keith-Lucas," "engine received a full rebuild from RPM Technik"                                                                                                                                                           | RM Sotheby's (A1), Gooding (A4), Collecting Cars (A5) — all name the specific person/shop who did specific work                                                                                                                                                  | **Easy and high-value.** DPM knows exactly who did the trim, who did the mechanical rebuild, who supplied parts. Naming them mirrors how every high-end lot page builds credibility.                                                                                                                                                                                                                              |
| 7   | **Photograph gallery, ordered exterior → engine bay → interior → underside → detail**, with an explicit count shown to the viewer (Broad Arrow's "1/132," Collecting Cars' "View all photos (144)")                                                                                                                                                                   | Broad Arrow (A3), Collecting Cars (A5) for the explicit-count convention; general auction-house convention for the category order                                                                                                                                | **Very feasible, but requires discipline.** DPM must actually shoot a full sequence per car, not ad hoc phone photos — this is a workflow/process change, not a technology one.                                                                                                                                                                                                                                   |
| 8   | **A "what cannot be proven" / condition-honesty paragraph** — modelled on Gooding's Saleroom Addendum and Collecting Cars' hedging boilerplate ("believed to be," "to the best of the seller's knowledge," explicit note on any known discrepancy)                                                                                                                    | Gooding (A4) for the single strongest example of proactive disclosure; Collecting Cars (A5) for the broader hedging-language pattern                                                                                                                             | **High-value, low-cost, and currently absent from every restorer site studied so far.** DPM should state plainly what's undocumented (e.g. "prior repair history before 20XX is not documented") rather than implying total certainty — this single move differentiates DPM from generic "expertly restored" copy and borrows real credibility from the auction-house convention of disclosing, not hiding, gaps. |
| 9   | **Documentation named explicitly** — "Invoices on file," "a binder of service records dating back to 1998," an FIA Historic Technical Passport / Massini Report equivalent                                                                                                                                                                                            | RM Sotheby's (A1), Gooding (A4), Collecting Cars (A5)                                                                                                                                                                                                            | **Partial.** DPM should name what it actually keeps (build sheets, parts invoices, before/after photo logs) even if it has nothing as formal as an FIA passport — naming _something specific_ beats a vague "full history available."                                                                                                                                                                             |
| 10  | **A discipline-appropriate process explanation, published once per shop (not per car)** — modelled on Everrati's seven named commissioning stages                                                                                                                                                                                                                     | Everrati (B5) — the clearest example of a brand explaining its whole working method once, so individual car pages don't have to re-explain it                                                                                                                    | **Very feasible and high-leverage.** DPM should write one "how a restoration works here" page (intake → strip-down → panel/paint → mechanical → trim → delivery) once, then individual car pages can reference it and spend their own words on what's specific to that car — avoiding repetition across every project page.                                                                                       |
| 11  | **Craftsperson-attribution and continuity language**, borrowed from outside the car world — "each customer is assigned two Cutters," patterns "hang in the cutting room" for next time                                                                                                                                                                                | Anderson & Sheppard (C2)                                                                                                                                                                                                                                         | **Feasible as a relationship idea, not a literal feature.** DPM doesn't need "pattern books," but the underlying idea — the same restorer/painter working a repeat client's next car, framed explicitly as continuity — is a real, ownable claim if it's true of how DPM actually operates.                                                                                                                       |
| 12  | **A stated commission/selection posture** — why DPM takes on the projects it takes on, in Roger Smith's register ("aligns with our values… long-term stewardship") rather than "no job too big or small"                                                                                                                                                              | Roger W. Smith (C1)                                                                                                                                                                                                                                              | **Feasible, cheap, and currently missing from every restorer teardown done so far (eaglegb, Thornton, Halcyon).** A short, honest paragraph on what kind of car/project DPM takes and why is a differentiator borrowed from the one reference in this research that isn't selling a finished object.                                                                                                              |
| 13  | **Named specialist/contact-card pattern for enquiries about a specific car** — "David Swig, Senior Car Specialist, +1-415-302-2247, dswig@hagerty.com"                                                                                                                                                                                                                | Broad Arrow (A3)                                                                                                                                                                                                                                                 | **Easy** — a named contact at DPM per project, not a generic contact form.                                                                                                                                                                                                                                                                                                                                        |
| 14  | **A soft next-project CTA at the foot of each finished-car page** — e.g. Gooding's "Have Something Similar? Consign With Us" / "Sell Your Car Today," repurposed for a restorer as "Have a project like this?" / "Start a conversation about your car"                                                                                                                | Gooding & Company (A4)                                                                                                                                                                                                                                           | **Easy and directly commercial** — this is the one place in the whole specification where the auction-house convention converts almost unchanged into a lead-generation mechanic for DPM.                                                                                                                                                                                                                         |

### What this specification deliberately leaves out, and why

- **A full multi-decade ownership chain** (RM Sotheby's/Gooding-style) is not something DPM can produce for most incoming cars — most clients bring a car with partial or no documented history. Do not fabricate a provenance narrative; write only what is verifiably known, and let item 8 (the honesty paragraph) cover the rest.
- **A formal "matching numbers" verification framework** (chassis/engine/gearbox cross-referencing as at RM Sotheby's) requires marque-specialist authentication resources a paint-and-body shop does not have. DPM should state what it physically observed (e.g. stamped numbers present/legible) without claiming an authentication service it doesn't perform.
- **Estimate/sold-price display** (items A1–A5) has no restorer equivalent and should not be forced into the spec — DPM is not selling the car, it's documenting work done to it. The nearest useful analogue is item 3 (status), not a price.
- **A published commissioning funnel with waitlist/deposit mechanics** (Everrati-style) is overkill for a shop that likely runs at capacity through word-of-mouth rather than a formal queue — item 10 (one process page) captures the useful part without the machinery a bigger brand needs to manage demand at scale.
