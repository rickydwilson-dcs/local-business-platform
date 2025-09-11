interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceFAQProps {
  items: FAQItem[];
  title?: string;
}

export function ServiceFAQ({ items, title = "Frequently Asked Questions" }: ServiceFAQProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12 text-center">
            {title}
          </h2>
          <div className="space-y-6">
            {items.map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-serif font-semibold text-gray-900 mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
