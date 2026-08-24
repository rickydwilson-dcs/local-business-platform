import type { ServicesPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';

const serviceIcons: Record<string, string> = {
  default: 'build_circle',
  garden: 'yard',
  cleaning: 'cleaning_services',
  electrical: 'bolt',
  plumbing: 'plumbing',
  painting: 'format_paint',
  landscaping: 'nature',
};

function resolveServiceIcon(title: string, provided?: string): string {
  if (provided) return provided;
  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(serviceIcons)) {
    if (key !== 'default' && lower.includes(key)) return icon;
  }
  return serviceIcons.default;
}

export function SiteServicesPage({ siteConfig, services }: ServicesPageTemplateProps) {
  return (
    <div className="min-h-screen font-body">
      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-primary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/70 font-body">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="material-symbols-outlined text-sm leading-none align-middle">
                  chevron_right
                </span>
              </li>
              <li>
                <span className="text-white font-semibold" aria-current="page">
                  Services
                </span>
              </li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold font-headline text-white mb-4 leading-[1.1]">
              Our Services
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-body leading-relaxed">
              Everything you need to get found online and win more jobs.
            </p>
          </div>
        </div>
      </header>

      {/* ─── Services Grid ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          {services.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-surface-muted-foreground text-lg font-body">
                No services available yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.slug}
                  className="bg-surface-card rounded-[20px] shadow-md solaris-card-hover solaris-card-accent border border-surface-card-border p-6"
                >
                  {/* Icon */}
                  <div className="bg-brand-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
                    <span
                      className="material-symbols-outlined text-brand-primary text-3xl leading-none"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      {resolveServiceIcon(service.title, service.icon)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-headline font-bold text-xl text-surface-foreground mb-2">
                    {service.title}
                  </h2>

                  {/* Description */}
                  {service.description && (
                    <p className="text-surface-muted-foreground text-sm leading-relaxed font-body line-clamp-3 mb-4">
                      {service.description}
                    </p>
                  )}

                  {/* Link */}
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1 text-brand-primary text-sm font-semibold font-body hover:gap-2 transition-all"
                  >
                    Find out more →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-primary py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-white/80 font-body mb-10 max-w-xl mx-auto">
            Contact {siteConfig.name} today for a free, no-obligation quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-brand-primary px-10 py-4 rounded-xl text-base font-bold shadow-lg hover:bg-white/90 transition-colors text-center font-body"
            >
              {siteConfig.cta.primary.label}
            </Link>
            {siteConfig.cta.phone.show && (
              <Link
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 border-2 border-white text-white px-10 py-4 rounded-xl text-base font-bold hover:bg-white/10 transition-colors font-body"
              >
                <span className="material-symbols-outlined text-xl leading-none" aria-hidden="true">
                  call
                </span>
                {siteConfig.phoneDisplay}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
