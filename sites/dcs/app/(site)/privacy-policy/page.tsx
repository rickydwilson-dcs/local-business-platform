/**
 * Privacy Policy Page
 *
 * Restyled for the r9 inner-pages port (Phase 3c) onto the shared
 * `LegalHero`/`LegalDocument` template — see
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/legal.html`
 * and `notes-h.md` for the approved design and its provenance.
 *
 * This is a RESTYLE, not a rewrite: every clause below is the same GDPR
 * text this file already shipped, in the same order, under the same
 * section ids (so the TOC anchors below are unchanged). Two structural
 * re-markings only, both documented in `notes-h.md` §5.3 as presentational,
 * not content, changes — the words are identical in both cases:
 *   - §4 (legal bases) and §7 (your rights) move from a `<dl>` grid to a
 *     `<ul>` of `<strong>Term</strong> — Body` (the em dash is the only
 *     added character).
 *   - §9 (contact & complaints) moves from two bordered cards to two `<h3>`
 *     blocks in flow — a card in this design implies a clickable
 *     destination, and nothing here is except the two links.
 * Headings are sentence-cased per the approved design's site-wide case rule
 * (`notes-c.md` §15); proper nouns and initialisms (ICO, UK GDPR) keep
 * their capitals. No word of the legal prose itself was changed.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, BUSINESS_EMAIL, formatAddressSingleLine } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { LegalHero } from '@/components/legal/legal-hero';
import { LegalDocument } from '@/components/legal/legal-document';
import { type LegalTocItem } from '@/components/legal/legal-toc';

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.business.name}`,
  description: `Privacy policy for ${siteConfig.business.name}. Learn how we collect, use, and protect your personal information.`,
  robots: { index: true, follow: true },
  alternates: {
    canonical: absUrl('/privacy-policy'),
  },
};

const TOC_ITEMS: LegalTocItem[] = [
  { id: 'data-controller', label: 'Data controller information' },
  { id: 'data-we-collect', label: 'Data we collect' },
  { id: 'how-we-use', label: 'How we use your data' },
  { id: 'legal-basis', label: 'Legal basis for processing' },
  { id: 'data-sharing', label: 'Data sharing & third parties' },
  { id: 'data-retention', label: 'Data retention' },
  { id: 'your-rights', label: 'Your rights' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'contact', label: 'Contact & complaints' },
];

const OTHER_DOCS = [
  {
    href: '/cookie-policy',
    name: 'Cookie policy',
    description: 'What gets set on your device, why, and how to turn it off.',
  },
  {
    href: '/terms-and-conditions',
    name: 'Terms and conditions',
    description: 'The commercial terms I work under — quotes, payment, ownership, cancellation.',
  },
];

const DATA_WE_COLLECT = [
  {
    title: 'Contact information',
    body: 'Name, email address, phone number, and postal address when you contact us or request a quote.',
  },
  {
    title: 'Project information',
    body: 'Details about your project requirements, property information, and service preferences.',
  },
  {
    title: 'Technical data',
    body: 'IP address, browser type, device information, and cookies when you visit our website.',
  },
  {
    title: 'Communication records',
    body: 'Records of correspondence if you contact us, including emails and phone call notes.',
  },
];

const LEGAL_BASES = [
  { title: 'Contract', body: 'Processing necessary to perform our services' },
  { title: 'Legitimate interest', body: 'Business operations and service improvement' },
  { title: 'Consent', body: 'Marketing communications with your permission' },
  { title: 'Legal obligation', body: 'Compliance with laws and regulations' },
];

const RETENTION_PERIODS = [
  { type: 'Quote enquiries', period: '2 years' },
  { type: 'Customer records', period: '7 years after last service' },
  { type: 'Financial records', period: '7 years (legal requirement)' },
  { type: 'Marketing consent', period: 'Until withdrawn' },
];

const YOUR_RIGHTS = [
  { title: 'Right of access', body: 'Request copies of your personal data' },
  { title: 'Right to rectification', body: 'Request correction of inaccurate data' },
  { title: 'Right to erasure', body: 'Request deletion of your data' },
  { title: 'Right to restrict processing', body: 'Limit how we use your data' },
  { title: 'Right to data portability', body: 'Receive your data in a portable format' },
  { title: 'Right to object', body: 'Object to certain types of processing' },
];

export default function PrivacyPolicyPage() {
  /*
   * The date this document's TEXT last changed — authored by hand, deliberately.
   *
   * This was `new Date().toLocaleDateString(...)`, which is evaluated at BUILD
   * time. Because these pages are statically generated, every deploy restamped
   * all three legal documents as "last updated" that day, whether or not a word
   * had changed — so the date was guaranteed to be wrong except by coincidence,
   * and on a privacy policy a false revision date is misleading rather than
   * merely untidy.
   *
   * 23 August 2026 is when this file's content last changed in git history.
   * UPDATE THIS BY HAND whenever the wording below actually changes.
   */
  const lastUpdated = '23 August 2026';

  return (
    <div className="font-body">
      <LegalHero
        title="Privacy policy"
        current="Privacy policy"
        metaItems={[
          { value: lastUpdated, label: 'Last updated' },
          { value: 'Nine sections', label: 'In this document' },
          { value: 'ICO', label: 'Supervisory authority' },
        ]}
      />

      <LegalDocument tocItems={TOC_ITEMS} otherDocs={OTHER_DOCS}>
        <h2 className="res" id="data-controller">
          1. Data controller information
        </h2>
        <p>
          {siteConfig.business.legalName} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
          the data controller responsible for your personal data.
        </p>
        <div className="mast__meta">
          <div>
            <b>{siteConfig.business.legalName}</b>
            <span>Business name</span>
          </div>
          <div>
            <b>{formatAddressSingleLine()}</b>
            <span>Address</span>
          </div>
          <div>
            <b>{PHONE_DISPLAY}</b>
            <span>Phone</span>
          </div>
          <div>
            <b>
              <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
            </b>
            <span>Email</span>
          </div>
        </div>

        <h2 className="res" id="data-we-collect">
          2. Data we collect
        </h2>
        <p>We may collect and process the following types of personal data:</p>
        {DATA_WE_COLLECT.map((item) => (
          <div key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}

        <h2 className="res" id="how-we-use">
          3. How we use your data
        </h2>
        <p>We use your personal data for the following purposes:</p>
        <ul>
          <li>To respond to your enquiries and provide quotes</li>
          <li>To deliver our services and fulfil contracts</li>
          <li>To send service updates and communications</li>
          <li>To improve our website and services</li>
          <li>To comply with legal obligations</li>
          <li>To protect our legitimate business interests</li>
        </ul>

        <h2 className="res" id="legal-basis">
          4. Legal basis for processing
        </h2>
        <p>We process your personal data under the following legal bases:</p>
        <ul>
          {LEGAL_BASES.map((basis) => (
            <li key={basis.title}>
              <strong>{basis.title}</strong> &mdash; {basis.body}
            </li>
          ))}
        </ul>

        <h2 className="res" id="data-sharing">
          5. Data sharing &amp; third parties
        </h2>
        <p>We may share your data with:</p>
        <ul>
          <li>
            Service providers who assist our operations (e.g., IT support, payment processors)
          </li>
          <li>Professional advisors (accountants, lawyers) when required</li>
          <li>Regulatory authorities when legally required</li>
        </ul>
        <p>
          We do not sell your personal data to third parties. All third parties must respect the
          security of your data and treat it in accordance with the law.
        </p>

        <h2 className="res" id="data-retention">
          6. Data retention
        </h2>
        <p>
          We retain your personal data for as long as necessary to fulfil the purposes we collected
          it for. Retention periods vary based on data type:
        </p>
        <div className="cscroll">
          <table className="ltable">
            <thead>
              <tr>
                <th scope="col">Data type</th>
                <th scope="col">Retention period</th>
              </tr>
            </thead>
            <tbody>
              {RETENTION_PERIODS.map((row) => (
                <tr key={row.type}>
                  <th scope="row">{row.type}</th>
                  <td>{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="res" id="your-rights">
          7. Your rights
        </h2>
        <p>Under UK GDPR, you have the following rights:</p>
        <ul>
          {YOUR_RIGHTS.map((right) => (
            <li key={right.title}>
              <strong>{right.title}</strong> &mdash; {right.body}
            </li>
          ))}
        </ul>
        <p>
          To exercise any of these rights, please contact us at{' '}
          <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>.
        </p>

        <h2 className="res" id="cookies">
          8. Cookies
        </h2>
        <p>
          Our website uses cookies to enhance your experience. For detailed information about the
          cookies we use and how to manage them, please see our{' '}
          <Link href="/cookie-policy">Cookie policy</Link>.
        </p>

        <h2 className="res" id="contact">
          9. Contact &amp; complaints
        </h2>
        <h3>Contact us</h3>
        <p>For any questions about this privacy policy or our data practices:</p>
        <p>
          Email: <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          <br />
          Phone: {PHONE_DISPLAY}
        </p>
        <h3>Supervisory authority</h3>
        <p>You have the right to lodge a complaint with:</p>
        <p>
          <strong>Information Commissioner&rsquo;s Office (ICO)</strong>
          <br />
          Website:{' '}
          <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
            ico.org.uk
          </a>
          <br />
          Helpline: 0303 123 1113
        </p>
      </LegalDocument>
    </div>
  );
}
