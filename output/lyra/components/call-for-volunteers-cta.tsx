/**
 * CallForVolunteersCTA
 *
 * Recruits volunteers to help run the conference
 * Layout: Full-width green background block with heading and body copy left-aligned and CTA button
 * Category: CTA
 */

export interface CallForVolunteersCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** volunteer-cta-button */
  volunteerCtaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForVolunteersCTA(props: CallForVolunteersCTAProps) {
  return (
    <section className="w-full bg-brand-primary py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-start gap-6 md:gap-8">
        <div className="flex flex-col items-start gap-4 max-w-2xl">
          {props["section-heading"] && (
            <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {props["section-heading"]}
            </h2>
          )}
          {props["body-copy"] && (
            <p className="text-on-brand-primary text-base md:text-lg leading-relaxed opacity-90">
              {props["body-copy"]}
            </p>
          )}
        </div>
        {props["volunteer-cta-button"] && (
          <button className="bg-surface-inverse text-surface-background font-semibold text-base md:text-lg px-8 py-3 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-surface-inverse">
            {props["volunteer-cta-button"]}
          </button>
        )}
      </div>
    </section>
  );
}
