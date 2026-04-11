import type { AboutPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs, PageHeroImage, DarkStatCard } from '@platform/core-components';
import { Shield, Award, Clock, Users, CheckCircle, Phone } from 'lucide-react';

interface CoreValue {
  title: string;
  description: string;
}

export interface OrionAboutPageProps extends AboutPageTemplateProps {
  /** Hero background image */
  heroImage?: string;
  /** Hero title */
  heroTitle?: string;
  /** Hero subtitle */
  heroSubtitle?: string;
  /** Dark stat cards data */
  statCards?: Array<{ value: string; label: string }>;
  /** Section image for the 50/50 split */
  sectionImageUrl?: string;
  /** Bullet points for the 50/50 section */
  highlights?: string[];
  /** Core values array */
  coreValues?: CoreValue[];
  /** Benefits/why choose us list */
  benefits?: string[];
  /** Phone display for CTA */
  phoneTel?: string;
}

const iconMap: Record<number, typeof Shield> = {
  0: Award,
  1: Shield,
  2: Users,
  3: Clock,
};

export function OrionAboutPage({
  siteConfig,
  heroImage,
  heroTitle,
  heroSubtitle,
  statCards,
  sectionImageUrl,
  highlights,
  coreValues,
  benefits,
  phoneTel,
}: OrionAboutPageProps) {
  const breadcrumbItems = [{ name: 'About', href: '/about', current: true }];

  return (
    <>
      <div className="min-h-screen bg-surface-background">
        {/* Hero */}
        <PageHeroImage
          title={heroTitle || `About ${siteConfig.name}`}
          subtitle={heroSubtitle || siteConfig.tagline}
          imageSrc={heroImage || ''}
          imageAlt={`${siteConfig.name} team`}
          breadcrumbs={breadcrumbItems}
        />

        {/* Dark Stat Cards */}
        {statCards && statCards.length > 0 && (
          <section className="section-dark py-16 md:py-24">
            <div className="container-narrow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {statCards.map((stat, i) => (
                  <DarkStatCard
                    key={stat.label}
                    icon={iconMap[i] || Award}
                    value={stat.value}
                    label={stat.label}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 50/50 Image-Text */}
        {highlights && highlights.length > 0 && (
          <section className="section bg-white py-16 md:py-24">
            <div className="container-narrow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {sectionImageUrl && (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-surface-muted" />
                )}
                <div className={sectionImageUrl ? '' : 'md:col-span-2 max-w-2xl'}>
                  <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-4">
                    Our Work
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-8">
                    What sets us apart
                  </h2>
                  <ul className="space-y-4">
                    {highlights.map((item) => (
                      <li key={item} className="flex gap-3 items-start">
                        <CheckCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span className="text-surface-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Core Values */}
        {coreValues && coreValues.length > 0 && (
          <section className="section bg-surface-muted py-16 md:py-24">
            <div className="container-narrow">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">
                What Drives Us
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-12">
                Our Core Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coreValues.map((value, index) => {
                  const Icon = iconMap[index] || Shield;
                  return (
                    <div key={index} className="flex gap-5 p-6 bg-white rounded-2xl border border-surface-card-border">
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
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Us */}
        {benefits && benefits.length > 0 && (
          <section className="section bg-white py-16 md:py-24">
            <div className="container-narrow">
              <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary mb-3">
                    The Difference
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground">
                    Why choose us?
                  </h2>
                  <p className="text-surface-muted-foreground mt-4 leading-relaxed">
                    We are committed to delivering exceptional service and value to every customer.
                  </p>
                </div>
                <div className="space-y-3">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3 py-3 border-b border-surface-card-border last:border-0">
                      <CheckCircle className="w-4 h-4 text-brand-primary flex-shrink-0" />
                      <span className="text-surface-foreground text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section bg-brand-primary text-white py-16 md:py-24 noise-overlay">
          <div className="container-narrow">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Ready to work with us?
                </h2>
                <p className="text-lg mt-3 text-white/80 max-w-xl">
                  Contact us today for a free consultation and quote.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-surface-muted transition-colors whitespace-nowrap block text-center"
                >
                  Get a free quote
                </Link>
                {siteConfig.cta.phone.show && (
                  <Link
                    href={`tel:${phoneTel || siteConfig.phone}`}
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Phone className="w-5 h-5" aria-hidden="true" />
                    {siteConfig.phoneDisplay}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
