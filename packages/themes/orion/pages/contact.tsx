import type { ContactPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { AccentUnderline, PageHeroImage, ContactForm } from '@platform/core-components';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ServiceLink {
  slug: string;
  title: string;
}

interface BusinessHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface OrionContactPageProps extends ContactPageTemplateProps {
  /** Hero background image */
  heroImage?: string;
  /** Service area names for the form dropdown */
  serviceAreaNames?: string[];
  /** Email address displayed in sidebar */
  email?: string;
  /** Full phone number for tel: link */
  phoneTel?: string;
  /** Formatted address lines */
  address?: { street: string; locality: string; region: string; postalCode: string };
  /** Business hours for sidebar */
  businessHours?: BusinessHours;
  /** Service links for sidebar */
  serviceLinks?: ServiceLink[];
}

export function OrionContactPage({
  siteConfig,
  heroImage,
  serviceAreaNames,
  email,
  phoneTel,
  address,
  businessHours,
  serviceLinks,
}: OrionContactPageProps) {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Contact', href: '/contact', current: true },
  ];

  return (
    <>
      <PageHeroImage
        title="Contact Us"
        subtitle="Get in touch for a free quote"
        imageSrc={heroImage || ''}
        imageAlt={`Contact ${siteConfig.name}`}
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen">
        {/* Split layout: form + sidebar */}
        <section className="section bg-white">
          <div className="container-narrow">
            <div className="grid md:grid-cols-[3fr_2fr] gap-12 items-start">
              {/* Form column */}
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
                <ContactForm serviceAreas={serviceAreaNames || [siteConfig.address.city]} darkMode={true} />
              </div>

              {/* Details sidebar */}
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
                        <Link
                          href={`tel:${phoneTel || siteConfig.phone}`}
                          className="text-lg font-semibold text-brand-primary hover:underline"
                        >
                          {siteConfig.phoneDisplay}
                        </Link>
                      </div>
                    </div>
                    {email && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-surface-muted-foreground uppercase tracking-widest mb-1">
                            Email
                          </p>
                          <Link
                            href={`mailto:${email}`}
                            className="text-brand-primary hover:underline break-all text-sm font-medium"
                          >
                            {email}
                          </Link>
                        </div>
                      </div>
                    )}
                    {address && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-surface-muted-foreground uppercase tracking-widest mb-1">
                            Address
                          </p>
                          <p className="text-surface-foreground text-sm leading-relaxed">
                            {address.street}<br />
                            {address.locality}<br />
                            {address.region} {address.postalCode}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-surface-card-border" />

                {/* Hours */}
                {businessHours && (
                  <>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-brand-primary mb-6">
                        Business hours
                      </p>
                      <div className="space-y-3">
                        {[
                          { day: 'Monday \u2013 Friday', hours: businessHours.weekdays },
                          { day: 'Saturday', hours: businessHours.saturday },
                          { day: 'Sunday', hours: businessHours.sunday },
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
                  </>
                )}

                {/* Services quick links */}
                {serviceLinks && serviceLinks.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-brand-primary mb-4">
                      Our services
                    </p>
                    <ul className="space-y-2">
                      {serviceLinks.map((service) => (
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
                          View all services &rarr;
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
