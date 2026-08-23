/**
 * Terms and Conditions Page
 *
 * TODO: Draft content pending Ricky's legal review — not reviewed by a solicitor.
 * Commercial terms reflect the pricing model and FAQ data in home-data.ts.
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, BUSINESS_EMAIL, formatAddressSingleLine } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { Breadcrumbs } from '@platform/core-components';

export const metadata: Metadata = {
  title: `Terms and Conditions | ${siteConfig.business.name}`,
  description: `Terms and conditions for ${siteConfig.business.name}. Understand our service terms, pricing models, and your rights.`,
  alternates: {
    canonical: absUrl('/terms-and-conditions'),
  },
};

export default function TermsAndConditionsPage() {
  const breadcrumbItems = [
    { name: 'Terms and Conditions', href: '/terms-and-conditions', current: true },
  ];
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">
        <article className="section-standard">
          <div className="container-standard max-w-4xl">
            <h1 className="heading-hero mb-4">Terms and Conditions</h1>
            <p className="text-surface-muted-foreground mb-8">Last updated: {lastUpdated}</p>

            {/* Table of Contents */}
            <div className="bg-surface-subtle rounded-lg p-6 mb-12">
              <h2 className="text-lg font-semibold mb-4">Contents</h2>
              <ol className="list-decimal list-inside space-y-2 text-brand-primary">
                <li>
                  <a href="#services-overview" className="hover:underline">
                    Services Overview
                  </a>
                </li>
                <li>
                  <a href="#quotes-and-pricing" className="hover:underline">
                    Quotes and Pricing
                  </a>
                </li>
                <li>
                  <a href="#payment" className="hover:underline">
                    Payment Terms
                  </a>
                </li>
                <li>
                  <a href="#ownership" className="hover:underline">
                    Ownership and Intellectual Property
                  </a>
                </li>
                <li>
                  <a href="#hosting-support" className="hover:underline">
                    Hosting and Support
                  </a>
                </li>
                <li>
                  <a href="#cancellation" className="hover:underline">
                    Cancellation and Termination
                  </a>
                </li>
                <li>
                  <a href="#liability" className="hover:underline">
                    Limitation of Liability
                  </a>
                </li>
                <li>
                  <a href="#governing-law" className="hover:underline">
                    Governing Law
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:underline">
                    Contact and Disputes
                  </a>
                </li>
              </ol>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Services Overview */}
              <section id="services-overview" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  1. Services Overview
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  {siteConfig.business.legalName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;,
                  or &quot;Ricky&quot;) provides website design, build, eCommerce solutions, local
                  SEO, ongoing management, analytics reporting, and business email services to small
                  businesses and service providers.
                </p>
                <p className="text-surface-muted-foreground mb-4">
                  Our services include custom design, content creation, website hosting, security,
                  updates, maintenance, and ongoing support. All work is tailored to your business
                  and delivered without templates or builder interfaces.
                </p>
                <div className="bg-surface-subtle rounded-lg p-4">
                  <p className="mb-1">
                    <strong>Service Provider:</strong> {siteConfig.business.legalName}
                  </p>
                  <p className="mb-1">
                    <strong>Address:</strong> {formatAddressSingleLine()}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {PHONE_DISPLAY}
                  </p>
                  <p>
                    <strong>Email:</strong> {BUSINESS_EMAIL}
                  </p>
                </div>
              </section>

              {/* Quotes and Pricing */}
              <section id="quotes-and-pricing" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  2. Quotes and Pricing
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  Quotes are provided in writing and remain valid for 30 days from the date of
                  issue. Prices are based on the project scope outlined in the quote.
                </p>
                <p className="text-surface-muted-foreground mb-4">
                  Our standard pricing tiers are:
                </p>
                <div className="space-y-4">
                  <div className="bg-surface-subtle rounded-lg p-4 border-l-4 border-brand-primary">
                    <h3 className="font-semibold text-surface-foreground">Starter</h3>
                    <p className="text-surface-muted-foreground text-sm mb-2">Up to 5 pages</p>
                    <p className="text-sm">
                      Upfront: £750 + £10/month | Monthly: £45/month with 24-month minimum term
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-4 border-l-4 border-brand-primary">
                    <h3 className="font-semibold text-surface-foreground">Professional</h3>
                    <p className="text-surface-muted-foreground text-sm mb-2">Up to 20 pages</p>
                    <p className="text-sm">
                      Upfront: £1,495 + £15/month | Monthly: £85/month with 24-month minimum term
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-4 border-l-4 border-brand-primary">
                    <h3 className="font-semibold text-surface-foreground">Growth</h3>
                    <p className="text-surface-muted-foreground text-sm mb-2">Up to 100 pages</p>
                    <p className="text-sm">
                      Upfront: £2,995 + £25/month | Monthly: £150/month with 24-month minimum term
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-4 border-l-4 border-brand-primary">
                    <h3 className="font-semibold text-surface-foreground">eCommerce</h3>
                    <p className="text-surface-muted-foreground text-sm mb-2">Online store</p>
                    <p className="text-sm">From £2,995 upfront + £50/month (upfront model only)</p>
                  </div>
                </div>
                <p className="text-surface-muted-foreground mt-4">
                  Prices may be adjusted for scope changes, additional features, or custom
                  requirements. Any changes will be quoted in writing before proceeding.
                </p>
              </section>

              {/* Payment Terms */}
              <section id="payment" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  3. Payment Terms
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  We offer two payment models: upfront and pay-monthly.
                </p>

                <h3 className="font-semibold text-surface-foreground mb-3">Upfront Model</h3>
                <ul className="list-disc list-inside space-y-2 text-surface-muted-foreground mb-6">
                  <li>Full upfront payment is due before work begins</li>
                  <li>Monthly hosting fee is due at the start of each month</li>
                  <li>No long-term commitment beyond the monthly hosting fee</li>
                  <li>Includes all design, build, content, and setup work</li>
                </ul>

                <h3 className="font-semibold text-surface-foreground mb-3">Pay-Monthly Model</h3>
                <ul className="list-disc list-inside space-y-2 text-surface-muted-foreground mb-4">
                  <li>Monthly payment is due at the start of each month</li>
                  <li>Includes all design, build, content, setup, and ongoing hosting</li>
                  <li>24-month minimum term after which the agreement rolls monthly</li>
                  <li>Payment can be made by bank transfer or card</li>
                </ul>

                <p className="text-surface-muted-foreground mb-4">
                  Late payments may result in suspension of hosting and support services. We reserve
                  the right to pursue recovery of unpaid invoices.
                </p>
              </section>

              {/* Ownership and IP */}
              <section id="ownership" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  4. Ownership and Intellectual Property
                </h2>

                <h3 className="font-semibold text-surface-foreground mb-3">
                  Upfront Payment Model
                </h3>
                <p className="text-surface-muted-foreground mb-4">
                  You own your website outright upon payment. This includes all content, design, and
                  the ability to transfer or modify the site as you choose.
                </p>

                <h3 className="font-semibold text-surface-foreground mb-3">Pay-Monthly Model</h3>
                <p className="text-surface-muted-foreground mb-4">
                  You own all content you provide or that we create for you. The website platform,
                  design system, and our proprietary code remain our property. Upon cancellation
                  after your minimum term, the hosting arrangement can transfer to you, allowing you
                  to take your content and continue the site elsewhere if desired.
                </p>

                <p className="text-surface-muted-foreground">
                  We retain intellectual property rights to our processes, methodologies, and design
                  patterns used in delivering our services.
                </p>
              </section>

              {/* Hosting and Support */}
              <section id="hosting-support" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  5. Hosting and Support
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  Your website is hosted on fast UK-based servers with the following included:
                </p>
                <ul className="list-disc list-inside space-y-2 text-surface-muted-foreground mb-4">
                  <li>SSL certificate for secure browsing (HTTPS)</li>
                  <li>Domain renewal and management</li>
                  <li>Security monitoring and uptime alerts</li>
                  <li>Regular security updates and patches</li>
                  <li>Ongoing backups and data protection</li>
                  <li>Technical support and maintenance</li>
                </ul>
                <p className="text-surface-muted-foreground mb-4">
                  For pay-monthly clients, support and changes are handled directly — you contact us
                  with requests and we implement them. There is no CMS, dashboard, or portal to
                  manage.
                </p>
                <p className="text-surface-muted-foreground">
                  We aim to maintain 99% uptime. In the event of downtime, we will work to restore
                  service as quickly as possible. We are not liable for losses resulting from
                  temporary unavailability beyond our reasonable control.
                </p>
              </section>

              {/* Cancellation and Termination */}
              <section id="cancellation" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  6. Cancellation and Termination
                </h2>

                <h3 className="font-semibold text-surface-foreground mb-3">Upfront Model</h3>
                <p className="text-surface-muted-foreground mb-4">
                  No long-term commitment is required. You may cancel at any time by providing 30
                  days' written notice, after which your hosting will cease.
                </p>

                <h3 className="font-semibold text-surface-foreground mb-3">Pay-Monthly Model</h3>
                <p className="text-surface-muted-foreground mb-4">
                  The initial 24-month term is mandatory. After the minimum term expires, you may
                  cancel by providing 30 days' written notice. During the notice period, your
                  website continues to operate normally.
                </p>
                <p className="text-surface-muted-foreground mb-4">
                  Upon cancellation, we will export all your content in standard formats so you can
                  take it elsewhere if desired. No data is deleted or withheld.
                </p>

                <h3 className="font-semibold text-surface-foreground mb-3">
                  Our Cancellation Rights
                </h3>
                <p className="text-surface-muted-foreground">
                  We reserve the right to cancel services if payment is overdue by more than 30
                  days, or if you violate these terms. We will provide 14 days' written notice in
                  such cases.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section id="liability" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  7. Limitation of Liability
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  To the extent permitted by law, our liability for any claim arising from these
                  terms or our services is limited to the total fees you have paid to us in the
                  preceding 12 months.
                </p>
                <p className="text-surface-muted-foreground mb-4">We are not liable for:</p>
                <ul className="list-disc list-inside space-y-2 text-surface-muted-foreground mb-4">
                  <li>Loss of profit, revenue, or data</li>
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Downtime caused by factors beyond our control</li>
                  <li>Damages from third-party actions or services</li>
                </ul>
                <p className="text-surface-muted-foreground">
                  You agree to indemnify us against any claims arising from content you provide,
                  your use of the website, or violation of these terms.
                </p>
              </section>

              {/* Governing Law */}
              <section id="governing-law" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  8. Governing Law
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  These terms and conditions are governed by and construed in accordance with the
                  laws of England and Wales. You agree to submit to the exclusive jurisdiction of
                  the courts of England and Wales for any disputes arising from or relating to these
                  terms or our services.
                </p>
              </section>

              {/* Contact and Disputes */}
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  9. Contact and Disputes
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  If you have questions about these terms or wish to raise a dispute, please contact
                  us:
                </p>
                <div className="bg-surface-subtle rounded-lg p-6">
                  <p className="text-sm mb-2">
                    Email:{' '}
                    <a
                      href={`mailto:${BUSINESS_EMAIL}`}
                      className="text-brand-primary hover:underline"
                    >
                      {BUSINESS_EMAIL}
                    </a>
                  </p>
                  <p className="text-sm mb-2">Phone: {PHONE_DISPLAY}</p>
                  <p className="text-sm">Address: {formatAddressSingleLine()}</p>
                </div>
                <p className="text-surface-muted-foreground mt-4">
                  We will attempt to resolve disputes amicably. If a dispute cannot be resolved
                  through direct communication, either party may pursue legal action in accordance
                  with the governing law section above.
                </p>
              </section>

              {/* Final Note */}
              <section className="mt-12 p-6 bg-brand-primary/5 rounded-lg border border-brand-primary/20">
                <p className="text-sm text-surface-muted-foreground">
                  <strong>Note:</strong> These terms and conditions reflect the standard services
                  and pricing offered by {siteConfig.business.legalName}. They are provided as a
                  guide and represent the commercial terms under which we operate. For any
                  clarification or to discuss specific arrangements, please contact us directly.
                </p>
              </section>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
