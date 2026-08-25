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

/**
 * Arrow glyph used for every link/button hover-slide in the r9 language —
 * lifted verbatim from `components/site-header.tsx`'s CTA pill so the
 * micro-interaction matches across the persistent header and this page.
 */
function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-300 ${className}`}
    >
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteServicesPage({ siteConfig, services }: ServicesPageTemplateProps) {
  return (
    <div className="min-h-screen font-sans">
      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-primary py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/70">
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
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
              What we do
            </p>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[0.95]">
              Our Services
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
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
              <p className="text-surface-muted-foreground text-lg">
                No services available yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.slug}
                  className="group relative overflow-hidden rounded-[22px] border border-surface-card-border bg-surface-card p-6 shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-28px_rgba(14,14,18,0.45)]"
                >
                  {/* Top accent bar — scales in from the left on hover, r9's signature card treatment */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-brand-primary transition-transform duration-500 group-hover:scale-x-100"
                  />

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
                  <h2 className="font-extrabold tracking-tight text-xl text-surface-foreground mb-2">
                    {service.title}
                  </h2>

                  {/* Description */}
                  {service.description && (
                    <p className="text-surface-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                      {service.description}
                    </p>
                  )}

                  {/* Link */}
                  <Link
                    href={`/services/${service.slug}`}
                    className="group/link inline-flex items-center gap-1.5 text-brand-primary text-sm font-semibold"
                  >
                    Find out more
                    <ArrowIcon className="group-hover/link:translate-x-1" />
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
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Contact {siteConfig.name} today for a free, no-obligation quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 bg-white text-brand-primary px-10 py-4 rounded-full text-base font-bold shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              {siteConfig.cta.primary.label}
              <ArrowIcon className="group-hover:translate-x-1" />
            </Link>
            {siteConfig.cta.phone.show && (
              <Link
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 border-2 border-white/40 text-white px-10 py-4 rounded-full text-base font-bold transition-colors hover:bg-white/10 hover:border-white"
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
