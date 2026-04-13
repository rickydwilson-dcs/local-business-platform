/**
 * CtaYellowBand
 *
 * High-visibility call-to-action band for speaker applications with heading, body and button
 * Layout: contained section with left-aligned heading, body text and CTA button on accent background
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-primary leading-tight tracking-tight">
              {props.heading}
            </h2>
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <p className="text-base leading-relaxed text-brand-primary">{props.bodyText}</p>
            <div>
              <a href={props.ctaButton?.href ?? "#"} className="btn-primary inline-block">
                {props.ctaButton?.label ?? "Apply Now"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
