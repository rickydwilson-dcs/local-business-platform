/**
 * Cookie Policy Page
 *
 * Cookie compliance and transparency page. See app/privacy-policy/page.tsx's file header for why
 * this was restyled 2026-09-12 (base-template's generic light-theme classes rendering a bright
 * white card on this all-dark site) and what replaced them — the same pattern is used here.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { BUSINESS_EMAIL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: `Cookie Policy | ${siteConfig.business.name}`,
  description: `Cookie policy for ${siteConfig.business.name}. Learn about the cookies we use and how to manage your preferences.`,
  alternates: {
    canonical: absUrl('/cookie-policy'),
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

function CookieTable({
  rows,
}: {
  rows: Array<{ cookie: string; purpose: string; duration: string }>;
}) {
  return (
    <div className={`overflow-x-auto border ${HAIR}`}>
      <table className="w-full border-collapse text-[0.9375rem]">
        <thead>
          <tr>
            <th
              className={`border-b ${HAIR} p-2.5 text-left text-[0.75rem] font-medium uppercase tracking-[0.1em] text-surface-muted-foreground`}
            >
              Cookie
            </th>
            <th
              className={`border-b ${HAIR} p-2.5 text-left text-[0.75rem] font-medium uppercase tracking-[0.1em] text-surface-muted-foreground`}
            >
              Purpose
            </th>
            <th
              className={`border-b ${HAIR} p-2.5 text-left text-[0.75rem] font-medium uppercase tracking-[0.1em] text-surface-muted-foreground`}
            >
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.cookie}>
              <td className={`border-b ${HAIR} p-2.5 font-mono text-[0.8125rem] text-[#CFCAC1]`}>
                {row.cookie}
              </td>
              <td className={`border-b ${HAIR} p-2.5 ${P}`}>{row.purpose}</td>
              <td className={`border-b ${HAIR} p-2.5 ${P}`}>{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const toc = [
    { href: '#what-are-cookies', label: 'What Are Cookies?' },
    { href: '#how-we-use', label: 'How We Use Cookies' },
    { href: '#cookie-categories', label: 'Cookie Categories' },
    { href: '#managing-cookies', label: 'Managing Your Cookies' },
    { href: '#third-party', label: 'Third-Party Cookies' },
    { href: '#contact', label: 'Contact Us' },
  ];

  return (
    <div className="bg-surface-background">
      <div className={`${PAGE} pb-[clamp(4rem,10vh,6rem)]`}>
        <div className="pt-[clamp(9rem,16vh,13rem)] pb-[clamp(2.5rem,6vh,4.5rem)]">
          <p className="m-0 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink-neutral">
            Legal
          </p>
          <h1 className="mt-[0.85rem] max-w-[20ch] text-balance font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground">
            Cookie Policy
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
            id="what-are-cookies"
            className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}
          >
            <h2 className={`mb-4 ${H2}`}>1. What Are Cookies?</h2>
            <p className={`mb-4 ${P}`}>
              Cookies are small text files that are stored on your device when you visit a website.
              They help websites remember your preferences and improve your browsing experience.
            </p>
            <p className={P}>
              Cookies can be &quot;session&quot; cookies (deleted when you close your browser) or
              &quot;persistent&quot; cookies (remain until they expire or you delete them).
            </p>
          </section>

          <section id="how-we-use" className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}>
            <h2 className={`mb-4 ${H2}`}>2. How We Use Cookies</h2>
            <p className={`mb-4 ${P}`}>We use cookies to:</p>
            <ul className={`m-0 list-disc space-y-2 pl-5 ${P}`}>
              <li>Remember your cookie consent preferences</li>
              <li>Understand how you use our website</li>
              <li>Improve our website performance</li>
              <li>Provide relevant content and advertisements</li>
              <li>Ensure website security</li>
            </ul>
          </section>

          <section
            id="cookie-categories"
            className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}
          >
            <h2 className={`mb-6 ${H2}`}>3. Cookie Categories</h2>

            <div className="mb-8">
              <div className={`${CARD} mb-4`}>
                <h3 className={H3}>Necessary Cookies</h3>
                <p className={P}>Required for the website to function. Cannot be disabled.</p>
              </div>
              <CookieTable
                rows={[
                  {
                    cookie: 'cookie_consent',
                    purpose: 'Stores your cookie preferences',
                    duration: '1 year',
                  },
                  {
                    cookie: 'csrf_token',
                    purpose: 'Security token for form submissions',
                    duration: 'Session',
                  },
                ]}
              />
            </div>

            <div className="mb-8">
              <div className={`${CARD} mb-4`}>
                <h3 className={H3}>Analytics Cookies</h3>
                <p className={P}>Help us understand how visitors use our website.</p>
              </div>
              <CookieTable
                rows={[
                  {
                    cookie: '_ga',
                    purpose: 'Google Analytics - distinguishes users',
                    duration: '2 years',
                  },
                  {
                    cookie: '_ga_*',
                    purpose: 'Google Analytics - stores session state',
                    duration: '2 years',
                  },
                ]}
              />
            </div>

            <div>
              <div className={`${CARD} mb-4`}>
                <h3 className={H3}>Marketing Cookies</h3>
                <p className={P}>
                  Used to deliver relevant advertisements and track campaign effectiveness.
                </p>
              </div>
              <CookieTable
                rows={[
                  {
                    cookie: '_fbp',
                    purpose: 'Facebook Pixel - tracks conversions',
                    duration: '90 days',
                  },
                  {
                    cookie: 'gclid',
                    purpose: 'Google Ads - tracks ad clicks',
                    duration: '90 days',
                  },
                ]}
              />
            </div>
          </section>

          <section
            id="managing-cookies"
            className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}
          >
            <h2 className={`mb-4 ${H2}`}>4. Managing Your Cookies</h2>
            <p className={`mb-4 ${P}`}>You can control cookies through several methods:</p>

            <h3 className={`mt-6 mb-3 ${H3}`}>Consent Banner</h3>
            <p className={`mb-4 ${P}`}>
              When you first visit our site, you can choose which cookie categories to accept using
              our consent banner.
            </p>

            <h3 className={`mt-6 mb-3 ${H3}`}>Browser Settings</h3>
            <p className={`mb-4 ${P}`}>
              Most browsers allow you to manage cookies through their settings:
            </p>
            <ul className={`m-0 mb-4 list-disc space-y-2 pl-5 ${P}`}>
              <li>
                <strong className={H3}>Chrome:</strong> Settings &gt; Privacy and Security &gt;
                Cookies
              </li>
              <li>
                <strong className={H3}>Firefox:</strong> Options &gt; Privacy &amp; Security &gt;
                Cookies
              </li>
              <li>
                <strong className={H3}>Safari:</strong> Preferences &gt; Privacy &gt; Cookies
              </li>
              <li>
                <strong className={H3}>Edge:</strong> Settings &gt; Privacy, Search, and Services
                &gt; Cookies
              </li>
            </ul>
            <p className={P}>Note: Blocking all cookies may affect website functionality.</p>
          </section>

          <section id="third-party" className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}>
            <h2 className={`mb-4 ${H2}`}>5. Third-Party Cookies</h2>
            <p className={`mb-4 ${P}`}>Some cookies are placed by third-party services we use:</p>
            <div className="space-y-3">
              <div className={CARD}>
                <h3 className={H3}>Google Analytics</h3>
                <p className={P}>
                  Website analytics to understand visitor behaviour.{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK}
                  >
                    Google Privacy Policy
                  </a>
                </p>
              </div>
              <div className={CARD}>
                <h3 className={H3}>Facebook Pixel</h3>
                <p className={P}>
                  Advertising and conversion tracking.{' '}
                  <a
                    href="https://www.facebook.com/privacy/explanation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK}
                  >
                    Facebook Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section id="contact" className={`border-t ${HAIR} py-[clamp(2.5rem,6vh,3.5rem)]`}>
            <h2 className={`mb-4 ${H2}`}>6. Contact Us</h2>
            <p className={`mb-4 ${P}`}>
              If you have questions about our use of cookies, please contact us at{' '}
              <a href={`mailto:${BUSINESS_EMAIL}`} className={LINK}>
                {BUSINESS_EMAIL}
              </a>
              .
            </p>
            <p className={P}>
              For more information about how we handle your personal data, please see our{' '}
              <Link href="/privacy-policy" className={LINK}>
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
