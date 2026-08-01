import type { ReactElement, ReactNode } from 'react';
import Image from 'next/image';
import type { BrandContent } from '@/lib/schemas/brand';
import { Eyebrow } from '@/components/sections/eyebrow';
import { ArrowButton, ArrowTextLink } from '@/components/sections/arrow-link';
import { StatStrip } from '@/components/sections/stat-strip';
import { MarqueeRibbon } from '@/components/sections/marquee-ribbon';
import { ValueCard } from '@/components/sections/value-card';

/**
 * HomePage — the "Grid Box" homepage.
 *
 * Every factual claim (team name, tagline, championship, race number, rider,
 * founding year) comes from content/brand/npracing.mdx; the team story is the
 * rendered MDX body of that same file rather than prose duplicated here. The
 * four value cards are short marketing copy, consistent with — but not
 * restating — the claims in brand.mdx.
 */

/**
 * PROVISIONAL IMAGERY.
 *
 * The real photographs exist but have not been uploaded to Cloudflare R2 yet
 * (no R2 credentials in this environment — see Phase 4). Until they are, these
 * render as themed placeholders, the same pattern already used for the merch
 * and logo images. Local `output/briefs/...` paths are deliberately NOT
 * referenced: they sit outside the site's public/ directory and outside the R2
 * pipeline, and would render as a broken placeholder anyway.
 *
 * Real files awaiting upload to `npracing-v1/photos/`:
 *   action-lean.jpg   <- output/briefs/npracing/images/c479e3e3-c083-44d1-81df-713b751f44f9.JPG
 *   action-chase.jpg  <- output/briefs/npracing/images/5c324105-83c6-45b4-a8af-4b14a79da594.JPG
 *   paddock-team.jpg  <- output/briefs/npracing/images/IMG_2435.JPG
 */
const PHOTO = {
  actionLean: 'https://placehold.co/1600x900/0a0a0a/E11024?text=NPRacing+Action+Shot',
  actionChase: 'https://placehold.co/1200x900/0a0a0a/E11024?text=NPRacing+On+Track',
  paddockTeam: 'https://placehold.co/1000x1250/0a0a0a/E11024?text=NPRacing+Paddock',
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
  /** Rendered MDX body of content/brand/npracing.mdx — the team story. */
  brandBody: ReactElement;
  /** JSON-LD <script> nodes supplied by the route. */
  schemaNodes?: ReactNode;
}

export function HomePage({ brand, brandBody, schemaNodes }: HomePageProps) {
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
          {brand.foundedYear && <Eyebrow>Est. {brand.foundedYear}</Eyebrow>}
          <h1 className="mt-4 max-w-[16ch] text-hero uppercase italic text-surface-foreground">
            {brand.tagline}
          </h1>
          <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-surface-secondary-foreground">
            Professionally prepared Honda Fireblades, a close-knit crew, and two decades in the
            British Superbike paddock.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ArrowButton href="#team">Meet the team</ArrowButton>
            <ArrowButton href="/merch" variant="secondary">
              Shop the range
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
            <div className="prose-grid-box mt-6">{brandBody}</div>
            <ArrowTextLink href="#rider" className="mt-6">
              Meet the 2026 rider
            </ArrowTextLink>
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
              {brand.riderName} returned to the British Superbike grid with {brand.teamName} from
              the Knockhill round in June 2026, riding the team&rsquo;s Honda Fireblade under race
              number {brand.raceNumber}.
            </p>
            <span className="chip-brand mt-6 inline-block w-fit rounded-full border border-brand-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-accent">
              {brand.championship}
            </span>
            <ArrowTextLink href="/news" className="mt-6">
              Latest team news
            </ArrowTextLink>
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <section id="gallery" className="scroll-mt-28 py-20 md:py-24">
        <div className="container-grid">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-[14ch] text-h2 uppercase text-surface-foreground">
              From the paddock to the podium.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
            <Image
              src={PHOTO.actionLean}
              alt={`${brand.riderName} leant into a corner`}
              width={1600}
              height={900}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/3] w-full rounded-lg border border-surface-card-border object-cover lg:row-span-2 lg:aspect-auto lg:h-full"
            />
            <div className="grid gap-4">
              <Image
                src={PHOTO.actionChase}
                alt={`${brand.teamName} Honda Fireblade chasing on track`}
                width={1200}
                height={900}
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
                src={PHOTO.paddockTeam}
                alt={`${brand.teamName} team photo`}
                width={1000}
                height={1250}
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="aspect-[4/3] w-full rounded-lg border border-surface-card-border object-cover"
              />
              <Image
                src={PHOTO.actionLean}
                alt={`${brand.teamName} Honda Fireblade on track`}
                width={1600}
                height={900}
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
          <div className="relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-card bg-brand-primary p-10 md:p-14">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10"
              aria-hidden="true"
            />
            <h2 className="relative z-10 max-w-[16ch] text-h2 uppercase text-on-brand-primary">
              Team merchandise — shop the full range.
            </h2>
            <div className="relative z-10">
              <ArrowButton href="/merch" variant="on-brand">
                Shop the range
              </ArrowButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
