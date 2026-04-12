import type { ServicesPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

export function NovaServicesPage({ siteConfig, services }: ServicesPageTemplateProps) {
  return (
    <>
      {/* Breadcrumb & Header */}
      <header className="bg-surface-muted py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6 font-medium">
            <Link href="/" className="hover:text-brand-primary transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-brand-primary">Services</span>
          </nav>
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-surface-foreground">
            Our Services
          </h1>
          <p className="max-w-2xl text-xl text-zinc-600 leading-relaxed">
            Explore our comprehensive range of professional services. {siteConfig.name} is committed
            to delivering precision and creativity to every project in {siteConfig.address.city} and
            beyond.
          </p>
        </div>
      </header>

      {/* Service Card Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 text-lg">No services available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-md border border-zinc-100 transition-all hover:shadow-xl"
              >
                {/* Image area */}
                <div className="h-56 overflow-hidden relative bg-surface-muted">
                  {/* TODO: Service images from frontmatter heroImage */}
                  <div className="w-full h-full bg-zinc-200 transition-transform duration-500 group-hover:scale-105" />
                  {service.icon && (
                    <div className="absolute top-4 left-4 bg-brand-secondary text-white p-3 rounded-lg shadow-lg">
                      <span className="material-symbols-outlined">{service.icon}</span>
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h2 className="font-headline text-2xl font-bold mb-3 text-surface-foreground">
                    {service.title}
                  </h2>
                  {service.description && (
                    <p className="text-zinc-600 mb-6 flex-grow">{service.description}</p>
                  )}
                  <span className="flex items-center gap-2 text-brand-primary font-bold group-hover:gap-3 transition-all">
                    Learn more{" "}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Band */}
      <section className="bg-brand-primary py-20 px-6 overflow-hidden relative">
        {/* Background decorative icon */}
        <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
          <span className="material-symbols-outlined text-[20rem]">content_cut</span>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-8">
            <span className="material-symbols-outlined text-white text-3xl">architecture</span>
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white mb-6">
            Get a Quote for Your Project
          </h2>
          <p className="text-white/90 text-xl mb-10 font-medium">
            Ready to get started? Contact our experts for a tailored solution that fits your budget
            and timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-brand-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-brand-secondary hover:text-white transition-all shadow-xl"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/contact"
              className="bg-brand-accent text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all shadow-xl border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
