"use client";

/**
 * CallForVolunteers
 *
 * Recruits volunteers for the conference
 * Layout: Full-width green background, heading and text left, CTA button
 * Category: CTA
 */

import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CallForVolunteersProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** volunteer-cta-button */
  volunteerCtaButton?: { label?: string; href?: string };
}

export function CallForVolunteers(props: CallForVolunteersProps) {
  const heading = props.sectionHeading ?? "Call For Volunteers";
  const body = props.bodyText ?? "Join our team of amazing volunteers and help make this event unforgettable. Whether you have a few hours or the whole weekend, we would love your help.";
  const ctaHref = props.volunteerCtaButton?.href ?? "/contact";
  const ctaLabel = props.volunteerCtaButton?.label ?? "Volunteer Now";

  return (
    <section className="bg-[#00b050] w-full py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-4 md:max-w-2xl">
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {heading}
            </h2>
            <p className="text-white text-base md:text-lg leading-relaxed opacity-90">
              {body}
            </p>
          </div>
        </RevealOnScroll>

        <div className="flex-shrink-0">
          <a
            href={ctaHref}
            className="inline-block border-2 border-white text-white font-semibold text-base md:text-lg px-8 py-4 rounded-md hover:bg-white hover:text-[#00b050] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#00b050]"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
