/**
 * About Page
 *
 * Company information, credentials, values, and team overview.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Award, Users, Clock, CheckCircle, Phone } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { Breadcrumbs, Schema } from '@platform/core-components';

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.business.name}`,
  description: `Learn about ${siteConfig.business.name} - established ${siteConfig.credentials.yearEstablished}. Professional services with qualified team and comprehensive insurance.`,
  alternates: {
    canonical: absUrl('/about'),
  },
};

export default function AboutPage() {
  const breadcrumbItems = [{ name: 'About', href: '/about', current: true }];

  // Core values - generic for any business
  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description:
        'We maintain the highest standards in everything we do, ensuring exceptional results for every project.',
    },
    {
      icon: Award,
      title: 'Professional Excellence',
      description:
        'Our team is fully qualified and continuously trained to deliver professional service.',
    },
    {
      icon: Clock,
      title: 'Reliable Service',
      description:
        'We arrive on time, complete projects efficiently, and communicate clearly throughout.',
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description:
        'Your satisfaction is our priority. We listen to your needs and deliver tailored solutions.',
    },
  ];

  // Benefits - generic for any service business
  const benefits = [
    'Fully insured and accredited',
    'Free quotes and consultations',
    'Competitive pricing',
    'Quality workmanship guaranteed',
    'Professional, uniformed team',
    'Clear communication throughout',
    'Flexible scheduling',
    'Comprehensive aftercare',
  ];

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
          <div className="container-standard">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="heading-hero mb-6">About {siteConfig.business.name}</h1>
              <p className="text-xl text-surface-muted-foreground mb-8">
                Established in {siteConfig.credentials.yearEstablished}, we have been providing
                professional services to customers across our service areas. Our commitment to
                quality and customer satisfaction has made us a trusted name in the industry.
              </p>
            </div>
          </div>
        </section>

        {/* Company Info Cards */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-border">
                <h3 className="font-semibold text-surface-foreground mb-2">Business Name</h3>
                <p className="text-surface-muted-foreground">{siteConfig.business.legalName}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-border">
                <h3 className="font-semibold text-surface-foreground mb-2">Established</h3>
                <p className="text-surface-muted-foreground">
                  {siteConfig.credentials.yearEstablished}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-border">
                <h3 className="font-semibold text-surface-foreground mb-2">Service Coverage</h3>
                <p className="text-surface-muted-foreground">
                  {siteConfig.serviceAreas.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {siteConfig.credentials.stats.length > 0 && (
          <section className="section-standard">
            <div className="container-standard">
              <h2 className="heading-section text-center mb-12">Our Track Record</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {siteConfig.credentials.stats.map((stat, index) => (
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
        {siteConfig.credentials.certifications.length > 0 && (
          <section className="section-standard bg-surface-subtle">
            <div className="container-standard">
              <h2 className="heading-section text-center mb-4">Certifications & Accreditations</h2>
              <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
                We maintain the highest industry standards through recognized certifications and
                accreditations.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteConfig.credentials.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 shadow-sm border border-surface-border flex items-start gap-4"
                  >
                    <div className="bg-brand-primary/10 rounded-full p-3">
                      <Award className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-foreground">{cert.name}</h3>
                      <p className="text-sm text-surface-muted-foreground">{cert.description}</p>
                    </div>
                  </div>
                ))}
                {siteConfig.credentials.insurance && (
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-border flex items-start gap-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-foreground">
                        {siteConfig.credentials.insurance.amount} Insurance
                      </h3>
                      <p className="text-sm text-surface-muted-foreground">
                        {siteConfig.credentials.insurance.type}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Core Values */}
        <section className="section-standard">
          <div className="container-standard">
            <h2 className="heading-section text-center mb-4">Our Core Values</h2>
            <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
              The principles that guide everything we do and how we serve our customers.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-brand-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-brand-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-surface-muted-foreground text-sm">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-section text-center mb-4">Why Choose Us?</h2>
              <p className="text-center text-surface-muted-foreground mb-12">
                We are committed to delivering exceptional service and value to every customer.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-surface-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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
                className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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
          { name: 'About', url: '/about' },
        ]}
        webpage={{
          '@type': 'AboutPage',
          '@id': absUrl('/about#aboutpage'),
          url: absUrl('/about'),
          name: `About ${siteConfig.business.name}`,
          description: `Learn about ${siteConfig.business.name} - professional services since ${siteConfig.credentials.yearEstablished}.`,
        }}
      />
    </>
  );
}
