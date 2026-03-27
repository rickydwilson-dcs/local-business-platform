/**
 * Contact Page
 *
 * Split layout: form left, contact details right.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { Schema, AccentUnderline, PageHeroImage, ContactForm } from '@platform/core-components';
import { FadeIn } from '@/components/motion/fade-in';
import { MagneticButton } from '@/components/motion/magnetic-button';

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

  const locationNames = (siteConfig.serviceAreaRegions?.[0]?.towns || []).map(
    (t: { name: string }) => t.name
  );

  return (
    <>
      <PageHeroImage
        title="Contact Us"
        subtitle="Get in touch for a free quote"
        imageSrc="djfoxelectrical/hero/contact-hero.jpg"
        imageAlt="Contact D J Fox Electrical"
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen">
        {/* Split layout: form + sidebar */}
        <section className="section bg-white">
          <div className="container-narrow">
            <div className="grid md:grid-cols-[3fr_2fr] gap-12 items-start">

              {/* Form column */}
              <FadeIn direction="left">
                <div className="bg-surface-inverse p-8 md:p-12 rounded-2xl">
                  <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">
                    Get in Touch
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                    Write to us for <AccentUnderline as="span">fast</AccentUnderline> feedback
                  </h2>
                  <p className="text-surface-muted-foreground mb-8 text-sm leading-relaxed">
                    Our team will get back to you as soon as possible with a tailored solution.
                  </p>
                  <ContactForm serviceAreas={locationNames} darkMode={true} />
                </div>
              </FadeIn>

              {/* Details sidebar */}
              <FadeIn direction="right" delay={0.1}>
                <div className="space-y-10 pt-2">
                  {/* Quick contact */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-brand-primary mb-6">
                      Direct contact
                    </p>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-surface-muted-foreground uppercase tracking-widest mb-1">
                            Phone
                          </p>
                          <MagneticButton>
                            <Link
                              href={`tel:${PHONE_TEL}`}
                              className="text-lg font-semibold text-brand-primary hover:underline"
                            >
                              {PHONE_DISPLAY}
                            </Link>
                          </MagneticButton>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-surface-muted-foreground uppercase tracking-widest mb-1">
                            Email
                          </p>
                          <Link
                            href={`mailto:${BUSINESS_EMAIL}`}
                            className="text-brand-primary hover:underline break-all text-sm font-medium"
                          >
                            {BUSINESS_EMAIL}
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-surface-muted-foreground uppercase tracking-widest mb-1">
                            Address
                          </p>
                          <p className="text-surface-foreground text-sm leading-relaxed">
                            {ADDRESS.street}<br />
                            {ADDRESS.locality}<br />
                            {ADDRESS.region} {ADDRESS.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-surface-card-border" />

                  {/* Hours */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-brand-primary mb-6">
                      Business hours
                    </p>
                    <div className="space-y-3">
                      {[
                        { day: 'Monday – Friday', hours: siteConfig.business.hours.monday },
                        { day: 'Saturday', hours: siteConfig.business.hours.saturday },
                        { day: 'Sunday', hours: siteConfig.business.hours.sunday },
                      ].map(({ day, hours }) => (
                        <div key={day} className="flex items-center justify-between">
                          <span className="text-sm text-surface-muted-foreground flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            {day}
                          </span>
                          <span className="text-sm font-medium text-surface-foreground">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-surface-card-border" />

                  {/* Services quick links */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-brand-primary mb-4">
                      Our services
                    </p>
                    <ul className="space-y-2">
                      {siteConfig.services.slice(0, 5).map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`/services/${service.slug}`}
                            className="text-sm text-surface-foreground hover:text-brand-primary transition-colors font-medium"
                          >
                            {service.title}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href="/services"
                          className="text-sm text-brand-primary hover:underline font-semibold"
                        >
                          View all services →
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </div>

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
