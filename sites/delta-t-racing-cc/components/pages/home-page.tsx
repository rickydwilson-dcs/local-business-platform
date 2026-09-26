import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BrandContent } from '@/lib/schemas/brand';
import type { TeamMember } from '@/lib/team';
import type { Sponsor } from '@/lib/sponsors';
import type { Race } from '@/lib/schemas/races';
import type { NewsArticle } from '@/lib/schemas/news';
import { Eyebrow } from '@/components/sections/eyebrow';
import { ArrowButton, ArrowTextLink } from '@/components/sections/arrow-link';
import { StatStrip } from '@/components/sections/stat-strip';
import { MarqueeRibbon } from '@/components/sections/marquee-ribbon';
import { SponsorMarquee } from '@/components/sections/sponsor-marquee';
import { ValueCard } from '@/components/sections/value-card';
import { RiderCard } from '@/components/sections/rider-card';
import { SeasonCalendar } from '@/components/sections/season-calendar';
import { PhotoGallery, type GalleryItem } from '@/components/ui/photo-gallery';

/**
 * HomePage — the Grid Box homepage, carried over from npracing-v1 and
 * re-shaped for a four-rider club team.
 *
 * Every factual claim comes from content: team identity and classes from
 * content/brand/delta-t-racing-cc.mdx, riders from content/team, rounds from
 * content/races, sponsors from content/sponsors and the latest report from
 * content/news. The copy written here is short marketing text consistent
 * with the team's own About page, not new claims.
 *
 * Photography is limited to what the team published on its old site (eight
 * shots, most only 1024px wide), so there is no video and no crew/paddock imagery
 * yet — the layout drops those NPRacing sections rather than faking them.
 */

const R2_BASE = 'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/delta-t-racing-cc';

const PHOTO = {
  hero: `${R2_BASE}/riders/lance-jordan-88.jpg`,
  pack: `${R2_BASE}/photos/gene-goodrum-leading-pack.jpg`,
  jaredCorner: `${R2_BASE}/photos/jared-oakley-corner.jpg`,
  dylanCorner: `${R2_BASE}/photos/dylan-jordan-corner.jpg`,
  lancePaddock: `${R2_BASE}/photos/lance-jordan-paddock.jpg`,
} as const;

/** Short marketing copy drawn from the team's own About text. */
const VALUES = [
  {
    index: '01',
    title: 'Developing talent',
    description:
      'Riders at different stages, all learning new circuits and getting faster together.',
  },
  {
    index: '02',
    title: 'Engineering know-how',
    description:
      'Built by refrigeration engineers — bike setup, data and preparation get the same rigour as the day job.',
  },
  {
    index: '03',
    title: 'Every weekend counts',
    description: 'Each round is a chance to learn, push limits and move forward — wet or dry.',
  },
  {
    index: '04',
    title: 'Part of the paddock',
    description: 'Supporters, sponsors, friends and fellow racers — the community is the point.',
  },
] as const;

export interface HomePageProps {
  /** Validated frontmatter from content/brand/delta-t-racing-cc.mdx. */
  brand: BrandContent;
  riders: TeamMember[];
  races: Race[];
  sponsors: Sponsor[];
  /** Most recent published news article, if any. */
  latestNews?: NewsArticle;
  /** JSON-LD <script> nodes supplied by the route. */
  schemaNodes?: ReactNode;
}

export function HomePage({
  brand,
  riders,
  races,
  sponsors,
  latestNews,
  schemaNodes,
}: HomePageProps) {
  const circuits = new Set(races.map((race) => race.circuit)).size;

  const stats = [
    { value: String(riders.length), label: `Riders, ${brand.season}` },
    { value: String(brand.classes.length), label: 'Class championships' },
    { value: String(races.length), label: `${brand.championship} rounds` },
    { value: String(circuits), label: 'Iconic UK circuits' },
  ];

  const marqueeItems = [
    brand.teamName,
    `${brand.championship} ${brand.season}`,
    ...brand.classes,
    riders
      .filter((r) => r.raceNumber)
      .map((r) => `#${r.raceNumber}`)
      .join(' · '),
  ];

  const principal = riders.find((r) => /principal/i.test(r.role));

  // Six tiles fill the three-column grid evenly (the team published eight
  // photos; the two left out are already shown large on this page).
  const byName = (name: string) => riders.find((r) => r.name === name);
  const galleryItems: GalleryItem[] = [
    {
      type: 'image',
      src: PHOTO.pack,
      alt: 'Gene Goodrum, number 679, leading a group of riders through a bend',
      width: 1024,
      height: 682,
    },
    {
      type: 'image',
      src: PHOTO.jaredCorner,
      alt: 'Jared Oakley tipping into a corner, kerbs in the foreground',
      width: 1561,
      height: 1008,
    },
    ...[byName('Lance Jordan'), byName('Gene Goodrum')]
      .filter((r): r is TeamMember => Boolean(r))
      .map(
        (rider): GalleryItem => ({
          type: 'image',
          src: rider.image.src,
          alt: rider.image.alt,
          width: rider.image.width,
          height: rider.image.height,
        })
      ),
    {
      type: 'image',
      src: PHOTO.dylanCorner,
      alt: 'Dylan Jordan hanging off the bike through a bend',
      width: 1024,
      height: 682,
    },
    {
      type: 'image',
      src: PHOTO.lancePaddock,
      alt: 'Lance Jordan giving a thumbs up in the paddock',
      width: 706,
      height: 931,
    },
  ];

  return (
    <>
      {schemaNodes}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero-under-nav relative flex min-h-lvh flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={PHOTO.hero}
            alt="Lance Jordan, number 88, leaning his Kawasaki hard into a corner"
            fill
            priority
            sizes="100vw"
            quality={72}
            className="object-cover object-[60%_45%]"
          />
          <div className="hero-scrim" aria-hidden="true" />
        </div>

        <div
          className="race-plate absolute right-6 top-28 hidden h-20 w-20 text-3xl sm:grid"
          aria-hidden="true"
        >
          ΔT
        </div>

        <div className="container-grid relative z-10 pb-16 pt-40">
          <Eyebrow>
            {brand.championship} &middot; {brand.season} season
          </Eyebrow>
          <h1 className="mt-4 max-w-[16ch] text-hero uppercase italic text-surface-foreground">
            From the plant room <span className="text-brand-accent">to the grid.</span>
          </h1>
          <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-surface-secondary-foreground">
            {brand.teamName} is a {riders.length}-rider UK motorcycle racing team, founded by people
            from the refrigeration industry who share a passion for speed, precision and the thrill
            of track racing.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ArrowButton href="#riders">Meet the riders</ArrowButton>
            <ArrowButton href="#calendar" variant="secondary">
              {brand.season} calendar
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
            src={PHOTO.pack}
            alt="Gene Goodrum, number 679, leading a group of riders through a bend"
            width={1024}
            height={682}
            sizes="(min-width: 1024px) 40rem, 100vw"
            quality={65}
            className="aspect-[4/3] w-full rounded-card border border-surface-card-border object-cover"
          />

          <div>
            <Eyebrow>The team</Eyebrow>
            <h2 className="mt-4 text-h2 uppercase text-surface-foreground">
              Measured like engineers. Raced like it matters.
            </h2>
            <p className="mt-6 leading-relaxed text-surface-secondary-foreground">
              In refrigeration, <strong className="text-surface-foreground">ΔT</strong> is the
              temperature difference an engineer works to. On track it&rsquo;s the gap on the
              stopwatch. {brand.teamName} was founded by a small group of riders and motorsport
              enthusiasts from the refrigeration industry
              {principal ? (
                <>
                  {' '}
                  &mdash; led by team principal{' '}
                  <strong className="text-surface-foreground">{principal.name}</strong>, who races
                  too
                </>
              ) : null}
              .
            </p>
            <p className="mt-4 leading-relaxed text-surface-secondary-foreground">
              The team is just getting started. Every race weekend is a chance to learn, push limits
              and move forward, with the work behind the scenes going into bike setup, data and
              preparation.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <ArrowTextLink href="/about">Our story</ArrowTextLink>
              <ArrowTextLink href="#riders">Meet the riders</ArrowTextLink>
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

      {/* ── Riders ───────────────────────────────────────────────────────── */}
      <section
        id="riders"
        className="scroll-mt-28 border-y border-surface-card-border bg-surface-subtle py-20 md:py-24"
      >
        <div className="container-grid">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>The riders</Eyebrow>
              <h2 className="mt-4 max-w-[18ch] text-h2 uppercase text-surface-foreground">
                {riders.length} riders. {brand.classes.length} classes. One team.
              </h2>
            </div>
            <ArrowTextLink href="/team">All rider profiles</ArrowTextLink>
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {riders.map((rider) => (
              <li key={rider.slug}>
                <RiderCard rider={rider} />
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-surface-tertiary-foreground">
            Racing {brand.classes.join(', ').replace(/, ([^,]*)$/, ' and $1')}.
          </p>
        </div>
      </section>

      {/* ── Calendar ─────────────────────────────────────────────────────── */}
      <section id="calendar" className="scroll-mt-28 py-20 md:py-24">
        <div className="container-grid">
          <div className="mb-10 max-w-[60ch]">
            <Eyebrow>{brand.season} season</Eyebrow>
            <h2 className="mt-4 text-h2 uppercase text-surface-foreground">
              {races.length} rounds with {brand.championship}.
            </h2>
            <p className="mt-4 leading-relaxed text-surface-secondary-foreground">
              The team races primarily with Bemsee, the British Motorcycle Racing Club:{' '}
              {races.length} rounds at {circuits} of the UK&rsquo;s most iconic circuits.
            </p>
          </div>

          <SeasonCalendar races={races} />
        </div>
      </section>

      {/* ── Latest news ──────────────────────────────────────────────────── */}
      {latestNews && (
        <section aria-labelledby="latest-news-heading" className="pb-20 md:pb-24">
          <div className="container-grid">
            <article className="grid grid-cols-1 overflow-hidden rounded-card border border-surface-card-border bg-surface-card lg:grid-cols-2">
              {latestNews.heroImage && (
                <Image
                  src={latestNews.heroImage.src}
                  alt={latestNews.heroImage.alt}
                  width={latestNews.heroImage.width}
                  height={latestNews.heroImage.height}
                  sizes="(min-width: 1024px) 40rem, 100vw"
                  quality={65}
                  className="aspect-[3/2] h-full w-full object-cover"
                />
              )}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <Eyebrow>Latest from the paddock</Eyebrow>
                <h2
                  id="latest-news-heading"
                  className="mt-4 text-h3 uppercase text-surface-foreground"
                >
                  <Link
                    href={`/news/${latestNews.slug}`}
                    className="transition-colors hover:text-brand-accent"
                  >
                    {latestNews.title}
                  </Link>
                </h2>
                <p className="mt-4 leading-relaxed text-surface-secondary-foreground">
                  {latestNews.excerpt}
                </p>
                <ArrowTextLink href={`/news/${latestNews.slug}`} className="mt-6">
                  Read the report
                </ArrowTextLink>
              </div>
            </article>
          </div>
        </section>
      )}

      <SponsorMarquee sponsors={sponsors} />

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <section id="gallery" className="scroll-mt-28 py-20 md:py-24">
        <div className="container-grid">
          <div className="mb-10">
            <Eyebrow>Gallery</Eyebrow>
            <h2 className="mt-4 max-w-[16ch] text-h2 uppercase text-surface-foreground">
              Knees down, heads up.
            </h2>
          </div>

          <PhotoGallery items={galleryItems} />
        </div>
      </section>

      {/* ── Sponsorship CTA band ─────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="container-grid">
          <div className="relative flex flex-col overflow-hidden rounded-card bg-brand-primary p-8 sm:p-10 md:min-h-[22rem] md:justify-center md:p-14">
            <span
              className="pointer-events-none absolute -right-6 bottom-[-0.2em] select-none font-heading text-[14rem] font-extrabold italic leading-none text-on-brand-primary opacity-10 md:text-[20rem]"
              aria-hidden="true"
            >
              ΔT
            </span>
            <div className="relative z-10 md:max-w-[34rem]">
              <h2 className="max-w-[16ch] text-h2 uppercase text-on-brand-primary">
                Put your name on the bikes.
              </h2>
              <p className="mt-4 leading-relaxed text-on-brand-primary opacity-90">
                Our sponsors are the reason {brand.teamName} gets to the grid. If you&rsquo;d like
                to back a growing team &mdash; and the four riders behind it &mdash; we&rsquo;d love
                to hear from you.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ArrowButton href="/contact" variant="on-brand">
                  Become a sponsor
                </ArrowButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
