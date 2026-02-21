/**
 * TeamMemberTimBouchard
 *
 * Profile card for co-founder Tim Bouchard with bio and external links
 * Layout: Full-width coloured block, text and links right-aligned
 * Category: Cards
 */

export interface TeamMemberTimBouchardProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-bio */
  memberBio?: string;
  /** agency-link */
  agencyLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberTimBouchard(props: TeamMemberTimBouchardProps) {
  return (
    <section className="w-full bg-brand-primary py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl ml-auto flex flex-col items-end text-right">
        <p className="text-brand-accent uppercase tracking-widest text-sm font-semibold mb-2">
          Co-Founder
        </p>
        <h2 className="text-on-brand-primary text-4xl md:text-5xl font-bold mb-1">
          {props["member-name"] ?? "Tim Bouchard"}
        </h2>
        <p className="text-brand-accent text-lg md:text-xl font-medium mb-6">
          {props["member-title"] ?? "Creative Director & Co-Founder"}
        </p>
        <p className="text-on-brand-primary text-base md:text-lg leading-relaxed max-w-2xl mb-8">
          {props["member-bio"] ??
            "Tim Bouchard is a creative visionary with over a decade of experience shaping brand identities and digital experiences. As co-founder, he drives the creative direction and ensures every project reflects both purpose and craft."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-end">
          {props["agency-link"] && (
            <a
              href={props["agency-link"]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity text-sm md:text-base"
              aria-label="Visit Tim Bouchard's agency website"
            >
              Agency Website ↗
            </a>
          )}
          {props["linkedin-link"] && (
            <a
              href={props["linkedin-link"]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity text-sm md:text-base"
              aria-label="Connect with Tim Bouchard on LinkedIn"
            >
              LinkedIn ↗
            </a>
          )}
          {!props["agency-link"] && !props["linkedin-link"] && (
            <>
              <a
                href="#"
                className="text-brand-accent font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity text-sm md:text-base"
                aria-label="Visit agency website"
              >
                Agency Website ↗
              </a>
              <a
                href="#"
                className="text-brand-accent font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity text-sm md:text-base"
                aria-label="Connect on LinkedIn"
              >
                LinkedIn ↗
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
