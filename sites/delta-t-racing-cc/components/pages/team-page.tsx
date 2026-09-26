import type { TeamMember } from '@/lib/team';
import { PageHead } from '@/components/sections/page-head';
import { RiderCard } from '@/components/sections/rider-card';
import { ArrowButton } from '@/components/sections/arrow-link';

/**
 * TeamPage — the rider line-up.
 *
 * Every card is rendered from a content/team/*.mdx record via RiderCard (the
 * same card the homepage uses). No individual detail pages.
 */
export interface TeamPageProps {
  members: TeamMember[];
  /** Classes raced this season, from the brand record. */
  classes: string[];
  season: number;
}

export function TeamPage({ members, classes, season }: TeamPageProps) {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <PageHead
        eyebrow="The riders"
        title="Four riders. One team."
        lede={`Different bikes, different classes, the same drive to find time on every lap. Racing ${classes.join(', ')} in ${season}.`}
      />

      <section className="container-grid py-16">
        <h2 className="sr-only">Riders</h2>

        {members.length === 0 ? (
          <p className="text-surface-secondary-foreground">No riders are listed yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {members.map((member) => (
              <li key={member.slug}>
                <RiderCard rider={member} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <ArrowButton href="/news">Latest race report</ArrowButton>
          <ArrowButton href="/#calendar" variant="secondary">
            {season} calendar
          </ArrowButton>
        </div>
      </section>
    </>
  );
}
