export function CtaBannerFullWidth({
  heading = "Ready to make your mark?",
  ctaLabel = "Get a Free Quote",
  ctaHref = "/contact",
}) {
  return (
    <section className="bg-brand-primary relative overflow-hidden">
      {/* Diagonal cut for visual edge — the unexpected: the CTA bar is diagonally clipped to break the grid monotony */}
      <div
        className="absolute inset-0 bg-surface-background z-0"
        style={{ clipPath: "polygon(0 0, 5% 0, 0 100%)" }}
      />
      <div
        className="absolute inset-0 bg-surface-background z-0"
        style={{ clipPath: "polygon(100% 0, 95% 100%, 100% 100%)" }}
      />

      <div className="container-standard mx-auto px-6 py-14 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-h2 font-heading font-bold text-on-brand-primary min-w-0 text-center md:text-left">
            {heading}
          </h2>
          <a
            href={ctaHref}
            className="btn-ghost border-2 border-surface-foreground text-on-brand-primary font-sans font-bold uppercase tracking-widest text-small px-10 py-4 hover:bg-surface-foreground hover:text-brand-primary transition-all duration-300 whitespace-nowrap"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
