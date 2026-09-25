# Autcobel — source material

Everything we know for certain, before any drafted copy. Keep this file as the
ground truth to check drafted content against.

## The live site (autcobel.ltd, checked 2026-09-24)

**Correction, 2026-09-24 (later same day):** the original note here — "the
nav is non-functional, every link has an empty `href`, nothing behind it
actually exists yet" — was wrong. A raw DOM check of the `href` attribute
found empty strings, but the nav links are wired up via JS (they set
`location.hash` on click and the page scrolls to an in-page section) rather
than through a real `href`. Clicking "Our Services", "Who We Are", "Our
Approach", "Sectors We Serve" and "Contact Us" each land on a real,
detailed section — this is a single-page site with genuine content behind
every nav item, not a shell. Confirmed by clicking through in a real
browser and by loading each `#hash` URL directly. See below for what each
section actually contains — this had material consequences: the site has
**six** services, not three, and a real phone/email were sitting in the
Contact section the whole time (see `CONTENT-STATUS.md`).

Full text content of the homepage, verbatim:

> AUTCOBEL — Coldchain Electrical & Data Solutions
> Speak with our team
> Driving Innovation. Inspiring Performance.
> We deliver end-to-end electrical and data project solutions for the UK's
> most demanding environments — from supermarkets to warehouses.
>
> Turnkey Electrical & Data — End-to-end project services
> Project & Design Management — Consultation & Collaboration
> Temporary Plant Systems — Client Tailored Solutions
>
> What We Deliver
> Coldchain Expertise and Solutions — Decades of Industry knowledge
> Projects Delivered — 50+
> Combined years experience — 30+
> Nationwide Delivery — 24/7 Project Support
> View Our Services
>
> Trusted nationwide across
> Whether supporting supermarket fit-outs or maintaining live logistics
> hubs — we deliver with speed, precision, and 24/7 reliability.
>
> Copyright © 2025 Autcobel Ltd - All Rights Reserved
> Retail rollouts • Cold chain • Commercial • Facilities

Note the phrase pairing is ambiguous ("Project & Design Management —
Consultation & Collaboration" and "Temporary Plant Systems — Client Tailored
Solutions") — read as four distinct pillars: Turnkey Electrical & Data,
Project & Design Management, Temporary Plant Systems, Consultation &
Collaboration, with "End-to-end project services" and "Client Tailored
Solutions" as sub-lines rather than a fifth/sixth pillar.

### `#our-services` section, verbatim

> Our Services
> Specialist delivery across electrical, data, control, and temporary systems.
>
> At Autcobel, we offer end-to-end project services across critical
> infrastructure environments — from retail rollouts to industrial
> upgrades. Whether you're designing a system from the ground up or need
> fast, compliant support during a live upgrade, we're ready to deliver.
>
> **Design & Feasibility Consultancy** — Upfront technical guidance,
> feasibility studies, and specification support for new builds, upgrades,
> and ESG-aligned retrofits — helping clients plan for compliance,
> performance, and a smooth Net Zero transition.
>
> **Project Management & Delivery Support** — From principal contractor
> assistance to embedded site coordination, we provide full-lifecycle
> project delivery — whether as a lead partner or white-labelled support
> integrated within your team.
>
> **Electrical & Data Installations** — End-to-end electrical and data
> infrastructure solutions for cold chain, retail, and commercial
> environments — delivered with precision and installed to the highest
> industry and compliance standards.
>
> **Control & Monitoring Systems** — Specialist design and integration of
> control panels, remote monitoring technologies, and smart automation
> systems for refrigeration, HVAC, and energy management — enabling
> real-time insights and efficient performance.
>
> **Gas Leak Detection Systems** — Supply and installation of robust
> detection and alert systems for high-risk environments — delivered with
> certified partners and fully compliant with F-Gas regulations and
> industry best practice.
>
> **Temporary Plant Systems & Power** — Rapid-deployment plant hire and
> temporary power solutions — fully tested, certified, and scalable to
> suit short-term outages, phased rollouts, or emergency works in live
> environments.
>
> Need Something Bespoke? We thrive on solving complex project needs. From
> multi-site rollouts to one-off tech integrations — if it needs precision
> and speed, we're in. Request a tailored project quote.

This is the real 6-service list. The 3 services on the homepage teaser
(Turnkey Electrical & Data, Project & Design Management, Temporary Plant
Systems) are a subset — the prototype originally only built pages for
these 3; `Design & Feasibility Consultancy`, `Control & Monitoring
Systems` and `Gas Leak Detection Systems` were added 2026-09-24 to close
the gap. The prototype kept its existing 3 service page names as drafted
rather than renaming to the live site's exact wording (e.g. "Electrical &
Data Installations") — a deliberate choice, not an oversight.

### `#who-we-are` section, verbatim

> At Autcobel, we blend the agility of a contractor with the foresight of a
> client — a unique perspective that helps us anticipate challenges,
> streamline delivery, and consistently exceed expectations. We're more
> than just a service provider — we're a trusted partner in delivery.
> Whether it's a national retail rollout, a critical refrigeration
> upgrade, or a complex commercial build, our work is driven by deep
> industry insight, hands-on execution, and a commitment to quality.
>
> Autcobel is a specialist project delivery partner with deep roots in the
> UK's cold chain, retail, and commercial infrastructure sectors. We bring
> decades of combined experience across electrical & data systems, control
> and monitoring technologies, gas leak detection, plant commissioning,
> feasibility and design, consultancy, and project management.
>
> Delivery Specialists. Experts in cold chain and critical infrastructure.
> Accustomed to fast-paced, high-demand environments, our expert
> engineering team ensures minimal downtime and disruption for live
> operational sites.
>
> Our strength: We deliver tailored, compliance-led solutions for
> technically demanding environments — helping clients achieve their goals
> with precision, speed, and confidence.
>
> Our Ethos: Let's build something better together.
>
> "The foundation of every successful project is trust — the rest is
> execution."

Richer than the prototype's current Who We Are draft — not incorporated
this session (out of scope for the services request that triggered this
correction), flagged for a future pass.

### `#our-approach` section, verbatim

> How We Work. Our Approach. At Autcobel, our approach is built on one
> core principle: do it right, do it once, and do it with purpose. Whether
> it's a critical refrigeration upgrade or a nationwide rollout, we're
> more than just a supplier — we're a trusted partner, from concept to
> commissioning.
>
> Delivery without compromise. Collaboration without friction.
>
> Fast, Flexible, Focused — We adapt fast to real-world pressures —
> without ever sacrificing precision or compliance.
>
> Collaborative from Day One — We integrate early, work closely with
> clients and contractors, and take ownership of outcomes — not just
> tasks.
>
> Compliance-Led Thinking — Every project is underpinned by current
> regulations, industry best practice, and safety-first delivery.
>
> Net-Zero Mindset — Sustainability is more than a buzzword — it's a
> responsibility we take seriously.
>
> End-to-End Clarity — We plan with precision, communicate clearly, and
> deliver with accountability.
>
> "Great delivery isn't just about getting it done — it's about how you
> get it done."

Not incorporated into the prototype's Our Approach page this session —
flagged for a future pass, same as Who We Are above.

### `#contact-us` section, verbatim

> Let's Start a Conversation. Whether you're planning an upgrade, rolling
> out a new site, or need support in a live environment — our team is
> ready to help.
>
> info@autcobel.ltd
> 020 3051 4331
> Hours: Mon–Fri, 08:00–17:00
> All enquiries are reviewed by our senior team. We'll respond within 24
> hours.
> Need to share documents or specifications? Please email them directly
> to: projects@autcobel.com

This closed CONTENT-STATUS.md's outstanding phone/email item — pulled into
the prototype's Contact Us page and legal pages 2026-09-24.

## Companies House (checked 2026-09-24)

- **AUTCOBEL LTD**, company no. **14044405**
- Incorporated **13 April 2022** — status **Active**
- Registered office: Victoria House Stanbridge Park, Staplefield Lane,
  Staplefield, West Sussex, RH17 6AS
- SIC codes: **62090** (other IT service activities), **71122**
  (engineering-related scientific/technical consulting) — matches the
  "electrical and data" dual positioning
- Accounts have been filed since incorporation — this is a trading business,
  not a pre-trade shell
- No director/officer names surfaced in the search

We have **no** evidence of: founder names, team size, named clients,
accreditations/certifications (NICEIC, CHAS, SafeContractor, ISO, F-Gas
etc.), specific past projects, or a company history/backstory beyond the
incorporation date above.

## Competitor scan

- **Synecore** (rebranding as Turnpower) — retail M&E contractor: HVAC,
  electrical, refrigeration, data, blue-chip retail/hospitality clients,
  24/7, compliance-led maintenance packages.
  https://www.synecore.co.uk/sectors/retail/
- **KDM Group** — general contracting + fit-out, nationwide + Europe,
  nav shape: Who We Are → What We Do → Sectors → Projects → News → Contact.
  Near-identical skeleton to Autcobel's placeholder nav, which is a good
  signal that structure is conventional for this trade, not something to
  reinvent. https://kdmgroup.co.uk/me-services/

## Company/agent context

Client contact: **Gene**. Trusts the agency to lead on content — happy for us
to write everything, will flag anything "egregiously wrong" rather than
review line by line. Comms to him should be short, bulleted, plain words
(ADHD-friendly) — see `CONTENT-STATUS.md` for the format this drives.
