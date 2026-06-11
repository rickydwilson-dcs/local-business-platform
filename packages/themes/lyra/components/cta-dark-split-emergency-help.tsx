/**
 * EmergencyHelpCTA
 *
 * Reassurance section for users who have broken their website, encouraging them to contact Fountain Digital for help
 * Layout: Dark full-width band: text left, illustrated avatar group right, CTA button below text
 * Category: CTA
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface EmergencyHelpCTAProps {
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
  /** avatar-illustrations */
  avatarIllustrations?: { src?: string; alt?: string }[];
}
export function EmergencyHelpCTA(props: EmergencyHelpCTAProps) {
  return (
    <section className="bg-surface-inverse py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          {/* Left: Text Content */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6 md:max-w-xl">
              <h2 className="text-surface-background text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {props.heading ?? "Broken your website? Don't panic."}
              </h2>
              <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed">
                {props.bodyText ??
                  "We've seen it all — white screens, plugin conflicts, accidental deletions. The Fountain Digital team is here to help you get back online fast. Reach out now and we'll sort it together."}
              </p>
              <div>
                <a
                  href={props.ctaButton?.href ?? "#contact"}
                  className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                >
                  {props.ctaButton?.label ?? "Get Emergency Help Now"}
                </a>
              </div>
            </div>
          </RevealOnScroll>

          {/* Right: Avatar Illustrations */}
          <RevealOnScroll variant="fade-up">
            <div className="flex items-center justify-center md:justify-end">
              {props.avatarIllustrations && props.avatarIllustrations.length > 0 ? (
                <div className="flex -space-x-4">
                  {props.avatarIllustrations.map(
                    (avatar: { src?: string; alt?: string }, index: number) => (
                      <div
                        key={index}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-surface-inverse bg-surface-muted flex items-center justify-center"
                        style={{ zIndex: props.avatarIllustrations!.length - index }}
                      >
                        <img
                          src={avatar?.src}
                          alt={avatar?.alt ?? `Support team member ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-surface-inverse bg-surface-muted flex items-center justify-center"
                      style={{ zIndex: 4 - i }}
                    >
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 text-surface-muted-foreground"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>

        {/* Reassurance strip */}
        <div className="mt-12 pt-8 border-t border-surface-muted flex flex-col sm:flex-row gap-4 sm:gap-8 text-surface-muted-foreground text-sm">
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-brand-accent flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Fast response times
          </span>
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-brand-accent flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            No jargon, just solutions
          </span>
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-brand-accent flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Friendly, expert team
          </span>
        </div>
      </div>
    </section>
  );
}
