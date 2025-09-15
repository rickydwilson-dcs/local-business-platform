interface FAQItem {
  question: string;
  answer: string;
}

interface LocationFAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
  location: string;
}

export function LocationFAQ({ 
  items, 
  title = "Frequently Asked Questions",
  description,
  location
}: LocationFAQProps) {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="mx-auto w-full lg:w-[90%]">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {title} About Scaffolding in {location}
            </h2>
            {description && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          
          <div className="space-y-6">
            {items.map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                    Q
                  </span>
                  {item.question}
                </h3>
                <div className="ml-9">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 p-8 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              More Questions About Scaffolding in {location}?
            </h3>
            <p className="text-gray-600 mb-6">
              Our local team knows {location} regulations and requirements inside out. Get expert advice for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
              >
                Get Expert Advice
              </a>
              <a
                href="tel:01424466661"
                className="inline-flex items-center gap-2 px-6 py-3 border border-brand-blue text-brand-blue font-semibold rounded-lg hover:bg-brand-blue hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call: 01424 466661
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}