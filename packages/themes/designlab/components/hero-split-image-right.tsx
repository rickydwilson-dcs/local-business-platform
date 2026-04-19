"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
export function HeroSplitImageRight({
  eyebrow = "Eastbourne's Premier Sign Company",
  heading = "Signs That\nDemand Attention",
  subheading = "Bold design. Precision craft. Unmissable impact.",
  bodyText = "From vehicle wraps to illuminated fascias, we create signage that transforms how your business is seen. Every project is designed, produced and installed by our in-house team.",
  ctaLabel = "Start Your Project",
  ctaHref = "/contact",
  heroImage = "/images/hero-placeholder.jpg",
  trustBadge = "★ 5.0 rated on Google — 120+ reviews",
}) {
  return (
    <section className="section bg-surface-background relative overflow-hidden">
      {/* Diagonal accent line — the memorable detail: a persistent brand-colored diagonal scar across the hero */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ clipPath: "polygon(58% 0, 62% 0, 42% 100%, 38% 100%)" }}
      >
        <div className="w-full h-full bg-brand-primary opacity-10" />
      </div>

      <div className="container-standard mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center min-h-[70vh]">
          {/* Left: Text */}
          <div className="min-w-0 flex flex-col justify-center py-16 lg:pr-16">
            <RevealOnScroll>
              <span className="text-small font-sans uppercase tracking-widest text-brand-primary mb-6 block">
                {eyebrow}
              </span>
            </RevealOnScroll>

            <RevealOnScroll>
              <h1 className="text-hero font-heading font-bold text-surface-foreground whitespace-pre-line mb-6 leading-none">
                {heading}
              </h1>
            </RevealOnScroll>

            <RevealOnScroll>
              <p className="text-h4 font-sans text-surface-muted-foreground mb-6 max-w-lg">
                {subheading}
              </p>
            </RevealOnScroll>

            <RevealOnScroll>
              <p className="text-body font-sans text-surface-muted-foreground mb-10 max-w-md leading-relaxed">
                {bodyText}
              </p>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <a
                  href={ctaHref}
                  className="btn-primary bg-brand-primary text-on-brand-primary font-sans font-bold uppercase tracking-widest text-small px-8 py-4 hover:opacity-90 transition-opacity inline-block"
                >
                  {ctaLabel}
                </a>
                {trustBadge && (
                  <span className="text-small font-sans text-brand-primary tracking-wide self-center">
                    {trustBadge}
                  </span>
                )}
              </div>
            </RevealOnScroll>
          </div>

          {/* Right: Image with brand-colored border frame */}
          <div className="min-w-0 relative flex items-center justify-center py-8 lg:py-16">
            <RevealOnScroll>
              <div className="relative">
                {/* Offset frame */}
                <div className="absolute -top-4 -right-4 w-full h-full border-2 border-brand-primary z-0" />
                <div className="relative z-10 aspect-[4/5] bg-surface-muted overflow-hidden max-w-md w-full">
                  <img
                    src={heroImage}
                    alt="Featured signage project"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
