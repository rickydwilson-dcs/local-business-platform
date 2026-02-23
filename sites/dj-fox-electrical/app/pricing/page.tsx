/**
 * Pricing Page - D J Fox Electrical
 *
 * Server Component displaying transparent pricing information
 * with emergency callout details, job cost estimates, system checks,
 * and FAQ section.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Clock, Shield, CheckCircle2, Phone, Calendar, AlertCircle } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { Schema, Breadcrumbs, PageHero, AccentUnderline } from '@platform/core-components';
import { getImageUrl } from '@/lib/image';
import { PricingPageClient } from './pricing-page.client';

export const metadata: Metadata = {
  title: `Pricing & Rates | ${siteConfig.business.name}`,
  description: `Transparent pricing for electrical services in ${siteConfig.business.address.city} and ${siteConfig.serviceAreas.join(', ')}. Emergency callouts, installations, rewiring, testing and more. Free quotes available.`,
  alternates: {
    canonical: absUrl('/pricing'),
  },
};

interface JobCost {
  title: string;
  priceRange: string;
  description: string;
  icon: React.ReactNode;
}

const jobCosts: JobCost[] = [
  {
    title: 'Consumer Unit Upgrade',
    priceRange: '£400-800',
    description: 'Replace old fuse box with modern RCD protection',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    title: 'Full House Rewire (3-bed)',
    priceRange: '£3,500-6,000',
    description: 'Complete electrical rewiring to current standards',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: 'EICR Certificate',
    priceRange: '£150-350',
    description: 'Electrical Installation Condition Report',
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
  {
    title: 'EV Charger Installation',
    priceRange: '£800-1,200',
    description: 'Home electric vehicle charging point',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: 'Additional Sockets',
    priceRange: '£80-150 each',
    description: 'New power outlets in convenient locations',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: 'LED Lighting Upgrade',
    priceRange: '£200-500 per room',
    description: 'Energy-efficient LED lighting installation',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: 'Smart Home Wiring',
    priceRange: '£500-2,000',
    description: 'Future-proof structured cabling and automation',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: 'Solar Panel Installation',
    priceRange: '£4,000-8,000',
    description: 'Complete solar PV system design and installation',
    icon: <Zap className="w-6 h-6" />,
  },
];

export default function PricingPage() {
  const breadcrumbItems = [{ name: 'Pricing', href: '/pricing', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <main className="min-h-screen bg-surface-background">
        {/* Full-Width Hero */}
        <PageHero
          title="Transparent Pricing"
          description="No hidden fees, clear costs, free quotes"
        />

        {/* Emergency Callout Banner */}
        <section className="bg-black text-white py-12">
          <div className="container-standard">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-3">24/7 Emergency Callout</h2>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-brand-primary flex-shrink-0" />
                      <span className="text-sm">Available 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-brand-primary flex-shrink-0" />
                      <span className="text-sm">1-2 Hour Response</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0" />
                      <span className="text-sm">£100 Callout Fee</span>
                    </div>
                  </div>
                  <p className="text-surface-muted-foreground mb-4">
                    Our £100 emergency callout fee includes up to 2 hours of labour. Additional work
                    charged at standard rates. We respond urgently to electrical emergencies across{' '}
                    {siteConfig.business.address.city} and surrounding areas.
                  </p>
                  <Link
                    href={`tel:${PHONE_TEL}`}
                    className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primaryHover transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now: {PHONE_DISPLAY}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hourly Rates */}
        <section className="section-standard">
          <div className="container-standard">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-surface-foreground mb-8 text-center">
                Hourly Rates
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Standard Work */}
                <div className="bg-surface-subtle rounded-lg p-6 border-2 border-surface-border">
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-surface-foreground mb-2">
                      Standard Work
                    </h3>
                    <div className="text-3xl font-bold text-brand-primary mb-2">£45-65</div>
                    <p className="text-sm text-surface-muted-foreground">per hour</p>
                    <p className="text-sm text-surface-muted-foreground mt-4">
                      Planned electrical work during normal business hours
                    </p>
                  </div>
                </div>

                {/* Emergency Callout - Featured with Red Border */}
                <div className="bg-brand-primary text-white rounded-lg p-6 border-4 border-brand-primary shadow-xl transform md:scale-105">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Emergency Callout</h3>
                    <div className="text-3xl font-bold mb-2">£100</div>
                    <p className="text-sm text-white/90">includes 2 hours labour</p>
                    <p className="text-sm text-white/90 mt-4">
                      24/7 availability with rapid 1-2 hour response time
                    </p>
                  </div>
                </div>

                {/* Commercial Work */}
                <div className="bg-surface-subtle rounded-lg p-6 border-2 border-surface-border">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-surface-foreground mb-2">
                      Commercial Work
                    </h3>
                    <div className="text-3xl font-bold text-brand-primary mb-2">£50-75</div>
                    <p className="text-sm text-surface-muted-foreground">per hour</p>
                    <p className="text-sm text-surface-muted-foreground mt-4">
                      Business premises, offices, and commercial installations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Job Costs */}
        <section className="section-standard bg-surface-muted">
          <div className="container-standard">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-surface-foreground mb-4 text-center">
                Example Job Costs
              </h2>
              <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
                Typical price ranges for common electrical work. Final quotes depend on specific
                requirements, property size, and complexity.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {jobCosts.map((job) => (
                  <div
                    key={job.title}
                    className="bg-surface-background rounded-lg p-6 border border-surface-border hover:border-brand-primary transition-colors hover:shadow-lg"
                  >
                    <div className="text-brand-primary mb-3">{job.icon}</div>
                    <h3 className="text-lg font-bold text-surface-foreground mb-2">{job.title}</h3>
                    <div className="text-2xl font-bold text-brand-primary mb-2">
                      {job.priceRange}
                    </div>
                    <p className="text-sm text-surface-muted-foreground">{job.description}</p>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-8 p-6 bg-surface-background border-l-4 border-brand-primary rounded-r-lg">
                <p className="text-sm text-surface-muted-foreground">
                  <strong className="text-surface-foreground">Please note:</strong> Prices shown are
                  indicative ranges based on typical installations. Final quotes depend on specific
                  requirements, property access, existing installations, and materials needed. We
                  always provide a free, detailed quote before starting work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Image + Checklist Section */}
        <section className="section-standard">
          <div className="container-standard">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={getImageUrl('djfoxelectrical/sections/electrical-inspection.jpg')}
                    alt="Electrical system check"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Checklist */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-6">
                    Comprehensive <AccentUnderline as="span">Electrical</AccentUnderline> System
                    Check
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle2 className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span className="text-surface-foreground">
                        Consumer unit inspection and testing
                      </span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle2 className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span className="text-surface-foreground">
                        Circuit protection verification
                      </span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle2 className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span className="text-surface-foreground">
                        Socket and switch condition check
                      </span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle2 className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span className="text-surface-foreground">Full safety compliance report</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle2 className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span className="text-surface-foreground">
                        Recommendations for any remedial work
                      </span>
                    </li>
                  </ul>
                  <p className="text-surface-muted-foreground mt-8">
                    Our comprehensive electrical system checks ensure your home or business is safe
                    and compliant with current electrical standards. Get peace of mind with a
                    detailed report.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-surface-foreground mb-8 text-center">
                Why Choose D J Fox Electrical?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-foreground mb-2">Transparent Pricing</h3>
                    <p className="text-sm text-surface-muted-foreground">
                      No hidden fees or surprise charges. We provide detailed quotes before starting
                      any work.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-foreground mb-2">NICEIC Approved</h3>
                    <p className="text-sm text-surface-muted-foreground">
                      Fully qualified and accredited electricians with £5M public liability
                      insurance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-foreground mb-2">Quality Workmanship</h3>
                    <p className="text-sm text-surface-muted-foreground">
                      15+ years of professional experience with meticulous attention to detail and
                      safety.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-foreground mb-2">Guaranteed Work</h3>
                    <p className="text-sm text-surface-muted-foreground">
                      All work guaranteed with comprehensive warranty and certification provided.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-foreground mb-2">
                      24/7 Emergency Service
                    </h3>
                    <p className="text-sm text-surface-muted-foreground">
                      Round-the-clock availability for urgent electrical issues with rapid response
                      times.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-foreground mb-2">Local & Reliable</h3>
                    <p className="text-sm text-surface-muted-foreground">
                      Based in {siteConfig.business.address.city}, serving local communities with
                      dependable service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <PricingPageClient />

        {/* Free Quote CTA */}
        <section className="section-standard bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
          <div className="container-standard">
            <div className="max-w-4xl mx-auto text-center">
              <Calendar className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Get Your Free Quote Today</h2>
              <p className="text-xl mb-8 text-white/90">
                Request a detailed, no-obligation quote for your electrical project. We'll assess
                your requirements and provide transparent pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary px-8 py-4 rounded-lg font-semibold hover:bg-surface-subtle transition-colors"
                >
                  Request Free Quote
                </Link>
                <Link
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call {PHONE_DISPLAY}
                </Link>
              </div>
              <p className="text-sm text-white/80 mt-6">
                Serving {siteConfig.business.address.city},{' '}
                {siteConfig.serviceAreaRegions?.[0]?.towns
                  .slice(0, 3)
                  .map((t) => t.name)
                  .join(', ')}{' '}
                and surrounding areas
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Schema Markup */}
      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Pricing', url: '/pricing' },
        ]}
        webpage={{
          '@type': 'WebPage',
          '@id': absUrl('/pricing#webpage'),
          url: absUrl('/pricing'),
          name: `Pricing & Rates | ${siteConfig.business.name}`,
          description: `Transparent pricing for electrical services in ${siteConfig.business.address.city} and ${siteConfig.serviceAreas.join(', ')}.`,
        }}
      />
    </>
  );
}
