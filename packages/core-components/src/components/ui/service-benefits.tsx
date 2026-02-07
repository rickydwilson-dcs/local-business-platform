interface ServiceBenefitsProps {
  items: string[];
  title?: string;
  description?: string;
}

export function ServiceBenefits({
  items,
  title = "Why Choose Our Scaffolding Services",
  description,
}: ServiceBenefitsProps) {
  return (
    <section className="section-standard bg-gray-50">
      <div className="container-standard">
        <div className="mx-auto w-full lg:w-[90%] text-center mb-12">
          <h2 className="heading-section">{title}</h2>
          {description && <p className="text-body-lg">{description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto w-full lg:w-[90%]">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex-shrink-0 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-900 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
