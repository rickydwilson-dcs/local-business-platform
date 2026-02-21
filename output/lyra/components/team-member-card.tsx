/**
 * TeamMemberCard
 *
 * Full-width profile card for a team member or co-founder with bio and external links
 * Layout: Full-width coloured block with member name, title, bio, and links; alternating left/right text alignment with avatar image
 * Category: Cards
 */

export interface TeamMemberCardProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-bio */
  memberBio?: string;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
  /** optional-external-link */
  optionalExternalLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberCard(props: TeamMemberCardProps) {
  return (
    <div className="w-full bg-surface-foreground py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Avatar */}
        <div className="flex-shrink-0 w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden bg-surface-muted border-4 border-brand-primary shadow-lg">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(props["member-name"] ?? "Team Member")}&size=224&background=random`}
            alt={`${props["member-name"] ?? "Team Member"} avatar`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-background mb-1">
            {props["member-name"] ?? "Team Member Name"}
          </h2>
          <p className="text-brand-accent text-lg md:text-xl font-semibold mb-4">
            {props["member-title"] ?? "Co-Founder & CEO"}
          </p>
          <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
            {props["member-bio"] ??
              "A passionate leader with a vision for building impactful products. Brings years of experience in technology, strategy, and team building to drive the company forward."}
          </p>

          {/* Links */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {props["linkedin-link"] && (
              <a
                href={props["linkedin-link"]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-primary text-on-brand-primary font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                aria-label={`${props["member-name"] ?? "Team Member"} on LinkedIn`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.869 0-2.155 1.46-2.155 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.609v5.587z" />
                </svg>
                LinkedIn
              </a>
            )}

            {props["optional-external-link"] && (
              <a
                href={props["optional-external-link"]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-brand-primary text-brand-accent font-semibold px-5 py-2.5 rounded-full hover:bg-brand-primary hover:text-on-brand-primary transition-colors"
                aria-label={`${props["member-name"] ?? "Team Member"} external link`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 3h7m0 0v7m0-7L10 14M5 5H3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-2"
                  />
                </svg>
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
