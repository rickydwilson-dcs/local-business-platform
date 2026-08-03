import Image from 'next/image';
import { getImageUrl } from '@/lib/image';
import { SectionTag } from '@/components/ui/section-tag';

/**
 * SponsorMarquee — a single auto-scrolling strip of partner logos, closer to
 * a department-store brand strip than a card grid: quiet, monochrome, no
 * per-logo boxes.
 *
 * Every logo has been recoloured to solid white-on-transparent (regardless
 * of its original brand colours or background) so the whole strip reads as
 * one calm row on the dark band rather than a row of mismatched coloured
 * boxes. Reuses the `.marquee` / `.marquee-track` infrastructure from
 * globals.css: the track is rendered twice so the -50% translate loops
 * seamlessly, the animation is declared only inside
 * `@media (prefers-reduced-motion: no-preference)`, and the duplicate copy
 * is `aria-hidden` (with `tabIndex={-1}` on its links) so screen readers and
 * keyboard users only encounter each sponsor once.
 */
interface Sponsor {
  name: string;
  href: string;
  logo: string;
  width: number;
  height: number;
}

const SPONSORS: Sponsor[] = [
  {
    name: 'Berkshire Cycles',
    href: 'https://www.berkshirecycles.co.uk/',
    logo: 'npracing-v3/sponsors/berkshire-cycles-white.png',
    width: 1536,
    height: 1024,
  },
  {
    name: 'GBRacing',
    href: 'https://www.gbracing.eu/',
    logo: 'npracing-v3/sponsors/gbracing-white.png',
    width: 605,
    height: 200,
  },
  {
    name: 'HEL Performance',
    href: 'https://www.helperformance.com/',
    logo: 'npracing-v3/sponsors/hel-performance-white.svg',
    width: 510,
    height: 271,
  },
  {
    name: 'Emerson Cranes',
    href: 'https://emersoncranes.com/',
    logo: 'npracing-v3/sponsors/emerson-cranes-white.png',
    width: 1540,
    height: 384,
  },
  {
    name: 'Lowe Rental',
    href: 'https://www.lowerental.com/uk/',
    logo: 'npracing-v3/sponsors/lowe-rental-white.svg',
    width: 107,
    height: 76,
  },
  {
    name: 'GPS Photography',
    href: 'https://www.instagram.com/gps_photography1979/',
    logo: 'npracing-v3/sponsors/gps-photography-white-v2.png',
    width: 150,
    height: 150,
  },
  {
    name: 'The Clothing Kings',
    href: 'https://www.theclothingkings.co.uk/',
    logo: 'npracing-v3/sponsors/the-clothing-kings-white.png',
    width: 500,
    height: 500,
  },
];

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex items-center" aria-hidden={hidden || undefined}>
      {SPONSORS.map((sponsor, index) => (
        <li key={`${sponsor.name}-${index}`} className="flex items-center px-12">
          <a
            href={sponsor.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={hidden ? -1 : undefined}
            className="opacity-70 transition-opacity duration-normal hover:opacity-100"
          >
            <Image
              src={getImageUrl(sponsor.logo)}
              alt={sponsor.name}
              width={sponsor.width}
              height={sponsor.height}
              className="h-14 w-auto object-contain sm:h-16"
            />
            <span className="sr-only"> (opens {sponsor.name} in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SponsorMarquee() {
  return (
    <section aria-label="Team sponsors and partners" className="py-14">
      <div className="mx-auto mb-6 w-full max-w-[80rem] px-6">
        <SectionTag>Backed by</SectionTag>
      </div>
      <div className="marquee">
        <div className="marquee-track py-10">
          <Track />
          <Track hidden />
        </div>
      </div>
    </section>
  );
}
