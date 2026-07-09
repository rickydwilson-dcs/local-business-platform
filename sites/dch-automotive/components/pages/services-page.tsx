import Link from 'next/link';
import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { PageHero } from '@/components/page-hero';

const SERVICE_ICONS: Record<string, string> = {
  'Vehicle Security': 'gps_fixed',
  'Parking Aids': 'sensors',
  'Fleet Solutions': 'local_shipping',
  Accessories: 'settings',
  'Dash Cameras': 'videocam',
};

interface ServiceCard {
  slug: string;
  title: string;
  description?: string;
  image?: string;
}

export function ServicesPage({ services }: { services: ServiceCard[] }) {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services', current: true },
  ];

  return (
    <>
      <BreadcrumbBar items={breadcrumbItems} />

      <PageHero
        title="Our Services"
        description="Vehicle security, fleet electrics and accessories, fitted by City & Guilds and IMI accredited installers."
      />

      <section className="py-16 sm:py-24 bg-[#080807] border-y border-white/5">
        <div className="container mx-auto px-6">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No services available yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const icon = SERVICE_ICONS[service.title] ?? 'build';
                return (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="group bg-surface-card border border-surface-card-border hover:border-brand-primary transition-all"
                  >
                    <div className="h-56 relative overflow-hidden">
                      {service.image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- static Stitch design review asset, not next/image
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt={service.title}
                          src={service.image}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#080807]">
                          <span
                            className="material-symbols-outlined text-brand-primary"
                            style={{ fontSize: '3rem' }}
                          >
                            {icon}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-brand-primary p-2">
                        <span
                          className="material-symbols-outlined text-white"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {icon}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h2 className="text-xl font-heading font-bold uppercase mb-2">
                        {service.title}
                      </h2>
                      {service.description && (
                        <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      )}
                      <span className="inline-block mt-4 text-brand-primary font-bold uppercase tracking-wide text-sm group-hover:translate-x-1 transition-transform">
                        Learn more &rarr;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
