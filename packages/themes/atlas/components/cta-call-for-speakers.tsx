"use client";

/**
 * CallForSpeakers
 *
 * Encourages speakers to apply to present at the conference
 * Layout: Full-width yellow background, heading and body text left, CTA button
 * Category: CTA
 */

import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CallForSpeakersProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** apply-cta-button */
  applyCtaButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSpeakers(props: CallForSpeakersProps) {
  return (
    <section className="bg-brand-accent w-full py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-4 md:max-w-2xl">
            <h2 className="text-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {props.sectionHeading ?? "Call for Speakers"}
            </h2>
            <p className="text-brand-primary text-base md:text-lg leading-relaxed">
              {props.bodyText ??
                "Do you have a story to tell, a project to share, or expertise that could inspire others? We're looking for passionate speakers to take the stage at our upcoming conference. Whether you're a seasoned presenter or a first-time speaker, we'd love to hear from you."}
            </p>
          </div>
        </RevealOnScroll>
        <div className="flex-shrink-0">
          <a
            href={Array.isArray(props.applyCtaButton) ? props.applyCtaButton[0]?.href ?? "#apply" : "#apply"}
            className="inline-block border-2 border-brand-primary text-brand-primary font-semibold text-base md:text-lg px-8 py-4 rounded-md hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            aria-label="Apply to speak at the conference"
          >
            Apply to Speak
          </a>
        </div>
      </div>
    </section>
  );
}
