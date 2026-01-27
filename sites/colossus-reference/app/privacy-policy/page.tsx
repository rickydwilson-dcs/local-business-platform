import Link from "next/link";
import { absUrl } from "@/lib/site";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PHONE_DISPLAY, BUSINESS_EMAIL, ADDRESS } from "@/lib/contact-info";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Colossus Scaffolding Privacy Policy - how we collect, use, and protect your personal data in compliance with UK GDPR. Learn about your rights and our data practices.",
  openGraph: {
    title: "Privacy Policy",
    description:
      "Comprehensive privacy policy for Colossus Scaffolding explaining our data practices and your rights under UK GDPR.",
    url: absUrl("/privacy-policy"),
    siteName: "Colossus Scaffolding",
    locale: "en_GB",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: absUrl("/privacy-policy"),
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [{ name: "Privacy Policy", href: "/privacy-policy", current: true }];

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
              <h1 className="heading-hero leading-tight mb-6">Privacy Policy</h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <span>Last updated: {lastUpdated}</span>
                <span>•</span>
                <span>Version: {version}</span>
              </div>
              <p className="text-lg text-gray-700 mt-6 max-w-3xl mx-auto">
                This Privacy Policy explains how Colossus Scaffolding collects, uses, and protects
                your personal data in accordance with UK data protection laws.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-12">
              <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
              <nav className="grid md:grid-cols-2 gap-2">
                <a href="#data-controller" className="text-brand-blue hover:underline">
                  1. Data Controller Information
                </a>
                <a href="#data-we-collect" className="text-brand-blue hover:underline">
                  2. Data We Collect
                </a>
                <a href="#how-we-use-data" className="text-brand-blue hover:underline">
                  3. How We Use Your Data
                </a>
                <a href="#legal-basis" className="text-brand-blue hover:underline">
                  4. Legal Basis for Processing
                </a>
                <a href="#data-sharing" className="text-brand-blue hover:underline">
                  5. Data Sharing & Third Parties
                </a>
                <a href="#data-retention" className="text-brand-blue hover:underline">
                  6. Data Retention
                </a>
                <a href="#your-rights" className="text-brand-blue hover:underline">
                  7. Your Rights
                </a>
                <a href="#international-transfers" className="text-brand-blue hover:underline">
                  8. International Transfers
                </a>
                <a href="#security" className="text-brand-blue hover:underline">
                  9. Data Security
                </a>
                <a href="#cookies" className="text-brand-blue hover:underline">
                  10. Cookies
                </a>
                <a href="#contact-complaints" className="text-brand-blue hover:underline">
                  11. Contact & Complaints
                </a>
                <a href="#changes" className="text-brand-blue hover:underline">
                  12. Changes to This Policy
                </a>
              </nav>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Data Controller */}
              <section id="data-controller" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">1. Data Controller Information</h2>
                <p className="mb-6">
                  Colossus Scaffolding is the data controller for your personal information. We are
                  a professional scaffolding company providing commercial, industrial, and
                  residential scaffolding services across the South East UK.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Company Details:</h3>
                  <div className="space-y-1 text-gray-700">
                    <p>
                      <strong>Business Name:</strong> Colossus Scaffolding
                    </p>
                    <p>
                      <strong>Registered Office:</strong> {ADDRESS.street}, {ADDRESS.locality},{" "}
                      {ADDRESS.region}, {ADDRESS.postalCode}
                    </p>
                    <p>
                      <strong>Phone:</strong> {PHONE_DISPLAY}
                    </p>
                    <p>
                      <strong>Email:</strong> {BUSINESS_EMAIL}
                    </p>
                    <p>
                      <strong>Service Area:</strong> East Sussex, West Sussex, Kent, Surrey
                    </p>
                  </div>
                </div>
              </section>

              {/* Data We Collect */}
              <section id="data-we-collect" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">2. Data We Collect</h2>
                <p className="mb-6">
                  As a scaffolding contractor, we collect different types of personal data depending
                  on how you interact with our services:
                </p>

                <div className="space-y-8">
                  {/* Contact Inquiries */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      2.1 Scaffolding Service Inquiries
                    </h3>
                    <p className="mb-4">
                      When you contact us for scaffolding quotes or services, we collect:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Contact Information:</strong> Name, phone number, email address
                      </li>
                      <li>
                        <strong>Project Details:</strong> Property address, project description,
                        scaffolding requirements
                      </li>
                      <li>
                        <strong>Business Information:</strong> Company name (for commercial
                        projects), contractor details
                      </li>
                      <li>
                        <strong>Communication Records:</strong> Phone call records, email
                        correspondence, site visit notes
                      </li>
                      <li>
                        <strong>Quote Information:</strong> Scaffolding specifications, pricing,
                        project timelines
                      </li>
                    </ul>
                  </div>

                  {/* Website Analytics */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">2.2 Website Analytics Data</h3>
                    <p className="mb-4">Through our website and analytics systems, we collect:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Technical Information:</strong> IP address, browser type, device
                        information
                      </li>
                      <li>
                        <strong>Usage Data:</strong> Pages visited, time spent on site, click
                        patterns
                      </li>
                      <li>
                        <strong>Referral Information:</strong> How you found our website (search
                        engines, social media, direct)
                      </li>
                      <li>
                        <strong>Cookie Data:</strong> Analytics cookies, consent preferences (see
                        our{" "}
                        <Link href="/cookie-policy" className="text-brand-blue hover:underline">
                          Cookie Policy
                        </Link>
                        )
                      </li>
                      <li>
                        <strong>Performance Data:</strong> Website loading times, error reports
                      </li>
                    </ul>
                  </div>

                  {/* Marketing Data */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">2.3 Marketing & Communications</h3>
                    <p className="mb-4">For marketing our scaffolding services, we may collect:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Marketing Interactions:</strong> Email opens, link clicks, social
                        media engagement
                      </li>
                      <li>
                        <strong>Advertising Data:</strong> Response to Facebook and Google Ads
                        campaigns
                      </li>
                      <li>
                        <strong>Conversion Tracking:</strong> Actions taken after viewing our
                        advertising
                      </li>
                      <li>
                        <strong>Preference Data:</strong> Communication preferences, service
                        interests
                      </li>
                    </ul>
                  </div>

                  {/* Project Data */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">2.4 Active Project Information</h3>
                    <p className="mb-4">
                      For customers with active scaffolding projects, we process:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Project Management:</strong> Installation schedules, progress
                        reports, completion certificates
                      </li>
                      <li>
                        <strong>Health & Safety:</strong> Risk assessments, safety inspections,
                        compliance records
                      </li>
                      <li>
                        <strong>Financial Information:</strong> Invoices, payment records, purchase
                        order details
                      </li>
                      <li>
                        <strong>Site Information:</strong> Access requirements, site photos,
                        installation drawings
                      </li>
                      <li>
                        <strong>Contractor Details:</strong> Subcontractor information,
                        certification records
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Data */}
              <section id="how-we-use-data" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">3. How We Use Your Data</h2>
                <p className="mb-6">
                  We use your personal data to provide professional scaffolding services and improve
                  our business operations:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Service Delivery</h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Provide scaffolding quotes and estimates</li>
                      <li>Schedule site visits and installations</li>
                      <li>Manage scaffolding projects and timelines</li>
                      <li>Conduct safety inspections and compliance checks</li>
                      <li>Process payments and invoicing</li>
                      <li>Provide customer support and project updates</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Business Operations</h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Improve our scaffolding services and processes</li>
                      <li>Analyze website performance and user experience</li>
                      <li>Develop new scaffolding solutions and services</li>
                      <li>Train our team and improve service quality</li>
                      <li>Ensure health and safety compliance</li>
                      <li>Maintain accurate business records</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Marketing & Communications</h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Send information about our scaffolding services</li>
                      <li>Market relevant scaffolding solutions</li>
                      <li>Measure advertising campaign effectiveness</li>
                      <li>Send newsletters and service updates</li>
                      <li>Respond to inquiries and customer service</li>
                      <li>Follow up on quotes and proposals</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Legal & Compliance</h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Comply with health and safety regulations</li>
                      <li>Meet insurance and certification requirements</li>
                      <li>Fulfill contractual obligations</li>
                      <li>Respond to legal requests or disputes</li>
                      <li>Maintain accurate financial records</li>
                      <li>Ensure GDPR and data protection compliance</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Legal Basis */}
              <section id="legal-basis" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">4. Legal Basis for Processing</h2>
                <p className="mb-6">
                  Under UK GDPR, we must have a valid legal basis for processing your personal data.
                  We rely on the following legal bases:
                </p>

                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Legitimate Interests</h3>
                    <p className="text-blue-800 mb-2">
                      For most business operations, we rely on our legitimate interests as a
                      scaffolding company to provide services and run our business effectively.
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Examples:</strong> Processing inquiries, providing quotes, analyzing
                      website performance, improving services, business communications.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 bg-green-50 p-6">
                    <h3 className="font-semibold text-green-900 mb-2">Contract Performance</h3>
                    <p className="text-green-800 mb-2">
                      When you engage us for scaffolding services, we need to process your data to
                      fulfill our contractual obligations.
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Examples:</strong> Project management, scheduling installations,
                      safety compliance, invoicing, delivery of scaffolding services.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 bg-purple-50 p-6">
                    <h3 className="font-semibold text-purple-900 mb-2">Consent</h3>
                    <p className="text-purple-800 mb-2">
                      For certain activities, we ask for your explicit consent before processing
                      your data.
                    </p>
                    <p className="text-sm text-purple-700">
                      <strong>Examples:</strong> Marketing cookies, targeted advertising,
                      newsletters, optional marketing communications.
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 bg-red-50 p-6">
                    <h3 className="font-semibold text-red-900 mb-2">Legal Obligation</h3>
                    <p className="text-red-800 mb-2">
                      Sometimes we must process data to comply with legal requirements in the
                      construction and scaffolding industry.
                    </p>
                    <p className="text-sm text-red-700">
                      <strong>Examples:</strong> Health and safety compliance, tax obligations,
                      insurance requirements, regulatory reporting.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Sharing */}
              <section id="data-sharing" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">5. Data Sharing & Third Parties</h2>
                <p className="mb-6">
                  We may share your personal data with trusted third parties who help us provide our
                  scaffolding services:
                </p>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Service Providers</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Analytics Services:</strong> Google Analytics for website
                        performance analysis
                      </li>
                      <li>
                        <strong>Marketing Platforms:</strong> Facebook/Meta for advertising, Google
                        Ads for marketing campaigns
                      </li>
                      <li>
                        <strong>Email Services:</strong> Email providers for business communications
                        and newsletters
                      </li>
                      <li>
                        <strong>Cloud Storage:</strong> Secure cloud services for data backup and
                        storage
                      </li>
                      <li>
                        <strong>Payment Processors:</strong> For handling invoices and payment
                        processing
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Scaffolding Industry Partners</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Subcontractors:</strong> Qualified scaffolding professionals who
                        assist with projects
                      </li>
                      <li>
                        <strong>Suppliers:</strong> Equipment and material suppliers for scaffolding
                        projects
                      </li>
                      <li>
                        <strong>Insurance Providers:</strong> For liability coverage and claims
                        processing
                      </li>
                      <li>
                        <strong>Certification Bodies:</strong> For health and safety compliance and
                        inspections
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Legal & Regulatory</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Legal Authorities:</strong> When required by law or court order
                      </li>
                      <li>
                        <strong>Health & Safety Executive (HSE):</strong> For compliance reporting
                        if required
                      </li>
                      <li>
                        <strong>Professional Bodies:</strong> Industry associations and
                        certification organizations
                      </li>
                      <li>
                        <strong>Accountants & Advisors:</strong> Professional services for business
                        operations
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Data Protection:</strong> All third parties are contractually required
                    to protect your data and use it only for the specific purposes we&apos;ve
                    authorized. We never sell your personal data to third parties.
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section id="data-retention" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">6. Data Retention</h2>
                <p className="mb-6">
                  We keep your personal data only as long as necessary for the purposes outlined in
                  this policy and to meet our legal obligations:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border-b border-gray-300 px-4 py-3 text-left">Data Type</th>
                        <th className="border-b border-gray-300 px-4 py-3 text-left">
                          Retention Period
                        </th>
                        <th className="border-b border-gray-300 px-4 py-3 text-left">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Quote requests & inquiries
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          2 years from last contact
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Business development, follow-up opportunities
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Active project records
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          7 years after project completion
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Legal obligations, insurance requirements
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Financial records & invoices
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">7 years</td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          UK tax and accounting requirements
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Health & safety records
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          40 years (HSE requirement)
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Construction industry legal obligations
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Website analytics data
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">26 months</td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Google Analytics standard retention
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Marketing communications
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Until withdrawn consent
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Consent-based processing
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Cookie consent preferences
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">1 year</td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          PECR compliance requirements
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Some records may be retained longer if required for legal
                    proceedings or regulatory investigations. We review retention periods regularly
                    and securely delete data when no longer needed.
                  </p>
                </div>
              </section>

              {/* Your Rights */}
              <section id="your-rights" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">7. Your Rights</h2>
                <p className="mb-6">
                  Under UK GDPR, you have the following rights regarding your personal data:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">Right of Access</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Request copies of your personal data we hold and information about how we
                      process it.
                    </p>
                    <p className="text-xs text-gray-600">
                      We&apos;ll provide this information free of charge within one month.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">Right of Rectification</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Request correction of incomplete or inaccurate personal data.
                    </p>
                    <p className="text-xs text-gray-600">
                      We&apos;ll update your information and notify relevant third parties.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">Right of Erasure</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Request deletion of your personal data in certain circumstances.
                    </p>
                    <p className="text-xs text-gray-600">
                      Subject to our legal obligations and legitimate interests.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">Right to Restrict Processing</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Request that we limit how we use your personal data.
                    </p>
                    <p className="text-xs text-gray-600">
                      Available in specific circumstances outlined by UK GDPR.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">Right of Data Portability</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Receive your personal data in a machine-readable format.
                    </p>
                    <p className="text-xs text-gray-600">
                      Applies to data processed automatically based on consent or contract.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">Right to Object</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Object to processing based on legitimate interests or for marketing purposes.
                    </p>
                    <p className="text-xs text-gray-600">
                      We&apos;ll stop processing unless we have compelling legitimate grounds.
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-4">How to Exercise Your Rights</h3>
                  <p className="text-green-800 mb-4">
                    To exercise any of these rights, please contact us using the details in Section
                    11. We may need to verify your identity before processing your request.
                  </p>
                  <div className="text-sm text-green-700">
                    <p>
                      <strong>Response Time:</strong> We&apos;ll respond within one month (or two
                      months for complex requests)
                    </p>
                    <p>
                      <strong>Cost:</strong> Exercising your rights is generally free, unless
                      requests are excessive or repetitive
                    </p>
                    <p>
                      <strong>Verification:</strong> We may request proof of identity to protect
                      your personal data
                    </p>
                  </div>
                </div>
              </section>

              {/* International Transfers */}
              <section id="international-transfers" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">8. International Transfers</h2>
                <p className="mb-6">
                  Some of our service providers are located outside the UK. When we transfer your
                  data internationally, we ensure appropriate safeguards are in place:
                </p>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Google Services (Analytics & Ads)
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Google processes data in various countries including the United States.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                      <li>Google is certified under the EU-US Data Privacy Framework</li>
                      <li>Standard Contractual Clauses provide additional protection</li>
                      <li>Google implements technical and organizational security measures</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Facebook/Meta Services</h3>
                    <p className="text-gray-700 mb-2">
                      Facebook may process data in the United States and other countries.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                      <li>Meta is certified under the EU-US Data Privacy Framework</li>
                      <li>Standard Contractual Clauses apply to data transfers</li>
                      <li>Additional security measures protect data in transit and storage</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Your Protection:</strong> We only work with providers who can
                    demonstrate appropriate data protection standards equivalent to UK GDPR
                    requirements.
                  </p>
                </div>
              </section>

              {/* Security */}
              <section id="security" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">9. Data Security</h2>
                <p className="mb-6">
                  We implement appropriate technical and organizational measures to protect your
                  personal data against unauthorized access, alteration, disclosure, or destruction:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Technical Measures</h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Encryption of data in transit and at rest</li>
                      <li>Secure server infrastructure and hosting</li>
                      <li>Regular security updates and patches</li>
                      <li>Access controls and authentication systems</li>
                      <li>Secure backup and recovery procedures</li>
                      <li>Network security and firewall protection</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Organizational Measures</h3>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Staff training on data protection principles</li>
                      <li>Access controls limiting data access to authorized personnel</li>
                      <li>Regular security assessments and reviews</li>
                      <li>Data processing agreements with third parties</li>
                      <li>Incident response and breach notification procedures</li>
                      <li>Regular policy updates and compliance monitoring</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Data Breach:</strong> In the unlikely event of a data breach that poses
                    a risk to your rights, we will notify you and the ICO within 72 hours as
                    required by UK GDPR.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section id="cookies" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">10. Cookies</h2>
                <p className="mb-4">
                  Our website uses cookies to improve your experience and provide analytics data.
                  For detailed information about our use of cookies, including:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Types of cookies we use</li>
                  <li>Purpose and duration of each cookie</li>
                  <li>How to manage your cookie preferences</li>
                  <li>Third-party cookies and their privacy policies</li>
                </ul>
                <p>
                  Please see our comprehensive{" "}
                  <Link href="/cookie-policy" className="text-brand-blue hover:underline">
                    Cookie Policy
                  </Link>
                  .
                </p>
              </section>

              {/* Contact & Complaints */}
              <section id="contact-complaints" className="mb-12">
                <h2 className="text-3xl font-semibold mb-6">11. Contact & Complaints</h2>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <p className="mb-4">
                      For any questions about this Privacy Policy or to exercise your rights:
                    </p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Colossus Scaffolding</strong>
                      </p>
                      <p>{ADDRESS.street}</p>
                      <p>{ADDRESS.locality}</p>
                      <p>
                        {ADDRESS.region} {ADDRESS.postalCode}
                      </p>
                      <p>
                        <strong>Phone:</strong> {PHONE_DISPLAY}
                      </p>
                      <p>
                        <strong>Email:</strong> {BUSINESS_EMAIL}
                      </p>
                      <p>
                        <strong>Privacy Enquiries:</strong>{" "}
                        <Link href="/contact" className="text-brand-blue hover:underline">
                          Contact Form
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Make a Complaint</h3>
                    <p className="mb-4">
                      If you&apos;re not satisfied with how we handle your personal data, you can
                      complain to:
                    </p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Information Commissioner&apos;s Office (ICO)</strong>
                      </p>
                      <p>Wycliffe House, Water Lane</p>
                      <p>Wilmslow, Cheshire SK9 5AF</p>
                      <p>
                        <strong>Phone:</strong> 0303 123 1113
                      </p>
                      <p>
                        <strong>Website:</strong>{" "}
                        <a
                          href="https://ico.org.uk"
                          className="text-brand-blue hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ico.org.uk
                        </a>
                      </p>
                      <p>
                        <strong>Online:</strong>{" "}
                        <a
                          href="https://ico.org.uk/make-a-complaint/"
                          className="text-brand-blue hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Make a complaint
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Response Times:</strong> We aim to respond to all privacy-related
                    inquiries within 5 working days, and formal data subject requests within one
                    month as required by UK GDPR.
                  </p>
                </div>
              </section>

              {/* Changes */}
              <section id="changes" className="mb-12 border-t pt-8">
                <h2 className="text-3xl font-semibold mb-6">12. Changes to This Policy</h2>
                <p className="mb-4">
                  We review this Privacy Policy regularly and may update it to reflect changes in
                  our practices or legal requirements. Significant changes will be communicated by:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    Posting the updated policy on our website with a new &quot;Last Updated&quot;
                    date
                  </li>
                  <li>Notifying customers via email if we have your contact details</li>
                  <li>Displaying a notice on our website for significant changes</li>
                </ul>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Current Version Information:</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p>
                        <strong>Last Updated:</strong> {lastUpdated}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Version:</strong> {version}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Next Review:</strong> September 2026
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Stay Informed:</strong> We recommend checking this Privacy Policy
                    periodically to stay informed about how we protect your personal information.
                    Continued use of our services after updates indicates your acceptance of any
                    changes.
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
