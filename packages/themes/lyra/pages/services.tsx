import type { ServicesPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

/** Icon mapping for service cards — cycles through these Material Symbols */
const SERVICE_ICONS = [
  "grass",
  "content_cut",
  "delete_sweep",
  "local_florist",
  "cleaning_services",
  "auto_awesome",
  "yard",
  "eco",
  "forest",
];

export function LyraServicesPage({ siteConfig, services }: ServicesPageTemplateProps) {
  return (
    <main className="pt-24 pb-20">
      {/* Hero / Header Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-surface-muted-foreground mb-6 uppercase tracking-widest font-body">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-brand-primary font-semibold">Services</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-headline text-brand-primary leading-tight tracking-tight mb-8">
              Our Professional <br />
              <span className="italic">Services</span>
            </h1>
            <p className="text-xl text-surface-muted-foreground font-body max-w-lg leading-relaxed">
              Professional, reliable care for residential and commercial properties across{" "}
              {siteConfig.address.city}. Rooted in tradition, growing through quality.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-brand-accent text-surface-foreground px-6 py-4 rounded-lg inline-flex items-center space-x-3 mb-4">
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="font-body text-sm uppercase tracking-wider font-bold">
                Now Booking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-surface-muted-foreground text-lg font-body">
              No services available yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className={`group relative overflow-hidden rounded-xl flex flex-col transition-all duration-500 ${
                    isEven
                      ? "bg-surface-muted hover:bg-surface-card"
                      : "bg-surface-card hover:bg-surface-muted"
                  }`}
                >
                  {/* Image area */}
                  <div className="aspect-[4/3] overflow-hidden bg-brand-primary/5">
                    <div className="w-full h-full bg-gradient-to-br from-brand-primary/10 to-transparent transition-transform duration-700 group-hover:scale-105" />
                  </div>

                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="material-symbols-outlined text-brand-secondary text-3xl">
                        {service.icon || SERVICE_ICONS[index % SERVICE_ICONS.length]}
                      </span>
                    </div>
                    <h3 className="text-2xl font-headline text-brand-primary mb-3">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="text-surface-muted-foreground font-body mb-8 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    )}
                    <span className="mt-auto inline-flex items-center text-brand-primary font-bold hover:gap-2 transition-all font-body">
                      Learn more{" "}
                      <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Asymmetric CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative bg-brand-primary rounded-xl p-12 md:p-20 overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[20rem] absolute -right-20 -top-20 text-white">
              potted_plant
            </span>
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-headline text-white leading-tight mb-6">
              Ready to get started?
            </h2>
            <p className="text-[var(--color-brand-light)] text-lg mb-10 font-body opacity-80">
              Contact our expert team today for a custom plan tailored specifically to your
              property&apos;s needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={siteConfig.cta.primary.href}
                className="bg-brand-accent text-surface-foreground px-8 py-4 rounded-lg font-bold hover:brightness-110 transition-all flex items-center justify-center space-x-2"
              >
                <span>{siteConfig.cta.primary.label}</span>
                <span className="material-symbols-outlined text-lg">description</span>
              </Link>
              {siteConfig.cta.phone.show && (
                <Link
                  href={`tel:${siteConfig.phone}`}
                  className="border border-[var(--color-brand-light)] text-white px-8 py-4 rounded-lg font-bold hover:bg-[var(--color-brand-dark)] transition-all flex items-center justify-center space-x-2"
                >
                  <span>Call Us</span>
                  <span className="material-symbols-outlined text-lg">phone_in_talk</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
