/**
 * Privacy Policy Page
 *
 * GDPR-compliant privacy policy template.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { BUSINESS_EMAIL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { Breadcrumbs } from '@platform/core-components';

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.business.name}`,
  description: `Privacy policy for ${siteConfig.business.name}. Learn how we collect, use, and protect your personal information.`,
  alternates: {
    canonical: absUrl('/privacy-policy'),
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [{ name: 'Privacy Policy', href: '/privacy-policy', current: true }];
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
            <h1 className="heading-hero mb-4">Privacy Policy</h1>
            <p className="text-surface-muted-foreground mb-8">Last updated: {lastUpdated}</p>

            {/* Table of Contents */}
            <div className="bg-surface-subtle rounded-lg p-6 mb-12">
              <h2 className="text-lg font-semibold mb-4">Contents</h2>
              <ol className="list-decimal list-inside space-y-2 text-brand-primary">
                <li>
                  <a href="#data-controller" className="hover:underline">
                    Data Controller Information
                  </a>
                </li>
                <li>
                  <a href="#data-we-collect" className="hover:underline">
                    Data We Collect
                  </a>
                </li>
                <li>
                  <a href="#how-we-use" className="hover:underline">
                    How We Use Your Data
                  </a>
                </li>
                <li>
                  <a href="#legal-basis" className="hover:underline">
                    Legal Basis for Processing
                  </a>
                </li>
                <li>
                  <a href="#data-sharing" className="hover:underline">
                    Data Sharing & Third Parties
                  </a>
                </li>
                <li>
                  <a href="#data-retention" className="hover:underline">
                    Data Retention
                  </a>
                </li>
                <li>
                  <a href="#your-rights" className="hover:underline">
                    Your Rights
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="hover:underline">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:underline">
                    Contact & Complaints
                  </a>
                </li>
              </ol>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Data Controller */}
              <section id="data-controller" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  1. Data Controller Information
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  {siteConfig.business.legalName} (&quot;we&quot;, &quot;us&quot;, or
                  &quot;our&quot;) is the data controller responsible for your personal data.{' '}
                  {siteConfig.business.name} has no public office address or phone number — email is
                  the team&apos;s only public contact channel.
                </p>
                <div className="bg-surface-subtle rounded-lg p-4 text-surface-foreground">
                  <p className="mb-1">
                    <strong className="text-surface-foreground">Business Name:</strong>{' '}
                    {siteConfig.business.legalName}
                  </p>
                  <p>
                    <strong className="text-surface-foreground">Email:</strong> {BUSINESS_EMAIL}
                  </p>
                </div>
              </section>

              {/* Data We Collect */}
              <section id="data-we-collect" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  2. Data We Collect
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  We may collect and process the following types of personal data:
                </p>
                <div className="space-y-4">
                  <div className="bg-surface-subtle rounded-lg p-4 border-l-4 border-brand-primary">
                    <h3 className="font-semibold text-surface-foreground">Contact Information</h3>
                    <p className="text-surface-muted-foreground text-sm">
                      Name and email address when you contact us via email or our contact form.
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-4 border-l-4 border-brand-primary">
                    <h3 className="font-semibold text-surface-foreground">
                      Sponsorship &amp; Partnership Enquiries
                    </h3>
                    <p className="text-surface-muted-foreground text-sm">
                      Details you share about your organisation or proposal when enquiring about
                      sponsorship or a partnership.
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-4 border-l-4 border-brand-primary">
                    <h3 className="font-semibold text-surface-foreground">Technical Data</h3>
                    <p className="text-surface-muted-foreground text-sm">
                      IP address, browser type, device information, and cookies when you visit our
                      website.
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-4 border-l-4 border-brand-primary">
                    <h3 className="font-semibold text-surface-foreground">Communication Records</h3>
                    <p className="text-surface-muted-foreground text-sm">
                      Records of correspondence if you contact us, including emails and phone call
                      notes.
                    </p>
                  </div>
                </div>
              </section>

              {/* How We Use Data */}
              <section id="how-we-use" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  3. How We Use Your Data
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  We use your personal data for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-surface-muted-foreground">
                  <li>To respond to your enquiries, including sponsorship and media requests</li>
                  <li>To send team news and communications you&apos;ve asked for</li>
                  <li>To improve our website</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our legitimate business interests</li>
                </ul>
              </section>

              {/* Legal Basis */}
              <section id="legal-basis" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  4. Legal Basis for Processing
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  We process your personal data under the following legal bases:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-surface-subtle rounded-lg p-4">
                    <h3 className="font-semibold text-surface-foreground">Contract</h3>
                    <p className="text-sm text-surface-muted-foreground">
                      Processing necessary to respond to sponsorship or partnership proposals
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-4">
                    <h3 className="font-semibold text-surface-foreground">Legitimate Interest</h3>
                    <p className="text-sm text-surface-muted-foreground">
                      Business operations and service improvement
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-4">
                    <h3 className="font-semibold text-surface-foreground">Consent</h3>
                    <p className="text-sm text-surface-muted-foreground">
                      Marketing communications with your permission
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-4">
                    <h3 className="font-semibold text-surface-foreground">Legal Obligation</h3>
                    <p className="text-sm text-surface-muted-foreground">
                      Compliance with laws and regulations
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Sharing */}
              <section id="data-sharing" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  5. Data Sharing & Third Parties
                </h2>
                <p className="text-surface-muted-foreground mb-4">We may share your data with:</p>
                <ul className="list-disc list-inside space-y-2 text-surface-muted-foreground mb-4">
                  <li>
                    Service providers who assist our operations (e.g., IT support, payment
                    processors)
                  </li>
                  <li>Professional advisors (accountants, lawyers) when required</li>
                  <li>Regulatory authorities when legally required</li>
                </ul>
                <p className="text-surface-muted-foreground">
                  We do not sell your personal data to third parties. All third parties must respect
                  the security of your data and treat it in accordance with the law.
                </p>
              </section>

              {/* Data Retention */}
              <section id="data-retention" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  6. Data Retention
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  We retain your personal data for as long as necessary to fulfil the purposes we
                  collected it for. Retention periods vary based on data type:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-surface-subtle">
                        <th className="border border-surface-border p-3 text-left">Data Type</th>
                        <th className="border border-surface-border p-3 text-left">
                          Retention Period
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-surface-border p-3">General enquiries</td>
                        <td className="border border-surface-border p-3">2 years</td>
                      </tr>
                      <tr>
                        <td className="border border-surface-border p-3">Financial records</td>
                        <td className="border border-surface-border p-3">
                          7 years (legal requirement)
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-surface-border p-3">Marketing consent</td>
                        <td className="border border-surface-border p-3">Until withdrawn</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Your Rights */}
              <section id="your-rights" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">7. Your Rights</h2>
                <p className="text-surface-muted-foreground mb-4">
                  Under UK GDPR, you have the following rights:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-primary/10 rounded-full p-2 flex-shrink-0">
                      <span className="text-brand-primary font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Right of Access</h3>
                      <p className="text-sm text-surface-muted-foreground">
                        Request copies of your personal data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-primary/10 rounded-full p-2 flex-shrink-0">
                      <span className="text-brand-primary font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Right to Rectification</h3>
                      <p className="text-sm text-surface-muted-foreground">
                        Request correction of inaccurate data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-primary/10 rounded-full p-2 flex-shrink-0">
                      <span className="text-brand-primary font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Right to Erasure</h3>
                      <p className="text-sm text-surface-muted-foreground">
                        Request deletion of your data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-primary/10 rounded-full p-2 flex-shrink-0">
                      <span className="text-brand-primary font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Right to Restrict Processing</h3>
                      <p className="text-sm text-surface-muted-foreground">
                        Limit how we use your data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-primary/10 rounded-full p-2 flex-shrink-0">
                      <span className="text-brand-primary font-bold">5</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Right to Data Portability</h3>
                      <p className="text-sm text-surface-muted-foreground">
                        Receive your data in a portable format
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-primary/10 rounded-full p-2 flex-shrink-0">
                      <span className="text-brand-primary font-bold">6</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Right to Object</h3>
                      <p className="text-sm text-surface-muted-foreground">
                        Object to certain types of processing
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-surface-muted-foreground mt-4">
                  To exercise any of these rights, please contact us at{' '}
                  <a
                    href={`mailto:${BUSINESS_EMAIL}`}
                    className="text-brand-primary hover:underline"
                  >
                    {BUSINESS_EMAIL}
                  </a>
                  .
                </p>
              </section>

              {/* Cookies */}
              <section id="cookies" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">8. Cookies</h2>
                <p className="text-surface-muted-foreground mb-4">
                  Our website uses cookies to enhance your experience. For detailed information
                  about the cookies we use and how to manage them, please see our{' '}
                  <Link href="/cookie-policy" className="text-brand-primary hover:underline">
                    Cookie Policy
                  </Link>
                  .
                </p>
              </section>

              {/* Contact & Complaints */}
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  9. Contact & Complaints
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-surface-subtle rounded-lg p-6">
                    <h3 className="font-semibold text-surface-foreground mb-4">Contact Us</h3>
                    <p className="text-surface-muted-foreground text-sm mb-2">
                      For any questions about this privacy policy or our data practices:
                    </p>
                    <p className="text-sm text-surface-foreground">
                      Email:{' '}
                      <a
                        href={`mailto:${BUSINESS_EMAIL}`}
                        className="text-brand-primary hover:underline"
                      >
                        {BUSINESS_EMAIL}
                      </a>
                    </p>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-6">
                    <h3 className="font-semibold text-surface-foreground mb-4">
                      Supervisory Authority
                    </h3>
                    <p className="text-surface-muted-foreground text-sm mb-2">
                      You have the right to lodge a complaint with:
                    </p>
                    <p className="text-sm font-medium text-surface-foreground">
                      Information Commissioner&apos;s Office (ICO)
                    </p>
                    <p className="text-sm text-surface-foreground">
                      Website:{' '}
                      <a
                        href="https://ico.org.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:underline"
                      >
                        ico.org.uk
                      </a>
                    </p>
                    <p className="text-sm text-surface-foreground">Helpline: 0303 123 1113</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
