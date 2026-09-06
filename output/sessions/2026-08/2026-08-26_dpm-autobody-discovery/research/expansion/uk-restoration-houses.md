# UK Classic Car Restoration Houses — Reference Set Expansion

Research date: 2026-09-04. Excludes eaglegb.com, thorntonrestorations.com, halcyon.works (already torn down separately). All findings below are from live fetches of the URLs cited, except where explicitly marked "unverified" / "assumption." Client context: DPM Autobody, Berwick, East Sussex — concours-level restoration and paint specialist, small in-house team, engines/trim subcontracted, does paintwork for Halcyon.

Sites examined (12): Classic Motor Cars (CMC), RS Williams, DK Engineering, Aston Martin Works, Bridge Classic Cars, Nicholas Mee & Co, Envisage Group (Classic & Bespoke division), Moto Technique, and four South-East regional competitors — TEC Automotive, Jentree Classic Cars, British & Classic, Country Classic Cars. Woodham Mortimer was investigated and dropped (see its entry — domain is dead).

---

## 1. Classic Motor Cars Ltd (CMC), Bridgnorth — classic-motor-cars.co.uk

**Status: site is currently down/broken.** Verified directly with curl on 2026-09-04: `https://www.classic-motor-cars.co.uk/` fails TLS handshake (certificate is for `cloud2309.liveboxserver.uk`, a shared-hosting box, not the site's own domain), and bypassing the cert error returns a 163-byte stub page that meta-refreshes to `/cgi-sys/defaultwebpage.cgi` — the hosting provider's default parked page. `http://` (non-TLS) 301-redirects straight back into the broken `https://` host. This is not a transient blip pattern (last-modified header on the stub reads January 2026), it reads as a genuinely lapsed/misconfigured site. I could not fetch any real page content, navigation, positioning copy, or project pages. `web.archive.org` is not fetchable from this tool, so I have no archived fallback either.

**What is known (via search snippets only — mark as unverified, not fetched):** Founded 1993, Bridgnorth, Shropshire; 60,000 sq ft premises; two-time winner (2011, 2017) of an unnamed "Restoration of the Year" award; works across Jaguar, Aston Martin, Bentley, Ferrari, Lancia.

**Implication for this project:** CMC is one of the most award-decorated houses in the UK restoration scene, and its own web presence is currently an active liability — the kind of failure DPM should be able to point at and simply not have. Worth a follow-up spot-check closer to delivery in case it comes back online; if it doesn't, this is a live, citable example of "even a big name can go dark," useful for framing why DPM's site should be treated as infrastructure, not a one-off brochure.

---

## 2. RS Williams — rswilliams.co.uk

**Platform:** not detected (no obvious CMS fingerprint fetched).

**Nav (verbatim):** Sales | Parts | Heritage services | Company | Get in touch

**Positioning:** Headline "World-renowned Heritage Aston Martin specialists." Supporting line: "Since 1968, our family-run team has built a workforce with vast experience in Aston Martin servicing, sales, fabrication, engineering and race preparation." Restoration sub-page tagline: **"Miles ahead of the rest."** Price/quality justification leans on longevity (56 years), factory-appointed Heritage parts dealer status, racing pedigree (Goodwood Revival race wins 2024, Concours of Elegance class wins 2022 & 2024), and founding membership of the Historic & Classic Vehicles Alliance (1999).

**Content types present:** Featured Sales inventory; Heritage Services (five categories: Restorations, Servicing, Conversions, Projects & Upgrades, Motor Sports); genuine Parts department; two written customer testimonials; Company/team/showroom pages; racing history/DNA section; a **podcast** (Spotify); social integration.

**Single-car project page:** Not present as a discrete content type. The restoration page is a services/capabilities page, not a per-car project record.

**Restoration page anatomy (fetched in full):** Organised by technical discipline rather than by car or by stage — Engine (unleaded conversion, full rebuilds, dyno testing, displacement upgrades to 4.2/4.7L six-cylinder or 5.7/7L V8), Metalwork/Fabrication (TIG welding, brazing, block/head refurb, aluminium tank manufacture), Mechanical (balancing, brakes, air-con), Electrical (custom wiring, charging upgrades, fire safety). No paint or trim process is described at all — notable gap for a marque where bodywork condition drives value. No individual craftspeople named ("our team of experienced experts," "craftsman diagnosis" — collective only). No before/after photography. One genuinely useful line on documentation: **"we'll photograph your car and carefully document it throughout the restoration process, ensuring a seamless history that benefits the car's history file."** No cost or duration given anywhere.

**Imagery:** workshop photography with machinery and people at work, plus showroom/driving shots of finished cars.

**Trust/proof:** race wins, concours class wins, alliance founding membership, 56-year continuity claim — but no press quotes, no IMI/PAS125-style certification language.

---

## 3. DK Engineering — dkeng.co.uk

**Nav (verbatim):** Sales | Restoration | Servicing | Parts | Racing | News | Videos | About | Facilities | Storage | Contact

**Positioning:** "DK Engineering — The Ferrari Specialists." Justifies expertise via active participation: "Our active role in the ownership and competition participation with Ferrari motor cars gives us the first-hand experience with the marque." Spans "turn-key restoration to competition and concours preparation via routine service work on contemporary models."

**Content types present (the most exhaustive IA of the set):** Sales (Blue Chip & Competition Cars, Prestige Inventory, Automobilia, Coming Soon, Wanted Vehicles, archives); Restoration; Servicing; Parts sales/procurement + a "Sell your Parts" intake; Racing (previously prepared cars, race calendar); News/press; **DKTV** video series (user guides, racing coverage, tour series) — video as a named, ongoing content franchise rather than a one-off; Testimonials; Team/company history; Facilities/Showroom/Workshop; Storage.

**Single-car project page:** Implied by "Sold"/"archives" inventory listings but the dedicated `/restoration` and `/restoration/` sub-URLs both 404'd on fetch — I could not verify the anatomy of a restoration project page here. Flag as unverified/incomplete for this site; worth a manual re-check with a live browser if DK Engineering becomes a closer benchmark later.

**Trust/proof:** competition/ownership participation as credibility, not awards language; storage and facilities pages suggest a full-service "one address for everything" model.

---

## 4. Aston Martin Works — astonmartinworks.com

**Nav (verbatim):** New Cars | Pre-Owned Cars | Finance | Aftersales | Parts & Accessories | Body and Paint | Heritage | Contact Us

**Positioning:** Marketing taglines "ICON. DRIVEN." / "POWER. DRIVEN." Core claim: **"Aston Martin Works, the historic home of Aston Martin, is based at the brand's famous Newport Pagnell factory"** — "the historic home of Aston Martin cars since 1955," currently marking 70 years since Newport Pagnell production began. This is a factory-authenticity play that an independent can never claim — worth noting as a ceiling DPM shouldn't try to compete with rhetorically.

**Content types present:** New/pre-owned sales; Servicing (including fixed-price options); **Heritage Service** (classic restoration/maintenance) as its own top-level distinct from modern Aftersales; fixed-price Restorations; Parts & Accessories; **Assured Provenance** (authentication/inspection service — a distinct, named trust product); **Panel Production** (own-manufacture replacement body panels); Finance.

**Notable content type DPM lacks:** "Assured Provenance" as a named, sellable service (not just a documentation-as-part-of-restoration line) — packaging authentication/inspection as its own product is a positioning device worth considering, even at DPM's smaller scale, as a named line item rather than an implicit background activity.

---

## 5. Bridge Classic Cars — bridgeclassiccars.co.uk (Pettistree, Ipswich, Suffolk)

**Nav (verbatim):** Home | About Us | What We Do | Projects (Current Projects, Completed Projects) | Members Club | Media | Competitions | News (Industry News, Project News, News For Kids) | Contact

**Positioning:** "The Classic Car Specialists." "Bridge Classic Cars merges the modern world with the classic lifestyle." Established 2004. Line worth stealing almost verbatim: **"It is the finer details that make the perfect restoration and perfection is all we accept."**

**Content types present — by far the widest of any site in the set:** Workshops/restoration; a **prize-draw Competitions** business line (paid entry to win a classic car — a genuine secondary revenue model, not just marketing); **Members' Club** ("The Classic Lounge") with member events; general Events; Showroom sales + a linked third-party marketplace (MyClassics); a general-interest **Blog** covering industry news; and, distinctively, a **"News For Kids"** category — content aimed at a family/next-generation audience, unique in this set.

**Single-car project page — anatomy (fetched directly, `/db2-engine/`, a real post from the Current Projects stream on a 1955 Aston Martin DB2/4):**
This is **not a structured project template** (no fixed fields, no chassis-number field, no cost/duration field) — it is a **running blog-post build diary**, one dated post per update, filed under a per-car category so all posts about one vehicle collect together. The DB2/4 post: 21 photographs, no before/after pairing (work-in-progress only), a named technician ("Scott") credited for the specific job (engine refit) with the post bylined to a named writer ("Rob Harvey") — real people, real bylines, not "our team." Voice is conversational/second-person-plural ("Everyone here at Bridge Classic Cars is looking forward…"), acknowledges elapsed time loosely ("a little while since") rather than giving a hard timeline. No chassis number, no cost, no duration anywhere. Ends with an author contact link/email form — the diary format is explicitly used to build reader relationship, not just document work.

**Current Projects archive:** 33 vehicles listed on page 1 alone (two-page archive), ranging 1936–1984, spanning Fraser Nash, Bentley, Jaguar, Aston Martin, Porsche, TVR, MG, and ordinary classics (Morris Traveller, VW Golf Cabriolet) — the breadth signals genuine working-shop volume rather than a curated highlight reel.

**Implication:** This is the clearest evidence in the set that a "build diary" content type, done as a real per-car blog category with named staff, functions as both marketing and a customer-facing progress record. Bridge Classic Cars is not concours-tier positioning (no awards/concours language found), but the diary mechanic itself is directly transferable to DPM regardless of price tier.

---

## 6. Nicholas Mee & Co — nicholasmee.co.uk

**Nav (verbatim):** Home | Car Sales | Service & Aftercare | Parts & Merchandise | Model Guides | News | Careers | About Us | Contact Us

**Positioning:** "Aston Martin Dealer — Nicholas Mee." "Established in 1993... recognised worldwide as a specialist in the sale and servicing of Aston Martin cars." "a truly personalised experience for enthusiasts, collectors and first-time owners." "Our passion for the marque is matched only by our commitment to quality."

**Content types present:** Sales inventory + Popular Models carousel with pricing; Vehicle Sourcing; Personal Number Plates; Service (diagnostics, fixed-price servicing, trim/upholstery restoration, valeting/detailing, storage); **Model Guides** — an educational, marque-history content type distinct from sales or restoration (e.g., dedicated guide pages for DB5, V8 Vantage, Vanquish generations); News; Team/Careers; Reviews; a **biannual e-magazine ("FullBore")** — branded owned-media, another content type not seen elsewhere in the set.

**Trust/proof:** 30+ years, "leading luxury car dealer" framing, awards/recognition section (unspecified awards), reviews section, heavy social presence (Facebook/Instagram/YouTube/Twitter/Pinterest).

---

## 7. Envisage Group — Classic & Bespoke division, envisagegroupltd.com

**Note:** Envisage is primarily a coachbuilding/engineering group (four divisions, Coventry HQ, Weedon Bec facility) rather than a pure restoration house — included because the metalwork/panel-fabrication content is directly relevant to how a restoration business can present in-house craft capability.

**Page fetched:** `/services/envisage-classic-bespoke/` (Metal Forming sub-page). Tagline: **"Where artisan skills meet engineered solutions"** — an explicit craft+precision positioning device worth stealing as a phrase pattern. Claims: "one of the UK's foremost classic car and restoration companies," trusted by OEMs and collectors, combining "new and traditional techniques," in-house tooling to **"+/- 0.2mm"** tolerance — a specific, quotable precision figure.

**Content types:** Services list (classic restoration, low-volume panel manufacture, English Wheel forming, digital scanning/CAD, composite fabrication — carbon fibre/GRP/flax, EV conversion support, electrical/powertrain integration, bespoke trim); **project case studies** shown as named examples (a bespoke furniture piece "The Couch," Win Percy's Jaguar E-Type, a 1958 Austin Healey restoration, a Mk1 Ford Transit conversion, a Daimler 250 V8, an unnamed reimagined 1950s classic) — presented as a case-study grid, not full project pages.

**Named craftsperson:** Andy Hunter, credited by name and title ("Bespoke Metalwork Manager") as the named point of contact for that specific team — a lightweight but real instance of naming an individual against a specific discipline.

---

## 8. Moto Technique — mototechnique.com (Surrey/London area, est. 1980)

**Nav (verbatim):** Cover Gallery | Home | About | Restomods & Upgrades | Services (Bodywork, Paintwork, Mechanical, Interior Trim, Hi-Tech) | Completed Projects | Portfolio | Testimonials | Films | Articles & Media | Contact Us

**Positioning:** "Classic and Sports Car Restoration Specialists," "Moto Technique est. 1980," "over 40 years' experience in resto mod and evo work." International client base explicitly claimed: "private collectors, museums, auction houses, and insurance companies across the UK, Europe, Asia and North America."

**Content types:** Restomod/upgrade work as its own nav item (distinct from pure restoration — notable, since resto-mod is a growing adjacent market); Services broken out by discipline including a **"Hi-Tech"** category; Completed Projects; a separate **Portfolio** gallery; Testimonials; **Films** (video); Articles & Media (press).

**Notable projects referenced:** Ferrari 250 GTO, 308 GTB, F40LM; Mercedes 300SL Gullwing; Lamborghini Miura; BMW Isetta — blue-chip marque range used as implicit credibility.

**Imagery:** described (via fetch summary) as high-quality, minimalist, before/after prominent in the portfolio.

---

## 9. TEC Automotive — tecauto.co.uk (near Pevensey, East Sussex) — direct local competitor

**This is one of DPM's actual local competitors** — Pevensey is roughly 15 miles from Berwick, East Sussex.

**Nav (verbatim):** Home | Service & MOT | Vehicles | DPF Cleaning | Electrical | Restoration | Blog | Contact

**Positioning:** "Classic Car & Vehicle Restoration." "Specialist restoration of American muscle cars, classic trucks, and vintage vehicles in East Sussex. Bringing your pride and joy back to its former glory." Explicitly claims "one of the leading classic car restoration specialists in East Sussex," differentiators cited: decades of experience, transparent pricing, "attention to original factory specifications." Serves 18+ named towns (Eastbourne, Brighton, Hastings, Tunbridge Wells, Worthing) with collection/delivery offered.

**Content types:** Service menu; **a four-step restoration process explanation** (a simplified, consumer-facing "how it works" content type, distinct from CMC/RS Williams's discipline-based service breakdown); two current workshop project photos (Camaro, Trans Am) rather than a full gallery; geographic service-area list; Blog.

**Specialisation note:** American muscle/classic trucks, not British/European concours marques — different market segment from DPM but directly adjacent geographically, and their explicit "transparent pricing" claim plus a simple numbered process explainer is a strong, cheap-to-produce content pattern DPM currently lacks.

**Imagery/quality:** professional workshop photography, natural lighting; copy assessed as substantial but not overwritten; overall a well-built small-shop site.

---

## 10. Jentree Classic Cars — jentreeclassiccars.co.uk (East Sussex, est. 1981) — direct local competitor

**Nav (verbatim):** News & Events | Restoration | Classic Car Sales | Services | About Jentree | Contact Us

**Positioning:** "Classic Car Specialists," "a family run business, established in East Sussex since 1981," "high end, quality service, with a personal touch." Located "just off the A22." Marques: Jaguar, Triumph, Aston Martin, MG, Austin Healey, Lotus, Jensen "as well as many more." Credentials cited: 40+ years in business, "200+ combined years of team experience."

**Content types:** Restoration; general Servicing; Classic Car Sales; News & Events; About; social presence across YouTube/Instagram/Facebook/LinkedIn.

**Gap identified directly by the fetch:** "the site lacks visible project galleries, detailed testimonials, or professional photography samples that would elevate the visual presentation" — i.e., a long-established, credentialed local competitor with a real reputation but a web presence that under-sells it. This is a direct opportunity: DPM can out-execute a same-postcode competitor on web craft alone if the underlying content types (project galleries, before/after, real photography) are done properly.

---

## 11. British & Classic — britishandclassic.co.uk (Haslemere, Surrey — Brooklands/Goodwood corridor)

**Nav (verbatim):** Home | Contact | About | Projects (submenu: Triumph Stag, The Vintage Austin 7, Austin A35, Volvo Amazon, Triumph TR2, VW Type 2 Bay, Land Rover Series) | What We Do (submenu: Specialist Painting, Classic Car Services, FAQs, Auto Body Repair) | B&C Blog | What Our Customers Say

**Positioning:** "Classic Car Restoration in Haslemere." "We specialise in the preservation and performance of iconic vehicles such as the Triumph Stag, Volvo Amazon and P1800," combining "traditional craftsmanship with modern workshop processes." Located "mid-way between Brooklands Motor Circuit and Goodwood Estate."

**Content types:** Projects presented as **per-model case studies** (Austin A35 "Restomod," Alvis TD21, Austin A40 Sports) with before/after imagery; Specialist Painting called out as its own named service page (directly relevant to DPM, whose core trade is paint) — separate from general "Classic Car Services"; a dedicated **FAQs** page; a customer-facing **B&C Blog**; a "What Our Customers Say" testimonials page.

**Trust/proof:** FBHVC (Federation of British Historic Vehicle Clubs) Trade Supporter status, "IGA-approved" — the only site in this set citing a named third-party trade/accreditation body by name rather than vague "certified" language. Worth checking whether DPM holds or could hold an equivalent (FBHVC Trade Supporter is a realistic, attainable credential for a business this size).

**Assessment (from fetch):** "High" overall professionalism — premium presentation, industry accreditation, curated portfolio, heritage branding (British flag emblem) — for what is a small regional shop, not a national name. This is arguably the closest comparable to DPM by scale and geography (Surrey vs. East Sussex) and is worth treating as a primary competitive benchmark alongside TEC and Jentree.

---

## 12. Country Classic Cars — country-classic-cars.co.uk (Fernhurst, Surrey/West Sussex/Hampshire border)

**Platform:** WordPress (confirmed via `wp-json` REST endpoints in response headers).

**Nav (verbatim, from page source):** Home | About | For Sale | Services | Classic Car Finder Service | Classic Car Commission Sales | Classic Car Restoration & Servicing | Past Projects | Contact

**Positioning (H1, verbatim):** "Classic car servicing, restoration & sales in Surrey, Sussex & Hampshire." Specialises in Bentley, Mercedes, Jaguar, MG, Triumph of the 1950s–80s period (per search-derived summary — the platform/nav/H1 are directly verified; the marque-specialisation detail is carried over from search snippet, not independently re-verified against page body copy, so mark as a lighter-confidence assumption).

**Content types:** "Classic Car Finder Service" (a sourcing/acquisition service distinct from restoration or sales) and "Classic Car Commission Sales" (consignment-style sales) as two named, separate service lines — a sourcing/brokerage layer that none of the pure restoration houses in this set offer explicitly; **Past Projects** as its own nav item.

**Note on method:** This site returned HTTP 425 ("Too Early") to the WebFetch tool's default request on three attempts, but responded normally (HTTP 200, full page) to a direct `curl` request carrying a standard desktop browser User-Agent — likely a bot-fingerprinting rule on their host blocking the fetch tool specifically. Flagging this because it means WebFetch-based competitive research can silently under-sample a site that looks "broken" but is actually just blocking that specific client.

---

## Site investigated and dropped: Woodham Mortimer

`woodham-mortimer.com` was seeded from Autocar/Robb Report coverage as the JD Classics successor (Mille Miglia global restoration partner, Goodwood Revival classic-car partner, 150,000 sq ft Chelmsford facility). **The live domain no longer belongs to that business.** It now serves a minimal page headed "ICONIC CLASSIC CARS ROAD & RACE," redirecting to third-party marketplaces (JD Iconic, Car and Classic) and carrying an explicit disclaimer: "This website is not affiliated with any former Woodham Mortimer company. It exists solely as a historical reference." Company-registry search did not turn up a clear 2025/2026 closure notice for the main trading entity, so the operating company's current status (trading under a new name, dormant, or genuinely gone) is **unverified** — the only firm fact is that the domain itself has been repurposed. Dropped from the reference set rather than mis-citing content that isn't theirs.

---

## Patterns across the set

- **Every credible site in this tier separates "Restoration" from "Servicing"** as distinct nav items, even where the same workshop does both — signals to a prospective client that restoration is a specialist discipline, not routine maintenance priced the same way.
- **Named individuals are rare, and stand out sharply when present.** Only Bridge Classic Cars (byline + a named technician per post) and Envisage (one named manager) put a real person's name next to a specific piece of work. RS Williams, DK Engineering, Nicholas Mee, TEC, Jentree all stay at "our team"/"our experts." This is a real differentiation opportunity, not a saturated tactic.
- **A genuine single-car "project page" template (chassis number, dated stages, photo count, cost/duration, documentation offered) essentially does not exist anywhere in this set as a structured page type.** The closest analogues are Bridge Classic Cars' per-car blog category (a running diary, not a template) and British & Classic / Envisage's per-model case-study pages (a finished-state showcase, not a process record). Nobody in this set — including the well-resourced names — publishes a rigorous, fielded project record with chassis data, named craftspeople per stage, and duration/cost transparency.
- **Video is a named, recurring content franchise at the higher tier** (DK Engineering's "DKTV," Moto Technique's "Films") but is absent at the regional/local tier (TEC, Jentree, British & Classic, Country Classic Cars) — an accessible differentiator for DPM if budget allows even simple workshop-floor video.
- **Documentation/provenance is talked about in prose, never packaged as a product**, except Aston Martin Works' "Assured Provenance," which is the one instance of naming it as a discrete, sellable line.
- **Owned-media/editorial content beyond a blog is rare but present at the top of the market**: Nicholas Mee's biannual "FullBore" e-magazine, DK Engineering's News/Videos, RS Williams' podcast. None of the regional competitors have anything like this.
- **Trade/accreditation branding is inconsistent and mostly generic.** Only British & Classic names a specific body (FBHVC Trade Supporter, "IGA-approved"). Nobody in the set cites IMI or PAS 125 by name. Award/concours-result language (RS Williams' Goodwood/Concours class wins, CMC's twice-won "Restoration of the Year" per secondary sources) appears only at the upper tier.
- **Regional/local competitors (TEC, Jentree, Country Classic Cars) have real credentials (decades in business, hundreds of combined team-years) but visibly weaker web execution** — thin galleries, no real testimonials pages, no video — than their claims justify. This is the most directly actionable finding for DPM: the local competitive bar is genuinely low on execution even where the underlying craft/reputation is strong.
- **A brokerage/sourcing layer** ("Classic Car Finder Service," "Vehicle Sourcing," "Wanted Vehicles") appears at several sites (Country Classic Cars, Nicholas Mee, DK Engineering) as a value-add distinct from restoration — not confirmed as something DPM currently offers or needs, but worth a deliberate yes/no decision rather than an omission.

## What DPM is missing (cross-referenced against the wider pattern, not just the original three teardowns)

1. **No structured single-car project-page template exists anywhere in the reference set to copy wholesale** — DPM has a genuine opportunity to be first in this specific tier to do a rigorous, fielded project record (chassis/provenance data, dated stages, named craftsperson per stage, photo count, documentation offered) rather than either a loose blog diary (Bridge) or a static case-study gallery (British & Classic, Envisage). This is a differentiation opening, not a gap to fill defensively.
2. **Naming individual craftspeople against specific work** — nearly absent industry-wide; DPM's "small team, everything hand-crafted in-house" story is exactly the kind of business where this would land hardest and cost nothing to add.
3. **A simple, numbered "how it works"/process explainer** (TEC Automotive's four-step model) — cheap, absent from the higher tier, valuable for a prospect who has never commissioned a restoration before.
4. **A named documentation/provenance product** (Aston Martin Works' "Assured Provenance" as the only instance) rather than a background promise buried in prose.
5. **A specific, quotable precision/quality claim** in the Envisage "+/- 0.2mm" mould, or a hard credential (FBHVC Trade Supporter is realistic and the only named trade body found in the whole set) rather than generic "quality"/"passion" language.
6. **Video, even minimal**, is a differentiator against every local competitor (TEC, Jentree, British & Classic, Country Classic Cars all lack it) while being standard at the top of the market.
7. **Local competitive context**: TEC Automotive and Jentree Classic Cars are genuine, real, currently-trading competitors within ~20 miles of Berwick — both have longevity and credentials but visibly under-built web presences (thin galleries, no real testimonials, no video). DPM's most direct, winnable competitive advantage is simply executing the web presence properly against a local bar that is currently low.
