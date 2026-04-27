/**
 * MidPageCTABanner
 *
 * Full-width decorative gradient band acting as a visual break and implicit CTA
 * Layout: Full-width block with abstract gradient/wave shapes, no text content visible
 * Category: CTA
 */

export interface MidPageCTABannerProps {
  /** background-gradient-shape */
  backgroundGradientShape?: string;
}

export function MidPageCTABanner(props: MidPageCTABannerProps) {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28 lg:py-36 bg-surface-background">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-brand-primary opacity-90" />

      {/* Abstract wave shape — top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-24 md:h-32 text-surface-background"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,0 L0,0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Abstract wave shape — bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-24 md:h-32 text-surface-background"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,60 C240,0 480,120 720,60 C960,0 1200,120 1440,60 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Decorative blob — left */}
      <div
        className="absolute -left-24 top-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-brand-secondary opacity-30 blur-3xl"
        aria-hidden="true"
      />

      {/* Decorative blob — right */}
      <div
        className="absolute -right-24 top-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-brand-accent opacity-30 blur-3xl"
        aria-hidden="true"
      />

      {/* Decorative blob — center */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full bg-brand-secondary opacity-20 blur-2xl"
        aria-hidden="true"
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Animated shimmer bar */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-brand-accent opacity-40 blur-sm"
        aria-hidden="true"
      />

      {/* Visually hidden accessible label */}
      <span className="sr-only">Decorative section break</span>
    </section>
  );
}
