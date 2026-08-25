import type { LocationsPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';

export function SiteLocationsPage({ siteConfig, locations }: LocationsPageTemplateProps) {
  return (
    <div className="min-h-screen font-sans">
      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-primary py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl">
            <span className="inline-block mb-5 text-xs md:text-sm font-extrabold uppercase tracking-[0.14em] text-white/70">
              Where We Work
            </span>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold font-heading text-white mb-5 leading-[0.95] tracking-[-0.03em]">
              Areas We Serve
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-sans leading-relaxed max-w-xl">
              We build websites for tradespeople across the UK.
            </p>
          </div>
        </div>
      </header>

      {/* ─── Locations List ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          {locations.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-surface-muted-foreground text-lg font-sans">
                No locations listed yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locations.map((location) => (
                <Link
                  key={location.slug}
                  href={`/locations/${location.slug}`}
                  className="location-pill"
                >
                  <span className="flex items-center gap-4 min-w-0">
                    <span
                      className="material-symbols-outlined text-brand-primary text-2xl leading-none flex-shrink-0"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      location_on
                    </span>
                    <span className="min-w-0">
                      <span className="block font-heading font-bold text-lg text-surface-foreground truncate">
                        {location.title}
                      </span>
                      {location.description && (
                        <span className="block text-sm text-surface-muted-foreground font-sans truncate">
                          {location.description}
                        </span>
                      )}
                    </span>
                  </span>
                  <span
                    className="material-symbols-outlined location-pill-arrow text-2xl leading-none flex-shrink-0"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Strip ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent py-16">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-surface-foreground mb-2 tracking-[-0.02em] leading-[1.05]">
              Get your business found in {siteConfig.address.city} and beyond.
            </h2>
            <p className="text-surface-foreground/70 font-sans">
              Let {siteConfig.name} build you a website that wins local customers.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 bg-brand-primary text-white px-10 py-4 rounded-full text-base font-bold font-sans shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-16px_rgba(214,0,107,0.8)] text-center"
          >
            {siteConfig.cta.primary.label}
          </Link>
        </div>
      </section>
    </div>
  );
}
