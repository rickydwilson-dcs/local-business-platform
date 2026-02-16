import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { getLocations } from '@/lib/content';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';
import { Phone, Shield, Clock, Award, Users } from 'lucide-react';
import { HeroWithImage } from '@/components/ui/hero-with-image';
import { InfoCard } from '@/components/ui/info-card';
import { CircularIconCard } from '@/components/ui/circular-icon-card';
import { ImageOverlayCard } from '@/components/ui/image-overlay-card';
import { getServiceIcon } from '@/lib/service-icons';

export default async function HomePage() {
  // Fetch actual locations from content
  const locations = await getLocations();

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full-width image with accent */}
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

      {/* Stats Section - White cards with shadows, overlapping hero */}
      <section className="py-16 -mt-16 relative z-10">
        <div className="container-narrow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <InfoCard icon={Shield} heading="NICEIC" text="Approved Contractor" />
            <InfoCard icon={Clock} heading="24/7" text="Emergency Service" />
            <InfoCard icon={Award} heading="15+ Years" text="Expertise" />
            <InfoCard icon={Users} heading="100%" text="Satisfaction" />
          </div>
        </div>
      </section>

      {/* Services Overview - Circular icons, white background */}
      <section className="section bg-white">
        <div className="container-narrow">
          <h2 className="heading-section text-center">
            Our <span className="accent-underline">Electrical</span> Services
          </h2>
          <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
            Professional electrical services for homes and businesses across Eastbourne and East
            Sussex
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {siteConfig.services.slice(0, 6).map((service) => (
              <CircularIconCard
                key={service.slug}
                icon={getServiceIcon(service.slug)}
                title={service.title}
                description={service.description}
                linkText="Learn More"
                linkHref={`/services/${service.slug}`}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services" className="btn-secondary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Category Image Grid - Gray subtle background */}
      <section className="section bg-surface-subtle">
        <div className="container-narrow">
          <h2 className="heading-section text-center">Check Your Electrical Needs</h2>
          <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
            From new installations to emergency repairs, we cover all your electrical requirements
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <ImageOverlayCard
              imageSrc="djfoxelectrical/categories/installation-work.jpg"
              imageAlt="Electrical installation services"
              category="Installation"
              title="New Installations"
              href="/services#installation"
            />
            <ImageOverlayCard
              imageSrc="djfoxelectrical/categories/maintenance-work.jpg"
              imageAlt="Electrical maintenance services"
              category="Maintenance"
              title="Regular Maintenance"
              href="/services#maintenance"
            />
            <ImageOverlayCard
              imageSrc="djfoxelectrical/categories/repair-work.jpg"
              imageAlt="Electrical repair services"
              category="Repair"
              title="Expert Repairs"
              href="/services#repair"
            />
          </div>
        </div>
      </section>

      {/* Service Areas - White background */}
      <section className="section bg-white">
        <div className="container-narrow">
          <h2 className="heading-section text-center">
            Areas We <span className="accent-underline">Serve</span>
          </h2>
          <p className="text-center text-surface-muted-foreground mb-12 max-w-2xl mx-auto">
            Providing expert electrical services across East Sussex and surrounding areas
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* If we have content-based locations, use those */}
            {locations.length > 0
              ? locations.slice(0, 6).map((location) => (
                  <Link
                    key={location.slug}
                    href={`/locations/${location.slug}`}
                    className="card group text-center hover:shadow-lg transition-all duration-300 hover:border-brand-primary hover:-translate-y-1"
                  >
                    <p className="text-lg font-semibold group-hover:text-brand-primary transition-colors">
                      {location.title}
                    </p>
                    {location.description && (
                      <p className="text-sm text-surface-muted-foreground mt-2 line-clamp-2">
                        {location.description}
                      </p>
                    )}
                  </Link>
                ))
              : // Fallback to config-based service areas (also clickable)
                siteConfig.serviceAreaRegions?.[0]?.towns.slice(0, 6).map((town) => (
                  <Link
                    key={town.slug}
                    href={`/locations/${town.slug}`}
                    className="card group text-center hover:shadow-lg transition-all duration-300 hover:border-brand-primary hover:-translate-y-1"
                  >
                    <p className="text-lg font-semibold group-hover:text-brand-primary transition-colors">
                      {town.name}
                    </p>
                  </Link>
                ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/locations" className="btn-secondary">
              View All Locations
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Light gray background */}
      <section className="section bg-surface-subtle">
        <div className="container-narrow">
          <h2 className="heading-section text-center">
            Why Choose <span className="accent-underline">D J Fox Electrical</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="icon-circle-md flex-shrink-0">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">NICEIC Approved</h3>
                  <p className="text-surface-muted-foreground">
                    Fully certified and approved contractor, ensuring all work meets the highest
                    safety standards and building regulations.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="icon-circle-md flex-shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">15+ Years Experience</h3>
                  <p className="text-surface-muted-foreground">
                    Over 15 years of professional electrical experience serving homes and businesses
                    across East Sussex.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="icon-circle-md flex-shrink-0">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">24/7 Emergency Service</h3>
                  <p className="text-surface-muted-foreground">
                    Round-the-clock emergency callout service for urgent electrical issues that
                    cannot wait until morning.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="icon-circle-md flex-shrink-0">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">100% Satisfaction</h3>
                  <p className="text-surface-muted-foreground">
                    Customer-focused service with a commitment to quality workmanship and complete
                    satisfaction on every job.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Black background with red accents */}
      <section className="section-dark-accent">
        <div className="container-narrow text-center">
          <h2 className="text-4xl font-bold mb-6">
            Need an <span className="accent-underline">Emergency</span> Electrician?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Available 24/7 for urgent electrical issues across Eastbourne and East Sussex
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Get Free Quote
            </Link>
            <Link href={`tel:${PHONE_TEL}`} className="btn-tertiary">
              <Phone className="w-5 h-5" />
              Call {PHONE_DISPLAY}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
