import Link from "next/link";
import { absUrl } from "@/lib/site";
import { Metadata } from "next";
import { Breadcrumbs } from "@platform/core-components";
import { PHONE_DISPLAY, BUSINESS_EMAIL, ADDRESS } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn about how Colossus Scaffolding uses cookies on our website. Comprehensive cookie policy covering analytics, marketing, and functional cookies with clear management instructions.",
  openGraph: {
    title: "Cookie Policy",
    description:
      "Comprehensive cookie policy for Colossus Scaffolding website. Learn about our use of analytics, marketing, and functional cookies.",
    url: absUrl("/cookie-policy"),
    siteName: "Colossus Scaffolding",
    locale: "en_GB",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: absUrl("/cookie-policy"),
  },
};

export default function CookiePolicyPage() {
  const breadcrumbItems = [{ name: "Cookie Policy", href: "/cookie-policy", current: true }];

  const lastUpdated = "27 September 2025";
  const version = "1.0";

  return (
    <div className="relative">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="section-standard bg-white">
        <div className="container-standard">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="heading-hero leading-tight mb-6">Cookie Policy</h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <span>Last updated: {lastUpdated}</span>
                <span>•</span>
                <span>Version: {version}</span>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-12">
              <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
              <nav className="grid md:grid-cols-2 gap-2">
                <a href="#what-are-cookies" className="text-brand-blue hover:underline">
                  1. What are Cookies?
                </a>
                <a href="#how-we-use-cookies" className="text-brand-blue hover:underline">
                  2. How We Use Cookies
                </a>
                <a href="#cookie-categories" className="text-brand-blue hover:underline">
                  3. Cookie Categories
                </a>
                <a href="#managing-cookies" className="text-brand-blue hover:underline">
                  4. Managing Your Cookies
                </a>
                <a href="#third-party-cookies" className="text-brand-blue hover:underline">
                  5. Third-Party Cookies
                </a>
                <a href="#contact-us" className="text-brand-blue hover:underline">
                  6. Contact Us
                </a>
              </nav>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section className="mb-12">
                <p className="text-xl text-gray-700 leading-relaxed">
                  This Cookie Policy explains how Colossus Scaffolding (&quot;we&quot;,
                  &quot;us&quot;, or &quot;our&quot;) uses cookies and similar tracking technologies
                  on our website. We are committed to transparency about how we collect and use your
                  information.
                </p>
              </section>

              {/* What are Cookies */}
              <section id="what-are-cookies" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">1. What are Cookies?</h2>
                <p className="mb-4">
                  Cookies are small text files that are placed on your device (computer, smartphone,
                  or tablet) when you visit our website. They help us provide you with a better
                  experience by:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Remembering your preferences and settings</li>
                  <li>Understanding how you use our website</li>
                  <li>Improving our services and website performance</li>
                  <li>Providing relevant marketing content</li>
                </ul>
                <p>
                  Cookies contain information that is transferred to your device&apos;s hard drive
                  and stored there. Most web browsers automatically accept cookies, but you can
                  modify your browser settings to decline cookies if you prefer.
                </p>
              </section>

              {/* How We Use Cookies */}
              <section id="how-we-use-cookies" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">2. How We Use Cookies</h2>
                <p className="mb-4">
                  As a professional scaffolding company serving the South East UK, we use cookies
                  to:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Provide our scaffolding services website functionality</li>
                  <li>Analyze website usage to improve our service offerings</li>
                  <li>Remember your consent preferences</li>
                  <li>Track inquiries about our scaffolding services</li>
                  <li>Deliver relevant marketing about professional scaffolding solutions</li>
                  <li>Measure the effectiveness of our marketing campaigns</li>
                </ul>
                <p>
                  We only collect and process your data in accordance with UK data protection laws
                  (UK GDPR and Data Protection Act 2018) and the Privacy and Electronic
                  Communications Regulations (PECR).
                </p>
              </section>

              {/* Cookie Categories */}
              <section id="cookie-categories" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">3. Cookie Categories</h2>

                {/* Necessary Cookies */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    3.1 Necessary Cookies
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                    <p className="font-semibold text-blue-900">Legal Basis: Legitimate Interests</p>
                    <p className="text-blue-800">
                      These cookies are essential for basic website functionality and do not require
                      consent.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">
                            Cookie Name
                          </th>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">Purpose</th>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-b border-gray-200 px-4 py-3 font-mono text-sm">
                            analytics_consent
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">
                            Stores your cookie consent preferences
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">1 year</td>
                        </tr>
                        <tr>
                          <td className="border-b border-gray-200 px-4 py-3 font-mono text-sm">
                            _ga_client_id
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">
                            Session management for analytics tracking
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">2 years</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    3.2 Analytics Cookies
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                    <p className="font-semibold text-green-900">Legal Basis: Consent</p>
                    <p className="text-green-800">
                      These cookies help us understand how visitors interact with our scaffolding
                      website.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">
                            Cookie Name
                          </th>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">Purpose</th>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-b border-gray-200 px-4 py-3 font-mono text-sm">
                            _ga
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">
                            Google Analytics - distinguishes unique visitors
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">2 years</td>
                        </tr>
                        <tr>
                          <td className="border-b border-gray-200 px-4 py-3 font-mono text-sm">
                            _ga_*
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">
                            Google Analytics GA4 - session and campaign tracking
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">2 years</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    We use Google Analytics 4 via the Measurement Protocol for server-side tracking
                    to measure website performance and understand how visitors find information
                    about our scaffolding services.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    3.3 Marketing Cookies
                  </h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
                    <p className="font-semibold text-purple-900">Legal Basis: Consent</p>
                    <p className="text-purple-800">
                      These cookies track scaffolding service inquiries and enable targeted
                      marketing.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">
                            Cookie Name
                          </th>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">Purpose</th>
                          <th className="border-b border-gray-300 px-4 py-3 text-left">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-b border-gray-200 px-4 py-3 font-mono text-sm">
                            _fbp
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">
                            Facebook Pixel - browser identification
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">3 months</td>
                        </tr>
                        <tr>
                          <td className="border-b border-gray-200 px-4 py-3 font-mono text-sm">
                            _fbc
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">
                            Facebook Pixel - click tracking
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">3 months</td>
                        </tr>
                        <tr>
                          <td className="border-b border-gray-200 px-4 py-3 font-mono text-sm">
                            gclid
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">
                            Google Ads - conversion tracking for scaffolding inquiries
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3">90 days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    We use Facebook Conversions API and Google Ads conversion tracking to measure
                    the effectiveness of our scaffolding service advertising and improve our
                    marketing to potential clients.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    3.4 Functional Cookies
                  </h3>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-4">
                    <p className="font-semibold text-orange-900">
                      Legal Basis: Legitimate Interests
                    </p>
                    <p className="text-orange-800">
                      These cookies enhance your experience on our scaffolding website.
                    </p>
                  </div>
                  <p>
                    We currently do not use functional cookies beyond those necessary for basic
                    website operation. Any future functional cookies will enhance your experience
                    when browsing our scaffolding services and will be clearly documented here.
                  </p>
                </div>
              </section>

              {/* Managing Cookies */}
              <section id="managing-cookies" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">4. Managing Your Cookies</h2>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">4.1 Cookie Consent Management</h3>
                  <p className="mb-4">
                    When you first visit our website, you&apos;ll see a consent banner allowing you
                    to choose which types of cookies you accept. You can:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Accept all cookies for the best experience</li>
                    <li>Reject optional cookies (analytics and marketing)</li>
                    <li>Customize your preferences by cookie category</li>
                    <li>Change your preferences at any time</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">4.2 Browser Cookie Settings</h3>
                  <p className="mb-4">
                    You can control cookies through your web browser settings. However, disabling
                    cookies may affect website functionality:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>
                      <strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and
                      other site data
                    </li>
                    <li>
                      <strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Cookies and
                      Site Data
                    </li>
                    <li>
                      <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
                    </li>
                    <li>
                      <strong>Microsoft Edge:</strong> Settings → Site permissions → Cookies and
                      site data
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">4.3 Deleting Cookies</h3>
                  <p className="mb-4">
                    You can delete existing cookies at any time through your browser settings. Note
                    that deleting cookies will:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Reset your consent preferences</li>
                    <li>Require you to re-enter any saved preferences</li>
                    <li>Show the consent banner again on your next visit</li>
                  </ul>
                </div>
              </section>

              {/* Third-Party Cookies */}
              <section id="third-party-cookies" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">5. Third-Party Cookies</h2>
                <p className="mb-6">
                  Our website uses services from third-party companies that may place their own
                  cookies on your device. These include:
                </p>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-2">Google Analytics</h4>
                    <p className="text-gray-700 mb-2">
                      Helps us understand how visitors use our scaffolding website to improve our
                      services.
                    </p>
                    <p className="text-sm text-gray-600">
                      Privacy Policy:{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        className="text-brand-blue hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://policies.google.com/privacy
                      </a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-2">Facebook/Meta Pixel</h4>
                    <p className="text-gray-700 mb-2">
                      Enables us to measure the effectiveness of our scaffolding service advertising
                      on Facebook and Instagram.
                    </p>
                    <p className="text-sm text-gray-600">
                      Privacy Policy:{" "}
                      <a
                        href="https://www.facebook.com/privacy/policy/"
                        className="text-brand-blue hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://www.facebook.com/privacy/policy/
                      </a>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-2">Google Ads</h4>
                    <p className="text-gray-700 mb-2">
                      Tracks conversions from our scaffolding service advertisements to measure
                      campaign effectiveness.
                    </p>
                    <p className="text-sm text-gray-600">
                      Privacy Policy:{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        className="text-brand-blue hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://policies.google.com/privacy
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section id="contact-us" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">6. Contact Us</h2>
                <p className="mb-6">
                  If you have questions about our use of cookies or this Cookie Policy, please
                  contact us:
                </p>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Data Controller</h4>
                      <div className="text-gray-700 space-y-1">
                        <p>Colossus Scaffolding</p>
                        <p>{ADDRESS.street}</p>
                        <p>{ADDRESS.locality}</p>
                        <p>
                          {ADDRESS.region} {ADDRESS.postalCode}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Contact Details</h4>
                      <div className="text-gray-700 space-y-1">
                        <p>Phone: {PHONE_DISPLAY}</p>
                        <p>Email: {BUSINESS_EMAIL}</p>
                        <p>
                          Privacy enquiries:{" "}
                          <Link href="/contact" className="text-brand-blue hover:underline">
                            Contact Form
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Your Rights:</strong> You have rights under UK data protection law
                    regarding your personal data. Please see our{" "}
                    <Link href="/privacy-policy" className="text-brand-blue hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    for full details of your rights and how to exercise them.
                  </p>
                </div>
              </section>

              {/* Updates */}
              <section className="mb-12 border-t pt-8">
                <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
                <p className="mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our
                  practices or for legal, regulatory, or operational reasons. We will notify you of
                  any material changes by posting the new policy on this page with an updated
                  &quot;Last Modified&quot; date.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Last updated:</strong> {lastUpdated}
                    <br />
                    <strong>Version:</strong> {version}
                    <br />
                    <strong>Next review:</strong> September 2026
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
