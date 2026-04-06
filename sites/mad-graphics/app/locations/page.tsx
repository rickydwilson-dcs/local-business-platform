import type { Metadata } from 'next';
import Link from 'next/link';
import { Schema } from '@platform/core-components';
import { getLocations } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Service Areas | Locations | ${siteConfig.business.name}`,
  description: `${siteConfig.business.name} serves customers across ${siteConfig.serviceAreas.join(', ')}. Find vehicle graphics, signs, and print services in your area.`,
  keywords: ['locations', 'service areas', 'East Sussex', ...siteConfig.serviceAreas],
  openGraph: {
    title: `Service Areas | ${siteConfig.business.name}`,
    description: `${siteConfig.business.name} serves businesses across East Sussex. Find local vehicle graphics and print services near you.`,
    url: absUrl('/locations'),
    type: 'website',
  },
  alternates: { canonical: absUrl('/locations') },
};

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <>
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
          description: `${siteConfig.business.name} serves customers across multiple locations in East Sussex.`,
        }}
      />

      {/* Breadcrumb */}
      <div className="px-6 md:px-10 mb-12 pt-8">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-surface-muted-foreground">
          <Link href="/" className="hover:text-surface-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-surface-foreground">Locations</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="px-6 md:px-10 mb-20">
        <span className="text-brand-primary font-body uppercase tracking-[0.3em] font-bold text-sm block mb-4">
          Where we work
        </span>
        <h1 className="text-7xl md:text-8xl font-headline font-bold italic text-surface-foreground">
          Service Areas
        </h1>
        <p className="text-surface-muted-foreground text-lg mt-6 max-w-2xl font-body">
          We serve businesses across East Sussex from our Polegate workshop. Vehicle collection and
          delivery, or drop-off by arrangement.
        </p>
        <div className="mt-8 h-[2px] bg-surface-border w-full" />
      </div>

      {/* Locations Grid */}
      <div className="px-6 md:px-10 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-surface-border">
          {locations.map((location) => (
            <a
              key={location.slug}
              href={`/locations/${location.slug}`}
              className="card group hover:bg-surface-muted transition-colors duration-300 border-0 border-r border-b border-surface-border"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-headline font-bold text-surface-foreground group-hover:text-brand-primary transition-colors">
                  {location.title}
                </h2>
                <span className="material-symbols-outlined text-surface-muted-foreground group-hover:text-brand-primary transition-colors flex-shrink-0 mt-1">
                  arrow_forward
                </span>
              </div>
              {location.description && (
                <p className="text-surface-muted-foreground text-sm mt-3 leading-relaxed line-clamp-3 font-body">
                  {location.description}
                </p>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* CTA Band */}
      <div className="px-6 md:px-10 pb-20">
        <div className="bg-brand-primary px-8 py-20 md:px-20 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-headline font-bold italic text-surface-foreground">
              Not sure if we cover your area?
            </h2>
            <p className="text-[var(--color-brand-on-primary)]/70 text-lg mt-2 font-body">
              Call or email us — we&apos;re happy to confirm your location and arrange a quote.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-surface-background text-brand-primary px-8 py-4 font-headline uppercase tracking-tight text-sm font-bold hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            Get in Touch
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </a>
        </div>
      </div>
    </>
  );
}
