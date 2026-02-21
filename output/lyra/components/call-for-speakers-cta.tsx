/**
 * CallForSpeakersCTA
 *
 * Encourages speakers to apply to present at the conference
 * Layout: Full-width yellow background block with heading and body copy left-aligned and CTA button
 * Category: CTA
 */

export interface CallForSpeakersCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** apply-cta-button */
  applyCtaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSpeakersCTA(props: CallForSpeakersCTAProps) {
  return (
    <section className="w-full bg-brand-primary py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-start gap-6 md:gap-8">
        <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-2xl">
          {props["section-heading"] ?? "Call for Speakers"}
        </h2>
        <p className="text-on-brand-primary text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed">
          {props["body-copy"] ??
            "Do you have a story to tell, a project to share, or expertise to offer? We're looking for passionate speakers to inspire and educate our community. Submit your proposal and join us on stage at this year's conference."}
        </p>
        <a
          href="#apply"
          className="inline-block bg-brand-secondary text-on-brand-secondary font-semibold text-base md:text-lg px-8 py-4 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary"
          aria-label={props["apply-cta-button"] ?? "Apply to speak at the conference"}
        >
          {props["apply-cta-button"] ?? "Apply to Speak"}
        </a>
      </div>
    </section>
  );
}
