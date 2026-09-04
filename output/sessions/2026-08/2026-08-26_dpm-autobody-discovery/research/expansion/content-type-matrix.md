# Content-Type Matrix — Classic Car Restoration / Concours Specialist Category

Breadth sweep for DPM Autobody discovery. 30 sites fetched live (homepage + sitemap.xml and/or
nav) across five parallel research passes, UK and US, general and marque-specific. Two additional
US marque candidates (Canepa, Classic Showcase) were attempted and dropped as unreachable
(ECONNREFUSED/403 on every URL tried) rather than reported from memory. `eaglegb.com`,
`thorntonrestorations.com` and `halcyon.works` were excluded per brief (already covered elsewhere).

**Method note on counts:** each row below is a fetch-verified tally out of the 30 sites swept, not
a re-audit of every site against every checklist item at deep-dive depth — this is a breadth sweep,
so treat counts as accurate to roughly ±1–2 sites rather than exhaustively cross-checked. Where a
site's status was genuinely ambiguous from the fetched content (e.g. a `/login/` page whose purpose
couldn't be confirmed), it is noted inline rather than guessed into a column.

## Sites swept

| #   | Business                             | URL                           | Region | Marque focus                      |
| --- | ------------------------------------ | ----------------------------- | ------ | --------------------------------- |
| 1   | E-Type UK                            | etypeuk.com                   | UK     | Jaguar E-Type only                |
| 2   | West Riding (Independent)            | westridingindependent.co.uk   | UK     | Jaguar/Ford                       |
| 3   | Aston Engineering                    | astonengineering.co.uk        | UK     | Aston Martin                      |
| 4   | Richards of England                  | richardsofengland.com         | UK     | Aston Martin (+ others)           |
| 5   | Concours Classics                    | concoursclassics.co.uk        | UK     | Multi-marque                      |
| 6   | Classic Car Lab                      | classiccarlab.com             | UK     | Multi-marque                      |
| 7   | Kingsley Defenders                   | kingsleydefenders.co.uk       | UK     | Land Rover Defender               |
| 8   | Arkonik                              | arkonik.com                   | UK     | Land Rover Defender               |
| 9   | Twisted Automotive                   | twisted.co/automotive         | UK     | Land Rover Defender               |
| 10  | The Mini Restoration Company         | classicminirestorations.co.uk | UK     | Mini + British classics           |
| 11  | The Alfa Workshop                    | alfaworkshop.co.uk            | UK     | Alfa Romeo                        |
| 12  | Alficina                             | alficina.com                  | UK     | Alfa/Ferrari/Lancia/Maserati/Fiat |
| 13  | Historika                            | historika.co.uk               | UK     | Porsche                           |
| 14  | Roger Bray Restoration               | rogerbrayrestoration.com      | UK     | Porsche (356/911/914/964)         |
| 15  | GTO Engineering                      | gtoengineering.com            | UK     | Ferrari                           |
| 16  | DK Engineering                       | dkeng.co.uk                   | UK     | Ferrari                           |
| 17  | SLSHOP (The SL Shop)                 | theslshop.com                 | UK     | Mercedes-Benz                     |
| 18  | Hilton & Moss                        | hiltonandmoss.com             | UK     | Mercedes/Aston/Jaguar/Lotus/multi |
| 19  | Steve's Auto Restorations            | stevesautorestorations.com    | US     | Multi-marque/custom               |
| 20  | Automotive Restorations, Inc.        | automotiverestorations.com    | US     | Multi-marque                      |
| 21  | Manns Restoration                    | mannsrestoration.com          | US     | Multi-marque                      |
| 22  | Restorations Limited                 | restorationsltd.com           | US     | Multi-marque                      |
| 23  | Cornerstone Automotive Restorations  | csautorestorations.com        | US     | Multi-marque                      |
| 24  | Superior Quality Rides & Restoration | superiorqualityrides.com      | US     | Multi-marque                      |
| 25  | Classic Porsche Restoration          | classicporscheresto.com       | US     | Porsche                           |
| 26  | Motion Products Inc (MPI)            | mpi-ferrari.com               | US     | Ferrari/Maserati/Lamborghini      |
| 27  | Vintage Car Works                    | vintagecarworks.com           | US     | Porsche (multi-marque work)       |
| 28  | Stew Jones Restoration               | jaguarv12etype.com            | US     | Jaguar V12 E-Type only            |
| 29  | E-Type America                       | etypeamerica.com              | US     | Jaguar E-Type                     |
| 30  | Vantage Motorworks                   | vantagemotorworks.com         | US     | Bentley/Rolls-Royce               |

---

## 1. Content-type matrix

| Content type                                                              | Sites with it (of 30)                                             | Example URLs                                                                                                                                                       |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Individual car/project pages                                              | 20                                                                | richardsofengland.com/aston-martin-db6-restoration-3280, dkeng.co.uk (Vehicle_Archive), arkonik.com (200+ named builds)                                            |
| Portfolio/gallery index                                                   | 29 (only Alfa Workshop lacks one)                                 | astonengineering.co.uk (Projects), theslshop.com/reborn                                                                                                            |
| Build diaries / restoration blogs (dated, ongoing)                        | ~9                                                                | richardsofengland.com (120+ per-chassis posts, best example), mpi-ferrari.com/news, westridingindependent.co.uk/news (stale since 2019)                            |
| News/press (own announcements)                                            | ~16                                                               | dkeng.co.uk/ferrari-news.php, historika.co.uk/news                                                                                                                 |
| Press coverage (third-party media)                                        | ~10                                                               | hiltonandmoss.com (Top Gear, Robb Report, Hagerty), classiccarlab.com (Bangers and Cash)                                                                           |
| Services pages                                                            | ~27                                                               | most sites                                                                                                                                                         |
| Marque or model specialisms                                               | ~22                                                               | etypeuk.com, theslshop.com (per-chassis-code pages), hiltonandmoss.com (per-marque/model service taxonomy)                                                         |
| **Cars for sale / inventory**                                             | 19                                                                | dkeng.co.uk/ferrari-sales.php, arkonik.com, vantagemotorworks.com                                                                                                  |
| **Parts sales**                                                           | 12                                                                | astonengineering.co.uk (model-by-model catalog), rogerbrayrestoration.com/shop (full e-commerce), gtoengineering.com (GTO Parts Shop)                              |
| Storage                                                                   | ~8                                                                | dkeng.co.uk (dedicated dept, 5 named staff), theslshop.com/classic-car-storage                                                                                     |
| Servicing/maintenance                                                     | 17                                                                | alfaworkshop.co.uk (priced), theslshop.com/workshops                                                                                                               |
| Transport/collection                                                      | ~5                                                                | dkeng.co.uk (Transportation facility), automotiverestorations.com                                                                                                  |
| Race preparation and support                                              | ~9                                                                | automotiverestorations.com (full Vintage Racing Services sub-site), gtoengineering.com                                                                             |
| **The commissioning process explained** (estimating, deposits, timelines) | ~7                                                                | restorationsltd.com (best plain-English example: tiers + billing philosophy), arkonik.com/process, kingsleydefenders.co.uk (Build Process)                         |
| Pricing or hourly rates                                                   | 4                                                                 | alfaworkshop.co.uk (published fixed prices — only site with a real rate card), restorationsltd.com (man-hour ranges by tier)                                       |
| **Progress reporting to owners during a build** (portals, updates)        | 1–2 confirmed                                                     | arkonik.com (genuine client login/portal — the only unambiguous one found); richardsofengland.com (workaround: public per-chassis blog posts)                      |
| Team/craftspeople profiles                                                | 7 strong (named + bios), ~11 with looser mentions                 | richardsofengland.com/team (9 named staff w/ bios), dkeng.co.uk/company/Our_Team.html (12 named)                                                                   |
| Careers and apprenticeships                                               | 9                                                                 | dkeng.co.uk, gtoengineering.com/careers, vintagecarworks.com                                                                                                       |
| Heritage/company history                                                  | ~16                                                               | dkeng.co.uk (Philosophy and History), theslshop.com (60-years-of-the-Pagoda)                                                                                       |
| Awards and concours results                                               | 12                                                                | mpi-ferrari.com/awards (chassis-numbered, rigorous), richardsofengland.com, mannsrestoration.com/about-us/awards                                                   |
| Client testimonials                                                       | 13                                                                | concoursclassics.co.uk, vintagecarworks.com/testimonials                                                                                                           |
| Video/YouTube                                                             | ~11                                                               | dkeng.co.uk (branded "DKTV"), stevesautorestorations.com (founder documentary)                                                                                     |
| Podcasts                                                                  | 0                                                                 | —                                                                                                                                                                  |
| Newsletter signup                                                         | ~10                                                               | arkonik.com, theslshop.com                                                                                                                                         |
| Events calendar / show attendance                                         | 9                                                                 | dkeng.co.uk (multi-year archive), mannsrestoration.com (forward-dated 2026 concours dates)                                                                         |
| FAQ                                                                       | 5 literal + 1 equivalent                                          | vintagecarworks.com/faqs (7 Qs, best example), stevesautorestorations.com; theslshop.com's 17-article "Common Issues" diagnostic KB functions as an FAQ-equivalent |
| Certifications and approvals (IMI, PAS 125, BS10125, paint-manufacturer)  | 0 of the named UK bodyshop certs; 2 of a looser "credential" kind | astonengineering.co.uk ("Official Heritage Parts Partner"), alficina.com (HCVA trade-body membership)                                                              |
| **Insurance and accident repair**                                         | 3                                                                 | hiltonandmoss.com (dedicated "Bodyshop" nav line + accident-repair articles — best example), classiccarlab.com (accident repair as a co-equal service line)        |
| Valuations and appraisals                                                 | 3                                                                 | gtoengineering.com (pre-purchase appraisal), theslshop.com (valuation certificate service), hiltonandmoss.com                                                      |
| Sourcing/car finding                                                      | 4                                                                 | historika.co.uk (sell-your-car), hiltonandmoss.com (acquisition & consignment), mpi-ferrari.com (dedicated sourcing/selling form)                                  |
| Warranty                                                                  | 2                                                                 | theslshop.com (dedicated warranty page), classiccarlab.com                                                                                                         |
| Sustainability                                                            | 0                                                                 | —                                                                                                                                                                  |
| Client login/private areas                                                | 6                                                                 | arkonik.com, theslshop.com (my-account + Owners Club), vantagemotorworks.com ("My Garage")                                                                         |
| Shop/merchandise                                                          | 8 (mostly parts-as-shop, not lifestyle merch)                     | rogerbrayrestoration.com/shop, alfaworkshop.co.uk                                                                                                                  |
| Location and directions                                                   | ~11 have any dedicated treatment; only 2 embed a live map         | dkeng.co.uk (helicopter landing GPS/ICAO code), westridingindependent.co.uk, classiccarlab.com (both embed Google Maps)                                            |
| Multi-language                                                            | 0 (2 sites show region-variant content, not translation)          | arkonik.com, twisted.co (UK/US/Japan presence, English throughout)                                                                                                 |

---

## 2. Rare-but-excellent content types (1–2 sites only, clearly strong)

- **Client build-progress portal** — arkonik.com is the only site in the sweep with a genuine login-gated progress/status area for clients.
- **Public per-chassis build diary as a progress-reporting workaround** — richardsofengland.com gives each restoration its own dated post thread; solves the same owner-visibility problem as a portal while doubling as SEO/marketing content.
- **Plain-English commissioning/billing philosophy** — restorationsltd.com explains restoration tiers (standard/factory-original/concours) by man-hour range and states its billing philosophy in first person ("I do NOT bill unproductive time"), despite an otherwise primitive, TLS-broken site — the clearest proof in the sweep that content quality and production values are independent.
- **Dedicated insurance/accident-repair line with its own content marketing** — hiltonandmoss.com runs a "Bodyshop" nav category with articles like "What to do after a car accident," directly relevant to a business named "Autobody."
- **Diagnostic knowledge-base as FAQ-alternative** — theslshop.com's 17-article "Common Issues" library (e.g. "R129 Mercedes brake check") captures long-tail search intent that a generic FAQ would miss.
- **Owners' club / membership community** — theslshop.com's "SLSHOP Owners Club" and membership tier go beyond a newsletter into a standing community.
- **Enquiry-type routing to named departmental staff** — dkeng.co.uk's contact form has a dropdown (Sales/Parts/Storage/Workshop-Servicing/General) tied to 15+ named individual staff contacts.
- **Intent-segmented enquiry forms** — mpi-ferrari.com runs three separate forms (Restoration / Sourcing-or-Selling / Other Services); its dedicated Restoration form is the only one in the entire sweep that asks for Make/Model/Year.
- **"Submit Your Build" intake funnel, distinct from general contact** — stevesautorestorations.com.
- **Buyers'-guide content marketing** — alfaworkshop.co.uk publishes model-by-model "what to check before buying" guides, a genuinely differentiated top-of-funnel content type none of the other 29 sites replicate.
- **Manufacturer/heritage-partner credential displayed as a trust signal** — astonengineering.co.uk's "Official Heritage Parts Partner" status.
- **Continuation/recreation-car product line with closed-order-book framing** — gtoengineering.com's "Revival" range presents a full order book as premium exclusivity rather than unavailability.
- **"My Garage" saved-vehicle/price-alert CRM** — vantagemotorworks.com, a dealer-style retention feature none of the restoration-only sites have.
- **TV/media appearance as a credibility signal** — classiccarlab.com cites "featured on Bangers and Cash."
- **Helicopter landing GPS/ICAO code on a directions page** — dkeng.co.uk, aimed at a high-net-worth clientele.
- **Deliberate email-over-phone policy** — alfaworkshop.co.uk's contact page explicitly asks people not to phone if they've already emailed — the only site with an anti-phone-first stance.
- **Rigorous, chassis-numbered awards documentation** — mpi-ferrari.com presents concours results as verifiable data (chassis numbers, placements, event years back to 1993) rather than marketing copy.

## 3. Table stakes (near-universal; absence would be conspicuous)

- **Portfolio/gallery index** (29/30) — the one clean exception, alfaworkshop.co.uk, substitutes an e-commerce parts shop and buyers-guides instead, which is a deliberate trade-off, not an oversight.
- **A services page** (~27/30).
- **Some form of phone number plus a contact form** (30/30) — every site had at least a phone/email, most also had a basic form.
- **Marque/model specialism messaging** (~22/30) — the category is built around narrow expertise; a generalist site is the minority pattern.
- **Individual car/project pages in some form** (20/30) — a majority, though far from universal; several credible, currently-trading shops get by with a static gallery instead.
- **Heritage/founder-story narrative** (~16/30) — common enough that its absence reads as a gap on an otherwise-built-out site.

## 4. Local/regional SEO patterns

- **Location+service combination pages are essentially absent across the whole sweep, UK and US alike.** No site — including the multi-site UK businesses (Twisted's four showrooms, DK Engineering's single Chorleywood site) — built dedicated "restoration in [town/county]" landing pages. This looks like a genuine category norm: concours clients travel nationally/internationally for a trusted specialist, so businesses invest in marque/model specificity instead of geographic reach. **Editor's note, 2026-09-04:** that last clause is a hypothesis about _why_, not a finding. What was actually observed is that competitors don't build these pages. Whether anyone searches for them is a separate question this sweep cannot answer, and it needs keyword data rather than a navigation read.
- **Marque- and model-specific landing pages are the dominant SEO strategy in this category**, functioning as the de facto substitute for location pages: etypeuk.com, historika.co.uk, rogerbrayrestoration.com (356/911/914/964), theslshop.com (per-chassis-code pages, e.g. W113/R107/R129), hiltonandmoss.com (marque × model service matrix). This is the single strongest, most consistent IA pattern across all 30 sites.
- **Embedded live Google Maps are rare** — only westridingindependent.co.uk and classiccarlab.com were confirmed to embed one. Most sites (including large, well-resourced ones like DK Engineering and Hilton & Moss) give only plain address text.
- **Google Business Profile / reviews-widget integration was not confirmed on any site** — several show testimonial quotes lifted from press or clients, but none embed a live Google/Trustpilot reviews widget.
- **Given DPM is a single-workshop, East Sussex business**, the category evidence suggests: (a) don't expect competitors to be doing sophisticated local SEO, so basic hygiene (GBP profile completeness, NAP consistency, an embedded map, a proper address/directions block) is enough to be ahead of most of the category, and (b) marque/model-specific content (if DPM has particular specialisms) will do more SEO work than location pages will.

## 5. Enquiry mechanics

**Form-first, minimal fields (the dominant pattern — name/email/phone/message, no car details):**

- West Riding: `Your Name (required)`, `Your Email (required)`, `Your Tel`, `Subject`, `Your Message`
- Aston Engineering: `Name*`, `Telephone*`, `Email*`, `Comments`, `Url` (honeypot)
- Classic Car Lab: `Name`, `Email`, `Telephone No.`, `Your Message`
- SLSHOP: `First Name (required)`, `Last Name (required)`, `Your Email (required)`, `Your Message` — the site's own copy explicitly states car details are **not** required
- Vantage Motorworks: `First Name*`, `Last Name*`, `Email*`, `Phone*`, `Message*` + captcha
- Manns Restoration: `Name*`, `Email*`, `Phone #*`, `Subject*`, `Message*`, "Send a copy to yourself" checkbox, captcha

**Form-first with routing/segmentation (more structured):**

- DK Engineering: `First name`, `Last name`, `Your email address`, `Your telephone number` (country-code dropdown), `Enquiry Type` (dropdown: Sales / Parts / Storage / Workshop-Servicing / General), `Your Address – For sending physical literature brochures` (optional), `Your enquiry`
- Arkonik: `Select a topic...` (dropdown) → `First name` → `Last name` → `Email address` → `Telephone number` → `Country` → `Your message` → newsletter opt-in checkbox
- Twisted Automotive: `Name` → `LAST NAME` → `Phone` → `Email` → `Your location` → `Interested in?` (product/model dropdown) → `Message`
- MPI's dedicated Restoration Form (the only car-detail-capturing form found in the whole sweep): `Name`, `Email`, `Phone`, `Address`, `City`, `State`, `Zip Code`, `Make`, `Model`, `Year`, `Any other comments or information?` — none marked required

**Phone/email-first or no digital form at all:**

- Roger Bray Restoration: standard form, plus a live WhatsApp link (wa.me/...) — the only confirmed WhatsApp channel in the sweep
- GTO Engineering, Restorations Limited, Stew Jones Restoration: **no contact form exists** — phone and email only
- Alfa Workshop: no form; static contact details with an explicit instruction not to phone if you've already emailed

**Key finding:** across all 30 sites, essentially none require vehicle make/model/registration/condition in the general enquiry form, and none offer a "book a workshop visit" calendar or structured callback-request feature. Only MPI's specialised Restoration Form asks for car details, and even there it's optional. WhatsApp appears exactly once (Roger Bray). A structured "tell us about your car" field or a visit-booking option would be genuinely uncommon in this category — a real, low-risk differentiation opportunity for DPM.

---

## 6. Gap list for DPM — ranked

DPM's current plan: homepage (lot index + workshop teaser + quotes + enquiries), a workshop/what-we-do page, a contact/enquiry page, and per-car lot pages (identity block, owner quote, itemised scope, stage log, named craftspeople, photos, concours entries).

1. **Progress reporting to owners during a build.** The single most consistently flagged white space across all five research passes — genuinely rare even among the best-resourced competitors (only arkonik.com has a true client portal; richardsofengland.com's public per-chassis blog is the next-best workaround). DPM's lot pages already plan a "stage log with durations," which is most of the raw material — the gap is making that log a _living_, dated thing updated during the build (even just a simple dated-entries block per lot) rather than a static after-the-fact summary. High leverage: solves owner anxiety, differentiates from the category, and produces free SEO content simultaneously.
2. **The commissioning process explained.** Present on only ~7/30 sites, but the strongest example (restorationsltd.com) is the best single-page proof that clients respond to candour about tiers, timelines and billing philosophy without needing a published rate card. DPM's plan has no page covering how to engage, how estimating/deposits work, or what to expect — the workshop page could be reframed or extended to cover this, since a first-time client for a bespoke concours job has no way to know what "getting started" looks like.
3. **A cumulative awards/concours-results and team page.** DPM's lot pages plan per-car concours entries and named craftspeople, but there's no page rolling those up at company level. 12/30 sites have a dedicated awards page (mpi-ferrari.com's chassis-numbered version is the standard to beat) and the strongest team pages (richardsofengland.com, dkeng.co.uk) treat staff bios as a first-class page, not an inline mention on a lot page.
4. **FAQ / pre-sales objection-handling content.** Rare in the UK sample but effective where present (vintagecarworks.com, stevesautorestorations.com) — a low-cost page answering "how long does it take," "what does it cost," "do you sell cars," "where are you," that isn't accounted for anywhere in DPM's current plan.
5. **Basic location/directions hygiene.** Almost absent across the category (only 2/30 embed a live map) so it isn't a competitive disadvantage today, but it's also not covered anywhere in DPM's plan and costs little to add — an embedded map, clear directions, and a complete Google Business Profile would put DPM ahead of most of the category for near-zero effort.
6. **Newsletter signup.** Present on ~10/30, absent from DPM's plan, cheap to add and captures interest from visitors not ready to enquire.
7. **Video.** Present on ~11/30 and specifically praised where done well (documentary-style heritage storytelling at stevesautorestorations.com, branded video at dkeng.co.uk). DPM's plan specifies "many photographs" but doesn't mention video — worth a deliberate decision either way rather than a default omission.
8. **Insurance/accident repair and certifications, if in scope.** Given the "Autobody" name, it's worth explicitly confirming with the client whether accident/insurance-referral work is part of the business — if so, hiltonandmoss.com's dedicated Bodyshop content line and classiccarlab.com's treatment of accident repair as a co-equal service are the only two examples in the whole sweep and represent genuine white space (only 3/30 sites do this at all). If it's not in scope, this is a non-issue, not a gap.
9. **A structured enquiry form that asks for car details.** Only one form in 30 sites (MPI's Restoration Form) asks for make/model/year, and even that is optional. DPM's planned contact/enquiry page could differentiate cheaply by asking for basic vehicle details up front — genuinely rare in this category rather than assumed practice.

**Explicitly not gaps** — absent or near-absent across the whole 30-site sweep, so DPM's plan is not conspicuously behind by omitting them: pricing/hourly rate cards (4/30, and none publish true bespoke-restoration rates), podcasts (0/30), multi-language (0/30), sustainability content (0/30), client-login portals as a general feature (6/30, mostly e-commerce accounts, not build-progress), parts sales (12/30, and mostly for shops that also retail parts as a product line — not relevant unless DPM plans to sell parts), cars-for-sale/inventory (19/30, but this is a different business model — a dealer/broker function — and shouldn't be assumed as required unless DPM actually wants to run a sales operation), and location+service SEO landing pages (essentially 0/30 do this well; marque/model specificity is the pattern competitors actually use). **Editor's note, 2026-09-04:** location pages were originally listed here as "not a gap". That inference does not hold — competitor absence is evidence about competitors, not about search demand, and unoccupied ground may simply be unoccupied. Treat location pages as an **open question** pending keyword volumes or a live test, not as something to avoid.
