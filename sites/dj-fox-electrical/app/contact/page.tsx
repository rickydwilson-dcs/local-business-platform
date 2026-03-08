/**
 * Contact Page
 *
 * Server Component with metadata, canonical URL, and structured data.
 * Features PageHero, InfoCards, and dark form section with image.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { Schema, AccentUnderline, PageHeroImage, InfoCard } from '@platform/core-components';
import { ContactForm } from '@/components/ui/ContactForm';

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
      {/* Hero Section */}
      <PageHeroImage
        title="Contact Us"
        subtitle="Get in touch for a free quote"
        imageSrc="djfoxelectrical/hero/contact-hero.jpg"
        imageAlt="Contact D J Fox Electrical"
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen">
        {/* Info Cards Section */}
        <section className="section bg-white pt-16">
          <div className="container-narrow">
            <div className="grid md:grid-cols-3 gap-8">
              <InfoCard
                icon={Clock}
                heading="Free Consultation"
                text="No-obligation quotes for all electrical work"
              />
              <InfoCard
                icon={MapPin}
                heading="Find Us 24/7"
                text="Available across Eastbourne & East Sussex"
              />
              <InfoCard
                icon={Phone}
                heading="Qualified Electrician"
                text="NICEIC approved and fully insured"
              />
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="section bg-surface-subtle">
          <div className="container-narrow max-w-3xl">
            {/* Dark Form */}
            <div className="bg-black p-8 md:p-12 rounded-lg">
              <h2 className="text-3xl font-bold text-white mb-2">
                Write to us for <AccentUnderline as="span">Fast</AccentUnderline> Feedback
              </h2>
              <p className="text-surface-muted-foreground mb-6">
                Our team will get back to you as soon as possible with a tailored solution for your
                needs.
              </p>
              <ContactForm
                locations={siteConfig.serviceAreaRegions?.[0]?.towns || []}
                darkMode={true}
              />
            </div>
          </div>
        </section>

        {/* Contact Details Section */}
        <section className="section bg-white">
          <div className="container-narrow">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-bold text-surface-foreground mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-surface-foreground mb-1">Phone</p>
                      <Link
                        href={`tel:${PHONE_TEL}`}
                        className="text-brand-primary hover:underline text-lg"
                      >
                        {PHONE_DISPLAY}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-surface-foreground mb-1">Email</p>
                      <Link
                        href={`mailto:${BUSINESS_EMAIL}`}
                        className="text-brand-primary hover:underline break-all"
                      >
                        {BUSINESS_EMAIL}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-surface-foreground mb-1">Address</p>
                      <p className="text-surface-secondary">
                        {ADDRESS.street}
                        <br />
                        {ADDRESS.locality}
                        <br />
                        {ADDRESS.region} {ADDRESS.postalCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h3 className="text-2xl font-bold text-surface-foreground mb-6">Business Hours</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="mb-3">
                        <p className="font-semibold text-surface-foreground">Monday - Friday</p>
                        <p className="text-surface-secondary">{siteConfig.business.hours.monday}</p>
                      </div>
                      <div className="mb-3">
                        <p className="font-semibold text-surface-foreground">Saturday</p>
                        <p className="text-surface-secondary">{siteConfig.business.hours.saturday}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-surface-foreground">Sunday</p>
                        <p className="text-surface-secondary">{siteConfig.business.hours.sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-2xl font-bold text-surface-foreground mb-6">Our Services</h3>
                <ul className="space-y-3">
                  {siteConfig.services.slice(0, 5).map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-brand-primary hover:underline font-medium"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/services"
                      className="text-brand-primary hover:underline font-semibold"
                    >
                      View all services →
                    </Link>
                  </li>
                </ul>
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
