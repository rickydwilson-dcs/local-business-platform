import type { HomePageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function CygnusHomePage({
  siteConfig,
  services,
  heroImage,
  heroHeadline,
  heroSubheading,
  schemaNodes,
}: HomePageTemplateProps) {
  return (
    <div className="min-h-screen bg-surface-background font-body">
      {schemaNodes}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* TODO: Replace with actual hero image from site config / R2 */}
          {heroImage && (
            <div
              className="w-full h-full bg-cover bg-center opacity-40 grayscale-[0.5]"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--color-surface-background), var(--color-surface-background-60, rgba(19,19,19,0.6)), transparent)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-3xl">
            {/* Status badge */}
            {siteConfig.stats && siteConfig.stats.length > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-card rounded-full mb-6 border border-surface-card-border/15">
                <span className="flex h-2 w-2 rounded-full bg-brand-secondary" />
                <span className="text-xs font-body uppercase tracking-[0.2em] font-semibold text-surface-foreground">
                  {siteConfig.stats[0].value} {siteConfig.stats[0].label}
                </span>
              </div>
            )}

            <h1 className="text-7xl md:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8 text-surface-foreground">
              {heroHeadline || (
                <>
                  Your brand, <br />
                  <span className="text-brand-primary">made bold.</span>
                </>
              )}
            </h1>

            <p className="text-xl font-body text-surface-muted-foreground max-w-xl mb-10 leading-relaxed">
              {heroSubheading ||
                `Expert services for ${siteConfig.address.city}. ${siteConfig.tagline}`}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={siteConfig.cta.primary.href}
                className="bg-gradient-to-r from-brand-primary to-brand-primary/80 text-on-brand-primary px-10 py-4 rounded-lg font-bold text-lg hover:scale-[1.02] transition-transform"
              >
                {siteConfig.cta.primary.label}
              </Link>
              <Link
                href="/services"
                className="bg-transparent border border-surface-card-border text-surface-foreground px-10 py-4 rounded-lg font-bold text-lg hover:bg-surface-card transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {siteConfig.stats && siteConfig.stats.length > 0 && (
        <section className="bg-surface-muted border-y border-surface-card-border/10 py-16">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {siteConfig.stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-5xl font-headline font-bold text-brand-primary italic">
                  {stat.value}
                </div>
                <div className="text-xs font-body uppercase tracking-widest text-surface-foreground/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-brand-primary font-body uppercase tracking-[0.3em] font-bold text-sm">
            Capabilities
          </span>
          <h2 className="text-5xl font-headline font-bold mt-4 text-surface-foreground">
            Our Services
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-surface-card rounded-lg overflow-hidden flex flex-col"
            >
              {/* Card image area */}
              <div className="h-64 overflow-hidden relative bg-surface-muted">
                {/* TODO: service hero images from R2 */}
                <div className="w-full h-full bg-surface-muted transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-surface-muted/20" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                {service.icon && (
                  <span className="text-brand-primary font-body uppercase tracking-widest text-[10px] font-bold mb-2">
                    {service.icon}
                  </span>
                )}
                <h3 className="text-2xl font-headline font-bold mb-4 text-surface-foreground">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-sm text-surface-muted-foreground font-body mb-6 flex-1">
                    {service.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  Learn more{" "}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section className="bg-surface-muted py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <span className="text-brand-secondary font-body uppercase tracking-[0.3em] font-bold text-sm">
              What our clients say
            </span>
            <h2 className="text-5xl font-headline font-bold mt-4 text-surface-foreground">
              Trusted by the best
            </h2>
          </div>
          {/* Testimonials are rendered by the site wrapper if available */}
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-brand-primary py-24">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-5xl md:text-6xl font-headline font-bold mt-4 text-on-brand-primary">
              Ready to get started?
            </h2>
            <p className="text-on-brand-primary/80 text-lg font-body font-medium mt-4">
              Contact us today for a free consultation and quote.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="bg-surface-background text-brand-primary px-10 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform uppercase tracking-widest"
            >
              Get a Quote
            </Link>
            {siteConfig.cta.phone.show && (
              <Link
                href={`tel:${siteConfig.phone}`}
                className="border border-on-brand-primary/30 text-on-brand-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-on-brand-primary/10 transition-colors uppercase tracking-widest"
              >
                {siteConfig.phoneDisplay}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
