/**
 * Privacy Policy Page
 *
 * GDPR-compliant privacy policy template.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, BUSINESS_EMAIL, formatAddressSingleLine } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { LegalHero } from '@/components/legal/legal-hero';
import { LegalToc, type LegalTocItem } from '@/components/legal/legal-toc';

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.business.name}`,
  description: `Privacy policy for ${siteConfig.business.name}. Learn how we collect, use, and protect your personal information.`,
  alternates: {
    canonical: absUrl('/privacy-policy'),
  },
};

const TOC_ITEMS: LegalTocItem[] = [
  { id: 'data-controller', label: 'Data Controller Information' },
  { id: 'data-we-collect', label: 'Data We Collect' },
  { id: 'how-we-use', label: 'How We Use Your Data' },
  { id: 'legal-basis', label: 'Legal Basis for Processing' },
  { id: 'data-sharing', label: 'Data Sharing & Third Parties' },
  { id: 'data-retention', label: 'Data Retention' },
  { id: 'your-rights', label: 'Your Rights' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'contact', label: 'Contact & Complaints' },
];

const DATA_WE_COLLECT = [
  {
    title: 'Contact Information',
    body: 'Name, email address, phone number, and postal address when you contact us or request a quote.',
  },
  {
    title: 'Project Information',
    body: 'Details about your project requirements, property information, and service preferences.',
  },
  {
    title: 'Technical Data',
    body: 'IP address, browser type, device information, and cookies when you visit our website.',
  },
  {
    title: 'Communication Records',
    body: 'Records of correspondence if you contact us, including emails and phone call notes.',
  },
];

const LEGAL_BASES = [
  { title: 'Contract', body: 'Processing necessary to perform our services' },
  { title: 'Legitimate Interest', body: 'Business operations and service improvement' },
  { title: 'Consent', body: 'Marketing communications with your permission' },
  { title: 'Legal Obligation', body: 'Compliance with laws and regulations' },
];

const RETENTION_PERIODS = [
  { type: 'Quote enquiries', period: '2 years' },
  { type: 'Customer records', period: '7 years after last service' },
  { type: 'Financial records', period: '7 years (legal requirement)' },
  { type: 'Marketing consent', period: 'Until withdrawn' },
];

const YOUR_RIGHTS = [
  { title: 'Right of Access', body: 'Request copies of your personal data' },
  { title: 'Right to Rectification', body: 'Request correction of inaccurate data' },
  { title: 'Right to Erasure', body: 'Request deletion of your data' },
  { title: 'Right to Restrict Processing', body: 'Limit how we use your data' },
  { title: 'Right to Data Portability', body: 'Receive your data in a portable format' },
  { title: 'Right to Object', body: 'Object to certain types of processing' },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="font-body">
      <LegalHero title="Privacy Policy" current="Privacy Policy" lastUpdated={lastUpdated} />

      <div className="bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
            <aside className="hidden lg:block">
              <LegalToc items={TOC_ITEMS} />
            </aside>

            <article className="max-w-[680px]">
              {/* Data Controller */}
              <section id="data-controller" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  1. Data Controller Information
                </h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-5">
                  {siteConfig.business.legalName} (&quot;we&quot;, &quot;us&quot;, or
                  &quot;our&quot;) is the data controller responsible for your personal data.
                </p>
                <dl className="bg-surface-card border border-surface-border rounded-[20px] p-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                  <dt className="font-semibold text-surface-foreground">Business Name</dt>
                  <dd className="text-surface-muted-foreground">{siteConfig.business.legalName}</dd>
                  <dt className="font-semibold text-surface-foreground">Address</dt>
                  <dd className="text-surface-muted-foreground">{formatAddressSingleLine()}</dd>
                  <dt className="font-semibold text-surface-foreground">Phone</dt>
                  <dd className="text-surface-muted-foreground">{PHONE_DISPLAY}</dd>
                  <dt className="font-semibold text-surface-foreground">Email</dt>
                  <dd className="text-surface-muted-foreground">{BUSINESS_EMAIL}</dd>
                </dl>
              </section>

              {/* Data We Collect */}
              <section id="data-we-collect" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  2. Data We Collect
                </h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-6">
                  We may collect and process the following types of personal data:
                </p>
                <div className="space-y-6">
                  {DATA_WE_COLLECT.map((item) => (
                    <div key={item.title}>
                      <h3 className="font-semibold text-surface-foreground mb-1">{item.title}</h3>
                      <p className="text-surface-muted-foreground text-sm leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* How We Use Data */}
              <section id="how-we-use" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  3. How We Use Your Data
                </h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-4">
                  We use your personal data for the following purposes:
                </p>
                <ul className="list-disc list-outside pl-5 space-y-2 text-surface-muted-foreground leading-relaxed">
                  <li>To respond to your enquiries and provide quotes</li>
                  <li>To deliver our services and fulfil contracts</li>
                  <li>To send service updates and communications</li>
                  <li>To improve our website and services</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our legitimate business interests</li>
                </ul>
              </section>

              {/* Legal Basis */}
              <section id="legal-basis" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  4. Legal Basis for Processing
                </h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-6">
                  We process your personal data under the following legal bases:
                </p>
                <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                  {LEGAL_BASES.map((basis) => (
                    <div key={basis.title} className="border-t border-surface-border pt-3">
                      <dt className="font-semibold text-surface-foreground">{basis.title}</dt>
                      <dd className="text-sm text-surface-muted-foreground">{basis.body}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* Data Sharing */}
              <section id="data-sharing" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  5. Data Sharing &amp; Third Parties
                </h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-4">
                  We may share your data with:
                </p>
                <ul className="list-disc list-outside pl-5 space-y-2 text-surface-muted-foreground leading-relaxed mb-4">
                  <li>
                    Service providers who assist our operations (e.g., IT support, payment
                    processors)
                  </li>
                  <li>Professional advisors (accountants, lawyers) when required</li>
                  <li>Regulatory authorities when legally required</li>
                </ul>
                <p className="text-surface-muted-foreground leading-relaxed">
                  We do not sell your personal data to third parties. All third parties must respect
                  the security of your data and treat it in accordance with the law.
                </p>
              </section>

              {/* Data Retention */}
              <section id="data-retention" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  6. Data Retention
                </h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-6">
                  We retain your personal data for as long as necessary to fulfil the purposes we
                  collected it for. Retention periods vary based on data type:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-surface-border">
                        <th className="py-3 text-left font-semibold text-surface-foreground">
                          Data Type
                        </th>
                        <th className="py-3 text-left font-semibold text-surface-foreground">
                          Retention Period
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {RETENTION_PERIODS.map((row) => (
                        <tr key={row.type}>
                          <td className="py-3 text-surface-muted-foreground">{row.type}</td>
                          <td className="py-3 text-surface-muted-foreground">{row.period}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Your Rights */}
              <section id="your-rights" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">7. Your Rights</h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-6">
                  Under UK GDPR, you have the following rights:
                </p>
                <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mb-6">
                  {YOUR_RIGHTS.map((right) => (
                    <div key={right.title}>
                      <dt className="font-semibold text-surface-foreground text-sm">
                        {right.title}
                      </dt>
                      <dd className="text-sm text-surface-muted-foreground">{right.body}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-surface-muted-foreground leading-relaxed">
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
              <section id="cookies" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">8. Cookies</h2>
                <p className="text-surface-muted-foreground leading-relaxed">
                  Our website uses cookies to enhance your experience. For detailed information
                  about the cookies we use and how to manage them, please see our{' '}
                  <Link href="/cookie-policy" className="text-brand-primary hover:underline">
                    Cookie Policy
                  </Link>
                  .
                </p>
              </section>

              {/* Contact & Complaints */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  9. Contact &amp; Complaints
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-surface-card border border-surface-border rounded-[20px] p-6">
                    <h3 className="font-semibold text-surface-foreground mb-3">Contact Us</h3>
                    <p className="text-surface-muted-foreground text-sm mb-3">
                      For any questions about this privacy policy or our data practices:
                    </p>
                    <p className="text-sm">
                      Email:{' '}
                      <a
                        href={`mailto:${BUSINESS_EMAIL}`}
                        className="text-brand-primary hover:underline"
                      >
                        {BUSINESS_EMAIL}
                      </a>
                    </p>
                    <p className="text-sm text-surface-muted-foreground">Phone: {PHONE_DISPLAY}</p>
                  </div>
                  <div className="bg-surface-card border border-surface-border rounded-[20px] p-6">
                    <h3 className="font-semibold text-surface-foreground mb-3">
                      Supervisory Authority
                    </h3>
                    <p className="text-surface-muted-foreground text-sm mb-3">
                      You have the right to lodge a complaint with:
                    </p>
                    <p className="text-sm font-medium text-surface-foreground">
                      Information Commissioner&apos;s Office (ICO)
                    </p>
                    <p className="text-sm">
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
                    <p className="text-sm text-surface-muted-foreground">Helpline: 0303 123 1113</p>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
