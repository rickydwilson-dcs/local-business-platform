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
import { Breadcrumbs } from '@platform/core-components';

export const metadata: Metadata = {
  title: `Cookie Policy | ${siteConfig.business.name}`,
  description: `Cookie policy for ${siteConfig.business.name}. Learn about the cookies we use and how to manage your preferences.`,
  alternates: {
    canonical: absUrl('/cookie-policy'),
  },
};

export default function CookiePolicyPage() {
  const breadcrumbItems = [{ name: 'Cookie Policy', href: '/cookie-policy', current: true }];
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

      <main className="min-h-screen bg-surface-background">
        <article className="section-standard">
          <div className="container-standard max-w-4xl">
            <h1 className="heading-hero mb-4">Cookie Policy</h1>
            <p className="text-surface-muted-foreground mb-8">Last updated: {lastUpdated}</p>

            {/* Table of Contents */}
            <div className="bg-surface-subtle rounded-lg p-6 mb-12">
              <h2 className="text-lg font-semibold mb-4">Contents</h2>
              <ol className="list-decimal list-inside space-y-2 text-brand-primary">
                <li>
                  <a href="#what-are-cookies" className="hover:underline">
                    What Are Cookies?
                  </a>
                </li>
                <li>
                  <a href="#how-we-use" className="hover:underline">
                    How We Use Cookies
                  </a>
                </li>
                <li>
                  <a href="#cookie-categories" className="hover:underline">
                    Cookie Categories
                  </a>
                </li>
                <li>
                  <a href="#managing-cookies" className="hover:underline">
                    Managing Your Cookies
                  </a>
                </li>
                <li>
                  <a href="#third-party" className="hover:underline">
                    Third-Party Cookies
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:underline">
                    Contact Us
                  </a>
                </li>
              </ol>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* What Are Cookies */}
              <section id="what-are-cookies" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  1. What Are Cookies?
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  Cookies are small text files that are stored on your device when you visit a
                  website. They help websites remember your preferences and improve your browsing
                  experience.
                </p>
                <p className="text-surface-muted-foreground">
                  Cookies can be &quot;session&quot; cookies (deleted when you close your browser)
                  or &quot;persistent&quot; cookies (remain until they expire or you delete them).
                </p>
              </section>

              {/* How We Use Cookies */}
              <section id="how-we-use" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  2. How We Use Cookies
                </h2>
                <p className="text-surface-muted-foreground mb-4">We use cookies to:</p>
                <ul className="list-disc list-inside space-y-2 text-surface-muted-foreground">
                  <li>Remember your cookie consent preferences</li>
                  <li>Understand how you use our website</li>
                  <li>Improve our website performance</li>
                  <li>Provide relevant content and advertisements</li>
                  <li>Ensure website security</li>
                </ul>
              </section>

              {/* Cookie Categories */}
              <section id="cookie-categories" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  3. Cookie Categories
                </h2>

                {/* Necessary Cookies */}
                <div className="mb-8">
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500 mb-4">
                    <h3 className="font-semibold text-green-800">Necessary Cookies</h3>
                    <p className="text-green-700 text-sm">
                      Required for the website to function. Cannot be disabled.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-surface-subtle">
                          <th className="border border-surface-border p-2 text-left">Cookie</th>
                          <th className="border border-surface-border p-2 text-left">Purpose</th>
                          <th className="border border-surface-border p-2 text-left">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-surface-border p-2 font-mono text-xs">
                            cookie_consent
                          </td>
                          <td className="border border-surface-border p-2">
                            Stores your cookie preferences
                          </td>
                          <td className="border border-surface-border p-2">1 year</td>
                        </tr>
                        <tr>
                          <td className="border border-surface-border p-2 font-mono text-xs">
                            csrf_token
                          </td>
                          <td className="border border-surface-border p-2">
                            Security token for form submissions
                          </td>
                          <td className="border border-surface-border p-2">Session</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="mb-8">
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500 mb-4">
                    <h3 className="font-semibold text-blue-800">Analytics Cookies</h3>
                    <p className="text-blue-700 text-sm">
                      Help us understand how visitors use our website.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-surface-subtle">
                          <th className="border border-surface-border p-2 text-left">Cookie</th>
                          <th className="border border-surface-border p-2 text-left">Purpose</th>
                          <th className="border border-surface-border p-2 text-left">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-surface-border p-2 font-mono text-xs">
                            _ga
                          </td>
                          <td className="border border-surface-border p-2">
                            Google Analytics - distinguishes users
                          </td>
                          <td className="border border-surface-border p-2">2 years</td>
                        </tr>
                        <tr>
                          <td className="border border-surface-border p-2 font-mono text-xs">
                            _ga_*
                          </td>
                          <td className="border border-surface-border p-2">
                            Google Analytics - stores session state
                          </td>
                          <td className="border border-surface-border p-2">2 years</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="mb-8">
                  <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500 mb-4">
                    <h3 className="font-semibold text-purple-800">Marketing Cookies</h3>
                    <p className="text-purple-700 text-sm">
                      Used to deliver relevant advertisements and track campaign effectiveness.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-surface-subtle">
                          <th className="border border-surface-border p-2 text-left">Cookie</th>
                          <th className="border border-surface-border p-2 text-left">Purpose</th>
                          <th className="border border-surface-border p-2 text-left">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-surface-border p-2 font-mono text-xs">
                            _fbp
                          </td>
                          <td className="border border-surface-border p-2">
                            Facebook Pixel - tracks conversions
                          </td>
                          <td className="border border-surface-border p-2">90 days</td>
                        </tr>
                        <tr>
                          <td className="border border-surface-border p-2 font-mono text-xs">
                            gclid
                          </td>
                          <td className="border border-surface-border p-2">
                            Google Ads - tracks ad clicks
                          </td>
                          <td className="border border-surface-border p-2">90 days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Managing Cookies */}
              <section id="managing-cookies" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  4. Managing Your Cookies
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  You can control cookies through several methods:
                </p>

                <h3 className="text-lg font-semibold text-surface-foreground mt-6 mb-3">
                  Consent Banner
                </h3>
                <p className="text-surface-muted-foreground mb-4">
                  When you first visit our site, you can choose which cookie categories to accept
                  using our consent banner.
                </p>

                <h3 className="text-lg font-semibold text-surface-foreground mt-6 mb-3">
                  Browser Settings
                </h3>
                <p className="text-surface-muted-foreground mb-4">
                  Most browsers allow you to manage cookies through their settings:
                </p>
                <ul className="list-disc list-inside space-y-2 text-surface-muted-foreground mb-4">
                  <li>
                    <strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies
                  </li>
                  <li>
                    <strong>Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies
                  </li>
                  <li>
                    <strong>Edge:</strong> Settings &gt; Privacy, Search, and Services &gt; Cookies
                  </li>
                </ul>
                <p className="text-surface-muted-foreground">
                  Note: Blocking all cookies may affect website functionality.
                </p>
              </section>

              {/* Third-Party Cookies */}
              <section id="third-party" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">
                  5. Third-Party Cookies
                </h2>
                <p className="text-surface-muted-foreground mb-4">
                  Some cookies are placed by third-party services we use:
                </p>
                <div className="space-y-4">
                  <div className="bg-surface-subtle rounded-lg p-4">
                    <h3 className="font-semibold text-surface-foreground">Google Analytics</h3>
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
                  <div className="bg-surface-subtle rounded-lg p-4">
                    <h3 className="font-semibold text-surface-foreground">Facebook Pixel</h3>
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
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-bold text-surface-foreground mb-4">6. Contact Us</h2>
                <p className="text-surface-muted-foreground mb-4">
                  If you have questions about our use of cookies, please contact us at{' '}
                  <a
                    href={`mailto:${BUSINESS_EMAIL}`}
                    className="text-brand-primary hover:underline"
                  >
                    {BUSINESS_EMAIL}
                  </a>
                  .
                </p>
                <p className="text-surface-muted-foreground">
                  For more information about how we handle your personal data, please see our{' '}
                  <Link href="/privacy-policy" className="text-brand-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </section>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
