{
  /* Source: https://www.rpautomotivephotography.com — contact blueprint */
}

import { SiriusHeader } from '@platform/themes/sirius/components';
import { SiriusFooter } from '@platform/themes/sirius/components';
import { PageTitleBanner } from '@platform/themes/sirius/components';
import { ContactFormSection } from '@platform/themes/sirius/components';

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
      <PageTitleBanner pageTitle="Contact" />

      {/* Contact Form — theme component */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactFormSection />
        </div>
      </section>

      {/* Location Info */}
      <section className="py-12 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-surface-foreground mb-4">Location</h2>
          <p className="text-surface-muted-foreground mb-2">Based in Sussex, UK</p>
          <p className="text-surface-muted-foreground">
            Available for shoots anywhere — travel is part of the adventure.
          </p>
        </div>
      </section>

      <SiriusFooter
        copyrightText={`\u00A9 ${new Date().getFullYear()} RP Automotive Photography. All rights reserved.`}
        termsLink={{ label: 'Terms & Conditions', href: '/terms' }}
      />
    </>
  );
}
