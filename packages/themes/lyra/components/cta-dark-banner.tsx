/**
 * WebsiteHelpCTA
 *
 * Bottom-of-page CTA encouraging users to get help with their website
 * Layout: Dark background full-width block with heading, body text and button left-aligned
 * Category: CTA
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface WebsiteHelpCTAProps {
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
}
export function WebsiteHelpCTA(props: WebsiteHelpCTAProps) {
  return (
    <section className="bg-surface-inverse w-full py-16 px-4 md:py-20 md:px-8">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col items-start gap-6 md:max-w-2xl lg:max-w-3xl">
            <h2 className="text-surface-background text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              {props.heading ?? "Need help with your website?"}
            </h2>
            <p className="text-surface-muted-foreground text-base leading-relaxed md:text-lg">
              {props.bodyText ??
                "Whether you're starting from scratch or looking to improve what you have, our team is here to help you build a website that works for your business."}
            </p>
            {props.ctaButton && (
              <a
                href={props.ctaButton?.href ?? "#"}
                className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-md hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-surface-inverse"
              >
                {props.ctaButton?.label ?? "Get in touch"}
              </a>
            )}
            {!props.ctaButton && (
              <a
                href="#contact"
                className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-md hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-surface-inverse"
              >
                Get in touch
              </a>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
