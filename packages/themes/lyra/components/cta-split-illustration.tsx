/**
 * HelpCTABanner
 *
 * Encourages users to get in touch if they have website problems, with a contact button
 * Layout: Two-column split with text and CTA button left, illustrated characters right
 * Category: CTA
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface HelpCTABannerProps {
  /** headline */
  headline?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
  /** illustration */
  illustration?: string;
}
export function HelpCTABanner(props: HelpCTABannerProps) {
  return (
    <section className="bg-surface-muted py-12 md:py-16 lg:py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left column: text and CTA */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-foreground leading-tight">
                {props.headline ?? "Having trouble with your website?"}
              </h2>
              <p className="text-base md:text-lg text-surface-muted-foreground leading-relaxed">
                {props.bodyText ??
                  "Our team is here to help. Whether it's a technical issue or a quick question, don't hesitate to reach out — we'll get you sorted in no time."}
              </p>
              {props.ctaButton ? (
                <a
                  href={props.ctaButton?.href ?? "#"}
                  className="inline-flex items-center justify-center self-start bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                >
                  {props.ctaButton?.label ?? "Get in Touch"}
                </a>
              ) : (
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center self-start bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                >
                  Get in Touch
                </a>
              )}
            </div>
          </RevealOnScroll>

          {/* Right column: illustration */}
          <div className="flex items-center justify-center md:justify-end animate-slide-in-right">
            {props.illustration ? (
              <img
                src={props.illustration}
                alt="Help and support illustration"
                className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain"
              />
            ) : (
              <div
                className="w-full max-w-sm md:max-w-md lg:max-w-lg aspect-square rounded-2xl bg-surface-foreground bg-opacity-5 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="flex flex-col items-center gap-4 opacity-30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-24 h-24 text-brand-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-surface-muted-foreground text-sm font-medium">
                    Illustration placeholder
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
