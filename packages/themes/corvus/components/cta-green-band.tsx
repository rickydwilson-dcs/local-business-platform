/**
 * CtaGreenBand
 *
 * Volunteer call-to-action full-width band with heading, body and apply button
 * Layout: full-bleed-band with left-aligned heading and body text and CTA button on green background
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
      <div className="max-w-7xl mx-auto px-10 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left: Heading + Body */}
          <div className="flex flex-col gap-3 max-w-xl">
            <h2 className="text-3xl font-medium text-on-brand-primary leading-tight">
              {props.heading}
            </h2>
            <p className="text-base text-on-brand-primary leading-relaxed">{props.bodyText}</p>
          </div>

          {/* Right: CTA Button */}
          <div className="flex-shrink-0">
            <a
              href={props.ctaButton?.href ?? "#"}
              className="btn-primary inline-block text-base font-semibold px-8 py-4 rounded-full"
            >
              {props.ctaButton?.label ?? "Apply Now"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
