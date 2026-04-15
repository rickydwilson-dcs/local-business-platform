import React from "react";

/**
 * CtaGreenBand
 *
 * Volunteer call-to-action band with heading, body text, and outlined CTA button
 * Layout: full-bleed green band with heading and body text left-aligned, outlined CTA button below
 * Category: CTA
 */

export interface CtaGreenBandProps {
  /** heading */
  heading?: string;
  /** bodyText */
  bodyText?: string;
  /** ctaButton */
  ctaButton?: { label?: string; href?: string };
}

export function CtaGreenBand(props: CtaGreenBandProps) {
  return (
    <section className="w-full bg-brand-primary">
      <div className="max-w-7xl mx-auto px-10 pt-15 pb-0">
        {/* Newsletter + Nav Row */}
        <div className="w-full flex flex-wrap flex-row items-center justify-between gap-6 px-6 py-6 border-t border-surface-border mb-8 bg-brand-primary">
          {/* Left: Heading + Body */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-xl font-medium text-on-brand-primary">
              {props.heading ?? "Subscribe to our Newsletter"}
            </h4>
            <p className="text-on-inverse-muted mb-1 text-sm">
              {props.bodyText ??
                "The latest event news, articles, and resources, sent to your inbox."}
            </p>
          </div>

          {/* Right: CTA Button */}
          <div className="flex items-center">
            <a
              href={props.ctaButton?.href ?? "#"}
              className="inline-block border-2 border-on-brand-primary text-on-brand-primary font-semibold px-8 py-4 rounded-full hover:bg-brand-on-primary hover:text-brand-primary transition-colors duration-200 text-sm tracking-wide"
            >
              {props.ctaButton?.label ?? "Volunteer Now"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
