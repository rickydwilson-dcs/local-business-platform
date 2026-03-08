"use client";

import { useState } from "react";

interface FAQAccordionItemProps {
  question: string;
  answer: string;
  index: number;
  isLocationVariant: boolean;
}

export function FAQAccordionItem({ question, answer, index, isLocationVariant }: FAQAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `faq-answer-${index}`;
  const buttonId = `faq-question-${index}`;

  return (
    <div
      className={`${isLocationVariant ? "bg-surface-subtle" : "bg-surface-background"} border border-surface-border rounded-2xl shadow-sm hover:shadow-md transition-shadow`}
    >
      <button
        id={buttonId}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full text-left p-6 flex items-start gap-3 cursor-pointer"
      >
        <span className="flex-shrink-0 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center text-brand-on-primary text-sm font-bold">
          Q
        </span>
        <span className="text-lg font-semibold text-surface-foreground flex-1">{question}</span>
        <svg
          className={`w-5 h-5 text-surface-muted-foreground flex-shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-6 pb-6 ml-9">
          <p className="text-surface-foreground leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
