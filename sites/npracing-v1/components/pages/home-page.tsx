import type { ReactNode } from 'react';
import Image from 'next/image';
import type { BrandContent } from '@/lib/schemas/brand';
import { Eyebrow } from '@/components/sections/eyebrow';
import { ArrowButton, ArrowTextLink } from '@/components/sections/arrow-link';
import { StatStrip } from '@/components/sections/stat-strip';
import { MarqueeRibbon } from '@/components/sections/marquee-ribbon';
import { SponsorMarquee } from '@/components/sections/sponsor-marquee';
import { ValueCard } from '@/components/sections/value-card';

/**
 * HomePage — the "Grid Box" homepage.
 *
 * Every factual claim (team name, championship, race number, rider, founding
 * year) comes from content/brand/npracing.mdx frontmatter. The team-section
 * copy here is a condensed homepage-specific teaser, not the full MDX body —
 * the full team story renders separately on /about. Both this teaser and the
 * four value cards are short marketing copy, consistent with — but not a
 * restatement of — brand.mdx.
 */

const R2_BASE = 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev';

const PHOTO = {
  actionLean: `${R2_BASE}/npracing-v1/photos/action-lean.jpg`,
  actionChase: `${R2_BASE}/npracing-v1/photos/action-chase.jpg`,
  actionCorner: `${R2_BASE}/npracing-v1/news/brands-hatch-round-5-race-report.jpg`,
  paddockTeam: `${R2_BASE}/npracing-v1/photos/paddock-team-2026-08.jpg`,
  paddockGroup: `${R2_BASE}/npracing-v1/photos/paddock-group-2026-08.jpg`,
  helmetCloseup: `${R2_BASE}/npracing-v1/photos/helmet-2026-08.jpg`,
  actionPursuit: `${R2_BASE}/npracing-v1/photos/action-pursuit-2026-08.jpg`,
  merchCap: `${R2_BASE}/npracing-v1/merch/np-racing-curved-peak-cap.jpg`,
} as const;

/**
 * Short marketing copy — not factual claims requiring a content source, but
 * kept consistent with the team identity described in content/brand/npracing.mdx.
 */
const VALUES = [
  {
    index: '01',
    title: 'Developing riders',
    description:
      'A track record of bringing young talent onto the BSB grid and giving them a genuine shot.',
  },
  {
    index: '02',
    title: 'Pro-prepared Hondas',
    description: 'Every Fireblade is built and run to a professional standard, race after race.',
  },
  {
    index: '03',
    title: 'Family operation',
    description: 'A close-knit crew of experienced technicians — not a corporate outfit.',
  },
  {
    index: '04',
    title: 'Punching above weight',
    description: 'Consistently competitive against teams with far bigger budgets.',
  },
] as const;

export interface HomePageProps {
  /** Validated frontmatter from content/brand/npracing.mdx. */
  brand: BrandContent;
  /** JSON-LD <script> nodes supplied by the route. */
  schemaNodes?: ReactNode;
}

export function HomePage({ brand, schemaNodes }: HomePageProps) {
  const stats = [
    // Founding year is frontmatter; the 2020 step up to a full Superbike season
    // and the Honda machinery are stated in the body of content/brand/npracing.mdx.
    ...(brand.foundedYear
      ? [{ value: String(brand.foundedYear), label: 'In the BSB paddock since' }]
      : []),
    { value: '2020', label: 'First full Superbike season' },
    { value: 'Honda', label: 'Fireblade machinery' },
    { value: `#${brand.raceNumber}`, label: `${brand.riderName}, 2026` },
  ];

  const marqueeItems = [
    brand.teamName,
    brand.championship,
    `${brand.riderName} · Race number ${brand.raceNumber}`,
    'Honda Fireblade',
  ];

  return (
    <>
      {schemaNodes}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero-under-nav relative flex min-h-svh flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={PHOTO.actionLean}
            alt={`${brand.riderName} on the ${brand.teamName} Honda Fireblade`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_40%]"
          />
          <div className="hero-scrim" aria-hidden="true" />
        </div>

        <div
          className="race-plate absolute right-6 top-28 hidden h-20 w-20 text-3xl sm:grid"
          aria-hidden="true"
        >
          {brand.raceNumber}
        </div>

        <div className="container-grid relative z-10 pb-16 pt-40">
          {brand.foundedYear && (
            <Eyebrow>Taunton, Somerset &middot; Est. {brand.foundedYear}</Eyebrow>
          )}
          <h1 className="mt-4 max-w-[16ch] text-hero uppercase italic text-surface-foreground">
            Punching above our weight in{' '}
            <span className="text-brand-primary">British Superbike.</span>
          </h1>
          <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-surface-secondary-foreground">
            {brand.teamName} is an independent BSB team running professionally prepared Honda
            Fireblades &mdash; built on family values, developed riders, and two decades in the
            paddock.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ArrowButton href="#team">Meet the team</ArrowButton>
            <ArrowButton href="#gallery" variant="secondary">
              See the gallery
            </ArrowButton>
          </div>
        </div>
      </section>

      {/* ── Stat strip ───────────────────────────────────────────────────── */}
      <StatStrip items={stats} ariaLabel={`${brand.teamName} at a glance`} />

      {/* ── The team ─────────────────────────────────────────────────────── */}
      <section id="team" className="scroll-mt-28 py-20 md:py-24">
        <div className="container-grid grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <Image
            src={PHOTO.paddockTeam}
            alt={`The ${brand.teamName} crew on the grid`}
            width={1000}
            height={1250}
            sizes="(min-width: 1024px) 40rem, 100vw"
            className="aspect-[4/5] w-full rounded-card border border-surface-card-border object-cover"
          />

          <div>
            <Eyebrow>The team</Eyebrow>
            <h2 className="mt-4 text-h2 uppercase text-surface-foreground">
              Run by Neil Pearson, built by the paddock.
            </h2>
            <p className="mt-6 leading-relaxed text-surface-secondary-foreground">
              {brand.teamName} is a private British Superbike team based in{' '}
              <strong className="text-surface-foreground">Taunton, Somerset</strong>, led by{' '}
              <strong className="text-surface-foreground">Neil Pearson</strong> &mdash; founder of
              NP Motorcycles. Under his leadership the business has grown from a motorcycle
              servicing workshop into a recognised independent name on the BSB grid.
            </p>
            <p className="mt-4 leading-relaxed text-surface-secondary-foreground">
              Without the budget of factory-backed outfits like Honda Racing UK, Ducati PBM or McAMS
              Yamaha, {brand.teamName} has earned its reputation the hard way: developing young
              talent, running properly prepared machinery, and staying a close-knit, family-style
              operation with experienced technicians.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <ArrowTextLink href="#rider">Meet the 2026 rider</ArrowTextLink>
              <ArrowTextLink href="/team">Meet the full crew</ArrowTextLink>
            </div>
          </div>
        </div>

        <div className="container-grid mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <ValueCard
              key={value.index}
              index={value.index}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────────────────────── */}
      <MarqueeRibbon items={marqueeItems} ariaLabel={`${brand.teamName} highlights`} />

      {/* ── Rider spotlight ──────────────────────────────────────────────── */}
      <section
        id="rider"
        className="scroll-mt-28 border-y border-surface-card-border bg-surface-subtle"
      >
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-[1.1fr_1fr]">
          <Image
            src={PHOTO.actionChase}
            alt={`${brand.riderName} on track for ${brand.teamName}`}
            width={1200}
            height={900}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="h-full w-full object-cover"
          />

          <div className="flex flex-col justify-center px-6 py-16 lg:px-14">
            <span className="font-heading text-7xl font-extrabold italic leading-none text-brand-primary">
              {brand.raceNumber}
            </span>
            <h2 className="mt-3 text-h2 uppercase text-surface-foreground">{brand.riderName}</h2>
            {/* Condensed from the "2026 season" section of content/brand/npracing.mdx. */}
            <p className="mt-4 max-w-[42ch] leading-relaxed text-surface-secondary-foreground">
              {brand.riderName.split(' ')[0]} returned to the BSB grid with {brand.teamName} from
              the Knockhill round in June 2026, riding the team&rsquo;s Honda Fireblade. Full season
              history and results to follow as the 2026 campaign continues.
            </p>
            <span className="chip-brand mt-6 inline-block w-fit rounded-full border border-brand-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-accent">
              Joined {brand.teamName} &middot; June 2026
            </span>
            <ArrowTextLink href="/news" className="mt-6">
              Latest team news
            </ArrowTextLink>
          </div>
        </div>
      </section>

      <SponsorMarquee />

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <section id="gallery" className="scroll-mt-28 py-20 md:py-24">
        <div className="container-grid">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-[14ch] text-h2 uppercase text-surface-foreground">
              From the paddock to the podium.
            </h2>
            <ArrowTextLink href="#gallery">View full gallery</ArrowTextLink>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
            <Image
              src={PHOTO.actionCorner}
              alt={`${brand.riderName} leant hard into a corner at Brands Hatch`}
              width={1600}
              height={900}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/3] w-full rounded-lg border border-surface-card-border object-cover lg:row-span-2 lg:aspect-auto lg:h-full"
            />
            <div className="grid gap-4">
              <Image
                src={PHOTO.actionPursuit}
                alt={`${brand.riderName} pursuing another rider on the ${brand.teamName} Honda Fireblade`}
                width={2232}
                height={1488}
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="aspect-[4/3] w-full rounded-lg border border-surface-card-border object-cover"
              />
              <Image
                src={PHOTO.paddockTeam}
                alt={`${brand.teamName} crew on the grid`}
                width={1000}
                height={1250}
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="aspect-[4/3] w-full rounded-lg border border-surface-card-border object-cover"
              />
            </div>
            <div className="grid gap-4">
              <Image
                src={PHOTO.paddockGroup}
                alt={`${brand.teamName} crew celebrating in the garage`}
                width={1600}
                height={1200}
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="aspect-[4/3] w-full rounded-lg border border-surface-card-border object-cover"
              />
              <Image
                src={PHOTO.helmetCloseup}
                alt={`${brand.teamName} race helmet`}
                width={1658}
                height={1566}
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="aspect-[4/3] w-full rounded-lg border border-surface-card-border object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Merch CTA band ───────────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="container-grid">
          <div className="group relative flex flex-col overflow-hidden rounded-card bg-brand-primary p-8 sm:p-10 md:min-h-[24rem] md:flex-row md:items-center md:gap-8 md:p-14">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10"
              aria-hidden="true"
            />
            {/* Cap product shot, blended onto the red band. The source photo
                is on a pure white background, so mix-blend-multiply drops
                the white and leaves just the cap — no separate cutout asset
                needed; cropped tight to the cap's own bounding box (object-
                cover against a fixed aspect ratio) rather than the source's
                square frame, which is mostly dead product-photography
                padding. Product-forward on mobile — shown before the copy,
                since the cap is the reason this band exists. On desktop it
                switches to an absolutely-positioned, vertically-centred
                shot on the right side of the card, inset from the edges
                (not bled into the corner — that clipped the crown/brim
                against the card's overflow-hidden bounds). Straightens up
                and grows on hover — a deliberately punchy sign of life
                (bigger swing than a typical micro-interaction, on purpose,
                so it reads clearly against a big flat colour band) —
                decorative only, so it's fine that touch devices never see
                it. */}
            <Image
              src={PHOTO.merchCap}
              alt=""
              aria-hidden="true"
              width={700}
              height={700}
              sizes="(min-width: 1024px) 420px, (min-width: 768px) 340px, 280px"
              className="pointer-events-none relative z-10 order-first aspect-[3/2] w-64 self-center rotate-6 object-cover mix-blend-multiply transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:rotate-0 group-hover:scale-110 sm:w-80 md:absolute md:right-8 md:top-1/2 md:order-none md:w-80 md:-translate-y-1/2 md:self-auto lg:right-12 lg:w-[26rem]"
            />
            <div className="relative z-10 md:max-w-[26rem]">
              <h2 className="max-w-[16ch] text-h2 uppercase text-on-brand-primary">
                Team merchandise.
              </h2>
              <div className="mt-8">
                <ArrowButton href="/merch" variant="on-brand">
                  Shop the range
                </ArrowButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
