import type { Metadata } from 'next';
import Link from 'next/link';
import { Schema } from '@platform/core-components';
import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { PageHero } from '@/components/page-hero';
import { listMakes } from '@/lib/car-remaps/repository';
import { absUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Remap Services by Make | DCH Automotive — Viezu Approved Dealer',
  description:
    "Browse ECU remapping performance figures by manufacturer — find your vehicle's make below for Stage 1-3, Economy Tuning and Performance Tuning details.",
  alternates: {
    canonical: absUrl('/car-remaps/by-make'),
  },
};

export default async function CarRemapsByMakePage() {
  const makes = await listMakes();

  return (
    <>
      <BreadcrumbBar
        items={[
          { name: 'Home', href: '/' },
          { name: 'Car Remaps', href: '/car-remaps' },
          { name: 'Remap Services by Make', href: '/car-remaps/by-make', current: true },
        ]}
      />

      <PageHero
        title="Remap Services by Make"
        description="Performance figures and Economy Tuning details for every make we support — find your vehicle's manufacturer below."
      />

      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {makes.map((make) => (
            <Link
              key={make.slug}
              href={`/car-remaps/${make.slug}`}
              className="block bg-surface-card border border-surface-card-border px-4 py-3 text-center text-sm font-heading font-bold uppercase tracking-tight hover:border-brand-primary hover:text-brand-primary transition-colors"
            >
              {make.name}
            </Link>
          ))}
        </div>
      </section>

      <Schema
        org={{
          name: 'DCH Automotive',
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Car Remaps', url: '/car-remaps' },
          { name: 'Remap Services by Make', url: '/car-remaps/by-make' },
        ]}
        webpage={{
          '@type': 'WebPage',
          '@id': absUrl('/car-remaps/by-make#webpage'),
          url: absUrl('/car-remaps/by-make'),
          name: 'Remap Services by Make | DCH Automotive — Viezu Approved Dealer',
          description:
            "Browse ECU remapping performance figures by manufacturer — find your vehicle's make below for Stage 1-3, Economy Tuning and Performance Tuning details.",
        }}
      />
    </>
  );
}
