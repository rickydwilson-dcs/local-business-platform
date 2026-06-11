/**
 * HelpCTABanner
 *
 * Encourages visitors to get in touch if they have website problems, with a contact button and illustrated team avatars
 * Layout: Two-column dark background: text and button left, illustrated character avatars right
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
    <section className="bg-surface-inverse py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text and CTA */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-6">
            <h2 className="text-surface-background text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {props.heading ?? "Having trouble with your website?"}
            </h2>
            <p className="text-surface-muted-foreground text-lg leading-relaxed">
              {props.bodyText ??
                "Our team is here to help. Whether it's a bug, a question, or a full redesign — reach out and we'll get back to you quickly."}
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

        {/* Right Column: Avatar Illustrations */}
        <RevealOnScroll variant="fade-up">
          <div className="flex items-center justify-center md:justify-end">
            {props.avatarIllustrations && props.avatarIllustrations.length > 0 ? (
              <div className="flex items-end gap-4 flex-wrap justify-center md:justify-end">
                {props.avatarIllustrations.map(
                  (avatar: { src?: string; alt?: string }, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-brand-accent bg-surface-muted flex items-center justify-center">
                        {avatar?.src ? (
                          <img
                            src={avatar.src}
                            alt={avatar.alt ?? `Team member ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg
                            viewBox="0 0 80 80"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                            aria-hidden="true"
                          >
                            <circle cx="40" cy="40" r="40" className="fill-brand-secondary" />
                            <ellipse
                              cx="40"
                              cy="32"
                              rx="14"
                              ry="14"
                              fill="white"
                              fillOpacity="0.85"
                            />
                            <ellipse
                              cx="40"
                              cy="70"
                              rx="22"
                              ry="16"
                              fill="white"
                              fillOpacity="0.6"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              /* Default illustrated avatars when no props provided */
              <div className="flex items-end gap-3 md:gap-5">
                {[
                  { bg: "bg-brand-primary", size: "w-20 h-20 md:w-24 md:h-24", offset: "mb-0" },
                  { bg: "bg-brand-accent", size: "w-24 h-24 md:w-32 md:h-32", offset: "mb-4" },
                  { bg: "bg-brand-secondary", size: "w-20 h-20 md:w-24 md:h-24", offset: "mb-0" },
                ].map((avatar, index) => (
                  <div
                    key={index}
                    className={`${avatar.size} ${avatar.offset} rounded-full overflow-hidden border-4 border-surface-muted flex items-center justify-center ${avatar.bg} animate-fade-in-up`}
                    style={{ animationDelay: `${index * 150}ms` }}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 80 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <ellipse cx="40" cy="30" rx="14" ry="14" fill="white" fillOpacity="0.9" />
                      <ellipse cx="40" cy="68" rx="22" ry="16" fill="white" fillOpacity="0.6" />
                    </svg>
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
