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
import { Schema, ContactForm } from '@platform/core-components';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.business.name}`,
  description: `Get in touch with ${siteConfig.business.name} for a free quote or to discuss your requirements. Professional services across ${siteConfig.serviceAreas.slice(0, 3).join(', ')} and surrounding areas.`,
  alternates: {
    canonical: absUrl('/contact'),
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        overline="Get in touch"
        title="Contact us"
        description="Get in touch with our team for a free quote or to discuss your requirements."
      />

      <div className="bg-surface-background">
        {/* Main Content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <ContactForm darkMode={true} />
              </div>

              {/* Sidebar */}
              <div className="space-y-0">
                {/* Contact Information */}
                <div className="bg-surface-muted p-8 border-l-4 border-brand-primary">
                  <h2 className="text-xl font-headline font-bold text-surface-foreground mb-6">
                    Contact information
                  </h2>
                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-sm uppercase tracking-wider text-surface-foreground">
                          Phone
                        </p>
                        <Link
                          href={`tel:${PHONE_TEL}`}
                          className="text-brand-primary hover:underline text-sm"
                        >
                          {PHONE_DISPLAY}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-sm uppercase tracking-wider text-surface-foreground">
                          Email
                        </p>
                        <Link
                          href={`mailto:${BUSINESS_EMAIL}`}
                          className="text-brand-primary hover:underline text-sm"
                        >
                          {BUSINESS_EMAIL}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-sm uppercase tracking-wider text-surface-foreground">
                          Address
                        </p>
                        <p className="text-surface-muted-foreground text-sm">
                          {ADDRESS.street}
                          <br />
                          {ADDRESS.locality}
                          <br />
                          {ADDRESS.region} {ADDRESS.postalCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-sm uppercase tracking-wider text-surface-foreground">
                          Hours
                        </p>
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
                <div className="bg-surface-muted p-8 mt-px">
                  <h2 className="text-xl font-headline font-bold text-surface-foreground mb-4">
                    Our services
                  </h2>
                  <ul className="space-y-2">
                    {siteConfig.services.slice(0, 5).map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center gap-2 text-brand-primary hover:gap-3 transition-all text-sm"
                        >
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          {service.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/services"
                        className="text-brand-primary hover:underline font-bold text-sm uppercase tracking-widest mt-2 inline-block"
                      >
                        View all services
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

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
