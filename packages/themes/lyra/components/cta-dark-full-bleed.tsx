/**
 * EmergencyCTABanner
 *
 * Dark bottom CTA encouraging users to contact for website help
 * Layout: Full-width dark background with heading, body text and CTA button left-aligned
 * Category: CTA
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface EmergencyCTABannerProps {
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
}
export function EmergencyCTABanner(props: EmergencyCTABannerProps) {
  return (
    <section className="w-full bg-surface-inverse py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col items-start gap-6 md:max-w-2xl lg:max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background leading-tight">
              {props.heading ?? "Need urgent help with your website?"}
            </h2>
            <p className="text-base md:text-lg text-surface-muted-foreground leading-relaxed">
              {props.bodyText ??
                "Whether your site is down, broken, or just not performing — our team is ready to step in and fix it fast. Don't let technical issues cost you customers."}
            </p>
            <a
              href={props.ctaButton?.href ?? "#contact"}
              className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base md:text-lg px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-surface-inverse"
              aria-label={props.ctaButton?.label ?? "Contact us for website help"}
            >
              {props.ctaButton?.label ?? "Get Emergency Support"}
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
