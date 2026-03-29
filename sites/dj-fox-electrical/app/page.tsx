import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { getLocations } from '@/lib/content';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { getLocalBusinessSchema } from '@/lib/schema';
import { Phone, Shield, Clock, Award, Users, ArrowRight } from 'lucide-react';
import { HeroWithImage, ImageOverlayCard } from '@platform/core-components';
import { getServiceIcon } from '@/lib/service-icons';
import { FadeIn } from '@/components/motion/fade-in';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { MagneticButton } from '@/components/motion/magnetic-button';

export const metadata: Metadata = {
  title: 'Professional Electrical Services in Eastbourne | D J Fox Electrical',
  description:
    'NICEIC approved electrical contractor in Eastbourne, East Sussex. 15+ years experience, 24/7 emergency service. Domestic and commercial electrical services.',
  openGraph: {
    title: 'Professional Electrical Services in Eastbourne | D J Fox Electrical',
    description:
      'NICEIC approved electrical contractor in Eastbourne, East Sussex. 15+ years experience, 24/7 emergency service.',
    url: absUrl('/'),
    siteName: siteConfig.name,
    images: [
      {
        url: absUrl('/logo.svg'),
        width: 1200,
        height: 630,
        alt: `${siteConfig.business.name} - Professional Electrical Services in Eastbourne`,
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Electrical Services in Eastbourne | D J Fox Electrical',
    description:
      'NICEIC approved electrical contractor in Eastbourne, East Sussex. 15+ years experience, 24/7 emergency service.',
    images: [absUrl('/logo.svg')],
  },
  alternates: {
    canonical: absUrl('/'),
  },
};

export default async function HomePage() {
  const allLocations = await getLocations();

  const priorityLocationSlugs = [
    'eastbourne',
    'hastings',
    'bexhill-on-sea',
    'brighton',
    'lewes',
    'hailsham',
  ];

  const locations = allLocations
    .filter((loc) => priorityLocationSlugs.includes(loc.slug))
    .sort((a, b) => priorityLocationSlugs.indexOf(a.slug) - priorityLocationSlugs.indexOf(b.slug));

  const localBusinessSchema = getLocalBusinessSchema();

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absUrl('/#website'),
    name: siteConfig.business.name,
    url: absUrl('/'),
    description: siteConfig.tagline,
    publisher: { '@id': absUrl('/#organization') },
    inLanguage: 'en-GB',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') }],
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <HeroWithImage
        imageSrc="djfoxelectrical/hero/hero-electrician-work.jpg"
        imageAlt="Professional electrician working on electrical panel in Eastbourne"
        overlay="darker"
        heading={
          <>
            High Quality <span className="accent-underline">Electrical</span> Services in Eastbourne
          </>
        }
        subheading="NICEIC Approved Contractor | 15+ Years Experience | 24/7 Emergency Service"
        ctaPrimary={{ label: 'Get Free Quote', href: '/contact' }}
        ctaSecondary={{ label: 'Our Services', href: '/services' }}
      />

      {/* Stats strip — horizontal data bar, no symmetric cards */}
      <section className="bg-surface-inverse border-b border-surface-border noise-overlay">
        <div className="container-narrow">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-surface-border">
            {[
              { icon: Shield, value: 'NICEIC', label: 'Approved Contractor' },
              { icon: Clock, value: '24/7', label: 'Emergency Service' },
              { icon: Award, value: '15+', label: 'Years Expertise' },
              { icon: Users, value: '1,000+', label: 'Jobs Completed' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-8">
                <Icon className="w-6 h-6 text-brand-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xl font-bold text-white tracking-tight stat-value">{value}</p>
                  <p className="text-xs text-on-inverse-muted uppercase tracking-widest">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services — 2-col grid with header row spanning left */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="grid md:grid-cols-[1fr_1fr] gap-x-12 gap-y-0 items-start">
            {/* Left: sticky header */}
            <FadeIn direction="left">
              <div className="md:sticky md:top-24 pb-8 md:pb-0">
                <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                  What We Do
                </p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground mb-6">
                  Our <span className="accent-underline">Electrical</span> Services
                </h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-8">
                  Professional electrical services for homes and businesses across Eastbourne and East Sussex.
                </p>
                <Link href="/services" className="btn-secondary inline-flex items-center gap-2">
                  View all services
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </FadeIn>

            {/* Right: service list */}
            <StaggerChildren className="divide-y divide-surface-card-border" staggerDelay={0.07}>
              {siteConfig.services.slice(0, 6).map((service) => {
                const Icon = getServiceIcon(service.slug);
                return (
                  <StaggerItem key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex items-start gap-4 py-6 hover:bg-surface-muted -mx-4 px-4 rounded-xl transition-colors duration-200"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-surface-foreground group-hover:text-brand-primary transition-colors mb-1">
                          {service.title}
                        </h3>
                        <p className="text-sm text-surface-muted-foreground leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-surface-muted-foreground group-hover:text-brand-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1 hidden md:block" aria-hidden="true" />
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Category Image Grid */}
      <section className="section bg-surface-muted">
        <div className="container-narrow">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-2">
              Check Your Electrical Needs
            </h2>
            <p className="text-surface-muted-foreground mb-10 max-w-xl">
              From new installations to emergency repairs, we cover all your electrical requirements
            </p>
          </FadeIn>
          <StaggerChildren className="grid md:grid-cols-3 gap-6" staggerDelay={0.1}>
            <StaggerItem>
              <ImageOverlayCard
                imageSrc="djfoxelectrical/categories/installation-work.jpg"
                imageAlt="Electrical installation services"
                category="Installation"
                title="New Installations"
                href="/services#installation"
              />
            </StaggerItem>
            <StaggerItem>
              <ImageOverlayCard
                imageSrc="djfoxelectrical/categories/maintenance-work.jpg"
                imageAlt="Electrical maintenance services"
                category="Maintenance"
                title="Regular Maintenance"
                href="/services#maintenance"
              />
            </StaggerItem>
            <StaggerItem>
              <ImageOverlayCard
                imageSrc="djfoxelectrical/categories/repair-work.jpg"
                imageAlt="Electrical repair services"
                category="Repair"
                title="Expert Repairs"
                href="/services#repair"
              />
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* Service Areas — pill grid with arrow affordance */}
      <section className="section bg-white">
        <div className="container-narrow">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">
                  Coverage
                </p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground">
                  Areas We <span className="accent-underline">Serve</span>
                </h2>
              </div>
              <Link href="/locations" className="btn-secondary text-sm">
                View All Locations
              </Link>
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 gap-3" staggerDelay={0.06}>
            {(locations.length > 0
              ? locations.slice(0, 6)
              : (siteConfig.serviceAreaRegions?.[0]?.towns.slice(0, 6) ?? []).map((t) => ({
                  slug: t.slug,
                  title: t.name,
                  description: undefined as string | undefined,
                }))
            ).map((location) => (
              <StaggerItem key={location.slug}>
                <Link
                  href={`/locations/${location.slug}`}
                  className="location-pill group"
                >
                  <span className="font-semibold text-surface-foreground group-hover:text-brand-primary transition-colors">
                    {location.title}
                  </span>
                  <ArrowRight className="location-pill-arrow w-4 h-4 flex-shrink-0" aria-hidden="true" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Why Choose Us — table-style rows on dark background */}
      <section className="section bg-surface-inverse">
        <div className="container-narrow">
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">
              Why Us
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-16">
              Why Choose{' '}
              <span className="text-brand-primary">D J Fox Electrical</span>
            </h2>
          </FadeIn>

          <div className="border-t border-surface-border">
            {[
              {
                icon: Shield,
                title: 'NICEIC Approved',
                body: 'Fully certified and approved contractor, ensuring all work meets the highest safety standards and building regulations.',
                stat: 'Certified',
              },
              {
                icon: Award,
                title: '15+ years experience',
                body: 'Over 15 years of professional electrical experience serving homes and businesses across East Sussex.',
                stat: 'Est. 2010',
              },
              {
                icon: Clock,
                title: '24/7 emergency service',
                body: 'Round-the-clock emergency callout service for urgent electrical issues that cannot wait until morning.',
                stat: 'Always on',
              },
              {
                icon: Users,
                title: '1,000+ jobs completed',
                body: 'Customer-focused service with a commitment to quality workmanship and complete satisfaction on every job.',
                stat: '& counting',
              },
            ].map(({ icon: Icon, title, body, stat }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="grid md:grid-cols-[2fr_3fr_1fr] gap-6 items-center py-8 border-b border-surface-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                  </div>
                  <p className="text-on-inverse-muted text-sm leading-relaxed">{body}</p>
                  <p className="text-xs font-mono text-on-inverse-muted uppercase tracking-widest md:text-right stat-value">
                    {stat}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-dark-accent noise-overlay">
        <div className="container-narrow">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <FadeIn direction="left">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Need an <span className="accent-underline">Emergency</span> Electrician?
              </h2>
              <p className="text-xl mt-4 text-on-inverse-muted">
                Available 24/7 across Eastbourne and East Sussex
              </p>
            </FadeIn>
            <FadeIn direction="right" delay={0.15}>
              <div className="flex flex-col gap-3">
                <MagneticButton>
                  <Link href="/contact" className="btn-primary whitespace-nowrap">
                    Get Free Quote
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href={`tel:${PHONE_TEL}`}
                    className="btn-tertiary inline-flex items-center gap-2 whitespace-nowrap justify-center"
                  >
                    <Phone className="w-5 h-5" />
                    Call {PHONE_DISPLAY}
                  </Link>
                </MagneticButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
