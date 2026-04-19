import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HeroSplitImageTextProps {
  eyebrow?: string;
  headline?: string;
  bodyCopy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
}

export function HeroSplitImageText({
  eyebrow = "Balatoni vendégház",
  headline = "Navá Garden",
  bodyCopy = "Egy különleges vendégház a Balaton északi partján, ahol a természet és a kényelem találkozik. Fedezze fel a tökéletes kikapcsolódás helyszínét családjával vagy barátaival.",
  ctaLabel = "Fedezze fel →",
  ctaHref = "#ahaz",
  heroImageSrc = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
  heroImageAlt = "NaváGarden vendégház exterior",
}: HeroSplitImageTextProps) {
  return (
    <section className="section bg-surface-background min-h-[90vh] grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Text content */}
      <div className="flex flex-col justify-center px-8 py-16 lg:px-16 xl:px-24 min-w-0 min-h-[50vh] lg:min-h-[90vh]">
        <RevealOnScroll>
          {/* Eyebrow with a gold left border */}
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-12 h-px bg-brand-primary" />
            <span
              className="text-small uppercase tracking-widest text-brand-primary font-medium"
              style={{ fontFamily: "Work Sans, system-ui, sans-serif", letterSpacing: "0.15em" }}
            >
              {eyebrow}
            </span>
          </div>

          <h1
            className="text-brand-secondary mb-8"
            style={{
              fontFamily: "Audrey, Georgia, serif",
              fontSize: "clamp(3.5rem, 8vw, 8rem)",
              lineHeight: "0.9",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            {headline.split(" ").map((word: string, i: number) => (
              <span key={i} className="block">
                {word}
              </span>
            ))}
          </h1>

          <p
            className="text-body text-surface-muted-foreground max-w-md mb-10 leading-relaxed"
            style={{ fontFamily: "Work Sans, system-ui, sans-serif", fontWeight: 300 }}
          >
            {bodyCopy}
          </p>

          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 text-brand-primary text-body font-medium uppercase tracking-widest hover:gap-4 transition-all duration-500 group"
            style={{
              fontFamily: "Work Sans, system-ui, sans-serif",
              letterSpacing: "0.12em",
              fontSize: "14px",
            }}
          >
            {ctaLabel}
            <span className="block w-8 h-px bg-brand-primary group-hover:w-14 transition-all duration-500" />
          </a>
        </RevealOnScroll>
      </div>

      {/* Right: Full-height image */}
      <div className="relative aspect-[3/4] lg:aspect-auto lg:min-h-[90vh] bg-surface-muted overflow-hidden">
        <img
          src={heroImageSrc}
          alt={heroImageAlt}
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Subtle gold diagonal overlay in the corner */}
        <div
          className="absolute bottom-0 right-0 w-32 h-32 bg-brand-primary opacity-20"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        />
      </div>
    </section>
  );
}
