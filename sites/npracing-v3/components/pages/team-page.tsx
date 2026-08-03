import Image from 'next/image';
import { listSlugs, loadMdx } from '@/lib/mdx';
import { TeamFrontmatterSchema, type TeamFrontmatter } from '@/lib/schemas/team';
import { getImageSizes, getImageUrl } from '@/lib/image';
import { PageHead } from '@/components/sections/page-head';

/**
 * TeamPage — the full crew listing.
 *
 * Every card is read from `content/team/*.mdx` — photo, name and role only,
 * no individual detail pages (nothing beyond a role is on file for most of
 * the crew yet).
 */
async function getTeamMembers(): Promise<Array<{ slug: string; frontmatter: TeamFrontmatter }>> {
  const slugs = await listSlugs('team');

  const members = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await loadMdx({ baseDir: 'team', slug });
      return { slug, frontmatter: TeamFrontmatterSchema.parse(frontmatter) };
    })
  );

  return members.sort((a, b) => a.frontmatter.sortOrder - b.frontmatter.sortOrder);
}

export async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <>
      <PageHead
        tag="The crew"
        heading="Everyone behind the number."
        lede="Race weekends take more than a rider and a bike — here's the full team that gets it to the grid."
      />

      <section aria-label="Team members" className="py-14">
        <div className="mx-auto w-full max-w-[80rem] px-6">
          {members.length === 0 ? (
            <p className="text-body text-surface-secondary">No team members are listed yet.</p>
          ) : (
            <ul className="grid grid-cols-2 border border-surface-card-border lg:grid-cols-4">
              {members.map(({ slug, frontmatter }) => (
                <li
                  key={slug}
                  className="flex flex-col border-b border-r border-surface-card-border last:border-r-0 [&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface-card">
                    <Image
                      src={getImageUrl(frontmatter.image.src)}
                      alt={frontmatter.image.alt}
                      fill
                      sizes={getImageSizes('card')}
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <h2 className="font-sans text-base font-extrabold leading-tight text-surface-foreground">
                      {frontmatter.name}
                    </h2>
                    <p className="text-small font-semibold uppercase tracking-wide text-brand-accent">
                      {frontmatter.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
