import { Metadata } from "next";
import Schema from "@/components/Schema";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Areas | Colossus Scaffolding",
  description:
    "Check if we cover your town or project site. Colossus Scaffolding operates across the South East UK.",
};

export default function ContactAreasPage() {
  const breadcrumbItems = [
    { name: "Contact", href: "/contact" },
    { name: "Areas", href: "/contact/areas", current: true },
  ];

  const service = {
    id: "/contact/areas#service",
    url: "/contact/areas",
    name: "Contact Us About Coverage",
    description:
      "Confirm scaffolding coverage for your town or project site across the South East UK.",
    serviceType: "Coverage Contact",
    areaServed: ["South East UK"],
  };

  const org = { name: "Colossus Scaffolding", url: "/", logo: "/static/logo.png" };

  const faqs = [
    {
      question: "Do you cover all towns in the South East?",
      answer:
        "Yes — we serve East Sussex, West Sussex, Kent, and Surrey. Contact us to confirm your location.",
    },
    {
      question: "Can you travel outside the South East?",
      answer:
        "For larger projects we can consider locations outside the region. Share details and we'll advise.",
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us About Coverage</h1>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-gray-600">
              Not sure if we cover your area? Get in touch and we&apos;ll confirm availability and
              timelines for your location.
            </p>

            <hr className="my-8" />

            <h2>Typical Areas We Serve</h2>
            <ul>
              <li>
                East Sussex (Hastings, St Leonards on Sea, Bexhill, Eastbourne, Rye, Lewes,
                Uckfield, Hailsham, Newhaven, Seaford)
              </li>
              <li>West Sussex</li>
              <li>Kent</li>
              <li>Surrey</li>
            </ul>

            <hr className="my-8" />
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📞 Phone</h3>
                <p className="text-lg text-brand-blue font-semibold">
                  <a href="tel:01424466661" className="hover:underline">
                    01424 466 661
                  </a>
                </p>
                <p className="text-sm text-gray-600">
                  Mon-Fri: 7:30am - 6:00pm
                  <br />
                  Sat: 8:00am - 4:00pm
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📧 Email</h3>
                <p className="text-brand-blue">
                  <a href="mailto:info@colossusscaffolding.com" className="hover:underline">
                    info@colossusscaffolding.com
                  </a>
                </p>
                <p className="text-sm text-gray-600">We respond within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Schema service={service} org={org} faqs={faqs} />
    </>
  );
}
