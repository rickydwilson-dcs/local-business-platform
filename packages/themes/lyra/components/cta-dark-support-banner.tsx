/**
 * SupportCTABanner
 *
 * Encourages users who have broken their website to contact the agency for help
 * Layout: Dark full-width two-column: left heading + body + CTA button, right decorative avatar illustrations
 * Category: CTA
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface SupportCTABannerProps {
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
  /** avatar-illustrations */
  avatarIllustrations?: { src?: string; alt?: string }[];
}
export function SupportCTABanner(props: SupportCTABannerProps) {
  return (
    <section className="bg-surface-inverse py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Heading, Body, CTA */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background leading-tight">
              {props.heading ?? "Broken something? We've got you covered."}
            </h2>
            <p className="text-surface-muted-foreground text-lg leading-relaxed">
              {props.bodyText ??
                "Accidents happen. Whether you've accidentally deleted a page, broken your layout, or something just stopped working — our team is ready to jump in and fix it fast. Don't stress, just reach out."}
            </p>
            {props.ctaButton ? (
              <a
                href={props.ctaButton?.href}
                className="inline-flex items-center justify-center self-start bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-surface-inverse"
              >
                {props.ctaButton?.label ?? "Get Help Now"}
              </a>
            ) : (
              <a
                href="#contact"
                className="inline-flex items-center justify-center self-start bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-surface-inverse"
              >
                Get Help Now
              </a>
            )}
          </div>
        </RevealOnScroll>

        {/* Right Column: Avatar Illustrations */}
        <RevealOnScroll variant="fade-up">
          <div className="flex items-center justify-center">
            {props.avatarIllustrations && props.avatarIllustrations.length > 0 ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {props.avatarIllustrations.map(
                  (avatar: { src?: string; alt?: string }, index: number) => (
                    <div key={index} className="relative flex flex-col items-center gap-2">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-brand-primary bg-surface-muted shadow-lg">
                        <img
                          src={avatar?.src}
                          alt={avatar?.alt ?? `Support team member ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-surface-muted border-4 border-brand-primary shadow-lg flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-surface-muted-foreground"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
