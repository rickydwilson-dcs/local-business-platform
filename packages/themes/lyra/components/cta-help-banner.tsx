/**
 * HelpCTABanner
 *
 * Encourages visitors to contact Fountain Digital if they have website problems, with supporting illustration
 * Layout: Dark background, text left with CTA button, illustrated characters right
 * Category: CTA
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface HelpCTABannerProps {
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
  /** illustration */
  illustration?: string;
}
export function HelpCTABanner(props: HelpCTABannerProps) {
  return (
    <section className="bg-surface-inverse py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Text Content */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background leading-tight">
                {props.heading ?? "Having trouble with your website?"}
              </h2>
              <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                {props.bodyText ??
                  "Our team at Fountain Digital is here to help. Whether it's a bug, a redesign, or a full rebuild — we've got you covered. Reach out today and let's get your site working for you."}
              </p>
              {props.ctaButton && (
                <div>
                  <a
                    href={props.ctaButton?.href ?? "#contact"}
                    className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                  >
                    {props.ctaButton?.label ?? "Get in Touch"}
                  </a>
                </div>
              )}
              {!props.ctaButton && (
                <div>
                  <a
                    href="#contact"
                    className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                  >
                    Get in Touch
                  </a>
                </div>
              )}
            </div>
          </RevealOnScroll>

          {/* Right: Illustration */}
          <div className="flex justify-center md:justify-end animate-slide-in-right">
            {props.illustration ? (
              <img
                src={props.illustration}
                alt="Fountain Digital support team illustration"
                className="w-full max-w-sm md:max-w-md lg:max-w-lg object-contain"
              />
            ) : (
              <div
                className="w-full max-w-sm md:max-w-md lg:max-w-lg aspect-square bg-surface-foreground rounded-2xl flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="flex flex-col items-center gap-4 p-8">
                  {/* Placeholder illustrated characters */}
                  <div className="flex gap-4 items-end">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-brand-accent opacity-80" />
                      <div className="w-8 h-16 rounded-t-lg bg-brand-secondary opacity-70" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-14 rounded-full bg-brand-primary opacity-80" />
                      <div className="w-10 h-20 rounded-t-lg bg-brand-accent opacity-70" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-brand-secondary opacity-80" />
                      <div className="w-8 h-14 rounded-t-lg bg-brand-primary opacity-70" />
                    </div>
                  </div>
                  <div className="w-48 h-2 rounded-full bg-surface-muted opacity-50" />
                  <p className="text-surface-muted-foreground text-sm text-center">
                    Illustration placeholder
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
