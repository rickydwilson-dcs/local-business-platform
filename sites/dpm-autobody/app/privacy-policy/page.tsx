/**
 * Privacy Policy Page
 *
 * GDPR-compliant privacy policy. Content is base-template's generic legal template (real DPM
 * business data threaded through via `siteConfig`/`lib/contact-info`), but the visual treatment
 * was, until 2026-09-12, still base-template's own generic light-theme classes
 * (`container-standard`, `heading-hero`, `bg-surface-subtle` for card fills) — `surface.subtle`
 * has no override in `theme.config.ts`, so it fell back to the theme-system's light default
 * (`#f9fafb`, near-white), rendering as a bright white card on this otherwise all-dark site.
 * Restyled to the same page-head pattern as `app/library/page.tsx` (eyebrow label, `font-heading`
 * h1, `PAGE` container width) and `surface-card`/`surface-card-border` (DPM's real dark card
 * tokens) for every filled block. The `Breadcrumbs` component and its wrapper bar were dropped —
 * no other real DPM page uses a breadcrumb trail; the masthead's own "All work" back-link already
 * covers wayfinding back off this page.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, BUSINESS_EMAIL, formatAddressSingleLine } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.business.name}`,
  description: `Privacy policy for ${siteConfig.business.name}. Learn how we collect, use, and protect your personal information.`,
  alternates: {
    canonical: absUrl('/privacy-policy'),
  },
};

const PAGE = 'mx-auto w-[min(1360px,100%-3rem)]';
const HAIR = 'border-[rgba(232,228,220,0.14)]';
const H2 =
  'font-heading text-[clamp(1.5rem,2.6vw,2.25rem)] font-light leading-[1.1] tracking-[-0.02em] text-surface-foreground';
const H3 = 'font-medium text-surface-foreground';
const P = 'font-prose text-[1rem] leading-[1.6] text-[#CFCAC1]';
const CARD = `border ${HAIR} bg-surface-card p-5`;
const LINK =
  'text-ink-neutral underline decoration-[rgba(232,228,220,0.35)] hover:text-surface-foreground';

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const toc = [
    { href: '#data-controller', label: 'Data Controller Information' },
    { href: '#data-we-collect', label: 'Data We Collect' },
    { href: '#how-we-use', label: 'How We Use Your Data' },
    { href: '#legal-basis', label: 'Legal Basis for Processing' },
    { href: '#data-sharing', label: 'Data Sharing & Third Parties' },
    { href: '#data-retention', label: 'Data Retention' },
    { href: '#your-rights', label: 'Your Rights' },
    { href: '#cookies', label: 'Cookies' },
    { href: '#contact', label: 'Contact & Complaints' },
  ];

  const rights = [
    { label: 'Right of Access', body: 'Request copies of your personal data' },
    { label: 'Right to Rectification', body: 'Request correction of inaccurate data' },
    { label: 'Right to Erasure', body: 'Request deletion of your data' },
    { label: 'Right to Restrict Processing', body: 'Limit how we use your data' },
    { label: 'Right to Data Portability', body: 'Receive your data in a portable format' },
    { label: 'Right to Object', body: 'Object to certain types of processing' },
  ];

  return (
    <div className="bg-surface-background">
      <div className={`${PAGE} pb-[clamp(4rem,10vh,6rem)]`}>
        <div className="pt-[clamp(9rem,16vh,13rem)] pb-[clamp(2.5rem,6vh,4.5rem)]">
          <p className="m-0 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink-neutral">
            Legal
          </p>
          <h1 className="mt-[0.85rem] max-w-[20ch] text-balance font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground">
            Privacy Policy
          </h1>
          <p className={`mt-4 ${P}`}>Last updated: {lastUpdated}</p>
        </div>

        <div className={`border-t ${HAIR} pt-[clamp(2rem,5vh,3rem)] pb-[clamp(3rem,8vh,4.5rem)]`}>
          <div className={CARD}>
            <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-surface-muted-foreground">
              Contents
            </p>
            <ol className="m-0 grid list-decimal gap-2 pl-5 sm:grid-cols-2">
              {toc.map((item) => (
                <li key={item.href} className={P}>
                  <a href={item.href} className={LINK}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="max-w-[52em]">
          <section
            id="data-controller"
            className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}
          >
            <h2 className={`mb-4 ${H2}`}>1. Data Controller Information</h2>
            <p className={`mb-4 ${P}`}>
              {siteConfig.business.legalName} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
              is the data controller responsible for your personal data.
            </p>
            <div className={CARD}>
              <p className={`mb-1 ${P}`}>
                <strong className={H3}>Business Name:</strong> {siteConfig.business.legalName}
              </p>
              <p className={`mb-1 ${P}`}>
                <strong className={H3}>Address:</strong> {formatAddressSingleLine()}
              </p>
              <p className={`mb-1 ${P}`}>
                <strong className={H3}>Phone:</strong> {PHONE_DISPLAY}
              </p>
              <p className={P}>
                <strong className={H3}>Email:</strong> {BUSINESS_EMAIL}
              </p>
            </div>
          </section>

          <section
            id="data-we-collect"
            className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}
          >
            <h2 className={`mb-4 ${H2}`}>2. Data We Collect</h2>
            <p className={`mb-4 ${P}`}>
              We may collect and process the following types of personal data:
            </p>
            <div className="space-y-3">
              <div className={CARD}>
                <h3 className={H3}>Contact Information</h3>
                <p className={P}>
                  Name, email address, phone number, and postal address when you contact us or
                  request a quote.
                </p>
              </div>
              <div className={CARD}>
                <h3 className={H3}>Project Information</h3>
                <p className={P}>
                  Details about your project requirements, property information, and service
                  preferences.
                </p>
              </div>
              <div className={CARD}>
                <h3 className={H3}>Technical Data</h3>
                <p className={P}>
                  IP address, browser type, device information, and cookies when you visit our
                  website.
                </p>
              </div>
              <div className={CARD}>
                <h3 className={H3}>Communication Records</h3>
                <p className={P}>
                  Records of correspondence if you contact us, including emails and phone call
                  notes.
                </p>
              </div>
            </div>
          </section>

          <section id="how-we-use" className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}>
            <h2 className={`mb-4 ${H2}`}>3. How We Use Your Data</h2>
            <p className={`mb-4 ${P}`}>We use your personal data for the following purposes:</p>
            <ul className={`m-0 list-disc space-y-2 pl-5 ${P}`}>
              <li>To respond to your enquiries and provide quotes</li>
              <li>To deliver our services and fulfil contracts</li>
              <li>To send service updates and communications</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
              <li>To protect our legitimate business interests</li>
            </ul>
          </section>

          <section id="legal-basis" className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}>
            <h2 className={`mb-4 ${H2}`}>4. Legal Basis for Processing</h2>
            <p className={`mb-4 ${P}`}>
              We process your personal data under the following legal bases:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={CARD}>
                <h3 className={H3}>Contract</h3>
                <p className={P}>Processing necessary to perform our services</p>
              </div>
              <div className={CARD}>
                <h3 className={H3}>Legitimate Interest</h3>
                <p className={P}>Business operations and service improvement</p>
              </div>
              <div className={CARD}>
                <h3 className={H3}>Consent</h3>
                <p className={P}>Marketing communications with your permission</p>
              </div>
              <div className={CARD}>
                <h3 className={H3}>Legal Obligation</h3>
                <p className={P}>Compliance with laws and regulations</p>
              </div>
            </div>
          </section>

          <section id="data-sharing" className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}>
            <h2 className={`mb-4 ${H2}`}>5. Data Sharing &amp; Third Parties</h2>
            <p className={`mb-4 ${P}`}>We may share your data with:</p>
            <ul className={`m-0 mb-4 list-disc space-y-2 pl-5 ${P}`}>
              <li>
                Service providers who assist our operations (e.g., IT support, payment processors)
              </li>
              <li>Professional advisors (accountants, lawyers) when required</li>
              <li>Regulatory authorities when legally required</li>
            </ul>
            <p className={P}>
              We do not sell your personal data to third parties. All third parties must respect the
              security of your data and treat it in accordance with the law.
            </p>
          </section>

          <section id="data-retention" className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}>
            <h2 className={`mb-4 ${H2}`}>6. Data Retention</h2>
            <p className={`mb-4 ${P}`}>
              We retain your personal data for as long as necessary to fulfil the purposes we
              collected it for. Retention periods vary based on data type:
            </p>
            <div className={`overflow-x-auto border ${HAIR}`}>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th
                      className={`border-b ${HAIR} p-3 text-left text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-surface-muted-foreground`}
                    >
                      Data Type
                    </th>
                    <th
                      className={`border-b ${HAIR} p-3 text-left text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-surface-muted-foreground`}
                    >
                      Retention Period
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Quote enquiries', '2 years'],
                    ['Customer records', '7 years after last service'],
                    ['Financial records', '7 years (legal requirement)'],
                    ['Marketing consent', 'Until withdrawn'],
                  ].map(([type, period]) => (
                    <tr key={type}>
                      <td className={`border-b ${HAIR} p-3 ${P}`}>{type}</td>
                      <td className={`border-b ${HAIR} p-3 ${P}`}>{period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="your-rights" className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}>
            <h2 className={`mb-4 ${H2}`}>7. Your Rights</h2>
            <p className={`mb-4 ${P}`}>Under UK GDPR, you have the following rights:</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {rights.map((right, index) => (
                <div key={right.label} className="flex items-start gap-3">
                  <span className="mt-0.5 font-heading text-[1.25rem] font-light leading-none text-ink-neutral">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className={H3}>{right.label}</h3>
                    <p className={P}>{right.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className={`mt-4 ${P}`}>
              To exercise any of these rights, please contact us at{' '}
              <a href={`mailto:${BUSINESS_EMAIL}`} className={LINK}>
                {BUSINESS_EMAIL}
              </a>
              .
            </p>
          </section>

          <section id="cookies" className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}>
            <h2 className={`mb-4 ${H2}`}>8. Cookies</h2>
            <p className={P}>
              Our website uses cookies to enhance your experience. For detailed information about
              the cookies we use and how to manage them, please see our{' '}
              <Link href="/cookie-policy" className={LINK}>
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          <section id="contact" className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}>
            <h2 className={`mb-4 ${H2}`}>9. Contact &amp; Complaints</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={CARD}>
                <h3 className={`mb-2 ${H3}`}>Contact Us</h3>
                <p className={`mb-2 ${P}`}>
                  For any questions about this privacy policy or our data practices:
                </p>
                <p className={P}>
                  Email:{' '}
                  <a href={`mailto:${BUSINESS_EMAIL}`} className={LINK}>
                    {BUSINESS_EMAIL}
                  </a>
                </p>
                <p className={P}>Phone: {PHONE_DISPLAY}</p>
              </div>
              <div className={CARD}>
                <h3 className={`mb-2 ${H3}`}>Supervisory Authority</h3>
                <p className={`mb-2 ${P}`}>You have the right to lodge a complaint with:</p>
                <p className={`${P} font-medium text-surface-foreground`}>
                  Information Commissioner&apos;s Office (ICO)
                </p>
                <p className={P}>
                  Website:{' '}
                  <a
                    href="https://ico.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK}
                  >
                    ico.org.uk
                  </a>
                </p>
                <p className={P}>Helpline: 0303 123 1113</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
