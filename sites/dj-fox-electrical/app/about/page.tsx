/**
 * About Page
 *
 * Company information, credentials, values, and team overview.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Award, Clock, Users, CheckCircle, Phone } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { Schema, PageHeroImage, DarkStatCard } from '@platform/core-components';
import { getImageUrl } from '@/lib/image';
import { FadeIn } from '@/components/motion/fade-in';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { MagneticButton } from '@/components/motion/magnetic-button';

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.business.name}`,
  description: `Learn about ${siteConfig.business.name} - established ${siteConfig.credentials.yearEstablished}. Professional services with qualified team and comprehensive insurance.`,
  alternates: {
    canonical: absUrl('/about'),
  },
};

export default function AboutPage() {
  const breadcrumbItems = [{ name: 'About', href: '/about', current: true }];

  const values = [
    {
      icon: Shield,
      title: 'Quality first',
      description:
        'We maintain the highest standards in everything we do, ensuring exceptional results for every project.',
    },
    {
      icon: Award,
      title: 'Professional excellence',
      description:
        'Our team is fully qualified and continuously trained to deliver professional service.',
    },
    {
      icon: Clock,
      title: 'Reliable service',
      description:
        'We arrive on time, complete projects efficiently, and communicate clearly throughout.',
    },
    {
      icon: Users,
      title: 'Customer focus',
      description:
        'Your satisfaction is our priority. We listen to your needs and deliver tailored solutions.',
    },
  ];

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
      <div className="min-h-screen bg-surface-background">
        {/* Hero */}
        <PageHeroImage
          title="About D J Fox Electrical"
          subtitle="Serving Eastbourne & East Sussex since 2025"
          imageSrc="djfoxelectrical/hero/about-hero.jpg"
          imageAlt="D J Fox Electrical team"
          breadcrumbs={breadcrumbItems}
        />

        {/* Dark Stat Cards */}
        <section className="section-dark py-16 md:py-24">
          <div className="container-narrow">
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.1}>
              <StaggerItem>
                <DarkStatCard icon={Award} value="15+" label="Years Electrical Expertise" />
              </StaggerItem>
              <StaggerItem>
                <DarkStatCard icon={Shield} value="NICEIC" label="Approved Contractor" />
              </StaggerItem>
              <StaggerItem>
                <DarkStatCard icon={Users} value="1000+" label="Satisfied Customers" />
              </StaggerItem>
            </StaggerChildren>
          </div>
        </section>

        {/* 50/50 Image-Text — asymmetric: image gets extra visual weight via aspect ratio */}
        <section className="section bg-white py-16 md:py-24">
          <div className="container-narrow">
            <div className="grid grid-cols-1 md:grid-cols-[5fr_4fr] gap-12 items-center">
              <FadeIn direction="left">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={getImageUrl('djfoxelectrical/sections/electrician-working.jpg')}
                    alt="Professional electrician"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 55vw"
                  />
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.1}>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-4">
                    Our Work
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-8">
                    Keeping homes and businesses <span className="accent-underline">safe</span>
                  </h2>
                  <ul className="space-y-4">
                    {[
                      'Fully qualified and NICEIC approved electricians',
                      'Comprehensive electrical services for all needs',
                      '24/7 emergency callout service available',
                      'Part P certified and fully insured with £5M cover',
                    ].map((item) => (
                      <li key={item} className="flex gap-3 items-start">
                        <CheckCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span className="text-surface-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Core Values — 2-col zig-zag instead of centered 4-col */}
        <section className="section bg-surface-muted py-16 md:py-24">
          <div className="container-narrow">
            <FadeIn>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">
                What Drives Us
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-12">
                Our Core Values
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <FadeIn key={index} delay={index * 0.08} direction={index % 2 === 0 ? 'left' : 'right'}>
                    <div className="flex gap-5 p-6 bg-white rounded-2xl border border-surface-card-border">
                      <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-surface-foreground mb-2">
                          {value.title}
                        </h3>
                        <p className="text-sm text-surface-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us — clean list, left-aligned */}
        <section className="section bg-white py-16 md:py-24">
          <div className="container-narrow">
            <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
              <FadeIn direction="left">
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">
                  The Difference
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground">
                  Why choose us?
                </h2>
                <p className="text-surface-muted-foreground mt-4 leading-relaxed">
                  We are committed to delivering exceptional service and value to every customer.
                </p>
              </FadeIn>
              <StaggerChildren className="space-y-3" staggerDelay={0.07}>
                {benefits.map((benefit) => (
                  <StaggerItem key={benefit}>
                    <div className="flex items-center gap-3 py-3 border-b border-surface-card-border last:border-0">
                      <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0" />
                      <span className="text-surface-foreground text-sm font-medium">{benefit}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-brand-primary text-white py-16 md:py-24 noise-overlay">
          <div className="container-narrow">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <FadeIn direction="left">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Ready to work with us?
                </h2>
                <p className="text-lg mt-3 text-white/80 max-w-xl">
                  Contact us today for a free consultation and quote.
                </p>
              </FadeIn>
              <FadeIn direction="right" delay={0.1}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <MagneticButton>
                    <Link
                      href="/contact"
                      className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-surface-muted transition-colors whitespace-nowrap block"
                    >
                      Get a free quote
                    </Link>
                  </MagneticButton>
                  <MagneticButton>
                    <Link
                      href={`tel:${PHONE_TEL}`}
                      className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <Phone className="w-5 h-5" aria-hidden="true" />
                      {PHONE_DISPLAY}
                    </Link>
                  </MagneticButton>
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
