{
  /* Source: https://www.rpautomotivephotography.com — about blueprint */
}

import { SiriusHeader } from '@platform/themes/sirius/components';
import { SiriusFooter } from '@platform/themes/sirius/components';
import { PageTitleBanner } from '@platform/themes/sirius/components';
import { AboutProfileSection } from '@platform/themes/sirius/components';
import { PhotoshootServicesSection } from '@platform/themes/sirius/components';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Page() {
  return (
    <>
      <SiriusHeader logo="RP Automotive" navLinks={navLinks} />
      <PageTitleBanner pageTitle="About" />

      {/* About Profile — theme component */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutProfileSection />
        </div>
      </section>

      {/* Photoshoot Services — theme component */}
      <section className="py-16 md:py-24 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PhotoshootServicesSection />
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground text-center mb-12">
            Why Choose RP Automotive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Passion for Cars',
                desc: 'A genuine love for automotive culture shines through in every frame.',
              },
              {
                title: 'Professional Qualifications',
                desc: 'BA (Hons) in Photography and CAA-approved drone pilot.',
              },
              {
                title: 'Flexible Packages',
                desc: 'From social media shoots to full-day sessions, tailored to your needs.',
              },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-on-brand-primary">verified</span>
                </div>
                <h3 className="text-xl font-semibold text-surface-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-surface-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiriusFooter
        copyrightText={`\u00A9 ${new Date().getFullYear()} RP Automotive Photography. All rights reserved.`}
        termsLink={{ label: 'Terms & Conditions', href: '/terms' }}
      />
    </>
  );
}
