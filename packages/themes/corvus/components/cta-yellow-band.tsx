import React from "react";

/**
 * CtaYellowBand
 *
 * High-visibility call-to-action band for speaker applications
 * Layout: full-bleed band with heading and body text left-aligned, CTA button below
 * Category: CTA
 */

export interface CtaYellowBandProps {
  /** heading */
  heading?: string;
  /** bodyText */
  bodyText?: string;
  /** ctaButton */
  ctaButton?: { label?: string; href?: string };
}

export function CtaYellowBand(props: CtaYellowBandProps) {
  return (
    <section className="w-full bg-yellow-400 py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Top row: heading */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-widest uppercase text-brand-primary">
            {props.heading}
          </h2>
        </div>

        {/* Bottom row: body text and CTA */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          {/* Left: decorative arrow image */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <img
              src="https://colorcode.events/wp-content/uploads/2024/12/row-magenta-arrows.png"
              alt="Decorative arrows"
              loading="lazy"
              className="w-full max-w-xs md:max-w-sm"
            />
          </div>

          {/* Right: body text + button */}
          <div className="flex flex-col gap-6 flex-1">
            <p className="text-base leading-relaxed text-brand-primary">{props.bodyText}</p>
            <div>
              <a
                href={props.ctaButton?.href ?? "#"}
                className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-sm uppercase tracking-widest px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                {props.ctaButton?.label ?? "Learn More"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
