import Image from 'next/image';
import { getImageUrl } from '@/lib/image';
import { SectionTag } from '@/components/ui/section-tag';

/**
 * RiderPoster — full-width rider photograph with the race numeral stamped into
 * the bottom-right corner and an info panel bottom-left.
 *
 * The numeral is decorative (aria-hidden); the rider's name is carried by the
 * real headings.
 */
export interface RiderPosterProps {
  raceNumber: string;
  riderName: string;
  /** Factual note about the rider's season — sourced from site config. */
  riderNote: string;
  season: string;
}

export function RiderPoster({ raceNumber, riderName, riderNote, season }: RiderPosterProps) {
  return (
    <section id="rider" className="border-b border-surface-card-border py-24">
      <div className="mx-auto w-full max-w-[80rem] px-6">
        <SectionTag>{season} rider</SectionTag>
        <h2 className="mt-5 text-h2 uppercase text-surface-foreground">{riderName}</h2>

        <div className="relative mt-8 overflow-hidden border border-surface-card-border">
          <div className="relative h-[26rem] w-full lg:h-[34rem]">
            <Image
              src={getImageUrl('npracing-v3/team/action-chase.jpg')}
              alt={`${riderName} chasing through Knockhill on the NP Racing Honda Fireblade`}
              fill
              sizes="100vw"
              className="object-cover object-[30%_30%] grayscale-[0.1]"
            />
          </div>

          <span
            aria-hidden="true"
            className="numeral-stamp pointer-events-none absolute -bottom-14 right-4 z-10 select-none font-heading text-[min(20rem,24vw)] leading-none"
          >
            {raceNumber}
          </span>

          <div className="absolute bottom-0 left-0 z-20 max-w-[36rem] bg-overlay-dark p-8 lg:p-10">
            <h3 className="text-h3 uppercase text-surface-foreground">
              #{raceNumber} · {riderName}
            </h3>
            <p className="mt-3 max-w-[44ch] text-body text-surface-secondary">{riderNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
