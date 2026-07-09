/**
 * About Page
 *
 * Company information — uses Vega page template for the base layout,
 * with rich content sections driven from siteConfig.about.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Award, CheckCircle, Phone } from 'lucide-react';
import type { SiteConfigSummary } from '@platform/core-components';
import { Schema } from '@platform/core-components';
import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.business.name}`,
  description: `Learn about ${siteConfig.business.name} — established ${siteConfig.credentials.yearEstablished}. ${siteConfig.tagline}.`,
  alternates: {
    canonical: absUrl('/about'),
  },
};

export default function AboutPage() {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about', current: true },
  ];
  const { about, credentials, business, serviceAreas, name, tagline } = siteConfig;

  return (
    <>
      <BreadcrumbBar items={breadcrumbItems} />

      <div className="min-h-screen bg-surface-background">
        {/* Hero Section */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <div className="mx-auto w-full lg:w-[90%] text-center">
              {about?.heroBadges && about.heroBadges.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {about.heroBadges.map((badge, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="heading-hero mb-6">About {name}</h1>
              <p className="text-xl text-surface-muted-foreground leading-relaxed mx-auto w-full lg:w-[90%]">
                {tagline}
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        {about?.story && about.story.length > 0 && (
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <div className="mx-auto w-full lg:w-[90%]">
                <h2 className="heading-section mb-8 text-center">Our Story</h2>
                <div className="max-w-3xl mx-auto prose prose-lg text-surface-foreground leading-relaxed">
                  {about.story.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? 'text-xl mb-6' : 'mb-6'}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Company Info Cards */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-border text-center">
                <h3 className="font-semibold text-surface-foreground mb-2">Business Name</h3>
                <p className="text-surface-muted-foreground">{business.legalName}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-border text-center">
                <h3 className="font-semibold text-surface-foreground mb-2">Established</h3>
                <p className="text-2xl font-bold text-brand-primary">
                  {credentials.yearEstablished}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-border text-center">
                <h3 className="font-semibold text-surface-foreground mb-2">Service Coverage</h3>
                <p className="text-surface-muted-foreground">{serviceAreas.join(', ')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {credentials.stats.length > 0 && (
          <section className="section-standard bg-surface-subtle border-t border-b border-surface-subtle">
            <div className="container-standard">
              <h2 className="heading-section text-center mb-12">Our Track Record</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {credentials.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-brand-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-lg font-semibold text-surface-foreground">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <div className="text-sm text-surface-muted-foreground mt-1">
                        {stat.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {credentials.certifications.length > 0 && (
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <h2 className="heading-section text-center mb-4">
                Certifications &amp; Accreditations
              </h2>
              <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
                We maintain the highest industry standards through recognised certifications and
                accreditations.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credentials.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-surface-subtle rounded-lg p-6 shadow-sm border border-surface-border flex items-start gap-4"
                  >
                    <div className="bg-brand-primary/10 rounded-full p-3 flex-shrink-0">
                      <Award className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-foreground">{cert.name}</h3>
                      <p className="text-sm text-surface-muted-foreground">{cert.description}</p>
                    </div>
                  </div>
                ))}
                {credentials.insurance && (
                  <div className="bg-surface-subtle rounded-lg p-6 shadow-sm border border-surface-border flex items-start gap-4">
                    <div className="bg-surface-subtle rounded-full p-3 flex-shrink-0">
                      {/* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Intentional: insurance shield icon color */}
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-foreground">
                        {credentials.insurance.amount} Insurance
                      </h3>
                      <p className="text-sm text-surface-muted-foreground">
                        {credentials.insurance.type}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Values Section */}
        {about?.values && about.values.length > 0 && (
          <section className="section-standard bg-surface-subtle">
            <div className="container-standard">
              <h2 className="heading-section text-center mb-4">Our Values</h2>
              <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
                The principles that guide everything we do and how we serve our customers.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {about.values.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-brand-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Award className="w-8 h-8 text-brand-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-surface-muted-foreground text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Us Section */}
        {about?.whyChooseUs && about.whyChooseUs.length > 0 && (
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <div className="max-w-4xl mx-auto">
                <h2 className="heading-section text-center mb-4">Why Choose {name}?</h2>
                <p className="text-center text-surface-muted-foreground mb-12">
                  We are committed to delivering exceptional service and value to every customer.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {about.whyChooseUs.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-surface-subtle rounded-lg"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-surface-foreground font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="section-standard bg-brand-primary text-white">
          <div className="container-standard text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work With Us?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Contact us today for a free consultation and quote. We look forward to helping you
              with your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-surface-subtle transition-colors"
              >
                Get a Free Quote
              </Link>
              <Link
                href={`tel:${PHONE_TEL}`}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {PHONE_DISPLAY}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Schema Markup */}
      <Schema
        org={{
          name: business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]}
        webpage={{
          '@type': 'AboutPage',
          '@id': absUrl('/about#aboutpage'),
          url: absUrl('/about'),
          name: `About ${business.name}`,
          description: `Learn about ${business.name} — professional services since ${credentials.yearEstablished}.`,
        }}
      />
    </>
  );
}
