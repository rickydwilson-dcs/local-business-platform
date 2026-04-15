import React from "react";

/**
 * CtaBlueBand
 *
 * Sponsor call-to-action band with text right-aligned and CTA button
 * Layout: full-bleed blue band with heading and body text right-aligned, CTA button below
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
    <section className="w-full bg-brand-secondary pt-10 pb-0">
      <div className="w-full px-0 pb-0 pt-0">
        {/* Gallery grid - 3 columns of images */}
        <div className="grid grid-cols-3 gap-[10px]">
          <div className="aspect-square overflow-hidden bg-black/20">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-social-5-768x1152.jpg"
              alt="Color Code Buffalo 2025"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-square overflow-hidden bg-black/20">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-lewis-768x512.jpg"
              alt="Color Code Buffalo 2025 Lewis"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-square overflow-hidden bg-black/20">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-social-4-768x512.jpg"
              alt="Color Code Buffalo 2025 Social"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-square overflow-hidden bg-black/20">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-cleary-768x512.jpg"
              alt="Color Code Buffalo 2025 Cleary"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-square overflow-hidden bg-black/20">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-social-3-768x512.jpg"
              alt="Color Code Buffalo 2025 Social 3"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-square overflow-hidden bg-black/20">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-social-5-768x1152.jpg"
              alt="Color Code Buffalo 2025"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* CTA Band */}
        <div className="w-full bg-brand-secondary flex flex-col items-end text-right px-10 pt-10 pb-10">
          {props.heading && (
            <h2 className="text-3xl font-bold text-on-brand-primary leading-tight mb-4 max-w-2xl">
              {props.heading}
            </h2>
          )}
          {props.bodyText && (
            <p className="text-base text-on-brand-primary leading-relaxed mb-6 max-w-2xl">
              {props.bodyText}
            </p>
          )}
          {props.ctaButton && (
            <a href={props.ctaButton?.href} className="btn-primary inline-block">
              {props.ctaButton?.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
