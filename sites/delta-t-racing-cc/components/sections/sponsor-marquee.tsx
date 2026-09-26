import Image from 'next/image';
import type { Sponsor } from '@/lib/sponsors';
import { Eyebrow } from '@/components/sections/eyebrow';

/**
 * SponsorMarquee — a single auto-scrolling strip of partner logos: quiet,
 * monochrome, no per-logo boxes.
 *
 * Rendered from content/sponsors/*.mdx (the same records as /sponsors), so a
 * new sponsor appears here without touching code. Every logo is a solid
 * white-on-transparent version so the strip reads as one calm row on the
 * dark band. Reuses the `.marquee` / `.marquee-track` infrastructure from
 * globals.css: the track renders twice, the animation only runs under
 * `prefers-reduced-motion: no-preference`, and the duplicate is aria-hidden.
 */
export interface SponsorMarqueeProps {
  sponsors: Sponsor[];
}

type MarqueeSponsor = Sponsor & { repeat: boolean };

function Track({ sponsors, hidden }: { sponsors: MarqueeSponsor[]; hidden?: boolean }) {
  return (
    <ul className="flex items-center" aria-hidden={hidden || undefined}>
      {sponsors.map((sponsor) => {
        // Repeats exist only to fill the loop — hide them from assistive tech.
        const quiet = hidden || sponsor.repeat;
        const logo = (
          <Image
            src={sponsor.logo.src}
            alt={sponsor.name}
            width={sponsor.logo.width}
            height={sponsor.logo.height}
            quality={50}
            className="h-12 w-auto max-w-[14rem] object-contain sm:h-14"
          />
        );
        return (
          <li
            key={sponsor.slug}
            className="flex items-center px-12"
            aria-hidden={!hidden && sponsor.repeat ? true : undefined}
          >
            {sponsor.websiteUrl ? (
              <a
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={quiet ? -1 : undefined}
                className="opacity-70 transition-opacity duration-normal hover:opacity-100"
              >
                {logo}
                <span className="sr-only"> (opens {sponsor.name} in a new tab)</span>
              </a>
            ) : (
              <span className="opacity-70">{logo}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function SponsorMarquee({ sponsors }: SponsorMarqueeProps) {
  if (sponsors.length === 0) return null;

  // Four logos don't fill a wide screen, so the set repeats inside each track
  // to keep the loop seamless.
  const filled = sponsors.length < 6 ? [...sponsors, ...sponsors] : sponsors;
  const keyed: MarqueeSponsor[] = filled.map((s, i) => ({
    ...s,
    slug: `${s.slug}-${i}`,
    repeat: i >= sponsors.length,
  }));

  return (
    <section aria-label="Team sponsors and partners" className="py-14">
      <div className="container-grid mb-6">
        <Eyebrow>Backed by</Eyebrow>
      </div>
      <div className="marquee">
        <div className="marquee-track py-10">
          <Track sponsors={keyed} />
          <Track sponsors={keyed} hidden />
        </div>
      </div>
    </section>
  );
}
