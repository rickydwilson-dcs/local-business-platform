/**
 * Cookie Policy Page
 *
 * Restyled for the r9 inner-pages port (Phase 3c) onto the shared
 * `LegalHero`/`LegalDocument` template — see
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/legal.html`
 * and `notes-h.md` for the approved design and its provenance.
 *
 * This is a RESTYLE, not a rewrite: every clause below is the same cookie
 * text this file already shipped, in the same order, under the same
 * section ids. The three cookie tables move from a Tailwind-styled table to
 * `.ltable.ltable--wide` inside `.cscroll` — same three columns, same rows,
 * same cookie names — and §5 (third-party cookies) drops its two bordered
 * cards for two `<h3>` blocks in flow, matching Privacy §9's re-marking
 * (`notes-h.md` §5.3): the words are unchanged in both cases. Headings are
 * sentence-cased per the approved design's site-wide case rule
 * (`notes-c.md` §15); no word of the cookie prose itself was changed.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { BUSINESS_EMAIL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { LegalHero } from '@/components/legal/legal-hero';
import { LegalDocument } from '@/components/legal/legal-document';
import { type LegalTocItem } from '@/components/legal/legal-toc';

export const metadata: Metadata = {
  title: `Cookie Policy | ${siteConfig.business.name}`,
  description: `Cookie policy for ${siteConfig.business.name}. Learn about the cookies we use and how to manage your preferences.`,
  robots: { index: true, follow: true },
  alternates: {
    canonical: absUrl('/cookie-policy'),
  },
};

const TOC_ITEMS: LegalTocItem[] = [
  { id: 'what-are-cookies', label: 'What are cookies?' },
  { id: 'how-we-use', label: 'How we use cookies' },
  { id: 'cookie-categories', label: 'Cookie categories' },
  { id: 'managing-cookies', label: 'Managing your cookies' },
  { id: 'third-party', label: 'Third-party cookies' },
  { id: 'contact', label: 'Contact us' },
];

const OTHER_DOCS = [
  {
    href: '/privacy-policy',
    name: 'Privacy policy',
    description: 'What personal data I hold, why, how long for, and your rights over it.',
  },
  {
    href: '/terms-and-conditions',
    name: 'Terms and conditions',
    description: 'The commercial terms I work under — quotes, payment, ownership, cancellation.',
  },
];

interface CookieRow {
  name: string;
  purpose: string;
  duration: string;
}

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <div className="cscroll">
      <table className="ltable ltable--wide">
        <thead>
          <tr>
            <th scope="col">Cookie</th>
            <th scope="col">Purpose</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row">
                <code>{row.name}</code>
              </th>
              <td>{row.purpose}</td>
              <td>{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const NECESSARY_COOKIES: CookieRow[] = [
  { name: 'cookie_consent', purpose: 'Stores your cookie preferences', duration: '1 year' },
  {
    name: 'csrf_token',
    purpose: 'Security token for form submissions',
    duration: 'Session',
  },
];

const ANALYTICS_COOKIES: CookieRow[] = [
  { name: '_ga', purpose: 'Google Analytics — distinguishes users', duration: '2 years' },
  { name: '_ga_*', purpose: 'Google Analytics — stores session state', duration: '2 years' },
];

const MARKETING_COOKIES: CookieRow[] = [
  { name: '_fbp', purpose: 'Facebook Pixel — tracks conversions', duration: '90 days' },
  { name: 'gclid', purpose: 'Google Ads — tracks ad clicks', duration: '90 days' },
];

const BROWSER_SETTINGS = [
  { browser: 'Chrome', path: 'Settings > Privacy and Security > Cookies' },
  { browser: 'Firefox', path: 'Options > Privacy & Security > Cookies' },
  { browser: 'Safari', path: 'Preferences > Privacy > Cookies' },
  { browser: 'Edge', path: 'Settings > Privacy, Search, and Services > Cookies' },
];

export default function CookiePolicyPage() {
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
        title="Cookie policy"
        current="Cookie policy"
        metaItems={[
          { value: lastUpdated, label: 'Last updated' },
          { value: 'Six sections', label: 'In this document' },
          { value: 'Three', label: 'Cookie categories' },
        ]}
      />

      <LegalDocument tocItems={TOC_ITEMS} otherDocs={OTHER_DOCS}>
        <h2 className="res" id="what-are-cookies">
          1. What are cookies?
        </h2>
        <p>
          Cookies are small text files that are stored on your device when you visit a website. They
          help websites remember your preferences and improve your browsing experience.
        </p>
        <p>
          Cookies can be &quot;session&quot; cookies (deleted when you close your browser) or
          &quot;persistent&quot; cookies (remain until they expire or you delete them).
        </p>

        <h2 className="res" id="how-we-use">
          2. How we use cookies
        </h2>
        <p>We use cookies to:</p>
        <ul>
          <li>Remember your cookie consent preferences</li>
          <li>Understand how you use our website</li>
          <li>Improve our website performance</li>
          <li>Provide relevant content and advertisements</li>
          <li>Ensure website security</li>
        </ul>

        <h2 className="res" id="cookie-categories">
          3. Cookie categories
        </h2>

        <h3>Necessary cookies</h3>
        <p>Required for the website to function. Cannot be disabled.</p>
        <CookieTable rows={NECESSARY_COOKIES} />

        <h3>Analytics cookies</h3>
        <p>Help us understand how visitors use our website.</p>
        <CookieTable rows={ANALYTICS_COOKIES} />

        <h3>Marketing cookies</h3>
        <p>Used to deliver relevant advertisements and track campaign effectiveness.</p>
        <CookieTable rows={MARKETING_COOKIES} />

        <h2 className="res" id="managing-cookies">
          4. Managing your cookies
        </h2>
        <p>You can control cookies through several methods:</p>
        <h3>Consent banner</h3>
        <p>
          When you first visit our site, you can choose which cookie categories to accept using our
          consent banner.
        </p>
        <h3>Browser settings</h3>
        <p>Most browsers allow you to manage cookies through their settings:</p>
        <ul>
          {BROWSER_SETTINGS.map((row) => (
            <li key={row.browser}>
              <strong>{row.browser}:</strong> {row.path}
            </li>
          ))}
        </ul>
        <p>Note: Blocking all cookies may affect website functionality.</p>

        <h2 className="res" id="third-party">
          5. Third-party cookies
        </h2>
        <p>Some cookies are placed by third-party services we use:</p>
        <h3>Google Analytics</h3>
        <p>
          Website analytics to understand visitor behaviour.{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google privacy policy
          </a>
        </p>
        <h3>Facebook Pixel</h3>
        <p>
          Advertising and conversion tracking.{' '}
          <a
            href="https://www.facebook.com/privacy/explanation"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook privacy policy
          </a>
        </p>

        <h2 className="res" id="contact">
          6. Contact us
        </h2>
        <p>
          If you have questions about our use of cookies, please contact us at{' '}
          <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>.
        </p>
        <p>
          For more information about how we handle your personal data, please see our{' '}
          <Link href="/privacy-policy">Privacy policy</Link>.
        </p>
      </LegalDocument>
    </div>
  );
}
