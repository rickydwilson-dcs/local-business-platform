import type { ContactPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs, ContactForm } from '@platform/core-components';
import { Phone, MapPin } from 'lucide-react';

export function NovaContactPage({ siteConfig }: ContactPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Contact', href: '/contact', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">
        {/* Hero Section */}
        <section className="bg-brand-primary py-16 md:py-20">
          <div className="container-standard text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Get in touch with our team for a free quote or to discuss your requirements.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-standard">
          <div className="container-standard">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <ContactForm services={[]} serviceAreas={[siteConfig.address.city]} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-surface-card border-l-4 border-brand-primary rounded-xl p-6">
                  <h2 className="text-xl font-bold text-surface-foreground mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-surface-foreground">Phone</p>
                        <Link
                          href={`tel:${siteConfig.phone}`}
                          className="text-brand-primary hover:underline"
                        >
                          {siteConfig.phoneDisplay}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-surface-foreground">Area</p>
                        <p className="text-surface-muted-foreground">{siteConfig.address.city}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Us */}
                <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-surface-foreground mb-4">
                    Why Choose Us?
                  </h2>
                  <ul className="space-y-3">
                    {[
                      'Free no-obligation quotes',
                      'Fast response times',
                      'Fully insured professionals',
                      'Quality guaranteed',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-surface-muted-foreground text-sm">
                        <span className="text-brand-primary font-bold">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
