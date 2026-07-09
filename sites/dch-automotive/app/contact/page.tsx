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
import { Schema } from '@platform/core-components';
import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { PageHero } from '@/components/page-hero';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.business.name}`,
  description: `Get in touch with ${siteConfig.business.name} for a free quote or to discuss your requirements. Professional services across ${siteConfig.serviceAreas.slice(0, 3).join(', ')} and surrounding areas.`,
  alternates: {
    canonical: absUrl('/contact'),
  },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Contact', href: '/contact', current: true },
  ];

  return (
    <>
      <BreadcrumbBar items={breadcrumbItems} />

      <PageHero
        title="Contact Us"
        description="Get in touch with our team for a free quote or to discuss your requirements."
      />

      {/* Main Content */}
      <section className="pb-16 sm:pb-24 container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm services={siteConfig.services} serviceAreas={siteConfig.serviceAreas} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="stamped-plate p-8">
              <h2 className="text-lg font-heading font-bold uppercase tracking-tight mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold uppercase text-xs tracking-widest text-white/40">
                      Phone
                    </p>
                    <Link href={`tel:${PHONE_TEL}`} className="text-white hover:text-brand-primary">
                      {PHONE_DISPLAY}
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold uppercase text-xs tracking-widest text-white/40">
                      Email
                    </p>
                    <Link
                      href={`mailto:${BUSINESS_EMAIL}`}
                      className="text-white hover:text-brand-primary"
                    >
                      {BUSINESS_EMAIL}
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold uppercase text-xs tracking-widest text-white/40">
                      Address
                    </p>
                    <p className="text-white/70">
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
                    <p className="font-bold uppercase text-xs tracking-widest text-white/40">
                      Hours
                    </p>
                    <p className="text-white/70 text-sm">
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
            <div className="stamped-plate p-8">
              <h2 className="text-lg font-heading font-bold uppercase tracking-tight mb-4">
                Quick Links
              </h2>
              <ul className="space-y-2">
                {siteConfig.services.slice(0, 5).map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-white/70 hover:text-brand-primary"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services" className="text-brand-primary font-bold hover:underline">
                    View all services &rarr;
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

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
