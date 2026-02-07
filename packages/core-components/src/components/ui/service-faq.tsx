interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceFAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
}

export function ServiceFAQ({
  items,
  title = "Scaffolding FAQ - Your Questions Answered",
  description = "Get answers to common questions about our services and processes.",
}: ServiceFAQProps) {
  return (
    <section className="section-standard bg-gray-50">
      <div className="container-standard">
        <div className="section-header">
          <h2 className="heading-section">{title}</h2>
          {description && <p className="text-body-lg">{description}</p>}
        </div>

        <div className="space-y-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  Q
                </span>
                {item.question}
              </h3>
              <div className="ml-9">
                <p className="text-gray-800 leading-relaxed">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-800 mb-4">Still have questions?</p>
          <a href="tel:01424466661" className="btn-primary gap-2">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call Us: 01424 466661
          </a>
        </div>
      </div>
    </section>
  );
}
