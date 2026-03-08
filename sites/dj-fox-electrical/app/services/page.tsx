/**
 * Services Listing Page
 * =====================
 *
 * Displays all available services with featured services and category grid.
 * Uses Electro theme with PageHero, CircularIconCard, and ImageOverlayCard.
 */

import type { Metadata } from 'next';
import { Zap, Shield, Settings } from 'lucide-react';
import { Schema, AccentUnderline, ContentGrid, PageHeroImage, CircularIconCard, ImageOverlayCard } from '@platform/core-components';
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

  // Filter services by category
  const installationServices = services.filter((s) => s.category === 'installation');
  const maintenanceServices = services.filter((s) => s.category === 'maintenance');
  const repairServices = services.filter((s) => s.category === 'repair');
  const uncategorizedServices = services.filter((s) => !s.category);

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services', current: true },
  ];

  return (
    <>
      {/* Hero Section */}
      <PageHeroImage
        title="Our Services"
        subtitle="Professional electrical services across Eastbourne & East Sussex"
        imageSrc="djfoxelectrical/hero/services-hero.jpg"
        imageAlt="Electrical services"
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen">
        {/* Featured Services Section */}
        <section className="section bg-white">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
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
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
                Browse Services by Type
              </h2>
              <p className="text-lg text-surface-foreground max-w-2xl mx-auto mt-4">
                Explore our comprehensive range of electrical services organized by category.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <ImageOverlayCard
                imageSrc="djfoxelectrical/categories/installation-category.jpg"
                imageAlt="New electrical installations"
                category="Installation"
                title="Installation Services"
                href="#installation-services"
              />
              <ImageOverlayCard
                imageSrc="djfoxelectrical/categories/maintenance-category.jpg"
                imageAlt="Electrical maintenance and upgrades"
                category="Maintenance"
                title="Maintenance & Upgrades"
                href="#maintenance-services"
              />
              <ImageOverlayCard
                imageSrc="djfoxelectrical/categories/repair-category.jpg"
                imageAlt="Emergency electrical repairs"
                category="Repair"
                title="Repair & Emergency"
                href="#repair-services"
              />
            </div>
          </div>
        </section>

        {/* Installation Services Section */}
        <section id="installation-services" className="section bg-white scroll-mt-20">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
                Installation Services
              </h2>
              <p className="text-lg text-surface-foreground max-w-2xl mx-auto">
                Professional installation of new electrical systems, equipment, and appliances
              </p>
            </div>
            <ContentGrid
              items={installationServices}
              basePath="/services"
              contentType="services"
              emptyMessage="No installation services available."
              fallbackDescription={(title) =>
                `Professional ${title.toLowerCase()} installation services.`
              }
            />
          </div>
        </section>

        {/* Maintenance Services Section */}
        <section id="maintenance-services" className="section bg-surface-subtle scroll-mt-20">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
                Maintenance & Upgrades
              </h2>
              <p className="text-lg text-surface-foreground max-w-2xl mx-auto">
                Regular maintenance, safety inspections, and system upgrades
              </p>
            </div>
            <ContentGrid
              items={maintenanceServices}
              basePath="/services"
              contentType="services"
              emptyMessage="No maintenance services available."
              fallbackDescription={(title) =>
                `Professional ${title.toLowerCase()} maintenance services.`
              }
            />
          </div>
        </section>

        {/* Repair & Emergency Services Section */}
        <section id="repair-services" className="section bg-white scroll-mt-20">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
                Repair & Emergency Services
              </h2>
              <p className="text-lg text-surface-foreground max-w-2xl mx-auto">
                24/7 emergency callouts, fault finding, and electrical repairs
              </p>
            </div>
            <ContentGrid
              items={repairServices}
              basePath="/services"
              contentType="services"
              emptyMessage="No repair services available."
              fallbackDescription={(title) =>
                `Professional ${title.toLowerCase()} repair services.`
              }
            />
          </div>
        </section>

        {/* Optional: Uncategorized Services (remove once all categorized) */}
        {uncategorizedServices.length > 0 && (
          <section className="section bg-surface-subtle">
            <div className="container-narrow">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
                  Other Services
                </h2>
              </div>
              <ContentGrid
                items={uncategorizedServices}
                basePath="/services"
                contentType="services"
                emptyMessage="No other services available."
              />
            </div>
          </section>
        )}
      </div>

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
