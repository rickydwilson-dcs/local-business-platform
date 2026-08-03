import Image from 'next/image';
import type { TeamMember } from '@/lib/team';
import { PageHead } from '@/components/sections/page-head';

/**
 * TeamPage — the full crew listing.
 *
 * Every card is rendered from a content/team/*.mdx record — photo, name and
 * role only, no individual detail pages (nothing beyond a role is on file
 * for most of the crew yet).
 */
export interface TeamPageProps {
  members: TeamMember[];
}

export function TeamPage({ members }: TeamPageProps) {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <PageHead
        eyebrow="The crew"
        title="Everyone behind the number."
        lede="Race weekends take more than a rider and a bike — here's the full team that gets it to the grid."
      />

      <section className="container-grid py-16">
        <h2 className="sr-only">Team members</h2>

        {members.length === 0 ? (
          <p className="text-surface-secondary-foreground">No team members are listed yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {members.map((member) => (
              <li key={member.slug}>
                <article className="flex h-full flex-col overflow-hidden rounded-card border border-surface-card-border bg-surface-card">
                  <div className="aspect-[3/4] overflow-hidden bg-surface-subtle">
                    <Image
                      src={member.image.src}
                      alt={member.image.alt}
                      width={member.image.width}
                      height={member.image.height}
                      sizes="(min-width: 1024px) 20rem, (min-width: 640px) 30vw, 45vw"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <h3 className="text-h4 text-surface-foreground">{member.name}</h3>
                    <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">
                      {member.role}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
