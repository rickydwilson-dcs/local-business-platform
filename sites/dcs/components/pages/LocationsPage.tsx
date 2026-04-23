import type { LocationsPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function SiteLocationsPage({ siteConfig, locations }: LocationsPageTemplateProps) {
  return (
    <div className="min-h-screen font-body">
      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-primary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-headline text-white mb-4 leading-[1.1]">
              Areas We Serve
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-body leading-relaxed">
              We build websites for tradespeople across the UK.
            </p>
          </div>
        </div>
      </header>

      {/* ─── Locations Grid ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          {locations.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-surface-muted-foreground text-lg font-body">
                No locations listed yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location) => (
                <div
                  key={location.slug}
                  className="bg-surface-card rounded-[20px] shadow-md solaris-card-hover solaris-card-accent border border-surface-card-border p-6"
                >
                  {/* Location pin icon */}
                  <div className="mb-4">
                    <span
                      className="material-symbols-outlined text-brand-primary text-3xl leading-none"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      location_on
                    </span>
                  </div>

                  {/* Town name */}
                  <h2 className="font-headline font-bold text-xl text-surface-foreground mb-2">
                    {location.title}
                  </h2>

                  {/* Description */}
                  {location.description && (
                    <p className="text-surface-muted-foreground text-sm leading-relaxed font-body line-clamp-3 mb-4">
                      {location.description}
                    </p>
                  )}

                  {/* Link */}
                  <Link
                    href={`/locations/${location.slug}`}
                    className="inline-flex items-center gap-1 text-brand-primary text-sm font-semibold font-body hover:gap-2 transition-all"
                  >
                    Learn more →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Strip ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent py-16">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-surface-foreground mb-2">
              Get your business found in {siteConfig.address.city} and beyond.
            </h2>
            <p className="text-surface-foreground/70 font-body">
              Let {siteConfig.name} build you a website that wins local customers.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 bg-brand-primary text-white px-10 py-4 rounded-xl text-base font-bold font-body shadow-lg hover:opacity-90 transition-opacity text-center"
          >
            {siteConfig.cta.primary.label}
          </Link>
        </div>
      </section>
    </div>
  );
}
