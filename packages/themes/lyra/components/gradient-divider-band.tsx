/**
 * GradientDividerBand
 *
 * Full-width decorative gradient wave band acting as a visual break between content sections
 * Layout: Full-width block with abstract gradient wave shapes, no text content
 * Category: CTA
 */

export interface GradientDividerBandProps {
  /** background-graphic */
  backgroundGraphic?: string;
}

export function GradientDividerBand(props: GradientDividerBandProps) {
  return (
    <div className="relative w-full overflow-hidden bg-surface-background py-16 md:py-24">
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-brand-primary opacity-10 pointer-events-none" />

      {/* Wave shape 1 - large background blob */}
      <div
        className="absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full bg-brand-primary opacity-20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Wave shape 2 - secondary blob */}
      <div
        className="absolute -bottom-32 -right-16 w-[500px] h-[500px] rounded-full bg-brand-secondary opacity-20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Wave shape 3 - accent blob */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-brand-accent opacity-10 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* SVG wave divider top */}
      <svg
        className="absolute top-0 left-0 w-full text-brand-primary opacity-10"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,0 L0,0 Z"
          fill="currentColor"
        />
      </svg>

      {/* SVG wave divider bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full text-brand-secondary opacity-10"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0,40 C360,0 720,80 1080,40 C1260,20 1380,60 1440,40 L1440,80 L0,80 Z"
          fill="currentColor"
        />
      </svg>

      {/* Decorative inner wave shapes */}
      <div className="relative mx-auto max-w-7xl px-4 flex items-center justify-center">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
          {/* Left flowing arc */}
          <svg
            className="w-48 md:w-64 lg:w-80 text-brand-primary opacity-30 animate-fade-in-up"
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M0,80 Q50,0 100,50 Q150,100 200,20"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M0,60 Q60,10 120,60 Q160,90 200,40"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>

          {/* Center decorative circle cluster */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="w-3 h-3 rounded-full bg-brand-accent opacity-60" />
            <div className="w-5 h-5 rounded-full bg-brand-primary opacity-40" />
            <div className="w-8 h-8 rounded-full bg-brand-secondary opacity-30" />
            <div className="w-5 h-5 rounded-full bg-brand-primary opacity-40" />
            <div className="w-3 h-3 rounded-full bg-brand-accent opacity-60" />
          </div>

          {/* Right flowing arc */}
          <svg
            className="w-48 md:w-64 lg:w-80 text-brand-secondary opacity-30 animate-fade-in-up"
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M200,80 Q150,0 100,50 Q50,100 0,20"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M200,60 Q140,10 80,60 Q40,90 0,40"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
