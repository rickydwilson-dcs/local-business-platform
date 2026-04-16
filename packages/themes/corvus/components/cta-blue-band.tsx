import React from "react";

/**
 * CtaBlueBand
 *
 * Sponsor call-to-action band with right-aligned text layout
 * Layout: contained band with heading and body text right-aligned, CTA button
 * Category: CTA
 */

export interface CtaBlueBandProps {
  /** heading */
  heading?: string;
  /** bodyText */
  bodyText?: string;
  /** ctaButton */
  ctaButton?: { label?: string; href?: string };
}

export function CtaBlueBand(props: CtaBlueBandProps) {
  return (
    <section className="w-full bg-brand-secondary py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col items-end text-right gap-4 md:gap-6">
          {props.heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-on-brand-primary leading-tight max-w-2xl">
              {props.heading}
            </h2>
          )}
          {props.bodyText && (
            <p className="text-base md:text-lg text-on-brand-primary leading-relaxed max-w-xl">
              {props.bodyText}
            </p>
          )}
          {props.ctaButton && (
            <a href={props.ctaButton?.href} className="btn-primary mt-2 inline-block">
              {props.ctaButton?.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
