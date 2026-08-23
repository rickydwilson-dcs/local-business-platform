/**
 * Cookie Policy Page
 *
 * Cookie compliance and transparency page.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { BUSINESS_EMAIL } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { LegalHero } from '@/components/legal/legal-hero';
import { LegalToc, type LegalTocItem } from '@/components/legal/legal-toc';

export const metadata: Metadata = {
  title: `Cookie Policy | ${siteConfig.business.name}`,
  description: `Cookie policy for ${siteConfig.business.name}. Learn about the cookies we use and how to manage your preferences.`,
  alternates: {
    canonical: absUrl('/cookie-policy'),
  },
};

const TOC_ITEMS: LegalTocItem[] = [
  { id: 'what-are-cookies', label: 'What Are Cookies?' },
  { id: 'how-we-use', label: 'How We Use Cookies' },
  { id: 'cookie-categories', label: 'Cookie Categories' },
  { id: 'managing-cookies', label: 'Managing Your Cookies' },
  { id: 'third-party', label: 'Third-Party Cookies' },
  { id: 'contact', label: 'Contact Us' },
];

interface CookieRow {
  name: string;
  purpose: string;
  duration: string;
}

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-surface-border">
            <th className="py-3 pr-4 text-left font-semibold text-surface-foreground">Cookie</th>
            <th className="py-3 pr-4 text-left font-semibold text-surface-foreground">Purpose</th>
            <th className="py-3 text-left font-semibold text-surface-foreground">Duration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="py-3 pr-4 font-mono text-xs text-surface-foreground">{row.name}</td>
              <td className="py-3 pr-4 text-surface-muted-foreground">{row.purpose}</td>
              <td className="py-3 text-surface-muted-foreground">{row.duration}</td>
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
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="font-body">
      <LegalHero title="Cookie Policy" current="Cookie Policy" lastUpdated={lastUpdated} />

      <div className="bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
            <aside className="hidden lg:block">
              <LegalToc items={TOC_ITEMS} />
            </aside>

            <article className="max-w-[680px]">
              {/* What Are Cookies */}
              <section id="what-are-cookies" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  1. What Are Cookies?
                </h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-4">
                  Cookies are small text files that are stored on your device when you visit a
                  website. They help websites remember your preferences and improve your browsing
                  experience.
                </p>
                <p className="text-surface-muted-foreground leading-relaxed">
                  Cookies can be &quot;session&quot; cookies (deleted when you close your browser)
                  or &quot;persistent&quot; cookies (remain until they expire or you delete them).
                </p>
              </section>

              {/* How We Use Cookies */}
              <section id="how-we-use" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  2. How We Use Cookies
                </h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-4">
                  We use cookies to:
                </p>
                <ul className="list-disc list-outside pl-5 space-y-2 text-surface-muted-foreground leading-relaxed">
                  <li>Remember your cookie consent preferences</li>
                  <li>Understand how you use our website</li>
                  <li>Improve our website performance</li>
                  <li>Provide relevant content and advertisements</li>
                  <li>Ensure website security</li>
                </ul>
              </section>

              {/* Cookie Categories */}
              <section id="cookie-categories" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-6">
                  3. Cookie Categories
                </h2>

                <div className="space-y-10">
                  <div>
                    <h3 className="font-semibold text-surface-foreground mb-1">
                      Necessary Cookies
                    </h3>
                    <p className="text-surface-muted-foreground text-sm mb-4">
                      Required for the website to function. Cannot be disabled.
                    </p>
                    <CookieTable rows={NECESSARY_COOKIES} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-surface-foreground mb-1">
                      Analytics Cookies
                    </h3>
                    <p className="text-surface-muted-foreground text-sm mb-4">
                      Help us understand how visitors use our website.
                    </p>
                    <CookieTable rows={ANALYTICS_COOKIES} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-surface-foreground mb-1">
                      Marketing Cookies
                    </h3>
                    <p className="text-surface-muted-foreground text-sm mb-4">
                      Used to deliver relevant advertisements and track campaign effectiveness.
                    </p>
                    <CookieTable rows={MARKETING_COOKIES} />
                  </div>
                </div>
              </section>

              {/* Managing Cookies */}
              <section id="managing-cookies" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  4. Managing Your Cookies
                </h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-6">
                  You can control cookies through several methods:
                </p>

                <h3 className="font-semibold text-surface-foreground mb-2">Consent Banner</h3>
                <p className="text-surface-muted-foreground leading-relaxed mb-6">
                  When you first visit our site, you can choose which cookie categories to accept
                  using our consent banner.
                </p>

                <h3 className="font-semibold text-surface-foreground mb-2">Browser Settings</h3>
                <p className="text-surface-muted-foreground leading-relaxed mb-3">
                  Most browsers allow you to manage cookies through their settings:
                </p>
                <ul className="space-y-1.5 text-surface-muted-foreground text-sm mb-4">
                  {BROWSER_SETTINGS.map((row) => (
                    <li key={row.browser}>
                      <strong className="text-surface-foreground">{row.browser}:</strong> {row.path}
                    </li>
                  ))}
                </ul>
                <p className="text-surface-muted-foreground text-sm">
                  Note: Blocking all cookies may affect website functionality.
                </p>
              </section>

              {/* Third-Party Cookies */}
              <section id="third-party" className="scroll-mt-24 mb-14">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  5. Third-Party Cookies
                </h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-6">
                  Some cookies are placed by third-party services we use:
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-surface-card border border-surface-border rounded-[20px] p-5">
                    <h3 className="font-semibold text-surface-foreground mb-1">Google Analytics</h3>
                    <p className="text-sm text-surface-muted-foreground">
                      Website analytics to understand visitor behaviour.{' '}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:underline"
                      >
                        Google Privacy Policy
                      </a>
                    </p>
                  </div>
                  <div className="bg-surface-card border border-surface-border rounded-[20px] p-5">
                    <h3 className="font-semibold text-surface-foreground mb-1">Facebook Pixel</h3>
                    <p className="text-sm text-surface-muted-foreground">
                      Advertising and conversion tracking.{' '}
                      <a
                        href="https://www.facebook.com/privacy/explanation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:underline"
                      >
                        Facebook Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section id="contact" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">6. Contact Us</h2>
                <p className="text-surface-muted-foreground leading-relaxed mb-4">
                  If you have questions about our use of cookies, please contact us at{' '}
                  <a
                    href={`mailto:${BUSINESS_EMAIL}`}
                    className="text-brand-primary hover:underline"
                  >
                    {BUSINESS_EMAIL}
                  </a>
                  .
                </p>
                <p className="text-surface-muted-foreground leading-relaxed">
                  For more information about how we handle your personal data, please see our{' '}
                  <Link href="/privacy-policy" className="text-brand-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </section>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
