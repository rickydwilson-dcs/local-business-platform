interface ServiceBenefitsProps {
  items: string[];
  title?: string;
}

export function ServiceBenefits({ items, title = "Why Choose Our Service?" }: ServiceBenefitsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-900">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
