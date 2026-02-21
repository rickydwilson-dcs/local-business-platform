/**
 * TeamMemberRonBrennan
 *
 * Profile card for co-founder Ron Brennan with bio and external links
 * Layout: Full-width coloured block, text and links left-aligned
 * Category: Cards
 */

export interface TeamMemberRonBrennanProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-bio */
  memberBio?: string;
  /** company-link */
  companyLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberRonBrennan(props: TeamMemberRonBrennanProps) {
  return (
    <div className="w-full bg-brand-primary py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl">
        <div className="mb-2">
          <span className="text-brand-accent text-sm font-semibold uppercase tracking-widest">
            Co-Founder
          </span>
        </div>

        <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
          {props["member-name"] ?? "Ron Brennan"}
        </h2>

        <p className="text-brand-accent text-lg md:text-xl font-medium mb-6">
          {props["member-title"] ?? "Co-Founder & Chief Technology Officer"}
        </p>

        <p className="text-on-brand-primary text-base md:text-lg leading-relaxed max-w-2xl mb-8">
          {props["member-bio"] ??
            "Ron Brennan is a seasoned technologist and entrepreneur with over two decades of experience building scalable software platforms. He co-founded the company with a vision to democratise access to cutting-edge tools for teams of all sizes. Ron leads the engineering and product teams, driving innovation and technical excellence across the organisation."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {props["company-link"] && (
            <a
              href={props["company-link"]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-accent font-semibold text-base border-b-2 border-brand-primary hover:border-brand-accent transition-colors duration-200 pb-0.5 w-fit"
              aria-label={`Visit ${props["member-name"] ?? "Ron Brennan"}'s company page`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Company Profile
            </a>
          )}

          {props["linkedin-link"] && (
            <a
              href={props["linkedin-link"]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-accent font-semibold text-base border-b-2 border-brand-primary hover:border-brand-accent transition-colors duration-200 pb-0.5 w-fit"
              aria-label={`Connect with ${props["member-name"] ?? "Ron Brennan"} on LinkedIn`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
