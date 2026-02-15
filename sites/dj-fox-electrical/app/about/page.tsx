/**
 * About Page
 *
 * Company information, credentials, values, and team overview.
 * Redesigned with Electro theme: full-width hero, dark stat cards, image-text section, and team showcase.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Award, Users, CheckCircle, Phone } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { Breadcrumbs, Schema, AccentUnderline } from '@platform/core-components';
import { PageHero } from '@/components/ui/page-hero';
import { DarkStatCard } from '@/components/ui/dark-stat-card';
import { getImageUrl } from '@/lib/image';

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
      icon: Award,
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
      <main className="min-h-screen bg-surface-background">
        {/* Full-Width Hero with Breadcrumbs */}
        <PageHero
          title="About D J Fox Electrical"
          subtitle="Serving Eastbourne & East Sussex since 2025"
          imageSrc="djfoxelectrical/hero/about-hero.jpg"
          imageAlt="D J Fox Electrical team"
          breadcrumbs={breadcrumbItems}
        />

        {/* Dark Stat Cards Section */}
        <section className="section-dark py-16 md:py-24">
          <div className="container-narrow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <DarkStatCard icon={Award} value="15+" label="Years Electrical Expertise" />
              <DarkStatCard icon={Shield} value="NICEIC" label="Approved Contractor" />
              <DarkStatCard icon={Users} value="1000+" label="Satisfied Customers" />
            </div>
          </div>
        </section>

        {/* 50/50 Image-Text Section */}
        <section className="section bg-white py-16 md:py-24">
          <div className="container-narrow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={getImageUrl('djfoxelectrical/sections/electrician-working.jpg')}
                  alt="Professional electrician"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Text + Bullet Points */}
              <div>
                <h2 className="heading-section mb-6">
                  <AccentUnderline as="span" className="heading-section">
                    Keeping Homes and Businesses **Safe**
                  </AccentUnderline>
                </h2>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Fully qualified and NICEIC approved electricians
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Comprehensive electrical services for all needs
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">24/7 emergency callout service available</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="w-6 h-6 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Part P certified and fully insured with £5M cover
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section for Daniel Fox */}
        <section className="section bg-surface-subtle py-16 md:py-24">
          <div className="container-narrow">
            <h2 className="heading-section text-center mb-12">
              <AccentUnderline as="span" className="heading-section">
                Meet **Our Team**
              </AccentUnderline>
            </h2>
            <div className="max-w-sm mx-auto">
              <div className="card text-center">
                {/* Circular Image */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <Image
                    src={getImageUrl('djfoxelectrical/team/daniel-fox.jpg')}
                    alt="Daniel Fox - Director"
                    fill
                    className="object-cover rounded-full"
                    sizes="192px"
                  />
                </div>

                {/* Name and Role */}
                <h3 className="text-2xl font-bold text-surface-foreground mb-2">Daniel Fox</h3>
                <p className="text-brand-primary font-semibold mb-4">Director & Lead Electrician</p>

                {/* Bio Text */}
                <p className="text-surface-muted-foreground mb-6">
                  With over 15 years of experience in the electrical industry, Daniel founded D J
                  Fox Electrical to provide honest, professional electrical services across East
                  Sussex.
                </p>

                {/* Certification Badges */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm font-medium rounded-full">
                    NICEIC Approved
                  </span>
                  <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm font-medium rounded-full">
                    Part P Certified
                  </span>
                  <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm font-medium rounded-full">
                    TrustMark
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section bg-white py-16 md:py-24">
          <div className="container-narrow">
            <h2 className="heading-section text-center mb-4">Our Core Values</h2>
            <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
              The principles that guide everything we do and how we serve our customers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        <section className="section bg-surface-subtle py-16 md:py-24">
          <div className="container-narrow">
            <div className="max-w-4xl mx-auto">
              <h2 className="heading-section text-center mb-4">Why Choose Us?</h2>
              <p className="text-center text-surface-muted-foreground mb-12">
                We are committed to delivering exceptional service and value to every customer.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span className="text-surface-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-brand-primary text-white py-16 md:py-24">
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
