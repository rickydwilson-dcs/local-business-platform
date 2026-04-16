import React from "react";

/**
 * CtaYellowBand
 *
 * High-visibility call-to-action band for speaker applications
 * Layout: contained band with heading left, body text below, CTA button
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
    <section className="bg-yellow-400 py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Top row: heading */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-brand-primary uppercase tracking-widest leading-tight">
            {props.heading}
          </h2>
        </div>

        {/* Bottom row: body text + CTA */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
          {/* Body text */}
          <div className="flex-1">
            <p className="text-base leading-relaxed text-brand-primary">{props.bodyText}</p>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0 flex items-start">
            <a
              href={props.ctaButton?.href ?? "#"}
              className="inline-block bg-brand-primary text-yellow-400 font-semibold text-sm uppercase tracking-widest px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              {props.ctaButton?.label ?? "Apply Now"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
