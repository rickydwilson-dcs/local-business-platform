/**
 * ImageOverlayHero — Cygnus theme hero variant
 * Full-screen image overlay with left-aligned headline, badge pill, CTA row, and stats bar.
 * Server Component — no client directive.
 */

export interface ImageOverlayHeroCta {
  label: string;
  href: string;
}

export interface ImageOverlayHeroStat {
  value: string;
  label: string;
}

export interface ImageOverlayHeroProps {
  headline: string;
  headlineAccent?: string;
  subheadline: string;
  primaryCta: ImageOverlayHeroCta;
  secondaryCta?: ImageOverlayHeroCta;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  badge?: string;
  stats?: ImageOverlayHeroStat[];
}

export function ImageOverlayHero({
  headline,
  headlineAccent,
  subheadline,
  primaryCta,
  secondaryCta,
  backgroundImage,
  backgroundImageAlt,
  badge,
  stats,
}: ImageOverlayHeroProps) {
  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image layer */}
        {backgroundImage ? (
          <>
            <img
              src={backgroundImage}
              alt={backgroundImageAlt ?? ""}
              aria-hidden={!backgroundImageAlt ? "true" : undefined}
              className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[50%]"
            />
            {/* Gradient overlay over image */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-background via-surface-background/70 to-transparent" />
          </>
        ) : (
          /* Fallback gradient when no backgroundImage */
          <div className="absolute inset-0 bg-gradient-to-br from-surface-background to-surface-muted" />
        )}

        {/* Content container */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-3xl">
            {/* Badge pill */}
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-elevated rounded-full mb-6 border border-surface-border">
                <span className="flex h-2 w-2 rounded-full bg-brand-primary" />
                <span className="text-xs font-label uppercase tracking-[0.2em] font-semibold text-surface-foreground">
                  {badge}
                </span>
              </div>
            )}

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8 text-surface-foreground">
              {headline}
              {headlineAccent && (
                <> <span className="text-brand-primary">{headlineAccent}</span></>
              )}
            </h1>

            {/* Subheadline */}
            <p className="text-xl font-body text-surface-muted-foreground max-w-xl mb-10 leading-relaxed">
              {subheadline}
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4">
              <a href={primaryCta.href} className="btn-primary px-10 py-4 text-lg font-bold">
                {primaryCta.label}
              </a>
              {secondaryCta && (
                <a href={secondaryCta.href} className="btn-outline px-10 py-4 text-lg font-bold">
                  {secondaryCta.label}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      {stats && stats.length > 0 && (
        <section className="bg-surface-muted border-y border-surface-border py-16">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-5xl font-headline font-bold text-brand-primary italic">
                  {stat.value}
                </div>
                <div className="text-xs font-label uppercase tracking-widest text-surface-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
