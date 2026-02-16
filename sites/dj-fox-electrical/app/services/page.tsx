/**
 * Services Listing Page
 * =====================
 *
 * Displays all available services with featured services and category grid.
 * Uses Electro theme with PageHero, CircularIconCard, and ImageOverlayCard.
 */

import type { Metadata } from 'next';
import { Zap, Shield, Settings } from 'lucide-react';
import { Schema, AccentUnderline, ContentGrid } from '@platform/core-components';
import { PageHero } from '@/components/ui/page-hero';
import { CircularIconCard } from '@/components/ui/circular-icon-card';
import { ImageOverlayCard } from '@/components/ui/image-overlay-card';
import { getServices } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Our Services | ${siteConfig.business.name}`,
  description: `Professional services offered by ${siteConfig.business.name}. Quality work, competitive prices, and excellent customer service.`,
  keywords: ['services', 'professional services', 'local business'],
  openGraph: {
    title: `Our Services | ${siteConfig.business.name}`,
    description: `Professional services offered by ${siteConfig.business.name}.`,
    url: '/services',
    type: 'website',
  },
};

export default async function ServicesPage() {
  const services = await getServices();

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services', current: true },
  ];

  return (
    <>
      {/* Hero Section */}
      <PageHero
        title="Our Services"
        subtitle="Professional electrical services across Eastbourne & East Sussex"
        imageSrc="djfoxelectrical/hero/services-hero.jpg"
        imageAlt="Electrical services"
        breadcrumbs={breadcrumbItems}
      />

      <main className="min-h-screen">
        {/* Featured Services Section - Overlaps Hero */}
        <section className="section bg-white -mt-16 relative z-10">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Top-Notch <AccentUnderline as="span">Electrical</AccentUnderline> Assistance
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <CircularIconCard
                icon={Zap}
                title="Emergency Callout"
                description="24/7 emergency electrical service. Rapid response for urgent issues."
                linkText="Learn More"
                linkHref="/services/emergency-electrical-callout"
              />
              <CircularIconCard
                icon={Shield}
                title="Safety Testing"
                description="EICR certificates and comprehensive electrical safety inspections."
                linkText="Learn More"
                linkHref="/services/electrical-safety-certificate"
              />
              <CircularIconCard
                icon={Settings}
                title="Installations"
                description="Professional installation of electrical systems and appliances."
                linkText="Learn More"
                linkHref="/services#installation"
              />
            </div>
          </div>
        </section>

        {/* Category Grid Section */}
        <section className="section bg-surface-subtle">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Check Your Electrical Needs
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <ImageOverlayCard
                imageSrc="djfoxelectrical/categories/installation-category.jpg"
                imageAlt="Electrical installations"
                category="Installation"
                title="New Installations"
                href="#installation"
              />
              <ImageOverlayCard
                imageSrc="djfoxelectrical/categories/maintenance-category.jpg"
                imageAlt="Maintenance services"
                category="Maintenance"
                title="Regular Servicing"
                href="#maintenance"
              />
              <ImageOverlayCard
                imageSrc="djfoxelectrical/categories/repair-category.jpg"
                imageAlt="Repair services"
                category="Repair"
                title="Fast Repairs"
                href="#repair"
              />
            </div>
          </div>
        </section>

        {/* All Services Grid */}
        <section className="section bg-white">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                All Our Services
              </h2>
              <p className="text-lg text-surface-foreground max-w-2xl mx-auto">
                Explore our complete range of professional electrical services
              </p>
            </div>
            <ContentGrid
              items={services}
              basePath="/services"
              contentType="services"
              emptyMessage="No services available yet. Check back soon."
              fallbackDescription={(title) =>
                `Learn more about our ${title.toLowerCase()} services.`
              }
            />
          </div>
        </section>
      </main>

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
        webpage={{
          '@type': 'CollectionPage',
          '@id': absUrl('/services#collection'),
          url: absUrl('/services'),
          name: `${siteConfig.business.name} Services`,
          description: `Professional services offered by ${siteConfig.business.name}.`,
        }}
      />
    </>
  );
}
