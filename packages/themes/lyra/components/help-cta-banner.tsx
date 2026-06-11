/**
 * HelpCTABanner
 *
 * Encourages visitors who have website problems to contact the agency for help, with supporting illustration of avatars
 * Layout: Dark full-width band: heading, body text and CTA button left-aligned, illustrated avatar group right
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
  /** avatar-illustrations */
  avatarIllustrations?: { src?: string; alt?: string }[];
}
export function HelpCTABanner(props: HelpCTABannerProps) {
  return (
    <section className="bg-surface-inverse w-full py-16 px-4 md:py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col items-start gap-6">
            <h2 className="text-surface-background text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {props.heading ?? "Having trouble with your website?"}
            </h2>
            <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed max-w-lg">
              {props.bodyText ??
                "Our team of experts is ready to help you diagnose issues, improve performance, and get your site back on track. Don't let technical problems hold your business back."}
            </p>
            <a
              href={props.ctaButton?.href ?? "#contact"}
              className="inline-block bg-brand-accent text-on-brand-secondary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
            >
              {props.ctaButton?.label ?? "Get Help Now"}
            </a>
          </div>
        </RevealOnScroll>

        {/* Right: Avatar Illustrations */}
        <RevealOnScroll variant="fade-up">
          <div className="flex justify-center md:justify-end items-center">
            {props.avatarIllustrations && props.avatarIllustrations.length > 0 ? (
              <div className="flex items-center -space-x-4">
                {props.avatarIllustrations.map(
                  (avatar: { src?: string; alt?: string }, index: number) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-surface-inverse bg-surface-muted shadow-lg"
                      style={{ zIndex: props.avatarIllustrations!.length - index }}
                    >
                      <img
                        src={avatar?.src}
                        alt={avatar?.alt ?? `Team member ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                )}
                <div className="ml-6 flex flex-col gap-1">
                  <span className="text-surface-background font-bold text-lg md:text-xl">
                    50+ Experts
                  </span>
                  <span className="text-surface-muted-foreground text-sm">Ready to assist you</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                {/* Placeholder avatar group */}
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-muted border-4 border-surface-inverse flex items-center justify-center shadow-lg"
                      style={{ zIndex: 4 - i }}
                      aria-hidden="true"
                    >
                      <svg
                        className="w-8 h-8 text-surface-muted-foreground"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-surface-background font-bold text-lg md:text-xl">
                    50+ Experts
                  </span>
                  <span className="text-surface-muted-foreground text-sm">Ready to assist you</span>
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
