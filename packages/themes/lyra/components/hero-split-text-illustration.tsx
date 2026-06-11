/**
 * HeroSplit
 *
 * Primary hero introducing the agency as a multi-award winning digital marketing agency with CTAs
 * Layout: Two-column split: left text/CTAs, right decorative UI illustration with avatar
 * Category: Hero
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface HeroSplitProps {
  /** eyebrow-label */
  eyebrowLabel?: string;
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** primary-cta */
  primaryCta?: { label?: string; href?: string };
  /** secondary-cta */
  secondaryCta?: { label?: string; href?: string };
  /** illustration */
  illustration?: string;
}
export function HeroSplit(props: HeroSplitProps) {
  return (
    <section className="bg-surface-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & CTAs */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              {/* Eyebrow Label */}
              {props.eyebrowLabel && (
                <span className="inline-flex items-center gap-2 text-brand-primary text-sm font-semibold uppercase tracking-widest">
                  <span className="block w-6 h-0.5 bg-brand-primary rounded-full" />
                  {props.eyebrowLabel}
                </span>
              )}

              {/* Heading */}
              {props.heading && (
                <h1 className="text-surface-foreground text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                  {props.heading}
                </h1>
              )}

              {/* Body Text */}
              {props.bodyText && (
                <p className="text-surface-muted-foreground text-lg sm:text-xl leading-relaxed max-w-lg">
                  {props.bodyText}
                </p>
              )}

              {/* Award Badge */}
              <div className="flex items-center gap-3 bg-surface-muted rounded-xl px-4 py-3 w-fit">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-accent">
                  <svg
                    className="w-5 h-5 text-on-brand-secondary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <p className="text-surface-foreground text-sm font-bold">
                    Multi-Award Winning Agency
                  </p>
                  <p className="text-surface-muted-foreground text-xs">
                    Recognised globally for digital excellence
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                {props.primaryCta?.href && (
                  <a
                    href={props.primaryCta.href}
                    className="inline-flex items-center justify-center gap-2 bg-brand-primary text-on-brand-primary font-semibold text-base px-8 py-4 rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                  >
                    {props.primaryCta.label ?? "Get Started"}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                )}
                {props.secondaryCta?.href && (
                  <a
                    href={props.secondaryCta.href}
                    className="inline-flex items-center justify-center gap-2 border-2 border-brand-primary text-brand-primary font-semibold text-base px-8 py-4 rounded-xl hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                  >
                    {props.secondaryCta.label ?? "View Our Work"}
                  </a>
                )}
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex -space-x-2">
                  {[
                    { initials: "AK", bg: "bg-brand-primary" },
                    { initials: "MJ", bg: "bg-brand-secondary" },
                    { initials: "RL", bg: "bg-brand-accent" },
                    { initials: "SP", bg: "bg-surface-inverse" },
                  ].map((avatar, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full ${avatar.bg} border-2 border-surface-background flex items-center justify-center`}
                      aria-hidden="true"
                    >
                      <span className="text-on-brand-primary text-xs font-bold">
                        {avatar.initials}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-surface-muted-foreground text-sm">
                  <span className="text-surface-foreground font-semibold">500+</span> happy clients
                  worldwide
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Right Column: Decorative UI Illustration */}
          <RevealOnScroll variant="fade-up">
            <div className="relative flex items-center justify-center">
              {/* Background blob */}
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-brand-primary opacity-10 blur-3xl" />
              </div>

              {/* Main card */}
              <div className="relative w-full max-w-md bg-surface-foreground rounded-3xl shadow-2xl p-6 flex flex-col gap-5">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-on-brand-primary"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-surface-background text-sm font-bold">
                        Campaign Performance
                      </p>
                      <p className="text-surface-muted text-xs">Last 30 days</p>
                    </div>
                  </div>
                  <span className="bg-brand-accent text-on-brand-secondary text-xs font-bold px-3 py-1 rounded-full">
                    Live
                  </span>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
