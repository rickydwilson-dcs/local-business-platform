interface CtaBandProps {
  headline: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CtaBand({
  headline,
  subtext,
  primaryLabel = 'Get a Quote',
  primaryHref = '/contact',
  secondaryLabel,
  secondaryHref,
}: CtaBandProps) {
  return (
    <section className="bg-brand-primary py-24">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl text-center md:text-left">
          <h2 className="md:text-6xl mb-4 text-5xl font-headline font-bold mt-4 cta-band-text-dark">
            {headline}
          </h2>
          {subtext && (
            <p className="text-lg font-body font-medium cta-band-text-dark opacity-70">{subtext}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <a
            href={primaryHref}
            className="bg-surface-background text-brand-primary px-10 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform uppercase tracking-widest"
          >
            {primaryLabel}
          </a>
          {secondaryLabel && secondaryHref && (
            <a
              href={secondaryHref}
              className="bg-brand-primary-hover/20 cta-band-text-dark border border-[#2d1600]/30 px-10 py-4 rounded-lg font-bold text-lg hover:bg-brand-primary-hover/30 transition-colors uppercase tracking-widest"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
