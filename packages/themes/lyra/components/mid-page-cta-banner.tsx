/**
 * MidPageCTABanner
 *
 * Full-width decorative gradient band acting as a visual break and implicit CTA
 * Layout: Full-width block with abstract gradient or wave shapes
 * Category: CTA
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface MidPageCTABannerProps {
  /** background-gradient-shape */
  backgroundGradientShape?: string;
}
export function MidPageCTABanner(props: MidPageCTABannerProps) {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28 lg:py-36 bg-brand-primary">
      {/* Abstract gradient background shapes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Large blob top-left */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-secondary opacity-30 blur-3xl" />
        {/* Large blob bottom-right */}
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-brand-accent opacity-20 blur-3xl" />
        {/* Mid blob center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-48 rounded-full bg-brand-secondary opacity-10 blur-2xl" />
        {/* Wave-like decorative strip */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            className="fill-brand-secondary opacity-10"
          />
        </svg>
        <svg
          className="absolute top-0 left-0 w-full rotate-180"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C360,0 720,80 1080,40 C1260,20 1380,60 1440,40 L1440,80 L0,80 Z"
            className="fill-brand-accent opacity-10"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col items-center gap-6 md:gap-8">
            {/* Decorative pill badge */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-secondary text-on-brand-secondary text-xs font-semibold uppercase tracking-widest">
              Get Started Today
            </span>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-brand-primary leading-tight">
              Ready to Transform Your Experience?
            </h2>

            {/* Supporting text */}
            <p className="text-base md:text-lg text-on-brand-primary opacity-80 max-w-2xl">
              Join thousands of users who have already made the switch. Discover what's possible
              when design meets purpose.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-brand-accent text-on-brand-secondary font-semibold text-sm md:text-base transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
              >
                Start for Free
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-surface-muted text-on-brand-primary font-semibold text-sm md:text-base transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
              >
                Learn More
              </a>
            </div>

            {/* Decorative dots row */}
            <div className="flex gap-2 mt-4" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-brand-accent opacity-60" />
              <span className="w-2 h-2 rounded-full bg-brand-secondary opacity-60" />
              <span className="w-2 h-2 rounded-full bg-brand-accent opacity-40" />
              <span className="w-2 h-2 rounded-full bg-brand-secondary opacity-40" />
              <span className="w-2 h-2 rounded-full bg-brand-accent opacity-20" />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
