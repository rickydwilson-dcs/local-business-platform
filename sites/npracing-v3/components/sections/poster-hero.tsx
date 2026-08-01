import Image from 'next/image';
import type { BrandFrontmatter } from '@/lib/brand';
import { getImageUrl } from '@/lib/image';
import { CtaButton } from '@/components/ui/cta-button';
import { Eyebrow } from '@/components/ui/section-tag';

/**
 * PosterHero — the "Number 51" hero.
 *
 * The oversized race numeral is the principal visual structure of the poster,
 * but it is purely decorative: it is `aria-hidden`, unselectable, and sits
 * behind the copy. The accessible page heading is the real <h1> below it, so
 * heading order is h1 -> h2 -> h3 down the page regardless of the type scale.
 */
export interface PosterHeroProps {
  brand: BrandFrontmatter;
  /** Small kicker above the headline, e.g. "Taunton, Somerset · Est. 2004". */
  eyebrow: string;
  /** Caption chip over the hero photograph, e.g. "#51 · Knockhill". */
  photoTag: string;
}

export function PosterHero({ brand, eyebrow, photoTag }: PosterHeroProps) {
  const headline = brand.heroHeadline ?? `${brand.teamName}.`;
  const headlineAccent = brand.heroHeadlineAccent ?? brand.tagline;
  const intro =
    brand.heroIntro ??
    `${brand.teamName} runs #${brand.raceNumber} ${brand.riderName} in the ${brand.championship}.`;

  return (
    <section className="relative overflow-hidden pt-6" aria-labelledby="hero-heading">
      <div className="mx-auto grid w-full max-w-[80rem] items-stretch border-b-[3px] border-brand-primary px-6 lg:grid-cols-2 lg:px-6">
        <div className="relative flex min-h-[24rem] flex-col justify-center py-8 lg:min-h-[34rem] lg:pr-12">
          <span
            aria-hidden="true"
            className="numeral-outline pointer-events-none absolute -left-5 -top-8 z-0 hidden select-none font-heading text-[min(22rem,26vw)] leading-[0.75] lg:block"
          >
            {brand.raceNumber}
          </span>

          <div className="relative z-10">
            <Eyebrow>{eyebrow}</Eyebrow>

            <h1 id="hero-heading" className="mt-5 text-h1 uppercase text-surface-foreground">
              {headline}
              <br />
              <span className="highlight-clone bg-brand-primary px-[0.15em] text-on-brand-primary">
                {headlineAccent}
              </span>
            </h1>

            <p className="mt-4 max-w-[36ch] text-body text-surface-secondary">{intro}</p>

            <div className="mt-6 flex flex-wrap gap-3.5">
              <CtaButton href="/#team">Meet the team</CtaButton>
              <CtaButton href="/#gallery" variant="ghost">
                Gallery
              </CtaButton>
            </div>
          </div>
        </div>

        <div className="relative min-h-[22rem] border-t-[3px] border-brand-primary lg:min-h-0 lg:border-l-[3px] lg:border-t-0">
          <Image
            src={getImageUrl('npracing-v3/team/action-lean.jpg')}
            alt={`${brand.riderName} leant into a corner on the ${brand.teamName} Honda Fireblade`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover contrast-[1.08] grayscale-[0.15]"
            priority
          />
          <span className="absolute bottom-4 left-4 z-10 border-2 border-brand-primary bg-surface-background px-4 py-2 font-heading text-2xl uppercase tracking-[0.05em] text-surface-foreground">
            {photoTag}
          </span>
        </div>
      </div>
    </section>
  );
}
