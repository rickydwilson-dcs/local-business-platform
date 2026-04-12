import type { ServicesPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function CastorServicesPage({ siteConfig, services }: ServicesPageTemplateProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[400px] flex flex-col justify-center bg-brand-primary overflow-hidden">
        <div className="absolute inset-0">
          {/* TODO: wire to heroImage prop or R2 asset */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-services.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto w-full px-6 md:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex mb-8 text-sm font-medium tracking-wide text-white/60">
            <Link
              href="/"
              className="hover:text-white transition-colors after:content-['/'] after:mx-2 after:text-white/40"
            >
              Home
            </Link>
            <span className="text-white">Services</span>
          </nav>
          <h1 className="font-headline text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6 max-w-2xl">
            Our services
          </h1>
          <p className="text-white/80 font-body text-lg max-w-xl leading-relaxed">
            Reliable solutions for {siteConfig.address.city}
            {siteConfig.address.county ? ` and ${siteConfig.address.county}` : ""}. From emergency
            repairs to complete installations, we deliver craft-oriented quality.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-[clamp(4rem,8vw,7rem)] bg-surface-muted">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <header className="mb-16">
            <h2 className="font-headline text-surface-foreground text-3xl md:text-4xl font-bold mb-6">
              Expert solutions for your home
            </h2>
            <div className="w-20 h-1 bg-brand-accent" />
          </header>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-surface-muted-foreground text-lg">
                No services available yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.slug}
                  className="bg-surface-card rounded-xl border border-surface-subtle shadow-[0_2px_8px_rgba(0,0,0,0.07)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
                >
                  {/* Card image placeholder */}
                  <div className="h-48 overflow-hidden bg-surface-muted">
                    {/* TODO: wire to service heroImage or R2 asset */}
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      {service.icon && (
                        <span className="material-symbols-outlined text-brand-accent text-3xl">
                          {service.icon}
                        </span>
                      )}
                      <h3 className="font-headline text-xl font-bold text-surface-foreground leading-tight">
                        {service.title}
                      </h3>
                    </div>
                    {service.description && (
                      <p className="font-body text-surface-muted-foreground mb-6 leading-relaxed flex-grow">
                        {service.description}
                      </p>
                    )}
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-brand-accent font-semibold flex items-center gap-2 group"
                    >
                      Learn more
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-brand-primary py-16 overflow-hidden relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[20rem]">plumbing</span>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 relative z-10 text-left">
          <h2 className="font-headline text-white text-3xl md:text-4xl font-bold mb-4">
            Need help in {siteConfig.address.city}?
          </h2>
          <p className="text-white/80 font-body text-lg mb-8 max-w-xl">
            Our team is ready to help with any project, large or small. Get in touch today for a
            transparent, no-obligation quote.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={siteConfig.cta.primary.href}
              className="bg-brand-accent text-white px-8 py-3 rounded-lg font-semibold text-lg active:translate-y-[1px] transition-transform"
            >
              {siteConfig.cta.primary.label}
            </Link>
            {siteConfig.cta.phone.show && (
              <Link
                href={`tel:${siteConfig.phone}`}
                className="border-[1.5px] border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-brand-primary transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined">call</span>
                {siteConfig.phoneDisplay}
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
