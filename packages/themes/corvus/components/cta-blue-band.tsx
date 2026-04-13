/**
 * CtaBlueBand
 *
 * Sponsor call-to-action band with right-aligned text layout on secondary brand colour background
 * Layout: contained section with right-aligned heading, body text and CTA button on secondary background
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
    <section className="w-full pt-10 pb-0 bg-white">
      <div className="w-full px-0 pb-0 pt-10">
        {/* Gallery grid - 3 columns with 10px gap, showing a photo gallery */}
        <div className="grid grid-cols-3 gap-[10px]">
          <div className="relative w-full overflow-hidden bg-black/20 aspect-square">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-social-5-768x1152.jpg"
              alt="Color Code Buffalo 2025"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative w-full overflow-hidden bg-black/20 aspect-square">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-lewis-768x512.jpg"
              alt="Color Code Buffalo 2025 Lewis"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative w-full overflow-hidden bg-black/20 aspect-square">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-social-4-768x512.jpg"
              alt="Color Code Buffalo 2025 Social"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative w-full overflow-hidden bg-black/20 aspect-square">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-cleary-768x512.jpg"
              alt="Color Code Buffalo 2025 Cleary"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative w-full overflow-hidden bg-black/20 aspect-square">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-social-3-768x512.jpg"
              alt="Color Code Buffalo 2025 Social 3"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative w-full overflow-hidden bg-black/20 aspect-square">
            <img
              src="https://colorcode.events/wp-content/uploads/2025/12/color-code-buffalo-2025-social-5-768x1152.jpg"
              alt="Color Code Buffalo 2025"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* CTA Blue Band */}
        <div className="w-full bg-brand-secondary py-10 px-0 pb-10">
          <div className="w-full flex flex-col items-end text-right px-10">
            <h2 className="text-3xl md:text-4xl font-bold text-on-brand-primary leading-tight mb-4">
              {props.heading}
            </h2>
            <p className="text-on-brand-primary/90 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              {props.bodyText}
            </p>
            <a href={props.ctaButton?.href ?? "#"} className="btn-primary inline-block">
              {props.ctaButton?.label ?? "Learn More"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
