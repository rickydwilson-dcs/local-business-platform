import Link from 'next/link';
import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { PageHero } from '@/components/page-hero';

interface LocationCard {
  slug: string;
  title: string;
  description?: string;
}

export function LocationsPage({ locations }: { locations: LocationCard[] }) {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Locations', href: '/locations', current: true },
  ];

  return (
    <>
      <BreadcrumbBar items={breadcrumbItems} />

      <PageHero
        title="Our Service Areas"
        description="Vehicle security, fleet electrics and accessories across the South East of England."
      />

      <section className="py-16 sm:py-24 bg-[#080807] border-y border-white/5">
        <div className="container mx-auto px-6">
          {locations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No locations available yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((location) => (
                <Link
                  key={location.slug}
                  href={`/locations/${location.slug}`}
                  className="group bg-surface-card border border-surface-card-border hover:border-brand-primary transition-all p-8 text-center"
                >
                  <span
                    className="material-symbols-outlined text-brand-primary mb-4 inline-block"
                    style={{ fontSize: '3rem' }}
                  >
                    location_on
                  </span>
                  <h2 className="text-xl font-heading font-bold uppercase mb-2">
                    {location.title}
                  </h2>
                  {location.description && (
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                      {location.description}
                    </p>
                  )}
                  <span className="inline-block mt-4 text-brand-primary font-bold uppercase tracking-wide text-sm group-hover:translate-x-1 transition-transform">
                    View services &rarr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
