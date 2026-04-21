'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AccentUnderline } from '@platform/core-components';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'How do you calculate your pricing?',
    answer:
      'We base pricing on hourly labour rates (£45-65/hour for standard work) plus materials. Complex jobs are quoted based on time and complexity. We always provide a detailed estimate before starting work.',
  },
  {
    question: 'Do you offer free quotes?',
    answer:
      "Yes! We provide free, no-obligation quotes for all electrical work. Contact us with details of your project, and we'll arrange a convenient time to discuss your requirements.",
  },
  {
    question: 'What is included in the emergency callout fee?',
    answer:
      'The £100 emergency callout fee includes up to 2 hours of labour to diagnose and address the issue. If additional work is needed beyond 2 hours, we charge standard hourly rates for the extra time.',
  },
  {
    question: 'Do you charge for site visits or surveys?',
    answer:
      "No, site visits and surveys are completely free. We want to understand your project properly before providing an accurate quote. There's no obligation if you decide not to proceed.",
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept bank transfers, card payments, and cash. For larger projects, we can arrange staged payments aligned with project milestones.',
  },
  {
    question: 'Are your prices inclusive of VAT?',
    answer:
      "All prices shown are exclusive of VAT at the current rate. We'll provide a full breakdown including VAT in your detailed quote.",
  },
];

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-surface-border rounded-lg overflow-hidden hover:border-brand-primary transition-colors">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-surface-subtle transition-colors text-left"
        aria-expanded={isOpen}
      >
        <h3 className="font-semibold text-surface-foreground pr-4">{item.question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-brand-primary flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-6 text-surface-muted-foreground border-t border-surface-border">
          <p className="leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export function PricingPageClient() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <section className="section-standard">
      <div className="container-standard">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4 text-center">
            Frequent Questions by <AccentUnderline as="span">Customers</AccentUnderline>
          </h2>
          <p className="text-center text-surface-muted-foreground mb-12">
            Find answers to common questions about our pricing, quotes, and payment options.
          </p>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <FAQAccordionItem
                key={index}
                item={item}
                isOpen={expandedFAQ === index}
                onToggle={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
