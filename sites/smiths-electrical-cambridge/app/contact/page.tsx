/**
 * Contact Page
 *
 * Server Component with metadata, canonical URL, and structured data.
 * The interactive form is extracted to a client component.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { Schema, Breadcrumbs } from '@platform/core-components';
import { ContactForm } from '@/components/ui/ContactForm';

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.business.name}`,
  description: `Get in touch with ${siteConfig.business.name} for a free quote or to discuss your requirements. Professional services across ${siteConfig.serviceAreas.slice(0, 3).join(', ')} and surrounding areas.`,
  alternates: {
    canonical: absUrl('/contact'),
  },
};

export default function ContactPage() {
  const breadcrumbItems = [{ name: 'Contact', href: '/contact', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <main className="min-h-screen bg-surface-background">
        {/* Hero Section */}
        <section className="section-standard bg-gradient-to-b from-brand-primary/5 to-surface-background">
          <div className="container-standard text-center">
            <h1 className="heading-hero mb-4">Contact Us</h1>
            <p className="text-xl text-surface-muted-foreground max-w-2xl mx-auto">
              Get in touch with our team for a free quote or to discuss your requirements.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-standard">
          <div className="container-standard">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <ContactForm
                  services={siteConfig.services}
                  serviceAreas={siteConfig.serviceAreas}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-surface-subtle rounded-lg p-6">
                  <h2 className="text-xl font-bold text-surface-foreground mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-surface-foreground">Phone</p>
                        <Link
                          href={`tel:${PHONE_TEL}`}
                          className="text-brand-primary hover:underline"
                        >
                          {PHONE_DISPLAY}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-surface-foreground">Email</p>
                        <Link
                          href={`mailto:${BUSINESS_EMAIL}`}
                          className="text-brand-primary hover:underline"
                        >
                          {BUSINESS_EMAIL}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-surface-foreground">Address</p>
                        <p className="text-surface-muted-foreground">
                          {ADDRESS.street}
                          <br />
                          {ADDRESS.locality}
                          <br />
                          {ADDRESS.region} {ADDRESS.postalCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-surface-foreground">Hours</p>
                        <p className="text-surface-muted-foreground text-sm">
                          Mon-Fri: {siteConfig.business.hours.monday}
                          <br />
                          Sat: {siteConfig.business.hours.saturday}
                          <br />
                          Sun: {siteConfig.business.hours.sunday}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-surface-subtle rounded-lg p-6">
                  <h2 className="text-xl font-bold text-surface-foreground mb-4">Quick Links</h2>
                  <ul className="space-y-2">
                    {siteConfig.services.slice(0, 5).map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="text-brand-primary hover:underline"
                        >
                          {service.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/services"
                        className="text-brand-primary hover:underline font-medium"
                      >
                        View all services &rarr;
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
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
          { name: 'Contact', url: '/contact' },
        ]}
        webpage={{
          '@type': 'ContactPage',
          '@id': absUrl('/contact#contactpage'),
          url: absUrl('/contact'),
          name: `Contact ${siteConfig.business.name}`,
          description: `Get in touch with ${siteConfig.business.name} for a free quote or to discuss your requirements.`,
        }}
      />
    </>
  );
}
