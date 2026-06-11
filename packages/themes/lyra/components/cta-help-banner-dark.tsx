/**
 * HelpCTABanner
 *
 * Encourages visitors to contact the team if they need website help
 * Layout: Dark full-width banner with headline and body text left, illustrated avatars right, CTA button
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
    <section className="bg-surface-inverse py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left: Text Content */}
          <RevealOnScroll variant="fade-up">
            <div className="flex-1 max-w-xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background mb-4 leading-tight">
                {props.headline ?? "Need help with your website?"}
              </h2>
              <p className="text-surface-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
                {props.bodyText ??
                  "Our team is ready to help you build, improve, or troubleshoot your website. Reach out and let's get started."}
              </p>
              {props.ctaButton && (
                <a
                  href={props.ctaButton?.href ?? "#"}
                  className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                >
                  {props.ctaButton?.label ?? "Get in Touch"}
                </a>
              )}
              {!props.ctaButton && (
                <a
                  href="#contact"
                  className="inline-block bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                >
                  Get in Touch
                </a>
              )}
            </div>
          </RevealOnScroll>

          {/* Right: Illustration / Avatars */}
          <RevealOnScroll variant="fade-up">
            <div className="flex-1 flex justify-center md:justify-end items-center">
              {props.illustration ? (
                <img
                  src={props.illustration}
                  alt="Team avatars illustration"
                  className="w-full max-w-sm md:max-w-md lg:max-w-lg object-contain animate-fade-in-up"
                />
              ) : (
                <div
                  className="flex items-center gap-0 animate-fade-in-up"
                  aria-label="Team members"
                >
                  {[
                    { initials: "AJ", bg: "bg-brand-primary", text: "text-on-brand-primary" },
                    { initials: "SK", bg: "bg-brand-secondary", text: "text-on-brand-secondary" },
                    { initials: "ML", bg: "bg-brand-accent", text: "text-surface-foreground" },
                    { initials: "TR", bg: "bg-surface-muted", text: "text-surface-foreground" },
                  ].map((avatar, index) => (
                    <div
                      key={index}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-surface-inverse flex items-center justify-center font-bold text-sm md:text-base ${avatar.bg} ${avatar.text} -ml-3 first:ml-0 shadow-lg`}
                      style={{ zIndex: index }}
                      aria-hidden="true"
                    >
                      {avatar.initials}
                    </div>
                  ))}
                  <div className="ml-4 flex flex-col">
                    <span className="text-surface-background font-semibold text-sm md:text-base">
                      Our team
                    </span>
                    <span className="text-surface-muted-foreground text-xs md:text-sm">
                      is here for you
                    </span>
                  </div>
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
