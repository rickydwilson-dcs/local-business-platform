/**
 * Locations Listing Page
 * ======================
 *
 * Displays all service area locations in the site's editorial dark style.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Schema } from '@platform/core-components';
import { getLocations } from '@/lib/content';
import { getImageUrl } from '@/lib/image';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { PageHeader } from '@/components/ui/page-header';
import { CtaBand } from '@/components/ui/cta-band';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Service Areas | Locations | ${siteConfig.business.name}`,
  description: `${siteConfig.business.name} serves customers across ${siteConfig.serviceAreas.join(', ')}. Find our services in your area.`,
  keywords: ['locations', 'service areas', 'local services', ...siteConfig.serviceAreas],
  openGraph: {
    title: `Service Areas | ${siteConfig.business.name}`,
    description: `${siteConfig.business.name} serves customers across multiple locations.`,
    url: '/locations',
    type: 'website',
  },
};

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <>
      <PageHeader
        overline="Service areas"
        title="Where we work"
        description={`${siteConfig.business.name} serves businesses across ${siteConfig.serviceAreas.join(', ')} and surrounding areas.`}
      />

      {/* Locations Grid */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-card-border/20">
          {locations.map((location) => {
            const heroImage =
              (location.heroImage as string | undefined) ||
              (location.hero as { image?: string } | undefined)?.image;
            const imageSrc = heroImage ? getImageUrl(heroImage) : '/stitch-images/img-019.jpg';
            const towns = location.towns as string[] | undefined;

            return (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="group bg-surface-muted p-8 md:p-12 block"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/9] mb-8">
                  <Image
                    fill
                    src={imageSrc}
                    alt={`Services in ${location.title}`}
                    unoptimized={process.env.NODE_ENV === 'development'}
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply group-hover:bg-transparent transition-all duration-500" />
                </div>
                <span className="text-brand-primary uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
                  {(location.isHeadquarters as boolean) ? 'Headquarters' : 'Service area'}
                </span>
                <h2 className="text-4xl font-headline font-bold text-surface-foreground mb-4">
                  {location.title}
                </h2>
                <p className="text-surface-muted-foreground mb-6 leading-relaxed line-clamp-2">
                  {location.description ||
                    `Professional print and graphics services in ${location.title}.`}
                </p>
                {towns && towns.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {towns.slice(0, 4).map((town, i) => (
                      <span
                        key={i}
                        className="text-xs text-surface-muted-foreground uppercase tracking-widest"
                      >
                        {town}
                        {i < Math.min(towns.length, 4) - 1 ? ' /' : ''}
                      </span>
                    ))}
                  </div>
                )}
                <span className="inline-flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  View location{' '}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <CtaBand
        headline="Need local service?"
        subtext="Contact us for a free quote. We cover all of East Sussex and beyond."
        primaryLabel="Get a Quote"
        primaryHref="/contact"
      />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/locations' },
        ]}
        webpage={{
          '@type': 'CollectionPage',
          '@id': absUrl('/locations#collection'),
          url: absUrl('/locations'),
          name: `${siteConfig.business.name} Service Areas`,
          description: `${siteConfig.business.name} serves customers across multiple locations.`,
        }}
      />
    </>
  );
}
