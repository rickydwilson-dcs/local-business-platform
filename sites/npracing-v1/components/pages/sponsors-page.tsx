import Image from 'next/image';
import type { Sponsor } from '@/lib/sponsors';
import { PageHead } from '@/components/sections/page-head';
import { ArrowButton } from '@/components/sections/arrow-link';

/**
 * SponsorsPage — the full partner spotlight list.
 *
 * Unlike the homepage's `SponsorMarquee` (a quiet, monochrome logo strip),
 * this page gives each sponsor room: logo, bio and an outbound link to their
 * own site. Rendered from content/sponsors/*.mdx — nothing here is
 * hardcoded. Sponsors alternate logo/text sides down the page so a short
 * roster doesn't read as a repetitive card stack.
 */
export interface SponsorsPageProps {
  sponsors: Sponsor[];
}

export function SponsorsPage({ sponsors }: SponsorsPageProps) {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <PageHead
        eyebrow="Partners"
        title="Backed by the best in the paddock."
        lede="NP Racing doesn't get to the grid alone. Here's who's behind the team, on and off the track."
      />

      {sponsors.length === 0 ? (
        <section className="container-grid py-16">
          <p className="text-surface-secondary-foreground">No sponsors are listed yet.</p>
        </section>
      ) : (
        <div className="divide-y divide-surface-card-border">
          {sponsors.map((sponsor, index) => {
            const reversed = index % 2 === 1;

            return (
              <section key={sponsor.slug} className="container-grid py-16">
                <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
                  <div className={reversed ? 'md:order-2' : undefined}>
                    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-card border border-surface-card-border bg-surface-card p-10 sm:p-14">
                      <Image
                        src={sponsor.logo.src}
                        alt={sponsor.logo.alt}
                        width={sponsor.logo.width}
                        height={sponsor.logo.height}
                        sizes="(min-width: 768px) 40vw, 90vw"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>

                  <div className={reversed ? 'md:order-1' : undefined}>
                    <h2 className="text-h2 uppercase italic text-surface-foreground">
                      {sponsor.name}
                    </h2>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-brand-accent">
                      {sponsor.tagline}
                    </p>
                    <div className="mt-5 space-y-4">
                      {sponsor.bio.map((paragraph, paragraphIndex) => (
                        <p
                          key={paragraphIndex}
                          className="leading-relaxed text-surface-secondary-foreground"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <div className="mt-8">
                      <ArrowButton
                        href={sponsor.websiteUrl}
                        external
                        externalLabel={`Visit ${sponsor.name}`}
                      >
                        Visit website
                      </ArrowButton>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
