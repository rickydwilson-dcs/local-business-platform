/**
 * Services Listing Page
 *
 * Displays all available services with featured services and category grid.
 */

import type { Metadata } from 'next';
import { Zap, Shield, Settings, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  Schema,
  AccentUnderline,
  ContentGrid,
  PageHeroImage,
  ImageOverlayCard,
} from '@platform/core-components';
import { getServices } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { FadeIn } from '@/components/motion/fade-in';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';

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

const featuredServices = [
  {
    icon: Zap,
    title: 'Emergency Callout',
    description: '24/7 emergency electrical service. Rapid response for urgent issues that cannot wait — we arrive fast and fix it right.',
    href: '/services/emergency-electrical-callout',
  },
  {
    icon: Shield,
    title: 'Safety Testing',
    description: 'EICR certificates and comprehensive electrical safety inspections. Complete peace of mind for landlords, homeowners, and businesses.',
    href: '/services/electrical-safety-certificate',
  },
  {
    icon: Settings,
    title: 'Installations',
    description: 'Professional installation of electrical systems and appliances, from consumer units to EV chargers and solar panels.',
    href: '/services#installation',
  },
];

export default async function ServicesPage() {
  const services = await getServices();

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
      <PageHeroImage
        title="Our Services"
        subtitle="Professional electrical services across Eastbourne & East Sussex"
        imageSrc="djfoxelectrical/hero/services-hero.jpg"
        imageAlt="Electrical services"
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen">
        {/* Featured Services — zig-zag rows, not 3-col equal cards */}
        <section className="section bg-white">
          <div className="container-narrow">
            <FadeIn>
              <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                Top services
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-12">
                Top-notch <AccentUnderline as="span">electrical</AccentUnderline> assistance
              </h2>
            </FadeIn>

            <div className="space-y-px border-t border-surface-card-border">
              {featuredServices.map(({ icon: Icon, title, description, href }, i) => (
                <FadeIn key={title} delay={i * 0.08}>
                  <Link
                    href={href}
                    className="group grid md:grid-cols-[auto_1fr_auto] gap-6 items-center py-8 border-b border-surface-card-border hover:bg-surface-muted px-4 -mx-4 rounded-xl transition-colors duration-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-surface-foreground mb-1 group-hover:text-brand-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-surface-muted-foreground leading-relaxed max-w-2xl">
                        {description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-surface-muted-foreground group-hover:text-brand-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 hidden md:block" />
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Category Image Grid */}
        <section className="section bg-surface-muted">
          <div className="container-narrow">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-2">
                Browse services by type
              </h2>
              <p className="text-surface-muted-foreground mb-10 max-w-xl">
                Explore our comprehensive range of electrical services organised by category.
              </p>
            </FadeIn>
            <StaggerChildren className="grid md:grid-cols-3 gap-6" staggerDelay={0.1}>
              <StaggerItem>
                <ImageOverlayCard
                  imageSrc="djfoxelectrical/categories/installation-category.jpg"
                  imageAlt="New electrical installations"
                  category="Installation"
                  title="Installation Services"
                  href="#installation-services"
                />
              </StaggerItem>
              <StaggerItem>
                <ImageOverlayCard
                  imageSrc="djfoxelectrical/categories/maintenance-category.jpg"
                  imageAlt="Electrical maintenance and upgrades"
                  category="Maintenance"
                  title="Maintenance & Upgrades"
                  href="#maintenance-services"
                />
              </StaggerItem>
              <StaggerItem>
                <ImageOverlayCard
                  imageSrc="djfoxelectrical/categories/repair-category.jpg"
                  imageAlt="Emergency electrical repairs"
                  category="Repair"
                  title="Repair & Emergency"
                  href="#repair-services"
                />
              </StaggerItem>
            </StaggerChildren>
          </div>
        </section>

        {/* Installation Services */}
        <section id="installation-services" className="section bg-white scroll-mt-20">
          <div className="container-narrow">
            <FadeIn>
              <div className="mb-12">
                <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                  Installation
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-3">
                  Installation services
                </h2>
                <p className="text-surface-muted-foreground max-w-xl">
                  Professional installation of new electrical systems, equipment, and appliances
                </p>
              </div>
            </FadeIn>
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

        {/* Maintenance Services */}
        <section id="maintenance-services" className="section bg-surface-muted scroll-mt-20">
          <div className="container-narrow">
            <FadeIn>
              <div className="mb-12">
                <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                  Maintenance
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-3">
                  Maintenance & upgrades
                </h2>
                <p className="text-surface-muted-foreground max-w-xl">
                  Regular maintenance, safety inspections, and system upgrades
                </p>
              </div>
            </FadeIn>
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

        {/* Repair & Emergency */}
        <section id="repair-services" className="section bg-white scroll-mt-20">
          <div className="container-narrow">
            <FadeIn>
              <div className="mb-12">
                <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                  Repair & emergency
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-3">
                  Repair & emergency services
                </h2>
                <p className="text-surface-muted-foreground max-w-xl">
                  24/7 emergency callouts, fault finding, and electrical repairs
                </p>
              </div>
            </FadeIn>
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

        {uncategorizedServices.length > 0 && (
          <section className="section bg-surface-muted">
            <div className="container-narrow">
              <FadeIn>
                <div className="mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground">
                    Other Services
                  </h2>
                </div>
              </FadeIn>
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
