{
  /* Source: https://www.rpautomotivephotography.com — blog-list blueprint */
}

import { SiriusHeader } from '@platform/themes/sirius/components';
import { SiriusFooter } from '@platform/themes/sirius/components';
import { PageTitleBanner } from '@platform/themes/sirius/components';
import { BlogPostGrid } from '@platform/themes/sirius/components';

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
      <PageTitleBanner pageTitle="Blog" />

      {/* Blog Post Grid — theme component */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogPostGrid />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-on-brand-primary mb-4">Want to Be Featured?</h2>
          <p className="text-on-brand-primary mb-8">
            If you have a vehicle you would like professionally photographed, get in touch.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-surface-background text-brand-primary font-semibold hover:bg-surface-muted transition-all duration-200"
          >
            Book a Session
          </a>
        </div>
      </section>

      <SiriusFooter
        copyrightText={`\u00A9 ${new Date().getFullYear()} RP Automotive Photography. All rights reserved.`}
        termsLink={{ label: 'Terms & Conditions', href: '/terms' }}
      />
    </>
  );
}
