export function FaqAccordion({
  items,
  title = 'Frequently Asked Questions',
}: {
  items: Array<{ question: string; answer: string }>;
  title?: string;
}) {
  return (
    <section className="py-16 sm:py-24 bg-[#080807] border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">
            {title}
          </h2>
          <div className="w-20 h-1.5 bg-brand-primary mb-12" />
          <div className="space-y-4">
            {items.map((faq) => (
              <details
                key={faq.question}
                className="group bg-surface-card border border-surface-card-border hover:border-brand-primary transition-all p-6"
              >
                <summary className="flex items-center justify-between cursor-pointer font-heading font-bold uppercase tracking-tight text-lg list-none">
                  {faq.question}
                  <span className="material-symbols-outlined text-brand-primary transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <p className="text-white/70 mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
