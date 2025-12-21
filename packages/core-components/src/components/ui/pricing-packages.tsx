import Link from "next/link";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPackage {
  name: string;
  description: string;
  price: string;
  duration: string;
  badge?: string;
  features: PricingFeature[];
  ctaText: string;
  ctaUrl: string;
  popular?: boolean;
}

interface PricingPackagesProps {
  title: string;
  description?: string;
  packages: PricingPackage[];
  location?: string;
}

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 mr-1"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 text-brand-primary mr-2 mt-0.5 flex-shrink-0"
  >
    <path d="M20 6 9 17l-5-5"></path>
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 mr-2"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

export function PricingPackages({ title, description, packages, location }: PricingPackagesProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="text-center mb-12">
          <h2 className="heading-section">{title}</h2>
          {description && <p className="text-lg text-gray-800 max-w-2xl mx-auto">{description}</p>}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-xl border shadow-sm py-6 flex flex-col ${
                pkg.popular ? "ring-2 ring-brand-primary" : "border-gray-200"
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-brand-primary text-white">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Package Header */}
              <div className="px-6 pb-4 text-center">
                <div className="font-semibold text-xl text-gray-900 mb-2">{pkg.name}</div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-brand-primary">{pkg.price}</span>
                  <div className="flex items-center justify-center mt-2 text-sm text-gray-800">
                    <ClockIcon />
                    {pkg.duration}
                  </div>
                </div>
              </div>

              {/* Package Content */}
              <div className="px-6 pt-0 flex-1 flex flex-col">
                <p className="text-sm text-gray-800 mb-6">{pkg.description}</p>

                {/* Features List */}
                <ul className="space-y-3 mb-6 flex-1">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm">
                      <CheckIcon />
                      <span className="text-gray-900">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={pkg.ctaUrl}
                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 w-full ${
                    pkg.popular
                      ? "bg-brand-primary text-white hover:bg-brand-primary-hover"
                      : "border bg-white shadow-xs hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  {pkg.ctaText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Quote?</h3>
            <p className="text-gray-800 mb-6 text-lg">
              Every {location || ""} project is unique. Get a detailed, no-obligation quote tailored
              to your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary gap-2 h-9 px-8">
                Request Detailed Quote
              </Link>
              <Link href="tel:01424466661" className="btn-ghost gap-2 h-9 px-8">
                <PhoneIcon />
                Call 01424 466661
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
