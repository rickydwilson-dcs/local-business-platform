/**
 * TeamMemberBenDunkle
 *
 * Profile card for co-founder Ben Dunkle with bio and LinkedIn link
 * Layout: Full-width coloured block, text and links right-aligned with avatar image
 * Category: Cards
 */

export interface TeamMemberBenDunkleProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-bio */
  memberBio?: string;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberBenDunkle(props: TeamMemberBenDunkleProps) {
  return (
    <section className="bg-brand-primary w-full py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-end gap-10">
        {/* Text Content */}
        <div className="flex flex-col items-start md:items-end text-left md:text-right max-w-xl order-2 md:order-1">
          <h2 className="text-on-brand-primary text-3xl md:text-4xl font-bold tracking-tight mb-1">
            {props["member-name"] ?? "Ben Dunkle"}
          </h2>
          <p className="text-brand-accent text-lg font-semibold mb-4">
            {props["member-title"] ?? "Co-Founder"}
          </p>
          <p className="text-on-brand-primary text-base leading-relaxed mb-6">
            {props["member-bio"] ??
              "Ben is a passionate builder and strategist who co-founded the company with a vision to transform how teams collaborate. With a background in product and engineering, he brings a unique blend of technical depth and creative thinking to every challenge."}
          </p>
          <a
            href={props["linkedin-link"] ?? "https://www.linkedin.com/in/bendunkle"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-accent text-on-brand-secondary font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
            aria-label={`Connect with ${props["member-name"] ?? "Ben Dunkle"} on LinkedIn`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.985V9h3.102v1.561h.046c.432-.818 1.487-1.681 3.062-1.681 3.274 0 3.878 2.155 3.878 4.958v6.614zM5.337 7.433a1.8 1.8 0 1 1 0-3.601 1.8 1.8 0 0 1 0 3.601zM6.956 20.452H3.717V9h3.239v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Connect on LinkedIn
          </a>
        </div>

        {/* Avatar */}
        <div className="order-1 md:order-2 flex-shrink-0">
          <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-brand-accent shadow-lg">
            <img
              src="https://placehold.co/208x208"
              alt={`Portrait of ${props["member-name"] ?? "Ben Dunkle"}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
