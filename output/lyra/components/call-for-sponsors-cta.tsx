/**
 * CallForSponsorsCTA
 *
 * Invites potential sponsors to support the event
 * Layout: Full-width blue background block with heading and body copy right-aligned and CTA button
 * Category: CTA
 */

export interface CallForSponsorsCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** sponsor-levels-cta-button */
  sponsorLevelsCtaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSponsorsCTA(props: CallForSponsorsCTAProps) {
  return (
    <section className="w-full bg-brand-primary py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-start md:flex-row md:items-center md:justify-between gap-8">
        <div className="md:w-1/2 lg:w-2/3 md:text-right md:ml-auto flex flex-col items-start md:items-end gap-4">
          {props["section-heading"] && (
            <h2 className="text-3xl lg:text-4xl font-bold text-on-brand-primary">
              {props["section-heading"]}
            </h2>
          )}
          {props["body-copy"] && (
            <p className="text-lg text-on-brand-primary opacity-90 max-w-prose">
              {props["body-copy"]}
            </p>
          )}
          {props["sponsor-levels-cta-button"] && (
            <div className="mt-4">
              <a
                href="#sponsor-levels"
                className="inline-block bg-brand-accent text-on-brand-secondary font-semibold text-base px-8 py-3 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
              >
                {props["sponsor-levels-cta-button"]}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
