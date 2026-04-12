import type { ServicesPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function CygnusServicesPage({ siteConfig, services }: ServicesPageTemplateProps) {
  return (
    <div className="min-h-screen bg-surface-background font-body">
      {/* Breadcrumb */}
      <div className="px-6 md:px-10 mb-12 pt-32">
        <nav className="flex text-xs uppercase tracking-widest text-surface-foreground/40 font-body">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Home
          </Link>
          <span className="mx-4 text-surface-foreground/20">/</span>
          <span className="text-brand-primary">Services</span>
        </nav>
      </div>

      {/* Page Header */}
      <header className="px-6 md:px-10 mb-20">
        <h1 className="text-7xl md:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8 text-surface-foreground">
          What we do
        </h1>
        <div className="w-full h-px bg-surface-card-border opacity-20" />
      </header>

      {/* Services Grid */}
      <section className="px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-card-border/10 border-y border-surface-card-border/10">
        {services.length === 0 ? (
          <div className="bg-surface-card p-12 col-span-2 text-center">
            <p className="text-surface-muted-foreground text-lg">
              No services available yet. Check back soon.
            </p>
          </div>
        ) : (
          services.map((service) => (
            <div key={service.slug} className="bg-surface-card p-8 md:p-12 group">
              {/* Service image area */}
              <div className="aspect-[16/9] overflow-hidden mb-8 relative bg-surface-muted">
                {/* TODO: service hero images from R2 */}
                <div className="w-full h-full bg-surface-muted grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div
                  className="absolute inset-0 mix-blend-multiply group-hover:bg-transparent transition-all"
                  style={{
                    backgroundColor: "rgba(var(--color-brand-primary-rgb, 247,148,29), 0.1)",
                  }}
                />
              </div>

              {service.icon && (
                <span className="text-brand-primary font-body uppercase tracking-[0.2em] text-xs font-bold">
                  {service.icon}
                </span>
              )}

              <h2 className="mt-4 text-5xl font-headline font-bold text-surface-foreground">
                {service.title}
              </h2>

              {service.description && (
                <p className="mt-6 text-surface-foreground/60 leading-relaxed max-w-md font-body">
                  {service.description}
                </p>
              )}

              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-2 mt-8 text-brand-primary font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform"
              >
                Learn more <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          ))
        )}
      </section>

      {/* CTA Band */}
      <section className="mt-20 px-6 md:px-10 pb-20">
        <div className="bg-brand-primary text-on-brand-primary px-8 py-20 md:px-20 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="hidden lg:block">
              <span
                className="material-symbols-outlined text-8xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                precision_manufacturing
              </span>
            </div>
            <div>
              <h2 className="text-5xl md:text-7xl font-headline font-bold italic text-on-brand-primary">
                Ready to get started?
              </h2>
              <p className="mt-4 text-on-brand-primary/80 font-bold uppercase tracking-widest text-sm">
                {siteConfig.tagline}
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="bg-surface-background text-brand-primary px-12 py-6 text-xl font-black uppercase tracking-tighter hover:bg-surface-card transition-colors whitespace-nowrap"
          >
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
