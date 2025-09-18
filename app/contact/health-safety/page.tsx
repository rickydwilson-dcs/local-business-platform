import { Metadata } from "next";
import Schema from "@/components/Schema";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Health & Safety | Colossus Scaffolding",
  description:
    "Our health & safety approach: TG20:21 compliance, qualified scaffolders, and routine inspections across the South East UK.",
};

export default function HealthSafetyPage() {
  const breadcrumbItems = [
    { name: "Contact", href: "/contact" },
    { name: "Health & Safety", href: "/contact/health-safety", current: true },
  ];

  const service = {
    id: "/health-safety#service",
    url: "/health-safety",
    name: "Health & Safety",
    description:
      "Health & safety practices for scaffolding projects — TG20:21 compliant with routine inspections.",
    serviceType: "Health & Safety",
    areaServed: ["South East UK"],
  };

  const org = { name: "Colossus Scaffolding", url: "/", logo: "/static/logo.png" };

  const faqs = [
    {
      question: "How often are scaffolds inspected?",
      answer: "Every 7 days and after adverse weather or alterations.",
    },
    {
      question: "Do you provide handover certificates?",
      answer: "Yes, on every scaffold erected.",
    },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Health & Safety</h1>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-gray-600">
              We take health & safety seriously. Our scaffolds are designed, erected and inspected
              to <strong>TG20:21</strong> standards by qualified teams.
            </p>

            <hr className="my-8" />

            <h2>What You Can Expect</h2>
            <ul>
              <li>
                Regular inspections (at least every 7 days and after adverse weather or
                alterations).
              </li>
              <li>Handover certificates on completion.</li>
              <li>£10m public liability insurance.</li>
              <li>CHAS & Constructionline accreditation.</li>
            </ul>

            <hr className="my-8" />
          </div>

          {/* Health & Safety Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Our Safety Commitment</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Certifications & Compliance</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-brand-blue mr-3">✓</span>
                    <span>TG20:21 Compliant Designs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-blue mr-3">✓</span>
                    <span>CISRS Qualified Teams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-blue mr-3">✓</span>
                    <span>CHAS Accredited</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-blue mr-3">✓</span>
                    <span>Constructionline Gold</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Inspection & Documentation</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-brand-blue mr-3">✓</span>
                    <span>Weekly Safety Inspections</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-blue mr-3">✓</span>
                    <span>Handover Certificates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-blue mr-3">✓</span>
                    <span>Risk Assessments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-blue mr-3">✓</span>
                    <span>Method Statements</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-brand-black text-brand-white rounded-lg">
              <h3 className="font-semibold mb-2">£10 Million Public Liability Insurance</h3>
              <p className="text-gray-300">
                Full coverage for all scaffolding operations with comprehensive protection for
                clients and third parties.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Schema service={service} org={org} faqs={faqs} />
    </>
  );
}
