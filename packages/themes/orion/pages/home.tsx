import type { HomePageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { HeroWithImage, ImageOverlayCard } from '@platform/core-components';
import { Phone, ArrowRight } from 'lucide-react';

export interface OrionHomePageProps extends HomePageTemplateProps {
  /** "Why Choose Us" rows displayed on the dark section */
  whyChooseUsItems?: Array<{ icon: string; title: string; body: string; stat?: string }>;
  /** Badge text (e.g. "NICEIC") shown in the hero subheading */
  badge?: string;
  /** Category image cards for the grid section */
  categoryCards?: Array<{ imageSrc: string; imageAlt: string; category: string; title: string; href: string }>;
  /** Priority location slugs for ordering */
  priorityLocationSlugs?: string[];
}

export function OrionHomePage({
  siteConfig,
  services,
  locations,
  heroImage,
  heroHeadline,
  heroSubheading,
  schemaNodes,
  whyChooseUsItems,
  badge,
  categoryCards,
}: OrionHomePageProps) {
  return (
    <div className="min-h-screen">
      {schemaNodes}

      {/* Hero */}
      <HeroWithImage
        imageSrc={heroImage || ''}
        imageAlt={`Professional services in ${siteConfig.address.city}`}
        overlay="darker"
        heading={
          <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            {heroHeadline || `Professional Services in ${siteConfig.address.city}`}
          </span>
        }
        subheading={
          heroSubheading ||
          (badge ? `${badge} | ${siteConfig.tagline}` : siteConfig.tagline)
        }
        ctaPrimary={siteConfig.cta.primary}
        ctaSecondary={{ label: 'Our Services', href: '/services' }}
      />

      {/* Stats strip */}
      {siteConfig.stats && siteConfig.stats.length > 0 && (
        <section className="bg-surface-inverse border-b border-surface-border noise-overlay">
          <div className="container-narrow">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-surface-border">
              {siteConfig.stats.map(({ value, label }) => (
                <div key={label} className="flex items-center gap-4 px-6 py-8">
                  <div>
                    <p className="text-xl font-bold text-white tracking-tight stat-value">{value}</p>
                    <p className="text-xs text-on-inverse-muted uppercase tracking-widest">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="grid md:grid-cols-[1fr_1fr] gap-x-12 gap-y-0 items-start">
            {/* Left: header */}
            <div className="md:sticky md:top-24 pb-8 md:pb-0">
              <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                What We Do
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground mb-6">
                Our Services
              </h2>
              <p className="text-surface-muted-foreground leading-relaxed mb-8">
                Professional services for homes and businesses across {siteConfig.address.city} and surrounding areas.
              </p>
              <Link href="/services" className="btn-secondary inline-flex items-center gap-2">
                View all services
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Right: service list */}
            <div className="divide-y divide-surface-card-border">
              {services.slice(0, 6).map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex items-start gap-4 py-6 hover:bg-surface-muted -mx-4 px-4 rounded-xl transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-surface-foreground group-hover:text-brand-primary transition-colors mb-1">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-surface-muted-foreground leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-surface-muted-foreground group-hover:text-brand-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1 hidden md:block" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Image Grid */}
      {categoryCards && categoryCards.length > 0 && (
        <section className="section bg-surface-muted">
          <div className="container-narrow">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-2">
              Check Your Needs
            </h2>
            <p className="text-surface-muted-foreground mb-10 max-w-xl">
              From new installations to emergency repairs, we cover all your requirements
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {categoryCards.map((card) => (
                <ImageOverlayCard
                  key={card.title}
                  imageSrc={card.imageSrc}
                  imageAlt={card.imageAlt}
                  category={card.category}
                  title={card.title}
                  href={card.href}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Areas */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">
                Coverage
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground">
                Areas We Serve
              </h2>
            </div>
            <Link href="/locations" className="btn-secondary text-sm">
              View All Locations
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {locations.slice(0, 6).map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="location-pill group"
              >
                <span className="font-semibold text-surface-foreground group-hover:text-brand-primary transition-colors">
                  {location.title}
                </span>
                <ArrowRight className="location-pill-arrow w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      {whyChooseUsItems && whyChooseUsItems.length > 0 && (
        <section className="section bg-surface-inverse">
          <div className="container-narrow">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">
              Why Us
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-16">
              Why Choose{' '}
              <span className="text-brand-primary">{siteConfig.name}</span>
            </h2>

            <div className="border-t border-surface-border">
              {whyChooseUsItems.map(({ title, body, stat }) => (
                <div key={title} className="grid md:grid-cols-[2fr_3fr_1fr] gap-6 items-center py-8 border-b border-surface-border">
                  <div className="flex items-center gap-4">
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                  </div>
                  <p className="text-on-inverse-muted text-sm leading-relaxed">{body}</p>
                  {stat && (
                    <p className="text-xs font-mono text-on-inverse-muted uppercase tracking-widest md:text-right stat-value">
                      {stat}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-dark-accent noise-overlay">
        <div className="container-narrow">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ready to Get Started?
              </h2>
              <p className="text-xl mt-4 text-on-inverse-muted">
                Available across {siteConfig.address.city} and surrounding areas
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href={siteConfig.cta.primary.href} className="btn-primary whitespace-nowrap">
                {siteConfig.cta.primary.label}
              </Link>
              {siteConfig.cta.phone.show && (
                <Link
                  href={`tel:${siteConfig.phone}`}
                  className="btn-tertiary inline-flex items-center gap-2 whitespace-nowrap justify-center"
                >
                  <Phone className="w-5 h-5" />
                  Call {siteConfig.phoneDisplay}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
