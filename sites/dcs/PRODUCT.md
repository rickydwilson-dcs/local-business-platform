# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing codebase: Next.js 16 + React 19 + Tailwind 3.4, MDX content, theme tokens, deployed on
Vercel from the `local-business-platform` monorepo. No animation library is currently installed.

Current deliverable is a **self-contained standalone HTML prototype** under
`output/sessions/`, chosen by Ricky over building directly in `sites/dcs`. The winning
direction gets ported to React afterwards. Prototypes must therefore avoid anything that
cannot survive that port (no build step, no CDN scripts, no proprietary scroll engine).

## Users

**Small owner-run businesses across every sector** — typically 1–20 people, where the owner makes
the decision and pays the invoice. Retail and eCommerce; studios and practitioners (yoga, tuition,
therapy, coaching, salons); professional and property services; creative and B2B; and trades and
contractors.

Trades are a large and valued slice of the client base, **not the definition of it**. The real
portfolio spans fabrics, made-to-order goods, tuition, yoga, signage, automotive, property and
scaffolding. Positioning that leads with trades understates the business and narrows the audience.
Confirmed 2026-08-21: lead broad. `site.config.ts` still carries the stale trades-only tagline
("Websites that get local tradespeople more jobs") and needs updating at port time.

They are time-poor — running the business is the job. Not technical, and have no wish to become
technical. They have no site, or one they are quietly embarrassed by, and have been putting it off
for years. Price-conscious but will pay properly for something that works and is looked after.
They want to look as credible online as they know they are in person.

## Product Purpose

DCS designs, builds, hosts and manages websites for small businesses. Founded 2019, based in
Polegate, East Sussex, working UK-wide. Run by one person: Ricky Wilson.

Success is the visitor requesting a quote. The homepage is the studio's own shop window, and the
design _is_ the product: if the page looks ordinary, the central claim is unsupportable however
well written.

## Positioning

**Work that competes with London and New York agencies, for a fraction of the cost and a tiny
fraction of the client's effort.** All three parts matter — the work is genuinely comparable to a
big-city studio's, not "good for a small operation"; the price is a fraction; and the client does
almost nothing.

Most agencies expect a client to arrive with a brief, copy, images and a clear idea of what they
want. DCS does not. It asks the right questions, writes the content, makes the design decisions,
builds it, hosts it, and keeps it running.

Differentiators, strongest first:

1. You're hiring a person, not a company. Nothing outsourced, nothing offshored.
2. Agency-quality output — professional design, well-written copy, fast and secure builds.
3. Low effort for the client; everything extracted through conversation, not a brief.
4. Content handled. Clients don't need to know what to say.
5. No CMS, no login, no dashboard to learn.
6. All-in pricing covering hosting, security, updates and support.
7. A managed service and an ongoing relationship, not a hand-off.

Two constraints on expressing it: never invent a competitor's prices to dramatise the comparison
(no sourced figure exists, and a fabricated one is a false claim), and never lead with the
smallness — being small is what makes it personal and affordable, not an excuse for the work.

## Operating Context

The visitor arrives cold, usually from search or a referral, often on a phone, and is deciding
whether this person is credible enough to contact. They are comparing against both cheap DIY
builders and unaffordable agencies. They will not read a brochure; they will scan, form an
impression in seconds, and either act or leave.

**Motion is product demonstration, not decoration.** Established 2026-08-21 after round 7 shipped
twelve static prototypes and was rejected. Ricky, verbatim: _"animation and movement shows tech
craft and expertise (to the simple tradesperson they think wow) and for those who just like pretty
things it scratches that itch."_ For this product the page's own behaviour is the primary evidence
that DCS can build things. Treating motion as a risk to be minimised defeats the purpose of the
surface.

## Capabilities and Constraints

Sells: website design · local SEO · ongoing management · Google Workspace email · eCommerce ·
analytics and reporting.

Pricing — three tiers, two ways to pay for each. Revised 2026-08-21 (previously £995 / £1,995 /
£3,495 with £15 / £25 / £50 monthly):

| Tier         | Pay upfront     | Pay monthly |
| ------------ | --------------- | ----------- |
| Starter      | £750 + £10/mo   | £45/mo      |
| Professional | £1,495 + £15/mo | £85/mo      |
| Growth       | £2,995 + £25/mo | £150/mo     |

Pay-monthly carries a **24-month minimum**, then rolls monthly. Tiers differ on ongoing service
level, not build quality.

**Pay-monthly is the preferred route.** Confirmed by Ricky 2026-08-21: in practice clients do not
stop paying at the end of the 24-month minimum — most current pay-monthly clients simply continue.
The minimum term is a floor, not an expected end date, so monthly is worth more over a client's life
than the upfront equivalent.

That makes the near-parity at the top tier deliberate rather than a leak. Over the 24-month minimum
alone, upfront is nominally cheaper on all three (Starter £990 vs £1,080; Professional £1,855 vs
£2,040; Growth £3,595 vs £3,600) — but that comparison stops at the point the relationship usually
keeps going.

Design consequence, applied: the homepage pricing defaults to **Pay monthly**, with upfront as the
second option, so the preferred route leads rather than sitting behind a click.

Do not turn the retention observation into a public claim ("most clients stay for years") on any
page — it is an internal fact about the client base, not a verified marketing statistic.

**Ownership, confirmed 2026-08-21:** clients who pay upfront own the site outright **immediately**,
not after any term. Pay-monthly clients own all their content, and the hosting arrangement transfers
to them if they cancel after the minimum term. `app/pricing/page.tsx` previously claimed ownership
passed "after 12 months", which contradicted its own FAQ; corrected.

Confirmed content decisions:

- Do not name Google Workspace on the homepage — "it won't mean anything to anybody."
- Detailed pricing and service mechanics belong on inner pages, not the homepage.
- Banked for inner pages and not to be reinstated on the homepage: the eleven-item "every site
  includes" list, add-ons pricing, and the email explanation (including that Google bills the
  client monthly per mailbox, which must be disclosed as a third-party cost).

Undecided / open: whether the existing palette and typefaces are locked or still open; how far
motion should be pushed before it becomes hostile.

## Brand Commitments

Name: Digital Consulting Services. Legal: Digital Consulting Services Ltd.
Phone +44 7395 063764 · mail@digitalconsultingservices.co.uk ·
Unit H3, Chaucer Business Park, Dittons Road, Polegate, East Sussex, BN26 6QH.

**Voice** — plain-spoken, no jargon, no agency-speak. Confident, not apologetic. Personal: "I" is
often better than "we". Reassuring, honest, warm but composed. **Elevated, not matey** — closer to
a good architecture or brand studio than to a contractor. The reader should feel they are dealing
with someone whose taste they can borrow.

Never: "synergy", "bespoke solutions", "leveraging", "transform your business", "in today's digital
landscape". Avoid trade slang as decoration. Never mention the tech stack.

**Logo:** use `logo_black_vector_cropped.svg` or the derived `public/dcs-mark.svg`. The other logo
files are rasters inside SVG wrappers and are not the source of truth.

Ricky is happy with **Schibsted Grotesk** for headings and said so directly. DM Mono is confirmed
for labels and figures but **two agents independently found it unusable for body prose at 390px**
(~36 characters at full width against a ~35 floor), and it renders `£1,995` as `£1 , 995` because
a monospaced face gives the comma a full character cell. Body prose sets in the grotesk.

## Evidence on Hand

Twenty-plus sites delivered since 2019, across sectors. Cuddle Plush Fabrics (eCommerce) has been a
been a client since 2014 — twelve years and counting (corrected 2026-08-21; the
project MDX and several places still say “five years” and are stale). Their store now runs
**automated product loading pulled from their wholesalers' own websites**, plus **backorder
handling** — confirmed 2026-08-21 and recorded nowhere else in the repo. This is the strongest
single piece of technical evidence DCS has: bespoke workflow engineering rather than a plugin, and
the clearest counter to “this is just another small web shop”. Luna Landings runs made-to-order eCommerce with a product configurator.
Sanctuary Ida takes yoga bookings and payments online. Nicola Noble Tuition moved classes online
during Covid instead of closing. Mad Graphics (signage and print) was a full rebuild. DCH
Automotive went live from a standing start. Colossus Scaffolding took its first Google enquiry
within three weeks. Also DJ Fox Electrical and Bexhill Removals.

Three testimonials exist in `content/testimonials/`: Mark H. (electrician, Brighton), Sarah T.
(plumber, Eastbourne), Dave C. (scaffolding contractor, Lewes) — **all three are trades**. The
earlier session record claimed they were all non-trade; that was wrong, checked against the files
2026-08-21. Non-trade proof therefore exists only as project work, not as quotable testimony.

Generated imagery and video: 42 assets at
`output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/assets/`, mirrored to R2. Use
the `web/` JPEG variants, never the root PNGs — an SVG filter on a root PNG froze the renderer for
45 seconds.

**Absences that must never be fabricated:**

- No photograph of Ricky exists. No image may be presented as him, as "our team", or as the person
  who builds your site.
- Generated imagery may never be captioned as a real named client's premises, van, job or team.
- No sourced figure exists for competitor pricing. Do not invent one.
- No awards, accreditations, review counts or star ratings have been established. Do not author
  them as proof.

## Product Principles

1. **The page is the argument.** The claim is London-studio quality; only the artifact can prove
   it. Ordinary design falsifies the pitch.
2. **Motion is evidence, not ornament.** It demonstrates the capability being sold. Minimising it
   is a strategic error, not a safe default.
3. **Never fabricate proof.** No invented figures, no stock person standing in for Ricky, no
   generated image captioned as a real client's premises.
4. **Elevated, never matey.** Restraint, real typographic craft, detail that rewards a second look.
5. **The client does almost nothing.** Every claim about effort must stay true of the actual
   service.

## Accessibility & Inclusion

Content must be readable and complete with JavaScript disabled — a floor, not a goal. Never author
`opacity: 0` as a resting state; never gate above-the-fold content on script. Motion wraps in
`@media (prefers-reduced-motion: no-preference)` with the un-animated state being the complete one.
Mobile is a first-class design target at 390px, authored explicitly rather than reflowed.
